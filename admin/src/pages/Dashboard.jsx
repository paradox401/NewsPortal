import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { getAdminStats, getAdminPosts } from "../api/news.api";
import StatCard from "../components/dashboard/StatCard";
import { useToast } from "../components/common/ToastProvider";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { notify } = useToast();
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, postsRes] = await Promise.all([
          getAdminStats(),
          getAdminPosts({ limit: 5 }),
        ]);
        setStats(statsRes.data);
        setRecentPosts(postsRes.data.data || []);
      } catch (err) {
        notify(err.response?.data?.message || "Failed to load dashboard", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [notify]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading) {
    return <div className="card p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats?.users?.total ?? 0}
          trend={`${stats?.users?.pending ?? 0} pending`}
          tone="warning"
        />
        <StatCard
          label="Published Posts"
          value={stats?.posts?.approved ?? 0}
          trend={`${stats?.posts?.submitted ?? 0} awaiting`}
          tone="info"
        />
        <StatCard
          label="Drafts"
          value={stats?.posts?.draft ?? 0}
          trend={`${stats?.posts?.rejected ?? 0} rejected`}
          tone="danger"
        />
        <StatCard
          label="Active Categories"
          value={stats?.categories?.active ?? 0}
          trend={`${stats?.categories?.total ?? 0} total`}
          tone="success"
        />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Recent activity</h3>
            <p className="text-sm text-slate-600">Latest submissions and edits.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {recentPosts.map((post) => (
            <div
              key={post._id}
              className="flex flex-col gap-2 rounded-2xl border border-slate-200/60 bg-white/70 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm text-slate-500">{post.category || "General"}</p>
                <p className="text-lg font-semibold text-slate-900">{post.title}</p>
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
                    : post.status === "submitted"
                    ? "badge-warning"
                    : "badge-info"
                }`}
              >
                {post.status}
              </span>
            </div>
          ))}
          {!recentPosts.length && (
            <p className="text-sm text-slate-500">No recent posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
