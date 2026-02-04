import { useEffect, useMemo, useState } from "react";
import { getLatestNews, getTrendingNews } from "../api/news.api";
import Loader from "../components/common/Loader";
import NewsList from "../components/news/NewsList";
import BreakingNews from "../components/news/BreakingNews";
import { Link } from "react-router-dom";
import { truncateText } from "../utils/truncateText";
import { formatDate } from "../utils/formatDate";

const Home = () => {
  const [latest, setLatest] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getLatestNews(), getTrendingNews()])
      .then(([latestRes, trendingRes]) => {
        setLatest(Array.isArray(latestRes.data) ? latestRes.data : []);
        setTrending(Array.isArray(trendingRes.data) ? trendingRes.data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const featured = useMemo(() => latest[0], [latest]);
  const restLatest = useMemo(() => latest.slice(1), [latest]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-10">
      <BreakingNews />

      <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl bg-slate-900 text-white p-8 shadow-xl relative overflow-hidden">
          {featured?.images?.[0] && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${featured.images[0]})` }}
            />
          )}
          {featured?.image && !featured?.images?.[0] && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${featured.image})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/90" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#38bdf8_0%,_transparent_55%)]" />
          <div className="relative z-10">
            <span className="badge badge-trend">Featured</span>
            <h1 className="mt-4 text-3xl md:text-4xl font-semibold">
              {featured?.title || "Your daily briefing starts here"}
            </h1>
            <p className="mt-4 text-slate-200">
              {featured
                ? truncateText(featured.content, 180)
                : "Fresh reporting, sharp analysis, and stories crafted for clarity. Start your morning with what matters most."}
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-300">
              {featured && (
                <>
                  <span>{featured.author?.name || featured.author || "Desk"}</span>
                  <span>{formatDate(featured.createdAt)}</span>
                </>
              )}
            </div>
            {featured && (
              <Link
                to={`/news/${featured._id}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900"
              >
                Read feature
                <span>→</span>
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass card-shadow rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-slate-900">Editorial picks</h2>
            <p className="text-sm text-slate-600 mt-1">Top stories curated for you.</p>
            <div className="mt-4 space-y-4">
              {trending.slice(0, 4).map((item) => (
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
            <h3 className="text-sm font-semibold text-slate-900">Newsroom pulse</h3>
            <p className="text-sm text-slate-600 mt-2">
              Stay ahead with live updates, contextual explainers, and reporter notes.
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
              <span className="badge badge-trend">Live</span>
              <span>Updates every 30 minutes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Latest stories</h2>
            <p className="text-sm text-slate-600">Fresh coverage from our desks.</p>
          </div>
          <Link
            to="/search"
            className="text-sm font-semibold text-slate-900 hover:text-amber-600"
          >
            Explore all →
          </Link>
        </div>

        {restLatest.length ? (
          <NewsList news={restLatest} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
            New stories are landing soon.
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
