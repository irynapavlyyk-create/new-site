# Database schema & migrations

Schema lives in `supabase/migrations/`, one timestamped SQL file per change.
`20260824000000_initial_schema.sql` is the **baseline**: a record of what
production already had on 2026-08-24. Everything after it is a delta.

We do **not** use the Supabase CLI or `supabase db push`. Migrations are
applied by hand in the Supabase dashboard SQL editor. That is fine as long as
every change goes through a file in this folder first — the folder is the
source of truth, the dashboard is just how it reaches the database.

## Applying a migration

1. Write the change as `supabase/migrations/YYYYMMDDHHMMSS_short_name.sql`
   (UTC timestamp). Make it idempotent where cheap (`if not exists`,
   `drop policy if exists … create policy …`) so a double-run is harmless.
2. Commit it together with the application code that depends on it.
3. Open Supabase → project → **SQL Editor** → paste the whole file → **Run**.
4. Note the date and who ran it in the log below.
5. Deploy the application code.

Never run the baseline file against production — it describes what is
already there. Use it only to recreate the schema on an empty project.

## Verifying the baseline against production

The baseline was reconciled on 2026-08-24 against the live `pg_constraint`,
`pg_policies` and `pg_indexes` output — constraint, index and policy names
match production. Re-run these after any by-hand change to make sure the
folder still matches the database (fix the file, not the database):

```sql
select conrelid::regclass as "table", conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where connamespace = 'public'::regnamespace
order by 1, 2;

select tablename, policyname, cmd, qual
from pg_policies
where schemaname = 'public'
order by 1, 2;

select tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
order by 1, 2;
```

The SQL editor truncates long `pg_get_constraintdef` values. To read a CHECK
list in full, split the definition into one row per allowed value:

```sql
select conname, unnest(regexp_matches(pg_get_constraintdef(oid), '''([^'']+)''::text', 'g')) as allowed_value
from pg_constraint
where conname in ('plans_tier_check', 'subscriptions_status_check')
order by 1, 2;
```

Facts confirmed against production:

- `plans.language` and `profiles.preferred_language` CHECKs are `('en','cs')`.
- `plans.stripe_session_id` is **UNIQUE** (`plans_stripe_session_id_key`), so
  the webhook's idempotency lookup is backed by a real constraint.
- `profiles.email` and `profiles.stripe_customer_id` are UNIQUE.
- `plans.tier` ∈ `('starter','pro','coach')`; `subscriptions.status` ∈
  `('active','past_due','canceled','incomplete','trialing')`.

## Applied log

| Migration | Applied to prod | By |
|---|---|---|
| `20260824000000_initial_schema.sql` | baseline — already present | — |
| `20260824180000_drop_public_service_role_policies.sql` | 2026-08-24 | Iryna |
