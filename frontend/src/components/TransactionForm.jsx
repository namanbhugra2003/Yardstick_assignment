import { useState, useEffect } from "react"

export const TransactionForm = ({ onSubmit, editingData, cancelEdit }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().substr(0, 10),
  })

  useEffect(() => {
    if (editingData) {
      setForm({
        ...editingData,
        date: new Date(editingData.date).toISOString().substr(0, 10),
      })
    }
  }, [editingData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
    setForm({
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().substr(0, 10),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow border border-gray-200 space-y-4"
    >
      <h3 className="text-lg font-medium text-gray-700">
        {editingData ? "✏️ Edit Transaction" : "➕ Add Transaction"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="p-2 border rounded-md w-full"
        />
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          type="number"
          required
          className="p-2 border rounded-md w-full"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="p-2 border rounded-md w-full"
          required
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="p-2 border rounded-md w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow"
        >
          {editingData ? "Update" : "Add"}
        </button>
      </div>

      {editingData && (
        <button
          type="button"
          onClick={cancelEdit}
          className="text-sm text-gray-500 underline mt-2"
        >
          Cancel Edit
        </button>
      )}
    </form>
  )
}
