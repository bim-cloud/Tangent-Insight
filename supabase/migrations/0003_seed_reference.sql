-- ============================================================================
-- Tangent Insight — 0003_seed_reference.sql
-- Seeds reference tables + the same baseline dataset shipped in app/data.js.
-- Safe to re-run (idempotent upserts). The agent overwrites people/activity/
-- attendance live; projects/kpis/submissions stay as the working baseline
-- until you wire those producers.
-- ============================================================================

-- ---- stages ----------------------------------------------------------------
insert into public.stages (code,label,color) values
  ('CONCEPT','Concept','#A78BFA'),
  ('SCHEMATIC','Schematic','#22D3EE'),
  ('DETAILED_DESIGN','Detailed Design','#00AEEF'),
  ('CONSTRUCTION_DOC','Construction Doc','#10B981'),
  ('AS_BUILT','As-Built','#64748B')
on conflict (code) do update
  set label = excluded.label, color = excluded.color;

-- ---- event_kinds -----------------------------------------------------------
insert into public.event_kinds (kind,icon,color,label) values
  ('sync','refresh-cw','var(--accent)','Synced'),
  ('open','folder-open','var(--info)','Opened'),
  ('save','save','var(--success)','Saved'),
  ('close','x-circle','var(--fg-muted)','Closed'),
  ('warning','alert-triangle','var(--warning)','Warning'),
  ('error','alert-octagon','var(--danger)','Error'),
  ('clash','zap','var(--danger)','Clash'),
  ('teams','video','var(--accent-2)','Teams'),
  ('login','log-in','var(--success)','Login'),
  ('logout','log-out','var(--fg-muted)','Logout'),
  ('publish','upload-cloud','var(--info)','Published'),
  ('workset','layers','var(--accent)','Workset')
on conflict (kind) do update
  set icon = excluded.icon, color = excluded.color, label = excluded.label;

-- ---- people ----------------------------------------------------------------
insert into public.people
  (id,name,initials,role,discipline,dept,status,project,version,focus_min,idle_min,hours,ot,utilization,machine) values
  ('u01','Layla Haddad','LH','BIM Manager','MANAGER','BIM','online','NEOM01','R2025',142,8,6.8,0.4,92,'TLA-DXB-014'),
  ('u02','Marcus Rivera','MR','BIM Coordinator','COORDINATOR','BIM','online','SAADIYAT07','R2024',95,14,5.4,0.0,86,'TLA-DXB-022'),
  ('u03','Priya Anand','PA','Senior Modeler','MODELER','Landscape','online','DXBHILLS03','R2025',167,3,7.2,1.1,96,'TLA-DXB-031'),
  ('u04','Tomáš Kovář','TK','Detailer','DETAILER','Detailing','online','NEOM01','R2025',120,12,5.9,0.0,78,'TLA-DXB-029'),
  ('u05','Amira Sayed','AS','Modeler','MODELER','Architecture','online','TAIF12','R2024',88,22,4.8,0.0,72,'TLA-DXB-009'),
  ('u06','Jens Albrechtsen','JA','Coordinator','COORDINATOR','BIM','meeting','NEOM01','R2025',60,4,6.0,0.5,88,'TLA-DXB-018'),
  ('u07','Reem Al-Mazrouei','RM','Detailer','DETAILER','Detailing','online','SAADIYAT07','R2025',145,6,6.7,0.0,90,'TLA-DXB-027'),
  ('u08','Hiroshi Tanaka','HT','Senior Detailer','DETAILER','Detailing','idle','DXBHILLS03','R2024',35,38,3.9,0.0,58,'TLA-DXB-006'),
  ('u09','Sofía Mendes','SM','Modeler','MODELER','Landscape','online','RIYADH22','R2025',110,9,6.3,0.0,83,'TLA-DXB-011'),
  ('u10','Khalid Bin Hamad','KH','Project Manager','MANAGER','PM','meeting','Multi','—',30,0,5.5,1.2,80,'TLA-DXB-001'),
  ('u11','Olesya Petrova','OP','BIM Coordinator','COORDINATOR','BIM','online','TAIF12','R2025',102,11,5.6,0.0,79,'TLA-DXB-013'),
  ('u12','Ade Okonkwo','AO','Modeler','MODELER','Landscape','online','DXBHILLS03','R2025',130,5,6.8,0.3,89,'TLA-DXB-035'),
  ('u13','Mei-Lin Chen','MC','Modeler','MODELER','Architecture','offline','—','—',0,0,0,0,0,'TLA-DXB-024'),
  ('u14','Nora Lindqvist','NL','Detailer','DETAILER','Detailing','online','NEOM01','R2025',158,4,7.0,0.6,94,'TLA-DXB-040'),
  ('u15','Diego Salinas','DS','Junior Modeler','MODELER','Landscape','online','SAADIYAT07','R2024',78,18,4.4,0.0,66,'TLA-DXB-019'),
  ('u16','Yara Mansour','YM','Coordinator','COORDINATOR','BIM','offline','—','—',0,0,0,0,0,'TLA-DXB-032')
