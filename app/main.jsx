/* Tangent Insight — App root */

const { useState, useEffect, useRef, useMemo } = React;

// Tweakable defaults persisted to the HTML file
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "sidebarMode": "full",
  "density": "comfortable",
  "accent": "cyan",
  "dashLayout": "compact",
  "tickSpeed": 1
}/*EDITMODE-END*/;

const ROUTE_META = {
  dashboard:     { title: "Executive Dashboard",      subtitle: "Tangent firm-wide · live overview", breadcrumbs: ["Overview", "Dashboard"] },
  live:          { title: "Live Activity Center",     subtitle: "Realtime stream · Revit · Teams · System", breadcrumbs: ["Overview", "Live activity"] },
  revit:         { title: "Revit Project Monitor",    subtitle: "All active projects · sync · health", breadcrumbs: ["Monitoring", "Revit"] },
  employees:     { title: "Employee Performance",     subtitle: "Workforce analytics · workload · productivity", breadcrumbs: ["Monitoring", "Employees"] },
  teams:         { title: "Microsoft Teams Activity", subtitle: "Meetings · calls · collaboration metrics", breadcrumbs: ["Monitoring", "Teams"] },
  attendance:    { title: "Attendance & Timesheets",  subtitle: "Daily sign-in · overtime · absences", breadcrumbs: ["Monitoring", "Attendance"] },
  history:       { title: "Historical Data",          subtitle: "Smart search across 14.2M archived events", breadcrumbs: ["Insights", "History"] },
  useranalytics: { title: "User Analytics",            subtitle: "Per-employee activity timeline · Revit actions · productivity", breadcrumbs: ["Insights", "User Analytics"] },
  reports:       { title: "Reports & Export",         subtitle: "Build · schedule · share", breadcrumbs: ["Insights", "Reports"] },
  analytics:     { title: "Analytics",                subtitle: "Productivity, utilization, risk", breadcrumbs: ["Insights", "Analytics"] },
  notifications: { title: "Notifications",            subtitle: "Alerts & system messages", breadcrumbs: ["System", "Notifications"] },
  admin:         { title: "Admin & Permissions",      subtitle: "Roles, security, retention, integrations", breadcrumbs: ["System", "Admin"] },
  settings:      { title: "Settings",                 subtitle: "Profile, preferences, integrations", breadcrumbs: ["System", "Settings"] },
};

const ACCENT_HEX = { cyan: "#00AEEF", indigo: "#6366F1", emerald: "#10B981", violet: "#8B5CF6" };

