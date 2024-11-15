import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Welcome to the Printer and Stationery Shop App</h1>
          <p>This is your dashboard. You can add widgets and summaries here.</p>
        </main>
      </div>
      <Footer />
    </div>
  )
}