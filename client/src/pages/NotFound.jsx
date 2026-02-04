import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="rounded-3xl bg-white/80 p-10 shadow-sm">
        <p className="badge badge-signal">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">
          The story you’re looking for moved or never existed.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
          >
            Go home
          </Link>
          <Link
            to="/search"
            className="rounded-full border border-slate-300/60 px-5 py-2 text-sm font-semibold text-slate-700"
          >
            Search news
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
