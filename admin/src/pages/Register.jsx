import { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("reporter");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      setMessage(res.data.message);
      setName("");
      setEmail("");
      setPassword("");
      setRole("reporter");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">NewsPortal</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Request access</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create a reporter/editor profile. Admin approval is required.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Name</label>
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Email</label>
            <input
              type="email"
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
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Role</label>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="reporter">Reporter</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          {message && (
            <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Request access"}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-500">
          Already approved? <Link className="font-semibold text-slate-900" to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
