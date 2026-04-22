const express = require("express");
const multer = require("multer");
const postModel = require("../models/post.model");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");
const uploadImage = require("../service/storage.service");

const postRouter = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
            return;
        }

        cb(new Error("Only image files are allowed"));
    }
});

// Create post - only authenticated users
postRouter.post("/v1/posts", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        const { title, description, caption } = req.body;

        // Validation
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required"
            });
        }

        let imageUrl;
        if (req.file) {
            const uploadedImage = await uploadImage(req.file.buffer, req.file.originalname);
            imageUrl = uploadedImage.url;
        }

        const post = new postModel({
            title,
            description,
            caption,
            image: imageUrl,
            userId: req.user.userId,
            createdBy: req.user.email
        });

        await post.save();

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create post",
            error: error.message
        });
    }
});

// Get all posts
postRouter.get("/v1/posts", async (req, res) => {
    try {
        const posts = await postModel.find().populate("userId", "email username");

        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            posts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch posts",
            error: error.message
        });
    }
});

// Get single post
postRouter.get("/v1/posts/:id", async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id).populate("userId", "email username");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch post",
            error: error.message
        });
    }
});

// Update post - only post owner or admin
postRouter.put("/v1/posts/:id", authMiddleware, async (req, res) => {
    try {
        const { title, description, caption } = req.body;
        const postId = req.params.id;

        // Find post
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check authorization
        if (post.userId.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this post"
            });
        }

        // Update fields
        if (title) post.title = title;
        if (description) post.description = description;
        if (caption) post.caption = caption;
        post.updatedAt = Date.now();

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update post",
            error: error.message
        });
    }
});

// Delete post - only post owner or admin
postRouter.delete("/v1/posts/:id", authMiddleware, async (req, res) => {
    try {
        const postId = req.params.id;

        // Find post
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check authorization
        if (post.userId.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this post"
            });
        }

        await postModel.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete post",
            error: error.message
        });
    }
});

// Get current user's posts
postRouter.get("/v1/my-posts", authMiddleware, async (req, res) => {
    try {
        const posts = await postModel.find({ userId: req.user.userId });

        return res.status(200).json({
            success: true,
            message: "User posts fetched successfully",
            posts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user posts",
            error: error.message
        });
    }
});

module.exports = postRouter;