function App() {
  const [tw, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState(() => localStorage.getItem("ti-route") || "dashboard");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activity, setActivity] = useState(window.TI_DATA.initialActivity);
  const [kpis, setKpis] = useState(window.TI_DATA.kpis);
  const liveSeq = useRef(1000);

  // Persist route
  useEffect(() => { localStorage.setItem("ti-route", route); }, [route]);

  // Apply tweaks to root attributes
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = tw.theme;
    root.dataset.sidebar = tw.sidebarMode;
    root.dataset.density = tw.density;
    root.dataset.accent = tw.accent;
  }, [tw.theme, tw.sidebarMode, tw.density, tw.accent]);

  // LIVE mode: pull real data from Supabase on an interval and refresh the UI
  // when it arrives. MOCK mode (?mock=1): fall back to the synthetic ticker.
  useEffect(() => {
    const D = window.TI_DATA;

    if (window.TI_REFRESH) {
      const sync = () => {
        setActivity(D.initialActivity.slice());
        setKpis(D.kpis.slice());
      };
      window.addEventListener("ti-data", sync);
      if (window.TI_LIVE !== undefined) sync();   // data may have already arrived
      window.TI_REFRESH();                          // re-fetch now that we're listening
      const id = setInterval(() => { window.TI_REFRESH(); }, 20000);
      return () => { window.removeEventListener("ti-data", sync); clearInterval(id); };
    }

    // ---- mock-only synthetic ticker ----
    const kinds = ["sync", "save", "open", "warning", "clash", "teams", "publish", "workset"];
    const projects = D.projects.map(p => p.code);
    const users = D.people.filter(p => p.status !== "offline").map(p => p.id);
    const intervalMs = Math.max(800, 4200 / (tw.tickSpeed || 1));
    const id = setInterval(() => {
      const kind = kinds[Math.floor(Math.random() * kinds.length)];
      const project = projects[Math.floor(Math.random() * projects.length)];
      const u = users[Math.floor(Math.random() * users.length)];
      const details = {
        sync: ["Sync to central · " + Math.floor(Math.random() * 60 + 5) + " elements", "Sync to central · 3.4s · 18 elements"],
        save: ["Local save · " + (Math.random() * 12 + 1).toFixed(1) + " MB", "Saved view sheet"],
        open: ["Opened central model", "Opened section view"],
        warning: ["Disjoined hosts · " + Math.floor(Math.random() * 6 + 1) + " new", "Workset conflict resolved"],
        clash: [Math.floor(Math.random() * 4 + 1) + " hard clashes detected", "Resolved 2 clashes"],
        teams: ["Joined coordination meeting", "Left meeting · " + Math.floor(Math.random() * 50 + 10) + " min"],
        publish: ["IFC 4 export · " + Math.floor(Math.random() * 200 + 100) + " MB", "Published NWC"],
        workset: ["Workset borrowed", "Workset released"],
      };
      const detail = details[kind][Math.floor(Math.random() * details[kind].length)];
      const newEvent = { id: ++liveSeq.current, kind, user: u, project, t: 0, detail };
      setActivity(prev => [newEvent, ...prev.map(a => ({ ...a, t: a.t + (Math.random() < 0.3 ? 1 : 0) }))].slice(0, 50));
      setKpis(prev => prev.map(k => Math.random() < 0.35 ? { ...k, value: Math.max(0, k.value + (Math.random() < 0.5 ? -1 : 1)) } : k));
    }, intervalMs);
    return () => clearInterval(id);
  }, [tw.tickSpeed]);

  useEffect(() => {
    if (route !== "revit") setSelectedProject(null);
    if (route !== "employees") setSelectedEmployee(null);
  }, [route]);

  const user = {
    name: "Operations",
    initials: "OP",
    role: "Tangent Insight · Dubai",
    discipline: "MANAGER",
  };

  const meta = ROUTE_META[route] || ROUTE_META.dashboard;

  const screen = (() => {
    const common = { activity, setRoute, kpis, dashLayout: tw.dashLayout };
    switch (route) {
      case "dashboard":     return <window.DashboardScreen {...common} setSelectedProject={setSelectedProject} setSelectedEmployee={setSelectedEmployee} />;
      case "live":          return <window.LiveScreen activity={activity} setRoute={setRoute} />;
      case "revit":         return <window.RevitScreen selectedProject={selectedProject} setSelectedProject={setSelectedProject} setSelectedEmployee={setSelectedEmployee} setRoute={setRoute} activity={activity} />;
      case "employees":     return <window.EmployeesScreen selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} setRoute={setRoute} activity={activity} />;
      case "teams":         return <window.TeamsScreen activity={activity} setRoute={setRoute} setSelectedEmployee={setSelectedEmployee} />;
      case "attendance":    return <window.AttendanceScreen />;
      case "history":       return <window.HistoryScreen activity={activity} />;
      case "useranalytics": return <window.UserAnalyticsScreen activity={activity} />;
      case "reports":       return <window.ReportsScreen />;
      case "analytics":     return <window.AnalyticsScreen />;
      case "notifications": return <window.NotificationsScreen />;
      case "admin":         return <window.AdminScreen />;
      case "settings":      return <window.SettingsScreen />;
      default:              return <window.DashboardScreen {...common} setSelectedProject={setSelectedProject} setSelectedEmployee={setSelectedEmployee} />;
    }
  })();

  return (
    <div className="brand-mesh" style={{
      minHeight: "100vh",
      paddingLeft: tw.sidebarMode === "icon" ? 96 : 264,
      paddingRight: 16, paddingTop: 16, paddingBottom: 32,
      transition: "padding 0.25s cubic-bezier(0.2,0.8,0.2,1)",
    }}>
      <window.Sidebar route={route} setRoute={setRoute} user={user} sidebarMode={tw.sidebarMode} />
      <div data-screen-label={`Tangent Insight · ${meta.title}`}>
        <window.Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          breadcrumbs={meta.breadcrumbs}
          theme={tw.theme}
          setTheme={(t) => setTweak("theme", t)}
          onSearch={setSearch}
          search={search}
          route={route}
          openNotifications={() => setRoute("notifications")}
        />
        {screen}
      </div>

      <window.TweaksPanel>
        <window.TweakSection label="Theme">
          <window.TweakRadio label="Mode" value={tw.theme} options={["light","dark"]} onChange={v => setTweak("theme", v)} />
          <window.TweakColor label="Accent"
            value={ACCENT_HEX[tw.accent]}
            options={Object.values(ACCENT_HEX)}
            onChange={hex => {
              const key = Object.keys(ACCENT_HEX).find(k => ACCENT_HEX[k] === hex) || "cyan";
              setTweak("accent", key);
            }}
          />
        </window.TweakSection>

        <window.TweakSection label="Layout">
          <window.TweakRadio label="Sidebar"  value={tw.sidebarMode} options={["full","icon"]} onChange={v => setTweak("sidebarMode", v)} />
          <window.TweakRadio label="Density"  value={tw.density}     options={["comfortable","compact"]} onChange={v => setTweak("density", v)} />
          <window.TweakRadio label="KPI grid" value={tw.dashLayout}  options={["compact","wide"]} onChange={v => setTweak("dashLayout", v)} />
        </window.TweakSection>

        <window.TweakSection label="Live data">
          <window.TweakSlider label="Tick speed" value={tw.tickSpeed} min={0.25} max={4} step={0.25} unit="×" onChange={v => setTweak("tickSpeed", v)} />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
