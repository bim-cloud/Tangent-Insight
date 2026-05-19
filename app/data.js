// Tangent Insight — seed data (NEOM / Saadiyat / Dubai Hills universe)
window.TI_DATA = (function () {

  const people = [
    { id: "u01", name: "Layla Haddad",       initials: "LH", role: "BIM Manager",       discipline: "MANAGER",     dept: "BIM",        status: "online",  project: "NEOM01",      version: "R2025", focusMin: 142, idleMin: 8,  hours: 6.8, ot: 0.4, utilization: 92, machine: "TLA-DXB-014" },
    { id: "u02", name: "Marcus Rivera",      initials: "MR", role: "BIM Coordinator",   discipline: "COORDINATOR", dept: "BIM",        status: "online",  project: "SAADIYAT07",  version: "R2024", focusMin: 95,  idleMin: 14, hours: 5.4, ot: 0.0, utilization: 86, machine: "TLA-DXB-022" },
    { id: "u03", name: "Priya Anand",        initials: "PA", role: "Senior Modeler",    discipline: "MODELER",     dept: "Landscape",  status: "online",  project: "DXBHILLS03",  version: "R2025", focusMin: 167, idleMin: 3,  hours: 7.2, ot: 1.1, utilization: 96, machine: "TLA-DXB-031" },
    { id: "u04", name: "Tomáš Kovář",        initials: "TK", role: "Detailer",          discipline: "DETAILER",    dept: "Detailing",  status: "online",  project: "NEOM01",      version: "R2025", focusMin: 120, idleMin: 12, hours: 5.9, ot: 0.0, utilization: 78, machine: "TLA-DXB-029" },
    { id: "u05", name: "Amira Sayed",        initials: "AS", role: "Modeler",           discipline: "MODELER",     dept: "Architecture",status:"online",  project: "TAIF12",      version: "R2024", focusMin: 88,  idleMin: 22, hours: 4.8, ot: 0.0, utilization: 72, machine: "TLA-DXB-009" },
    { id: "u06", name: "Jens Albrechtsen",   initials: "JA", role: "Coordinator",       discipline: "COORDINATOR", dept: "BIM",        status: "meeting", project: "NEOM01",      version: "R2025", focusMin: 60,  idleMin: 4,  hours: 6.0, ot: 0.5, utilization: 88, machine: "TLA-DXB-018" },
    { id: "u07", name: "Reem Al-Mazrouei",   initials: "RM", role: "Detailer",          discipline: "DETAILER",    dept: "Detailing",  status: "online",  project: "SAADIYAT07",  version: "R2025", focusMin: 145, idleMin: 6,  hours: 6.7, ot: 0.0, utilization: 90, machine: "TLA-DXB-027" },
    { id: "u08", name: "Hiroshi Tanaka",     initials: "HT", role: "Senior Detailer",   discipline: "DETAILER",    dept: "Detailing",  status: "idle",    project: "DXBHILLS03",  version: "R2024", focusMin: 35,  idleMin: 38, hours: 3.9, ot: 0.0, utilization: 58, machine: "TLA-DXB-006" },
    { id: "u09", name: "Sofía Mendes",       initials: "SM", role: "Modeler",           discipline: "MODELER",     dept: "Landscape",  status: "online",  project: "RIYADH22",    version: "R2025", focusMin: 110, idleMin: 9,  hours: 6.3, ot: 0.0, utilization: 83, machine: "TLA-DXB-011" },
    { id: "u10", name: "Khalid Bin Hamad",   initials: "KH", role: "Project Manager",   discipline: "MANAGER",     dept: "PM",         status: "meeting", project: "Multi",       version: "—",     focusMin: 30,  idleMin: 0,  hours: 5.5, ot: 1.2, utilization: 80, machine: "TLA-DXB-001" },
    { id: "u11", name: "Olesya Petrova",     initials: "OP", role: "BIM Coordinator",   discipline: "COORDINATOR", dept: "BIM",        status: "online",  project: "TAIF12",      version: "R2025", focusMin: 102, idleMin: 11, hours: 5.6, ot: 0.0, utilization: 79, machine: "TLA-DXB-013" },
    { id: "u12", name: "Ade Okonkwo",        initials: "AO", role: "Modeler",           discipline: "MODELER",     dept: "Landscape",  status: "online",  project: "DXBHILLS03",  version: "R2025", focusMin: 130, idleMin: 5,  hours: 6.8, ot: 0.3, utilization: 89, machine: "TLA-DXB-035" },
    { id: "u13", name: "Mei-Lin Chen",       initials: "MC", role: "Modeler",           discipline: "MODELER",     dept: "Architecture",status:"offline", project: "—",           version: "—",     focusMin: 0,   idleMin: 0,  hours: 0,   ot: 0,   utilization: 0,  machine: "TLA-DXB-024" },
    { id: "u14", name: "Nora Lindqvist",     initials: "NL", role: "Detailer",          discipline: "DETAILER",    dept: "Detailing",  status: "online",  project: "NEOM01",      version: "R2025", focusMin: 158, idleMin: 4,  hours: 7.0, ot: 0.6, utilization: 94, machine: "TLA-DXB-040" },
    { id: "u15", name: "Diego Salinas",      initials: "DS", role: "Junior Modeler",    discipline: "MODELER",     dept: "Landscape",  status: "online",  project: "SAADIYAT07",  version: "R2024", focusMin: 78,  idleMin: 18, hours: 4.4, ot: 0.0, utilization: 66, machine: "TLA-DXB-019" },
    { id: "u16", name: "Yara Mansour",       initials: "YM", role: "Coordinator",       discipline: "COORDINATOR", dept: "BIM",        status: "offline", project: "—",           version: "—",     focusMin: 0,   idleMin: 0,  hours: 0,   ot: 0,   utilization: 0,  machine: "TLA-DXB-032" },
  ];

  const projects = [
    {
      code: "NEOM01", name: "NEOM · The Line · Sector 12",
      client: "NEOM", stage: "DETAILED_DESIGN", health: "ON_TRACK", priority: "CRITICAL",
      activeUsers: 6, totalUsers: 11, modelSize: 482, modelSizeUnit: "MB",
      warnings: 42, errors: 0, clashes: 18, openViews: 47,
      central: "BIM 360 · neom-line-s12-CENTRAL.rvt", version: "R2025",
      linkedModels: 14, lastSync: "12s ago", progress: 67, deadline: "Jun 28",
      worksets: 23, criticality: 0.92, sparkline: [30,38,42,55,60,58,65,72,68,74,78,82,85,82,88],
    },
    {
      code: "SAADIYAT07", name: "Saadiyat Cultural District · Plaza",
      client: "TDIC", stage: "CONSTRUCTION_DOC", health: "ON_TRACK", priority: "HIGH",
      activeUsers: 4, totalUsers: 8, modelSize: 314, modelSizeUnit: "MB",
      warnings: 28, errors: 0, clashes: 7, openViews: 32,
      central: "BIM 360 · saadiyat-plaza-CENTRAL.rvt", version: "R2025",
      linkedModels: 9, lastSync: "44s ago", progress: 82, deadline: "Jul 15",
      worksets: 17, criticality: 0.66, sparkline: [60,58,62,65,68,72,75,78,76,80,82,82,84,86,88],
    },
    {
      code: "DXBHILLS03", name: "Dubai Hills Estate · Phase 3",
      client: "Emaar", stage: "DETAILED_DESIGN", health: "DELAY", priority: "HIGH",
      activeUsers: 5, totalUsers: 9, modelSize: 521, modelSizeUnit: "MB",
      warnings: 71, errors: 2, clashes: 24, openViews: 38,
      central: "BIM 360 · dxbhills-p3-CENTRAL.rvt", version: "R2024",
      linkedModels: 11, lastSync: "2m ago", progress: 54, deadline: "Aug 04",
      worksets: 19, criticality: 0.74, sparkline: [40,42,44,48,46,50,52,54,52,55,53,58,56,60,62],
    },
    {
      code: "TAIF12", name: "Taif Park · Civic Promenade",
      client: "RSGA", stage: "CONCEPT", health: "ON_TRACK", priority: "MEDIUM",
      activeUsers: 2, totalUsers: 5, modelSize: 188, modelSizeUnit: "MB",
      warnings: 12, errors: 0, clashes: 3, openViews: 14,
      central: "BIM 360 · taif-park-CENTRAL.rvt", version: "R2025",
      linkedModels: 5, lastSync: "1m ago", progress: 28, deadline: "Sep 30",
      worksets: 8, criticality: 0.35, sparkline: [10,12,14,16,18,20,22,24,26,25,28,30,29,32,34],
    },
    {
      code: "RIYADH22", name: "Riyadh Boulevard · Landscape",
      client: "DGCL", stage: "SCHEMATIC", health: "ON_TRACK", priority: "MEDIUM",
      activeUsers: 1, totalUsers: 4, modelSize: 142, modelSizeUnit: "MB",
      warnings: 8, errors: 0, clashes: 2, openViews: 9,
      central: "BIM 360 · riyadh-blvd-CENTRAL.rvt", version: "R2025",
      linkedModels: 4, lastSync: "5m ago", progress: 44, deadline: "Aug 22",
      worksets: 6, criticality: 0.42, sparkline: [20,22,25,28,30,32,35,38,40,42,41,43,44,46,48],
    },
    {
      code: "JEDDAH08", name: "Jeddah Corniche · Waterfront",
      client: "SCTH", stage: "DETAILED_DESIGN", health: "CRITICAL", priority: "CRITICAL",
      activeUsers: 3, totalUsers: 7, modelSize: 396, modelSizeUnit: "MB",
      warnings: 118, errors: 4, clashes: 36, openViews: 28,
      central: "BIM 360 · jeddah-corniche-CENTRAL.rvt", version: "R2024",
      linkedModels: 12, lastSync: "stale · 14m", progress: 38, deadline: "May 30",
      worksets: 15, criticality: 0.98, sparkline: [70,72,68,65,62,60,55,52,50,48,45,42,40,38,38],
    },
    {
      code: "ALULA05", name: "AlUla Heritage Trail",
      client: "RCU", stage: "AS_BUILT", health: "ON_TRACK", priority: "LOW",
      activeUsers: 0, totalUsers: 3, modelSize: 256, modelSizeUnit: "MB",
      warnings: 4, errors: 0, clashes: 0, openViews: 0,
      central: "BIM 360 · alula-trail-CENTRAL.rvt", version: "R2024",
      linkedModels: 7, lastSync: "3h ago", progress: 96, deadline: "Apr 12",
      worksets: 10, criticality: 0.10, sparkline: [80,82,85,88,90,92,93,93,94,94,95,95,96,96,96],
    },
    {
      code: "DOHA11", name: "Doha West Bay · Skybridge",
      client: "MMUP", stage: "SCHEMATIC", health: "ON_TRACK", priority: "MEDIUM",
      activeUsers: 2, totalUsers: 6, modelSize: 174, modelSizeUnit: "MB",
      warnings: 18, errors: 0, clashes: 5, openViews: 16,
      central: "BIM 360 · doha-skybridge-CENTRAL.rvt", version: "R2025",
      linkedModels: 6, lastSync: "20s ago", progress: 36, deadline: "Oct 02",
      worksets: 9, criticality: 0.48, sparkline: [12,14,18,22,24,26,28,30,32,33,34,35,36,36,38],
    },
  ];

  const stages = {
    CONCEPT: { label: "Concept", color: "#A78BFA" },
    SCHEMATIC: { label: "Schematic", color: "#22D3EE" },
    DETAILED_DESIGN: { label: "Detailed Design", color: "#00AEEF" },
    CONSTRUCTION_DOC: { label: "Construction Doc", color: "#10B981" },
    AS_BUILT: { label: "As-Built", color: "#64748B" },
  };

  // Activity event types
  const eventKinds = {
    sync:     { icon: "refresh-cw",      color: "var(--accent)",     label: "Synced" },
    open:     { icon: "folder-open",     color: "var(--info)",       label: "Opened" },
    save:     { icon: "save",            color: "var(--success)",    label: "Saved" },
    close:    { icon: "x-circle",        color: "var(--fg-muted)",   label: "Closed" },
    warning:  { icon: "alert-triangle",  color: "var(--warning)",    label: "Warning" },
    error:    { icon: "alert-octagon",   color: "var(--danger)",     label: "Error" },
    clash:    { icon: "zap",             color: "var(--danger)",     label: "Clash" },
    teams:    { icon: "video",           color: "var(--accent-2)",   label: "Teams" },
    login:    { icon: "log-in",          color: "var(--success)",    label: "Login" },
    logout:   { icon: "log-out",         color: "var(--fg-muted)",   label: "Logout" },
    publish:  { icon: "upload-cloud",    color: "var(--info)",       label: "Published" },
    workset:  { icon: "layers",          color: "var(--accent)",     label: "Workset" },
  };

  function ago(min) {
    if (min < 1) return "just now";
    if (min < 60) return min + "m ago";
    const h = Math.floor(min / 60); return h + "h ago";
  }

  // Initial activity feed (newest first). The live feed will prepend new items.
  const initialActivity = [
    { id: 1,   kind: "sync",    user: "u03", project: "DXBHILLS03", t: 0,   detail: "Sync to central · 47 elements" },
    { id: 2,   kind: "save",    user: "u01", project: "NEOM01",     t: 1,   detail: "Local save · plaza_furniture.rvt" },
    { id: 3,   kind: "warning", user: "u04", project: "NEOM01",     t: 2,   detail: "Disjoined hosts · 6 new" },
    { id: 4,   kind: "open",    user: "u07", project: "SAADIYAT07", t: 3,   detail: "Opened central model" },
    { id: 5,   kind: "teams",   user: "u10", project: "Multi",      t: 4,   detail: "Joined: BIM coordination weekly" },
    { id: 6,   kind: "clash",   user: "u02", project: "SAADIYAT07", t: 6,   detail: "3 hard clashes · Hardscape × MEP" },
    { id: 7,   kind: "publish", user: "u01", project: "NEOM01",     t: 8,   detail: "IFC 4 export · 482 MB" },
    { id: 8,   kind: "sync",    user: "u14", project: "NEOM01",     t: 9,   detail: "Sync to central · 12 elements" },
    { id: 9,   kind: "save",    user: "u05", project: "TAIF12",     t: 12,  detail: "Local save · 8.2 MB" },
    { id: 10,  kind: "workset", user: "u02", project: "SAADIYAT07", t: 14,  detail: "Workset 'Pavement L2' borrowed" },
    { id: 11,  kind: "error",   user: "u06", project: "NEOM01",     t: 16,  detail: "Linked model missing · sitepkg_v3.rvt" },
    { id: 12,  kind: "login",   user: "u12", project: "—",          t: 18,  detail: "Login · TLA-DXB-035" },
    { id: 13,  kind: "sync",    user: "u11", project: "TAIF12",     t: 22,  detail: "Sync · 31 elements · 4.1s" },
    { id: 14,  kind: "save",    user: "u09", project: "RIYADH22",   t: 25,  detail: "Local save · 2.6 MB" },
    { id: 15,  kind: "open",    user: "u15", project: "SAADIYAT07", t: 28,  detail: "Opened: Section 3 view" },
    { id: 16,  kind: "teams",   user: "u06", project: "Multi",      t: 32,  detail: "Left meeting · 42 min" },
    { id: 17,  kind: "warning", user: "u08", project: "DXBHILLS03", t: 36,  detail: "Idle 35m · auto-pause" },
    { id: 18,  kind: "clash",   user: "u04", project: "NEOM01",     t: 40,  detail: "Resolved 4 clashes" },
  ];

  // Teams meetings
  const meetings = [
    { id: "m1", title: "BIM coordination · NEOM01 weekly", state: "live",   start: "10:30", duration: 42, attendees: 8, organizer: "u01", project: "NEOM01" },
    { id: "m2", title: "Saadiyat clash review",             state: "live",   start: "10:45", duration: 28, attendees: 5, organizer: "u02", project: "SAADIYAT07" },
    { id: "m3", title: "Detailing standup",                 state: "ended",  start: "09:00", duration: 18, attendees: 6, organizer: "u04", project: "Multi" },
    { id: "m4", title: "Client sync · Emaar",               state: "ended",  start: "08:30", duration: 55, attendees: 4, organizer: "u10", project: "DXBHILLS03" },
    { id: "m5", title: "RCU site review",                   state: "upcoming", start: "13:00", duration: 60, attendees: 7, organizer: "u10", project: "ALULA05" },
    { id: "m6", title: "Tangent leadership",                state: "upcoming", start: "15:00", duration: 30, attendees: 5, organizer: "u01", project: "—" },
  ];

  // KPI cards for executive dashboard
  const kpis = [
    { key: "projects",  label: "Active Revit projects",   value: 12, delta: +2, trend: "up",   icon: "folder-kanban", grad: "var(--grad-cyan, linear-gradient(135deg,#22D3EE,#3B82F6))", spark: [8,8,9,9,10,10,11,11,12,12,12,12] },
    { key: "online",    label: "Users online now",        value: 28, delta: +4, trend: "up",   icon: "users",         grad: "var(--grad-emerald, linear-gradient(135deg,#34D399,#14B8A6))", spark: [20,18,22,24,26,25,28,29,28,30,28,28] },
    { key: "hours",     label: "Active work hours · today",value: 142,delta: +12,trend: "up",   icon: "clock",         grad: "linear-gradient(135deg,#A78BFA,#A855F7)", spark: [80,90,100,108,115,118,124,128,132,138,140,142] },
    { key: "overtime",  label: "Overtime · this week",    value: 38, delta: -6, trend: "down", icon: "timer",         grad: "linear-gradient(135deg,#FBBF24,#F97316)", spark: [55,52,50,48,46,44,42,42,40,40,38,38] },
    { key: "clashes",   label: "Open clashes",            value: 95, delta: -14,trend: "down", icon: "zap",           grad: "linear-gradient(135deg,#F87171,#F97316)", spark: [140,135,130,124,118,115,110,108,104,100,98,95] },
    { key: "syncs",     label: "Model syncs · last hour", value: 64, delta: +18,trend: "up",   icon: "refresh-cw",    grad: "linear-gradient(135deg,#22D3EE,#3B82F6)", spark: [42,46,48,50,52,55,58,60,60,62,63,64] },
  ];

  // Heatmap data: 7 days × 12 hours (8 AM → 8 PM)
  function heatmap() {
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const hours = ["08","09","10","11","12","13","14","15","16","17","18","19"];
    const data = [];
    for (let d = 0; d < days.length; d++) {
      for (let h = 0; h < hours.length; h++) {
        let v;
        if (d >= 5) v = Math.random() * 0.3; // weekend
        else if (h === 4) v = 0.2 + Math.random() * 0.2; // lunch
        else if (h <= 1 || h >= 10) v = 0.3 + Math.random() * 0.3;
        else v = 0.6 + Math.random() * 0.4;
        if (d === 3 && h === 5) v = 0.95;
        data.push({ d, h, v: Math.min(1, v) });
      }
    }
    return { days, hours, data };
  }

  // Submissions (BIM deliverables)
  const submissions = [
    { id: "s1", title: "NEOM01 · IFC Pavement Package",        type: "IFC", project: "NEOM01",     submittedBy: "u01", submittedAt: "2h ago",   state: "UNDER_REVIEW",  reviewer: "u10" },
    { id: "s2", title: "Saadiyat NWC · Site Coordination",     type: "NWC", project: "SAADIYAT07", submittedBy: "u02", submittedAt: "4h ago",   state: "APPROVED",      reviewer: "u01" },
    { id: "s3", title: "Dubai Hills RVT · Detailing pack",     type: "RVT", project: "DXBHILLS03", submittedBy: "u03", submittedAt: "Yesterday",state: "CHANGES",       reviewer: "u01" },
    { id: "s4", title: "Taif DWG · Setting-out drawings",      type: "DWG", project: "TAIF12",     submittedBy: "u05", submittedAt: "2d ago",   state: "PENDING",       reviewer: "u11" },
    { id: "s5", title: "Jeddah · Clash report v4",             type: "PDF", project: "JEDDAH08",   submittedBy: "u02", submittedAt: "3d ago",   state: "APPROVED",      reviewer: "u01" },
  ];

  // Daily attendance (today)
  const attendance = people.map(p => {
    const inT = ["08:05","08:12","08:31","08:45","09:02","09:18","08:22","08:55","09:11","08:08","08:47","08:38","—","08:15","09:05","—"][people.indexOf(p)];
    return {
      ...p,
      inTime: inT,
      outTime: p.status === "offline" ? "—" : "—",
      breakMin: p.status === "offline" ? 0 : 30 + Math.floor(Math.random() * 30),
      status: p.status === "offline" ? "ABSENT" : (inT > "09:00" ? "LATE" : "ON_TIME"),
    };
  });

  // Project progress over 12 weeks (multi-project line chart)
  const progressTrend = [
    { code: "NEOM01",     color: "var(--accent)",          values: [22,28,32,38,42,46,50,54,57,60,63,67] },
    { code: "SAADIYAT07", color: "#10B981",                values: [45,50,55,59,63,67,71,74,77,79,81,82] },
    { code: "DXBHILLS03", color: "#A855F7",                values: [30,32,35,38,41,43,45,47,49,51,52,54] },
    { code: "JEDDAH08",   color: "#EF4444",                values: [42,44,45,44,43,42,41,40,40,39,39,38] },
  ];

  // Notifications
  const notifications = [
    { id: "n1", kind: "danger",  title: "JEDDAH08 · Central model 14m stale",          time: "2m",  read: false },
    { id: "n2", kind: "warning", title: "DXBHILLS03 · 24 new clashes after sync",      time: "11m", read: false },
    { id: "n3", kind: "info",    title: "Layla H. submitted IFC Pavement Package",     time: "1h",  read: false },
    { id: "n4", kind: "success", title: "NEOM01 deadline updated to Jun 28",           time: "2h",  read: true  },
    { id: "n5", kind: "warning", title: "Hiroshi T. idle 38m on DXBHILLS03",           time: "3h",  read: true  },
    { id: "n6", kind: "info",    title: "Weekly attendance export ready",              time: "5h",  read: true  },
  ];

  return {
    people, projects, stages, eventKinds, initialActivity, meetings,
    kpis, submissions, attendance, progressTrend, notifications,
    heatmap, ago,
    byId: id => people.find(p => p.id === id),
    byCode: c => projects.find(p => p.code === c),
  };
})();
