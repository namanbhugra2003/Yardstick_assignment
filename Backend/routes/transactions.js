const express = require("express")
const Transaction = require("../Models/Transaction")

const router = express.Router()

// GET all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 })
    res.json(transactions)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" })
  }
})

// POST a new transaction
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: "All fields are required." })
    }

    const newTransaction = new Transaction({ title, amount, category, date })
    await newTransaction.save()
    res.status(201).json(newTransaction)
  } catch (err) {
    res.status(500).json({ error: "Failed to save transaction" })
  }
})

// PUT (update) a transaction
router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: "Failed to update transaction" })
  }
})

// DELETE a transaction
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id)
    res.json({ message: "Transaction deleted" })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete transaction" })
  }
})

module.exports = router
