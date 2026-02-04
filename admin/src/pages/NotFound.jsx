import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="card p-10 text-center">
      <p className="badge badge-danger">404</p>
      <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 text-slate-600">
        The admin view you’re looking for doesn’t exist.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
      >
        Back to dashboard
      </Link>
    </div>
  );
};

export default NotFound;
