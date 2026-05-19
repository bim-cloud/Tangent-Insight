-- ============================================================================
-- people_directory.example.sql   (RUN ONCE, NOT a numbered migration)
--
-- The agent needs NO per-machine identity config. The server resolves each
-- sample to a person in this order:
--    1. explicit person_id (manual override, rarely needed)
--    2. people.username  = Windows account   <-- PRIMARY, unique per human
--    3. people.machine   = machine tag        (1 human : 1 PC fallback)
--    4. people.email     = Autodesk email     (LAST RESORT; ignored if the
--                                              same email belongs to >1 person)
--
-- Because your Autodesk IDs are shared between people, `username` is the field
-- that must be accurate. Every staff member has a unique AD account even when
-- they share an Autodesk license, so this is the dependable key.
--
-- `username` accepts either "DOMAIN\sam" or just "sam" -- the trigger matches
-- both forms on either side, so use whatever your AD export gives you.
-- ============================================================================

-- A) Bulk-set the Windows account for people already seeded ------------------
update public.people p set username = v.username
from (values
  ('u01', 'TANGENT\layla.haddad'),
  ('u02', 'TANGENT\marcus.rivera'),
  ('u03', 'TANGENT\priya.anand')
  -- ... add the rest of your staff (id, DOMAIN\sam) ...
) as v(id, username)
where p.id = v.id;

-- B) Add staff not in the seed ----------------------------------------------
--    `machine` is optional (only used as the 1-human:1-PC fallback).
insert into public.people (id, name, initials, role, discipline, dept, username, machine)
values
  ('u17', 'New Person', 'NP', 'Modeler', 'MODELER', 'BIM',
   'TANGENT\new.person', 'TLA-DXB-050')
on conflict (id) do update
  set username = excluded.username, machine = excluded.machine;

-- ----------------------------------------------------------------------------
-- Fastest path for a 50+ roster: export AD/Entra users to CSV with columns
--   id,name,username,machine,role,discipline,dept
-- then Supabase Dashboard -> Table Editor -> people -> Import CSV (upsert on
-- id). The AD sAMAccountName (or DOMAIN\sAMAccountName) goes in `username`.
--
-- Verify mappings after rolling out the agent:
--   select machine_id, person_id, autodesk_user, last_seen
--   from public.agent_machines order by last_seen desc;
--   -- person_id NULL = no username/machine match yet; fix that row's username.
-- ----------------------------------------------------------------------------
