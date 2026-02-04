import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Example dashboard routes based on role
router.get("/", authMiddleware, (req, res) => {
  const { role } = req.user;

  if (role === "admin") {
    return res.json({ message: "Welcome to Admin Dashboard" });
  } else if (role === "editor") {
    return res.json({ message: "Welcome to Editor Dashboard" });
  } else if (role === "reporter") {
    return res.json({ message: "Welcome to Reporter Dashboard" });
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
});

export default router;
