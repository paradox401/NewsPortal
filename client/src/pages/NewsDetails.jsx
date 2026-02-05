import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSingleNews } from "../api/news.api";
import { formatDate } from "../utils/formatDate";
import { truncateText } from "../utils/truncateText";

const estimateReadingTime = (text = "") => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const NewsDetails = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSingleNews(id)
      .then((res) => setNews(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!news) return;
    const title = `${news.title} | NewsPortal`;
    const description = news.content ? news.content.slice(0, 160) : "";
    document.title = title;

    const upsertMeta = (name, content, attr = "name") => {
      let tag = document.querySelector(`meta[${attr}=\"${name}\"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    upsertMeta("description", description);
    upsertMeta("og:title", title, "property");
    upsertMeta("og:description", description, "property");
    upsertMeta("og:type", "article", "property");
    if (news.image || news.images?.[0]) {
      upsertMeta("og:image", news.image || news.images?.[0], "property");
    }
  }, [news]);

  const readingTime = useMemo(
    () => estimateReadingTime(news?.content || ""),
    [news]
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-10 text-center text-slate-500">
        Loading article...
      </div>
    );
  }

  if (!news) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
        Article not found.
      </div>
    );
  }

  const image = news.image || news.images?.[0];

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <div className="rounded-3xl bg-white/80 p-6 shadow-sm">
        <Link
          to={`/category/${(news.category || "general").toLowerCase()}`}
          className="badge badge-latest"
        >
          {news.category || "General"}
        </Link>
        <h1 className="mt-4 text-3xl md:text-4xl font-semibold text-slate-900">
          {news.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
          <span>{news.author?.name || news.author || "Desk"}</span>
          <span>{formatDate(news.createdAt)}</span>
          <span>{readingTime} min read</span>
        </div>
      </div>

      {image && (
        <div className="overflow-hidden rounded-3xl">
          <img src={image} alt={news.title} className="w-full object-cover" />
        </div>
      )}

      <div className="rounded-3xl bg-white/80 p-8 shadow-sm">
        <div className="prose max-w-none text-slate-700">
          {(news.content || "").split("\n").map((para, index) => (
            <p key={index} className="mb-6 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-200/60 bg-white/80 p-6 text-sm text-slate-600 md:grid-cols-[2fr_1fr]">
        <div>
          <p className="text-slate-900 font-semibold">Want more context?</p>
          <p className="mt-1">
            Explore related coverage and live updates from the same desk.
          </p>
        </div>
        <Link
          to={`/search?q=${encodeURIComponent(truncateText(news.title, 40))}`}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
        >
          Search related
        </Link>
      </div>
    </article>
  );
};

export default NewsDetails;
