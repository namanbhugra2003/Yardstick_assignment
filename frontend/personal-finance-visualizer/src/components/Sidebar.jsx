import { Link, useLocation } from "react-router-dom"

const Sidebar = () => {
  const { pathname } = useLocation()

  const linkClass = (path) =>
    `flex items-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200 transform ${
      pathname === path
        ? "bg-blue-600 text-white scale-[1.02]"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-[1.02]"
    }`

  return (
    <aside className="w-full md:w-64 bg-white shadow-lg h-full md:h-screen p-6 border-r border-gray-200">
      <h1 className="text-2xl font-bold text-blue-600 mb-8">💰 Finance Tracker</h1>
      <nav className="flex flex-col gap-2">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          📊 Dashboard
        </Link>
        <Link to="/transactions" className={linkClass("/transactions")}>
          📋 Transactions
        </Link>
        <Link to="/budgets" className={linkClass("/budgets")}>
          💼 Budgets
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar
