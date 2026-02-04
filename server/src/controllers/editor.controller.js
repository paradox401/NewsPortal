import Post from "../models/Post.model.js";
import { uploadImagesToImageKit } from "../utils/imagekitUpload.js";

/* ==========================
   GET SUBMITTED POSTS
========================== */
export const getSubmittedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      status: { $in: ["submitted", "rejected"] },
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ==========================
   CREATE POST (EDITOR)
========================== */
export const createPost = async (req, res) => {
  try {
    const { images, ...rest } = req.body;
    const post = await Post.create({
      ...rest,
      author: req.user.id,
      status: "approved", // editor-created post goes live
    });

    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
};

/* ==========================
   EDIT ANY POST
========================== */
export const editPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

/* ==========================
   APPROVE POST
========================== */
export const approvePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        feedback: "",
      },
      { new: true }
    );

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Approval failed" });
  }
};

/* ==========================
   REJECT POST
========================== */
export const rejectPost = async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({
        success: false,
        message: "Feedback is required",
      });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        feedback,
      },
      { new: true }
    );

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Reject failed" });
  }
};

/* ==========================
   IMAGE UPLOAD (EDITOR)
========================== */
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const images = await uploadImagesToImageKit(req.files, "newsimage");

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { images: { $each: images } } },
      { new: true }
    );

    res.json({ success: true, post });
  } catch (err) {
    console.error("Editor image upload error:", err?.message || err);
    res.status(500).json({ success: false, message: "Image upload failed", error: err?.message || "Unknown error" });
  }
};
export const getEditorPostHistory = async (req, res) => {
    try {
      // Editor can see all posts, optionally populate author info
      const posts = await Post.find()
        .populate("author", "name role")
        .sort({ createdAt: -1 });
  
      res.json({ success: true, posts });
    } catch (err) {
      console.error("Editor history fetch error:", err);
      res.status(500).json({ success: false, message: "Failed to fetch post history" });
    }
  };
