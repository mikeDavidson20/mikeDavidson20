import { NextRequest, NextResponse } from 'next/server';
import { calculateEV } from '@/lib/ev';

export async function POST(req: NextRequest) {
  const { odds, trueProbability } = await req.json();
  const ev = calculateEV(Number(odds), Number(trueProbability));
  return NextResponse.json({ ev, positive: ev > 0 });
}
