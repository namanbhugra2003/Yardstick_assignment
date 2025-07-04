import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Budgets from "./pages/Budgets"

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
