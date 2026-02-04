// pages/PostHistory.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const PostHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch posts based on role
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        user.role === "reporter"
          ? "/reporter/posts/history"
          : "/editor/posts/history"
      );
      setPosts(res.data.posts || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Approve / Reject (only editor for reporter posts)
  const handleStatusChange = async (id, status) => {
    try {
      let body = { status };

      if (status === "rejected") {
        const feedback = prompt("Enter feedback for rejection:");
        if (!feedback) return alert("Feedback is required to reject a post.");
        body.feedback = feedback;
      }

      await api.put(`/editor/posts/${id}/status`, body);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleEdit = (post) => {
    navigate(
      user.role === "editor"
        ? `/editor/edit/${post._id}`
        : `/reporter/edit/${post._id}`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="card p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Archive</p>
          <h2 className="text-2xl font-semibold text-slate-900">Post history</h2>
          <p className="text-sm text-slate-600 mt-1">
            A timeline of your submissions and approvals.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Logout
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">No posts yet.</div>
      ) : (
        <div className="card p-6 space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="rounded-2xl border border-slate-200/60 bg-white/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{post.category || "General"}</p>
                  <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
                  <p className="text-xs text-slate-500">
                    Author: {post.author?.name || "Unknown"} ({post.author?.role})
                  </p>
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
                Tags: {Array.isArray(post.tags) ? post.tags.join(", ") : "None"}
              </p>
              {post.feedback && (
                <p className="mt-2 text-xs text-red-600">Feedback: {post.feedback}</p>
              )}

              {post.images?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`post-img-${i}`}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {post.author?._id === user.id && (
                  <button
                    onClick={() => handleEdit(post)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold"
                  >
                    Edit
                  </button>
                )}

                {user.role === "editor" && post.author?.role === "reporter" && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostHistory;
