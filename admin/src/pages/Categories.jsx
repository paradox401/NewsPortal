import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/category.api";
import { useToast } from "../components/common/ToastProvider";

const Categories = () => {
  const { notify } = useToast();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", isActive: true });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory(editing._id, form);
        notify("Category updated", "success");
      } else {
        await createCategory(form);
        notify("Category created", "success");
      }
      setForm({ name: "", description: "", isActive: true });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to save category", "error");
    }
  };

  const handleEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      notify("Category deleted", "success");
      fetchCategories();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to delete category", "error");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr]">
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <h3 className="text-xl font-semibold">
          {editing ? "Edit category" : "Create category"}
        </h3>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Category name"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active
        </label>
        <button
          type="submit"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          {editing ? "Save changes" : "Create category"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({ name: "", description: "", isActive: true });
            }}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="card p-6">
        <h3 className="text-xl font-semibold">Categories</h3>
        <p className="text-sm text-slate-600">Toggle visibility and keep taxonomy clean.</p>

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">Loading categories...</p>
        ) : (
          <div className="mt-6 space-y-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm text-slate-500">{category.slug}</p>
                  <p className="text-lg font-semibold text-slate-900">{category.name}</p>
                  <p className="text-xs text-slate-500">
                    {category.description || "No description"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`badge ${category.isActive ? "badge-success" : "badge-warning"}`}>
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => handleEdit(category)}
                    className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="rounded-full border border-red-200 px-4 py-1 text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {!categories.length && (
              <p className="text-sm text-slate-500">No categories yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
