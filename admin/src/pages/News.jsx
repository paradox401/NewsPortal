import { useEffect, useMemo, useState } from "react";
import {
  getAdminPosts,
  updateAdminPost,
  updateAdminPostStatus,
  deleteAdminPost,
  uploadAdminPostImages,
} from "../api/news.api";
import { useToast } from "../components/common/ToastProvider";

const statusOptions = ["draft", "submitted", "approved", "rejected"];

const News = () => {
  const { notify } = useToast();
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({ status: "", category: "", q: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    status: "draft",
  });
  const [editImages, setEditImages] = useState([]);

  const fetchPosts = async (pageOverride = page) => {
    setLoading(true);
    try {
      const res = await getAdminPosts({ ...filters, page: pageOverride, limit: 10 });
      setPosts(res.data.data || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchPosts(1);
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = useMemo(
    () => posts.length > 0 && posts.every((post) => selected.has(post._id)),
    [posts, selected]
  );

  const toggleSelectAll = () => {
    setSelected((prev) => {
      if (allSelected) return new Set();
      return new Set(posts.map((post) => post._id));
    });
  };

  const bulkUpdateStatus = async (status) => {
    if (!selected.size) return notify("Select posts first", "warning");
    const feedback =
      status === "rejected"
        ? prompt("Provide feedback for rejection:")
        : "";
    if (status === "rejected" && !feedback) return;

    try {
      await Promise.all(
        Array.from(selected).map((id) =>
          updateAdminPostStatus(id, { status, feedback })
        )
      );
      notify("Posts updated", "success");
      setSelected(new Set());
      fetchPosts();
    } catch (err) {
      notify(err.response?.data?.message || "Bulk update failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deleteAdminPost(id);
      notify("Post deleted", "success");
      fetchPosts();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to delete post", "error");
    }
  };

  const handleEdit = (post) => {
    setEditing(post);
    setEditForm({
      title: post.title,
      content: post.content,
      category: post.category || "",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      status: post.status,
    });
    setEditImages([]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await updateAdminPost(editing._id, {
        ...editForm,
        tags: editForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      if (editImages.length) {
        const data = new FormData();
        [...editImages].forEach((img) => data.append("images", img));
        await uploadAdminPostImages(editing._id, data);
      }
      notify("Post updated", "success");
      setEditing(null);
      fetchPosts();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to update post", "error");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={applyFilters} className="card p-5 grid gap-4 md:grid-cols-4">
        <input
          name="q"
          value={filters.q}
          onChange={handleFilterChange}
          placeholder="Search title, tags, category"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
        />
        <input
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          placeholder="Category"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
        >
          <option value="">All status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Apply
        </button>
      </form>

      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">All posts</h3>
            <p className="text-sm text-slate-600">Approve, edit, and manage publishing.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => bulkUpdateStatus("approved")}
              className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white"
            >
              Approve selected
            </button>
            <button
              type="button"
              onClick={() => bulkUpdateStatus("rejected")}
              className="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white"
            >
              Reject selected
            </button>
          </div>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">Loading posts...</p>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
              <span>Select all</span>
            </div>
            {posts.map((post) => (
              <div
                key={post._id}
                className="grid gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-4 md:grid-cols-[auto_2fr_1fr_1fr_auto] md:items-center"
              >
                <input
                  type="checkbox"
                  checked={selected.has(post._id)}
                  onChange={() => toggleSelect(post._id)}
                />
                <div>
                  <p className="text-sm text-slate-500">{post.category || "General"}</p>
                  <p className="text-lg font-semibold text-slate-900">{post.title}</p>
                  <p className="text-xs text-slate-500">
                    {post.author?.name || "Unknown"} · {post.author?.role || ""}
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
                <button
                  onClick={() => handleEdit(post)}
                  className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="rounded-full border border-red-200 px-4 py-1 text-xs font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
            {!posts.length && <p className="text-sm text-slate-500">No posts found.</p>}

            <div className="flex items-center justify-between text-sm text-slate-500">
              <button
                disabled={page <= 1}
                onClick={() => fetchPosts(page - 1)}
                className="rounded-full border border-slate-200 px-4 py-1 disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => fetchPosts(page + 1)}
                className="rounded-full border border-slate-200 px-4 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {editing && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Edit post</h3>
          <div className="mt-4 grid gap-4">
            <input
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
            />
            <textarea
              name="content"
              value={editForm.content}
              onChange={handleEditChange}
              rows={5}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
            />
            <input
              name="category"
              value={editForm.category}
              onChange={handleEditChange}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
            />
            <input
              name="tags"
              value={editForm.tags}
              onChange={handleEditChange}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
            />
            <select
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600">
              <input type="file" multiple onChange={(e) => setEditImages(e.target.files)} />
              <p className="mt-2 text-xs text-slate-500">Add images (optional).</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={saveEdit}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Save changes
              </button>
              <button
                onClick={() => setEditing(null)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
