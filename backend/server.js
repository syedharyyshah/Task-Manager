require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

const allowedOrigins = [
    "https://task-manager-7ga5.vercel.app",
    // Add more allowed frontend URLs here as needed
];

// Middleware to handle CORS
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
        credentials: true,
    })
);

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Basic health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        status: "active", // More standard terminology
        error: false,
        message: "Server is running",
        timestamp: new Date().toISOString() // Added timestamp for monitoring
    });
});

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: "Route not found"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: true,
        message: "Internal server error"
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));