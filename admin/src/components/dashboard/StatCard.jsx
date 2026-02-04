const StatCard = ({ label, value, trend, tone = "info" }) => {
  const toneClass = {
    info: "badge-info",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
  }[tone];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        {trend && <span className={`badge ${toneClass}`}>{trend}</span>}
      </div>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
};

export default StatCard;
