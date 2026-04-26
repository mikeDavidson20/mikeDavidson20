export function KpiCards({ roi, winRate, bankroll }: { roi: number; winRate: number; bankroll: number }) {
  const cards = [
    { label: 'ROI', value: `${(roi * 100).toFixed(1)}%` },
    { label: 'Win Rate', value: `${(winRate * 100).toFixed(1)}%` },
    { label: 'Bankroll', value: `$${bankroll.toFixed(2)}` }
  ];

  return (
    <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))' }}>
      {cards.map((c) => (
        <article className="card" key={c.label}>
          <small style={{ color: 'var(--muted)' }}>{c.label}</small>
          <h3 style={{ margin: '.4rem 0 0' }}>{c.value}</h3>
        </article>
      ))}
    </section>
  );
}
