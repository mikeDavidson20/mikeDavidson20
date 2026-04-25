import { notFound } from "next/navigation";
import { getStockDetails } from "@/lib/screener";

export default function StockDetailsPage({ params }: { params: { ticker: string } }) {
  const detail = getStockDetails(params.ticker);

  if (!detail) {
    notFound();
  }

  return (
    <section className="stack-lg">
      <div className="card">
        <h2>
          {detail.name} ({detail.symbol})
        </h2>
        <p>{detail.synopsis}</p>
      </div>

      <div className="card">
        <h3>Signal Summary</h3>
        <ul>
          <li>Signal: {detail.signal}</li>
          <li>Confidence: {detail.confidence}%</li>
          <li>Current Price: ${detail.price.toFixed(2)}</li>
          <li>Daily Estimate: ${detail.estimates.daily.toFixed(2)}</li>
          <li>Weekly Estimate: ${detail.estimates.weekly.toFixed(2)}</li>
          <li>Monthly Estimate: ${detail.estimates.monthly.toFixed(2)}</li>
        </ul>
      </div>

      <div className="card">
        <h3>Latest News</h3>
        <ul>
          {detail.latestNews.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {detail.optionsIdeas.length > 0 && (
        <div className="card">
          <h3>Options Ideas</h3>
          <ul>
            {detail.optionsIdeas.map((idea) => (
              <li key={idea.contract}>
                {idea.contract}: {idea.signal} ({idea.rationale})
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
