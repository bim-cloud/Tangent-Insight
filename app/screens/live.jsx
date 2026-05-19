/* Tangent Insight — Live Activity Center */

window.LiveScreen = function LiveScreen({ activity, setRoute }) {
  const D = window.TI_DATA;
  const [kindFilter, setKindFilter] = React.useState("all");
  const [paused, setPaused] = React.useState(false);
  const [projectFilter, setProjectFilter] = React.useState("all");

  const kinds = [
    { id: "all", label: "All events", icon: "list" },
    { id: "sync", label: "Syncs", icon: "refresh-cw" },
    { id: "save", label: "Saves", icon: "save" },
    { id: "open", label: "Opens", icon: "folder-open" },
    { id: "clash", label: "Clashes", icon: "zap" },
    { id: "warning", label: "Warnings", icon: "alert-triangle" },
    { id: "error", label: "Errors", icon: "alert-octagon" },
    { id: "teams", label: "Teams", icon: "video" },
  ];

  const filtered = activity.filter(a => {
    if (kindFilter !== "all" && a.kind !== kindFilter) return false;
    if (projectFilter !== "all" && a.project !== projectFilter) return false;
    return true;
  });

  // group by minute bucket
  const lastMin = Date.now();
  const rateData = Array.from({ length: 30 }).map((_, i) => {
    const inBucket = activity.filter(a => a.t >= i && a.t < i + 1).length;
    return inBucket + Math.sin(i * 0.7) + 1.5;
  }).reverse();

  // event-kind counts for sidebar
  const countByKind = {};
  activity.forEach(a => { countByKind[a.kind] = (countByKind[a.kind] || 0) + 1; });

  return (
    <PageShell>
      {/* Hero strip with waveform */}
      <div className="surface" style={{ padding: 16, borderRadius: 18, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 50% 80% at 80% 50%, rgb(var(--accent) / 0.08), transparent 60%)",
        }} />
        <div className="between" style={{ position: "relative", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div className="center gap-2 micro" style={{ color: "rgb(var(--success))" }}>
              <LiveDot /> LIVE FEED · streaming
            </div>
            <h1 className="h1" style={{ marginTop: 6 }}>
              <span className="tabular gradient-text"><Counter value={activity.length * 8} /></span> events <span className="muted" style={{ fontSize: 14, fontWeight: 500 }}>captured in the last hour</span>
            </h1>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Realtime Revit · Teams · System feed across 8 active projects and 16 workstations
            </div>
          </div>
          <div className="center gap-3">
            <Waveform bars={32} height={36} speed={2} active={!paused} />
            <button className="btn btn-secondary btn-sm" onClick={() => setPaused(p => !p)}>
              <Icon name={paused ? "play" : "pause"} size={12} /> {paused ? "Resume" : "Pause"}
            </button>
            <button className="btn btn-secondary btn-sm"><Icon name="download" size={12} /> Export</button>
          </div>
        </div>

        {/* Event-rate sparkbars */}
        <div style={{ position: "relative", marginTop: 18 }}>
          <div className="between" style={{ marginBottom: 6 }}>
            <span className="micro">Event rate · 30 min window</span>
            <span className="muted tabular" style={{ fontSize: 11 }}>peak 18/min · avg 11/min</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 56 }}>
            {rateData.map((v, i) => (
              <div key={i} style={{
                flex: 1, height: `${Math.min(100, (v / 4) * 100)}%`,
                background: i === rateData.length - 1 ? "rgb(var(--accent))" : "rgb(var(--accent) / 0.4)",
                borderRadius: 2, minHeight: 4,
                transition: "height 0.3s",
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Main: filter sidebar + feed + side widgets */}
      <div className="grid" style={{ gridTemplateColumns: "200px 1.5fr 1fr" }}>
        {/* Event-kind filter rail */}
        <div className="surface" style={{ padding: 10, borderRadius: 14 }}>
          <div className="micro" style={{ padding: "4px 8px 8px" }}>Filter by kind</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {kinds.map(k => {
              const active = kindFilter === k.id;
              const count = k.id === "all" ? activity.length : (countByKind[k.id] || 0);
              return (
                <button key={k.id} onClick={() => setKindFilter(k.id)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: 9, fontSize: 12.5,
                  background: active ? "rgb(var(--accent-soft))" : "transparent",
                  color: active ? "rgb(var(--accent))" : "rgb(var(--fg-soft))",
                  fontWeight: active ? 600 : 500,
                  border: "none", cursor: "pointer",
                }}>
                  <Icon name={k.icon} size={13} />
                  <span style={{ flex: 1, textAlign: "left" }}>{k.label}</span>
                  <span className="tabular" style={{ fontSize: 10.5, color: active ? "rgb(var(--accent))" : "rgb(var(--fg-faint))" }}>{count}</span>
                </button>
              );
            })}
          </div>
          <div className="divider" style={{ margin: "12px 0" }} />
          <div className="micro" style={{ padding: "0 8px 8px" }}>By project</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <button onClick={() => setProjectFilter("all")} style={filterBtnStyle(projectFilter === "all")}>
              <span>All projects</span>
              <span className="tabular faint" style={{ fontSize: 10 }}>{activity.length}</span>
            </button>
            {D.projects.slice(0, 6).map(p => {
              const count = activity.filter(a => a.project === p.code).length;
              const active = projectFilter === p.code;
              return (
                <button key={p.code} onClick={() => setProjectFilter(p.code)} style={filterBtnStyle(active)}>
                  <span className="center gap-2"><span className="dot" style={{ background: window.TI_DATA.stages[p.stage].color }} />{p.code}</span>
                  <span className="tabular faint" style={{ fontSize: 10 }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Activity feed */}
        <div className="surface" style={{ padding: 0, borderRadius: 18, display: "flex", flexDirection: "column", maxHeight: "78vh" }}>
          <div className="between" style={{ padding: "12px 14px", borderBottom: "1px solid rgb(var(--hairline))" }}>
            <CardTitle title="Activity stream" subtitle={`${filtered.length} events · auto-refresh ${paused ? "paused" : "every 5s"}`} icon="radio" live={!paused} />
            <div className="center gap-2">
              <button className="btn btn-ghost btn-icon"><Icon name="filter" size={13} /></button>
              <button className="btn btn-ghost btn-icon"><Icon name="more-horizontal" size={13} /></button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            {filtered.map((a, i) => <BigFeedItem key={a.id} item={a} fresh={i < 2 && !paused} />)}
          </div>
        </div>

        {/* Side widgets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Alerts */}
          <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 16 }}>
            <CardTitle title="Active alerts" subtitle="Requires attention" icon="alert-octagon" />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { tone: "danger", title: "Jeddah Corniche · 14m stale sync", time: "2m", project: "JEDDAH08" },
                { tone: "warning", title: "DXBHILLS03 · 24 new clashes", time: "11m", project: "DXBHILLS03" },
                { tone: "warning", title: "Hiroshi T. · idle 38m on DXBHILLS03", time: "32m", project: "DXBHILLS03" },
                { tone: "danger", title: "NEOM01 · linked model missing", time: "16m", project: "NEOM01" },
              ].map((a, i) => (
                <div key={i} className="row-hover" style={{
                  padding: "8px 10px", borderRadius: 10,
                  borderLeft: `2px solid rgb(var(--${a.tone}))`,
                  background: `rgb(var(--${a.tone}) / 0.04)`,
                  display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer",
                }}>
                  <Icon name={a.tone === "danger" ? "alert-octagon" : "alert-triangle"} size={14} color={`rgb(var(--${a.tone}))`} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{a.title}</div>
                    <div className="muted" style={{ fontSize: 10.5, marginTop: 1 }}><span className="mono">{a.project}</span> · {a.time} ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Currently active users */}
          <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 16 }}>
            <CardTitle title="Currently working" subtitle="By project" icon="users" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {D.projects.filter(p => p.activeUsers > 0).slice(0, 5).map(p => {
                const team = D.people.filter(u => u.project === p.code && u.status !== "offline");
                return (
                  <div key={p.code} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div className="between">
                      <div className="center gap-2">
                        <span className="code-pill">{p.code}</span>
                        <span className="muted" style={{ fontSize: 11 }}>{team.length} working</span>
                      </div>
                      <AvatarStack users={team.map(t => t.id)} size={18} max={5} />
                    </div>
                    <div className="progress" style={{ height: 3 }}>
                      <i style={{ width: `${(team.length / p.totalUsers) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event distribution */}
          <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 16 }}>
            <CardTitle title="Distribution · 1h" icon="pie-chart" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { l: "Syncs",    v: 64, c: "rgb(var(--accent))" },
                { l: "Saves",    v: 88, c: "rgb(var(--success))" },
                { l: "Opens",    v: 24, c: "rgb(var(--info))" },
                { l: "Clashes",  v: 12, c: "rgb(var(--danger))" },
                { l: "Warnings", v: 22, c: "rgb(var(--warning))" },
                { l: "Teams",    v: 18, c: "rgb(var(--accent-2))" },
              ].map(r => (
                <div key={r.l}>
                  <div className="between" style={{ fontSize: 11.5, marginBottom: 3 }}>
                    <span className="center gap-2"><span className="dot" style={{ background: r.c }} />{r.l}</span>
                    <span className="tabular muted">{r.v}</span>
                  </div>
                  <div className="progress" style={{ height: 4 }}>
                    <i style={{ width: `${(r.v / 100) * 100}%`, background: r.c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

function filterBtnStyle(active) {
  return {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 10, padding: "7px 10px", borderRadius: 8, fontSize: 11.5,
    background: active ? "rgb(var(--accent-soft))" : "transparent",
    color: active ? "rgb(var(--accent))" : "rgb(var(--fg-soft))",
    fontWeight: active ? 600 : 500,
    border: "none", cursor: "pointer",
  };
}

function BigFeedItem({ item, fresh }) {
  const D = window.TI_DATA;
  const k = D.eventKinds[item.kind];
  const user = item.user && item.user !== "—" ? D.byId(item.user) : null;
  return (
    <div className={`row-hover ${fresh ? "slide-in" : ""}`} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 12px", borderRadius: 12,
      border: "1px solid rgb(var(--hairline))",
      background: fresh ? "rgb(var(--accent) / 0.04)" : "rgb(var(--card))",
      borderLeft: `3px solid ${k.color}`,
    }}>
      <div style={{
        height: 32, width: 32, borderRadius: 9, flexShrink: 0,
        background: k.color + "1A", color: k.color,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={k.icon} size={15} strokeWidth={2.1} />
      </div>
      {user && <Avatar name={user.name} initials={user.initials} size={28} discipline={user.discipline} status={user.status} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="center gap-2" style={{ flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{user ? user.name : "System"}</span>
          <span className="pill pill-neutral" style={{ fontSize: 9.5 }}>{k.label}</span>
          {item.project !== "—" && <span className="code-pill">{item.project}</span>}
        </div>
        <div className="muted truncate" style={{ fontSize: 11.5, marginTop: 2 }}>{item.detail}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div className="mono tabular" style={{ fontSize: 11, fontWeight: 600 }}>{item.t < 1 ? "just now" : `${item.t}m ago`}</div>
        <div className="muted" style={{ fontSize: 10 }}>{user?.machine || "—"}</div>
      </div>
    </div>
  );
}
