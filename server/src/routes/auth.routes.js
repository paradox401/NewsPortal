import express from "express";
import { login, getMe, register, getPendingRegistrations, updateRegistrationStatus  } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

// Admin-only routes
router.get("/pending", authMiddleware, async (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Forbidden" });
  next();
}, getPendingRegistrations);

router.put("/pending/:userId", authMiddleware, async (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Forbidden" });
  next();
}, updateRegistrationStatus);
router.get("/me", authMiddleware, getMe);
export default router;