import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

export default function Expenses() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Expenses</h1>
          <p>Track and manage your expenses here.</p>
        </main>
      </div>
      <Footer />
    </div>
  )
}