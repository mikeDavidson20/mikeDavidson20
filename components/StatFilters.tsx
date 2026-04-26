'use client';

export function StatFilters({
  player,
  stat,
  onPlayer,
  onStat
}: {
  player: string;
  stat: string;
  onPlayer: (v: string) => void;
  onStat: (v: string) => void;
}) {
  return (
    <div className="card" style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
      <input className="btn" placeholder="Player name" value={player} onChange={(e) => onPlayer(e.target.value)} />
      <select className="btn" value={stat} onChange={(e) => onStat(e.target.value)}>
        <option value="points">Points</option>
        <option value="rebounds">Rebounds</option>
        <option value="assists">Assists</option>
        <option value="pra">PRA</option>
      </select>
    </div>
  );
}
