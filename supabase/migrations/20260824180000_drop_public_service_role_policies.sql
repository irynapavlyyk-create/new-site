-- ============================================================================
-- 20260824180000_drop_public_service_role_policies.sql
--
-- The four "Service role can …" policies were created without a TO clause,
-- so they apply to `public` — every role, including anon and authenticated.
-- Effect in production before this migration: any holder of the publishable
-- key could INSERT into plans/profiles, UPDATE any row in plans, and
-- INSERT/UPDATE/DELETE any row in subscriptions.
--
-- Applied to production 2026-08-24 by Iryna (SQL editor).
--
-- The service key bypasses RLS regardless of policies, and every write to
-- plans / profiles / subscriptions in the app goes through the service key
-- (src/utils/supabase/admin.ts). These policies therefore protect nothing
-- and only widen access. Drop them rather than scope them: a policy
-- `to service_role` would be a no-op that invites misreading later.
--
-- Untouched (user-context reads keep working):
--   profiles: "Users can view own profile", "Users can update own profile"
--   plans:    "Users can view own plans"
--   subscriptions: "Users can view own subscriptions"
-- ============================================================================

drop policy if exists "Service role can insert profiles"      on public.profiles;
drop policy if exists "Service role can insert plans"         on public.plans;
drop policy if exists "Service role can update plans"         on public.plans;
drop policy if exists "Service role can manage subscriptions" on public.subscriptions;