on conflict (id) do update set
  name=excluded.name, initials=excluded.initials, role=excluded.role,
  discipline=excluded.discipline, dept=excluded.dept, machine=excluded.machine;

-- ---- projects --------------------------------------------------------------
insert into public.projects
  (code,name,client,stage,health,priority,active_users,total_users,model_size,model_size_unit,
   warnings,errors,clashes,open_views,central,version,linked_models,last_sync,progress,deadline,
   worksets,criticality,sparkline) values
  ('NEOM01','NEOM · The Line · Sector 12','NEOM','DETAILED_DESIGN','ON_TRACK','CRITICAL',6,11,482,'MB',42,0,18,47,'BIM 360 · neom-line-s12-CENTRAL.rvt','R2025',14,'12s ago',67,'Jun 28',23,0.92,'[30,38,42,55,60,58,65,72,68,74,78,82,85,82,88]'),
  ('SAADIYAT07','Saadiyat Cultural District · Plaza','TDIC','CONSTRUCTION_DOC','ON_TRACK','HIGH',4,8,314,'MB',28,0,7,32,'BIM 360 · saadiyat-plaza-CENTRAL.rvt','R2025',9,'44s ago',82,'Jul 15',17,0.66,'[60,58,62,65,68,72,75,78,76,80,82,82,84,86,88]'),
  ('DXBHILLS03','Dubai Hills Estate · Phase 3','Emaar','DETAILED_DESIGN','DELAY','HIGH',5,9,521,'MB',71,2,24,38,'BIM 360 · dxbhills-p3-CENTRAL.rvt','R2024',11,'2m ago',54,'Aug 04',19,0.74,'[40,42,44,48,46,50,52,54,52,55,53,58,56,60,62]'),
  ('TAIF12','Taif Park · Civic Promenade','RSGA','CONCEPT','ON_TRACK','MEDIUM',2,5,188,'MB',12,0,3,14,'BIM 360 · taif-park-CENTRAL.rvt','R2025',5,'1m ago',28,'Sep 30',8,0.35,'[10,12,14,16,18,20,22,24,26,25,28,30,29,32,34]'),
  ('RIYADH22','Riyadh Boulevard · Landscape','DGCL','SCHEMATIC','ON_TRACK','MEDIUM',1,4,142,'MB',8,0,2,9,'BIM 360 · riyadh-blvd-CENTRAL.rvt','R2025',4,'5m ago',44,'Aug 22',6,0.42,'[20,22,25,28,30,32,35,38,40,42,41,43,44,46,48]'),
  ('JEDDAH08','Jeddah Corniche · Waterfront','SCTH','DETAILED_DESIGN','CRITICAL','CRITICAL',3,7,396,'MB',118,4,36,28,'BIM 360 · jeddah-corniche-CENTRAL.rvt','R2024',12,'stale · 14m',38,'May 30',15,0.98,'[70,72,68,65,62,60,55,52,50,48,45,42,40,38,38]'),
  ('ALULA05','AlUla Heritage Trail','RCU','AS_BUILT','ON_TRACK','LOW',0,3,256,'MB',4,0,0,0,'BIM 360 · alula-trail-CENTRAL.rvt','R2024',7,'3h ago',96,'Apr 12',10,0.10,'[80,82,85,88,90,92,93,93,94,94,95,95,96,96,96]'),
  ('DOHA11','Doha West Bay · Skybridge','MMUP','SCHEMATIC','ON_TRACK','MEDIUM',2,6,174,'MB',18,0,5,16,'BIM 360 · doha-skybridge-CENTRAL.rvt','R2025',6,'20s ago',36,'Oct 02',9,0.48,'[12,14,18,22,24,26,28,30,32,33,34,35,36,36,38]')
