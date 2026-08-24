-- ============================================================================
-- 20260824000000_initial_schema.sql
-- Baseline: production schema as it stands on 2026-08-24.
--
-- Columns, types, defaults and NOT NULL were captured from the live
-- PostgREST OpenAPI document (project yayibykeqisxguyvowoq). Constraints
-- that PostgREST does not expose (CHECK, FK, RLS policies) are recorded as
-- designed — run the verification query in supabase/README.md once and fix
-- any drift here, in this file, before adding a second migration.
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
  id                 uuid        primary key references auth.users (id) on delete cascade,
  email              text        not null,
  display_name       text,
  country            text,
  timezone           text,
  stripe_customer_id text,
  preferred_language text        not null default 'en',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint profiles_preferred_language_check
    check (preferred_language in ('en', 'cs'))
);

-- ----------------------------------------------------------------------------
-- plans — one row per paid Stripe checkout session.
--
-- plan_data is NOT NULL and carries lifecycle markers (see src/lib/planState.ts):
--   { pending: true, started_at }  reserved before the Anthropic call
--   { error, detail }              generation failed after retry
--   { phenotypeId, ... }           ProPlanV2 (current)
--   { summary, ... }               legacy ProPlan (v1)
-- ----------------------------------------------------------------------------
create table if not exists public.plans (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users (id) on delete cascade,
  tier              text        not null,
  answers           jsonb       not null,
  plan_data         jsonb       not null,
  language          text        not null default 'en',
  stripe_session_id text,
  created_at        timestamptz not null default now(),
  constraint plans_language_check
    check (language in ('en', 'cs'))
);

create index if not exists plans_user_id_created_at_idx
  on public.plans (user_id, created_at desc);

-- The webhook's idempotency check looks rows up by stripe_session_id.
create index if not exists plans_stripe_session_id_idx
  on public.plans (stripe_session_id);

-- ----------------------------------------------------------------------------
-- subscriptions — Coach tier, mirrored from Stripe subscription events.
-- ----------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id                     uuid        primary key default gen_random_uuid(),
  user_id                uuid        not null references auth.users (id) on delete cascade,
  stripe_subscription_id text        not null unique,
  stripe_customer_id     text        not null,
  tier                   text        not null,
  status                 text        not null,
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean     not null default false,
  canceled_at            timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx
  on public.subscriptions (user_id);

-- ----------------------------------------------------------------------------
-- Row Level Security.
-- Server code uses the service key (bypasses RLS). Browser/SSR user clients
-- read only their own rows; all writes go through the service key.
-- ----------------------------------------------------------------------------
alter table public.profiles      enable row level security;
alter table public.plans         enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "profiles: read own"  on public.profiles;
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "plans: read own" on public.plans;
create policy "plans: read own" on public.plans
  for select using (auth.uid() = user_id);

drop policy if exists "subscriptions: read own" on public.subscriptions;
create policy "subscriptions: read own" on public.subscriptions
  for select using (auth.uid() = user_id);
