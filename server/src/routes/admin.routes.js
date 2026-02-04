import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import {
  getAdminStats,
  getAdminPosts,
  updateAdminPost,
  deleteAdminPost,
  updateAdminPostStatus,
  getAdminUsers,
  updateAdminUser,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  testImageKit,
  uploadAdminPostImages,
} from "../controllers/admin.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("admin"));

router.get("/stats", getAdminStats);

router.get("/posts", getAdminPosts);
router.put("/posts/:id", updateAdminPost);
router.put("/posts/:id/status", updateAdminPostStatus);
router.post("/posts/:id/images", upload.array("images", 5), uploadAdminPostImages);
router.delete("/posts/:id", deleteAdminPost);

router.get("/users", getAdminUsers);
router.put("/users/:id", updateAdminUser);

router.get("/categories", getAdminCategories);
router.post("/categories", createAdminCategory);
router.put("/categories/:id", updateAdminCategory);
router.delete("/categories/:id", deleteAdminCategory);
router.get("/imagekit-test", testImageKit);

export default router;
