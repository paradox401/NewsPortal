import { useEffect, useState } from "react";
import { getUsers, updateUser } from "../api/users.api";
import { useToast } from "../components/common/ToastProvider";

const roleOptions = ["admin", "editor", "reporter"];
const statusOptions = ["pending", "approved", "rejected"];

const Users = () => {
  const { notify } = useToast();
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ role: "", status: "", q: "" });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers(filters);
      setUsers(res.data || []);
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleUpdate = async (id, payload) => {
    try {
      await updateUser(id, payload);
      notify("User updated", "success");
      fetchUsers();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to update user", "error");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={applyFilters} className="card p-5 grid gap-4 md:grid-cols-4">
        <input
          name="q"
          value={filters.q}
          onChange={handleFilterChange}
          placeholder="Search name or email"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
        />
        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
        >
          <option value="">All roles</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
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
        <h3 className="text-xl font-semibold">User directory</h3>
        <p className="text-sm text-slate-600">Manage roles and access status.</p>

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">Loading users...</p>
        ) : (
          <div className="mt-6 space-y-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="grid gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-4 md:grid-cols-[2fr_1fr_1fr_auto] md:items-center"
              >
                <div>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <select
                  value={user.role}
                  onChange={(e) => handleUpdate(user._id, { role: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <select
                  value={user.status}
                  onChange={(e) => handleUpdate(user._id, { status: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <span
                  className={`badge ${
                    user.status === "approved"
                      ? "badge-success"
                      : user.status === "rejected"
                      ? "badge-danger"
                      : "badge-warning"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            ))}
            {!users.length && (
              <p className="text-sm text-slate-500">No users found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
