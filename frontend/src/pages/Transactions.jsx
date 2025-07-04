import { useState, useEffect } from "react"
import { TransactionForm } from "../components/TransactionForm"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const res = await fetch("https://yardstick-assignment-v5bv.onrender.com/api/transactions")
      const data = await res.json()
      setTransactions(data)
    } catch (err) {
      console.error("Failed to fetch transactions", err)
    }
  }

  const addTransaction = async (data) => {
    try {
      if (editData && editData._id) {
        await fetch(`https://yardstick-assignment-v5bv.onrender.com/api/transactions/${editData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      } else {
        await fetch("https://yardstick-assignment-v5bv.onrender.com/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      }

      setEditData(null)
      fetchTransactions()
    } catch (err) {
      console.error("Error saving transaction", err)
    }
  }

  const deleteTransaction = async (id) => {
    if (!confirm("Delete this transaction?")) return
    try {
      await fetch(`https://yardstick-assignment-v5bv.onrender.com/api/transactions/${id}`, {
        method: "DELETE",
      })
      fetchTransactions()
    } catch (err) {
      console.error("Error deleting transaction", err)
    }
  }

  const startEdit = (data) => setEditData(data)

  const chartData = Object.values(
    transactions.reduce((acc, tx) => {
      const month = new Date(tx.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
      acc[month] = acc[month] || { month, total: 0 }
      acc[month].total += Number(tx.amount)
      return acc
    }, {})
  )

  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800">🧾 Transactions</h2>

      <TransactionForm
        onSubmit={addTransaction}
        editingData={editData}
        cancelEdit={() => setEditData(null)}
      />

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2 text-left">Amount</th>
                <th className="text-left">Title</th>
                <th className="text-left">Date</th>
                <th className="text-left">Category</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-b hover:bg-blue-50 transition-all">
                  <td className="py-2 text-blue-700 font-medium">₹{t.amount}</td>
                  <td>{t.title}</td> {/* ✅ Corrected from `description` */}
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.category}</td>
                  <td>
                    <button
                      onClick={() => startEdit(t)}
                      className="text-blue-500 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTransaction(t._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">📊 Monthly Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" stroke="#4b5563" />
            <YAxis stroke="#4b5563" />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Transactions
