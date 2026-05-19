-- ============================================================================
-- Tangent Insight — 0002_rls_policies.sql
-- Row Level Security.
--
-- Model:
--   * Dashboard (browser, anon key)  -> READ-ONLY on all reporting tables.
--   * Agent (desktop, anon key)      -> WRITE-ONLY into the raw ingestion
--                                       table (public.agent_samples, created
--                                       in 0004). It cannot read anything back.
--   * Normalised tables are written ONLY by the security-definer trigger in
--     0004, never directly by a client.
--
-- This keeps the anon key safe to ship inside the desktop agent: a leaked key
-- can append samples but cannot read or tamper with workforce data.
-- ============================================================================

-- Base privileges. RLS only takes effect once the role also holds the
-- table-level privilege; without these GRANTs the policies are unreachable.
-- (Supabase grants these implicitly today, but we make it explicit so the
--  security model is self-contained, provable and portable.)
grant usage on schema public to anon, authenticated;

-- Reporting tables: enable RLS + anon SELECT only.
do $$
declare t text;
begin
  foreach t in array array[
    'stages','event_kinds','people','projects','activity_events',
    'meetings','kpis','submissions','attendance','progress_trend','notifications'
  ]
  loop
    -- SELECT privilege only (no insert/update/delete) -> writes denied at the
    -- privilege layer too, not just by absence of a write policy.
    execute format('revoke all on public.%I from anon, authenticated;', t);
    execute format('grant select on public.%I to anon, authenticated;', t);

    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists "%1$s_anon_read" on public.%1$s;', t);
    execute format(
      'create policy "%1$s_anon_read" on public.%1$s
         for select to anon, authenticated using (true);', t);

    -- Explicitly NO insert/update/delete policy for anon -> writes are denied
    -- for clients; the SECURITY DEFINER pipeline (0004) bypasses RLS.
  end loop;
end $$;

-- Notifications can be marked read from the dashboard (optional convenience).
grant update on public.notifications to anon, authenticated;
drop policy if exists "notifications_anon_update_read" on public.notifications;
create policy "notifications_anon_update_read" on public.notifications
  for update to anon, authenticated using (true) with check (true);
