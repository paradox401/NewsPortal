import { useEffect, useState } from "react";
import { getBreakingNews } from "../../api/news.api";
import { Link } from "react-router-dom";

const BreakingNews = () => {
  const [breaking, setBreaking] = useState([]);

  useEffect(() => {
    let active = true;
    getBreakingNews()
      .then((res) => {
        if (!active) return;
        setBreaking(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (active) setBreaking([]);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!breaking.length) return null;

  return (
    <div className="glass card-shadow rounded-2xl px-5 py-4 mb-8 fade-in">
      <div className="flex items-center gap-3">
        <span className="badge badge-signal">Breaking</span>
        <div className="marquee">
          <div className="marquee-track">
            {[...breaking, ...breaking].map((item, index) => (
              <Link
                key={`${item._id}-${index}`}
                to={`/news/${item._id}`}
                className="marquee-item"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
