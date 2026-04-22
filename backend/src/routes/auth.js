const express = require("express");
const userModel = require("../models/user.model");
const { generateToken } = require("../utils/jwt");
const { authMiddleware } = require("../middleware/auth");

const authRouter = express.Router();

// Register endpoint
authRouter.post("/v1/auth/register", async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Validation
        if (!email || !password || !username) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and username are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Create new user
        const user = new userModel({ email, password, username });
        await user.save();

        // Generate token
        const token = generateToken(user._id, user.email, user.role);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            token
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
});

// Login endpoint
authRouter.post("/v1/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user and get password field
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare passwords
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = generateToken(user._id, user.email, user.role);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            token
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
});

// Get current user endpoint
authRouter.get("/v1/auth/me", authMiddleware, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
            error: error.message
        });
    }
});

module.exports = authRouter;
