import { marketNews } from "@/lib/screener";

export default function NewsPage() {
  return (
    <section className="stack-lg">
      <h2>Overall Market News</h2>
      <div className="news-grid">
        {marketNews.map((story) => (
          <article key={story.title} className="card">
            <p className="meta">
              {story.source} · {story.date}
            </p>
            <h3>{story.title}</h3>
            <p>{story.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
