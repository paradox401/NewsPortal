import mongoose from "mongoose";
import Post from "../models/Post.model.js";

const getPublicPostFields = () =>
  "-feedback -__v";

const buildSearchQuery = (query) => {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  return {
    status: "approved",
    $or: [
      { title: regex },
      { content: regex },
      { category: regex },
      { tags: regex },
    ],
  };
};

export const getLatestPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(20)
      .select(getPublicPostFields());

    res.json(posts);
  } catch (error) {
    console.error("Get latest posts error:", error);
    res.status(500).json({ message: "Failed to fetch latest posts" });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findOne({ _id: id, status: "approved" })
      .select(getPublicPostFields());

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

export const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await Post.find({
      status: "approved",
      category: { $regex: new RegExp(category, "i") },
    })
      .sort({ createdAt: -1 })
      .select(getPublicPostFields());

    res.json(posts);
  } catch (error) {
    console.error("Get category posts error:", error);
    res.status(500).json({ message: "Failed to fetch category posts" });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    const category = (req.query.category || "").trim();
    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;

    if (!query && !category && !from && !to) {
      return res.json([]);
    }

    const baseQuery = query ? buildSearchQuery(query) : { status: "approved" };

    if (category) {
      baseQuery.category = { $regex: new RegExp(category, "i") };
    }

    if (from || to) {
      baseQuery.createdAt = {};
      if (from) baseQuery.createdAt.$gte = from;
      if (to) baseQuery.createdAt.$lte = to;
    }

    const posts = await Post.find(baseQuery)
      .sort({ createdAt: -1 })
      .limit(40)
      .select(getPublicPostFields());

    res.json(posts);
  } catch (error) {
    console.error("Search posts error:", error);
    res.status(500).json({ message: "Failed to search posts" });
  }
};

export const getBreakingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(8)
      .select(getPublicPostFields());

    res.json(posts);
  } catch (error) {
    console.error("Get breaking posts error:", error);
    res.status(500).json({ message: "Failed to fetch breaking posts" });
  }
};

export const getTrendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(10)
      .select(getPublicPostFields());

    res.json(posts);
  } catch (error) {
    console.error("Get trending posts error:", error);
    res.status(500).json({ message: "Failed to fetch trending posts" });
  }
};
