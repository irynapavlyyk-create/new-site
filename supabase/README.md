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

PostgREST exposes columns and defaults but not CHECK/FK/RLS definitions, so
those parts of the baseline were written from the design, not read back.
Run this once in the SQL editor and reconcile any difference into the
baseline file (fix the file, not the database):

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

Points to confirm specifically:

- `plans.language` and `profiles.preferred_language` CHECK constraints are
  `in ('en', 'cs')` — the Czech launch changed these from the older en/ru set.
- `plans.stripe_session_id` has **no** unique constraint in the baseline. The
  webhook is idempotent by lookup, not by constraint; adding
  `unique (stripe_session_id)` would be a reasonable follow-up migration.

## Applied log

| Migration | Applied to prod | By |
|---|---|---|
| `20260824000000_initial_schema.sql` | baseline — already present | — |
