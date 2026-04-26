# PropEdge SaaS (Next.js + Supabase + Stripe)

Production-ready full-stack SaaS starter for NBA player props analytics.

## Stack
- Next.js App Router + TypeScript
- Supabase auth/database (email magic link)
- Stripe subscriptions (Free + Pro)
- OpenAI insights generation
- Responsive dark UI

## Pages
- `/` Landing page
- `/dashboard` Player props + EV + bet tracker
- `/pricing` Plan selection + checkout
- `/account` Account/tier details
- `/auth` Email login

## API Routes
- `GET /api/stats`
- `GET /api/odds`
- `POST /api/ev`
- `GET/POST /api/bets`
- `POST /api/insights`
- `POST /api/stripe/checkout`
- `POST /api/stripe/webhook`

## Environment Variables
Copy `.env.example` to `.env.local` and populate values.

## Local Development
```bash
npm install
npm run dev
```

## Supabase SQL
Create tables:
- `profiles(id uuid pk, email text, subscription_tier text default 'free', stripe_customer_id text null)`
- `bets(id uuid default gen_random_uuid() pk, user_id uuid, player text, market text, odds numeric, stake numeric, result text default 'open', placed_at timestamptz default now())`

Add RLS policies to restrict rows by `auth.uid()` in production.
