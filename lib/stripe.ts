import Stripe from 'stripe';
import { env } from './env';

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (!env.stripeSecretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY.');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.stripeSecretKey, { apiVersion: '2024-06-20' });
  }

  return stripeClient;
}
