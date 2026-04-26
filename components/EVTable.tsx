import { calculateEV } from '@/lib/ev';

type OddsRow = {
  player: string;
  market: string;
  sportsbook: string;
  odds: number;
  trueProbability: number;
};

export function EVTable({ rows }: { rows: OddsRow[] }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Positive EV Scanner</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Player</th><th>Market</th><th>Book</th><th>Odds</th><th>EV</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const ev = calculateEV(row.odds, row.trueProbability);
            return (
              <tr key={`${row.player}-${row.market}-${row.sportsbook}`}>
                <td>{row.player}</td>
                <td>{row.market}</td>
                <td>{row.sportsbook}</td>
                <td>{row.odds > 0 ? `+${row.odds}` : row.odds}</td>
                <td>
                  <span className={`badge ${ev > 0 ? 'positive' : 'negative'}`}>
                    {(ev * 100).toFixed(2)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
