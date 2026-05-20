/* Tangent Insight — Historical Data
   Honest archive search over real activity_events from Supabase.
   Filters: kind / project / person / date range.
   Pulls up to 2000 most-recent events on demand. */

window.HistoryScreen = function HistoryScreen({ activity }) {
  const D = window.TI_DATA;
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [days, setDays] = React.useState(7);            // 1 / 7 / 30 / 90
  const [kindF, setKindF] = React.useState("all");
  const [projF, setProjF] = React.useState("all");
  const [userF, setUserF] = React.useState("all");
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (!window.TI_SUPABASE_REST) {
      setRows((activity || []).slice());
      return;
    }
    setLoading(true);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    window.TI_SUPABASE_REST("activity_events",
      "select=*&occurred_at=gte." + since + "&order=occurred_at.desc&limit=2000")
      .then(rs => { setRows(Array.isArray(rs) ? rs : []); setLoading(false); })
      .catch(() => { setRows([]); setLoading(false); });
  }, [days]);

  // Build filter options from the loaded rows so they reflect what actually exists
  const kindCounts = {};
  rows.forEach(r => { kindCounts[r.kind] = (kindCounts[r.kind] || 0) + 1; });
  const kinds = Object.keys(kindCounts).sort((a,b)=> kindCounts[b] - kindCounts[a]);

  const projCounts = {};
  rows.forEach(r => { if (r.project && r.project !== "—") projCounts[r.project] = (projCounts[r.project] || 0) + 1; });
  const projects = Object.keys(projCounts).sort((a,b) => projCounts[b] - projCounts[a]).slice(0, 12);

  const userCounts = {};
  rows.forEach(r => { if (r.user_id) userCounts[r.user_id] = (userCounts[r.user_id] || 0) + 1; });
  const users = Object.keys(userCounts).map(id => D.byId(id)).filter(Boolean)
                  .sort((a,b) => userCounts[b.id] - userCounts[a.id]).slice(0, 12);

  // Apply current filters
  const filtered = rows.filter(r => {
    if (kindF !== "all" && r.kind !== kindF) return false;
    if (projF !== "all" && r.project !== projF) return false;
    if (userF !== "all" && r.user_id !== userF) return false;
    if (query) {
      const hay = ((r.detail || "") + " " + (r.project || "") + " " + (D.byId(r.user_id)?.name || "")).toLowerCase();
      if (!hay.includes(query.toLowerCase())) return false;
    }
    return true;
  });

  // Per-hour density across the loaded window (for the strip chart)
  const buckets = days === 1 ? 24 : days * 24;
  const density = new Array(buckets).fill(0);
  const start  = Date.now() - days * 86400000;
  rows.forEach(r => {
    const t = new Date(r.occurred_at).getTime();
    const idx = Math.floor((t - start) / (3600 * 1000));
    if (idx >= 0 && idx < buckets) density[idx]++;
  });
  const peak = Math.max(1, ...density);

  function exportCsv() {
    if (!filtered.length) return;
    const fields = ["occurred_at", "kind", "user_id", "project", "detail"];
    const esc = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const csv = [fields.join(","), ...filtered.map(r => fields.map(f => esc(r[f])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tangent-activity-" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a); a.click(); a.remove();
  }

  return (
    <PageShell>
      {/* Hero */}
      <div className="surface" style={{ padding: 18, borderRadius: 18 }}>
        <div className="center gap-2 micro" style={{ color: "rgb(var(--accent))" }}>
          <Icon name="history" size={12} /> Activity archive
        </div>
        <h1 className="h1" style={{ marginTop: 6, marginBottom: 14 }}>
          <span className="tabular gradient-text">{rows.length.toLocaleString()}</span> events captured in the last {days === 1 ? "24 hours" : days + " days"}
        </h1>
        <div className="center gap-2" style={{ flexWrap: "wrap" }}>
          <div className="search-wrap" style={{ maxWidth: 460, flex: 1, minWidth: 240 }}>
            <Icon className="search-icon" name="search" size={14} />
            <input className="input" value={query} onChange={e => setQuery(e.target.value)}
                   placeholder="Search detail / project / person…" />
          </div>
          <div className="seg">
            {[{l:"24h",v:1},{l:"7d",v:7},{l:"30d",v:30},{l:"90d",v:90}].map(o => (
              <button key={o.v} className={days === o.v ? "on" : ""} onClick={() => setDays(o.v)}>{o.l}</button>
            ))}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={exportCsv} disabled={!filtered.length}>
            <Icon name="download" size={12} /> Export {filtered.length || 0} as CSV
          </button>
        </div>

        {/* Density bar built from real events */}
        <div style={{ marginTop: 16, height: 36, background: "rgb(var(--bg-sunken))",
                      borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          {density.map((v, i) => (
            <div key={i} style={{
              flex: 1, height: `${(v / peak) * 100}%`,
              background: v ? "rgb(var(--accent))" : "transparent",
              opacity: 0.45 + (v / peak) * 0.55, transition: "height 0.2s",
            }} title={`${v} event${v === 1 ? "" : "s"}`} />
          ))}
        </div>
        <div className="between muted" style={{ fontSize: 10.5, marginTop: 4 }}>
          <span>{new Date(start).toLocaleString("en-GB")}</span>
          <span>peak {peak}/hr</span>
          <span>now</span>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "260px 1fr" }}>
        {/* Filters built from REAL data */}
        <div className="surface" style={{ padding: 14, borderRadius: 16 }}>
          <div className="micro" style={{ marginBottom: 10 }}>Filters</div>

          <FilterGroup label="Event type">
            <CheckRow l="All events" c={rows.length} on={kindF === "all"} onClick={() => setKindF("all")} />
            {kinds.map(k => (
              <CheckRow key={k} l={k} c={kindCounts[k]} on={kindF === k} onClick={() => setKindF(k)} />
            ))}
          </FilterGroup>

          <div className="divider" style={{ margin: "14px 0" }} />

          <FilterGroup label="Project">
            <CheckRow l="All projects" c={rows.length} on={projF === "all"} onClick={() => setProjF("all")} />
            {projects.length === 0 && <div className="muted" style={{ fontSize: 11, padding: "4px 8px" }}>None in window</div>}
            {projects.map(p => (
              <CheckRow key={p} l={p} c={projCounts[p]} on={projF === p} onClick={() => setProjF(p)} />
            ))}
          </FilterGroup>

          <div className="divider" style={{ margin: "14px 0" }} />

          <FilterGroup label="Employee">
            <CheckRow l="Everyone" c={rows.length} on={userF === "all"} onClick={() => setUserF("all")} />
            {users.length === 0 && <div className="muted" style={{ fontSize: 11, padding: "4px 8px" }}>None in window</div>}
            {users.map(p => (
              <CheckRow key={p.id} l={p.name} c={userCounts[p.id]} on={userF === p.id} onClick={() => setUserF(p.id)} />
            ))}
          </FilterGroup>
        </div>

        {/* Results */}
        <div className="surface" style={{ padding: 0, borderRadius: 16, overflow: "hidden" }}>
          <div className="between" style={{ padding: "12px 14px", borderBottom: "1px solid rgb(var(--hairline))" }}>
            <CardTitle title="Results" subtitle={filtered.length + " events" + (rows.length !== filtered.length ? " (filtered from " + rows.length + ")" : "")} icon="list" />
          </div>
          {loading ? (
            <div className="muted" style={{ padding: 24, textAlign: "center", fontSize: 12 }}>Loading archive…</div>
          ) : filtered.length === 0 ? (
            <div className="muted" style={{ padding: 24, textAlign: "center", fontSize: 12 }}>
              No events match. {rows.length === 0 && "The agent hasn't captured any events in this window yet."}
            </div>
          ) : (
            <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
              <table className="table" style={{ marginTop: 0 }}>
                <thead style={{ position: "sticky", top: 0, background: "rgb(var(--bg))" }}>
                  <tr><th>When</th><th>Kind</th><th>Who</th><th>Project</th><th>Detail</th></tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 500).map(r => {
                    const p = D.byId(r.user_id);
                    return (
                      <tr key={r.id}>
                        <td className="muted tabular" style={{ fontSize: 11, whiteSpace: "nowrap" }}>{new Date(r.occurred_at).toLocaleString("en-GB")}</td>
                        <td><Pill tone="neutral">{r.kind}</Pill></td>
                        <td style={{ fontSize: 12.5 }}>{p ? p.name : <span className="muted mono">{r.user_id || "—"}</span>}</td>
                        <td className="mono" style={{ fontSize: 11.5 }}>{r.project || "—"}</td>
                        <td style={{ fontSize: 12 }}>{r.detail}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length > 500 && (
                <div className="muted" style={{ padding: 10, textAlign: "center", fontSize: 11 }}>
                  Showing first 500 — refine filters or export the full {filtered.length.toLocaleString()} as CSV.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

function FilterGroup({ label, children }) {
  return (
    <div>
      <div className="micro" style={{ fontSize: 10, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{children}</div>
    </div>
  );
}

function CheckRow({ l, c, on, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 8, padding: "6px 8px", borderRadius: 7, fontSize: 11.5,
      background: on ? "rgb(var(--accent-soft))" : "transparent",
      color: on ? "rgb(var(--accent))" : "rgb(var(--fg-soft))",
      fontWeight: on ? 600 : 500,
      border: "none", cursor: "pointer", textAlign: "left",
    }}>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l}</span>
      <span className="tabular faint" style={{ fontSize: 10 }}>{c}</span>
    </button>
  );
}
