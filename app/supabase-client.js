/* ============================================================================
 * Tangent Insight — LIVE data layer (ENABLED)
 * Replaces every mock surface in window.TI_DATA with real Supabase data and
 * fires "ti-data" events so the UI re-renders when async data arrives / polls.
 * ========================================================================== */
(function () {
  "use strict";

  var SUPABASE_URL  = "https://txbhogmhonwdsjkvnnur.supabase.co";
  var SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4YmhvZ21ob253ZHNqa3ZubnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODA2MTcsImV4cCI6MjA5NDc1NjYxN30.Fd753UA1UmI12i1LCOlvTc0TFBqhlBKaWgTn9YcyZVQ";

  var useMock = window.TI_USE_SUPABASE === false || /[?&]mock=1\b/.test(location.search);
  if (useMock) { console.info("[Tangent Insight] mock mode (forced)"); return; }

  var D = window.TI_DATA;
  if (!D) return;

  function rest(t, q) {
    return fetch(SUPABASE_URL + "/rest/v1/" + t + (q ? "?" + q : ""),
      { headers: { apikey: SUPABASE_ANON, Authorization: "Bearer " + SUPABASE_ANON } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); });
  }
  function repl(a, items) { if (!a) return; a.length = 0; if (items && items.length) Array.prototype.push.apply(a, items); }
  function num(v) { return v == null ? 0 : Number(v) || 0; }
  function inits(n) { return String(n||"").trim().split(/\s+/).slice(0,2).map(function(s){return s[0]||"";}).join("").toUpperCase()||"—"; }

  function mapPerson(r) {
    return { id:r.id, name:r.name, initials:r.initials||inits(r.name), role:r.role||"Staff",
      discipline:r.discipline||"UNASSIGNED", dept:r.dept||"Unassigned", status:r.status||"offline",
      project:r.project||"—", version:r.version||"—", focusMin:num(r.focus_min), idleMin:num(r.idle_min),
      hours:num(r.hours), ot:num(r.ot), utilization:num(r.utilization),
      machine:r.machine||"—", email:r.email||"", username:r.username||"",
      is_admin: !!r.is_admin };
  }
  function mapEvent(r, i) {
    return { id:r.id||i, kind:r.kind||"open", user:r.user_id, project:r.project||"—",
      t:Math.max(0,Math.round((Date.now()-new Date(r.occurred_at))/60000)),
      at:r.occurred_at, detail:r.detail||"" };
  }
  function mapAtt(r) {
    return { id:r.person_id, inTime:r.in_time||"—", outTime:r.out_time||"—",
      breakMin:num(r.break_min), status:r.status||"ABSENT", hours:num(r.hours), ot:num(r.ot) };
  }

  function deriveProjects(people) {
    var m = {};
    people.forEach(function (p) {
      var c = p.project; if (!c||c==="—"||c==="Multi") return;
      if (!m[c]) m[c] = { code:c, name:c, client:"—", stage:"DETAILED_DESIGN", health:"ON_TRACK",
        priority:"MEDIUM", activeUsers:0, totalUsers:0, modelSize:0, modelSizeUnit:"MB",
        warnings:0, errors:0, clashes:0, openViews:0, central:c, version:p.version||"—",
        linkedModels:0, lastSync:"live", progress:0, deadline:"—", worksets:0, criticality:0, sparkline:[] };
      m[c].totalUsers++;
      if (p.status==="online"||p.status==="meeting") m[c].activeUsers++;
    });
    return Object.keys(m).sort().map(function (k) { return m[k]; });
  }
  function computeKpis(people, projects) {
    var online=people.filter(function(p){return p.status==="online";}).length;
    var meeting=people.filter(function(p){return p.status==="meeting";}).length;
    var hours=Math.round(people.reduce(function(a,p){return a+p.hours;},0));
    var ot=Math.round(people.reduce(function(a,p){return a+p.ot;},0));
    var f=function(v){return [v,v,v,v,v,v,v,v,v,v,v,v];};
    return [
      {key:"projects",label:"Active Revit projects",value:projects.length,delta:0,trend:"up",icon:"folder-kanban",grad:"var(--grad-cyan, linear-gradient(135deg,#22D3EE,#3B82F6))",spark:f(projects.length)},
      {key:"online",label:"Users online now",value:online,delta:0,trend:"up",icon:"users",grad:"var(--grad-emerald, linear-gradient(135deg,#34D399,#14B8A6))",spark:f(online)},
      {key:"meeting",label:"In Teams meetings",value:meeting,delta:0,trend:"up",icon:"video",grad:"linear-gradient(135deg,#A78BFA,#A855F7)",spark:f(meeting)},
      {key:"hours",label:"Active work hours · today",value:hours,delta:0,trend:"up",icon:"clock",grad:"linear-gradient(135deg,#A78BFA,#A855F7)",spark:f(hours)},
      {key:"overtime",label:"Overtime · today",value:ot,delta:0,trend:"down",icon:"timer",grad:"linear-gradient(135deg,#FBBF24,#F97316)",spark:f(ot)},
      {key:"staff",label:"Total staff tracked",value:people.length,delta:0,trend:"up",icon:"users",grad:"linear-gradient(135deg,#22D3EE,#3B82F6)",spark:f(people.length)}
    ];
  }

  // Real heatmap from activity timestamps (day-of-week x hour 08-19)
  function buildHeatmap(events) {
    var days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    var hours=["08","09","10","11","12","13","14","15","16","17","18","19"];
    var cnt={}, maxc=1;
    events.forEach(function(e){
      if(!e.at) return;
      var dt=new Date(e.at);
      var dow=(dt.getDay()+6)%7;            // Mon=0
      var h=dt.getHours()-8;                // 08:00 -> 0
      if(h<0||h>11) return;
      var k=dow+"-"+h; cnt[k]=(cnt[k]||0)+1; if(cnt[k]>maxc) maxc=cnt[k];
    });
    var data=[];
    for(var d=0;d<7;d++) for(var h=0;h<12;h++){
      data.push({ d:d, h:h, v:(cnt[d+"-"+h]||0)/maxc });
    }
    D._hm={ days:days, hours:hours, data:data };
    return D._hm;
  }
  D.heatmap = function(){ return D._hm || { days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    hours:["08","09","10","11","12","13","14","15","16","17","18","19"], data:[] }; };

  function fire(){ try{ window.dispatchEvent(new Event("ti-data")); }catch(e){} }

  function load() {
    var today=new Date().toISOString().slice(0,10);
    return Promise.allSettled([
      rest("people","order=name"),
      rest("activity_events","order=occurred_at.desc&limit=200"),
      rest("attendance","work_date=eq."+today),
      rest("agent_machines","select=machine_id,person_id,online,last_seen"),
      rest("project_metrics","select=*")
    ]).then(function (res) {
      if (!(res[0].status==="fulfilled" && Array.isArray(res[0].value))) {
        ["people","projects","initialActivity","meetings","kpis","submissions","attendance","progressTrend","notifications"]
          .forEach(function(k){ repl(D[k],[]); });
        D.agentFleet={total:0,online:0,offline:0};
        window.TI_LIVE=false; fire();
        console.warn("[Tangent Insight] live fetch failed; cleared mock data.");
        return;
      }
      var people=res[0].value.map(mapPerson); repl(D.people,people);
      var acts=(res[1].status==="fulfilled"?res[1].value:[]).map(mapEvent); repl(D.initialActivity,acts);
      var att=(res[2].status==="fulfilled"?res[2].value:[]).map(mapAtt);
      var byId={}; att.forEach(function(a){byId[a.id]=a;});
      repl(D.attendance, people.map(function(p){
        var a = byId[p.id];
        return Object.assign({}, p, a || { id:p.id, inTime:"—", outTime:"—",
          breakMin:0, status:p.status==="offline"?"ABSENT":"ON_TIME", hours:p.hours, ot:p.ot });
      }));
      var projects=deriveProjects(people);
      // Merge in real project_metrics from the Revit plugin
      var metrics = (res[4].status==="fulfilled"?res[4].value:[]) || [];
      var metricsByProject = {};
      metrics.forEach(function(m){ metricsByProject[m.project] = m; });
      projects.forEach(function(p){
        var m = metricsByProject[p.code];
        if (m) {
          p.worksets     = m.worksets || 0;
          p.openViews    = m.open_views || 0;
          p.warnings     = m.warnings || 0;
          p.linkedModels = m.linked_models || 0;
          p.modelSize    = m.size_mb || 0;
          p.version      = m.revit_version || p.version;
        }
      });
      repl(D.projects,projects);
      repl(D.kpis,computeKpis(people,projects));
      repl(D.meetings,[]); repl(D.submissions,[]); repl(D.progressTrend,[]); repl(D.notifications,[]);
      buildHeatmap(acts);
      var mach=(res[3].status==="fulfilled"?res[3].value:[]);
      var on=mach.filter(function(m){return m.online;}).length;
      D.agentFleet={ total:mach.length, online:on, offline:mach.length-on };
      window.TI_LIVE=true; fire();
      console.info("[Tangent Insight] LIVE — "+people.length+" staff, "+projects.length+" documents, "+mach.length+" agents.");
    });
  }

  D.agentFleet = { total:0, online:0, offline:0 };
  window.TI_REFRESH = load;          // main.jsx polls this
  window.TI_SUPABASE_REST = rest;    // expose for other screens
  window.TI_SUPABASE = { url: SUPABASE_URL, anon: SUPABASE_ANON };
  load();
})();
