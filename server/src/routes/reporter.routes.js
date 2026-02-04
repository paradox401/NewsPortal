// routes/reporter.routes.js
import express from "express";
import upload from "../middleware/upload.middleware.js";

import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

import {
  getMyPosts,
  createPost,
  submitPost,
  editPost,
  deletePost,
  uploadImages,
  getMyPostsHistory
} from "../controllers/reporter.controller.js";

const router = express.Router();

// All routes require reporter role
const reporterMiddleware = [authMiddleware, authorizeRoles("reporter")];

// ====== ROUTES ======

// Get all my posts
router.get("/posts", reporterMiddleware, getMyPosts);

// Create new post
router.post("/posts", reporterMiddleware, createPost);

// Edit post
router.put("/posts/:id", reporterMiddleware, editPost);

// Submit post for review
router.put("/posts/:id/submit", reporterMiddleware, submitPost);

// Delete post
router.delete("/posts/:id", reporterMiddleware, deletePost);

// Upload images for a post (max 5 images)
router.post("/posts/:id/images", reporterMiddleware, upload.array("images", 5), uploadImages);

// Get all my posts (history)
router.get("/posts/history", reporterMiddleware, getMyPostsHistory);

export default router;
