import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
<<<<<<< HEAD
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'
=======
import { Line, Bar } from 'react-chartjs-2'
>>>>>>> 19a42a9b4836835dd5a026ca06a887d8bf8cca8d
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
<<<<<<< HEAD
  ArcElement,
=======
>>>>>>> 19a42a9b4836835dd5a026ca06a887d8bf8cca8d
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
<<<<<<< HEAD
import { Chart } from 'react-chartjs-2'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
=======
>>>>>>> 19a42a9b4836835dd5a026ca06a887d8bf8cca8d

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
<<<<<<< HEAD
  ArcElement,
=======
>>>>>>> 19a42a9b4836835dd5a026ca06a887d8bf8cca8d
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

<<<<<<< HEAD
  const [salesDistributionData, setSalesDistributionData] = useState({
    labels: ['Printing', 'Copying', 'Stationery Sale'],
    datasets: [
      {
        label: 'Sales Distribution',
        data: [/* Printing Sales Count or Revenue */, /* Copying Sales */, /* Stationery Sale */],
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 1,
      },
    ],
  })

  const [topItemsData, setTopItemsData] = useState({
    labels: ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'],
    datasets: [
      {
        label: 'Quantity Sold',
        data: [/* Quantities */],
        backgroundColor: '#10b981',
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  })

  const [paymentTypesData, setPaymentTypesData] = useState({
    labels: ['Cash', 'Card', 'Bank Transfer'],
    datasets: [
      {
        label: 'Payment Types',
        data: [/* Cash Count */, /* Card Count */, /* Bank Transfer Count */],
        backgroundColor: ['#f59e0b', '#ef4444', '#10b981'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 1,
      },
    ],
  })

  const [averageTransaction, setAverageTransaction] = useState(0)

  const [profitMarginsData, setProfitMarginsData] = useState({
    labels: ['Printing', 'Copying', 'Stationery Sale'],
    datasets: [
      {
        label: 'Profit Margin (%)',
        data: [/* Printing Margin */, /* Copying Margin */, /* Stationery Sale Margin */],
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 1,
      },
    ],
  })

  const [monthlyTrendsData, setMonthlyTrendsData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        type: 'bar',
        label: 'Sales',
        data: [/* Monthly Sales */],
        backgroundColor: '#3b82f6',
      },
      {
        type: 'line',
        label: 'Profit',
        data: [/* Monthly Profit */],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
      },
    ],
  })

  const [inventoryTurnover, setInventoryTurnover] = useState(0)

  const [dailySalesData, setDailySalesData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Sales',
        data: [/* Daily Sales Figures */],
        fill: false,
        borderColor: '#ef4444',
        tension: 0.1,
      },
    ],
  })

  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 6)))
  const [endDate, setEndDate] = useState(new Date())

  const [sales, setSales] = useState([])
  const [inventoryItems, setInventoryItems] = useState([])

  useEffect(() => {
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.total_amount, 0)
    const totalTransactions = sales.length
    const average = totalTransactions ? (totalRevenue / totalTransactions).toFixed(2) : 0
    setAverageTransaction(average)
  }, [sales])

=======
>>>>>>> 19a42a9b4836835dd5a026ca06a887d8bf8cca8d
  useEffect(() => {
    const profit = profitLossData.datasets[0].data.reduce((acc, curr) => acc + curr, 0)
    setTotalProfit(profit)
  }, [profitLossData])

<<<<<<< HEAD
  useEffect(() => {
    // Assuming you have access to Cost of Goods Sold (COGS) and Average Inventory
    const cogs = sales.reduce((acc, sale) => 
      acc + sale.items_sold.reduce((sum, item) => 
        sum + (item.quantity * item.unit_price), 0
      ), 0
    )

    // Calculate average inventory (beginning + ending)/2
    const beginningInventoryValue = inventoryItems.reduce((acc, item) => 
      acc + (item.beginning_quantity * item.unit_cost), 0
    )
    
    const endingInventoryValue = inventoryItems.reduce((acc, item) => 
      acc + (item.quantity * item.unit_cost), 0
    )
    
    const averageInventory = (beginningInventoryValue + endingInventoryValue) / 2

    const turnover = averageInventory ? (cogs / averageInventory).toFixed(2) : 0
    setInventoryTurnover(turnover)
  }, [sales, inventoryItems])

