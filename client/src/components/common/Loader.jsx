const Loader = ({ count = 6 }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl bg-white/70 p-4 shadow-sm"
          >
            <div className="h-40 rounded-xl bg-slate-200" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-5/6 rounded bg-slate-200" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default Loader;