on conflict (code) do update set
  name=excluded.name, client=excluded.client, stage=excluded.stage;

-- ---- kpis ------------------------------------------------------------------
insert into public.kpis (key,label,value,delta,trend,icon,grad,spark) values
  ('projects','Active Revit projects',12,2,'up','folder-kanban','var(--grad-cyan, linear-gradient(135deg,#22D3EE,#3B82F6))','[8,8,9,9,10,10,11,11,12,12,12,12]'),
  ('online','Users online now',28,4,'up','users','var(--grad-emerald, linear-gradient(135deg,#34D399,#14B8A6))','[20,18,22,24,26,25,28,29,28,30,28,28]'),
  ('hours','Active work hours · today',142,12,'up','clock','linear-gradient(135deg,#A78BFA,#A855F7)','[80,90,100,108,115,118,124,128,132,138,140,142]'),
  ('overtime','Overtime · this week',38,-6,'down','timer','linear-gradient(135deg,#FBBF24,#F97316)','[55,52,50,48,46,44,42,42,40,40,38,38]'),
  ('clashes','Open clashes',95,-14,'down','zap','linear-gradient(135deg,#F87171,#F97316)','[140,135,130,124,118,115,110,108,104,100,98,95]'),
  ('syncs','Model syncs · last hour',64,18,'up','refresh-cw','linear-gradient(135deg,#22D3EE,#3B82F6)','[42,46,48,50,52,55,58,60,60,62,63,64]')
on conflict (key) do update set label=excluded.label;

-- ---- submissions -----------------------------------------------------------
insert into public.submissions (id,title,type,project,submitted_by,submitted_at,state,reviewer) values
  ('s1','NEOM01 · IFC Pavement Package','IFC','NEOM01','u01','2h ago','UNDER_REVIEW','u10'),
  ('s2','Saadiyat NWC · Site Coordination','NWC','SAADIYAT07','u02','4h ago','APPROVED','u01'),
  ('s3','Dubai Hills RVT · Detailing pack','RVT','DXBHILLS03','u03','Yesterday','CHANGES','u01'),
  ('s4','Taif DWG · Setting-out drawings','DWG','TAIF12','u05','2d ago','PENDING','u11'),
  ('s5','Jeddah · Clash report v4','PDF','JEDDAH08','u02','3d ago','APPROVED','u01')
on conflict (id) do nothing;

-- ---- progress_trend --------------------------------------------------------
insert into public.progress_trend (code,color,values) values
  ('NEOM01','var(--accent)','[22,28,32,38,42,46,50,54,57,60,63,67]'),
  ('SAADIYAT07','#10B981','[45,50,55,59,63,67,71,74,77,79,81,82]'),
  ('DXBHILLS03','#A855F7','[30,32,35,38,41,43,45,47,49,51,52,54]'),
  ('JEDDAH08','#EF4444','[42,44,45,44,43,42,41,40,40,39,39,38]')
on conflict (code) do update set values=excluded.values;

-- ---- notifications ---------------------------------------------------------
insert into public.notifications (id,kind,title,time_label,read) values
  ('n1','danger','JEDDAH08 · Central model 14m stale','2m',false),
  ('n2','warning','DXBHILLS03 · 24 new clashes after sync','11m',false),
  ('n3','info','Layla H. submitted IFC Pavement Package','1h',false),
  ('n4','success','NEOM01 deadline updated to Jun 28','2h',true),
  ('n5','warning','Hiroshi T. idle 38m on DXBHILLS03','3h',true),
  ('n6','info','Weekly attendance export ready','5h',true)
on conflict (id) do nothing;

-- ---- meetings --------------------------------------------------------------
insert into public.meetings (id,title,state,start_label,duration,attendees,organizer,project) values
  ('m1','BIM coordination · NEOM01 weekly','live','10:30',42,8,'u01','NEOM01'),
  ('m2','Saadiyat clash review','live','10:45',28,5,'u02','SAADIYAT07'),
  ('m3','Detailing standup','ended','09:00',18,6,'u04','Multi'),
  ('m4','Client sync · Emaar','ended','08:30',55,4,'u10','DXBHILLS03'),
  ('m5','RCU site review','upcoming','13:00',60,7,'u10','ALULA05'),
  ('m6','Tangent leadership','upcoming','15:00',30,5,'u01','—')
on conflict (id) do nothing;
