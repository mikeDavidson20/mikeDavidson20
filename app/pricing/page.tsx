'use client';

export default function PricingPage() {
  const checkout = async () => {
    const res = await fetch('/api/stripe/checkout', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <main className="container" style={{ paddingBottom: '3rem' }}>
      <h1>Pricing</h1>
      <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
        <article className="card">
          <h3>Free</h3>
          <p style={{ color: 'var(--muted)' }}>$0 / month</p>
          <ul style={{ color: 'var(--muted)' }}><li>Core player dashboard</li><li>Limited EV scans/day</li></ul>
        </article>
        <article className="card">
          <h3>Pro</h3>
          <p style={{ color: 'var(--muted)' }}>$29 / month</p>
          <ul style={{ color: 'var(--muted)' }}><li>Unlimited EV scans</li><li>AI insight generation</li><li>Advanced bet tracking</li></ul>
          <button className="btn brand" onClick={checkout}>Upgrade to Pro</button>
        </article>
      </section>
    </main>
  );
}