=======
>>>>>>> 19a42a9b4836835dd5a026ca06a887d8bf8cca8d
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

<<<<<<< HEAD
  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text("Sales Distribution Report", 14, 16)
    // Add charts or tables as needed
    doc.save("report.pdf")
  }

  const exportToCSV = () => {
    const sections = [
      // Profit/Loss Section
      ['Profit/Loss Report'],
      ['Month,' + profitLossData.labels.join(',')],
      ['Amount,' + profitLossData.datasets[0].data.join(',')],
      [''],

      // Revenue Trends Section
      ['Revenue Trends'],
      ['Day,' + revenueTrendData.labels.join(',')],
      ['Amount,' + revenueTrendData.datasets[0].data.join(',')],
      [''],

      // Sales Distribution Section
      ['Sales Distribution by Service Type'],
      ['Service Type,' + salesDistributionData.labels.join(',')],
      ['Amount,' + salesDistributionData.datasets[0].data.join(',')],
      [''],

      // Summary Section
      ['Summary Metrics'],
      ['Metric,Value'],
      [`Total Profit/Loss,${totalProfit.toFixed(2)}`],
      [`Average Transaction,${averageTransaction}`],
      [`Inventory Turnover,${inventoryTurnover}`],
    ]

    const csv = sections.map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    if (link.download !== undefined) { 
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `detailed_report_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.created_at)
    return saleDate >= startDate && saleDate <= endDate
  })

=======
>>>>>>> 19a42a9b4836835dd5a026ca06a887d8bf8cca8d
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
<<<<<<< HEAD
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Sales Distribution by Service Type</h2>
              <Pie data={salesDistributionData} options={chartOptions} />
            </div>
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Top Selling Stationery Items</h2>
              <Bar 
                data={topItemsData} 
                options={{
                  ...chartOptions,
                  indexAxis: 'y'
                }} 
              />
            </div>
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Payment Types Distribution</h2>
              <Doughnut data={paymentTypesData} options={chartOptions} />
            </div>
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Profit Margins by Service Type</h2>
              <Bar data={profitMarginsData} options={chartOptions} />
            </div>
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Monthly Sales and Profit Trends</h2>
              <Chart type='bar' data={monthlyTrendsData} options={chartOptions} />
            </div>
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Daily Sales Performance</h2>
              <Line data={dailySalesData} options={chartOptions} />
            </div>
=======
>>>>>>> 19a42a9b4836835dd5a026ca06a887d8bf8cca8d
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
<<<<<<< HEAD
          <div className="mt-8 bg-secondary p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Average Transaction Value</h2>
            <p className="text-3xl font-bold text-center text-foreground">
              ${averageTransaction}
            </p>
          </div>
          <div className="mt-8 bg-secondary p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Inventory Turnover Rate</h2>
            <p className="text-3xl font-bold text-center text-foreground">
              {inventoryTurnover}x
            </p>
          </div>
          <div className="flex justify-end mb-4">
            <button onClick={exportToPDF} className="mr-2 px-4 py-2 bg-red-500 text-white rounded">Export as PDF</button>
            <button onClick={exportToCSV} className="px-4 py-2 bg-green-500 text-white rounded">Export as CSV</button>
          </div>
          <div className="flex space-x-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="p-2 rounded-md bg-primary text-foreground border border-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="p-2 rounded-md bg-primary text-foreground border border-gray-700" />
            </div>
          </div>
=======
>>>>>>> 19a42a9b4836835dd5a026ca06a887d8bf8cca8d
        </main>
      </div>
      <Footer />
    </div>
  )
}