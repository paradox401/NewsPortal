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
  const topStories = useMemo(() => restLatest.slice(0, 3), [restLatest]);
  const secondaryStories = useMemo(() => restLatest.slice(3, 9), [restLatest]);
  const quickReads = useMemo(() => restLatest.slice(9, 15), [restLatest]);

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
            <h2 className="text-2xl font-semibold">Top stories</h2>
            <p className="text-sm text-slate-600">The biggest headlines right now.</p>
          </div>
          <span className="badge badge-latest">Today</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {topStories.map((story) => (
            <Link
              key={story._id}
              to={`/news/${story._id}`}
              className="group rounded-3xl bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-40 overflow-hidden rounded-2xl">
                <img
                  src={story.images?.[0] || story.image || "/vite.svg"}
                  alt={story.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <p className="mt-4 text-xs text-slate-500">{story.category || "General"}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {truncateText(story.title, 70)}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {truncateText(story.content, 90)}
              </p>
            </Link>
          ))}
          {!topStories.length && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
              New stories are landing soon.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Latest stories</h2>
            <p className="text-sm text-slate-600">Fresh coverage from our desks.</p>
          </div>

          {secondaryStories.length ? (
            <div className="space-y-4">
              {secondaryStories.map((story) => (
                <Link
                  key={story._id}
                  to={`/news/${story._id}`}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/80 p-4 transition hover:border-slate-300 md:flex-row md:items-center"
                >
                  <div className="h-28 w-full overflow-hidden rounded-2xl md:w-40">
                    <img
                      src={story.images?.[0] || story.image || "/vite.svg"}
                      alt={story.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">{story.category || "General"}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                      {truncateText(story.title, 80)}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {truncateText(story.content, 110)}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                      <span>{story.author?.name || story.author || "Desk"}</span>
                      <span>{formatDate(story.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
              New stories are landing soon.
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="glass card-shadow rounded-2xl p-5">
            <h3 className="text-lg font-semibold">Quick reads</h3>
            <p className="text-sm text-slate-600">Short updates from the newsroom.</p>
            <div className="mt-4 space-y-3">
              {quickReads.map((item) => (
                <Link
                  key={item._id}
                  to={`/news/${item._id}`}
                  className="block rounded-xl border border-slate-200/60 bg-white/70 p-3 transition hover:border-slate-300"
                >
                  <p className="text-xs text-slate-500">{item.category || "General"}</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {truncateText(item.title, 58)}
                  </p>
                </Link>
              ))}
              {!quickReads.length && (
                <p className="text-sm text-slate-500">More updates coming soon.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5">
            <h4 className="text-sm font-semibold text-slate-900">Explore by topic</h4>
            <p className="text-sm text-slate-600 mt-2">
              Dive deeper into the beats you follow most.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Politics", "Business", "Technology", "Sports", "Entertainment"].map((topic) => (
                <Link
                  key={topic}
                  to={`/category/${topic.toLowerCase()}`}
                  className="rounded-full border border-slate-200/60 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-amber-300 hover:text-amber-600"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">More stories</h2>
            <p className="text-sm text-slate-600">Keep exploring the latest coverage.</p>
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
