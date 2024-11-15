import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

export default function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: 'Printer Paper', quantity: 500, category: 'Printing Supplies' },
    { id: 2, name: 'Ballpoint Pens', quantity: 100, category: 'Stationery' },
    { id: 3, name: 'Ink Cartridges', quantity: 50, category: 'Printing Supplies' },
  ])

  const openModal = (item = null) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const addOrUpdateItem = (newItem) => {
    if (editingItem) {
      setInventoryItems(inventoryItems.map(item => 
        item.id === editingItem.id ? { ...item, ...newItem } : item
      ))
    } else {
      setInventoryItems([...inventoryItems, { ...newItem, id: Date.now() }])
    }
    closeModal()
  }

  const deleteItem = (id) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
            <button
              onClick={() => openModal()}
              className="bg-accent hover:bg-accent/80 text-foreground font-bold py-2 px-4 rounded transition duration-300"
            >
              Add New Item
            </button>
          </div>
          <div className="bg-secondary rounded-lg overflow-hidden shadow-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="bg-secondary">
                    <td className="px-6 py-4 whitespace-nowrap text-foreground">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openModal(item)}
                        className="text-accent hover:text-accent/80 mr-4 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-500 hover:text-red-400 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
      {isModalOpen && (
        <AddEditItemModal closeModal={closeModal} addOrUpdateItem={addOrUpdateItem} editingItem={editingItem} />
      )}
    </div>
  )
}

function AddEditItemModal({ closeModal, addOrUpdateItem, editingItem }) {
  const [item, setItem] = useState(editingItem || { name: '', quantity: '', category: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    addOrUpdateItem(item)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <form onSubmit={handleSubmit} className="mt-2 text-left">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Item Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Item name"
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                Quantity
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="quantity"
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => setItem({ ...item, quantity: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="category"
                value={item.category}
                onChange={(e) => setItem({ ...item, category: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                <option value="Stationery">Stationery</option>
                <option value="Printing Supplies">Printing Supplies</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                type="submit"
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}