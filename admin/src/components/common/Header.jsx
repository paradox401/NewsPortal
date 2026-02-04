import { useSelector } from "react-redux";

const Header = ({ title }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="card flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Newsroom</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
          {user?.role?.toUpperCase() || "GUEST"}
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{user?.name || "User"}</p>
          <p className="text-xs text-slate-500">{user?.email || ""}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
