// pages/ReporterDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const ReporterDashboard = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "General",
    tags: "",
    priority: "normal",
    scheduledAt: "",
    images: [],
  });
  const [editingPost, setEditingPost] = useState(null);
  const [error, setError] = useState(null);

  // Fetch reporter posts
  const fetchPosts = async () => {
    try {
      const res = await api.get("/reporter/posts");
      setPosts(res.data.posts);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImages = (e) => {
    setForm((prev) => ({ ...prev, images: e.target.files }));
  };

  // Create or update post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      const payload = {
        title: form.title,
        content: form.content,
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        priority: form.priority,
        scheduledAt: form.scheduledAt || null,
      };

      if (editingPost) {
        res = await api.put(`/reporter/posts/${editingPost._id}`, payload);
      } else {
        res = await api.post("/reporter/posts", payload);
      }

      // Upload images
      if (form.images.length) {
        const data = new FormData();
        for (let i = 0; i < form.images.length; i++) {
          data.append("images", form.images[i]);
        }
        await api.post(`/reporter/posts/${res.data.post._id}/images`, data);
      }

      // Reset form
      setForm({
        title: "",
        content: "",
        category: "General",
        tags: "",
        priority: "normal",
        scheduledAt: "",
        images: [],
      });
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save post");
    }
  };

  // Edit post
  const handleEdit = (post) => {
    setEditingPost(post);
    setForm({
      title: post.title || "",
      content: post.content || "",
      category: post.category || "General",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      priority: post.priority || "normal",
      scheduledAt: post.scheduledAt ? post.scheduledAt.split("T")[0] : "",
      images: [],
    });
  };

  // Delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await api.delete(`/reporter/posts/${id}`);
    fetchPosts();
  };

  // Submit post for approval
  const handlePostSubmit = async (id) => {
    try {
      await api.put(`/reporter/posts/${id}/submit`);
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit post");
    }
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="card p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Reporter Desk</p>
          <h2 className="text-2xl font-semibold text-slate-900">Draft a new story</h2>
          <p className="text-sm text-slate-600 mt-1">
            Create drafts, schedule submissions, and track approvals.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Logout
        </button>
      </div>

      {/* Post Form */}
      <form className="card p-6 space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">
            {editingPost ? "Edit draft" : "Compose story"}
          </h3>
          <span className="badge badge-info">{editingPost ? "Editing" : "New"}</span>
        </div>

        <input
          type="text"
          name="title"
          placeholder="Headline"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          required
        />

        <textarea
          name="content"
          placeholder="Write the full story..."
          value={form.content}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          rows={6}
          required
        />

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />

          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          >
            <option value="low">Low Priority</option>
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
          </select>

          <input
            type="date"
            name="scheduledAt"
            value={form.scheduledAt}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600">
          <input type="file" multiple onChange={handleImages} />
          <p className="mt-2 text-xs text-slate-500">Upload up to 5 images.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {editingPost ? "Save changes" : "Create draft"}
          </button>
          {editingPost && (
            <button
              type="button"
              onClick={() => {
                setEditingPost(null);
                setForm({
                  title: "",
                  content: "",
                  category: "General",
                  tags: "",
                  priority: "normal",
                  scheduledAt: "",
                  images: [],
                });
              }}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* My Posts */}
      <div className="card p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold">My drafts</h3>
          <p className="text-sm text-slate-600">Track status and submit when ready.</p>
        </div>

        {posts.map((post) => (
          <div key={post._id} className="rounded-2xl border border-slate-200/60 bg-white/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{post.category || "General"}</p>
                <h4 className="text-lg font-semibold text-slate-900">{post.title}</h4>
              </div>
              <span
                className={`badge ${
                  post.status === "approved"
                    ? "badge-success"
                    : post.status === "rejected"
                    ? "badge-danger"
                    : post.status === "submitted"
                    ? "badge-warning"
                    : "badge-info"
                }`}
              >
                {post.status}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Priority: {post.priority || "normal"} · Tags: {Array.isArray(post.tags) ? post.tags.join(", ") : "None"}
            </p>
            {post.feedback && (
              <p className="mt-2 text-xs text-red-600">Feedback: {post.feedback}</p>
            )}

            {Array.isArray(post.images) && post.images.length > 0 && (
              <div className="mt-3 flex gap-2">
                {post.images.map((img, i) => (
                  <img key={i} src={img} alt="Post" className="h-20 w-20 rounded-xl object-cover" />
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {post.status === "draft" && (
                <button
                  onClick={() => handlePostSubmit(post._id)}
                  className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                >
                  Submit
                </button>
              )}
              <button
                onClick={() => handleEdit(post)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!posts.length && <p className="text-sm text-slate-500">No drafts yet.</p>}
      </div>
    </div>
  );
};

export default ReporterDashboard;
