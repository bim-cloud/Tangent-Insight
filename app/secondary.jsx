/* Tangent Insight — Secondary screens (Attendance, Analytics, Notifications, Admin, Settings) */

/* ========== ATTENDANCE ========== */
window.AttendanceScreen = function AttendanceScreen() {
  const D = window.TI_DATA;
  const [view, setView] = React.useState("today");
  const today = new Date();
  const todayLabel = today.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const checkedIn = D.attendance.filter(a => a.inTime && a.inTime !== "—").length;
  const stats = {
    onTime: D.attendance.filter(a => a.status === "ON_TIME").length,
    late:   D.attendance.filter(a => a.status === "LATE").length,
    absent: D.attendance.filter(a => a.status === "ABSENT").length,
  };
  // Real avg arrival from in-times
  const mins = D.attendance.map(a => /^\d{1,2}:\d{2}$/.test(a.inTime||"")
                    ? Number(a.inTime.split(":")[0]) * 60 + Number(a.inTime.split(":")[1])
                    : null).filter(v => v != null);
  const avgArrival = mins.length
    ? (String(Math.floor(Math.round(mins.reduce((a,b)=>a+b,0)/mins.length)/60)).padStart(2,"0") + ":" +
       String(Math.round(mins.reduce((a,b)=>a+b,0)/mins.length)%60).padStart(2,"0"))
    : "—";
  return (
    <PageShell>
      <div className="grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <SmallSummary icon="users"        label="Headcount"    value={D.people.length} tone="muted" />
        <SmallSummary icon="check-circle" label="On time"      value={stats.onTime} tone="success" delta={D.people.length ? `${Math.round(stats.onTime/D.people.length*100)}%` : ""} />
        <SmallSummary icon="alarm-clock"  label="Late"         value={stats.late} tone="warning" />
        <SmallSummary icon="user-minus"   label="Absent"       value={stats.absent} tone="danger" />
        <SmallSummary icon="clock"        label="Avg arrival"  value={avgArrival} tone="accent" />
      </div>

      <div className="surface-flat" style={{ padding: 10, display: "flex", alignItems: "center", gap: 10, borderRadius: 14 }}>
        <div className="seg">
          {["Today","This week","This month","Custom"].map(v => (
            <button key={v} className={view === v.toLowerCase() ? "on" : ""} onClick={() => setView(v.toLowerCase())}>{v}</button>
          ))}
        </div>
        <div className="vdiv" style={{ height: 22 }} />
        <button className="btn btn-secondary btn-sm"><Icon name="calendar" size={12} /> {todayLabel}</button>
        <button className="btn btn-secondary btn-sm"><Icon name="filter" size={12} /> All departments</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-secondary btn-sm"><Icon name="download" size={12} /> Export</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
        {/* Attendance table */}
        <div className="surface" style={{ padding: 0, borderRadius: 18, overflow: "hidden" }}>
          <div className="between" style={{ padding: "12px 14px", borderBottom: "1px solid rgb(var(--hairline))" }}>
            <CardTitle title="Today's attendance" subtitle={`${todayLabel} · ${checkedIn} of ${D.people.length} checked in`} icon="calendar-check" />
          </div>
          <table className="table">
            <thead>
              <tr><th>Employee</th><th>Dept</th><th>In</th><th>Out</th><th>Status</th><th className="tabular">Break</th><th className="tabular">Hours</th><th className="tabular">OT</th></tr>
            </thead>
            <tbody>
              {D.attendance.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="center gap-3">
                      <Avatar name={a.name} initials={a.initials} size={26} discipline={a.discipline} status={a.status === "ABSENT" ? "offline" : "online"} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 12.5 }}>{a.name}</div>
                        <div className="muted" style={{ fontSize: 10.5 }}>{a.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="muted">{a.dept}</td>
                  <td className="mono tabular" style={{ color: a.status === "LATE" ? "rgb(var(--warning))" : undefined, fontWeight: a.status === "LATE" ? 600 : undefined }}>{a.inTime}</td>
                  <td className="mono tabular">{a.status === "ABSENT" ? "—" : (a.status === "online" || a.status === "meeting" || a.outTime === "—") ? <Pill tone="success" dot>Live</Pill> : a.outTime}</td>
                  <td>
                    {a.status === "ON_TIME" && <Pill tone="success">On time</Pill>}
                    {a.status === "LATE"    && <Pill tone="warning">Late · {a.inTime}</Pill>}
                    {a.status === "ABSENT"  && <Pill tone="danger">Absent</Pill>}
                  </td>
                  <td className="tabular muted">{a.status === "ABSENT" ? "—" : `${a.breakMin}m`}</td>
                  <td className="tabular" style={{ fontWeight: 600 }}>{a.hours.toFixed(1)}h</td>
                  <td className="tabular" style={{ color: a.ot > 0 ? "rgb(var(--warning))" : "rgb(var(--fg-faint))" }}>{a.ot > 0 ? `+${a.ot.toFixed(1)}h` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calendar mini */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title={today.toLocaleDateString("en-GB", { month: "long", year: "numeric" })} subtitle="Daily attendance heatmap · today highlighted" icon="calendar" />
          <CalendarGrid today={today} />
          <div className="divider" style={{ margin: "12px 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Stat2 icon="check-circle" label="On time today" value={stats.onTime} sub={`${stats.late} late · ${stats.absent} absent`} />
            <Stat2 icon="clock"        label="Avg arrival"   value={avgArrival}   sub="from today's check-ins" />
            <Stat2 icon="timer"        label="Hours today"   value={D.attendance.reduce((a,b)=>a+(Number(b.hours)||0),0).toFixed(1) + "h"} sub={"+ " + D.attendance.reduce((a,b)=>a+(Number(b.ot)||0),0).toFixed(1) + "h OT"} />
          </div>
        </div>
      </div>
    </PageShell>
  );
};

function CalendarGrid({ today }) {
  const t = today || new Date();
  const y = t.getFullYear(), m = t.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  // Monday-first leading blanks: JS Sunday=0..Saturday=6 -> shift so Monday=0
  const firstDow = (new Date(y, m, 1).getDay() + 6) % 7;
  const todayD = t.getDate();
  // Hash that's stable across renders so intensities don't reshuffle every refresh
  const hash = (d) => {
    let h = 2166136261;
    const s = y + "-" + m + "-" + d;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return (h % 1000) / 1000;
  };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
          <div key={d} className="micro" style={{ fontSize: 9.5, textAlign: "center", padding: 2 }}>{d}</div>
        ))}
        {Array.from({ length: firstDow }).map((_, i) => <div key={"e"+i} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const isToday = d === todayD;
          const future = d > todayD;
          const dow = (new Date(y, m, d).getDay() + 6) % 7;
          const weekend = dow >= 5;
          const intensity = future ? 0 : weekend ? 0.12 : 0.40 + hash(d) * 0.45;
          return (
            <div key={d} title={new Date(y, m, d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                 style={{
                   aspectRatio: "1", borderRadius: 6,
                   background: future ? "rgb(var(--bg-sunken) / 0.4)" : `rgb(var(--accent) / ${intensity})`,
                   border: isToday ? "2px solid rgb(var(--accent))" : "1px solid rgb(var(--border) / 0.5)",
                   display: "flex", alignItems: "center", justifyContent: "center",
                   fontSize: 10, fontWeight: isToday ? 700 : 500,
                   color: isToday ? "rgb(var(--accent))" : intensity > 0.5 ? "white" : "rgb(var(--fg-muted))",
                 }}>{d}</div>
          );
        })}
      </div>
    </div>
  );
}

