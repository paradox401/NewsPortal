// routes/editor.routes.js
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
  getSubmittedPosts,
  createPost,
  editPost,
  approvePost,
  rejectPost,
  uploadImages,
  getEditorPostHistory,
} from "../controllers/editor.controller.js";

const router = express.Router();

// ====================
// ROUTES
// ====================

// Get all submitted/rejected posts for editor review
router.get(
  "/posts",
  authMiddleware,
  authorizeRoles("editor"),
  getSubmittedPosts
);

// Create a post directly as editor
router.post(
  "/posts",
  authMiddleware,
  authorizeRoles("editor"),
  createPost
);

// Edit any post
router.put(
  "/posts/:id",
  authMiddleware,
  authorizeRoles("editor"),
  editPost
);

// ✅ New single status route (approve/reject)
router.put(
  "/posts/:id/status",
  authMiddleware,
  authorizeRoles("editor"),
  async (req, res) => {
    const { status, feedback } = req.body;

    if (status === "approved") {
      return approvePost(req, res);
    } else if (status === "rejected") {
      if (!feedback) {
        return res
          .status(400)
          .json({ success: false, message: "Feedback is required for rejection" });
      }
      return rejectPost(req, res);
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }
  }
);

// Upload images for a post
router.post(
  "/posts/:id/images",
  authMiddleware,
  authorizeRoles("editor"),
  upload.array("images", 5),
  uploadImages
);

// Fetch editor post history
router.get(
  "/posts/history",
  authMiddleware,
  authorizeRoles("editor"),
  getEditorPostHistory
);

export default router;
