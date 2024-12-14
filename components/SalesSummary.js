import { useState, useEffect, useCallback } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'

export default function SalesSummary() {
  const [summaries, setSummaries] = useState({
    daily: { total_sales: 0, total_transactions: 0 },
    weekly: { total_sales: 0, total_transactions: 0 },
    monthly: { total_sales: 0, total_transactions: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSummaries = useCallback(async () => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Unable to connect to database')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      const weekStart = getWeekStart()
      const monthDate = new Date().toISOString().slice(0, 7) + '-01'

      // Fetch daily summary
      const { data: dailyData, error: dailyError } = await supabase
        .from('daily_sales_summary')
        .select('*')
        .eq('date', today)
        .single()

      if (dailyError && dailyError.code !== 'PGRST116') throw dailyError

      // Fetch weekly summary
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('weekly_sales_summary')
        .select('*')
        .eq('week_start_date', weekStart)
        .single()

      if (weeklyError && weeklyError.code !== 'PGRST116') throw weeklyError

      // Fetch monthly summary
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('monthly_sales_summary')
        .select('*')
        .eq('month_date', monthDate)
        .single()

      if (monthlyError && monthlyError.code !== 'PGRST116') throw monthlyError

      setSummaries({
        daily: dailyData || { total_sales: 0, total_transactions: 0 },
        weekly: weeklyData || { total_sales: 0, total_transactions: 0 },
        monthly: monthlyData || { total_sales: 0, total_transactions: 0 }
      })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Unable to connect to database')
      setLoading(false)
      return
    }

    fetchSummaries()

    // Set up real-time subscription for summary updates
    const summaryChannel = supabase
      .channel('summary-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales'
        },
        () => {
          fetchSummaries()
        }
      )
      .subscribe()

    // Cleanup subscription
    return () => {
      if (supabase) {
        supabase.removeChannel(summaryChannel)
      }
    }
  }, [fetchSummaries])

  function getWeekStart() {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek
    const weekStart = new Date(now.setDate(diff))
    weekStart.setHours(0, 0, 0, 0)
    return weekStart.toISOString().split('T')[0]
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return <div>Loading summaries...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Daily Summary */}
      <div className="bg-secondary p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Today&apos;s Sales</h3>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-accent">
            {formatCurrency(summaries.daily.total_sales)}
          </p>
          <p className="text-sm text-gray-400">
            {summaries.daily.total_transactions} transactions
          </p>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-secondary p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">This Week&apos;s Sales</h3>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-accent">
            {formatCurrency(summaries.weekly.total_sales)}
          </p>
          <p className="text-sm text-gray-400">
            {summaries.weekly.total_transactions} transactions
          </p>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-secondary p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">This Month&apos;s Sales</h3>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-accent">
            {formatCurrency(summaries.monthly.total_sales)}
          </p>
          <p className="text-sm text-gray-400">
            {summaries.monthly.total_transactions} transactions
          </p>
        </div>
      </div>

      {error && (
        <div className="col-span-3 bg-red-500 text-white p-3 rounded-lg">
          Error loading summaries: {error}
        </div>
      )}
    </div>
  )
}