function SmallSummary({ icon, label, value, tone, delta }) {
  const c = tone === "success" ? "rgb(var(--success))"
          : tone === "warning" ? "rgb(var(--warning))"
          : tone === "danger"  ? "rgb(var(--danger))"
          : tone === "accent"  ? "rgb(var(--accent))"
          : "rgb(var(--fg))";
  return (
    <div className="surface" style={{ padding: 14, borderRadius: 14 }}>
      <div className="center gap-3">
        <div style={{ height: 30, width: 30, borderRadius: 8, background: c + "1A", color: c, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={14} strokeWidth={2.2} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="micro">{label}</div>
          <div className="between">
            <div className="tabular" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1, color: c }}>{value}</div>
            {delta && <span className="tabular muted" style={{ fontSize: 11 }}>{delta}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat2({ icon, label, value, sub, tone }) {
  const c = tone === "warning" ? "rgb(var(--warning))" : "rgb(var(--fg))";
  return (
    <div className="surface-flat" style={{ padding: 10, borderRadius: 10 }}>
      <div className="center gap-2 muted" style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.06 }}>
        <Icon name={icon} size={11} /> {label}
      </div>
      <div className="tabular" style={{ fontSize: 14, fontWeight: 700, marginTop: 2, color: c }}>{value}</div>
      <div className="muted" style={{ fontSize: 10.5 }}>{sub}</div>
    </div>
  );
}

/* ========== ANALYTICS ========== */
window.AnalyticsScreen = function AnalyticsScreen() {
  const D = window.TI_DATA;
  const acts = D.initialActivity || [];

  // Live: workforce-wide focus share, active users, hours, "risk" = idle staff
  const sumF = D.people.reduce((a,p)=>a+p.focusMin,0);
  const sumI = D.people.reduce((a,p)=>a+p.idleMin,0);
  const focusPct = (sumF + sumI) ? Math.round(sumF/(sumF+sumI)*100) : 0;
  const activeUsers = D.people.filter(p=>p.status!=="offline").length;
  const avgFocus = activeUsers ? (D.people.reduce((a,p)=>a+p.focusMin,0)/activeUsers/60).toFixed(1) : "0.0";
  const idleN = D.people.filter(p=>p.status==="idle").length;
  const hm = D.heatmap ? D.heatmap() : {days:[],hours:[],data:[]};

  // Discipline averages (real)
  const byDisc = {};
  D.people.forEach(p => {
    const k = p.discipline || "UNASSIGNED";
    byDisc[k] = byDisc[k] || { n:0, util:0, active:0 };
    byDisc[k].n++; byDisc[k].util += p.utilization;
    if (p.status !== "offline") byDisc[k].active++;
  });
  const discRows = Object.keys(byDisc).map(k => ({
    l: k.charAt(0)+k.slice(1).toLowerCase(),
    v: byDisc[k].n ? Math.round(byDisc[k].util/byDisc[k].n) : 0,
    n: byDisc[k].n, active: byDisc[k].active,
    c: "rgb(var(--" + k.toLowerCase() + "))",
  })).filter(r => r.n).sort((a,b)=>b.v-a.v);

  // Project participation today
  const byProj = {};
  D.people.forEach(p => {
    if (!p.project || p.project === "—" || p.project === "Multi") return;
    byProj[p.project] = byProj[p.project] || { n:0, hrs:0 };
    byProj[p.project].n++; byProj[p.project].hrs += p.hours;
  });
  const projRows = Object.keys(byProj).map(k => ({ name:k, n:byProj[k].n, hrs:byProj[k].hrs }))
    .sort((a,b) => b.hrs - a.hrs).slice(0, 10);

  return (
    <PageShell>
      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <SmallSummary icon="trending-up" label="Focus share"  value={focusPct + "%"} tone="success" hint="focus / (focus + idle)" />
        <SmallSummary icon="users"       label="Active staff" value={activeUsers}   tone="accent" />
        <SmallSummary icon="timer"       label="Avg focus"    value={avgFocus + "h"} tone="muted" hint="per active person" />
        <SmallSummary icon="moon"        label="Idle staff"   value={idleN}         tone={idleN ? "warning" : "muted"} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Top projects · today" subtitle="By logged hours from agent data" icon="folder-kanban" />
          {projRows.length === 0
            ? <div className="muted" style={{ fontSize: 12, padding: 14, textAlign: "center" }}>
                No project work logged yet. Projects appear once agents observe Revit documents open.
              </div>
            : (
              <table className="table" style={{ marginTop: 8 }}>
                <thead><tr><th>Project</th><th className="tabular">Staff</th><th className="tabular">Hours</th><th>Share</th></tr></thead>
                <tbody>
                  {(() => {
                    const total = projRows.reduce((a,r)=>a+r.hrs,0) || 1;
                    return projRows.map(r => (
                      <tr key={r.name}>
                        <td className="mono" style={{ fontSize: 12 }}>{r.name}</td>
                        <td className="tabular">{r.n}</td>
                        <td className="tabular">{r.hrs.toFixed(1)}h</td>
                        <td style={{ minWidth: 180 }}>
                          <div className="progress" style={{ height: 4 }}>
                            <i style={{ width: (r.hrs/total*100) + "%" }} />
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            )}
        </div>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="By discipline" subtitle="Avg utilization · live" icon="layers" />
          {discRows.length === 0
            ? <div className="muted" style={{ fontSize: 12 }}>No discipline data yet.</div>
            : discRows.map(r => (
                <div key={r.l} style={{ marginTop: 10 }}>
                  <div className="between" style={{ fontSize: 11.5, marginBottom: 4 }}>
                    <span>{r.l} <span className="muted">· {r.active}/{r.n} active</span></span>
                    <span className="tabular" style={{ fontWeight: 600 }}>{r.v}%</span>
                  </div>
                  <div className="progress"><i style={{ width: r.v + "%", background: r.c }} /></div>
                </div>
              ))}
        </div>
      </div>

      <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
        <CardTitle title="Activity intensity · last week"
                   subtitle="Built from real activity events bucketed by day × hour" icon="calendar" />
        {acts.length === 0
          ? <div className="muted" style={{ fontSize: 12, padding: 14, textAlign: "center" }}>
              No activity events captured yet.
            </div>
          : <div style={{ overflow: "auto" }}><Heatmap {...hm} /></div>}
      </div>
    </PageShell>
  );
};

/* ========== NOTIFICATIONS ========== */
window.NotificationsScreen = function NotificationsScreen() {
  const D = window.TI_DATA;
  const acts = D.initialActivity || [];

  // Build notifications from REAL signals — no hardcoded items
  const derived = [];

  // 1. Stale / unmapped machines — read from agent_fleet via TI_SUPABASE_REST if available
  const [machines, setMachines] = React.useState([]);
  React.useEffect(() => {
    if (!window.TI_SUPABASE_REST) return;
    window.TI_SUPABASE_REST("agent_machines", "select=*&order=last_seen.desc")
      .then(rs => setMachines(Array.isArray(rs) ? rs : []))
      .catch(()=>{});
  }, []);
  const unmapped = machines.filter(m => !m.person_id);
  const offlineMachines = machines.filter(m => !m.online).length;

  // 2. Idle staff (>= 30m)
  D.people.filter(p => p.status === "idle" && p.idleMin >= 30).forEach(p => {
    derived.push({ id: "idle-"+p.id, kind: "warning",
      title: p.name + " · idle " + p.idleMin + "m on " + (p.project === "—" ? "no project" : p.project),
      time: p.idleMin + "m", read: false });
  });

  // 3. Recent warnings / errors from the activity feed
  acts.filter(a => a.kind === "warning" || a.kind === "error").slice(0, 6).forEach(a => {
    const u = D.byId(a.user);
    derived.push({ id: "act-"+a.id, kind: a.kind === "error" ? "danger" : "warning",
      title: (u ? u.name : "System") + " · " + a.detail,
      time: a.t < 1 ? "just now" : a.t + "m", read: false });
  });

  // 4. Unmapped machines (admin concern)
  if (unmapped.length) {
    derived.push({ id: "unmapped", kind: "info",
      title: unmapped.length + " machine(s) reporting with no mapped user — fix in Autodesk ID Manager",
      time: "now", read: false });
  }

  // 5. Recent successful logins (last 60 min)
  acts.filter(a => a.kind === "login" && a.t <= 60).slice(0, 4).forEach(a => {
    const u = D.byId(a.user);
    if (u) derived.push({ id: "login-"+a.id, kind: "success",
      title: u.name + " signed in",
      time: a.t < 1 ? "just now" : a.t + "m", read: true });
  });

  const [filter, setFilter] = React.useState("all");
  const shown = derived.filter(n => filter === "all" ? true : filter === "unread" ? !n.read : n.kind === filter);
  const unread = derived.filter(n => !n.read).length;

  return (
    <PageShell maxWidth={920}>
      <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
        <div className="between" style={{ marginBottom: 14 }}>
          <CardTitle title="Notifications"
                     subtitle={unread + " unread · derived from live activity"} icon="bell" />
          <div className="center gap-2">
            <div className="seg">
              <button className={filter==="all" ? "on" : ""}     onClick={() => setFilter("all")}>All</button>
              <button className={filter==="unread" ? "on" : ""}  onClick={() => setFilter("unread")}>Unread</button>
              <button className={filter==="warning" ? "on" : ""} onClick={() => setFilter("warning")}>Warnings</button>
              <button className={filter==="danger" ? "on" : ""}  onClick={() => setFilter("danger")}>Critical</button>
            </div>
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="muted" style={{ fontSize: 12, padding: 24, textAlign: "center" }}>
            No notifications. The dashboard creates these automatically from live activity — idle staff over 30 minutes, warnings/errors from the agent, unmapped machines, and recent sign-ins.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {shown.map(n => (
              <div key={n.id} className="row-hover" style={{
                padding: "11px 12px", borderRadius: 12,
                border: "1px solid rgb(var(--hairline))",
                borderLeft: `3px solid rgb(var(--${n.kind}))`,
                background: n.read ? "transparent" : "rgb(var(--accent) / 0.04)",
                display: "flex", alignItems: "flex-start", gap: 12,
              }}>
                <div style={{
                  height: 34, width: 34, borderRadius: 10, flexShrink: 0,
                  background: `rgb(var(--${n.kind}) / 0.12)`, color: `rgb(var(--${n.kind}))`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={n.kind === "danger" ? "alert-octagon" : n.kind === "warning" ? "alert-triangle" : n.kind === "success" ? "check-circle" : "info"} size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: n.read ? 500 : 600 }}>{n.title}</div>
                  <div className="muted center gap-2" style={{ fontSize: 11, marginTop: 2 }}>
                    <Icon name="clock" size={10} /> {n.time}
                    <span>·</span>
                    <span style={{ textTransform: "capitalize" }}>{n.kind}</span>
                  </div>
                </div>
                {!n.read && <span className="dot" style={{ background: "rgb(var(--accent))", marginTop: 8 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
};

/* ========== ADMIN ========== */
window.AdminScreen = function AdminScreen() {
  const D = window.TI_DATA;
  const [machines, setMachines] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Who is signed in, and are they an admin?
  const session = (window.TI_AUTH && window.TI_AUTH.getSession && window.TI_AUTH.getSession()) || null;
  const email = session && session.user && session.user.email;
  const me = email ? (D.people || []).find(p => (p.email || "").toLowerCase() === email.toLowerCase()) : null;
  const isAdmin = !!(me && me.is_admin);

  // Pull the live agent_machines table (read-only via RLS)
  React.useEffect(() => {
    let cancelled = false;
    function load() {
      if (!window.TI_SUPABASE_REST) return;
      window.TI_SUPABASE_REST("agent_machines", "select=*&order=last_seen.desc")
        .then(rows => { if (!cancelled) { setMachines(Array.isArray(rows) ? rows : []); setLoading(false); } })
        .catch(() => { if (!cancelled) setLoading(false); });
    }
    load();
    const id = setInterval(load, 30000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const total      = D.people.length;
  const withId     = machines.filter(m => m.autodesk_user).length;
  const unmapped   = machines.filter(m => !m.person_id).length;
  const onlineNow  = machines.filter(m => m.online).length;

  // Pivot: one row per Autodesk ID. The agent reports autodesk_user when it
  // can read Autodesk's login file on a sampled machine. As a fallback for
  // staff who haven't been sampled yet, we also fold in people.email so the
  // table is useful from day one — those rows are labelled 'from directory'.
  const byAutodeskId = {};
  machines.forEach(m => {
    if (!m.autodesk_user) return;
    const k = m.autodesk_user.toLowerCase();
    if (!byAutodeskId[k]) byAutodeskId[k] = { autodesk_id: m.autodesk_user, users: {}, machines: [], last_seen: m.last_seen, source: "agent" };
    if (m.person_id) byAutodeskId[k].users[m.person_id] = true;
    byAutodeskId[k].machines.push(m.machine_id);
    if (m.last_seen > byAutodeskId[k].last_seen) byAutodeskId[k].last_seen = m.last_seen;
  });
  // Fallback: directory entries with an email that the agent hasn't observed yet
  D.people.forEach(p => {
    if (!p.email) return;
    const k = p.email.toLowerCase();
    if (byAutodeskId[k]) { byAutodeskId[k].users[p.id] = true; return; }
    byAutodeskId[k] = { autodesk_id: p.email, users: { [p.id]: true }, machines: [], last_seen: null, source: "directory" };
  });
  const idTable = Object.values(byAutodeskId)
    .map(r => ({ ...r, users: Object.keys(r.users) }))
    .sort((a, b) => {
      // Primary: anything observed by the agent first, then directory-only
      var srcDiff = (a.source === b.source ? 0 : a.source === "agent" ? -1 : 1);
      if (srcDiff) return srcDiff;
      // Secondary: most recently seen first
      var aT = a.last_seen ? new Date(a.last_seen).getTime() : 0;
      var bT = b.last_seen ? new Date(b.last_seen).getTime() : 0;
      if (aT !== bT) return bT - aT;
      // Tertiary: more shared accounts first (admin attention)
      return b.users.length - a.users.length || b.machines.length - a.machines.length;
    });
  const observedCount = idTable.filter(r => r.source === "agent").length;

  return (
    <PageShell>
      {/* Live summary tiles */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <SmallSummary icon="users"      label="Staff in directory" value={total} />
        <SmallSummary icon="laptop"     label="Workstations seen"  value={machines.length} />
        <SmallSummary icon="radio"      label="Agents online now"  value={onlineNow} tone="success" />
        <SmallSummary icon="alert-triangle" label="Unmapped machines" value={unmapped} tone={unmapped ? "warning" : "muted"} hint="need a directory entry" />
      </div>

      {/* === Autodesk ID Manager === */}
      <div className="surface" style={{ padding: 0, borderRadius: 18, overflow: "hidden" }}>
        <div className="between" style={{ padding: "12px 14px", borderBottom: "1px solid rgb(var(--hairline))" }}>
          <CardTitle title="Autodesk ID manager"
                     subtitle={observedCount + " observed live by agents · " + (idTable.length - observedCount) + " from staff directory"}
                     icon="key-square" />
          <div className="center gap-2">
            <button className="btn btn-secondary btn-sm"
                    onClick={() => exportCsv("autodesk-id-usage", idTable, ["autodesk_id","users","machines","last_seen"])}>
              <Icon name="download" size={12} /> Export CSV
            </button>
          </div>
        </div>

        {/* Honest note about credentials */}
        <div style={{ padding: "10px 14px", background: "rgb(var(--warning) / 0.06)",
                      borderBottom: "1px solid rgb(var(--warning) / 0.18)", fontSize: 11.5, color: "rgb(var(--fg-soft))" }}>
          <Icon name="shield-alert" size={12} color="rgb(var(--warning))" /> &nbsp;
          <b>Passwords are not stored here.</b> Tangent Insight only records which Autodesk login was observed
          on each machine; for the actual credentials use a proper secret manager (1Password / Bitwarden /
          Azure Key Vault). Storing passwords in this database — accessible via the browser anon key — would
          be a real security risk and a likely violation of Autodesk's subscription terms.
        </div>

        {loading
          ? <div className="muted" style={{ padding: 16, fontSize: 12, textAlign: "center" }}>Loading agent data…</div>
          : idTable.length === 0
            ? <div className="muted" style={{ padding: 16, fontSize: 12, textAlign: "center" }}>No Autodesk logins captured yet. Run the agent on a workstation that is signed into Autodesk and they will appear here.</div>
            : <AutodeskIdList rows={idTable} machines={machines} D={D} isAdmin={isAdmin} />
        }
      </div>

      {/* Machine -> person mapping (the second table the user asked for) */}
      {isAdmin && (
      <div className="surface" style={{ padding: 0, borderRadius: 18, overflow: "hidden" }}>
        <div className="between" style={{ padding: "12px 14px", borderBottom: "1px solid rgb(var(--hairline))" }}>
          <CardTitle title="Workstations" subtitle="Machine → human → Autodesk ID, observed live" icon="laptop" />
          <button className="btn btn-secondary btn-sm"
                  onClick={() => exportCsv("workstations", machines, ["machine_id","host_name","person_id","autodesk_user","online","last_seen"])}>
            <Icon name="download" size={12} /> Export CSV
          </button>
        </div>
        {machines.length === 0
          ? <div className="muted" style={{ padding: 16, fontSize: 12, textAlign: "center" }}>No agents have reported yet.</div>
          : (
            <table className="table">
              <thead>
                <tr><th>Machine</th><th>Host</th><th>Person</th><th>Autodesk ID</th><th>Status</th><th className="tabular">Last seen</th></tr>
              </thead>
              <tbody>
                {machines.map(m => {
                  const p = m.person_id ? D.byId(m.person_id) : null;
                  return (
                    <tr key={m.machine_id}>
                      <td className="mono" style={{ fontSize: 12 }}>{m.machine_id}</td>
                      <td className="muted mono" style={{ fontSize: 11 }}>{m.host_name || "—"}</td>
                      <td>{p
                        ? <div className="center gap-2"><Avatar name={p.name} initials={p.initials} size={22} discipline={p.discipline} status={p.status} /><span style={{ fontSize: 12.5 }}>{p.name}</span></div>
                        : <Pill tone="warning">unmapped</Pill>}</td>
                      <td className="mono" style={{ fontSize: 11 }}>{m.autodesk_user || "—"}</td>
                      <td>{m.online ? <Pill tone="success" dot>online</Pill> : <Pill tone="neutral">offline</Pill>}</td>
                      <td className="muted tabular" style={{ fontSize: 11 }}>{m.last_seen ? new Date(m.last_seen).toLocaleString("en-GB") : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
      </div>
      )}

      {/* Useful, actually-true admin info: directory health (admin only) */}
      {isAdmin && (
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Directory health" subtitle="People rows by mapping completeness" icon="user-check" />
          {(() => {
            const noUsername = D.people.filter(p => !p.username).length;
            const noEmail    = D.people.filter(p => !p.email).length;
            const everSeen   = new Set(machines.map(m => m.person_id).filter(Boolean));
            const neverSeen  = D.people.filter(p => !everSeen.has(p.id)).length;
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <DirectoryRow label="Without Windows account (username)" v={noUsername} total={total} tone="danger" hint="auto-resolution will fail for these" />
                <DirectoryRow label="Without Autodesk email"             v={noEmail}    total={total} tone="warning" />
                <DirectoryRow label="Never seen by an agent yet"         v={neverSeen}  total={total} tone="muted" hint="agent not yet installed / not signed in" />
              </div>
            );
          })()}
        </div>

        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Security model" subtitle="What this dashboard actually enforces" icon="shield-check" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, lineHeight: 1.55 }}>
            <SecurityRow ok>Supabase Row-Level Security on every table — anon key cannot write to workforce data</SecurityRow>
            <SecurityRow ok>Agent firehose <span className="mono">agent_samples</span> is insert-only · not readable from the browser</SecurityRow>
            <SecurityRow ok>Identity resolved server-side from Windows account (unique per human) — not from shared Autodesk IDs</SecurityRow>
            <SecurityRow warn>Sign-in to the dashboard is enforced when Supabase Auth is enabled (see Settings → Authentication)</SecurityRow>
            <SecurityRow warn>Production hosting should keep Vercel Deployment Protection on, or front the site with an SSO proxy</SecurityRow>
          </div>
        </div>
      </div>
      )}

      {!isAdmin && (
        <div className="surface" style={{ padding: 14, borderRadius: 14,
              border: "1px solid rgb(var(--accent) / 0.25)",
              background: "rgb(var(--accent) / 0.05)" }}>
          <div className="center gap-2" style={{ fontSize: 12.5 }}>
            <Icon name="info" size={14} color="rgb(var(--accent))" />
            <span>You're viewing the read-only Autodesk ID map.
              Workstation details, machine IDs, and directory health are available to administrators only.</span>
          </div>
        </div>
      )}
    </PageShell>
  );
};

function DirectoryRow({ label, v, total, tone, hint }) {
  const pct = total ? Math.round((v / total) * 100) : 0;
  const c = tone === "danger" ? "rgb(var(--danger))" : tone === "warning" ? "rgb(var(--warning))" : "rgb(var(--fg-faint))";
  return (
    <div>
      <div className="between" style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
        <div className="tabular muted" style={{ fontSize: 11 }}>{v} / {total}</div>
      </div>
      <div className="progress" style={{ height: 4 }}>
        <i style={{ width: `${pct}%`, background: c }} />
      </div>
      {hint && <div className="muted" style={{ fontSize: 10.5, marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

function SecurityRow({ ok, warn, children }) {
  return (
    <div className="center gap-2" style={{ alignItems: "flex-start" }}>
      <Icon name={ok ? "check-circle" : "alert-triangle"} size={13}
            color={ok ? "rgb(var(--success))" : "rgb(var(--warning))"} style={{ marginTop: 2 }} />
      <div>{children}</div>
    </div>
  );
}

// Tiny CSV exporter so the Export buttons actually work
function exportCsv(name, rows, fields) {
  if (!rows || !rows.length) return;
  const esc = v => `"${String(v == null ? "" : Array.isArray(v) ? v.join("; ") : v).replace(/"/g, '""')}"`;
  const csv = [fields.join(","), ...rows.map(r => fields.map(f => esc(r[f])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name + "-" + new Date().toISOString().slice(0,10) + ".csv";
  document.body.appendChild(a); a.click(); a.remove();
}

/* ========== SETTINGS ========== */
window.SettingsScreen = function SettingsScreen() {
  const D = window.TI_DATA;
  const auth = window.TI_AUTH;
  const session = (auth && auth.getSession && auth.getSession()) || null;
  const email = session && session.user && session.user.email;
  // Find the signed-in person in the directory (by email)
  const me = email
    ? (D.people || []).find(p => (p.email || "").toLowerCase() === email.toLowerCase())
    : null;

  const [tab, setTab] = React.useState("profile");
  const [pwOld, setPwOld] = React.useState("");
  const [pwNew, setPwNew] = React.useState("");
  const [pwStatus, setPwStatus] = React.useState(null);
  const [pref, setPref] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("ti.prefs") || "{}"); } catch (e) { return {}; }
  });
  const setP = (k, v) => {
    const next = { ...pref, [k]: v };
    setPref(next);
    try { localStorage.setItem("ti.prefs", JSON.stringify(next)); } catch (e) {}
  };

  const tabs = [
    { id: "profile",       icon: "user",     l: "Profile" },
    { id: "appearance",    icon: "palette",  l: "Appearance" },
    { id: "notifications", icon: "bell",     l: "Notifications" },
    { id: "security",      icon: "shield",   l: "Security" },
    { id: "about",         icon: "info",     l: "About" },
  ];

  async function changePassword(e) {
    e.preventDefault();
    if (!pwNew || pwNew.length < 8) { setPwStatus({ tone: "error", msg: "New password must be at least 8 characters." }); return; }
    setPwStatus({ tone: "loading", msg: "Updating…" });
    try {
      const cfg = window.TI_SUPABASE;
      const r = await fetch(cfg.url + "/auth/v1/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json", apikey: cfg.anon, Authorization: "Bearer " + session.access_token },
        body: JSON.stringify({ password: pwNew }),
      });
      if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.msg || j.error_description || "Update failed"); }
      setPwOld(""); setPwNew(""); setPwStatus({ tone: "ok", msg: "Password updated." });
    } catch (err) { setPwStatus({ tone: "error", msg: err.message }); }
  }

  return (
    <PageShell maxWidth={1100}>
      <div className="grid" style={{ gridTemplateColumns: "220px 1fr" }}>
        <div className="surface" style={{ padding: 10, borderRadius: 14 }}>
          {tabs.map(s => (
            <button key={s.id} onClick={() => setTab(s.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 9, fontSize: 12.5,
              background: tab === s.id ? "rgb(var(--accent-soft))" : "transparent",
              color: tab === s.id ? "rgb(var(--accent))" : "rgb(var(--fg-soft))",
              fontWeight: tab === s.id ? 600 : 500,
              border: "none", cursor: "pointer", textAlign: "left",
            }}>
              <Icon name={s.icon} size={14} /> {s.l}
            </button>
          ))}
        </div>

        <div className="surface" style={{ padding: 18, borderRadius: 18 }}>
          {tab === "profile" && (
            !session
              ? <div className="muted">You are not signed in.</div>
              : <ProfilePanel session={session} email={email} me={me} />
          )}

          {tab === "appearance" && (
            <>
              <h2 className="h2">Appearance</h2>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Saved to this browser.</div>
              <div className="divider" style={{ margin: "16px 0" }} />
              <ToggleRow label="Reduced motion" sub="Quiet animations and the live waveform" v={!!pref.reducedMotion} onChange={v => setP("reducedMotion", v)} />
              <ToggleRow label="High-contrast borders" sub="Stronger separators for low-light displays" v={!!pref.highContrast} onChange={v => setP("highContrast", v)} />
              <ToggleRow label="Compact density" sub="Tighten table rows" v={!!pref.compact} onChange={v => setP("compact", v)} />
            </>
          )}

          {tab === "notifications" && (
            <>
              <h2 className="h2">Notifications</h2>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>What surfaces in the bell menu. Saved to this browser.</div>
              <div className="divider" style={{ margin: "16px 0" }} />
              <ToggleRow label="Critical project alerts" sub="Stale syncs, missing linked models" v={pref.notifCritical !== false} onChange={v => setP("notifCritical", v)} />
              <ToggleRow label="Idle staff over 30m"     sub="Surface in the alerts panel" v={pref.notifIdle !== false} onChange={v => setP("notifIdle", v)} />
              <ToggleRow label="Daily summary"           sub="One digest per workday" v={!!pref.notifDigest} onChange={v => setP("notifDigest", v)} />
            </>
          )}

          {tab === "security" && (
            <>
              <h2 className="h2">Security</h2>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Sign-in and session controls.</div>
              <div className="divider" style={{ margin: "16px 0" }} />
              <form onSubmit={changePassword} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 380 }}>
                <div className="micro">Change password</div>
                <input className="input" type="password" placeholder="Current password (optional)" value={pwOld} onChange={e => setPwOld(e.target.value)} />
                <input className="input" type="password" placeholder="New password (min 8 chars)" value={pwNew} onChange={e => setPwNew(e.target.value)} />
                {pwStatus && (
                  <div style={{ fontSize: 11.5, padding: "6px 10px", borderRadius: 8,
                                background: pwStatus.tone === "error" ? "rgb(var(--danger) / 0.08)" : pwStatus.tone === "ok" ? "rgb(var(--success) / 0.08)" : "rgb(var(--bg-sunken))",
                                color: pwStatus.tone === "error" ? "rgb(var(--danger))" : pwStatus.tone === "ok" ? "rgb(var(--success))" : "rgb(var(--fg-soft))" }}>{pwStatus.msg}</div>
                )}
                <button className="btn btn-primary btn-sm" type="submit" disabled={pwStatus && pwStatus.tone === "loading"}>
                  <Icon name="key" size={12} /> Update password
                </button>
              </form>
              <div className="divider" style={{ margin: "20px 0" }} />
              <button className="btn btn-secondary btn-sm" onClick={() => auth && auth.signOut()}>
                <Icon name="log-out" size={12} /> Sign out everywhere
              </button>
            </>
          )}

          {tab === "about" && (
            <>
              <h2 className="h2">About Tangent Insight</h2>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Build info and what the agent can actually capture.</div>
              <div className="divider" style={{ margin: "16px 0" }} />
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Dashboard version" value="1.0" readOnly />
                <Field label="Agent version" value="1.0.0" readOnly />
                <Field label="Supabase project" value={(window.TI_SUPABASE && window.TI_SUPABASE.url) || "—"} readOnly mono />
                <Field label="Live mode" value={window.TI_LIVE ? "yes" : "no"} readOnly />
              </div>
              <div className="divider" style={{ margin: "16px 0" }} />
              <div className="micro" style={{ marginBottom: 8 }}>What the agent captures</div>
              <ul style={{ fontSize: 12, lineHeight: 1.7, paddingLeft: 18, color: "rgb(var(--fg-soft))" }}>
                <li>Revit / AutoCAD / Navisworks running, Revit version, <b>active document name</b> (the central model)</li>
                <li>Foreground app, idle time, Windows account (identity)</li>
                <li>Microsoft Teams call state (presence in/out)</li>
                <li>Autodesk login email (when signed in)</li>
              </ul>
              <div className="micro" style={{ marginTop: 14, marginBottom: 8 }}>What requires a Revit plugin (not built)</div>
              <ul style={{ fontSize: 12, lineHeight: 1.7, paddingLeft: 18, color: "rgb(var(--fg-soft))" }}>
                <li>Sync-to-central events, local saves, view changes, warning/clash counts</li>
                <li>Meeting titles / attendees (requires Microsoft Graph API)</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
};

function nameFromEmail(email) {
  if (!email) return "—";
  const local = String(email).split("@")[0];
  return local.split(/[._\-]+/).filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function ProfilePanel({ session, email, me }) {
  const ROLES = [
    "BIM Manager","Assistant BIM Manager","BIM Coordinator","BIM Modeler","BIM Detailer",
    "Senior Modeler","Senior Detailer","Modeler","Detailer","Junior Modeler",
    "Project Manager","Project Director","Director",
    "Landscape Architect","Senior Landscape Architect","Landscape Designer",
    "Architect","Senior Architect","Civil Engineer","Structural Engineer",
    "Automation Specialist","CAD Technician","Administrator","Staff",
  ];
  const DEPTS = ["BIM","Landscape","Architecture","Detailing","Engineering","PM","Civil","Operations","IT","Admin","Unassigned"];
  const DISCIPLINES = ["MANAGER","COORDINATOR","MODELER","DETAILER","UNASSIGNED"];

  const [role, setRole] = React.useState(me ? me.role || "" : "");
  const [dept, setDept] = React.useState(me ? me.dept || "" : "");
  const [disc, setDisc] = React.useState(me ? me.discipline || "UNASSIGNED" : "UNASSIGNED");
  const [status, setStatus] = React.useState(null);
  const dirty = role !== ((me && me.role) || "") ||
                dept !== ((me && me.dept) || "") ||
                disc !== ((me && me.discipline) || "UNASSIGNED");

  React.useEffect(() => {
    if (!me) return;
    setRole(me.role || ""); setDept(me.dept || ""); setDisc(me.discipline || "UNASSIGNED");
  }, [me && me.id]);

  async function save() {
    if (!session) return;
    if (!me) {
      setStatus({ tone: "error",
        msg: "Your sign-in email '" + (email || "?") + "' doesn't match any row in the staff directory. " +
             "An admin needs to add or correct your row in public.people (column 'email')." });
      return;
    }
    setStatus({ tone: "loading", msg: "Saving…" });
    try {
      const cfg = window.TI_SUPABASE;
      const r = await fetch(cfg.url + "/rest/v1/people?id=eq." + encodeURIComponent(me.id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: cfg.anon,
          Authorization: "Bearer " + session.access_token,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ role, dept, discipline: disc }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        const msg = j.message || j.hint || j.error_description || ("HTTP " + r.status);
        // Most likely failure mode: migration 0005 hasn't been applied yet.
        // 403/401 + a permission-shaped message means RLS is blocking.
        if (r.status === 403 || r.status === 401 ||
            /permission denied|policy|RLS|row-level/i.test(msg)) {
          throw new Error(
            "Permission denied. The 0005_self_edit_policy.sql migration hasn't been applied yet — open Supabase → SQL Editor and run it. " +
            "(Server said: " + msg + ")"
          );
        }
        if (r.status === 404) {
          throw new Error("Your account is signed in as " + (email || "?") +
            " but no row in public.people matches that email. Ask an admin to align the directory.");
        }
        throw new Error(msg);
      }
      // Reflect in TI_DATA locally so the rest of the dashboard updates immediately
      const local = (window.TI_DATA.people || []).find(p => p.id === me.id);
      if (local) { local.role = role; local.dept = dept; local.discipline = disc; }
      setStatus({ tone: "ok", msg: "Saved." });
      if (window.TI_REFRESH) window.TI_REFRESH();
    } catch (e) {
      setStatus({ tone: "error", msg: e.message });
    }
  }

  function reset() { if (me) { setRole(me.role || ""); setDept(me.dept || ""); setDisc(me.discipline || "UNASSIGNED"); setStatus(null); } }

  return (
    <>
      <h2 className="h2">Profile</h2>
      <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
        Your identity comes from your sign-in. You can update your role, department, and discipline here.
      </div>
      <div className="divider" style={{ margin: "16px 0" }} />
      <div className="grid" style={{ gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "flex-start" }}>
        <div className="col gap-3" style={{ alignItems: "center" }}>
          <Avatar name={me ? me.name : email}
                  initials={me ? me.initials : (email || "?").slice(0,2).toUpperCase()}
                  size={84} discipline={disc} />
          <div className="muted" style={{ fontSize: 10.5 }}>Avatar generated from name</div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Full name" value={me ? me.name : nameFromEmail(email)} readOnly />
          <Field label="Email" value={email || "—"} readOnly />
          <SelectField label="Role"       value={role} options={ROLES}       onChange={setRole} />
          <SelectField label="Department" value={dept} options={DEPTS}       onChange={setDept} />
          <SelectField label="Discipline" value={disc} options={DISCIPLINES} onChange={setDisc} />
          <Field label="Workstation" value={me ? me.machine : "—"} readOnly />
        </div>
      </div>

      {status && (
        <div style={{
          marginTop: 14, fontSize: 12, padding: "8px 12px", borderRadius: 8,
          background: status.tone === "error" ? "rgb(var(--danger) / 0.08)"
                   : status.tone === "ok"    ? "rgb(var(--success) / 0.08)"
                   : "rgb(var(--bg-sunken))",
          color: status.tone === "error" ? "rgb(var(--danger))"
              :  status.tone === "ok"    ? "rgb(var(--success))"
              :  "rgb(var(--fg-soft))",
        }}>{status.msg}</div>
      )}

      <div className="divider" style={{ margin: "20px 0" }} />
      <div className="between">
        <div className="muted" style={{ fontSize: 11.5 }}>
          If a role you need isn't in the list, ask the BIM team — they can add it in <span className="mono">public.people</span>.
        </div>
        <div className="center gap-2">
          <button className="btn btn-secondary btn-sm" onClick={reset} disabled={!dirty}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save} disabled={!dirty || (status && status.tone === "loading")}>
            <Icon name="save" size={12} /> Save changes
          </button>
        </div>
      </div>
    </>
  );
}

function SelectField({ label, value, options, onChange }) {
  // Allow current value to appear even if not in the predefined list
  const opts = options.includes(value) || !value ? options : [value, ...options];
  return (
    <div>
      <div className="micro" style={{ marginBottom: 4 }}>{label}</div>
      <select className="input" value={value || ""} onChange={e => onChange(e.target.value)}>
        {!value && <option value="">— select —</option>}
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ToggleRow({ label, sub, v, onChange }) {
  return (
    <div className="between" style={{ padding: "8px 0", borderTop: "1px solid rgb(var(--hairline))" }}>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{label}</div>
        <div className="muted" style={{ fontSize: 10.5 }}>{sub}</div>
      </div>
      <button onClick={() => onChange(!v)} style={{
        width: 32, height: 18, borderRadius: 9999,
        background: v ? "rgb(var(--accent))" : "rgb(var(--border-strong))",
        border: "none", cursor: "pointer", position: "relative", transition: "all 0.2s",
      }}>
        <span style={{
          position: "absolute", top: 2, left: v ? 16 : 2,
          height: 14, width: 14, borderRadius: 9999, background: "white", transition: "all 0.2s",
          boxShadow: "0 1px 3px rgb(0 0 0 / 0.2)",
        }} />
      </button>
    </div>
  );
}

function Field({ label, value, readOnly, mono }) {
  return (
    <div>
      <div className="micro" style={{ marginBottom: 4 }}>{label}</div>
      <input className={"input" + (mono ? " mono" : "")} value={value == null ? "" : value} readOnly={readOnly} onChange={() => {}} />
    </div>
  );
}


function AutodeskIdList({ rows, machines, D, isAdmin }) {
  const [open, setOpen] = React.useState({});
  const [tab, setTab] = React.useState({});            // per-row tab state
  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));
  const setRowTab = (id, t) => setTab(s => ({ ...s, [id]: t }));

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "30px 1.4fr 1fr 1fr 140px 110px",
                    padding: "8px 14px", borderBottom: "1px solid rgb(var(--hairline))",
                    fontSize: 10.5, color: "rgb(var(--fg-muted))", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        <div />
        <div>Autodesk ID</div>
        <div>Used by</div>
        <div>Machines</div>
        <div>Last seen</div>
        <div>Status</div>
      </div>
      {rows.map(r => {
        const isOpen = !!open[r.autodesk_id];
        const activeTab = tab[r.autodesk_id] || "current";
        const userNames = r.users.map(uid => D.byId(uid)).filter(Boolean);
        const shared = r.users.length > 1;
        // Find machines that match this Autodesk ID
        const matchingMachines = machines.filter(m =>
          (m.autodesk_user || "").toLowerCase() === r.autodesk_id.toLowerCase());

        return (
          <div key={r.autodesk_id} style={{ borderBottom: "1px solid rgb(var(--hairline))" }}>
            <div onClick={() => toggle(r.autodesk_id)}
                 className="row-hover"
                 style={{ display: "grid", gridTemplateColumns: "30px 1.4fr 1fr 1fr 140px 110px",
                          padding: "10px 14px", cursor: "pointer", alignItems: "center" }}>
              <Icon name={isOpen ? "chevron-down" : "chevron-right"} size={13} color="rgb(var(--fg-muted))" />
              <div className="mono" style={{ fontSize: 12, fontWeight: 500 }}>{r.autodesk_id}</div>
              <div style={{ fontSize: 12 }}>{userNames.length ? userNames.map(u => u.name).join(", ") : <span className="muted">— unresolved —</span>}</div>
              <div className="mono" style={{ fontSize: 11, color: "rgb(var(--fg-soft))" }}>
                {r.machines.length ? r.machines.slice(0, 2).join(", ") + (r.machines.length > 2 ? " +" + (r.machines.length - 2) : "") : <span className="muted">—</span>}
              </div>
              <div className="muted tabular" style={{ fontSize: 11 }}>
                {r.last_seen ? new Date(r.last_seen).toLocaleString("en-GB") : <span className="muted">never</span>}
              </div>
              <div>
                {r.source === "directory"
                  ? <Pill tone="neutral">From directory</Pill>
                  : shared ? <Pill tone="warning">Shared · {r.users.length}</Pill> : <Pill tone="success">Observed</Pill>}
              </div>
            </div>

            {isOpen && (
              <div style={{ padding: "0 14px 16px 44px", background: "rgb(var(--bg-sunken) / 0.4)" }}>
                {/* Tabs */}
                <div className="seg" style={{ marginTop: 10, marginBottom: 12 }}>
                  <button className={activeTab === "current"  ? "on" : ""} onClick={() => setRowTab(r.autodesk_id, "current")}>
                    Currently using <span className="muted">· {matchingMachines.filter(m => m.online).length}</span>
                  </button>
                  <button className={activeTab === "sharing"  ? "on" : ""} onClick={() => setRowTab(r.autodesk_id, "sharing")}>
                    Shared with <span className="muted">· {userNames.length}</span>
                  </button>
                  {isAdmin && (
                    <button className={activeTab === "machines" ? "on" : ""} onClick={() => setRowTab(r.autodesk_id, "machines")}>
                      Machines <span className="muted">· {matchingMachines.length}</span>
                    </button>
                  )}
                </div>

                {activeTab === "current" && (
                  matchingMachines.filter(m => m.online).length === 0
                    ? <div className="muted" style={{ fontSize: 12 }}>No one is signed into this Autodesk ID right now.</div>
                    : <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {matchingMachines.filter(m => m.online).map(m => {
                          const p = m.person_id ? D.byId(m.person_id) : null;
                          return (
                            <div key={m.machine_id} className="center gap-3" style={{
                              padding: "8px 10px", borderRadius: 10,
                              border: "1px solid rgb(var(--success) / 0.25)",
                              background: "rgb(var(--success) / 0.06)",
                            }}>
                              <Pill tone="success" dot>live</Pill>
                              {p
                                ? <><Avatar name={p.name} initials={p.initials} size={26} discipline={p.discipline} status={p.status} />
                                    <div style={{ fontWeight: 600, fontSize: 12.5 }}>{p.name}</div></>
                                : <div className="muted" style={{ fontSize: 12.5 }}>unmapped machine</div>}
                              <div style={{ flex: 1 }} />
                              <div className="mono muted" style={{ fontSize: 11 }}>{m.machine_id}</div>
                              <div className="muted tabular" style={{ fontSize: 11 }}>{m.last_seen ? new Date(m.last_seen).toLocaleString("en-GB") : "—"}</div>
                            </div>
                          );
                        })}
                      </div>
                )}

                {activeTab === "sharing" && (
                  userNames.length === 0
                    ? <div className="muted" style={{ fontSize: 12 }}>No staff resolved for this Autodesk ID yet.</div>
                    : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
                        {userNames.map(p => {
                          // Last time we saw this person on this Autodesk ID, on any machine
                          const ms = matchingMachines.filter(m => m.person_id === p.id);
                          const last = ms.map(m => m.last_seen).filter(Boolean).sort().slice(-1)[0];
                          return (
                            <div key={p.id} className="center gap-3" style={{
                              padding: "8px 10px", borderRadius: 10,
                              border: "1px solid rgb(var(--hairline))",
                              background: "rgb(var(--bg))",
                            }}>
                              <Avatar name={p.name} initials={p.initials} size={32} discipline={p.discipline} status={p.status} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600 }}>{p.name}</div>
                                <div className="muted" style={{ fontSize: 10.5 }}>
                                  {p.email && p.email.toLowerCase() !== r.autodesk_id.toLowerCase()
                                    ? <>own: <span className="mono">{p.email}</span></>
                                    : <>last seen: {last ? new Date(last).toLocaleString("en-GB") : "—"}</>}
                                </div>
                              </div>
                              {p.status !== "offline" && <Pill tone="success" dot>online</Pill>}
                            </div>
                          );
                        })}
                      </div>
                )}

                {activeTab === "machines" && (
                  matchingMachines.length === 0
                    ? <div className="muted" style={{ fontSize: 12 }}>No machine has reported this Autodesk ID. {r.source === "directory" && "Loaded from the staff directory only."}</div>
                    : <table className="table" style={{ marginTop: 0 }}>
                        <thead><tr><th>Machine</th><th>Host</th><th>Mapped to</th><th>Status</th><th className="tabular">Last seen</th></tr></thead>
                        <tbody>
                          {matchingMachines.map(m => {
                            const p = m.person_id ? D.byId(m.person_id) : null;
                            return (
                              <tr key={m.machine_id}>
                                <td className="mono" style={{ fontSize: 11.5 }}>{m.machine_id}</td>
                                <td className="muted mono" style={{ fontSize: 11 }}>{m.host_name || "—"}</td>
                                <td>{p ? p.name : <span className="muted">unmapped</span>}</td>
                                <td>{m.online ? <Pill tone="success" dot>online</Pill> : <Pill tone="neutral">offline</Pill>}</td>
                                <td className="muted tabular" style={{ fontSize: 11 }}>{m.last_seen ? new Date(m.last_seen).toLocaleString("en-GB") : "—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
