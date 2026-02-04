import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

const pageTitleMap = {
  "/dashboard": "Executive Overview",
  "/news": "Newsroom Control",
  "/categories": "Category Studio",
  "/users": "User Directory",
  "/admin/requests": "Approval Requests",
  "/reporter": "Reporter Desk",
  "/editor": "Editor Desk",
  "/reporter/history": "Reporter History",
  "/editor/history": "Editor History",
};

const AdminLayout = () => {
  const location = useLocation();
  const title = pageTitleMap[location.pathname] || "Admin Console";

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <Header title={title} />
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
