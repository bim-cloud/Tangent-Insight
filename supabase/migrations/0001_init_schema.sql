-- ============================================================================
-- Tangent Insight — 0001_init_schema.sql
-- Core schema. Mirrors the shape of window.TI_DATA in app/data.js so the
-- dashboard can read from Supabase later without touching any screen component.
-- Run order: 0001 -> 0002 -> 0003 -> 0004
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Reference / lookup tables
-- ---------------------------------------------------------------------------
create table if not exists public.stages (
  code   text primary key,                 -- CONCEPT, SCHEMATIC, ...
  label  text not null,
  color  text not null
);

create table if not exists public.event_kinds (
  kind   text primary key,                 -- sync, save, open, warning, ...
  icon   text not null,
  color  text not null,
  label  text not null
);

-- ---------------------------------------------------------------------------
-- People (workforce)
-- ---------------------------------------------------------------------------
create table if not exists public.people (
  id           text primary key,           -- u01, u02, ...
  name         text not null,
  initials     text,
  role         text,
  discipline   text,                        -- MANAGER, COORDINATOR, MODELER, ...
  dept         text,
  status       text default 'offline',      -- online | meeting | idle | offline
  project      text,                        -- current project code or '—'
  version      text,                        -- Revit version label, e.g. R2025
  focus_min    integer default 0,
  idle_min     integer default 0,
  hours        numeric(6,2) default 0,
  ot           numeric(6,2) default 0,
  utilization  integer default 0,
  machine      text,                         -- e.g. TLA-DXB-014
  email        text,
  updated_at   timestamptz default now()
);
create index if not exists people_status_idx  on public.people (status);
create index if not exists people_machine_idx on public.people (machine);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  code            text primary key,         -- NEOM01, SAADIYAT07, ...
  name            text not null,
  client          text,
  stage           text references public.stages(code),
  health          text,                      -- ON_TRACK | DELAY | CRITICAL
  priority        text,                      -- LOW | MEDIUM | HIGH | CRITICAL
  active_users    integer default 0,
  total_users     integer default 0,
  model_size      numeric default 0,
  model_size_unit text default 'MB',
  warnings        integer default 0,
  errors          integer default 0,
  clashes         integer default 0,
  open_views      integer default 0,
  central         text,
  version         text,
  linked_models   integer default 0,
  last_sync       text,
  progress        integer default 0,
  deadline        text,
  worksets        integer default 0,
  criticality     numeric(4,3) default 0,
  sparkline       jsonb default '[]'::jsonb,
  updated_at      timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Activity feed (seed + live + agent-generated transitions)
-- ---------------------------------------------------------------------------
create table if not exists public.activity_events (
  id          bigint generated always as identity primary key,
  kind        text references public.event_kinds(kind),
  user_id     text references public.people(id),
  project     text,
  detail      text,
  occurred_at timestamptz default now(),
  source      text default 'agent',          -- agent | seed | system
  ingested_at timestamptz default now()
);
create index if not exists activity_occurred_idx on public.activity_events (occurred_at desc);
create index if not exists activity_user_idx     on public.activity_events (user_id, occurred_at desc);
create index if not exists activity_project_idx  on public.activity_events (project, occurred_at desc);

-- ---------------------------------------------------------------------------
-- Microsoft Teams meetings
-- ---------------------------------------------------------------------------
create table if not exists public.meetings (
  id          text primary key,
  title       text,
  state       text,                          -- live | ended | upcoming
  start_label text,                          -- "10:30"
  duration    integer default 0,
  attendees   integer default 0,
  organizer   text references public.people(id),
  project     text,
  occurred_on date default current_date,
  updated_at  timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Executive KPI cards
-- ---------------------------------------------------------------------------
create table if not exists public.kpis (
  key        text primary key,               -- projects, online, hours, ...
  label      text,
  value      integer default 0,
  delta      integer default 0,
  trend      text,                            -- up | down
  icon       text,
  grad       text,
  spark      jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- BIM submissions / deliverables
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id           text primary key,
  title        text,
  type         text,                          -- IFC | NWC | RVT | DWG | PDF
  project      text,
  submitted_by text references public.people(id),
  submitted_at text,                          -- human label ("2h ago")
  state        text,                          -- UNDER_REVIEW | APPROVED | CHANGES | PENDING
  reviewer     text references public.people(id),
  created_at   timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Daily attendance (one row per person per day)
-- ---------------------------------------------------------------------------
create table if not exists public.attendance (
  person_id  text references public.people(id),
  work_date  date not null default current_date,
  in_time    text,
  out_time   text,
  break_min  integer default 0,
  status     text,                            -- ON_TIME | LATE | ABSENT
  hours      numeric(6,2) default 0,
  ot         numeric(6,2) default 0,
  updated_at timestamptz default now(),
  primary key (person_id, work_date)
);

-- ---------------------------------------------------------------------------
-- Multi-project progress trend (12-week line chart)
-- ---------------------------------------------------------------------------
create table if not exists public.progress_trend (
  code       text primary key references public.projects(code),
  color      text,
  values     jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id         text primary key,
  kind       text,                            -- danger | warning | info | success
  title      text,
  time_label text,
  read       boolean default false,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- updated_at touch trigger
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['people','projects','meetings','kpis','attendance','progress_trend']
  loop
    execute format(
      'drop trigger if exists trg_touch_%1$s on public.%1$s;
       create trigger trg_touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at();', t);
  end loop;
end $$;
