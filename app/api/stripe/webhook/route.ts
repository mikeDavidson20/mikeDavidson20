import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { env } from '@/lib/env';
import { getStripeClient } from '@/lib/stripe';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    if (!env.stripeWebhookSecret) {
      return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 500 });
    }

    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(body, sig, env.stripeWebhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId = String(session.customer ?? '');
    if (customerId) {
      const supabaseAdmin = getSupabaseAdminClient();
      await supabaseAdmin.from('profiles').update({ subscription_tier: 'pro' }).eq('stripe_customer_id', customerId);
    }
  }

  return NextResponse.json({ ok: true });
}
