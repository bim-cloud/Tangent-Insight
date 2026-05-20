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
  return (
    <PageShell>
      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <SmallSummary icon="trending-up" label="Productivity"  value="87%" tone="success" delta="+6.4%" />
        <SmallSummary icon="users"       label="Active users"  value="28"  tone="accent" />
        <SmallSummary icon="timer"       label="Focus avg"     value="6.4h" tone="muted" />
        <SmallSummary icon="alert-octagon" label="Risk score"  value="38"  tone="warning" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Productivity over time" subtitle="12-week rolling · all departments" icon="line-chart" />
          <MultiLine height={240}
            series={[
              { color: "rgb(var(--accent))",      values: [72,74,73,76,78,80,79,82,84,83,85,87] },
              { color: "rgb(var(--accent-2))",    values: [40,42,45,48,50,52,55,58,60,62,64,68] },
            ]}
            labels={["W-11","W-10","W-9","W-8","W-7","W-6","W-5","W-4","W-3","W-2","W-1","Now"]}
          />
          <div className="center gap-3 muted" style={{ fontSize: 11, marginTop: 6 }}>
            <span className="center gap-2"><span style={{ width: 14, height: 3, background: "rgb(var(--accent))", borderRadius: 2 }} /> Productivity %</span>
            <span className="center gap-2"><span style={{ width: 14, height: 3, background: "rgb(var(--accent-2))", borderRadius: 2 }} /> Focus hours index</span>
          </div>
        </div>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="By discipline" subtitle="Avg utilization · this week" icon="layers" />
          {[
            { l: "Modeler",     v: 86, c: "rgb(var(--modeler))" },
            { l: "Detailer",    v: 91, c: "rgb(var(--detailer))" },
            { l: "Coordinator", v: 78, c: "rgb(var(--coordinator))" },
            { l: "Manager",     v: 84, c: "rgb(var(--manager))" },
          ].map(r => (
            <div key={r.l} style={{ marginTop: 10 }}>
              <div className="between" style={{ fontSize: 11.5, marginBottom: 4 }}>
                <span>{r.l}</span>
                <span className="tabular" style={{ fontWeight: 600 }}>{r.v}%</span>
              </div>
              <div className="progress"><i style={{ width: r.v + "%", background: r.c }} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
        <CardTitle title="Activity intensity · 7 × 12" subtitle="Logged work intensity across the past week" icon="calendar" />
        <div style={{ overflow: "auto" }}>
          <Heatmap {...D.heatmap()} />
        </div>
      </div>
    </PageShell>
  );
};

/* ========== NOTIFICATIONS ========== */
window.NotificationsScreen = function NotificationsScreen() {
  const D = window.TI_DATA;
  const all = [
    ...D.notifications,
    { id: "n7", kind: "info",    title: "Marcus R. published Saadiyat NWC submission", time: "1d",  read: true },
    { id: "n8", kind: "success", title: "Weekly attendance report delivered",          time: "1d",  read: true },
    { id: "n9", kind: "warning", title: "TAIF12 · 3 new disjoined hosts after sync",   time: "2d",  read: true },
    { id: "n10",kind: "info",    title: "New user added: Diego Salinas (Modeler)",     time: "3d",  read: true },
  ];
  return (
    <PageShell maxWidth={920}>
      <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
        <div className="between" style={{ marginBottom: 14 }}>
          <CardTitle title="Notifications" subtitle="3 unread · all delivery channels" icon="bell" />
          <div className="center gap-2">
            <div className="seg">
              <button className="on">All</button>
              <button>Unread</button>
              <button>Mentions</button>
              <button>System</button>
            </div>
            <button className="btn btn-secondary btn-sm">Mark all read</button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {all.map(n => (
            <div key={n.id} className="row-hover" style={{
              padding: "11px 12px", borderRadius: 12,
              border: "1px solid rgb(var(--hairline))",
              borderLeft: `3px solid rgb(var(--${n.kind}))`,
              background: n.read ? "transparent" : "rgb(var(--accent) / 0.04)",
              display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
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
                  <Icon name="clock" size={10} /> {n.time} ago
                  <span>·</span>
                  <span style={{ textTransform: "capitalize" }}>{n.kind}</span>
                </div>
              </div>
              {!n.read && <span className="dot" style={{ background: "rgb(var(--accent))", marginTop: 8 }} />}
              <button className="btn btn-ghost btn-icon"><Icon name="more-horizontal" size={13} /></button>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

/* ========== ADMIN ========== */
window.AdminScreen = function AdminScreen() {
  const D = window.TI_DATA;
  const [machines, setMachines] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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
    .sort((a, b) => (a.source === b.source ? 0 : a.source === "agent" ? -1 : 1)
                    || b.users.length - a.users.length
                    || b.machines.length - a.machines.length);
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
            : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Autodesk ID (email)</th>
                    <th>Used by (humans)</th>
                    <th>Machines</th>
                    <th className="tabular">Last seen</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {idTable.map(r => {
                    const shared = r.users.length > 1;
                    return (
                      <tr key={r.autodesk_id}>
                        <td className="mono" style={{ fontSize: 12 }}>{r.autodesk_id}</td>
                        <td>
                          {r.users.length === 0
                            ? <span className="muted">— unresolved —</span>
                            : <div className="center gap-2" style={{ flexWrap: "wrap" }}>
                                {r.users.map(uid => {
                                  const p = D.byId(uid);
                                  return p
                                    ? <span key={uid} className="center gap-2" style={{ background: "rgb(var(--bg-sunken))", borderRadius: 999, padding: "2px 8px 2px 2px" }}>
                                        <Avatar name={p.name} initials={p.initials} size={20} discipline={p.discipline} status={p.status} />
                                        <span style={{ fontSize: 11.5 }}>{p.name}</span>
                                      </span>
                                    : <span key={uid} className="mono muted" style={{ fontSize: 11 }}>{uid}</span>;
                                })}
                              </div>}
                        </td>
                        <td className="mono" style={{ fontSize: 11 }}>{r.machines.length ? r.machines.slice(0, 3).join(", ") + (r.machines.length > 3 ? " +" + (r.machines.length - 3) : "") : <span className="muted">—</span>}</td>
                        <td className="muted tabular" style={{ fontSize: 11 }}>{r.last_seen ? new Date(r.last_seen).toLocaleString("en-GB") : <span className="muted">never</span>}</td>
                        <td>
                          {r.source === "directory"
                            ? <Pill tone="neutral">From directory</Pill>
                            : shared
                                ? <Pill tone="warning">Shared · {r.users.length}</Pill>
                                : <Pill tone="success">Observed</Pill>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
      </div>

      {/* Machine -> person mapping (the second table the user asked for) */}
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

      {/* Useful, actually-true admin info: directory health */}
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
              : <>
                  <h2 className="h2">Profile</h2>
                  <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>From your sign-in and directory record. Edits flow through your administrator.</div>
                  <div className="divider" style={{ margin: "16px 0" }} />
                  <div className="grid" style={{ gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "flex-start" }}>
                    <div className="col gap-3" style={{ alignItems: "center" }}>
                      <Avatar name={me ? me.name : email} initials={me ? me.initials : (email || "?").slice(0,2).toUpperCase()} size={84} discipline={me ? me.discipline : "MANAGER"} />
                      <div className="muted" style={{ fontSize: 10.5 }}>Avatar generated from name</div>
                    </div>
                    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <Field label="Full name" value={me ? me.name : "—"} readOnly />
                      <Field label="Email" value={email || "—"} readOnly />
                      <Field label="Role" value={me ? me.role : "—"} readOnly />
                      <Field label="Department" value={me ? me.dept : "—"} readOnly />
                      <Field label="Workstation" value={me ? me.machine : "—"} readOnly />
                      <Field label="Windows account" value={me ? (me.username || "—") : "—"} readOnly mono />
                    </div>
                  </div>
                  <div className="divider" style={{ margin: "20px 0" }} />
                  <div className="muted" style={{ fontSize: 11.5 }}>
                    Need a change? Profile data comes from <span className="mono">public.people</span> in Supabase — your administrator can update it.
                  </div>
                </>
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
      <input className={"input" + (mono ? " mono" : "")} defaultValue={value || ""} readOnly={readOnly} />
    </div>
  );
}
