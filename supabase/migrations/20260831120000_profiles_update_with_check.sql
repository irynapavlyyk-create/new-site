-- ============================================================================
-- 20260831120000_profiles_update_with_check.sql
--
-- "Users can update own profile" was created as
--   for update using (auth.uid() = id)
-- without a WITH CHECK clause. USING filters which existing rows the UPDATE
-- may touch; WITH CHECK validates the row AFTER the update. Without it, a
-- holder of the publishable key could rewrite id, email, or
-- stripe_customer_id in their own row to arbitrary values — and
-- stripe_customer_id is what the webhook uses to find the owner of a
-- subscription (handleSubscriptionEvent), so a forged value hijacks another
-- customer's subscription linkage.
--
-- Recreate the policy with WITH CHECK (auth.uid() = id): the updated row must
-- still belong to the caller, which pins id (and with it the unique email /
-- stripe_customer_id rewrite becomes pointless for takeover, since the row
-- can no longer be re-pointed at someone else's identity).
--
-- Safe to apply: every application write to profiles goes through the
-- service-role client (src/app/api/webhook/route.ts via
-- src/utils/supabase/admin.ts), which bypasses RLS entirely. No user-context
-- code path in src/ updates profiles today, so nothing depends on the old,
-- looser policy.
--
-- NOTE: apply to production via the Supabase SQL editor (same as
-- 20260824180000), shell writes to prod are blocked.
-- ============================================================================

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
