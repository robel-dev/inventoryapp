import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Welcome to your Printer and Stationery Shop Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardWidget title="Total Sales" value="$0" />
            <DashboardWidget title="Inventory Value" value="$0" />
            <DashboardWidget title="Recent Expenses" value="$0" />
            <DashboardWidget title="Low Stock" value="None" />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}


function DashboardWidget({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  )
}