import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

export default function Sales() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inventoryItems, setInventoryItems] = useState([])
  const [newSale, setNewSale] = useState({
    service_type: '',
    items_sold: [],
    payment_type: '',
    total_amount: 0,
    selectedItem: '',
    selectedQuantity: 1
  })

  useEffect(() => {
    fetchSales()
    fetchInventoryItems()
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

//   const handleAddItem = () => {
//     const selectedInventoryItem = inventoryItems.find(
//       item => item.id === newSale.selectedItem
//     )

//     if (!selectedInventoryItem) return

//     const newItem = {
//       id: selectedInventoryItem.id,
//       name: selectedInventoryItem.name,
//       quantity: parseInt(newSale.selectedQuantity),
//       unit_price: selectedInventoryItem.unit_price,
//       subtotal: selectedInventoryItem.unit_price * parseInt(newSale.selectedQuantity)
//     }

//     setNewSale(prev => ({
//       ...prev,
//       items_sold: [...prev.items_sold, newItem],
//       total_amount: prev.total_amount + newItem.subtotal,
//       selectedItem: '',
//       selectedQuantity: 1
//     }))
//   }

const handleAddItem = async () => {
    try {
      const selectedInventoryItem = inventoryItems.find(
        item => item.id === newSale.selectedItem
      )
  
      if (!selectedInventoryItem) return
  
      // Check if quantity is available
      if (selectedInventoryItem.quantity < parseInt(newSale.selectedQuantity)) {
        setError(`Only ${selectedInventoryItem.quantity} units available for ${selectedInventoryItem.name}`)
        return
      }
  
      const newItem = {
        id: selectedInventoryItem.id,
        name: selectedInventoryItem.name,
        quantity: parseInt(newSale.selectedQuantity),
        unit_price: selectedInventoryItem.unit_price,
        subtotal: selectedInventoryItem.unit_price * parseInt(newSale.selectedQuantity)
      }
  
      setNewSale(prev => ({
        ...prev,
        items_sold: [...prev.items_sold, newItem],
        total_amount: prev.total_amount + newItem.subtotal,
        selectedItem: '',
        selectedQuantity: 1
      }))
    } catch (err) {
      setError('Error adding item: ' + err.message)
    }
  }

  const handleRemoveItem = (index) => {
    setNewSale(prev => ({
      ...prev,
      items_sold: prev.items_sold.filter((_, i) => i !== index),
      total_amount: prev.items_sold
        .filter((_, i) => i !== index)
        .reduce((sum, item) => sum + item.subtotal, 0)
    }))
  }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       // First, update inventory quantities
//       for (const item of newSale.items_sold) {
//         const { error: inventoryError } = await supabase
//           .from('inventory_items')
//           .update({ 
//             quantity: supabase.raw(`quantity - ${item.quantity}`)
//           })
//           .eq('id', item.id)

//         if (inventoryError) throw inventoryError
//       }

//       // Then create the sale record
//       const { data, error } = await supabase
//         .from('sales')
//         .insert([{
//           service_type: newSale.service_type,
//           items_sold: newSale.items_sold,
//           payment_type: newSale.payment_type,
//           total_amount: newSale.total_amount
//         }])
//         .select()

//       if (error) throw error

//       // Reset form and refresh data
//       setNewSale({
//         service_type: '',
//         items_sold: [],
//         payment_type: '',
//         total_amount: 0,
//         selectedItem: '',
//         selectedQuantity: 1
//       })
      
//       await fetchSales() // Refresh sales list
//       await fetchInventoryItems() // Refresh inventory
//     } catch (err) {
//       setError('Error creating sale: ' + err.message)
//     }
//   }

const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // First, fetch current inventory quantities and update them
      for (const item of newSale.items_sold) {
        // First get current quantity
        const { data: inventoryData, error: fetchError } = await supabase
          .from('inventory_items')
          .select('quantity')
          .eq('id', item.id)
          .single()

        if (fetchError) throw fetchError

        // Then update with new quantity
        const newQuantity = inventoryData.quantity - item.quantity
        const { error: updateError } = await supabase
          .from('inventory_items')
          .update({ quantity: newQuantity })
          .eq('id', item.id)

        if (updateError) throw updateError
      }

      // Then create the sale record
      const { data, error } = await supabase
        .from('sales')
        .insert([{
          service_type: newSale.service_type,
          items_sold: newSale.items_sold,
          payment_type: newSale.payment_type,
          total_amount: newSale.total_amount
        }])
        .select()

      if (error) throw error

      // Reset form and refresh data
      setNewSale({
        service_type: '',
        items_sold: [],
        payment_type: '',
        total_amount: 0,
        selectedItem: '',
        selectedQuantity: 1
      })
      
      await fetchSales() // Refresh sales list
      await fetchInventoryItems() // Refresh inventory
    } catch (err) {
      setError('Error creating sale: ' + err.message)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Sales</h1>
          
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
              {error}
              <button onClick={() => setError(null)} className="float-right">×</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sales Form */}
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Record Sale</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Service Type</label>
                  <select
                    value={newSale.service_type}
                    onChange={(e) => setNewSale({ ...newSale, service_type: e.target.value })}
                    className="w-full p-2 rounded-md bg-primary text-foreground border border-gray-700"
                    required
                  >
                    <option value="">Select service type</option>
                    <option value="Printing">Printing</option>
                    <option value="Copying">Copying</option>
                    <option value="Stationery Sale">Stationery Sale</option>
                  </select>
                </div>

                {/* Item Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Add Items</label>
                  <div className="flex gap-2">
                    <select
                      value={newSale.selectedItem}
                      onChange={(e) => setNewSale({ ...newSale, selectedItem: e.target.value })}
                      className="flex-1 p-2 rounded-md bg-primary text-foreground border border-gray-700"
                    >
                      <option value="">Select item</option>
                      {inventoryItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} (${item.unit_price})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={newSale.selectedQuantity}
                      onChange={(e) => setNewSale({ ...newSale, selectedQuantity: e.target.value })}
                      min="1"
                      className="w-24 p-2 rounded-md bg-primary text-foreground border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Selected Items List */}
                {newSale.items_sold.length > 0 && (
                  <div className="border border-gray-700 rounded-md overflow-hidden mt-4">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-primary">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm text-foreground">Item</th>
                          <th className="px-4 py-2 text-left text-sm text-foreground">Qty</th>
                          <th className="px-4 py-2 text-left text-sm text-foreground">Price</th>
                          <th className="px-4 py-2 text-left text-sm text-foreground">Subtotal</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {newSale.items_sold.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-foreground">{item.name}</td>
                            <td className="px-4 py-2 text-sm text-foreground">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-foreground">${item.unit_price}</td>
                            <td className="px-4 py-2 text-sm text-foreground">${item.subtotal}</td>
                            <td className="px-4 py-2 text-sm">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-500 hover:text-red-400"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Payment Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Payment Type</label>
                  <select
                    value={newSale.payment_type}
                    onChange={(e) => setNewSale({ ...newSale, payment_type: e.target.value })}
                    className="w-full p-2 rounded-md bg-primary text-foreground border border-gray-700"
                    required
                  >
                    <option value="">Select payment type</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>
                </div>

                {/* Total Amount (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Total Amount</label>
                  <input
                    type="text"
                    value={`$${newSale.total_amount}`}
                    readOnly
                    className="w-full p-2 rounded-md bg-gray-700 text-foreground border border-gray-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={newSale.items_sold.length === 0}
                  className="w-full py-2 px-4 rounded-md bg-accent hover:bg-accent/80 text-white font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Sale
                </button>
              </form>
            </div>

            {/* Recent Sales List */}
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Sales</h2>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {sales.map((sale) => (
                    <div key={sale.id} className="bg-primary p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-400">Service</p>
                          <p className="mt-1 text-sm text-foreground">{sale.service_type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400">Date</p>
                          <p className="mt-1 text-sm text-foreground">
                            {new Date(sale.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400">Payment</p>
                          <p className="mt-1 text-sm text-foreground">{sale.payment_type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400">Total</p>
                          <p className="mt-1 text-sm text-foreground">${sale.total_amount}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-400">Items</p>
                        <div className="mt-1 space-y-1">
                          {sale.items_sold.map((item, index) => (
                            <p key={index} className="text-sm text-foreground">
                              {item.name} × {item.quantity}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}