/* Tangent Insight — Executive Dashboard */

window.DashboardScreen = function DashboardScreen({ activity, setRoute, setSelectedProject, setSelectedEmployee, kpis, dashLayout }) {
  const D = window.TI_DATA;
  const [wf, setWf] = React.useState("hours");

  // ---- everything below is computed from live data ----
  const people  = D.people || [];
  const total   = people.length;
  const online  = people.filter(p => p.status === "online").length;
  const meeting = people.filter(p => p.status === "meeting").length;
  const idle    = people.filter(p => p.status === "idle").length;
  const offline = people.filter(p => p.status === "offline").length;
  const liveRevit = people.filter(p => p.status !== "offline" &&
                      p.project && p.project !== "—" && p.project !== "Multi").length;

  const deptMap = {};
  people.forEach(p => {
    const d = p.dept || "Unassigned";
    deptMap[d] = deptMap[d] || { name: d, total: 0, online: 0, hours: 0, focus: 0 };
    deptMap[d].total++;
    if (p.status === "online" || p.status === "meeting") deptMap[d].online++;
    deptMap[d].hours += p.hours;
    deptMap[d].focus += p.focusMin / 60;
  });
  const depts = Object.keys(deptMap).map(k => deptMap[k])
                  .sort((a, b) => b.total - a.total).slice(0, 8);
  const barData = depts.map(d => wf === "hours"
    ? { name: d.name, a: Math.round(d.hours * 10) / 10, b: Math.round(d.focus * 10) / 10 }
    : { name: d.name, a: d.total, b: d.online });

  const sumF = people.reduce((a, p) => a + p.focusMin, 0);
  const sumI = people.reduce((a, p) => a + p.idleMin, 0);
  const denom = sumF + sumI;
  const focusPct = denom ? Math.round(sumF / denom * 100) : 0;
  const idlePct  = denom ? Math.round(sumI / denom * 100) : 0;
  const meetPct  = total ? Math.round(meeting / total * 100) : 0;
  const prodIndex = focusPct;

  const hm = D.heatmap ? D.heatmap() : { days: [], hours: [], data: [] };
  let peak = { v: -1, d: 0, h: 0 };
  (hm.data || []).forEach(c => { if (c.v > peak.v) peak = c; });
  const peakDay  = peak.v > 0 ? hm.days[peak.d] : "—";
  const peakHour = peak.v > 0 ? hm.hours[peak.h] + ":00" : "—";
  const events24 = (D.initialActivity || []).length;
  const unread   = (D.notifications || []).filter(n => !n.read).length;
  const subline  = online === 0
    ? "No agents reporting yet — staff appear here as they come online"
    : meeting + " in Teams · " + idle + " idle · " + D.projects.length + " active documents";

  return (
    <PageShell>
      {/* Greeting strip */}
      <div className="surface" style={{ padding: 16, position: "relative", overflow: "hidden", borderRadius: 18 }}>
        <div className="iso-wire" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />
        <div className="between" style={{ position: "relative", zIndex: 1, alignItems: "flex-start" }}>
          <div>
            <div className="center gap-2 muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.08, textTransform: "uppercase" }}>
              <Icon name="sun" size={12} /> Good morning · Tangent Dubai
            </div>
            <h1 className="h1" style={{ marginTop: 6 }}>
              <span className="gradient-text">{online} of {total}</span> people online · <span className="tabular">{liveRevit}</span> live Revit sessions
            </h1>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>
              {subline}
            </div>
          </div>
          <div className="center gap-2">
            <div className="seg">
              <button className="on">Today</button>
              <button>Week</button>
              <button>Month</button>
              <button>Quarter</button>
            </div>
            <button className="btn btn-secondary btn-sm"><Icon name="download" size={12} /> Export</button>
            <button className="btn btn-secondary btn-sm"><Icon name="sliders-horizontal" size={12} /> Customize</button>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid" style={{
        gridTemplateColumns: dashLayout === "wide" ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
      }}>
        {kpis.map(k => <KPICard key={k.key} k={k} />)}
      </div>

      {/* Row 1: Workforce + Project Health + Productivity */}
      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr 1.1fr" }}>
        {/* Workforce live */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle
            title="Workforce activity · live"
            subtitle={wf === "hours" ? "Work hours vs focus hours by department" : "Headcount vs online by department"}
            icon="activity"
            live
            right={<div className="seg">
              <button className={wf === "hours" ? "on" : ""} onClick={() => setWf("hours")}>Hours</button>
              <button className={wf === "headcount" ? "on" : ""} onClick={() => setWf("headcount")}>Headcount</button>
            </div>}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center" }}>
            <BarChart height={210} data={barData.length ? barData : [{ name: "—", a: 0, b: 0 }]} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 150 }}>
              <Stat icon="user-check" label="Online now"  value={online}  tone="success" />
              <Stat icon="user-x"     label="Offline"     value={offline} tone="muted"   />
              <Stat icon="moon"       label="Idle"        value={idle}    tone="warning" />
              <Stat icon="video"      label="In meetings" value={meeting} tone="info"    />
            </div>
          </div>
        </div>

        {/* Project status donut */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Team status" subtitle={"Live · " + total + " staff tracked"} icon="pie-chart" />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Donut
              size={160} thickness={22}
              centerLabel={String(total)} label="STAFF"
              data={[
                { value: online,  color: "rgb(var(--success))" },
                { value: meeting, color: "#A78BFA" },
                { value: idle,    color: "rgb(var(--warning))" },
                { value: offline, color: "#64748B" },
              ]}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { c: "rgb(var(--success))", l: "Online",     v: online },
                { c: "#A78BFA",             l: "In meeting", v: meeting },
                { c: "rgb(var(--warning))", l: "Idle",       v: idle },
                { c: "#64748B",             l: "Offline",    v: offline },
              ].map(r => (
                <div key={r.l} className="center gap-2" style={{ fontSize: 11.5 }}>
                  <span className="dot" style={{ background: r.c, height: 8, width: 8 }} />
                  <span style={{ flex: 1 }}>{r.l}</span>
                  <span className="tabular muted">{r.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="divider" style={{ margin: "14px 0 10px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            <MiniStat label="Active docs" value={D.projects.length} tone="success" />
            <MiniStat label="Online"      value={online} />
            <MiniStat label="Offline"     value={offline} tone="warning" />
          </div>
        </div>

        {/* Productivity Index */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Productivity index" subtitle="Focus share of tracked active time · live" icon="trending-up" />
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
            <div>
              <div className="tabular" style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
                <Counter value={prodIndex} format={n => Math.round(n)} />
                <span style={{ fontSize: 18, color: "rgb(var(--fg-muted))", marginLeft: 4 }}>%</span>
              </div>
              <div className="center gap-2" style={{ marginTop: 6 }}>
                <Pill tone="success" dot>live</Pill>
                <span className="muted" style={{ fontSize: 11 }}>focus ÷ (focus + idle)</span>
              </div>
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <div className="tabular" style={{ fontSize: 26, fontWeight: 700 }}>{online}</div>
              <div className="muted" style={{ fontSize: 11 }}>active now</div>
            </div>
          </div>
          <div className="divider" style={{ margin: "12px 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <ProdRow label="Focus time" value={focusPct} hint="of active time" />
            <ProdRow label="Idle"       value={idlePct}  hint="of active time" tone="warning" />
            <ProdRow label="Meetings"   value={meetPct}  hint="of staff"       tone="info" />
          </div>
        </div>
      </div>

      {/* Row 2: Heatmap + Live feed */}
      <div className="grid" style={{ gridTemplateColumns: "1.55fr 1fr" }}>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle
            title="Activity heatmap"
            subtitle="Logged work intensity · last 7 days × 12 hours"
            icon="calendar"
            right={<div className="center gap-2 muted" style={{ fontSize: 11 }}>
              Low <span style={{ display: "inline-flex", gap: 2 }}>
                {[0.1,0.3,0.5,0.7,0.95].map((a,i)=><span key={i} style={{ width: 12, height: 8, borderRadius: 2, background: `rgb(var(--accent) / ${a})` }} />)}
              </span> High
            </div>}
          />
          <div style={{ overflow: "auto", padding: 4 }}>
            <Heatmap {...D.heatmap()} />
          </div>
          <div className="divider" style={{ margin: "12px 0 10px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            <MiniStat label="Peak day"  value={peakDay} hint="busiest weekday" />
            <MiniStat label="Peak hour" value={peakHour} hint="busiest hour" />
            <MiniStat label="Events"    value={events24} hint="in feed window" />
            <MiniStat label="Active docs" value={D.projects.length} hint="being worked in" tone="success" />
          </div>
        </div>

        {/* Live feed */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18, display: "flex", flexDirection: "column" }}>
          <CardTitle title="Live activity stream" subtitle="Realtime · Revit · Teams · System" icon="radio" live
            right={<button className="btn btn-ghost btn-sm" onClick={() => setRoute("live")}>View all <Icon name="arrow-right" size={11} /></button>} />
          <div className="fade-top" style={{ flex: 1, maxHeight: 380, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, padding: "0 2px" }}>
            {activity.slice(0, 12).map((a, i) => <FeedItem key={a.id} item={a} fresh={i < 2} />)}
          </div>
        </div>
      </div>

      {/* Row 3: Project portfolio table */}
      <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
        <CardTitle
          title="Project portfolio"
          subtitle="Live status across all active Revit projects"
          icon="folder-kanban"
          right={
            <div className="center gap-2">
              <div className="seg"><button className="on">All</button><button>Critical</button><button>Active</button></div>
              <button className="btn btn-ghost btn-sm" onClick={() => setRoute("revit")}>Open monitor <Icon name="arrow-right" size={11} /></button>
            </div>
          }
        />
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>Code</th>
              <th>Project</th>
              <th>Stage</th>
              <th>Health</th>
              <th style={{ width: 120 }}>Active</th>
              <th style={{ width: 170 }}>Progress</th>
              <th style={{ width: 110 }}>Trend</th>
              <th style={{ width: 90 }} className="tabular">Clashes</th>
              <th style={{ width: 90 }} className="tabular">Warnings</th>
              <th style={{ width: 110 }}>Last sync</th>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {D.projects.map(p => (
              <tr key={p.code} className="click" onClick={() => { setSelectedProject(p.code); setRoute("revit"); }}>
                <td><span className="code-pill">{p.code}</span></td>
                <td>
                  <div className="center gap-3">
                    <WireframeMotif size={26} color={p.health === "CRITICAL" ? "rgb(var(--danger))" : p.health === "DELAY" ? "rgb(var(--warning))" : "rgb(var(--accent))"} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div className="muted" style={{ fontSize: 10.5, marginTop: 2 }}>{p.client} · {p.version} · {p.modelSize} MB</div>
                    </div>
                  </div>
                </td>
                <td><StagePill stage={p.stage} /></td>
                <td><HealthPill health={p.health} /></td>
                <td>
                  <div className="center gap-2">
                    <AvatarStack users={D.people.filter(u => u.project === p.code && u.status !== "offline").map(u => u.id)} size={20} max={3} />
                    <span className="muted tabular" style={{ fontSize: 11 }}>{p.activeUsers}/{p.totalUsers}</span>
                  </div>
                </td>
                <td>
                  <div className="center gap-2">
                    <Progress value={p.progress} />
                    <span className="tabular muted" style={{ fontSize: 11, minWidth: 28, textAlign: "right" }}>{p.progress}%</span>
                  </div>
                </td>
                <td>
                  <Sparkline data={p.sparkline} width={92} height={20} color={p.health === "CRITICAL" ? "rgb(var(--danger))" : "rgb(var(--accent))"} strokeWidth={1.4} />
                </td>
                <td className="tabular" style={{ color: p.clashes > 20 ? "rgb(var(--danger))" : p.clashes > 10 ? "rgb(var(--warning))" : "rgb(var(--fg))", fontWeight: 600 }}>{p.clashes}</td>
                <td className="tabular muted">{p.warnings}</td>
                <td className="muted" style={{ fontSize: 11.5 }}>
                  {p.lastSync.startsWith("stale") ? <Pill tone="danger">{p.lastSync}</Pill> : p.lastSync}
                </td>
                <td><Icon name="chevron-right" size={14} color="rgb(var(--fg-faint))" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Row 4: Notifications + Quick actions + Recent submissions */}
      <div className="grid" style={{ gridTemplateColumns: "1.05fr 1.4fr 1fr" }}>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Notifications" subtitle={"Last 24h · " + unread + " unread"} icon="bell" right={<button className="btn btn-ghost btn-sm">Mark all read</button>} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {D.notifications.slice(0, 5).map(n => (
              <div key={n.id} className="row-hover" style={{ padding: "8px 10px", borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <div style={{
                  height: 28, width: 28, borderRadius: 8, flexShrink: 0,
                  background: `rgb(var(--${n.kind}) / 0.12)`, color: `rgb(var(--${n.kind}))`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={n.kind === "danger" ? "alert-octagon" : n.kind === "warning" ? "alert-triangle" : n.kind === "success" ? "check-circle" : "info"} size={13} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: n.read ? 500 : 600 }}>{n.title}</div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{n.time} ago</div>
                </div>
                {!n.read && <span className="dot" style={{ background: "rgb(var(--accent))", marginTop: 6 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions / shortcuts */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Quick actions" subtitle="Jump to common workflows" icon="zap" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { icon: "box",            label: "Revit Monitor",      sub: D.projects.length + " active documents", route: "revit" },
              { icon: "users",          label: "Workforce",          sub: online + " online · " + total + " total", route: "employees" },
              { icon: "radio",          label: "Live stream",        sub: "Realtime events",     route: "live" },
              { icon: "video",          label: "Teams calls",        sub: meeting + " in meeting",  route: "teams" },
              { icon: "history",        label: "Activity history",   sub: "Searchable archive",  route: "history" },
              { icon: "file-bar-chart", label: "Reports",            sub: "Export & schedule",   route: "reports" },
            ].map(q => (
              <button key={q.label}
                      onClick={() => setRoute(q.route)}
                      className="surface-flat row-hover"
                      style={{
                        padding: 12, textAlign: "left", display: "flex", flexDirection: "column", gap: 8,
                        background: "transparent", cursor: "pointer", border: "1px solid rgb(var(--border))",
                        borderRadius: 12, transition: "all 0.2s ease",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgb(var(--accent) / 0.6)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgb(var(--border))"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{
                  height: 28, width: 28, borderRadius: 8,
                  background: "rgb(var(--accent) / 0.10)", color: "rgb(var(--accent))",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={q.icon} size={14} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{q.label}</div>
                  <div className="muted" style={{ fontSize: 10.5, marginTop: 1 }}>{q.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Top performers */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Top performers · this week" subtitle="By focus hours" icon="trophy"
                     right={<button className="btn btn-ghost btn-sm" onClick={() => setRoute("employees")}>View team</button>} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {D.people.filter(p => p.status !== "offline").sort((a,b)=>b.utilization-a.utilization).slice(0, 5).map((p, i) => (
              <div key={p.id} className="row-hover click" onClick={()=>{setSelectedEmployee(p.id); setRoute("employees");}} style={{ padding: "6px 8px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <div className="tabular" style={{ width: 16, fontSize: 11, fontWeight: 700, color: "rgb(var(--fg-muted))" }}>{i+1}</div>
                <Avatar name={p.name} initials={p.initials} size={28} discipline={p.discipline} status={p.status} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600 }}>{p.name}</div>
                  <div className="muted" style={{ fontSize: 10.5 }}>{p.role}</div>
                </div>
                <div style={{ minWidth: 70 }}>
                  <Progress value={p.utilization} />
                  <div className="tabular muted" style={{ fontSize: 10, marginTop: 2, textAlign: "right" }}>{p.utilization}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: Project progress trend (big) */}
      <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
        <CardTitle title="Project progress · last 12 weeks" subtitle="% complete across portfolio · critical projects highlighted" icon="line-chart"
                   right={
                     <div className="center gap-3">
                       {D.progressTrend.map(s => (
                         <div key={s.code} className="center gap-2" style={{ fontSize: 11 }}>
                           <span style={{ width: 10, height: 3, borderRadius: 2, background: s.color }} />
                           <span className="mono">{s.code}</span>
                         </div>
                       ))}
                     </div>
                   } />
        <MultiLine
          height={220}
          series={D.progressTrend}
          labels={["W-11","W-10","W-9","W-8","W-7","W-6","W-5","W-4","W-3","W-2","W-1","Now"]}
        />
      </div>
    </PageShell>
  );
};

function Stat({ icon, label, value, delta, tone }) {
  const c = tone === "success" ? "rgb(var(--success))"
          : tone === "warning" ? "rgb(var(--warning))"
          : tone === "danger"  ? "rgb(var(--danger))"
          : tone === "info"    ? "rgb(var(--info))"
          : "rgb(var(--fg-muted))";
  return (
    <div className="surface-flat" style={{ padding: "10px 12px", borderRadius: 12, display: "flex", flexDirection: "column", gap: 4 }}>
      <div className="center gap-2 muted" style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.08 }}>
        <Icon name={icon} size={12} color={c} /> {label}
      </div>
      <div className="between">
        <div className="tabular" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{value}</div>
        {delta !== undefined && <span className="tabular" style={{ fontSize: 11, color: c, fontWeight: 600 }}>{delta}</span>}
      </div>
    </div>
  );
}

function MiniStat({ label, value, hint, tone }) {
  const color = tone === "success" ? "rgb(var(--success))"
              : tone === "warning" ? "rgb(var(--warning))"
              : tone === "danger"  ? "rgb(var(--danger))"
              : "rgb(var(--fg))";
  return (
    <div>
      <div className="micro">{label}</div>
      <div className="tabular" style={{ fontSize: 18, fontWeight: 700, color, marginTop: 2, lineHeight: 1.1 }}>{value}</div>
      {hint && <div className="muted" style={{ fontSize: 10.5, marginTop: 2 }}>{hint}</div>}
    </div>
  );
}

function ProdRow({ label, value, hint, tone = "accent" }) {
  return (
    <div>
      <div className="between" style={{ marginBottom: 3 }}>
        <span style={{ fontSize: 11.5 }}>{label}</span>
        <span className="tabular muted" style={{ fontSize: 11 }}>{value}% <span className="faint">· {hint}</span></span>
      </div>
      <Progress value={value} tone={tone === "warning" ? "warning" : tone === "info" ? undefined : undefined} />
    </div>
  );
}

function FeedItem({ item, fresh }) {
  const D = window.TI_DATA;
  const k = D.eventKinds[item.kind];
  const user = item.user && item.user !== "—" ? D.byId(item.user) : null;
  return (
    <div className={`row-hover ${fresh ? "slide-in" : ""}`} style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "7px 8px", borderRadius: 10,
      borderLeft: `2px solid ${k.color}`,
      background: fresh ? "rgb(var(--accent) / 0.04)" : "transparent",
    }}>
      <div style={{
        height: 24, width: 24, borderRadius: 7, flexShrink: 0,
        background: k.color + "22", color: k.color,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={k.icon} size={12} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, lineHeight: 1.4 }}>
          <span style={{ fontWeight: 600 }}>{user ? user.name : "System"}</span>
          <span className="muted"> · </span>
          <span className="muted">{k.label.toLowerCase()}</span>
          {item.project !== "—" && <>
            <span className="muted"> on </span>
            <span className="mono" style={{ fontSize: 10.5, fontWeight: 600, color: "rgb(var(--fg))" }}>{item.project}</span>
          </>}
        </div>
        <div className="muted truncate" style={{ fontSize: 11, marginTop: 1 }}>{item.detail}</div>
      </div>
      <div className="muted tabular" style={{ fontSize: 10.5, whiteSpace: "nowrap" }}>{item.t < 1 ? "now" : `${item.t}m`}</div>
    </div>
  );
}

window.FeedItem = FeedItem;
