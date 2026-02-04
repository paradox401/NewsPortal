// models/Post.model.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, default: "General" },
    tags: [String],
    images: [String],
    feedback: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },
    scheduledAt: { type: Date, default: null },
    views: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "rejected"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
