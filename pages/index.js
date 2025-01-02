import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import SalesSummary from '../components/SalesSummary'
import { useState, useEffect } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'
import { formatCurrency } from '../lib/utils'

// In your component:

export default function Home() {
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    inventoryValue: 0,
    recentExpenses: 0,
    lowStockCount: 0,
    lowStockItems: []
  })

  useEffect(() => {
    fetchDashboardData()

    // Set up real-time subscription
    const supabase = getSupabaseClient()
    if (!supabase) return

    const subscription = supabase
      .channel('dashboard_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sales' },
        () => fetchDashboardData()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'inventory_items' },
        () => fetchDashboardData()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchDashboardData() {
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      // Get total sales for today
      const today = new Date().toISOString().split('T')[0]
      const { data: salesData } = await supabase
        .from('daily_sales_summary')
        .select('total_sales')
        .eq('date', today)
        .single()

      // Get inventory value and low stock items
      const { data: inventoryData } = await supabase
        .from('inventory_items')
        .select('*')

      const inventoryValue = inventoryData?.reduce(
        (sum, item) => sum + (item.quantity * item.unit_price),
        0
      ) || 0

      const lowStockItems = inventoryData?.filter(
        item => item.quantity <= item.reorder_level
      ) || []

      setDashboardData({
        totalSales: salesData?.total_sales || 0,
        inventoryValue,
        recentExpenses: 0, // You'll need to implement expenses tracking
        lowStockCount: lowStockItems.length,
        lowStockItems
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8 text-foreground">
            Welcome to your Printer and Stationery Shop Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardWidget 
              title="Today's Sales" 
              value={formatCurrency(dashboardData.totalSales)} 
              icon="💰" 
            />
            <DashboardWidget 
              title="Inventory Value" 
              value={formatCurrency(dashboardData.inventoryValue)} 
              icon="📦" 
            />
            <DashboardWidget 
              title="Recent Expenses" 
              value={formatCurrency(dashboardData.recentExpenses)} 
              icon="💸" 
            />
            <DashboardWidget 
              title="Low Stock" 
              value={`${dashboardData.lowStockCount} items`} 
              icon="⚠️"
              items={dashboardData.lowStockItems}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

function DashboardWidget({ title, value, icon, items }) {
  return (
    <div className="bg-secondary p-6 rounded-lg shadow-md transition-transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-accent">{value}</p>
      {items && items.length > 0 && (
        <div className="mt-4 text-sm text-gray-400">
          {items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span>{item.quantity} left</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}