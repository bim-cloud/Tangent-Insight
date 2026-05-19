/* Tangent Insight — App shell (sidebar + topbar) */

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { id: "dashboard",  icon: "layout-dashboard", label: "Executive Dashboard" },
      { id: "live",       icon: "radio",            label: "Live Activity",    count: "LIVE" },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { id: "revit",      icon: "box",              label: "Revit Monitor",    count: 8 },
      { id: "employees",  icon: "users",            label: "Employees",        count: 16 },
      { id: "teams",      icon: "video",            label: "Teams Activity",   count: 2 },
      { id: "attendance", icon: "calendar-check",   label: "Attendance" },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "useranalytics", icon: "user-search",   label: "User Analytics" },
      { id: "history",    icon: "history",          label: "Historical Data" },
      { id: "reports",    icon: "file-bar-chart",   label: "Reports & Export" },
      { id: "analytics",  icon: "bar-chart-3",      label: "Analytics" },
    ],
  },
  {
    label: "System",
    items: [
      { id: "notifications", icon: "bell",          label: "Notifications",    count: 3 },
      { id: "admin",      icon: "shield",           label: "Admin & Roles" },
      { id: "settings",   icon: "settings",         label: "Settings" },
    ],
  },
];

window.Sidebar = function Sidebar({ route, setRoute, user, sidebarMode }) {
  const compact = sidebarMode === "icon";
  return (
    <aside className="surface" style={{
      position: "fixed", left: 16, top: 16, bottom: 16,
      width: compact ? 64 : 232,
      padding: compact ? "14px 8px" : "16px 14px",
      display: "flex", flexDirection: "column", zIndex: 40,
      transition: "width 0.25s cubic-bezier(0.2,0.8,0.2,1)",
      overflow: "hidden",
    }}>
      {/* Brand */}
      <div style={{ padding: compact ? "4px 0" : "6px 4px 10px", marginBottom: 14, display: "flex", justifyContent: compact ? "center" : "flex-start" }}>
        {compact ? (
          <window.TangentLogo variant="mark" height={36} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <window.TangentLogo variant="wordmark" height={32} />
            <div style={{ paddingLeft: 4, display: "flex", alignItems: "center", gap: 7 }}>
              <span className="micro" style={{ fontSize: 9, letterSpacing: 0.12, fontWeight: 700, color: "rgb(var(--fg-muted))" }}>INSIGHT</span>
              <span style={{ height: 4, width: 4, borderRadius: 9999, background: "rgb(var(--accent))" }} />
              <span className="muted" style={{ fontSize: 10, fontWeight: 500 }}>BIM Intelligence</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", marginRight: -6, paddingRight: 6 }} className="no-scrollbar">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.label} style={{ marginBottom: gi === NAV_GROUPS.length - 1 ? 0 : 14 }}>
            {!compact && (
              <div className="nav-section micro" style={{ padding: "0 6px 6px", fontSize: 9.5, fontWeight: 700, letterSpacing: 0.1 }}>
                {g.label}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {g.items.map(item => {
                const active = route === item.id;
                return (
                  <a
                    key={item.id}
                    onClick={() => setRoute(item.id)}
                    className={`nav-item ${active ? "active" : ""}`}
                    title={compact ? item.label : ""}
                    style={{ padding: compact ? "9px 0" : "8px 10px" }}
                  >
                    <Icon name={item.icon} size={17} strokeWidth={active ? 2.1 : 1.8} />
                    {!compact && <span className="nav-label" style={{ flex: 1 }}>{item.label}</span>}
                    {!compact && item.count !== undefined && (
                      <span className="count">{item.count}</span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User block */}
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgb(var(--hairline))" }}>
        <div className="center gap-3" style={{ padding: compact ? 0 : "6px 4px", justifyContent: compact ? "center" : "flex-start" }}>
          <Avatar name={user.name} initials={user.initials} size={32} discipline={user.discipline} status="online" />
          {!compact && (
            <div className="sidebar-foot-detail" style={{ minWidth: 0, flex: 1 }}>
              <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600 }}>{user.name}</div>
              <div className="truncate muted" style={{ fontSize: 11 }}>{user.role}</div>
            </div>
          )}
          {!compact && (
            <button className="btn btn-ghost btn-icon" title="Sign out">
              <Icon name="log-out" size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

window.Topbar = function Topbar({ title, subtitle, theme, setTheme, onSearch, search, route, breadcrumbs, openNotifications }) {
  const [tick, setTick] = React.useState(Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="surface-flat" style={{
      padding: "10px 16px",
      borderRadius: 16,
      display: "flex", alignItems: "center", gap: 14,
      marginBottom: 16,
      position: "sticky", top: 16, zIndex: 30,
      backdropFilter: "blur(8px)",
      background: "rgb(var(--card) / 0.85)",
    }}>
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flexShrink: 0 }}>
        {breadcrumbs && (
          <div className="center gap-2 muted" style={{ fontSize: 10.5, marginBottom: 1, whiteSpace: "nowrap", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-sans)" }}>
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Icon name="chevron-right" size={9} />}
                <span style={{ color: i === breadcrumbs.length - 1 ? "rgb(var(--accent))" : "rgb(var(--fg-muted))" }}>{b}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.05, fontFamily: "var(--font-display)", whiteSpace: "nowrap" }}>{title}</h1>
        {subtitle && <div className="muted" style={{ fontSize: 11.5, marginTop: 2, whiteSpace: "nowrap" }}>{subtitle}</div>}
      </div>

      <div style={{ flex: 1 }} />

      {/* Global search */}
      <div className="search-wrap" style={{ width: 320, maxWidth: "32vw" }}>
        <Icon className="search-icon" name="search" size={14} />
        <input className="input" placeholder="Search projects, employees, activity…"
               value={search || ""} onChange={e => onSearch && onSearch(e.target.value)} />
        <span className="kbd" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>⌘K</span>
      </div>

      {/* Live clock */}
      <div className="center gap-2" style={{ padding: "6px 11px", borderRadius: 10, background: "rgb(var(--bg-sunken))", border: "1px solid rgb(var(--border))", fontSize: 12 }}>
        <LiveDot />
        <span className="mono tabular" style={{ color: "rgb(var(--fg-soft))", letterSpacing: 0.04 }}>{fmtTime(tick)}</span>
        <span className="muted" style={{ fontSize: 10.5 }}>GST</span>
      </div>

      {/* Agent health */}
      <AgentHealthChip />

      {/* Theme toggle */}
      <button className="btn btn-ghost btn-icon" title="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{ height: 34, width: 34 }}>
        <Icon name={theme === "dark" ? "sun" : "moon"} size={15} />
      </button>

      {/* Notifications */}
      <button className="btn btn-ghost btn-icon" title="Notifications"
              onClick={openNotifications}
              style={{ height: 34, width: 34, position: "relative" }}>
        <Icon name="bell" size={15} />
        <span className="notif-dot" />
      </button>

      <div className="vdiv" style={{ height: 22 }} />

      <button className="btn btn-primary btn-sm">
        <Icon name="plus" size={13} strokeWidth={2.3} /> New report
      </button>
    </div>
  );
};

window.PageShell = function PageShell({ children, maxWidth = 1640 }) {
  return (
    <div style={{
      maxWidth, marginLeft: "auto", marginRight: "auto",
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      {children}
    </div>
  );
};

Object.assign(window, { Sidebar: window.Sidebar, Topbar: window.Topbar, PageShell: window.PageShell });

/* Agent health — live chip with hover panel */
function AgentHealthChip() {
  const [open, setOpen] = React.useState(false);
  const [pulse, setPulse] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setPulse(p => p + 1), 1800);
    return () => clearInterval(id);
  }, []);

  // Synthetic agent telemetry — would come from the server in production
  const agents = {
    total: 16,
    healthy: 14,
    degraded: 1,
    offline: 1,
    avgCpu: 1.4,
    avgMem: 84,
    eventsPerMin: 11.2,
    queueLag: "0.8s",
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          height: 34, padding: "0 11px",
          background: "rgb(var(--success) / 0.10)",
          border: "1px solid rgb(var(--success) / 0.28)",
          borderRadius: 10, cursor: "pointer",
          color: "rgb(var(--success))",
          fontSize: 11.5, fontWeight: 600,
          fontFamily: "inherit",
        }}
        title="Agent fleet health"
      >
        <span style={{ position: "relative", height: 8, width: 8 }}>
          <span style={{
            position: "absolute", inset: 0, borderRadius: 9999,
            background: "rgb(var(--success))",
          }} />
          <span style={{
            position: "absolute", inset: -2, borderRadius: 9999,
            background: "rgb(var(--success) / 0.3)",
            animation: "live-pulse 2s ease-out infinite",
          }} />
        </span>
        <span>{agents.healthy}/{agents.total} agents</span>
        <Icon name="chevron-down" size={11} />
      </button>

      {open && (
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="surface"
          style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0,
            width: 300, padding: 14, borderRadius: 14, zIndex: 100,
          }}
        >
          <div className="between" style={{ marginBottom: 10 }}>
            <div>
              <div className="micro" style={{ color: "rgb(var(--success))" }}>AGENT FLEET</div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Tangent Insight Agent v2.0.0</div>
            </div>
            <Pill tone="success" dot>Healthy</Pill>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <FleetStat label="Healthy"   v={agents.healthy} c="rgb(var(--success))" />
            <FleetStat label="Degraded"  v={agents.degraded} c="rgb(var(--warning))" />
            <FleetStat label="Offline"   v={agents.offline}  c="rgb(var(--danger))" />
            <FleetStat label="Total"     v={agents.total}    c="rgb(var(--fg))" />
          </div>
          <div className="divider" style={{ margin: "10px 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <FleetLine label="Avg CPU overhead"  v={agents.avgCpu + "%"}    hint="≤ 2% target" />
            <FleetLine label="Avg memory"         v={agents.avgMem + " MB"} hint="resident set size" />
            <FleetLine label="Events / min"       v={agents.eventsPerMin}    hint="last 5 min" />
            <FleetLine label="Queue lag"          v={agents.queueLag}        hint="batch every 5s" />
          </div>
          <div className="divider" style={{ margin: "10px 0" }} />
          <div className="muted" style={{ fontSize: 10.5, lineHeight: 1.5 }}>
            <Icon name="lock" size={10} /> TLS 1.3 to cloud · events signed per machine · offline buffer persists 7 days · resumes on reconnect
          </div>
        </div>
      )}
    </div>
  );
}

function FleetStat({ label, v, c }) {
  return (
    <div className="surface-flat" style={{ padding: "7px 9px", borderRadius: 8 }}>
      <div className="micro" style={{ fontSize: 9.5 }}>{label}</div>
      <div className="tabular" style={{ fontSize: 15, fontWeight: 700, color: c, lineHeight: 1.1 }}>{v}</div>
    </div>
  );
}

function FleetLine({ label, v, hint }) {
  return (
    <div className="between" style={{ fontSize: 11 }}>
      <span style={{ color: "rgb(var(--fg-soft))" }}>{label}</span>
      <span className="center gap-2">
        <span className="tabular" style={{ fontWeight: 600 }}>{v}</span>
        <span className="muted" style={{ fontSize: 10 }}>{hint}</span>
      </span>
    </div>
  );
}
