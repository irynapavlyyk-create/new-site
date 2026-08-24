-- ============================================================================
-- 20260824000000_initial_schema.sql
-- Baseline: production schema as it stands on 2026-08-24
-- (project EnergyForge, ref yayibykeqisxguyvowoq).
--
-- Columns/types/defaults/NOT NULL were read from the live PostgREST OpenAPI.
-- Constraints, policies and indexes were reconciled against the output of
-- pg_constraint / pg_policies / pg_indexes run in the SQL editor (see
-- supabase/README.md). Constraint and index NAMES match production exactly.
--
-- This file is a RECORD of what already exists in production. Do NOT run it
-- against production. It is idempotent so it can be applied to an empty
-- (local / staging) project to recreate the same schema.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- profiles — one row per auth user; upserted by the Stripe webhook.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id                 uuid        not null,
  email              text        not null,
  display_name       text,
  country            text,
  timezone           text,
  stripe_customer_id text,
  preferred_language text        not null default 'en',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade,
  constraint profiles_email_key unique (email),
  constraint profiles_stripe_customer_id_key unique (stripe_customer_id),
  constraint profiles_preferred_language_check
    check (preferred_language = any (array['en'::text, 'cs'::text]))
);

-- ----------------------------------------------------------------------------
-- plans — one row per paid Stripe checkout session.
--
-- plan_data is NOT NULL and carries lifecycle markers (see src/lib/planState.ts):
--   { pending: true, started_at }  reserved before the Anthropic call
--   { error, detail }              generation failed after retry
--   { phenotypeId, ... }           ProPlanV2 (current)
--   { summary, ... }               legacy ProPlan (v1)
--
-- stripe_session_id is UNIQUE: the webhook's idempotency lookup is backed by
-- a real constraint, so a duplicate insert for the same session is rejected
-- by the database, not just avoided by the lookup.
-- ----------------------------------------------------------------------------
create table if not exists public.plans (
  id                uuid        not null default gen_random_uuid(),
  user_id           uuid        not null,
  tier              text        not null,
  answers           jsonb       not null,
  plan_data         jsonb       not null,
  language          text        not null default 'en',
  stripe_session_id text,
  created_at        timestamptz not null default now(),
  constraint plans_pkey primary key (id),
  constraint plans_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint plans_stripe_session_id_key unique (stripe_session_id),
  constraint plans_language_check
    check (language = any (array['en'::text, 'cs'::text])),
  constraint plans_tier_check
    check (tier = any (array['starter'::text, 'pro'::text, 'coach'::text]))
);

create index if not exists idx_plans_user_id        on public.plans (user_id);
create index if not exists idx_plans_stripe_session on public.plans (stripe_session_id);

-- ----------------------------------------------------------------------------
-- subscriptions — Coach tier, mirrored from Stripe subscription events.
-- ----------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id                     uuid        not null default gen_random_uuid(),
  user_id                uuid        not null,
  stripe_subscription_id text        not null,
  stripe_customer_id     text        not null,
  tier                   text        not null,
  status                 text        not null,
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean     not null default false,
  canceled_at            timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  constraint subscriptions_pkey primary key (id),
  constraint subscriptions_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint subscriptions_stripe_subscription_id_key unique (stripe_subscription_id),
  constraint subscriptions_tier_check
    check (tier = any (array['pro'::text, 'coach'::text])),
  constraint subscriptions_status_check
    check (status = any (array['active'::text, 'past_due'::text, 'canceled'::text, 'incomplete'::text, 'trialing'::text]))
);

create index if not exists idx_subscriptions_user_id         on public.subscriptions (user_id);
create index if not exists idx_subscriptions_stripe_customer on public.subscriptions (stripe_customer_id);

-- ----------------------------------------------------------------------------
-- Row Level Security — policy names match production.
-- Server code uses the service key (bypasses RLS regardless); the
-- "Service role" policies exist so explicit-role clients can write.
-- Browser/SSR user clients read (and for profiles, update) only their own rows.
-- ----------------------------------------------------------------------------
alter table public.profiles      enable row level security;
alter table public.plans         enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Service role can insert profiles" on public.profiles;
create policy "Service role can insert profiles" on public.profiles
  for insert with check (true);

drop policy if exists "Users can view own plans" on public.plans;
create policy "Users can view own plans" on public.plans
  for select using (auth.uid() = user_id);

drop policy if exists "Service role can insert plans" on public.plans;
create policy "Service role can insert plans" on public.plans
  for insert with check (true);

drop policy if exists "Service role can update plans" on public.plans;
create policy "Service role can update plans" on public.plans
  for update using (true);

drop policy if exists "Users can view own subscriptions" on public.subscriptions;
create policy "Users can view own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "Service role can manage subscriptions" on public.subscriptions;
create policy "Service role can manage subscriptions" on public.subscriptions
  for all using (true);
