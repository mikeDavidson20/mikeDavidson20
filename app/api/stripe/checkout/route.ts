import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { env } from '@/lib/env';

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: env.stripePricePro, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`
  });
  return NextResponse.json({ url: session.url });
}
