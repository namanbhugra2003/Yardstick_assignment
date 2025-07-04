import { useState, useEffect } from "react"

const Budgets = () => {
  const [budgets, setBudgets] = useState({})
  const [transactions, setTransactions] = useState([])
  const [form, setForm] = useState({ category: "", amount: "" })

  useEffect(() => {
    fetchBudgets()
    fetchTransactions()
  }, [])

  const fetchBudgets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/budgets")
      const data = await res.json()
      setBudgets(data || {})
    } catch (err) {
      console.error("Failed to fetch budgets", err)
    }
  }

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/transactions")
      const data = await res.json()
      setTransactions(data)
    } catch (err) {
      console.error("Failed to fetch transactions", err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { category, amount } = form
    if (!category || !amount) return alert("Both fields required.")
    if (Number(amount) <= 0) return alert("Amount must be greater than 0.")

    try {
      await fetch("http://localhost:5000/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount }),
      })
      setForm({ category: "", amount: "" })
      fetchBudgets()
    } catch (err) {
      console.error("Failed to save budget", err)
    }
  }

  const categories = ["Food", "Transport", "Utilities", "Entertainment", "Shopping", "Other"]
  const sortedCategories = categories.sort((a, b) => (budgets[b] || 0) - (budgets[a] || 0))

  const expenseByCategory = transactions.reduce((acc, tx) => {
    const cat = tx.category || "Other"
    acc[cat] = (acc[cat] || 0) + Number(tx.amount)
    return acc
  }, {})

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-gray-800">💼 Budgets</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow border border-gray-200 space-y-4"
      >
        <h3 className="text-lg font-medium text-gray-700">Set Budget</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="p-2 border rounded-md w-full"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            placeholder="Budget Amount"
            value={form.amount}
            onChange={handleChange}
            className="p-2 border rounded-md w-full"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow">
            Save Budget
          </button>
        </div>
      </form>

      <div className="grid gap-6">
        {sortedCategories.map((cat) => {
          const spent = expenseByCategory[cat] || 0
          const budget = budgets[cat] || 0
          const percent = budget ? (spent / budget) * 100 : 0
          const cappedPercent = Math.min(percent, 100)

          let insight = "No budget set"
          let insightColor = "text-gray-500"

          if (budget > 0) {
            if (spent > budget) {
              insight = "⚠ Over budget"
              insightColor = "text-red-500"
            } else if (spent === budget) {
              insight = "✔ On budget"
              insightColor = "text-green-600"
            } else {
              insight = "🟢 Under budget"
              insightColor = "text-blue-600"
            }
          }

          return (
            <div key={cat} className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium text-gray-700">{cat}</h4>
                <p className="font-semibold text-gray-700">
                  ₹{spent.toFixed(2)} / ₹{budget.toFixed(2)}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 ${spent > budget ? "bg-red-500" : "bg-blue-500"}`}
                  style={{ width: `${cappedPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span className={`${insightColor} font-medium`}>{insight}</span>
                {budget > 0 && <span className="text-gray-600">{percent.toFixed(0)}%</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Budgets
