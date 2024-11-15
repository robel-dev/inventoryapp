import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link href="/" className="hover:text-gray-300">Dashboard</Link></li>
        <li><Link href="/inventory" className="hover:text-gray-300">Inventory</Link></li>
        <li><Link href="/sales" className="hover:text-gray-300">Sales</Link></li>
        <li><Link href="/expenses" className="hover:text-gray-300">Expenses</Link></li>
      </ul>
    </nav>
  )
}