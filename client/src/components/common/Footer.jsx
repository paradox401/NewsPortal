const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200/60 bg-white/70">
      <div className="container-xl px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-slate-900">NewsNepal</p>
          <p className="text-sm text-slate-600 mt-2">
            Independent reporting, real-time insights, and the stories shaping your world.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Contact</p>
          <p className="text-sm text-slate-600 mt-2">sandeshsapkota371@gmail.com</p>
          <p className="text-sm text-slate-600 mt-2">+977 9861621039</p>
          <p className="text-sm text-slate-600">Hetauda · Remote Desk</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Newsletter</p>
          <p className="text-sm text-slate-600 mt-2">Get a curated brief every morning.</p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 rounded-full border border-slate-300/60 px-4 py-2 text-sm"
            />
            <button
              type="button"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-slate-200/60 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} NewsNepal. Crafted for clarity.
      </div>
    </footer>
  );
};

export default Footer;
