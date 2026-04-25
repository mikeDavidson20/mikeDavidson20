import Link from "next/link";
import { getMarketHeadlineSummary, getScreenerRows } from "@/lib/screener";

export default function Home() {
  const rows = getScreenerRows();
  const summary = getMarketHeadlineSummary();

  return (
    <section className="stack-lg">
      <div className="card">
        <h2>Today&apos;s Overview</h2>
        <p>{summary}</p>
      </div>

      <div className="card">
        <h2>Stocks & Options Signals</h2>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Type</th>
              <th>Signal</th>
              <th>Confidence</th>
              <th>Daily</th>
              <th>Weekly</th>
              <th>Monthly</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.symbol + row.kind}>
                <td>{row.symbol}</td>
                <td>{row.kind}</td>
                <td>
                  <span className={row.signal === "Buy" ? "badge-buy" : "badge-sell"}>
                    {row.signal}
                  </span>
                </td>
                <td>{row.confidence}%</td>
                <td>${row.estimates.daily.toFixed(2)}</td>
                <td>${row.estimates.weekly.toFixed(2)}</td>
                <td>${row.estimates.monthly.toFixed(2)}</td>
                <td>
                  <Link href={`/stocks/${row.symbol}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
