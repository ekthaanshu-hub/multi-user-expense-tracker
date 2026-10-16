require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");

const User = require("./models/User");
const Transaction = require("./models/Transaction");
const Budget = require("./models/Budget");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/budgets", require("./routes/budgets"));

// Frontend files
app.use(express.static(path.join(__dirname, "public")));

// Fallback when no homepage file is available.
app.get("/", (req, res) => {
  res.send("Personal Expense Tracker server is running!");
});

async function startServer() {
  try {
    await connectDB();

    await Promise.all([
      User.init(),
      Transaction.init(),
      Budget.init()
    ]);

    console.log("All three models and indexes initialized successfully.");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();