export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  stripePricePro: process.env.STRIPE_PRICE_PRO ?? '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  oddsApiKey: process.env.ODDS_API_KEY ?? '',
  nbaApiKey: process.env.NBA_API_KEY ?? '',
  openaiApiKey: process.env.OPENAI_API_KEY ?? ''
};
