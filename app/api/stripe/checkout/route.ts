import { NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';
import { env } from '@/lib/env';

export async function POST() {
  if (!env.stripePricePro) {
    return NextResponse.json({ error: 'Missing STRIPE_PRICE_PRO' }, { status: 500 });
  }

  const stripe = getStripeClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: env.stripePricePro, quantity: 1 }],
    success_url: `${appUrl}/account?upgraded=true`,
    cancel_url: `${appUrl}/pricing?canceled=true`
  });
  return NextResponse.json({ url: session.url });
}
