/* Tangent Insight — Revit Project Monitor */

window.RevitScreen = function RevitScreen({ selectedProject, setSelectedProject, setSelectedEmployee, setRoute, activity }) {
  const D = window.TI_DATA;
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [view, setView] = React.useState("grid");

  const filtered = D.projects.filter(p => {
    if (filter === "critical" && p.health !== "CRITICAL") return false;
    if (filter === "active" && p.activeUsers === 0) return false;
    if (filter === "delay" && p.health !== "DELAY") return false;
    if (search && !(p.code + p.name + p.client).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sel = selectedProject ? D.byCode(selectedProject) : null;

  // Live KPIs derived from real data
  const totalProjects   = D.projects.length;
  const activeProjects  = D.projects.filter(p => p.activeUsers > 0).length;
  const criticalProjects= D.projects.filter(p => p.health === "CRITICAL").length;
  const modelersActive  = D.people.filter(p => p.status !== "offline" &&
                            (p.discipline === "MODELER" || p.discipline === "DETAILER")).length;
  const syncsLastHr     = (D.initialActivity || []).filter(a => a.kind === "sync" && a.t <= 60).length;
  const totalModelMB    = D.projects.reduce((a, p) => a + (Number(p.modelSize) || 0), 0);
  const totalModel      = totalModelMB >= 1024 ? (totalModelMB / 1024).toFixed(1) : String(totalModelMB);
  const totalModelUnit  = totalModelMB >= 1024 ? "GB" : "MB";

  return (
    <PageShell>
      {/* Summary strip */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
        <StatTile icon="folder-kanban"  label="Total projects"  value={totalProjects} tone="accent" />
        <StatTile icon="zap"            label="Active now"      value={activeProjects}  tone="success" />
        <StatTile icon="alert-octagon"  label="Critical"        value={criticalProjects}  tone="danger" />
        <StatTile icon="users"          label="Modelers active" value={modelersActive} tone="info" />
        <StatTile icon="refresh-cw"     label="Syncs · last hr" value={syncsLastHr} tone="accent" />
        <StatTile icon="hard-drive"     label="Total model"     value={totalModel} suffix={totalModelUnit} tone="muted" />
      </div>

      {/* Filter bar */}
      <div className="surface-flat" style={{ padding: 10, display: "flex", alignItems: "center", gap: 10, borderRadius: 14 }}>
        <div className="search-wrap" style={{ flex: 1, maxWidth: 320 }}>
          <Icon className="search-icon" name="search" size={14} />
          <input className="input" placeholder="Search by code, name, or client…"
                 value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="seg">
          <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>All <span className="muted">· {D.projects.length}</span></button>
          <button className={filter === "active" ? "on" : ""} onClick={() => setFilter("active")}>Active</button>
          <button className={filter === "critical" ? "on" : ""} onClick={() => setFilter("critical")}>Critical</button>
          <button className={filter === "delay" ? "on" : ""} onClick={() => setFilter("delay")}>Delayed</button>
        </div>
        <div className="vdiv" style={{ height: 22 }} />
        <div style={{ flex: 1 }} />
        <div className="seg">
          <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}><Icon name="grid-3x3" size={11} /></button>
          <button className={view === "list" ? "on" : ""} onClick={() => setView("list")}><Icon name="list" size={11} /></button>
        </div>
        <button className="btn btn-secondary btn-sm"
                onClick={() => window.TI_UTIL.exportCsv("revit-projects",
                  D.projects.map(p => ({ project: p.code, active_users: p.activeUsers, total_users: p.totalUsers,
                    worksets: p.worksets, open_views: p.openViews, warnings: p.warnings,
                    linked_models: p.linkedModels, model_size_mb: p.modelSize, version: p.version })))}>
          <Icon name="download" size={12} /> Export
        </button>
      </div>

      {/* Split layout: grid + detail */}
      <div style={{ display: "grid", gridTemplateColumns: sel ? "1.4fr 1fr" : "1fr", gap: 14 }}>
        {/* Project grid/list */}
        <div className={view === "grid" ? "grid" : ""} style={view === "grid" ? { gridTemplateColumns: sel ? "1fr 1fr" : "repeat(3, 1fr)" } : {}}>
          {view === "grid"
            ? filtered.map(p => <ProjectCard key={p.code} p={p} selected={p.code === selectedProject} onClick={() => setSelectedProject(p.code)} />)
            : (
              <div className="surface" style={{ padding: 0, overflow: "hidden", borderRadius: 18 }}>
                <table className="table">
                  <thead><tr>
                    <th>Code</th><th>Project</th><th>Stage</th><th>Health</th><th>Active</th><th>Progress</th><th className="tabular">Clashes</th><th>Sync</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.code} className="click" onClick={() => setSelectedProject(p.code)} style={{ background: p.code === selectedProject ? "rgb(var(--accent) / 0.06)" : undefined }}>
                        <td><span className="code-pill">{p.code}</span></td>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td><StagePill stage={p.stage} /></td>
                        <td><HealthPill health={p.health} /></td>
                        <td><AvatarStack users={D.people.filter(u => u.project === p.code).map(u=>u.id)} size={20} max={3} /></td>
                        <td style={{ width: 140 }}><Progress value={p.progress} /></td>
                        <td className="tabular">{p.clashes}</td>
                        <td className="muted" style={{ fontSize: 11 }}>{p.lastSync}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        {/* Detail panel */}
        {sel && <ProjectDetail p={sel} onClose={() => setSelectedProject(null)} setSelectedEmployee={setSelectedEmployee} setRoute={setRoute} activity={activity} />}
      </div>
    </PageShell>
  );
};

function StatTile({ icon, label, value, suffix, delta, tone }) {
  const c = tone === "success" ? "rgb(var(--success))"
          : tone === "danger"  ? "rgb(var(--danger))"
          : tone === "warning" ? "rgb(var(--warning))"
          : tone === "info"    ? "rgb(var(--info))"
          : tone === "accent"  ? "rgb(var(--accent))"
          : "rgb(var(--fg-muted))";
  return (
    <div className="surface" style={{ padding: 14, borderRadius: 14 }}>
      <div className="between" style={{ marginBottom: 6 }}>
        <div className="micro">{label}</div>
        <div style={{
          height: 24, width: 24, borderRadius: 7,
          background: c + "1A", color: c,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={icon} size={12} strokeWidth={2.2} />
        </div>
      </div>
      <div className="between">
        <div className="tabular" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          {value}{suffix && <span className="muted" style={{ fontSize: 13, marginLeft: 2 }}>{suffix}</span>}
        </div>
        {delta && <span className="tabular" style={{ fontSize: 11, fontWeight: 600, color: c }}>{delta}</span>}
      </div>
    </div>
  );
}

function ProjectCard({ p, selected, onClick }) {
  const D = window.TI_DATA;
  const isCritical = p.health === "CRITICAL";
  return (
    <div className="surface surface-hover click" onClick={onClick} style={{
      padding: 0, borderRadius: 18, overflow: "hidden",
      borderColor: selected ? "rgb(var(--accent))" : isCritical ? "rgb(var(--danger) / 0.5)" : undefined,
      boxShadow: selected ? "0 0 0 2px rgb(var(--accent) / 0.4), var(--shadow)" : isCritical ? "0 0 0 2px rgb(var(--danger) / 0.25), var(--shadow)" : undefined,
      position: "relative",
    }}>
      {isCritical && (
        <div style={{
          position: "absolute", top: 10, right: 10, zIndex: 2,
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 7px", borderRadius: 9999,
          background: "rgb(var(--danger))", color: "white",
          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.05, textTransform: "uppercase",
        }}>
          <Icon name="flame" size={10} /> Critical
        </div>
      )}
      {/* Header band with iso pattern */}
      <div style={{
        position: "relative", padding: "14px 14px 10px",
        background: `linear-gradient(135deg, rgb(var(--accent) / 0.04), rgb(var(--accent-2) / 0.04))`,
        borderBottom: "1px solid rgb(var(--hairline))",
      }}>
        <div className="iso-wire" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        <div className="center gap-3" style={{ position: "relative", zIndex: 1 }}>
          <WireframeMotif size={36} color={isCritical ? "rgb(var(--danger))" : "rgb(var(--accent))"} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="center gap-2">
              <span className="code-pill">{p.code}</span>
              <StagePill stage={p.stage} />
            </div>
            <div className="truncate" style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{p.name}</div>
            <div className="muted truncate" style={{ fontSize: 11, marginTop: 1 }}>{p.client} · {p.version} · {p.modelSize} {p.modelSizeUnit}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="between">
          <HealthPill health={p.health} />
          <div className="center gap-2 muted" style={{ fontSize: 11 }}>
            <LiveDot tone={p.activeUsers ? "" : "off"} />
            <span className="tabular">{p.activeUsers} / {p.totalUsers}</span> working
          </div>
        </div>

        <div>
          <div className="between" style={{ marginBottom: 4 }}>
            <span className="micro">Progress</span>
            <span className="tabular muted" style={{ fontSize: 11 }}>{p.progress}% · due {p.deadline}</span>
          </div>
          <Progress value={p.progress} tone={isCritical ? "danger" : p.health === "DELAY" ? "warning" : undefined} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          <Metric icon="zap"             label="Clashes"  value={p.clashes}  tone={p.clashes > 20 ? "danger" : p.clashes > 10 ? "warning" : "default"} />
          <Metric icon="alert-triangle"  label="Warnings" value={p.warnings} tone={p.warnings > 50 ? "danger" : p.warnings > 20 ? "warning" : "default"} />
          <Metric icon="link"            label="Linked"   value={p.linkedModels} />
          <Metric icon="layers"          label="Worksets" value={p.worksets} />
        </div>

        <div className="between" style={{ paddingTop: 6, borderTop: "1px solid rgb(var(--hairline))" }}>
          <div className="center gap-2 muted" style={{ fontSize: 11 }}>
            <Icon name="refresh-cw" size={11} /> <span className="mono">{p.lastSync}</span>
          </div>
          <AvatarStack users={D.people.filter(u => u.project === p.code).map(u => u.id)} size={20} max={4} />
        </div>
      </div>
    </div>
  );
}

function Metric({ icon, label, value, tone = "default" }) {
  const c = tone === "danger" ? "rgb(var(--danger))" : tone === "warning" ? "rgb(var(--warning))" : "rgb(var(--fg))";
  return (
    <div className="surface-flat" style={{ padding: "8px 8px", borderRadius: 9 }}>
      <div className="muted center gap-2" style={{ fontSize: 10 }}>
        <Icon name={icon} size={10} /> {label}
      </div>
      <div className="tabular" style={{ fontSize: 16, fontWeight: 700, marginTop: 2, color: c }}>{value}</div>
    </div>
  );
}

function ProjectDetail({ p, onClose, setSelectedEmployee, setRoute, activity }) {
  const D = window.TI_DATA;
  const teamMembers = D.people.filter(u => u.project === p.code);
  const projectActivity = activity.filter(a => a.project === p.code).slice(0, 10);
  return (
    <div className="surface" style={{ padding: 0, borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "85vh", position: "sticky", top: 92 }}>
      {/* Header */}
      <div style={{ padding: 14, borderBottom: "1px solid rgb(var(--hairline))", position: "relative" }}>
        <div className="iso-wire" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        <div className="between" style={{ position: "relative" }}>
          <div className="center gap-3">
            <WireframeMotif size={40} color={p.health === "CRITICAL" ? "rgb(var(--danger))" : "rgb(var(--accent))"} />
            <div>
              <div className="center gap-2">
                <span className="code-pill">{p.code}</span>
                <StagePill stage={p.stage} />
                <HealthPill health={p.health} />
              </div>
              <h2 className="h2" style={{ marginTop: 5 }}>{p.name}</h2>
              <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{p.client} · {p.version} · Deadline {p.deadline}</div>
            </div>
          </div>
          <div className="center gap-2">
            <button className="btn btn-ghost btn-icon" title="Refresh"
                    onClick={() => { if (window.TI_REFRESH) { window.TI_REFRESH(); window.TI_UTIL.toast("Refreshing live data…", "info"); } }}>
              <Icon name="refresh-cw" size={14} />
            </button>
            <button className="btn btn-ghost btn-icon" title="Export projects"
                    onClick={() => window.TI_UTIL.exportCsv("revit-projects",
                      D.projects.map(p => ({ project: p.code, active_users: p.activeUsers, total_users: p.totalUsers,
                        worksets: p.worksets, open_views: p.openViews, warnings: p.warnings,
                        linked_models: p.linkedModels, model_size_mb: p.modelSize, version: p.version })))}>
              <Icon name="download" size={14} />
            </button>
            <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={14} /></button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Health score & big metrics */}
        <div className="grid" style={{ gridTemplateColumns: "auto 1fr", gap: 14, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Donut
              size={130} thickness={10}
              centerLabel={`${Math.round(p.criticality * 100)}`}
              label="HEALTH SCORE"
              data={[
                { value: 1 - p.criticality, color: "rgb(var(--success))" },
                { value: p.criticality,     color: p.health === "CRITICAL" ? "rgb(var(--danger))" : p.health === "DELAY" ? "rgb(var(--warning))" : "rgb(var(--accent))" },
              ]}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
            <DetailMetric icon="hard-drive"     label="Model size"  value={`${p.modelSize} MB`} />
            <DetailMetric icon="link"           label="Linked"       value={p.linkedModels} />
            <DetailMetric icon="layers"         label="Worksets"     value={p.worksets} />
            <DetailMetric icon="eye"            label="Open views"   value={p.openViews} />
            <DetailMetric icon="zap"            label="Hard clashes" value={p.clashes} tone={p.clashes > 20 ? "danger" : "default"} />
            <DetailMetric icon="alert-triangle" label="Warnings"     value={p.warnings} tone={p.warnings > 50 ? "warning" : "default"} />
          </div>
        </div>

        {/* Sync timeline (mini bar chart) */}
        <div>
          <div className="between" style={{ marginBottom: 8 }}>
            <span className="micro">Sync activity · last 15 mins</span>
            <Pill tone={p.lastSync.startsWith("stale") ? "danger" : "success"} dot>{p.lastSync}</Pill>
          </div>
          <SyncTimeline data={p.sparkline} />
        </div>

        {/* Central model state */}
        <div className="surface-flat" style={{ padding: 12, borderRadius: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="center gap-2">
            <Icon name="cloud" size={14} color="rgb(var(--accent))" />
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>Central model</span>
            <Pill tone={p.lastSync.startsWith("stale") ? "danger" : "success"}>{p.lastSync.startsWith("stale") ? "Stale" : "Healthy"}</Pill>
          </div>
          <div className="mono muted" style={{ fontSize: 11 }}>{p.central}</div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <SmallStat label="Sync time avg" value="3.2s" />
            <SmallStat label="Save time avg" value="1.1s" />
            <SmallStat label="Last save" value="42s ago" />
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="between" style={{ marginBottom: 8 }}>
            <span className="micro">Active team · {teamMembers.filter(m=>m.status!=="offline").length} online</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setRoute("employees")}>All members <Icon name="arrow-right" size={11} /></button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {teamMembers.map(m => (
              <div key={m.id} className="row-hover click" onClick={() => { setSelectedEmployee(m.id); setRoute("employees"); }} style={{ padding: "6px 8px", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={m.name} initials={m.initials} size={26} discipline={m.discipline} status={m.status} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600 }}>{m.name}</div>
                  <div className="center gap-2 muted truncate" style={{ fontSize: 10.5 }}>
                    <span className={`tag tag-${m.discipline.toLowerCase()}`}>{m.role}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="center gap-2" style={{ fontSize: 11, justifyContent: "flex-end" }}>
                    {m.status === "online" ? <LiveDot /> :
                     m.status === "meeting" ? <LiveDot tone="warn" /> :
                     m.status === "idle"    ? <span className="dot dot-warning" /> :
                     <span className="dot dot-muted" />}
                    <span className="muted" style={{ textTransform: "capitalize" }}>{m.status}</span>
                  </div>
                  <div className="muted tabular" style={{ fontSize: 10.5 }}>{m.focusMin}m focus</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent project activity */}
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>Project activity · last hour</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(projectActivity.length ? projectActivity : activity.slice(0, 5)).map(a => (
              <window.FeedItem key={a.id} item={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailMetric({ icon, label, value, tone }) {
  const c = tone === "danger" ? "rgb(var(--danger))" : tone === "warning" ? "rgb(var(--warning))" : "rgb(var(--fg))";
  return (
    <div className="surface-flat" style={{ padding: "8px 10px", borderRadius: 10 }}>
      <div className="muted center gap-2" style={{ fontSize: 10 }}>
        <Icon name={icon} size={11} /> {label}
      </div>
      <div className="tabular" style={{ fontSize: 17, fontWeight: 700, marginTop: 2, color: c, lineHeight: 1.1 }}>{value}</div>
    </div>
  );
}

function SmallStat({ label, value }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 10.5 }}>{label}</div>
      <div className="tabular" style={{ fontSize: 13, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function SyncTimeline({ data }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 44 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, height: `${(v / max) * 100}%`,
          background: i === data.length - 1 ? "rgb(var(--accent))" : "rgb(var(--accent) / 0.5)",
          borderRadius: 2,
          minHeight: 3,
        }} />
      ))}
    </div>
  );
}
