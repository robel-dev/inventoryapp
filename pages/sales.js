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
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Sales</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Record Sale</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Service Type</label>
                  <select
                    value={newSale.serviceType}
                    onChange={(e) => setNewSale({ ...newSale, serviceType: e.target.value })}
                    className="w-full p-2 rounded-md bg-primary text-foreground border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
                    required
                  >
                    <option value="">Select a service type</option>
                    <option value="Printing">Printing</option>
                    <option value="Copying">Copying</option>
                    <option value="Stationery Sale">Stationery Sale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Items Sold</label>
                  <input
                    type="text"
                    value={newSale.itemsSold}
                    onChange={(e) => setNewSale({ ...newSale, itemsSold: e.target.value })}
                    className="w-full p-2 rounded-md bg-primary text-foreground border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Payment Type</label>
                  <select
                    value={newSale.paymentType}
                    onChange={(e) => setNewSale({ ...newSale, paymentType: e.target.value })}
                    className="w-full p-2 rounded-md bg-primary text-foreground border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
                    required
                  >
                    <option value="">Select a payment type</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Total</label>
                  <input
                    type="number"
                    value={newSale.total}
                    onChange={(e) => setNewSale({ ...newSale, total: e.target.value })}
                    className="w-full p-2 rounded-md bg-primary text-foreground border border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-md bg-accent hover:bg-accent/80 text-white font-medium transition duration-300"
                >
                  Record Sale
                </button>
              </form>
            </div>
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Transactions</h2>
              <ul className="space-y-4">
                {sales.map((sale) => (
                  <li key={sale.id} className="bg-primary p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Service</p>
                        <p className="mt-1 text-sm text-foreground">{sale.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400">Items</p>
                        <p className="mt-1 text-sm text-foreground">{sale.itemsSold}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400">Payment</p>
                        <p className="mt-1 text-sm text-foreground">{sale.paymentType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400">Total</p>
                        <p className="mt-1 text-sm text-foreground">${sale.total}</p>
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