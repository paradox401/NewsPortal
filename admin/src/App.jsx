import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminRequests from "./pages/AdminRequests";
import ReporterDashboard from "./pages/ReporterDashboard";
import EditorDashboard from "./pages/EditorDashboard";
import PostHistory from "./pages/PostHistory";
import News from "./pages/News";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import AdminLayout from "./layouts/AdminLayout";
import NotFound from "./pages/NotFound";
/* ===============================
   🔐 TOKEN PROTECTION
================================ */
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useSelector((state) => state.auth);

  // ⏳ wait until auth check completes
  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ===============================
   🔐 ROLE PROTECTION
================================ */
const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useSelector((state) => state.auth);

  // ⏳ VERY IMPORTANT
  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  // ❌ token valid but user not loaded (expired / invalid)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ wrong role → redirect to correct dashboard
  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/dashboard" replace />;
      case "editor":
        return <Navigate to="/editor" replace />;
      case "reporter":
        return <Navigate to="/reporter" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

/* ===============================
   🚀 ROUTES
================================ */
const App = () => {
  return (
    <Routes>
      {/* ===== PUBLIC ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===== AUTHENTICATED AREA ===== */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* ===== ADMIN ===== */}
        <Route
          path="/dashboard"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Dashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/news"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <News />
            </RoleRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Categories />
            </RoleRoute>
          }
        />
        <Route
          path="/users"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Users />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminRequests />
            </RoleRoute>
          }
        />

        {/* ===== REPORTER ===== */}
        <Route
          path="/reporter"
          element={
            <RoleRoute allowedRoles={["reporter"]}>
              <ReporterDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/reporter/history"
          element={
            <RoleRoute allowedRoles={["reporter"]}>
              <PostHistory />
            </RoleRoute>
          }
        />

        {/* ===== EDITOR ===== */}
        <Route
          path="/editor"
          element={
            <RoleRoute allowedRoles={["editor"]}>
              <EditorDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/editor/history"
          element={
            <RoleRoute allowedRoles={["editor"]}>
              <PostHistory />
            </RoleRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
