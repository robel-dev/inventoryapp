import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Reports() {
  const [profitLossData, setProfitLossData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Profit/Loss',
        data: [1000, 1500, -500, 2000, 2500, 1800],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
    ],
  })

  const [revenueTrendData, setRevenueTrendData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4000],
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.1,
      },
    ],
  })

  const [totalProfit, setTotalProfit] = useState(0)

  useEffect(() => {
    const profit = profitLossData.datasets[0].data.reduce((acc, curr) => acc + curr, 0)
    setTotalProfit(profit)
  }, [profitLossData])

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#ededed'
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(237, 237, 237, 0.1)'
        },
        ticks: {
          color: '#ededed'
        }
      },
      x: {
        grid: {
          color: 'rgba(237, 237, 237, 0.1)'
        },
        ticks: {
          color: '#ededed'
        }
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Reports</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Profit and Loss Report</h2>
              <Bar data={profitLossData} options={chartOptions} />
            </div>
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Revenue Trends</h2>
              <Line data={revenueTrendData} options={chartOptions} />
            </div>
          </div>
          <div className="mt-8 bg-secondary p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Total Profit/Loss</h2>
            <p className="text-3xl font-bold text-center text-foreground">
              ${totalProfit.toFixed(2)}
              <span className={`text-sm ml-2 ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalProfit >= 0 ? '(Profit)' : '(Loss)'}
              </span>
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}