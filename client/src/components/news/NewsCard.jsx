import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { truncateText } from "../../utils/truncateText";

const NewsCard = ({ news }) => {
  const image = news.image || news.images?.[0] || "/vite.svg";

return (
    <Link
        to={`/news/${news._id}`}
        className="group flex flex-col overflow-hidden rounded-2xl bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
        <div className="relative h-48 overflow-hidden">
            <img
                src={image}
                alt={news.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 badge badge-latest" style={{ backgroundColor: "#aed81d" }}>
                {news.category || "General"}
            </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
            <h3 className="text-lg font-semibold text-slate-900">
                {truncateText(news.title, 80)}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
                {truncateText(news.content, 110)}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{news.author?.name || news.author || "Desk"}</span>
                <span>{formatDate(news.createdAt)}</span>
            </div>
        </div>
    </Link>
);
};

export default NewsCard;
