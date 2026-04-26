import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const player = searchParams.get('player') ?? 'Jayson Tatum';
  const market = searchParams.get('market') ?? 'points';

  try {
    const url = `https://api.the-odds-api.com/v4/sports/basketball_nba/odds?apiKey=${env.oddsApiKey}&regions=us&markets=player_points&oddsFormat=american`;
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Odds provider unavailable');
    const data = await response.json();

    const rows = (data[0]?.bookmakers ?? []).flatMap((book: Record<string, unknown>) => {
      const markets = ((book.markets as Array<Record<string, unknown>>) ?? []).flatMap((m) =>
        (((m.outcomes as Array<Record<string, unknown>>) ?? []).map((o) => ({
          player: (o.description as string) || player,
          market,
          sportsbook: (book.title as string) || 'book',
          odds: Number(o.price ?? -110),
          trueProbability: 0.53
        })))
      );
      return markets;
    });

    return NextResponse.json(rows.slice(0, 20));
  } catch {
    return NextResponse.json([
      { player, market, sportsbook: 'DraftKings', odds: -108, trueProbability: 0.55 },
      { player, market, sportsbook: 'FanDuel', odds: -112, trueProbability: 0.55 },
      { player, market, sportsbook: 'BetMGM', odds: +100, trueProbability: 0.55 }
    ]);
  }
}
