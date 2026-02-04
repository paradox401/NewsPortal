// controllers/reporter.controller.js
import Post from "../models/Post.model.js";
import mongoose from "mongoose";
import { uploadImagesToImageKit } from "../utils/imagekitUpload.js";
// Get all my posts
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create new draft
export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const post = await Post.create({
      title,
      content,
      category,
      tags,
      author: req.user.id,
      status: "draft",
    });
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Submit a draft
export const submitPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not allowed" });

    post.status = "submitted";
    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Edit draft
export const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not allowed" });
    if (post.status === "approved") return res.status(400).json({ success: false, message: "Cannot edit approved post" });

    const { title, content, category, tags } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags || post.tags;

    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete draft
export const deletePost = async (req, res) => {
    try {
      const { id } = req.params;
  
      // ✅ ObjectId validation
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid post ID",
        });
      }
  
      // ✅ Find post
      const post = await Post.findById(id);
  
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
  
      // ✅ Ownership check
      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to delete this post",
        });
      }
  
      await post.deleteOne();
  
      res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Delete post error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

export const uploadImages = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!req.files || req.files.length === 0)
        return res.status(400).json({ success: false, message: "No images uploaded" });
  
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ success: false, message: "Post not found" });
  
      const urls = await uploadImagesToImageKit(req.files, "newsimage");
      post.images.push(...urls);
      await post.save();
  
      res.status(200).json({ success: true, post });
    } catch (err) {
      console.error("Reporter image upload error:", err?.message || err);
      res.status(500).json({ success: false, message: "Image upload failed", error: err?.message || "Unknown error" });
    }
  };
  // Get all posts of the reporter (history)
export const getMyPostsHistory = async (req, res) => {
    try {
      const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
      res.json({ success: true, posts });
    } catch (err) {
      console.error("Get posts history error:", err);
      res.status(500).json({ success: false, message: "Failed to fetch posts history" });
    }
  };
  
