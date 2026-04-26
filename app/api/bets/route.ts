import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

export async function GET() {
  const { data, error } = await supabaseAdmin.from('bets').select('*').eq('user_id', DEMO_USER_ID).order('placed_at', { ascending: true });
  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const bet = {
    user_id: DEMO_USER_ID,
    player: payload.player,
    market: payload.market,
    odds: Number(payload.odds),
    stake: Number(payload.stake),
    result: 'open' as const
  };

  const { data, error } = await supabaseAdmin.from('bets').insert(bet).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
