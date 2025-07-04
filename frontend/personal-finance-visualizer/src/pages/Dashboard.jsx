import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/transactions")
        const data = await res.json()
        setTransactions(data)
      } catch (err) {
        console.error("Failed to fetch transactions", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const categoryData = Object.values(
    transactions.reduce((acc, tx) => {
      const cat = tx.category || "Other"
      acc[cat] = acc[cat] || { name: cat, value: 0 }
      acc[cat].value += Number(tx.amount || 0)
      return acc
    }, {})
  )

  const totalExpenses = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0)
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const COLORS = ["#00509E", "#2E865F", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-4xl font-semibold text-gray-900 mb-8">📊 Dashboard</h2>

      {loading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card title="Total Expenses" value={`₹${totalExpenses.toFixed(2)}`} color="red" />
            <Card title="Categories" value={categoryData.length} color="blue" />
            <Card title="Recent Transactions" value={recent.length} color="green" />
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-all mb-8">
            <h3 className="text-2xl font-medium text-gray-800 mb-4">Category-wise Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={120} label>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-all">
            <h3 className="text-2xl font-medium text-gray-800 mb-4">Recent Transactions</h3>
            <ul className="divide-y">
              {recent.length === 0 ? (
                <li className="text-gray-500">No recent transactions.</li>
              ) : (
                recent.map((t, i) => (
                  <li
                    key={i}
                    className="flex justify-between py-3 hover:scale-[1.02] transition-transform"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{t.title || "Untitled"}</p>
                      <p className="text-sm text-gray-500">
                        {t.category || "Uncategorized"} •{" "}
                        {t.date ? new Date(t.date).toLocaleDateString() : "No date"}
                      </p>
                    </div>
                    <span className="text-red-500 font-semibold">
                      ₹{Number(t.amount || 0).toFixed(2)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

const Card = ({ title, value, color }) => {
  const colors = {
    red: "text-red-600",
    blue: "text-blue-600",
    green: "text-green-600",
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-all hover:scale-[1.03]">
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className={`text-3xl font-semibold ${colors[color]}`}>{value}</p>
    </div>
  )
}

export default Dashboard
