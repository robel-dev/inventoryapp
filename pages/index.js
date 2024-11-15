import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Welcome to your Printer and Stationery Shop Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardWidget title="Total Sales" value="$12,345" icon="💰" />
            <DashboardWidget title="Inventory Value" value="$54,321" icon="📦" />
            <DashboardWidget title="Recent Expenses" value="$2,468" icon="💸" />
            <DashboardWidget title="Low Stock" value="3 items" icon="⚠️" />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

function DashboardWidget({ title, value, icon }) {
  return (
    <div className="bg-secondary p-6 rounded-lg shadow-md transition-transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-accent">{value}</p>
    </div>
  )
}