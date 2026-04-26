import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { env } from '@/lib/env';

const client = new OpenAI({ apiKey: env.openaiApiKey });

export async function POST(req: NextRequest) {
  const { player, market, odds, trend, ev } = await req.json();
  const prompt = `Write a 2-sentence betting insight for ${player} ${market}. Odds: ${odds}. Trend: ${trend}. EV: ${ev}.`;

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }]
  });

  return NextResponse.json({ insight: completion.choices[0]?.message?.content ?? 'No insight available.' });
}
