import express from "express";
import {
  getLatestPosts,
  getSinglePost,
  getPostsByCategory,
  searchPosts,
  getBreakingPosts,
  getTrendingPosts,
} from "../controllers/news.controller.js";

const router = express.Router();

// Public news endpoints
router.get("/", getLatestPosts);
router.get("/breaking", getBreakingPosts);
router.get("/trending", getTrendingPosts);
router.get("/search", searchPosts);
router.get("/category/:category", getPostsByCategory);
router.get("/:id", getSinglePost);

export default router;
