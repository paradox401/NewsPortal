import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (token && user?.role) {
      switch (user.role) {
        case "admin":
          navigate("/dashboard", { replace: true });
          break;
        case "editor":
          navigate("/editor", { replace: true });
          break;
        case "reporter":
          navigate("/reporter", { replace: true });
          break;
        default:
          navigate("/dashboard", { replace: true });
      }
    }
  }, [token, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">NewsPortal</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to manage newsrooms, approvals, and publishing.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Email</label>
            <input
              type="email"
              placeholder="you@newsportal.com"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-500">
          Need a reporter/editor account?{" "}
          <Link className="font-semibold text-slate-900" to="/register">
            Request access
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
