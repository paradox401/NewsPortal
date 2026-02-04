import { useEffect, useState } from "react";
import api from "../api/axios";
import { useToast } from "../components/common/ToastProvider";

const AdminRequests = () => {
  const { notify } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = async () => {
    try {
      const res = await api.get("/auth/pending");
      setUsers(res.data.users || []);
    } catch (err) {
      notify(err.response?.data?.message || "Failed to fetch requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (userId, status) => {
    try {
      await api.put(`/auth/pending/${userId}`, { status });
      notify(`User ${status}`, "success");
      fetchPendingUsers();
    } catch (err) {
      notify(err.response?.data?.message || "Action failed", "error");
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  if (loading) return <div className="card p-6">Loading...</div>;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Pending registration requests</h2>
          <p className="text-sm text-slate-600">Approve new reporters and editors.</p>
        </div>
        <span className="badge badge-warning">{users.length} pending</span>
      </div>

      <div className="mt-6 space-y-4">
        {users.length === 0 ? (
          <p className="text-sm text-slate-500">No pending requests</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <p className="text-xs text-slate-500">Role: {user.role}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApproveReject(user._id, "approved")}
                  className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproveReject(user._id, "rejected")}
                  className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRequests;
