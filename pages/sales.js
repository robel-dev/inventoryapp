import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import AddSaleModal from '../components/modals/AddSaleModal'
import SalesSummary from '../components/SalesSummary'

export default function Sales() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inventoryItems, setInventoryItems] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchSales()
    fetchInventoryItems()

    // Set up real-time subscription for sales updates
    const salesChannel = supabase
      .channel('sales-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales'
        },
        (payload) => {
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            // Fetch fresh data to ensure consistency
            fetchSales()
            fetchInventoryItems()
          }
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(salesChannel)
    }
  }, [])

  async function fetchSales() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSales(data)
    } catch (err) {
      setError('Error fetching sales: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchInventoryItems() {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name')

      if (error) throw error
      setInventoryItems(data)
    } catch (err) {
      setError('Error fetching inventory: ' + err.message)
    }
  }

  async function handleCompleteSale(saleData) {
    try {
      // Set submitting state to true at the start
      setIsSubmitting(true)
      
      // Get current dates
      const today = new Date().toISOString().split('T')[0]
      const weekStart = getWeekStart()
      const monthDate = new Date().toISOString().slice(0, 7) + '-01'

      // Update inventory first and check stock
      for (const item of saleData.items_sold) {
        // First get current quantity
        const { data: inventoryItem, error: fetchError } = await supabase
          .from('inventory_items')
          .select('quantity')
          .eq('id', item.id)
          .single()

        if (fetchError) throw fetchError

        // Check if enough stock
        if (inventoryItem.quantity < item.quantity) {
          throw new Error(`Not enough stock for ${item.name}. Only ${inventoryItem.quantity} available.`)
        }

        // Update inventory with new quantity
        const newQuantity = inventoryItem.quantity - item.quantity
        const { error: updateError } = await supabase
          .from('inventory_items')
          .update({ quantity: newQuantity })
          .eq('id', item.id)

        if (updateError) throw updateError
      }

      // Create the sale record with correct date fields
      const { error: saleError } = await supabase
        .from('sales')
        .insert([{
          ...saleData,
          created_at: new Date().toISOString(),
          week_start_date: weekStart,
          month_date: monthDate
        }])

      if (saleError) throw saleError

      // Update summaries
      await updateSummary('daily_sales_summary', 'date', today, saleData)
      await updateSummary('weekly_sales_summary', 'week_start_date', weekStart, saleData)
      await updateSummary('monthly_sales_summary', 'month_date', monthDate, saleData)

      // Refresh data
      await fetchSales()
      await fetchInventoryItems()

      // Close modal and show success
      setIsModalOpen(false)
      alert('Sale completed successfully!')

    } catch (error) {
      setError('Error completing sale: ' + error.message)
    } finally {
      // Reset submitting state when done
      setIsSubmitting(false)
    }
  }

  async function updateSummary(table, dateField, dateValue, saleData) {
    let summaryData = {
      [dateField]: dateValue,
      total_sales: 0,
      total_transactions: 0,
      popular_items: []
    }

    // Handle weekly summary specifics
    if (table === 'weekly_sales_summary') {
      const weekEndDate = getWeekEndDate(dateValue)
      summaryData = {
        ...summaryData,
        week_start_date: dateValue,
        week_end_date: weekEndDate,
        week_number: getWeekNumber(dateValue)
      }
    } else if (table === 'monthly_sales_summary') {
      summaryData = {
        ...summaryData,
        month_date: dateValue,
        end_date: getMonthEndDate(dateValue),
        month_name: new Date(dateValue).toLocaleString('default', { month: 'long' })
      }
    }

    // Get existing summary or create new one
    const { data, error: fetchError } = await supabase
      .from(table)
      .select('*')
      .eq(dateField, dateValue)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

    const currentSummary = data || summaryData

    const updatedSummary = {
      ...currentSummary,
      total_sales: currentSummary.total_sales + saleData.total_amount,
      total_transactions: currentSummary.total_transactions + 1,
      popular_items: updatePopularItems(currentSummary.popular_items, saleData.items_sold)
    }

    const { error: updateError } = await supabase
      .from(table)
      .upsert(updatedSummary)

    if (updateError) throw updateError
  }

  function updatePopularItems(currentPopular = [], newItems) {
    const itemMap = new Map()
    
    currentPopular.forEach(item => {
      itemMap.set(item.id, item)
    })

    newItems.forEach(item => {
      if (itemMap.has(item.id)) {
        const current = itemMap.get(item.id)
        itemMap.set(item.id, {
          ...current,
          quantity: current.quantity + item.quantity
        })
      } else {
        itemMap.set(item.id, {
          id: item.id,
          name: item.name,
          quantity: item.quantity
        })
      }
    })

    return Array.from(itemMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  }

  function getWeekStart() {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek
    const weekStart = new Date(now.setDate(diff))
    weekStart.setHours(0, 0, 0, 0)
    return weekStart.toISOString().split('T')[0]
  }

  function getWeekEndDate(weekStartDate) {
    const weekStart = new Date(weekStartDate)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    return weekEnd.toISOString().split('T')[0]
  }

  function getWeekNumber(dateString) {
    const date = new Date(dateString)
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
    const week1 = new Date(date.getFullYear(), 0, 4)
    return 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
  }

  function getMonthEndDate(monthStart) {
    const date = new Date(monthStart)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return lastDay.toISOString().split('T')[0]
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
              {error}
              <button onClick={() => setError(null)} className="float-right">×</button>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Sales</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-accent hover:bg-accent/80 text-white font-bold py-2 px-4 rounded"
            >
              New Sale
            </button>
          </div>

          {/* Sales Summary with key prop for forcing refresh */}
          <div className="mb-8">
            <SalesSummary key={sales.length} />
          </div>

          {/* Recent Sales List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div className="bg-secondary rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale.id} className="bg-primary p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{sale.service_type}</h3>
                        <p className="text-sm text-gray-400">
                          {new Date(sale.created_at).toLocaleString()}
                        </p>
                        <div className="mt-2">
                          {sale.items_sold.map((item, index) => (
                            <p key={index} className="text-sm text-gray-300">
                              {item.name} × {item.quantity}
                            </p>
                          ))}
                        </div>
                      </div>
                      <p className="text-lg font-medium">
                        {formatCurrency(sale.total_amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />

      {isModalOpen && (
        <AddSaleModal
          closeModal={() => setIsModalOpen(false)}
          onSubmit={handleCompleteSale}
          inventoryItems={inventoryItems}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}