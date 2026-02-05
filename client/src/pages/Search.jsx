import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchNews, getTrendingNews } from "../api/news.api";
import NewsList from "../components/news/NewsList";
import { Link } from "react-router-dom";
import { truncateText } from "../utils/truncateText";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const fromParam = searchParams.get("from") || "";
  const toParam = searchParams.get("to") || "";

  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(query);
  const [category, setCategory] = useState(categoryParam);
  const [fromDate, setFromDate] = useState(fromParam);
  const [toDate, setToDate] = useState(toParam);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    Promise.all([
      searchNews({
        q: query,
        category: categoryParam || undefined,
        from: fromParam || undefined,
        to: toParam || undefined,
      }),
      getTrendingNews(),
    ])
      .then(([res, trendingRes]) => {
        setResults(Array.isArray(res.data) ? res.data : []);
        setTrending(Array.isArray(trendingRes.data) ? trendingRes.data : []);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSearchParams({
      q: input.trim(),
      category: category || "",
      from: fromDate || "",
      to: toDate || "",
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[3fr_1.2fr]">
      <section className="space-y-6">
        <div className="rounded-3xl bg-white/80 p-6 shadow-sm">
          <p className="badge badge-latest">Search</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Find the story</h1>
          <p className="mt-2 text-sm text-slate-600">
            Search our archive and stay updated with tailored results.
          </p>
          <form onSubmit={handleSearch} className="mt-5 grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search news..."
              className="rounded-full border border-slate-300/60 px-4 py-2 text-sm"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border border-slate-300/60 px-4 py-2 text-sm"
            >
              <option value="">All categories</option>
              {["Politics", "Business", "Technology", "Sports", "Entertainment", "General"].map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-full border border-slate-300/60 px-4 py-2 text-sm"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-full border border-slate-300/60 px-4 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-10 text-center text-slate-500">
            Searching...
          </div>
        ) : results.length ? (
          <NewsList news={results} />
        ) : query ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
            No results found for "{query}".
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
            Start by typing a keyword above.
          </div>
        )}
      </section>

      <aside className="space-y-5">
        <div className="glass card-shadow rounded-2xl p-5">
          <h3 className="text-lg font-semibold">Trending</h3>
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
      </aside>
    </div>
  );
};

export default Search;
