// server/src/controllers/auth.controller.js
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to safely call next
const safeNext = (err, next, res) => {
  if (next) return next(err);
  console.error(err);
  return res.status(500).json({ success: false, message: "Internal server error" });
};

// Register a new user (reporter/editor)
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const newUser = await User.create({ name, email, password, role, status: "pending" });
    res.status(201).json({ success: true, message: "Registration request sent. Waiting for admin approval." });
  } catch (err) {
    safeNext(err, next, res);
  }
};

// Admin: get all pending registrations
export const getPendingRegistrations = async (req, res, next) => {
  try {
    const pendingUsers = await User.find({ status: "pending" }).select("name email role status");
    res.status(200).json({ success: true, users: pendingUsers });
  } catch (err) {
    safeNext(err, next, res);
  }
};

// Admin: approve or reject registration
export const updateRegistrationStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.status = status;
    await user.save();

    res.status(200).json({ success: true, message: `User ${status} successfully`, user });
  } catch (err) {
    safeNext(err, next, res);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    // Check account status
    if (user.status === "pending") {
      return res.status(403).json({ success: false, message: "Your account is pending approval" });
    }
    if (user.status === "rejected") {
      return res.status(403).json({ success: false, message: "Your account was rejected" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.password = undefined;

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    safeNext(error, next, res);
  }
};

// GET CURRENT USER
export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch full user info from DB
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    safeNext(error, next, res);
  }
};
