const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api", authRouter);
app.use("/api", postRouter);

// Health check route
app.get("/api/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server is running"
    });
});

// 404 handler
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

module.exports = app;
