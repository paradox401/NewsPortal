import NewsCard from "./NewsCard";

const NewsList = ({ news }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((item, index) => (
        <div key={item._id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
          <NewsCard news={item} />
        </div>
      ))}
    </div>
  );
};

export default NewsList;
