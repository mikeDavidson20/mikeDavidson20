import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
  const { player, market, odds, trend, ev } = await req.json();
  const prompt = `Write a 2-sentence betting insight for ${player} ${market}. Odds: ${odds}. Trend: ${trend}. EV: ${ev}.`;

  if (!env.openaiApiKey) {
    return NextResponse.json({ insight: 'AI insights are unavailable until OPENAI_API_KEY is configured.' });
  }

  const client = new OpenAI({ apiKey: env.openaiApiKey });

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }]
  });

  return NextResponse.json({ insight: completion.choices[0]?.message?.content ?? 'No insight available.' });
}
