// server.js
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

const transactionsRoutes = require("./routes/transactions")
const budgetsRoutes = require("./routes/budgets")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/transactions", transactionsRoutes)
app.use("/api/budgets", budgetsRoutes)

app.get("/", (req, res) => {
  res.send("Finance Tracker API is running 🚀")
})

// Connect DB and Start Server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch((err) => console.error("DB connection error:", err))
