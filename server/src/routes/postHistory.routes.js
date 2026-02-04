import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getPostHistory } from "../controllers/postHistory.controller.js";

const router = express.Router();

router.get("/history", authMiddleware, getPostHistory);

export default router;
