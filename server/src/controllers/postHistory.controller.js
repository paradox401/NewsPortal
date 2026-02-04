import Post from "../models/Post.model.js";

// Get posts history
export const getPostHistory = async (req, res) => {
  try {
    let posts;
    if (req.user.role === "reporter") {
      // reporter: only their own posts
      posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    } else if (req.user.role === "editor") {
      // editor: all posts
      posts = await Post.find().populate("author", "name role").sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.json({ success: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch post history" });
  }
};
