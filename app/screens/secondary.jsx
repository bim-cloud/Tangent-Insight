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
  const roles = [
    { name: "Administrator",    users: 2,  perms: ["Full system access", "Manage roles", "Export data", "API tokens"], tone: "danger" },
    { name: "BIM Manager",      users: 3,  perms: ["View all projects", "Manage employees", "Export reports"], tone: "accent" },
    { name: "Project Manager",  users: 4,  perms: ["View assigned projects", "Approve submissions"], tone: "info" },
    { name: "BIM Coordinator",  users: 5,  perms: ["Monitor projects", "Run reports"], tone: "warning" },
    { name: "Modeler/Detailer", users: 27, perms: ["Self-view only", "Submit timesheets"], tone: "muted" },
  ];
  return (
    <PageShell>
      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <SmallSummary icon="shield"     label="Roles defined" value="5" tone="accent" />
        <SmallSummary icon="users"      label="Total users"   value="41" />
        <SmallSummary icon="key"        label="API tokens"    value="6" tone="warning" />
        <SmallSummary icon="shield-check" label="MFA enabled" value="100%" tone="success" />
      </div>

      {/* Autodesk ID Monitor — admin-only */}
      <AutodeskIdMonitor />

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <div className="between" style={{ marginBottom: 12 }}>
            <CardTitle title="Roles & permissions" subtitle="Role-based access control" icon="shield" />
            <button className="btn btn-secondary btn-sm"><Icon name="plus" size={11} /> New role</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {roles.map(r => (
              <div key={r.name} className="row-hover" style={{ padding: 12, borderRadius: 12, border: "1px solid rgb(var(--hairline))" }}>
                <div className="between" style={{ marginBottom: 6 }}>
                  <div className="center gap-2">
                    <Pill tone={r.tone}>{r.name}</Pill>
                    <span className="muted" style={{ fontSize: 11 }}>{r.users} users</span>
                  </div>
                  <div className="center gap-1">
                    <button className="btn btn-ghost btn-icon"><Icon name="pencil" size={12} /></button>
                    <button className="btn btn-ghost btn-icon"><Icon name="more-horizontal" size={12} /></button>
                  </div>
                </div>
                <div className="center gap-2" style={{ flexWrap: "wrap" }}>
                  {r.perms.map(p => (
                    <span key={p} className="pill pill-neutral" style={{ fontSize: 10 }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <div className="between" style={{ marginBottom: 12 }}>
            <CardTitle title="Recent admin actions" subtitle="Last 24h · audit log" icon="scroll-text" />
            <button className="btn btn-ghost btn-sm">View all</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { user: D.byId("u01"), action: "granted BIM Manager role to",    target: "Olesya Petrova",  time: "2h ago", kind: "shield" },
              { user: D.byId("u01"), action: "exported",                       target: "Weekly Attendance · XLSX", time: "3h ago", kind: "download" },
              { user: D.byId("u10"), action: "revoked API token",              target: "ci-integration-04", time: "5h ago", kind: "key" },
              { user: D.byId("u01"), action: "updated retention policy to",    target: "180 days", time: "Yesterday", kind: "settings-2" },
              { user: D.byId("u01"), action: "added integration",              target: "BIM 360 · Tangent DXB", time: "2 days", kind: "plug-zap" },
              { user: D.byId("u10"), action: "deactivated user",               target: "Anonymous (machine TLA-021)", time: "3 days", kind: "user-x" },
            ].map((a, i) => (
              <div key={i} className="row-hover" style={{ padding: "8px 10px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name={a.kind} size={14} color="rgb(var(--fg-muted))" />
                <Avatar name={a.user.name} initials={a.user.initials} size={20} discipline={a.user.discipline} status="online" />
                <div style={{ flex: 1, minWidth: 0, fontSize: 12 }}>
                  <span style={{ fontWeight: 600 }}>{a.user.name}</span>
                  <span className="muted"> {a.action} </span>
                  <span style={{ fontWeight: 500 }}>{a.target}</span>
                </div>
                <span className="muted tabular" style={{ fontSize: 10.5 }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Integrations" icon="plug-zap" />
          {[
            { name: "Microsoft Teams",    state: "Connected", tone: "success", time: "OAuth · 30d" },
            { name: "Autodesk BIM 360",   state: "Connected", tone: "success", time: "API key" },
            { name: "Outlook calendars",  state: "Connected", tone: "success", time: "OAuth" },
            { name: "Power BI export",    state: "Available", tone: "neutral", time: "—" },
            { name: "Slack",              state: "Disabled",  tone: "neutral", time: "—" },
          ].map(i => (
            <div key={i.name} className="between" style={{ padding: "8px 0", borderTop: "1px solid rgb(var(--hairline))" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{i.name}</div>
                <div className="muted" style={{ fontSize: 10.5 }}>{i.time}</div>
              </div>
              <Pill tone={i.tone} dot={i.tone === "success"}>{i.state}</Pill>
            </div>
          ))}
        </div>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Security" icon="shield-check" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <ToggleRow label="Multi-factor auth" sub="Required for all admins" on={true} />
            <ToggleRow label="Single sign-on (Azure AD)" sub="Tangent.ae tenant" on={true} />
            <ToggleRow label="IP allowlist" sub="2 ranges defined" on={true} />
            <ToggleRow label="Session timeout" sub="30 min idle" on={true} />
            <ToggleRow label="API access logs" sub="90-day retention" on={true} />
          </div>
        </div>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Data retention" icon="database" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <RetentionRow label="Activity events" days="180" current={68} />
            <RetentionRow label="Teams metadata" days="365" current={24} />
            <RetentionRow label="Exported reports" days="730" current={12} />
            <RetentionRow label="Audit logs" days="2555" current={4} note="7 years · regulatory" />
          </div>
        </div>
      </div>
    </PageShell>
  );
};

function ToggleRow({ label, sub, on }) {
  const [v, setV] = React.useState(on);
  return (
    <div className="between">
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{label}</div>
        <div className="muted" style={{ fontSize: 10.5 }}>{sub}</div>
      </div>
      <button onClick={() => setV(!v)} style={{
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

function RetentionRow({ label, days, current, note }) {
  return (
    <div>
      <div className="between" style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
        <div className="tabular muted" style={{ fontSize: 11 }}>{days} days</div>
      </div>
      <div className="progress" style={{ height: 4 }}>
        <i style={{ width: `${current}%` }} />
      </div>
      <div className="muted" style={{ fontSize: 10.5, marginTop: 3 }}>{note || `Currently storing ${current}% of cap`}</div>
    </div>
  );
}

/* ========== SETTINGS ========== */
window.SettingsScreen = function SettingsScreen() {
  return (
    <PageShell maxWidth={1100}>
      <div className="grid" style={{ gridTemplateColumns: "220px 1fr" }}>
        <div className="surface" style={{ padding: 10, borderRadius: 14 }}>
          {[
            { icon: "user",        l: "Profile",         active: true },
            { icon: "bell",        l: "Notifications" },
            { icon: "palette",     l: "Appearance" },
            { icon: "globe",       l: "Region & language" },
            { icon: "shield",      l: "Security" },
            { icon: "key",         l: "API tokens" },
            { icon: "users",       l: "Team" },
            { icon: "plug-zap",    l: "Integrations" },
            { icon: "credit-card", l: "Billing" },
          ].map((s, i) => (
            <button key={i} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 9, fontSize: 12.5,
              background: s.active ? "rgb(var(--accent-soft))" : "transparent",
              color: s.active ? "rgb(var(--accent))" : "rgb(var(--fg-soft))",
              fontWeight: s.active ? 600 : 500,
              border: "none", cursor: "pointer",
              textAlign: "left",
            }}>
              <Icon name={s.icon} size={14} /> {s.l}
            </button>
          ))}
        </div>

        <div className="surface" style={{ padding: 18, borderRadius: 18 }}>
          <h2 className="h2">Profile</h2>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Your personal details, visible across Tangent Insight</div>
          <div className="divider" style={{ margin: "16px 0" }} />
          <div className="grid" style={{ gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "flex-start" }}>
            <div className="col gap-3" style={{ alignItems: "center" }}>
              <Avatar name="Layla Haddad" initials="LH" size={84} discipline="MANAGER" />
              <button className="btn btn-secondary btn-sm"><Icon name="upload" size={11} /> Upload</button>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Full name" value="Layla Haddad" />
              <Field label="Email" value="layla.haddad@tangent.ae" />
              <Field label="Role" value="BIM Manager" />
              <Field label="Department" value="BIM" />
              <Field label="Office" value="Dubai · HQ" />
              <Field label="Started" value="March 2022" />
            </div>
          </div>
          <div className="divider" style={{ margin: "20px 0" }} />
          <div className="between">
            <div className="muted" style={{ fontSize: 11.5 }}>Last saved · 2 minutes ago</div>
            <div className="center gap-2">
              <button className="btn btn-secondary btn-sm">Cancel</button>
              <button className="btn btn-primary btn-sm">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

function Field({ label, value }) {
  return (
    <div>
      <div className="micro" style={{ marginBottom: 4 }}>{label}</div>
      <input className="input" defaultValue={value} />
    </div>
  );
}

/* ========== AUTODESK ID MONITOR (Admin) ==========
   Mirrors the original WPF tool: tracks each user's expected vs actual
   Autodesk login, flags shared-license usage, and surfaces audit issues.
   Credentials themselves are NEVER displayed in plaintext — admins can
   request a one-time reveal which is logged. */
function AutodeskIdMonitor() {
  const D = window.TI_DATA;
  const [reveal, setReveal] = React.useState({});
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");

  // Build synthetic ID-monitor rows from people
  const rows = D.people.map((p, i) => {
    const expected = `${p.initials.toLowerCase()}@tangent.ae`;
    // Simulate scenarios
    const variant = i % 8;
    let actual = expected, status = "OK", note = "Verified · matches expected ID";
    if (variant === 2) {
      actual = "shared.bim@tangent.ae";
      status = "SHARED";
      note = "License also active on TLA-DXB-007 (Hiroshi T.)";
    } else if (variant === 5) {
      actual = `${p.initials.toLowerCase()}@gmail.com`;
      status = "MISMATCH";
      note = "Personal account detected · policy violation";
    } else if (variant === 4) {
      actual = "—";
      status = "OFFLINE";
      note = "Not signed in to Autodesk · last seen 2h ago";
    } else if (variant === 7) {
      status = "STALE";
      note = "Token expired · refresh needed";
    }
    const machineCount = status === "SHARED" ? 2 : 1;
    const lastVerified = ["1m ago", "12m ago", "32m ago", "1h ago", "3h ago", "Yesterday"][i % 6];
    return { ...p, expected, actual, status, note, machineCount, lastVerified };
  });

  const counts = {
    ok: rows.filter(r => r.status === "OK").length,
    shared: rows.filter(r => r.status === "SHARED").length,
    mismatch: rows.filter(r => r.status === "MISMATCH").length,
    stale: rows.filter(r => r.status === "STALE").length,
    offline: rows.filter(r => r.status === "OFFLINE").length,
  };

  const filtered = rows.filter(r => {
    if (filter !== "all" && r.status !== filter.toUpperCase()) return false;
    if (search && !(r.name + r.expected + r.actual + r.machine).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusPill = (s) => {
    const map = {
      OK:       { tone: "success", label: "Verified" },
      SHARED:   { tone: "danger",  label: "Shared license" },
      MISMATCH: { tone: "danger",  label: "ID mismatch" },
      STALE:    { tone: "warning", label: "Stale token" },
      OFFLINE:  { tone: "neutral", label: "Signed out" },
    }[s] || { tone: "neutral", label: s };
    return <Pill tone={map.tone} dot={s !== "OFFLINE"}>{map.label}</Pill>;
  };

  return (
    <div className="surface" style={{ padding: 0, borderRadius: 18, overflow: "hidden" }}>
      <div className="between" style={{ padding: "14px 16px", borderBottom: "1px solid rgb(var(--hairline))" }}>
        <div className="center gap-3">
          <div style={{
            height: 36, width: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #00AEEF, #6366F1)",
            color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 16px -4px rgb(0 174 239 / 0.4)",
          }}>
            <Icon name="key-round" size={17} />
          </div>
          <div>
            <div className="center gap-2">
              <h2 className="h2">Autodesk ID Monitor</h2>
              <Pill tone="danger" icon="lock">Admin only</Pill>
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
              Expected vs actual sign-in across all monitored workstations · auto-detects shared licenses & personal accounts
            </div>
          </div>
        </div>
        <div className="center gap-2">
          <Pill tone="success" icon="shield-check">Encrypted at rest</Pill>
          <button className="btn btn-secondary btn-sm"><Icon name="refresh-cw" size={12} /> Re-verify all</button>
          <button className="btn btn-secondary btn-sm"><Icon name="download" size={12} /> Audit CSV</button>
        </div>
      </div>

      {/* Status strip */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgb(var(--hairline))", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        <IdStat label="Verified"        value={counts.ok}       tone="success" />
        <IdStat label="Shared license"  value={counts.shared}   tone="danger" />
        <IdStat label="ID mismatch"     value={counts.mismatch} tone="danger" />
        <IdStat label="Stale token"     value={counts.stale}    tone="warning" />
        <IdStat label="Signed out"      value={counts.offline}  tone="muted" />
      </div>

      {/* Compliance banner */}
      {(counts.shared > 0 || counts.mismatch > 0) && (
        <div style={{
          padding: "10px 16px",
          background: "rgb(var(--danger) / 0.06)",
          borderBottom: "1px solid rgb(var(--danger) / 0.18)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Icon name="alert-octagon" size={15} color="rgb(var(--danger))" />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "rgb(var(--danger))" }}>
            {counts.shared + counts.mismatch} compliance issue{counts.shared + counts.mismatch > 1 ? "s" : ""} detected
          </span>
          <span className="muted" style={{ fontSize: 11.5 }}>
            Shared Autodesk seats and non-Tangent email accounts will be reported to BIM management
          </span>
          <div style={{ flex: 1 }} />
          <button className="btn btn-danger btn-sm" style={{ background: "rgb(var(--danger))", color: "white" }}>
            Investigate
          </button>
        </div>
      )}

      {/* Filter bar */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid rgb(var(--hairline))", display: "flex", alignItems: "center", gap: 10 }}>
        <div className="search-wrap" style={{ width: 260 }}>
          <Icon className="search-icon" name="search" size={14} />
          <input className="input" placeholder="Name, email, machine…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="seg">
          {[
            { id: "all",      l: "All",        c: rows.length },
            { id: "ok",       l: "Verified",   c: counts.ok },
            { id: "shared",   l: "Shared",     c: counts.shared },
            { id: "mismatch", l: "Mismatch",   c: counts.mismatch },
            { id: "stale",    l: "Stale",      c: counts.stale },
            { id: "offline",  l: "Signed out", c: counts.offline },
          ].map(o => (
            <button key={o.id} className={filter === o.id ? "on" : ""} onClick={() => setFilter(o.id)}>
              {o.l} <span className="muted">· {o.c}</span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost btn-sm"><Icon name="info" size={12} /> Why we track this</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Expected Autodesk ID</th>
            <th>Actual signed-in ID</th>
            <th>Credential</th>
            <th>Machine(s)</th>
            <th>Status</th>
            <th>Last verified</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td>
                <div className="center gap-3">
                  <Avatar name={r.name} initials={r.initials} size={26} discipline={r.discipline} status={r.status} />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{r.name}</div>
                    <div className="muted" style={{ fontSize: 10.5 }}>{r.role}</div>
                  </div>
                </div>
              </td>
              <td className="mono" style={{ fontSize: 11.5 }}>{r.expected}</td>
              <td className="mono" style={{ fontSize: 11.5, color: r.status === "MISMATCH" || r.status === "SHARED" ? "rgb(var(--danger))" : r.status === "OFFLINE" ? "rgb(var(--fg-faint))" : "rgb(var(--fg))", fontWeight: r.status === "MISMATCH" ? 700 : 500 }}>
                {r.actual}
              </td>
              <td>
                <div className="center gap-2">
                  <span className="mono" style={{
                    fontSize: 11.5, letterSpacing: reveal[r.id] ? "0.04em" : "0.18em",
                    color: "rgb(var(--fg-soft))",
                  }}>
                    {reveal[r.id] ? "Aut0d3sk·" + r.initials + "·2026" : "••••••••••••"}
                  </span>
                  <button className="btn btn-ghost btn-icon" title="Request one-time reveal · logged"
                          onClick={() => setReveal(prev => ({ ...prev, [r.id]: !prev[r.id] }))}>
                    <Icon name={reveal[r.id] ? "eye-off" : "eye"} size={12} />
                  </button>
                </div>
              </td>
              <td>
                <div className="center gap-2">
                  <span className="mono" style={{ fontSize: 11 }}>{r.machine}</span>
                  {r.machineCount > 1 && <Pill tone="danger">+{r.machineCount - 1}</Pill>}
                </div>
              </td>
              <td>{statusPill(r.status)}</td>
              <td className="muted" style={{ fontSize: 11 }}>{r.lastVerified}</td>
              <td><button className="btn btn-ghost btn-icon"><Icon name="more-horizontal" size={13} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ padding: "10px 16px", borderTop: "1px solid rgb(var(--hairline))", display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="info" size={12} color="rgb(var(--fg-faint))" />
        <span className="muted" style={{ fontSize: 11 }}>
          Credentials are end-to-end encrypted with Azure Key Vault · every reveal is recorded in the audit log · agent v2.0.0 verifies sign-in via <span className="mono">loginstate.json</span> every 60s
        </span>
      </div>
    </div>
  );
}

function IdStat({ label, value, tone }) {
  const c = tone === "success" ? "rgb(var(--success))"
          : tone === "warning" ? "rgb(var(--warning))"
          : tone === "danger"  ? "rgb(var(--danger))"
          : "rgb(var(--fg-muted))";
  return (
    <div className="surface-flat" style={{ padding: "8px 10px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ height: 28, width: 28, borderRadius: 8, background: c + "1A", color: c, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={tone === "success" ? "check" : tone === "danger" ? "alert-octagon" : tone === "warning" ? "alert-triangle" : "user-x"} size={13} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="micro" style={{ fontSize: 9.5 }}>{label}</div>
        <div className="tabular" style={{ fontSize: 16, fontWeight: 700, color: c, lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );
}
