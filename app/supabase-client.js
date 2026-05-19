/* ============================================================================
 * Tangent Insight — LIVE data layer (ENABLED)
 *
 * Replaces every mock surface in window.TI_DATA with real Supabase data:
 *   people        <- public.people            (your real staff)
 *   initialActivity <- public.activity_events  (real agent events)
 *   attendance    <- public.attendance         (real Dubai-time in/out)
 *   projects      <- derived from the real Revit documents people are in
 *   kpis          <- computed from the live workforce
 * Surfaces with NO real producer (meetings, submissions, progressTrend,
 * notifications) are emptied — never shown with sample data.
 *
 * Arrays are mutated IN PLACE (length=0 + push) so the byId/byCode closures
 * in data.js keep working. Lookups, stages, eventKinds, ago() are preserved.
 * On a hard fetch failure the mock surfaces are cleared (honest empty state)
 * rather than left showing fake names.
 * ========================================================================== */
(function () {
  "use strict";

  var SUPABASE_URL  = "https://txbhogmhonwdsjkvnnur.supabase.co";
  var SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4YmhvZ21ob253ZHNqa3ZubnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODA2MTcsImV4cCI6MjA5NDc1NjYxN30.Fd753UA1UmI12i1LCOlvTc0TFBqhlBKaWgTn9YcyZVQ";

  // Live by default. Set window.TI_USE_SUPABASE=false or ?mock=1 to force mock.
  var useMock = window.TI_USE_SUPABASE === false || /[?&]mock=1\b/.test(location.search);
  if (useMock) { console.info("[Tangent Insight] mock mode (forced)"); return; }

  var D = window.TI_DATA;
  if (!D) return;

  function rest(table, query) {
    return fetch(SUPABASE_URL + "/rest/v1/" + table + (query ? "?" + query : ""),
      { headers: { apikey: SUPABASE_ANON, Authorization: "Bearer " + SUPABASE_ANON } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); });
  }
  function repl(arr, items) {                 // in-place replace (keeps closures)
    if (!arr) return;
    arr.length = 0;
    if (items && items.length) Array.prototype.push.apply(arr, items);
  }
  function num(v) { return v == null ? 0 : Number(v) || 0; }
  function initials(name) {
    return String(name || "").trim().split(/\s+/).slice(0, 2)
      .map(function (s) { return s[0] || ""; }).join("").toUpperCase() || "—";
  }

  function mapPerson(r) {
    return {
      id: r.id, name: r.name, initials: r.initials || initials(r.name),
      role: r.role || "Staff", discipline: r.discipline || "UNASSIGNED",
      dept: r.dept || "Unassigned", status: r.status || "offline",
      project: r.project || "—", version: r.version || "—",
      focusMin: num(r.focus_min), idleMin: num(r.idle_min),
      hours: num(r.hours), ot: num(r.ot), utilization: num(r.utilization),
      machine: r.machine || "—"
    };
  }
  function mapEvent(r, i) {
    var mins = Math.max(0, Math.round((Date.now() - new Date(r.occurred_at)) / 60000));
    return { id: r.id || i, kind: r.kind || "open", user: r.user_id,
             project: r.project || "—", t: mins, detail: r.detail || "" };
  }
  function mapAtt(r) {
    return { id: r.person_id, inTime: r.in_time || "—", outTime: r.out_time || "—",
             breakMin: num(r.break_min), status: r.status || "ABSENT",
             hours: num(r.hours), ot: num(r.ot) };
  }

  function deriveProjects(people) {
    var m = {};
    people.forEach(function (p) {
      var c = p.project;
      if (!c || c === "—" || c === "Multi") return;
      if (!m[c]) m[c] = { code: c, name: c, client: "—", stage: "DETAILED_DESIGN",
        health: "ON_TRACK", priority: "MEDIUM", activeUsers: 0, totalUsers: 0,
        modelSize: 0, modelSizeUnit: "MB", warnings: 0, errors: 0, clashes: 0,
        openViews: 0, central: c, version: p.version || "—", linkedModels: 0,
        lastSync: "—", progress: 0, deadline: "—", worksets: 0, criticality: 0,
        sparkline: [] };
      m[c].totalUsers++;
      if (p.status === "online" || p.status === "meeting") m[c].activeUsers++;
    });
    return Object.keys(m).sort().map(function (k) { return m[k]; });
  }

  function computeKpis(people, projects) {
    var online = people.filter(function (p) { return p.status === "online"; }).length;
    var meeting = people.filter(function (p) { return p.status === "meeting"; }).length;
    var hours = Math.round(people.reduce(function (a, p) { return a + p.hours; }, 0));
    var ot = Math.round(people.reduce(function (a, p) { return a + p.ot; }, 0));
    var flat = function (v) { return [v, v, v, v, v, v, v, v, v, v, v, v]; };
    return [
      { key: "projects", label: "Active Revit projects", value: projects.length, delta: 0, trend: "up",   icon: "folder-kanban", grad: "var(--grad-cyan, linear-gradient(135deg,#22D3EE,#3B82F6))", spark: flat(projects.length) },
      { key: "online",   label: "Users online now",       value: online,          delta: 0, trend: "up",   icon: "users",         grad: "var(--grad-emerald, linear-gradient(135deg,#34D399,#14B8A6))", spark: flat(online) },
      { key: "meeting",  label: "In Teams meetings",      value: meeting,         delta: 0, trend: "up",   icon: "video",         grad: "linear-gradient(135deg,#A78BFA,#A855F7)", spark: flat(meeting) },
      { key: "hours",    label: "Active work hours · today", value: hours,        delta: 0, trend: "up",   icon: "clock",         grad: "linear-gradient(135deg,#A78BFA,#A855F7)", spark: flat(hours) },
      { key: "overtime", label: "Overtime · today",       value: ot,              delta: 0, trend: "down", icon: "timer",         grad: "linear-gradient(135deg,#FBBF24,#F97316)", spark: flat(ot) },
      { key: "staff",    label: "Total staff tracked",    value: people.length,   delta: 0, trend: "up",   icon: "users",         grad: "linear-gradient(135deg,#22D3EE,#3B82F6)", spark: flat(people.length) }
    ];
  }

  var today = new Date().toISOString().slice(0, 10);

  Promise.allSettled([
    rest("people", "order=name"),
    rest("activity_events", "order=occurred_at.desc&limit=100"),
    rest("attendance", "work_date=eq." + today)
  ]).then(function (res) {
    var ok = res[0].status === "fulfilled" && Array.isArray(res[0].value);
    if (!ok) {
      // Honest empty state — never fall back to fake names/projects.
      ["people","projects","initialActivity","meetings","kpis",
       "submissions","attendance","progressTrend","notifications"]
        .forEach(function (k) { repl(D[k], []); });
      window.TI_LIVE = false;
      console.warn("[Tangent Insight] live fetch failed; cleared mock data.");
      return;
    }

    var people = res[0].value.map(mapPerson);
    repl(D.people, people);

    var acts = (res[1].status === "fulfilled" ? res[1].value : []).map(mapEvent);
    repl(D.initialActivity, acts);

    var att = (res[2].status === "fulfilled" ? res[2].value : []).map(mapAtt);
    // keep a row per person; merge real attendance where present
    var byId = {}; att.forEach(function (a) { byId[a.id] = a; });
    repl(D.attendance, people.map(function (p) {
      return byId[p.id] || { id: p.id, inTime: "—", outTime: "—",
        breakMin: 0, status: p.status === "offline" ? "ABSENT" : "ON_TIME",
        hours: p.hours, ot: p.ot };
    }));

    var projects = deriveProjects(people);
    repl(D.projects, projects);
    repl(D.kpis, computeKpis(people, projects));

    // No real producer yet -> show empty, not sample data.
    repl(D.meetings, []);
    repl(D.submissions, []);
    repl(D.progressTrend, []);
    repl(D.notifications, []);

    window.TI_LIVE = true;
    console.info("[Tangent Insight] LIVE — " + people.length +
                 " staff, " + projects.length + " active documents.");
  });
})();
