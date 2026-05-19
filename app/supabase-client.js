/* ============================================================================
 * Tangent Insight — OPTIONAL live data layer  (DISABLED BY DEFAULT)
 *
 * The dashboard ships on mock data (app/data.js). The agent fills Supabase in
 * parallel. When you are ready to switch the dashboard to live data:
 *
 *   1. In index.html, add this line AFTER app/data.js and BEFORE primitives:
 *        <script src="app/supabase-client.js"></script>
 *   2. Set the two constants below (URL + anon key).
 *   3. Set window.TI_USE_SUPABASE = true (or add ?live=1 to the URL).
 *
 * It overwrites window.TI_DATA in place, keeping the EXACT shape data.js
 * produces, so none of the 13 screen components need to change. If any fetch
 * fails it silently keeps the seed data already loaded — zero-risk fallback.
 * ========================================================================== */
(function () {
  "use strict";

  var SUPABASE_URL  = "https://YOUR-PROJECT.supabase.co";
  var SUPABASE_ANON = "YOUR-ANON-KEY";

  var useLive =
    window.TI_USE_SUPABASE === true ||
    /[?&]live=1\b/.test(location.search);

  if (!useLive) return;                 // default path: do nothing, keep mock

  function rest(table, query) {
    return fetch(
      SUPABASE_URL + "/rest/v1/" + table + (query ? "?" + query : ""),
      { headers: { apikey: SUPABASE_ANON, Authorization: "Bearer " + SUPABASE_ANON } }
    ).then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); });
  }

  // Map snake_case rows back to the camelCase shape data.js exposes.
  function mapPerson(r) {
    return {
      id: r.id, name: r.name, initials: r.initials, role: r.role,
      discipline: r.discipline, dept: r.dept, status: r.status,
      project: r.project, version: r.version, focusMin: r.focus_min,
      idleMin: r.idle_min, hours: Number(r.hours), ot: Number(r.ot),
      utilization: r.utilization, machine: r.machine
    };
  }
  function mapEvent(r, i) {
    return {
      id: r.id || i, kind: r.kind, user: r.user_id, project: r.project,
      t: Math.max(0, Math.round((Date.now() - new Date(r.occurred_at)) / 60000)),
      detail: r.detail
    };
  }
  function mapAttendance(r) {
    return {
      id: r.person_id, inTime: r.in_time, outTime: r.out_time || "—",
      breakMin: r.break_min, status: r.status,
      hours: Number(r.hours), ot: Number(r.ot)
    };
  }

  var D = window.TI_DATA;

  Promise.allSettled([
    rest("people", "order=id"),
    rest("activity_events", "order=occurred_at.desc&limit=50"),
    rest("attendance", "work_date=eq." + new Date().toISOString().slice(0, 10)),
    rest("agent_machines", "select=*")
  ]).then(function (res) {
    try {
      if (res[0].status === "fulfilled" && res[0].value.length) {
        var ppl = res[0].value.map(mapPerson);
        D.people.length = 0; Array.prototype.push.apply(D.people, ppl);
      }
      if (res[1].status === "fulfilled" && res[1].value.length) {
        D.initialActivity = res[1].value.map(mapEvent);
      }
      if (res[2].status === "fulfilled" && res[2].value.length) {
        var byId = {};
        res[2].value.forEach(function (a) { byId[a.person_id] = mapAttendance(a); });
        D.attendance.forEach(function (a, i) {
          if (byId[a.id]) D.attendance[i] = Object.assign({}, a, byId[a.id]);
        });
      }
      window.TI_LIVE = true;
      console.info("[Tangent Insight] live data loaded from Supabase");
    } catch (e) {
      console.warn("[Tangent Insight] live merge failed, using seed:", e);
    }
  });
})();
