// pages/EditorDashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import api from "../api/axios";

const EditorDashboard = () => {
  const dispatch = useDispatch();

  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "General",
    tags: "",
    images: [],
  });
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     FETCH SUBMITTED POSTS
  ========================== */
  const fetchPosts = async () => {
    try {
      const res = await api.get("/editor/posts");
      setPosts(res.data.posts);
    } catch {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* =========================
     FORM HANDLERS
  ========================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImages = (e) => {
    setForm((prev) => ({ ...prev, images: e.target.files }));
  };

  /* =========================
     CREATE / UPDATE POST
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;

      const payload = {
        title: form.title,
        content: form.content,
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      if (editingPost) {
        res = await api.put(`/editor/posts/${editingPost._id}`, payload);
      } else {
        res = await api.post("/editor/posts", payload);
      }

      // Upload images
      if (form.images.length) {
        const data = new FormData();
        [...form.images].forEach((img) => data.append("images", img));
        await api.post(`/editor/posts/${res.data.post._id}/images`, data);
      }

      resetForm();
      fetchPosts();
    } catch {
      alert("Failed to save post");
    }
  };

  const resetForm = () => {
    setForm({ title: "", content: "", category: "General", tags: "", images: [] });
    setEditingPost(null);
  };

  /* =========================
     EDIT POST
  ========================== */
  const handleEdit = (post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags?.join(", ") || "",
      images: [],
    });
  };

  /* =========================
     APPROVE / REJECT (NEW / STATUS ROUTE)
  ========================== */
  const handleStatusChange = async (id, status) => {
    try {
      const body = { status };

      // Prompt for feedback if rejecting
      if (status === "rejected") {
        const feedback = prompt("Enter feedback for rejection:");
        if (!feedback) return alert("Feedback is required to reject a post.");
        body.feedback = feedback;
      }

      await api.put(`/editor/posts/${id}/status`, body);
      fetchPosts();
    } catch {
      alert("Failed to update post status");
    }
  };

  /* =========================
     LOGOUT
  ========================== */
  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="card p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Editor Desk</p>
          <h2 className="text-2xl font-semibold text-slate-900">Publish with confidence</h2>
          <p className="text-sm text-slate-600 mt-1">
            Approve submissions, edit content, and manage live stories.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Logout
        </button>
      </div>

      {/* CREATE / EDIT FORM */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">
            {editingPost ? "Edit post" : "Create new post"}
          </h3>
          <span className="badge badge-info">{editingPost ? "Editing" : "New"}</span>
        </div>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Headline"
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          required
        />

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content"
          rows={6}
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          required
        />

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />

          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600">
          <input type="file" multiple onChange={handleImages} />
          <p className="mt-2 text-xs text-slate-500">Upload up to 5 images.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            {editingPost ? "Update Post" : "Create Post"}
          </button>
          {editingPost && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* SUBMITTED POSTS */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold">Submitted posts</h3>
        <p className="text-sm text-slate-600">Review reporter submissions.</p>

        <div className="mt-6 space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="rounded-2xl border border-slate-200/60 bg-white/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{post.category || "General"}</p>
                  <h4 className="text-lg font-semibold text-slate-900">{post.title}</h4>
                  <p className="text-xs text-slate-500">
                    {post.author?.name || "Unknown"} · {post.status}
                  </p>
                </div>
                <span
                  className={`badge ${
                    post.status === "approved"
                      ? "badge-success"
                      : post.status === "rejected"
                      ? "badge-danger"
                      : "badge-warning"
                  }`}
                >
                  {post.status}
                </span>
              </div>

              {post.images?.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {post.images.map((img, i) => (
                    <img key={i} src={img} className="h-20 w-full object-cover rounded" />
                  ))}
                </div>
              )}

              {post.feedback && (
                <p className="mt-2 text-xs text-red-600">Feedback: {post.feedback}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleStatusChange(post._id, "approved")}
                  className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(post._id, "rejected")}
                  className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {!posts.length && <p className="text-sm text-slate-500">No submissions yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default EditorDashboard;
