/* Tangent Insight — Reports & Export Center */

window.ReportsScreen = function ReportsScreen() {
  const D = window.TI_DATA;
  const [selectedReport, setSelectedReport] = React.useState("weekly-attendance");

  const reports = [
    { id: "weekly-attendance", title: "Weekly Attendance Report",        cat: "Attendance",   icon: "calendar-check", desc: "Sign-in/out, breaks, overtime by employee", lastRun: "2h ago", format: "XLSX", rows: 16 },
    { id: "monthly-utilization", title: "Monthly Utilization Summary",   cat: "Workforce",    icon: "users",          desc: "Hours allocated vs capacity by department",  lastRun: "Yesterday", format: "PDF", rows: 5 },
    { id: "overtime",           title: "Overtime & Productivity",        cat: "Workforce",    icon: "timer",          desc: "Per-employee OT with cost projection",       lastRun: "Today",   format: "XLSX", rows: 42 },
    { id: "project-health",     title: "Project Health Snapshot",        cat: "Projects",     icon: "folder-kanban",  desc: "Stage, progress, clashes, warnings",         lastRun: "Today",   format: "PDF", rows: 8 },
    { id: "revit-sessions",     title: "Revit Sessions Log",             cat: "BIM",          icon: "box",            desc: "Every open/sync/save event with duration",   lastRun: "12h ago", format: "CSV", rows: 8421 },
    { id: "clash-history",      title: "Clash Detection History",        cat: "BIM",          icon: "zap",            desc: "Resolved vs open clashes over time",         lastRun: "2 days",  format: "PDF", rows: 312 },
    { id: "teams-usage",        title: "Teams Collaboration Usage",      cat: "Teams",        icon: "video",          desc: "Meetings, calls, chat by team",              lastRun: "Today",   format: "XLSX", rows: 158 },
    { id: "audit",              title: "System Audit Log",               cat: "Admin",        icon: "shield-check",   desc: "Auth events, role changes, exports",         lastRun: "1h ago",  format: "CSV", rows: 5022 },
  ];

  const scheduled = [
    { title: "Daily attendance",       schedule: "Every day · 18:00", recipients: 4, format: "XLSX", active: true },
    { title: "Weekly project health",  schedule: "Mondays · 09:00",    recipients: 8, format: "PDF",  active: true },
    { title: "Monthly OT summary",     schedule: "1st of month",       recipients: 3, format: "XLSX", active: true },
    { title: "Critical-project alerts",schedule: "On trigger",         recipients: 12,format: "—",    active: true },
    { title: "Quarterly leadership",   schedule: "Quarterly",          recipients: 5, format: "PDF",  active: false },
  ];

  const sel = reports.find(r => r.id === selectedReport);

  return (
    <PageShell>
      {/* Hero / quick exports */}
      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="surface" style={{ padding: 18, borderRadius: 18, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", right: -40, top: -40, height: 240, width: 240, borderRadius: 9999,
            background: "var(--grad-cyan, linear-gradient(135deg,#22D3EE,#3B82F6))",
            opacity: 0.12, filter: "blur(40px)",
          }} />
          <div style={{ position: "relative" }}>
            <div className="micro" style={{ color: "rgb(var(--accent))" }}>EXPORT CENTER</div>
            <h1 className="h1" style={{ marginTop: 4 }}>One-click exports of every metric Tangent tracks</h1>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>
              Build custom reports · schedule weekly digests · or pull a quick snapshot below
            </div>
            <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 16 }}>
              {[
                { icon: "file-spreadsheet", label: "Excel · today",    color: "#10B981" },
                { icon: "file-text",        label: "PDF · today",      color: "#EF4444" },
                { icon: "file-code",        label: "JSON · API",       color: "#A855F7" },
                { icon: "file-archive",     label: "Full archive",     color: "rgb(var(--accent))" },
              ].map(q => (
                <button key={q.label} className="surface-flat row-hover" style={{
                  padding: 14, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8,
                  borderRadius: 12, cursor: "pointer", background: "rgb(var(--bg-elev))", border: "1px solid rgb(var(--border))", textAlign: "left",
                }}>
                  <div style={{
                    height: 32, width: 32, borderRadius: 9,
                    background: q.color + "1A", color: q.color,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={q.icon} size={15} strokeWidth={2} />
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{q.label}</div>
                  <div className="muted" style={{ fontSize: 10.5 }}>Generate now</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Recently generated" subtitle="Last 30 days" icon="clock" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { title: "NEOM01 · Clash Report v4",        by: "Layla H.",   when: "2h ago",   size: "2.4 MB", format: "PDF" },
              { title: "Attendance · Week 19",            by: "Auto",       when: "Yesterday", size: "84 KB", format: "XLSX" },
              { title: "Marcus R. · Time log April",      by: "Marcus R.",  when: "3 days",   size: "112 KB", format: "XLSX" },
              { title: "Tangent leadership QBR",          by: "Layla H.",   when: "1 week",   size: "5.8 MB", format: "PDF" },
              { title: "Saadiyat NWC submission",         by: "Marcus R.",  when: "1 week",   size: "42 MB",  format: "NWC" },
            ].map((r, i) => (
              <div key={i} className="row-hover" style={{ padding: "8px 10px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  height: 28, width: 28, borderRadius: 7,
                  background: r.format === "PDF" ? "rgb(239 68 68 / 0.12)" : r.format === "XLSX" ? "rgb(16 185 129 / 0.12)" : "rgb(99 102 241 / 0.12)",
                  color: r.format === "PDF" ? "rgb(var(--danger))" : r.format === "XLSX" ? "rgb(var(--success))" : "rgb(99 102 241)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9.5, fontWeight: 700,
                }}>
                  {r.format}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600 }}>{r.title}</div>
                  <div className="muted" style={{ fontSize: 10.5 }}>by {r.by} · {r.when} · {r.size}</div>
                </div>
                <button className="btn btn-ghost btn-icon"><Icon name="download" size={13} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report library + builder */}
      <div className="grid" style={{ gridTemplateColumns: "1.1fr 1.4fr" }}>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <div className="between" style={{ marginBottom: 12 }}>
            <CardTitle title="Report library" subtitle="8 saved templates · click to preview" icon="library" />
            <button className="btn btn-secondary btn-sm"><Icon name="plus" size={11} /> New report</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {reports.map(r => {
              const active = r.id === selectedReport;
              return (
                <button key={r.id} onClick={() => setSelectedReport(r.id)} style={{
                  textAlign: "left", padding: "10px 12px", borderRadius: 12,
                  background: active ? "rgb(var(--accent-soft))" : "transparent",
                  border: "1px solid " + (active ? "rgb(var(--accent) / 0.4)" : "rgb(var(--hairline))"),
                  display: "flex", alignItems: "center", gap: 11, cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                  <div style={{
                    height: 32, width: 32, borderRadius: 9,
                    background: active ? "rgb(var(--accent))" : "rgb(var(--bg-sunken))",
                    color: active ? "white" : "rgb(var(--fg-muted))",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={r.icon} size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="between">
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: active ? "rgb(var(--accent))" : "rgb(var(--fg))" }}>{r.title}</div>
                      <span className="pill pill-neutral" style={{ fontSize: 9 }}>{r.cat}</span>
                    </div>
                    <div className="muted truncate" style={{ fontSize: 11, marginTop: 2 }}>{r.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Builder / preview */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle
            title={sel.title}
            subtitle={`${sel.cat} · Last run ${sel.lastRun} · ${sel.rows.toLocaleString()} rows`}
            icon={sel.icon}
            right={<div className="center gap-2">
              <div className="seg">
                <button className="on">Preview</button>
                <button>Schedule</button>
                <button>History</button>
              </div>
            </div>}
          />

          {/* Param row */}
          <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
            <ParamField label="Date range" value="May 12 → May 19" icon="calendar" />
            <ParamField label="Department" value="All departments" icon="users" />
            <ParamField label="Projects" value="All active" icon="folder-kanban" />
            <ParamField label="Format" value={sel.format} icon="file-text" />
          </div>

          {/* Preview area */}
          <div className="surface-flat" style={{ padding: 0, borderRadius: 12, overflow: "hidden" }}>
            <div className="between" style={{ padding: "10px 14px", borderBottom: "1px solid rgb(var(--hairline))", background: "rgb(var(--bg-sunken) / 0.5)" }}>
              <div className="center gap-3">
                <Icon name="file-text" size={14} color="rgb(var(--accent))" />
                <span style={{ fontWeight: 600, fontSize: 12.5 }}>Preview · {sel.format}</span>
                <span className="muted" style={{ fontSize: 11 }}>Page 1 / 4</span>
              </div>
              <div className="center gap-2">
                <button className="btn btn-ghost btn-icon"><Icon name="zoom-out" size={12} /></button>
                <span className="muted tabular" style={{ fontSize: 11 }}>100%</span>
                <button className="btn btn-ghost btn-icon"><Icon name="zoom-in" size={12} /></button>
              </div>
            </div>
            {/* Sample preview content */}
            <div style={{ padding: 18, background: "white", color: "#0F172A", minHeight: 280, fontSize: 11 }}>
              <div className="between" style={{ marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 9.5, color: "#64748B", letterSpacing: 0.08, fontWeight: 600, textTransform: "uppercase" }}>Tangent Insight</div>
                  <div style={{ fontWeight: 700, fontSize: 18, marginTop: 2 }}>{sel.title}</div>
                  <div style={{ color: "#64748B", fontSize: 11, marginTop: 2 }}>Week 20 · May 12 – 19, 2026 · Tangent Dubai HQ</div>
                </div>
                <div style={{
                  height: 34, width: 34, borderRadius: 10,
                  background: "linear-gradient(135deg, #00AEEF, #6366F1)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name="building-2" size={16} color="white" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
                {(() => {
                  const totalH  = D.people.reduce((a,p)=>a+p.hours,0);
                  const totalOT = D.people.reduce((a,p)=>a+p.ot,0);
                  const active  = D.people.filter(p=>p.status!=="offline");
                  const avgUtil = active.length ? Math.round(active.reduce((a,p)=>a+p.utilization,0)/active.length) : 0;
                  const absent  = D.people.filter(p=>p.status==="offline").length;
                  return [
                    { l: "Total hours · today", v: totalH.toFixed(1) + "h" },
                    { l: "Avg utilization",     v: avgUtil + "%" },
                    { l: "Overtime · today",    v: totalOT.toFixed(1) + "h" },
                    { l: "Offline now",         v: absent },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: 10, border: "1px solid #E2E8F0", borderRadius: 8 }}>
                      <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.06, fontWeight: 600 }}>{s.l}</div>
                      <div style={{ fontWeight: 700, fontSize: 18, marginTop: 2 }}>{s.v}</div>
                    </div>
                  ));
                })()}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
                <thead>
                  <tr style={{ background: "#F1F5F9" }}>
                    {["Employee", "Dept", "Hours today", "OT", "Util %", "Status"].map(h => (
                      <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "#475569", fontWeight: 600, fontSize: 9.5, letterSpacing: 0.04, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {D.people.slice(0, 12).map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "6px 8px", fontWeight: 500 }}>{p.name}</td>
                      <td style={{ padding: "6px 8px", color: "#64748B" }}>{p.dept}</td>
                      <td style={{ padding: "6px 8px", fontVariantNumeric: "tabular-nums" }}>{p.hours.toFixed(1)}h</td>
                      <td style={{ padding: "6px 8px", fontVariantNumeric: "tabular-nums", color: p.ot > 0.5 ? "#F59E0B" : "#94A3B8" }}>{p.ot.toFixed(1)}h</td>
                      <td style={{ padding: "6px 8px", fontVariantNumeric: "tabular-nums" }}>{p.utilization}%</td>
                      <td style={{ padding: "6px 8px", color: p.status === "offline" ? "#94A3B8" : "#10B981" }}>{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="between" style={{ marginTop: 14 }}>
            <div className="center gap-2 muted" style={{ fontSize: 11.5 }}>
              <Icon name="info" size={12} /> Report includes {D.people.length} employees · {D.people.reduce((a,p)=>a+p.hours,0).toFixed(1)}h today
            </div>
            <div className="center gap-2">
              <button className="btn btn-secondary btn-sm"><Icon name="send" size={12} /> Email</button>
              <button className="btn btn-secondary btn-sm"><Icon name="calendar-plus" size={12} /> Schedule</button>
              <button className="btn btn-primary btn-sm"><Icon name="download" size={12} /> Generate {sel.format}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled jobs */}
      <div className="surface" style={{ padding: 0, borderRadius: 18, overflow: "hidden" }}>
        <div className="between" style={{ padding: "12px 16px", borderBottom: "1px solid rgb(var(--hairline))" }}>
          <CardTitle title="Scheduled reports" subtitle="5 automated jobs · 4 active" icon="calendar-clock" />
          <button className="btn btn-secondary btn-sm"><Icon name="plus" size={11} /> Schedule new</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>Report</th><th>Schedule</th><th>Recipients</th><th>Format</th><th>Last run</th><th>Next run</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {scheduled.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}><div className="center gap-2"><Icon name="file-bar-chart" size={13} color="rgb(var(--accent))" /> {s.title}</div></td>
                <td className="muted">{s.schedule}</td>
                <td><AvatarStack users={D.people.slice(0, s.recipients).map(p => p.id)} size={18} max={4} /></td>
                <td><span className="pill pill-neutral">{s.format}</span></td>
                <td className="muted">{["2h ago","Mon","May 1","2m ago","Mar 31"][i]}</td>
                <td className="muted">{["Today 18:00","Mon 09:00","Jun 1","On trigger","Jul 1"][i]}</td>
                <td>{s.active ? <Pill tone="success" dot>Active</Pill> : <Pill tone="neutral">Paused</Pill>}</td>
                <td><button className="btn btn-ghost btn-icon"><Icon name="more-horizontal" size={13} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
};

function ParamField({ label, value, icon }) {
  return (
    <div className="surface-flat" style={{ padding: "8px 10px", borderRadius: 10 }}>
      <div className="micro" style={{ fontSize: 9.5 }}>{label}</div>
      <div className="center gap-2" style={{ marginTop: 2 }}>
        <Icon name={icon} size={11} color="rgb(var(--accent))" />
        <span style={{ fontSize: 12, fontWeight: 600 }}>{value}</span>
        <Icon name="chevron-down" size={11} color="rgb(var(--fg-faint))" />
      </div>
    </div>
  );
}
