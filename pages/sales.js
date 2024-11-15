import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

export default function Sales() {
  const [sales, setSales] = useState([])
  const [newSale, setNewSale] = useState({
    serviceType: '',
    itemsSold: '',
    paymentType: '',
    total: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSales([...sales, { ...newSale, id: Date.now() }])
    setNewSale({ serviceType: '', itemsSold: '', paymentType: '', total: '' })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Sales</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Record Sale</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Type</label>
                  <select
                    value={newSale.serviceType}
                    onChange={(e) => setNewSale({ ...newSale, serviceType: e.target.value })}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select a service type</option>
                    <option value="Printing">Printing</option>
                    <option value="Copying">Copying</option>
                    <option value="Stationery Sale">Stationery Sale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Items Sold</label>
                  <input
                    type="text"
                    value={newSale.itemsSold}
                    onChange={(e) => setNewSale({ ...newSale, itemsSold: e.target.value })}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                  <select
                    value={newSale.paymentType}
                    onChange={(e) => setNewSale({ ...newSale, paymentType: e.target.value })}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select a payment type</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total</label>
                  <input
                    type="number"
                    value={newSale.total}
                    onChange={(e) => setNewSale({ ...newSale, total: e.target.value })}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Record Sale
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
              <ul className="space-y-4">
                {sales.map((sale) => (
                  <li key={sale.id} className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Service</p>
                        <p className="mt-1 text-sm text-gray-900">{sale.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Items</p>
                        <p className="mt-1 text-sm text-gray-900">{sale.itemsSold}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Payment</p>
                        <p className="mt-1 text-sm text-gray-900">{sale.paymentType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total</p>
                        <p className="mt-1 text-sm text-gray-900">${sale.total}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}