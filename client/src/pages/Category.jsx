import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsByCategory, getTrendingNews } from "../api/news.api";
import NewsList from "../components/news/NewsList";
import { truncateText } from "../utils/truncateText";
import { Link } from "react-router-dom";

const Category = () => {
  const { category } = useParams();
  const [news, setNews] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getNewsByCategory(category), getTrendingNews()])
      .then(([newsRes, trendingRes]) => {
        setNews(Array.isArray(newsRes.data) ? newsRes.data : []);
        setTrending(Array.isArray(trendingRes.data) ? trendingRes.data : []);
      })
      .finally(() => setLoading(false));
  }, [category]);

  const headline = useMemo(
    () => category?.replace(/-/g, " ")?.toUpperCase(),
    [category]
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-10 text-center text-slate-500">
        Loading news...
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[3fr_1.2fr]">
      <section className="space-y-6">
        <div className="rounded-3xl bg-white/80 p-6 shadow-sm">
          <p className="badge badge-latest">Category</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{headline}</h1>
          <p className="mt-2 text-sm text-slate-600">
            Stories curated from our {headline?.toLowerCase()} desk.
          </p>
        </div>

        {news.length ? (
          <NewsList news={news} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
            No stories in this category yet.
          </div>
        )}
      </section>

      <aside className="space-y-5">
        <div className="glass card-shadow rounded-2xl p-5">
          <h3 className="text-lg font-semibold">Trending now</h3>
          <div className="mt-4 space-y-4">
            {trending.map((item) => (
              <Link
                key={item._id}
                to={`/news/${item._id}`}
                className="block rounded-xl border border-slate-200/60 bg-white/70 p-3 transition hover:border-slate-300"
              >
                <p className="text-xs text-slate-500">{item.category || "General"}</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {truncateText(item.title, 60)}
                </p>
              </Link>
            ))}
            {!trending.length && (
              <p className="text-sm text-slate-500">Trending stories will appear here.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5">
          <h4 className="text-sm font-semibold text-slate-900">Tip the newsroom</h4>
          <p className="text-sm text-slate-600 mt-2">
            Share leads and story ideas with our editors.
          </p>
          <button className="mt-4 w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Submit a tip
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Category;
