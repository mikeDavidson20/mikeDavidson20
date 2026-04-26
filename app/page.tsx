import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <section className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '.4rem' }}>Bet Smarter with NBA Props + EV</h1>
          <p style={{ color: 'var(--muted)', maxWidth: 580 }}>
            PropEdge combines player trends, live odds, expected value calculations, and AI explanations into one modern dashboard.
          </p>
          <div style={{ display: 'flex', gap: '.7rem', marginTop: '1rem' }}>
            <Link className="btn brand" href="/auth">Start Free</Link>
            <Link className="btn" href="/pricing">View Pricing</Link>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>What you get</h3>
          <ul style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
            <li>NBA player props dashboard with 5/10 game trends</li>
            <li>Odds comparison across books + positive EV alerts</li>
            <li>Bet tracker with ROI, win rate, and bankroll chart</li>
            <li>AI insight summaries to explain each pick</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
