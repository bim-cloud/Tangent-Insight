/* Tangent Insight — User Analytics
   Per-employee activity timeline, project breakdown, Revit-action counters,
   Teams integration, productivity score, idle/active tracking. */

window.UserAnalyticsScreen = function UserAnalyticsScreen({ activity }) {
  const D = window.TI_DATA;
  const [userId, setUserId] = React.useState(D.people[0].id);
  const [range, setRange] = React.useState("today");
  const u = D.byId(userId);

  // Synthetic per-user metrics
  const score = Math.round(u.utilization * 0.6 + (u.focusMin / 180) * 25 + (u.ot > 0 ? 8 : 4));
  const revitActions = {
    opens:    Math.floor(Math.random() * 4 + 2),
    saves:    Math.floor(u.focusMin / 18) + 2,
    syncs:    Math.floor(u.focusMin / 25) + 1,
    publishes:Math.floor(Math.random() * 2),
    exports:  Math.floor(Math.random() * 3),
    clashes:  Math.floor(Math.random() * 8),
    warnings: Math.floor(Math.random() * 12),
  };
  const totalActions = Object.values(revitActions).reduce((a, b) => a + b, 0);
  const projectsByHours = [
    { code: u.project,            hours: u.hours * 0.7,  color: "rgb(var(--accent))" },
    { code: "SAADIYAT07",         hours: u.hours * 0.18, color: "#A78BFA" },
    { code: "DXBHILLS03",         hours: u.hours * 0.08, color: "#10B981" },
    { code: "Internal",           hours: u.hours * 0.04, color: "#64748B" },
  ].filter(p => p.code !== "—" && p.hours > 0);

  return (
    <PageShell>
      {/* User picker bar */}
      <div className="surface-flat" style={{ padding: 10, display: "flex", alignItems: "center", gap: 10, borderRadius: 14, flexWrap: "wrap" }}>
        <div className="search-wrap" style={{ width: 280 }}>
          <Icon className="search-icon" name="search" size={14} />
          <input className="input" placeholder="Find employee…" />
        </div>
        <div className="vdiv" style={{ height: 22 }} />
        <span className="micro">Currently viewing</span>
        <select className="input" value={userId} onChange={e => setUserId(e.target.value)} style={{ width: 220, padding: "6px 10px", height: 30, fontSize: 12 }}>
          {D.people.map(p => <option key={p.id} value={p.id}>{p.name} · {p.role}</option>)}
        </select>
        <div className="seg">
          {["Today","Week","Month","Quarter"].map(r => (
            <button key={r} className={range === r.toLowerCase() ? "on" : ""} onClick={() => setRange(r.toLowerCase())}>{r}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-secondary btn-sm"><Icon name="message-square" size={12} /> Message</button>
        <button className="btn btn-secondary btn-sm"><Icon name="download" size={12} /> Export profile</button>
      </div>

      {/* Hero — identity + productivity score */}
      <div className="surface" style={{ padding: 18, borderRadius: 18, position: "relative", overflow: "hidden" }}>
        <div className="iso-wire" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "auto 1.6fr 1fr", gap: 24, alignItems: "center" }}>
          <div className="center gap-4">
            <Avatar name={u.name} initials={u.initials} size={72} discipline={u.discipline} status={u.status} />
            <div>
              <div className="center gap-2">
                <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>{u.name}</h1>
                <span className={`tag tag-${u.discipline.toLowerCase()}`}>{u.discipline}</span>
              </div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{u.role} · {u.dept} · <span className="mono">{u.machine}</span></div>
              <div className="center gap-2" style={{ marginTop: 8 }}>
                {u.status === "online"  && <Pill tone="success" dot>Online · since 08:05</Pill>}
                {u.status === "meeting" && <Pill tone="warning" dot>In Teams meeting</Pill>}
                {u.status === "idle"    && <Pill tone="warning">Idle · 35m</Pill>}
                {u.status === "offline" && <Pill tone="neutral">Offline · last seen 17:42</Pill>}
                <Pill tone="info" icon="hard-drive">Agent v2.0.0</Pill>
                <Pill tone="success" icon="shield-check">Verified</Pill>
              </div>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            <QuickStat icon="clock"    label="Hours today"  value={u.hours.toFixed(1) + "h"} delta={`+${u.ot.toFixed(1)}h OT`} />
            <QuickStat icon="focus"    label="Focus"         value={`${u.focusMin}m`} delta={`${Math.round((u.focusMin / (u.hours * 60 || 1)) * 100)}%`} tone="success" />
            <QuickStat icon="moon"     label="Idle"          value={`${u.idleMin}m`} tone={u.idleMin > 30 ? "warning" : "muted"} />
            <QuickStat icon="zap"      label="Revit actions" value={totalActions} delta={`${revitActions.syncs} syncs`} tone="accent" />
          </div>

          {/* Score ring */}
          <div className="center gap-4" style={{ justifyContent: "flex-end" }}>
            <div>
              <div className="micro" style={{ textAlign: "right" }}>Productivity score</div>
              <div className="tabular" style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: score > 80 ? "rgb(var(--success))" : score > 60 ? "rgb(var(--accent))" : "rgb(var(--warning))" }}>{score}</div>
              <div className="muted" style={{ fontSize: 11, textAlign: "right" }}>of 100 · Top 18% this week</div>
            </div>
            <Donut
              size={88} thickness={10}
              data={[
                { value: score, color: score > 80 ? "rgb(var(--success))" : score > 60 ? "rgb(var(--accent))" : "rgb(var(--warning))" },
                { value: 100 - score, color: "rgb(var(--bg-sunken))" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Day timeline: activity by hour */}
      <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
        <CardTitle
          title="Activity timeline · today"
          subtitle="Hour-by-hour breakdown · Revit · Meetings · Idle · Other"
          icon="activity"
          live
          right={<div className="seg"><button className="on">Stacked</button><button>Heatmap</button></div>}
        />
        <HourTimeline />
        <div className="center gap-4 muted" style={{ fontSize: 11, marginTop: 10, justifyContent: "center" }}>
          <LegendDot c="rgb(var(--accent))"   l="Revit focus" />
          <LegendDot c="rgb(var(--accent-2))" l="Teams / meetings" />
          <LegendDot c="rgb(var(--warning))"  l="Idle" />
          <LegendDot c="rgb(var(--success))"  l="Other apps" />
          <LegendDot c="rgb(var(--fg-faint))" l="Break / away" />
        </div>
      </div>

      {/* Row: project breakdown · revit actions · idle/active */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1.2fr 1fr" }}>
        {/* Project breakdown */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Time per project" subtitle={range + " · " + projectsByHours.length + " projects touched"} icon="folder-kanban" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
            {projectsByHours.map(p => (
              <div key={p.code}>
                <div className="between" style={{ marginBottom: 4 }}>
                  <span className="code-pill">{p.code}</span>
                  <span className="tabular muted" style={{ fontSize: 11 }}>{p.hours.toFixed(1)}h · {Math.round((p.hours / u.hours) * 100) || 0}%</span>
                </div>
                <div className="progress" style={{ height: 8 }}>
                  <i style={{ width: `${(p.hours / u.hours) * 100}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revit actions */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Revit actions · today" subtitle={`${totalActions} events captured by agent`} icon="box" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {[
              { k: "opens",     l: "Opens",     icon: "folder-open", c: "rgb(var(--info))" },
              { k: "saves",     l: "Saves",     icon: "save",        c: "rgb(var(--success))" },
              { k: "syncs",     l: "Syncs",     icon: "refresh-cw",  c: "rgb(var(--accent))" },
              { k: "publishes", l: "Publishes", icon: "upload-cloud",c: "rgb(var(--accent-2))" },
              { k: "exports",   l: "Exports",   icon: "file-output", c: "#A855F7" },
              { k: "clashes",   l: "Clashes",   icon: "zap",         c: "rgb(var(--danger))" },
              { k: "warnings",  l: "Warnings",  icon: "alert-triangle", c: "rgb(var(--warning))" },
              { k: "worksets",  l: "Worksets",  icon: "layers",      c: "rgb(var(--fg-muted))" },
            ].map(r => (
              <div key={r.k} className="surface-flat" style={{ padding: "9px 11px", borderRadius: 10 }}>
                <div className="center gap-2 muted" style={{ fontSize: 10.5 }}>
                  <Icon name={r.icon} size={11} color={r.c} /> {r.l}
                </div>
                <div className="tabular" style={{ fontSize: 18, fontWeight: 700, marginTop: 2, color: r.c }}>
                  {revitActions[r.k] ?? Math.floor(Math.random() * 6)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Idle vs Active */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Idle vs Active" subtitle="Detected by agent · 5-min idle threshold" icon="moon" />
          <div className="center" style={{ justifyContent: "center", padding: "4px 0 8px" }}>
            <Donut
              size={140} thickness={18}
              centerLabel={Math.round((u.focusMin / (u.focusMin + u.idleMin + 60)) * 100) + "%"}
              label="ACTIVE"
              data={[
                { value: u.focusMin,        color: "rgb(var(--accent))" },
                { value: 60,                color: "rgb(var(--accent-2))" },
                { value: u.idleMin,         color: "rgb(var(--warning))" },
                { value: 30,                color: "rgb(var(--fg-faint))" },
              ]}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <RowSplit label="Active in Revit" v={`${u.focusMin}m`} c="rgb(var(--accent))" />
            <RowSplit label="Active in Teams" v="60m" c="rgb(var(--accent-2))" />
            <RowSplit label="Idle (no input)" v={`${u.idleMin}m`} c="rgb(var(--warning))" />
            <RowSplit label="Break / away"   v="30m" c="rgb(var(--fg-faint))" />
          </div>
        </div>
      </div>

      {/* Action stream + Teams calls */}
      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title={`${u.name.split(" ")[0]}'s recent actions`} subtitle="All Revit, Teams, and system events captured by the local agent · validated server-side" icon="list-checks"
                     right={<button className="btn btn-ghost btn-sm">Export <Icon name="download" size={11} /></button>} />
          <table className="table">
            <thead>
              <tr><th>Time</th><th>Action</th><th>Project</th><th>Details</th><th>Duration</th></tr>
            </thead>
            <tbody>
              {[
                { t: "09:48", k: "sync",    p: u.project, d: "Sync to central · 47 elements · 3.2s", dur: "3s" },
                { t: "09:42", k: "save",    p: u.project, d: "Local save · plaza_furniture.rvt · 8.2 MB", dur: "1.4s" },
                { t: "09:31", k: "workset", p: u.project, d: "Borrowed workset 'Pavement L2'", dur: "—" },
                { t: "09:18", k: "open",    p: u.project, d: "Opened section view 'L2-3'", dur: "—" },
                { t: "09:02", k: "publish", p: u.project, d: "IFC 4 export · 482 MB · queued to BIM 360", dur: "12s" },
                { t: "08:54", k: "clash",   p: u.project, d: "Resolved 4 hard clashes · Hardscape × MEP", dur: "—" },
                { t: "08:38", k: "teams",   p: "Multi",   d: "Joined: BIM coordination weekly", dur: "42m" },
                { t: "08:21", k: "sync",    p: u.project, d: "Sync to central · 18 elements · 4.1s", dur: "4s" },
                { t: "08:12", k: "open",    p: u.project, d: "Opened central model", dur: "—" },
                { t: "08:05", k: "login",   p: "—",       d: `Login · ${u.machine} · Tangent Dubai HQ`, dur: "—" },
              ].map((e, i) => {
                const k = D.eventKinds[e.k] || D.eventKinds.open;
                return (
                  <tr key={i}>
                    <td className="mono tabular" style={{ fontSize: 11 }}>{e.t}</td>
                    <td>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "2px 7px", borderRadius: 9999,
                        background: k.color + "1A", color: k.color,
                        fontSize: 10.5, fontWeight: 600,
                      }}>
                        <Icon name={k.icon} size={10} /> {k.label}
                      </span>
                    </td>
                    <td>{e.p === "—" ? <span className="muted">—</span> : <span className="code-pill">{e.p}</span>}</td>
                    <td className="muted" style={{ fontSize: 11.5 }}>{e.d}</td>
                    <td className="tabular muted" style={{ fontSize: 11 }}>{e.dur}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Teams panel */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Teams collaboration" subtitle="Optional integration · linked via Microsoft Graph" icon="video" />
          <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            <Stat3 icon="phone"        label="Calls today" value="4" />
            <Stat3 icon="clock"        label="Total time"  value="2h 14m" />
            <Stat3 icon="users"        label="Distinct collaborators" value="7" />
          </div>
          <div className="micro" style={{ margin: "14px 0 8px" }}>Calls today</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { t: "10:30", title: "BIM coordination · NEOM01", dur: "42m", live: true, n: 8 },
              { t: "09:15", title: "Detailing standup",          dur: "18m", n: 6 },
              { t: "08:38", title: "BIM coordination weekly",    dur: "42m", n: 8 },
              { t: "Yesterday", title: "Client sync · Emaar",    dur: "55m", n: 4 },
            ].map((m, i) => (
              <div key={i} className="row-hover" style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgb(var(--hairline))", display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name={m.live ? "video" : "video-off"} size={13} color={m.live ? "rgb(var(--accent))" : "rgb(var(--fg-muted))"} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="truncate" style={{ fontSize: 12, fontWeight: 600 }}>{m.title}</div>
                  <div className="muted" style={{ fontSize: 10.5 }}>{m.t} · {m.n} attendees</div>
                </div>
                {m.live ? <Pill tone="success" dot>Live</Pill> : <span className="tabular muted" style={{ fontSize: 11 }}>{m.dur}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend: weekly score */}
      <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
        <CardTitle title="Productivity & utilization · 8 weeks" subtitle="Per-week rollup · score vs idle-time ratio" icon="trending-up"
                   right={<div className="center gap-3 muted" style={{ fontSize: 11 }}>
                     <span className="center gap-2"><span style={{ width: 14, height: 3, background: "rgb(var(--accent))", borderRadius: 2 }} /> Productivity score</span>
                     <span className="center gap-2"><span style={{ width: 14, height: 3, background: "rgb(var(--warning))", borderRadius: 2 }} /> Idle %</span>
                   </div>} />
        <MultiLine height={200}
          series={[
            { color: "rgb(var(--accent))",   values: [72,74,76,75,80,78,82, score] },
            { color: "rgb(var(--warning))",  values: [22,20,18,16,14,12,10, Math.round((u.idleMin/(u.hours*60||1))*100)] },
          ]}
          labels={["W-7","W-6","W-5","W-4","W-3","W-2","W-1","Now"]}
        />
      </div>
    </PageShell>
  );
};

/* helpers */
function QuickStat({ icon, label, value, delta, tone = "default" }) {
  const c = tone === "success" ? "rgb(var(--success))"
          : tone === "warning" ? "rgb(var(--warning))"
          : tone === "accent"  ? "rgb(var(--accent))"
          : tone === "muted"   ? "rgb(var(--fg-muted))"
          : "rgb(var(--fg))";
  return (
    <div className="surface-flat" style={{ padding: 10, borderRadius: 10 }}>
      <div className="center gap-2 muted" style={{ fontSize: 10 }}>
        <Icon name={icon} size={11} color={c} /> {label}
      </div>
      <div className="between" style={{ marginTop: 2 }}>
        <div className="tabular" style={{ fontSize: 18, fontWeight: 700, color: c, lineHeight: 1.1 }}>{value}</div>
        {delta && <span className="tabular muted" style={{ fontSize: 10.5 }}>{delta}</span>}
      </div>
    </div>
  );
}

function LegendDot({ c, l }) {
  return <span className="center gap-2"><span className="dot" style={{ background: c, height: 8, width: 8 }} />{l}</span>;
}

function RowSplit({ label, v, c }) {
  return (
    <div className="between" style={{ fontSize: 11.5 }}>
      <span className="center gap-2"><span className="dot" style={{ background: c }} />{label}</span>
      <span className="tabular muted">{v}</span>
    </div>
  );
}

function Stat3({ icon, label, value }) {
  return (
    <div className="surface-flat" style={{ padding: 10, borderRadius: 10 }}>
      <div className="center gap-2 muted" style={{ fontSize: 10 }}><Icon name={icon} size={11} /> {label}</div>
      <div className="tabular" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{value}</div>
    </div>
  );
}

/* Hour timeline (stacked horizontal bars per hour, 08–20) */
function HourTimeline() {
  const hours = ["08","09","10","11","12","13","14","15","16","17","18","19"];
  // Each hour: revit / teams / idle / other / break (minutes, max 60)
  const data = [
    [42, 0, 18, 0, 0],   // 08
    [54, 6, 0, 0, 0],    // 09
    [10, 42, 8, 0, 0],   // 10
    [48, 0, 6, 6, 0],    // 11
    [0, 0, 0, 0, 60],    // 12 (lunch)
    [38, 0, 4, 18, 0],   // 13
    [50, 0, 6, 4, 0],    // 14
    [42, 12, 6, 0, 0],   // 15
    [38, 0, 12, 10, 0],  // 16
    [22, 0, 10, 28, 0],  // 17
    [12, 0, 6, 0, 42],   // 18
    [0, 0, 0, 0, 60],    // 19
  ];
  const colors = ["rgb(var(--accent))","rgb(var(--accent-2))","rgb(var(--warning))","rgb(var(--success))","rgb(var(--fg-faint))"];
  const labels = ["Revit","Teams","Idle","Other","Break"];

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "grid", gridTemplateColumns: "40px repeat(12, 1fr)", gap: 4, alignItems: "center" }}>
        <div />
        {hours.map(h => <div key={h} className="muted tabular" style={{ fontSize: 10, textAlign: "center" }}>{h}:00</div>)}
        <div className="micro" style={{ textAlign: "right", paddingRight: 4 }}>MIN</div>
        {data.map((h, i) => (
          <React.Fragment key={i}>
            <div style={{ position: "relative", height: 38, background: "rgb(var(--bg-sunken))", borderRadius: 6, overflow: "hidden", display: "flex", flexDirection: "column-reverse" }}>
              {h.map((v, j) => (
                <div key={j} title={`${labels[j]} · ${v}m`} style={{
                  height: `${(v / 60) * 100}%`, background: colors[j],
                  width: "100%",
                }} />
              ))}
              {i === 11 && (
                <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, transparent 0 4px, rgb(var(--fg-faint) / 0.15) 4px 8px)" }} />
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="between" style={{ marginTop: 8, fontSize: 11 }}>
        <span className="muted">First activity: <span className="mono" style={{ fontWeight: 600, color: "rgb(var(--fg))" }}>08:05</span></span>
        <span className="muted">Last activity: <span className="mono" style={{ fontWeight: 600, color: "rgb(var(--fg))" }}>17:48 · live</span></span>
        <span className="muted">Total tracked: <span className="tabular" style={{ fontWeight: 600, color: "rgb(var(--fg))" }}>8h 42m</span></span>
        <span className="muted">Compliance: <Pill tone="success" dot>Within working hours policy</Pill></span>
      </div>
    </div>
  );
}
