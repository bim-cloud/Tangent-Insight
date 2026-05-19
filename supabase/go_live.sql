-- ============================================================================
-- go_live.sql   (RUN ONCE, after people_directory.sql)
--
-- Removes ALL sample/mock data shipped by 0003_seed_reference.sql so the live
-- dashboard shows only real staff + real agent data. Idempotent & FK-safe.
--   * deletes the 16 demo people (u01..u16) and every seed row referencing them
--   * empties the pure-sample tables (no real producer writes these yet:
--     projects/kpis/submissions/meetings/notifications/progress_trend) — the
--     dashboard derives projects + KPIs live from real people instead.
-- Real staff (from people_directory.sql) use email-local-part ids, so the
-- u01..u16 match below never touches them.
-- ============================================================================

-- 1. Drop seed rows that reference the demo people (FK-safe order)
delete from public.activity_events where user_id   ~ '^u[0-9]{2}$';
delete from public.attendance      where person_id ~ '^u[0-9]{2}$';
delete from public.submissions     where submitted_by ~ '^u[0-9]{2}$' or reviewer ~ '^u[0-9]{2}$';
delete from public.meetings        where organizer  ~ '^u[0-9]{2}$';
update public.agent_machines set person_id = null where person_id ~ '^u[0-9]{2}$';

-- 2. Remove the 16 demo people themselves
delete from public.people where id ~ '^u[0-9]{2}$';

-- 3. Empty the sample-only tables (dashboard shows live-derived / empty)
truncate table public.submissions;
truncate table public.meetings;
truncate table public.notifications;
truncate table public.progress_trend;
truncate table public.projects cascade;   -- live projects are derived from agent data
truncate table public.kpis;                -- live KPIs are computed in the browser

-- 4. Sanity check
do $$
declare n_demo int; n_real int;
begin
  select count(*) into n_demo from public.people where id ~ '^u[0-9]{2}$';
  select count(*) into n_real from public.people;
  raise notice 'Demo people remaining: %  |  Real staff: %', n_demo, n_real;
end $$;
