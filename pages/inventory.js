import { useState, useEffect } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'
import { handleSupabaseError, formatCurrency } from '../lib/utils'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import AddEditItemModal from '../components/modals/AddEditItemModal'

export default function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [inventoryItems, setInventoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Unable to connect to database')
      setLoading(false)
      return
    }

    fetchInventory()

    // Set up real-time subscription
    const subscription = supabase
      .channel('inventory_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'inventory_items' },
        () => fetchInventory()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchInventory() {
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setInventoryItems(data)
    } catch (error) {
      setError(handleSupabaseError(error))
    } finally {
      setLoading(false)
    }
  }

  async function handleAddItem(itemData) {
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{
          name: itemData.name,
          quantity: parseInt(itemData.quantity),
          category: itemData.category,
          unit_price: parseFloat(itemData.unit_price),
          reorder_level: parseInt(itemData.reorder_level || 10),
          remarks: itemData.remarks
        }])
        .select()

      if (error) throw error

      setInventoryItems([data[0], ...inventoryItems])
      setIsModalOpen(false)
    } catch (error) {
      setError(handleSupabaseError(error))
    }
  }

  async function handleUpdateItem(itemData) {
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update({
          name: itemData.name,
          quantity: parseInt(itemData.quantity),
          category: itemData.category,
          unit_price: parseFloat(itemData.unit_price),
          reorder_level: parseInt(itemData.reorder_level || 10),
          remarks: itemData.remarks,
          updated_at: new Date()
        })
        .eq('id', editingItem.id)
        .select()

      if (error) throw error

      setInventoryItems(inventoryItems.map(item => 
        item.id === editingItem.id ? data[0] : item
      ))
      setIsModalOpen(false)
      setEditingItem(null)
    } catch (error) {
      setError(handleSupabaseError(error))
    }
  }

  async function handleDeleteItem(id) {
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      setInventoryItems(inventoryItems.filter(item => item.id !== id))
    } catch (error) {
      setError(handleSupabaseError(error))
    }
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
            </div>
          )}
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-accent hover:bg-accent/80 text-white font-bold py-2 px-4 rounded"
            >
              Add New Item
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div className="bg-secondary rounded-lg overflow-hidden shadow-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-primary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Remarks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-secondary divide-y divide-gray-700">
                  {inventoryItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{formatCurrency(item.unit_price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{item.remarks}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingItem(item)
                            setIsModalOpen(true)
                          }}
                          className="text-accent hover:text-accent/80 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <Footer />
      
      {isModalOpen && (
        <AddEditItemModal
          closeModal={() => {
            setIsModalOpen(false)
            setEditingItem(null)
          }}
          onSubmit={editingItem ? handleUpdateItem : handleAddItem}
          editingItem={editingItem}
        />
      )}
    </div>
  )
}