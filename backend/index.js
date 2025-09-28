require('dotenv').config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");

const userRoute = require("./routes/userRoute");
const eventRoute = require("./routes/eventRoute");
const listRoute = require("./routes/listRoute");
const localeRoute = require("./routes/localeRoute");
const companyRoute = require("./routes/companyRoute");
const qrcodeRoute = require("./routes/qrcodeRoute");
const searchRoute = require("./routes/searchRoute");

const User = require("./models/users.model");

const app = express();
const isProd = process.env.NODE_ENV === "production";

const clientURL = isProd
  ? "https://disco-app-angular.vercel.app"
  : "http://localhost:4200";
const backendURL = isProd
  ? "https://discoappangular-1.onrender.com"
  : "http://localhost:3000";

// Middleware
app.use(cors({ origin: [clientURL], credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/qrcodes", express.static(path.join(__dirname, "qrcodes")));

// Routes
app.use("/api/users", userRoute);
app.use("/api/companies", companyRoute);
app.use("/api/locali", localeRoute);
app.use("/api/events", eventRoute);
app.use("/api/lists", listRoute);
app.use("/api/qrcodes", qrcodeRoute);
app.use("/api/search", searchRoute);

// Health check
app.get("/", (req, res) => res.send("hello babe"));

// MongoDB connection & server start
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI non trovato! Controlla le variabili d'ambiente.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

// Example test route
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: error.message });
  }
});
