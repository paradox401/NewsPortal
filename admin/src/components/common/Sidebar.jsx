import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "News", path: "/news" },
  { label: "Categories", path: "/categories" },
  { label: "Users", path: "/users" },
  { label: "Requests", path: "/admin/requests" },
];

const roleItems = {
  editor: [
    { label: "Editor Desk", path: "/editor" },
    { label: "History", path: "/editor/history" },
  ],
  reporter: [
    { label: "Reporter Desk", path: "/reporter" },
    { label: "History", path: "/reporter/history" },
  ],
};

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const items = user?.role === "admin" ? navItems : roleItems[user?.role] || [];

  return (
    <aside className="admin-sidebar">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-white/10 grid place-items-center text-lg font-semibold">
          NP
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">NewsPortal</p>
          <p className="text-lg font-semibold text-white">Admin Console</p>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-white text-slate-900"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-white/10 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Role</p>
        <p className="mt-2 text-sm font-semibold text-white">
          {user?.role ? user.role.toUpperCase() : "Guest"}
        </p>
        <p className="text-xs text-slate-400 mt-1">Signed in as {user?.name || "User"}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
