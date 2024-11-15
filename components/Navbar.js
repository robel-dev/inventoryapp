import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-nav-bg text-foreground p-4 shadow-lg">
      <ul className="flex space-x-4">
        <li><Link href="/" className="hover:text-accent transition-colors">Dashboard</Link></li>
        <li><Link href="/inventory" className="hover:text-accent transition-colors">Inventory</Link></li>
        <li><Link href="/sales" className="hover:text-accent transition-colors">Sales</Link></li>
        <li><Link href="/expenses" className="hover:text-accent transition-colors">Expenses</Link></li>
      </ul>
    </nav>
  )
}