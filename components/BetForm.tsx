'use client';

import { useState } from 'react';

export function BetForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ player: '', market: '', odds: -110, stake: 1 });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/bets', { method: 'POST', body: JSON.stringify(form) });
    setForm({ player: '', market: '', odds: -110, stake: 1 });
    onCreated();
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3 style={{ marginTop: 0 }}>Log Bet</h3>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}>
        <input className="btn" placeholder="Player" value={form.player} onChange={(e) => setForm({ ...form, player: e.target.value })} required />
        <input className="btn" placeholder="Market" value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })} required />
        <input className="btn" type="number" value={form.odds} onChange={(e) => setForm({ ...form, odds: Number(e.target.value) })} required />
        <input className="btn" type="number" step="0.01" min="0" value={form.stake} onChange={(e) => setForm({ ...form, stake: Number(e.target.value) })} required />
      </div>
      <button className="btn brand" style={{ marginTop: '.8rem' }} type="submit">Save Bet</button>
    </form>
  );
}
