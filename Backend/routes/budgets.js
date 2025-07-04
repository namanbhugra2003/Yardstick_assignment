const express = require("express")
const Budget = require("../Models/Budget")

const router = express.Router()

// GET all budgets
router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find()

    // Transform into object format: { Food: 1000, Transport: 500, ... }
    const formatted = budgets.reduce((acc, budget) => {
      acc[budget.category] = budget.amount
      return acc
    }, {})

    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch budgets" })
  }
})

// POST or UPDATE budget
router.post("/", async (req, res) => {
  try {
    const { category, amount } = req.body

    if (!category || !amount) {
      return res.status(400).json({ error: "Category and amount are required." })
    }

    const updated = await Budget.findOneAndUpdate(
      { category },
      { amount },
      { upsert: true, new: true }
    )

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: "Failed to update budget" })
  }
})

module.exports = router
