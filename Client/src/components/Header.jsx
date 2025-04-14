// client/src/components/Header.jsx
import { Menu } from 'lucide-react'

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Mobile menu button */}
      <button
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="text-sm text-gray-600">Welcome, User</div>
    </header>
  )
}
