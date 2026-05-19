-- ============================================================================
-- Tangent Insight — 0004_agent_ingestion.sql
-- The desktop agent (C#/WPF) writes ONLY here. A SECURITY DEFINER trigger
-- fans each raw sample into the normalised reporting tables (people status,
-- activity_events, attendance). The anon key shipped in the agent can INSERT
-- samples but cannot read or modify anything.
-- ============================================================================

-- ---- machine registry ------------------------------------------------------
create table if not exists public.agent_machines (
  machine_id    text primary key,            -- TLA-DXB-014
  host_name     text,
  person_id     text references public.people(id),
  autodesk_user text,
  agent_version text,
  os            text,
  app_version   text,
  online        boolean default false,
  last_seen     timestamptz default now()
);

-- ---- raw sample firehose ---------------------------------------------------
create table if not exists public.agent_samples (
  id              bigint generated always as identity primary key,
  machine_id      text not null,
  host_name       text,
  person_id       text,                       -- resolved by agent (people.id) when known
  autodesk_user   text,                       -- email parsed from Autodesk login
  windows_user    text,
  sampled_at      timestamptz not null default now(),
  foreground_app  text,
  window_title    text,
  idle_ms         bigint default 0,
  revit_running   boolean default false,
  revit_version   text,                       -- R2024 / R2025 ...
  revit_doc       text,                       -- active document / project guess
  acad_running    boolean default false,
  navis_running   boolean default false,
  teams_running   boolean default false,
  teams_in_meeting boolean default false,
  cpu_pct         numeric,
  raw             jsonb,                      -- full agent payload for forensics
  ingested_at     timestamptz default now()
);
create index if not exists agent_samples_machine_idx on public.agent_samples (machine_id, sampled_at desc);
create index if not exists agent_samples_person_idx  on public.agent_samples (person_id, sampled_at desc);

-- ---------------------------------------------------------------------------
-- Fan-out: turn a raw sample into reporting state.
--   * upsert agent_machines heartbeat
--   * update people.status / focus / idle / project / version / machine
--   * upsert today's attendance (first-seen = in_time, status by 09:00 cutoff)
--   * emit activity_events on meaningful transitions (login / open / teams)
-- SECURITY DEFINER => bypasses RLS so the write-only anon client triggers it.
-- ---------------------------------------------------------------------------
create or replace function public.process_agent_sample()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_person      text := new.person_id;
  v_prev_status text;
  v_new_status  text;
  v_today       date := (new.sampled_at at time zone 'Asia/Dubai')::date;
  v_clock       text := to_char(new.sampled_at at time zone 'Asia/Dubai','HH24:MI');
  v_idle_min    int  := coalesce((new.idle_ms / 60000)::int, 0);
begin
  -- 1. machine heartbeat
  insert into public.agent_machines
    (machine_id, host_name, person_id, autodesk_user, online, last_seen)
  values
    (new.machine_id, new.host_name, v_person, new.autodesk_user, true, new.sampled_at)
  on conflict (machine_id) do update set
    host_name     = excluded.host_name,
    person_id     = coalesce(excluded.person_id, public.agent_machines.person_id),
    autodesk_user = coalesce(excluded.autodesk_user, public.agent_machines.autodesk_user),
    online        = true,
    last_seen     = excluded.last_seen;

  if v_person is null then
    return new;  -- unmapped machine: keep the raw sample, nothing to fan out
  end if;

  -- 2. derive status
  v_new_status := case
    when new.teams_in_meeting then 'meeting'
    when v_idle_min >= 15     then 'idle'
    else 'online'
  end;

  select status into v_prev_status from public.people where id = v_person;

  update public.people set
    status     = v_new_status,
    project    = coalesce(nullif(new.revit_doc,''), people.project),
    version    = coalesce(nullif(new.revit_version,''), people.version),
    machine    = new.machine_id,
    idle_min   = v_idle_min,
    email      = coalesce(new.autodesk_user, people.email),
    updated_at = new.sampled_at
  where id = v_person;

  -- 3. attendance upsert (first sample of the day stamps in_time)
  insert into public.attendance (person_id, work_date, in_time, status, updated_at)
  values (
    v_person, v_today, v_clock,
    case when v_clock > '09:00' then 'LATE' else 'ON_TIME' end,
    new.sampled_at
  )
  on conflict (person_id, work_date) do update set
    out_time   = v_clock,                       -- last sample = latest seen
    updated_at = excluded.updated_at;

  -- 4. transition events
  if v_prev_status is distinct from v_new_status then
    if v_prev_status = 'offline' or v_prev_status is null then
      insert into public.activity_events (kind,user_id,project,detail,occurred_at,source)
      values ('login', v_person, coalesce(new.revit_doc,'—'),
              'Login · '||new.machine_id, new.sampled_at, 'agent');
    end if;
    if v_new_status = 'meeting' then
      insert into public.activity_events (kind,user_id,project,detail,occurred_at,source)
      values ('teams', v_person, coalesce(new.revit_doc,'Multi'),
              'Joined Teams meeting', new.sampled_at, 'agent');
    end if;
  end if;

  -- Revit just opened (no prior open event in last 5 min for this user/doc)
  if new.revit_running and new.revit_doc is not null
     and not exists (
       select 1 from public.activity_events
       where user_id = v_person and kind = 'open'
         and occurred_at > new.sampled_at - interval '5 minutes')
  then
    insert into public.activity_events (kind,user_id,project,detail,occurred_at,source)
    values ('open', v_person, new.revit_doc,
            'Opened '||new.revit_doc||' · '||coalesce(new.revit_version,''),
            new.sampled_at, 'agent');
  end if;

  return new;
end $$;

drop trigger if exists trg_process_agent_sample on public.agent_samples;
create trigger trg_process_agent_sample
  after insert on public.agent_samples
  for each row execute function public.process_agent_sample();

-- ---------------------------------------------------------------------------
-- Mark machines offline when their heartbeat goes stale (call from a cron /
-- pg_cron / scheduled Edge Function, or manually).
-- ---------------------------------------------------------------------------
create or replace function public.expire_stale_agents(p_minutes int default 5)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.agent_machines
    set online = false
  where last_seen < now() - make_interval(mins => p_minutes)
    and online = true;

  update public.people p set status = 'offline', updated_at = now()
  from public.agent_machines m
  where m.person_id = p.id
    and m.online = false
    and p.status <> 'offline';
end $$;

-- ---------------------------------------------------------------------------
-- RLS: agent_samples is WRITE-ONLY for anon. Machines table is read-only for
-- the dashboard. Samples are never selectable by clients.
-- ---------------------------------------------------------------------------
alter table public.agent_samples  enable row level security;
alter table public.agent_machines enable row level security;

-- Privilege layer: agent gets INSERT-only on the firehose (it literally
-- cannot SELECT samples back), dashboard gets SELECT-only on machines.
revoke all on public.agent_samples  from anon, authenticated;
revoke all on public.agent_machines from anon, authenticated;
grant insert on public.agent_samples  to anon, authenticated;
grant select on public.agent_machines to anon, authenticated;

drop policy if exists "agent_samples_anon_insert" on public.agent_samples;
create policy "agent_samples_anon_insert" on public.agent_samples
  for insert to anon, authenticated with check (true);
-- (no select policy => agent cannot read samples back)

drop policy if exists "agent_machines_anon_read" on public.agent_machines;
create policy "agent_machines_anon_read" on public.agent_machines
  for select to anon, authenticated using (true);

-- Optional: schedule offline sweep every minute if pg_cron is available.
-- select cron.schedule('ti-expire-agents','* * * * *',$$select public.expire_stale_agents(5)$$);
