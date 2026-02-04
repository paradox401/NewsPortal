import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import api from "../../api/axios";

const fallbackCategories = [
  "Politics",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState(fallbackCategories);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        const res = await api.get("/public/categories");
        const data = Array.isArray(res.data) ? res.data : [];
        if (!active) return;

        const names = data
          .filter((c) => c?.name)
          .map((c) => c.name);

        setCategories(names.length ? names : fallbackCategories);
      } catch {
        if (active) setCategories(fallbackCategories);
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  const navCategories = useMemo(() => categories.slice(0, 6), [categories]);

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-slate-200/40">
        <div className="container-xl px-4 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold">
              NP
            </span>
            <div className="leading-tight">
              <p className="text-lg font-semibold text-slate-900">NewsNepal</p>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Daily Brief</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navCategories.map((cat) => (
              <NavLink
                key={cat}
                to={`/category/${cat.toLowerCase()}`}
                className={({ isActive }) =>
                  isActive
                    ? "text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 transition"
                }
              >
                {cat}
              </NavLink>
            ))}

            <Link
              to="/search"
              className="ml-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow hover:translate-y-[-1px] transition"
            >
              Search
              <span className="text-xs text-amber-200">⌘K</span>
            </Link>
          </nav>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-300/60 text-slate-700"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden glass border-b border-slate-200/40">
          <div className="container-xl px-4 pb-6 pt-2 space-y-3">
            {navCategories.map((cat) => (
              <NavLink
                key={cat}
                to={`/category/${cat.toLowerCase()}`}
                className={({ isActive }) =>
                  isActive
                    ? "block text-slate-900 font-semibold"
                    : "block text-slate-600 hover:text-slate-900 transition"
                }
              >
                {cat}
              </NavLink>
            ))}

            <Link
              to="/search"
              className="inline-flex items-center justify-center w-full rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
            >
              Search
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
