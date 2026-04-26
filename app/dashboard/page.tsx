'use client';

import { useEffect, useMemo, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BetForm } from '@/components/BetForm';
import { EVTable } from '@/components/EVTable';
import { KpiCards } from '@/components/KpiCards';
import { StatFilters } from '@/components/StatFilters';

type Bet = { id: string; player: string; market: string; odds: number; stake: number; result: 'win' | 'loss' | 'push' | 'open' };

type StatsData = { player: string; statType: string; last5: number[]; last10: number[]; average5: number; average10: number; trend: 'up' | 'down' | 'flat' };

type OddsRow = { player: string; market: string; sportsbook: string; odds: number; trueProbability: number };

export default function DashboardPage() {
  const [player, setPlayer] = useState('Jayson Tatum');
  const [stat, setStat] = useState('points');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [odds, setOdds] = useState<OddsRow[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);

  const load = async () => {
    const [statsRes, oddsRes, betsRes] = await Promise.all([
      fetch(`/api/stats?player=${encodeURIComponent(player)}&stat=${stat}`),
      fetch(`/api/odds?player=${encodeURIComponent(player)}&market=${stat}`),
      fetch('/api/bets')
    ]);
    setStats(await statsRes.json());
    setOdds(await oddsRes.json());
    setBets(await betsRes.json());
  };

  useEffect(() => {
    void load();
  }, [player, stat]);

  const summary = useMemo(() => {
    const settled = bets.filter((b) => b.result === 'win' || b.result === 'loss');
    const totalStake = settled.reduce((s, b) => s + b.stake, 0);
    const pnl = settled.reduce((sum, b) => sum + (b.result === 'win' ? b.stake * (b.odds > 0 ? b.odds / 100 : 100 / Math.abs(b.odds)) : -b.stake), 0);
    const roi = totalStake ? pnl / totalStake : 0;
    const winRate = settled.length ? settled.filter((b) => b.result === 'win').length / settled.length : 0;
    return { roi, winRate, bankroll: 1000 + pnl };
  }, [bets]);

  const bankrollSeries = useMemo(() => {
    let bank = 1000;
    return bets.map((b, i) => {
      if (b.result === 'win') bank += b.stake * (b.odds > 0 ? b.odds / 100 : 100 / Math.abs(b.odds));
      if (b.result === 'loss') bank -= b.stake;
      return { i: i + 1, bankroll: Number(bank.toFixed(2)) };
    });
  }, [bets]);

  return (
    <main className="container" style={{ paddingBottom: '3rem' }}>
      <h1>Dashboard</h1>
      <StatFilters player={player} stat={stat} onPlayer={setPlayer} onStat={setStat} />

      {stats && (
        <section className="grid" style={{ marginTop: '1rem', gridTemplateColumns: '2fr 1fr' }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{stats.player} {stats.statType} Trend</h3>
            <p style={{ color: 'var(--muted)' }}>Last 5 Avg: {stats.average5.toFixed(1)} | Last 10 Avg: {stats.average10.toFixed(1)} | Trend: {stats.trend}</p>
            <div style={{ height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={stats.last10.map((v, i) => ({ game: i + 1, value: v }))}>
                  <XAxis dataKey="game" /><YAxis /><Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#7c8cff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <KpiCards roi={summary.roi} winRate={summary.winRate} bankroll={summary.bankroll} />
        </section>
      )}

      <section style={{ marginTop: '1rem' }}><EVTable rows={odds} /></section>

      <section className="grid" style={{ marginTop: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        <BetForm onCreated={load} />
        <div className="card" style={{ height: 320 }}>
          <h3 style={{ marginTop: 0 }}>Bankroll Chart</h3>
          <ResponsiveContainer>
            <LineChart data={bankrollSeries}>
              <XAxis dataKey="i" /><YAxis /><Tooltip />
              <Line type="monotone" dataKey="bankroll" stroke="#2bd67b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
}
