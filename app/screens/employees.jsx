/* Tangent Insight — Employee Performance / Activity */

window.EmployeesScreen = function EmployeesScreen({ selectedEmployee, setSelectedEmployee, setRoute, activity }) {
  const D = window.TI_DATA;
  const [search, setSearch] = React.useState("");
  const [dept, setDept] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const depts = ["all", "BIM", "Landscape", "Architecture", "Detailing", "PM"];
  const filtered = D.people.filter(p => {
    if (dept !== "all" && p.dept !== dept) return false;
    if (statusFilter === "online" && p.status === "offline") return false;
    if (statusFilter === "offline" && p.status !== "offline") return false;
    if (statusFilter === "idle" && p.status !== "idle") return false;
    if (search && !(p.name + p.role + p.machine).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sel = selectedEmployee ? D.byId(selectedEmployee) : null;

  // Live KPIs
  const totalP   = D.people.length;
  const onlineP  = D.people.filter(p => p.status === "online").length;
  const idleP    = D.people.filter(p => p.status === "idle").length;
  const meetingP = D.people.filter(p => p.status === "meeting").length;
  const activeForAvg = D.people.filter(p => p.status !== "offline");
  const avgUtil  = activeForAvg.length ? Math.round(activeForAvg.reduce((a, p) => a + p.utilization, 0) / activeForAvg.length) : 0;
  const avgHours = activeForAvg.length ? (activeForAvg.reduce((a, p) => a + p.hours, 0) / activeForAvg.length).toFixed(1) : "0.0";
  const sumOt    = D.people.reduce((a, p) => a + p.ot, 0).toFixed(1);
  const deptCount = new Set(D.people.map(p => p.dept || "Unassigned")).size;

  return (
    <PageShell>
      {/* Summary tiles */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
        <SummTile icon="users"        label="Total" value={totalP} hint={`Across ${deptCount} depts`} />
        <SummTile icon="check-circle" label="Online"  value={onlineP} tone="success" hint={totalP ? Math.round(onlineP/totalP*100)+"% headcount" : ""} />
        <SummTile icon="moon"         label="Idle"    value={idleP} tone="warning" hint="> 15m idle" />
        <SummTile icon="video"        label="In call" value={meetingP} tone="info" hint="Teams" />
        <SummTile icon="timer"        label="Avg utilization" value={avgUtil + "%"} tone="accent" />
        <SummTile icon="clock"        label="Avg hours today" value={avgHours} tone="muted" hint={"+ " + sumOt + " OT"} />
      </div>

      {/* Filter bar */}
      <div className="surface-flat" style={{ padding: 10, display: "flex", alignItems: "center", gap: 10, borderRadius: 14, flexWrap: "wrap" }}>
        <div className="search-wrap" style={{ width: 280 }}>
          <Icon className="search-icon" name="search" size={14} />
          <input className="input" placeholder="Name, role, or machine ID…"
                 value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="seg">
          {depts.map(d => (
            <button key={d} className={dept === d ? "on" : ""} onClick={() => setDept(d)}>
              {d === "all" ? "All depts" : d}
            </button>
          ))}
        </div>
        <div className="vdiv" style={{ height: 22 }} />
        <div className="seg">
          <button className={statusFilter === "all" ? "on" : ""} onClick={() => setStatusFilter("all")}>All</button>
          <button className={statusFilter === "online" ? "on" : ""} onClick={() => setStatusFilter("online")}><LiveDot /> Online</button>
          <button className={statusFilter === "idle" ? "on" : ""} onClick={() => setStatusFilter("idle")}>Idle</button>
          <button className={statusFilter === "offline" ? "on" : ""} onClick={() => setStatusFilter("offline")}>Offline</button>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-secondary btn-sm"><Icon name="download" size={12} /> Export CSV</button>
      </div>

      {/* Split layout */}
      <div style={{ display: "grid", gridTemplateColumns: sel ? "1.4fr 1fr" : "1fr", gap: 14 }}>
        {/* Employee table */}
        <div className="surface" style={{ padding: 0, borderRadius: 18, overflow: "hidden" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Status</th>
                <th>Discipline</th>
                <th>Current project</th>
                <th>Focus</th>
                <th>Hours</th>
                <th>Overtime</th>
                <th>Utilization</th>
                <th>Trend</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="click" onClick={() => setSelectedEmployee(p.id)}
                    style={{ background: p.id === selectedEmployee ? "rgb(var(--accent) / 0.06)" : undefined }}>
                  <td>
                    <div className="center gap-3">
                      <Avatar name={p.name} initials={p.initials} size={32} discipline={p.discipline} status={p.status} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                        <div className="muted" style={{ fontSize: 10.5, marginTop: 1 }}>{p.role} · <span className="mono">{p.machine}</span></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {p.status === "online"  ? <span className="center gap-2"><LiveDot /><span style={{ fontSize: 11.5, color: "rgb(var(--success))" }}>Online</span></span> :
                     p.status === "meeting" ? <span className="center gap-2"><LiveDot tone="warn" /><span style={{ fontSize: 11.5, color: "rgb(var(--warning))" }}>In call</span></span> :
                     p.status === "idle"    ? <span className="center gap-2"><span className="dot dot-warning" /><span style={{ fontSize: 11.5, color: "rgb(var(--warning))" }}>Idle</span></span> :
                                              <span className="center gap-2"><span className="dot dot-muted" /><span className="muted" style={{ fontSize: 11.5 }}>Offline</span></span>}
                  </td>
                  <td><span className={`tag tag-${p.discipline.toLowerCase()}`}>{p.discipline[0] + p.discipline.slice(1).toLowerCase()}</span></td>
                  <td>
                    {p.project === "—" ? <span className="muted">—</span> :
                      <div className="center gap-2">
                        <span className="code-pill">{p.project}</span>
                        <span className="muted mono" style={{ fontSize: 10 }}>{p.version}</span>
                      </div>}
                  </td>
                  <td>
                    <div className="center gap-2">
                      <div className="progress" style={{ width: 60, height: 5 }}>
                        <i style={{ width: `${Math.min(100, (p.focusMin/180)*100)}%`, background: "rgb(var(--success))" }} />
                      </div>
                      <span className="tabular muted" style={{ fontSize: 11 }}>{p.focusMin}m</span>
                    </div>
                  </td>
                  <td className="tabular" style={{ fontWeight: 600 }}>{p.hours.toFixed(1)}h</td>
                  <td className="tabular" style={{ color: p.ot > 0.5 ? "rgb(var(--warning))" : "rgb(var(--fg-muted))" }}>{p.ot ? `+${p.ot.toFixed(1)}h` : "—"}</td>
                  <td>
                    <div className="center gap-2">
                      <Progress value={p.utilization} tone={p.utilization >= 90 ? "warning" : undefined} />
                      <span className="tabular" style={{ fontSize: 11, fontWeight: 600, minWidth: 28, textAlign: "right" }}>{p.utilization}%</span>
                    </div>
                  </td>
                  <td>
                    <Sparkline data={[60, 65, 62, 70, 68, 75, p.utilization]} width={60} height={18} color="rgb(var(--accent))" strokeWidth={1.4} />
                  </td>
                  <td><Icon name="chevron-right" size={14} color="rgb(var(--fg-faint))" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {sel && <EmployeeDetail emp={sel} onClose={() => setSelectedEmployee(null)} activity={activity} />}
      </div>
    </PageShell>
  );
};

function SummTile({ icon, label, value, tone, hint }) {
  const c = tone === "success" ? "rgb(var(--success))"
          : tone === "warning" ? "rgb(var(--warning))"
          : tone === "info"    ? "rgb(var(--info))"
          : tone === "accent"  ? "rgb(var(--accent))"
          : "rgb(var(--fg))";
  return (
    <div className="surface" style={{ padding: 14, borderRadius: 14 }}>
      <div className="center gap-3">
        <div style={{
          height: 32, width: 32, borderRadius: 9,
          background: c + "1A", color: c,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={icon} size={15} strokeWidth={2.1} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="micro">{label}</div>
          <div className="tabular" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em", color: c }}>{value}</div>
          {hint && <div className="muted truncate" style={{ fontSize: 10.5, marginTop: 2 }}>{hint}</div>}
        </div>
      </div>
    </div>
  );
}

function EmployeeDetail({ emp, onClose, activity }) {
  const D = window.TI_DATA;
  const userActivity = activity.filter(a => a.user === emp.id).slice(0, 10);

  // Real breakdown of tracked time today: focus + idle, plus a meetings estimate
  const meetingsMin = userActivity.filter(a => a.kind === "teams").length * 20; // ~20 min/event
  const focusMin = emp.focusMin || 0;
  const idleMin  = emp.idleMin  || 0;
  const otherMin = Math.max(0, Math.round(emp.hours * 60) - focusMin - idleMin - meetingsMin);

  return (
    <div className="surface" style={{ padding: 0, borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "85vh", position: "sticky", top: 92 }}>
      {/* Header */}
      <div style={{ padding: 14, borderBottom: "1px solid rgb(var(--hairline))" }}>
        <div className="between" style={{ alignItems: "flex-start" }}>
          <div className="center gap-3">
            <Avatar name={emp.name} initials={emp.initials} size={54} discipline={emp.discipline} status={emp.status} />
            <div>
              <h2 className="h2">{emp.name}</h2>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{emp.role} · {emp.dept}</div>
              <div className="center gap-2" style={{ marginTop: 6 }}>
                <span className={`tag tag-${emp.discipline.toLowerCase()}`}>{emp.discipline}</span>
                {emp.status === "online"  && <Pill tone="success" dot>Online</Pill>}
                {emp.status === "meeting" && <Pill tone="warning" dot>In meeting</Pill>}
                {emp.status === "idle"    && <Pill tone="warning">Idle {emp.idleMin}m</Pill>}
                {emp.status === "offline" && <Pill tone="neutral">Offline</Pill>}
              </div>
            </div>
          </div>
          <div className="center gap-2">
            <button className="btn btn-ghost btn-icon"><Icon name="message-square" size={14} /></button>
            <button className="btn btn-ghost btn-icon"><Icon name="download" size={14} /></button>
            <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={14} /></button>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(2,1fr)", gap: 6, marginTop: 12 }}>
          <FactRow icon="laptop" label="Workstation" value={emp.machine} />
          <FactRow icon="folder" label="Project" value={emp.project === "—" ? "—" : `${emp.project} · ${emp.version}`} />
          <FactRow icon="mail" label="Email" value={emp.email || "—"} mono />
          <FactRow icon="user" label="AD account" value={emp.username || "—"} mono />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Today's time breakdown (real) */}
        <div className="surface-flat" style={{ padding: 12, borderRadius: 12 }}>
          <div className="between" style={{ marginBottom: 10 }}>
            <span className="micro">Today's time breakdown</span>
            <span className="tabular muted" style={{ fontSize: 11 }}>{emp.hours.toFixed(1)}h logged</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "auto 1fr", gap: 14, alignItems: "center" }}>
            <Donut size={120} thickness={14}
                   centerLabel={`${emp.utilization}`} label="UTIL %"
                   data={[
                     { value: focusMin,    color: "rgb(var(--accent))" },
                     { value: meetingsMin, color: "rgb(var(--accent-2))" },
                     { value: idleMin,     color: "rgb(var(--warning))" },
                     { value: otherMin,    color: "rgb(var(--fg-faint))" },
                   ]} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { c: "rgb(var(--accent))",    l: "Revit focus", v: `${focusMin}m` },
                { c: "rgb(var(--accent-2))",  l: "Meetings",    v: `${meetingsMin}m` },
                { c: "rgb(var(--warning))",   l: "Idle",        v: `${idleMin}m` },
                { c: "rgb(var(--fg-faint))",  l: "Other apps",  v: `${otherMin}m` },
              ].map(r => (
                <div key={r.l} className="between" style={{ fontSize: 11.5 }}>
                  <span className="center gap-2"><span className="dot" style={{ background: r.c }} />{r.l}</span>
                  <span className="tabular muted">{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity (real) */}
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>Recent activity</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {userActivity.length
              ? userActivity.map(a => <window.FeedItem key={a.id} item={a} />)
              : <div className="muted" style={{ fontSize: 12, padding: 8 }}>No activity captured yet for this person.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function FactRow({ icon, label, value, mono }) {
  return (
    <div className="center gap-2" style={{ fontSize: 11.5, minWidth: 0 }}>
      <Icon name={icon} size={12} color="rgb(var(--fg-faint))" />
      <span className="muted" style={{ minWidth: 70 }}>{label}</span>
      <span className={mono ? "mono" : ""} style={{ fontWeight: 500, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
    </div>
  );
}

function WeekBars({ data, days }) {
  const max = Math.max(...data, 8);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
          <div className="tabular muted" style={{ fontSize: 10 }}>{v ? v.toFixed(1) : ""}</div>
          <div style={{
            width: "100%", height: `${(v / max) * 80}%`, minHeight: v ? 4 : 0,
            background: i === 4 ? "linear-gradient(180deg, rgb(var(--accent)), rgb(var(--accent-2)))" : "rgb(var(--accent) / 0.35)",
            borderRadius: 4,
          }} />
          <div className="micro" style={{ fontSize: 9.5 }}>{days[i]}</div>
        </div>
      ))}
    </div>
  );
}
