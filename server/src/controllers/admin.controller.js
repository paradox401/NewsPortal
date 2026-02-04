import mongoose from "mongoose";
import User from "../models/User.model.js";
import Post from "../models/Post.model.js";
import Category from "../models/Category.model.js";
import { toSlug } from "../utils/slugify.js";

const safePagination = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
};

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      totalPosts,
      approvedPosts,
      submittedPosts,
      rejectedPosts,
      draftPosts,
      totalCategories,
      activeCategories,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ status: "pending" }),
      User.countDocuments({ status: "approved" }),
      User.countDocuments({ status: "rejected" }),
      Post.countDocuments({}),
      Post.countDocuments({ status: "approved" }),
      Post.countDocuments({ status: "submitted" }),
      Post.countDocuments({ status: "rejected" }),
      Post.countDocuments({ status: "draft" }),
      Category.countDocuments({}),
      Category.countDocuments({ isActive: true }),
    ]);

    res.json({
      users: {
        total: totalUsers,
        pending: pendingUsers,
        approved: approvedUsers,
        rejected: rejectedUsers,
      },
      posts: {
        total: totalPosts,
        approved: approvedPosts,
        submitted: submittedPosts,
        rejected: rejectedPosts,
        draft: draftPosts,
      },
      categories: {
        total: totalCategories,
        active: activeCategories,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

export const getAdminPosts = async (req, res) => {
  try {
    const { status, category, q } = req.query;
    const page = safePagination(req.query.page, 1);
    const limit = safePagination(req.query.limit, 20);

    const query = {};
    if (status) query.status = status;
    if (category) query.category = new RegExp(category, "i");
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [
        { title: regex },
        { content: regex },
        { tags: regex },
        { category: regex },
      ];
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate("author", "name email role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Post.countDocuments(query),
    ]);

    res.json({
      data: posts,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get admin posts error:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const updateAdminPost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const allowedFields = [
      "title",
      "content",
      "category",
      "tags",
      "status",
      "priority",
      "scheduledAt",
      "feedback",
      "images",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ success: true, post });
  } catch (error) {
    console.error("Update admin post error:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const updateAdminPostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    if (!status || !["approved", "rejected", "submitted", "draft"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (status === "rejected" && !feedback) {
      return res.status(400).json({ message: "Feedback is required for rejection" });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { status, feedback: status === "rejected" ? feedback : "" },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ success: true, post });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update post status" });
  }
};

export const deleteAdminPost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Delete admin post error:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const uploadAdminPostImages = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const { uploadImagesToImageKit } = await import("../utils/imagekitUpload.js");
    const images = await uploadImagesToImageKit(req.files, "newsimage");

    const post = await Post.findByIdAndUpdate(
      id,
      { $push: { images: { $each: images } } },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ success: true, post });
  } catch (error) {
    console.error("Admin image upload error:", error?.message || error);
    res.status(500).json({ success: false, message: "Image upload failed", error: error?.message || "Unknown error" });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const { role, status, q } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ name: regex }, { email: regex }];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get admin users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const allowedFields = ["status", "role"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    console.error("Update admin user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const getAdminCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error("Get admin categories error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

export const createAdminCategory = async (req, res) => {
  try {
    const { name, description, isActive = true } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = toSlug(name);
    const exists = await Category.findOne({ $or: [{ name }, { slug }] });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || "",
      isActive,
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: "Failed to create category" });
  }
};

export const updateAdminCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const updates = {};
    if (req.body.name) {
      updates.name = req.body.name;
      updates.slug = toSlug(req.body.name);
    }
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

    const category = await Category.findByIdAndUpdate(id, updates, { new: true });
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.json({ success: true, category });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
};

export const deleteAdminCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

export const testImageKit = async (req, res) => {
  try {
    const imagekit = (await import("../config/imagekit.js")).default;
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const format = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };
    const startDate = format(today);
    const endDate = format(tomorrow);

    const result = await imagekit.accounts.usage.get({ startDate, endDate });
    res.json({ success: true, result });
  } catch (error) {
    console.error("ImageKit test error:", error?.message || error);
    res.status(500).json({ success: false, message: "ImageKit test failed", error: error?.message || "Unknown error" });
  }
};
