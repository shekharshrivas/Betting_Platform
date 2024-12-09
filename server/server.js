const express = require("express");
const connectDB = require("./config/db.js");
require("dotenv").config();

// Import CORS
const cors = require("cors");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");
const userRoutes = require("./routes/user");
const betRoutes = require("./routes/bet");

const app = express();

// Middleware
app.use(express.json());

// Enable CORS for all origins (or specify only the frontend domain)
app.use(cors()); // This will allow all origins to access the API

// Alternatively, if you want to restrict CORS to a specific domain (e.g., localhost:5173 for your React app)
app.use(cors({
  origin: 'https://betting-appsb.netlify.app/',  // Adjust this URL if your React app is running on a different port
}));

// Connect to database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bets", betRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
