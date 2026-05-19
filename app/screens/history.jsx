/* Tangent Insight — Historical Data & Smart Retrieval */

window.HistoryScreen = function HistoryScreen({ activity }) {
  const D = window.TI_DATA;
  const [query, setQuery] = React.useState("");
  const [scrub, setScrub] = React.useState(74); // 0-100 = day timeline
  const [playing, setPlaying] = React.useState(false);
  const [day, setDay] = React.useState("Today");

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setScrub(s => (s + 0.3) % 100), 80);
    return () => clearInterval(id);
  }, [playing]);

  const hour = String(Math.floor((scrub / 100) * 24)).padStart(2, "0");
  const minute = String(Math.floor(((scrub / 100) * 24 % 1) * 60)).padStart(2, "0");

  const suggestions = [
    { icon: "user",   text: "Layla Haddad's activity last Thursday",   tag: "AI" },
    { icon: "zap",    text: "All clashes on NEOM01 in May",            tag: "AI" },
    { icon: "video",  text: "Teams meetings longer than 1 hour",       tag: "AI" },
    { icon: "alert-octagon", text: "Sync failures in the last 30 days", tag: "AI" },
  ];

  return (
    <PageShell>
      {/* Smart search hero */}
      <div className="surface" style={{ padding: 18, borderRadius: 18, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.6,
          background: "radial-gradient(ellipse 50% 60% at 80% 20%, rgb(var(--accent-2) / 0.15), transparent 60%), radial-gradient(ellipse 40% 50% at 10% 90%, rgb(var(--accent) / 0.1), transparent 60%)",
        }} />
        <div style={{ position: "relative" }}>
          <div className="center gap-2 micro" style={{ color: "rgb(var(--accent))" }}>
            <Icon name="sparkles" size={12} /> Smart history search
          </div>
          <h1 className="h1" style={{ marginTop: 6, marginBottom: 14 }}>
            Find anything across <span className="tabular gradient-text">14.2M</span> archived events
          </h1>
          <div className="search-wrap" style={{ maxWidth: 760 }}>
            <Icon className="search-icon" name="search" size={16} />
            <input className="input" style={{ height: 46, fontSize: 14, paddingLeft: 40 }}
                   value={query} onChange={e => setQuery(e.target.value)}
                   placeholder='Try: "syncs from Marcus on SAADIYAT07 last week", "all errors yesterday"' />
            <button className="btn btn-primary btn-sm" style={{ position: "absolute", right: 6, top: 6 }}>
              <Icon name="sparkles" size={12} /> Ask
            </button>
          </div>
          <div className="center gap-2" style={{ marginTop: 12, flexWrap: "wrap" }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setQuery(s.text)} style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "6px 10px", borderRadius: 9999,
                background: "rgb(var(--bg-elev))", border: "1px solid rgb(var(--border))",
                color: "rgb(var(--fg-soft))", fontSize: 11.5, fontWeight: 500,
                cursor: "pointer", transition: "all 0.15s",
              }}>
                <Icon name={s.icon} size={12} color="rgb(var(--accent))" /> {s.text}
                <span style={{ fontSize: 9.5, color: "rgb(var(--accent))", fontWeight: 700, marginLeft: 2 }}>{s.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity playback */}
      <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
        <div className="between" style={{ marginBottom: 14 }}>
          <CardTitle title="Activity playback" subtitle="Scrub the day to replay every event chronologically" icon="rotate-ccw" />
          <div className="center gap-2">
            <div className="seg">
              {["Today", "Yesterday", "Mon May 17", "Sun May 16", "Sat May 15"].map(d => (
                <button key={d} className={day === d ? "on" : ""} onClick={() => setDay(d)}>{d}</button>
              ))}
            </div>
            <button className="btn btn-secondary btn-sm"><Icon name="calendar" size={12} /> Date range</button>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", padding: "10px 0" }}>
          {/* Hour ticks */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            {["00","02","04","06","08","10","12","14","16","18","20","22","24"].map(h => (
              <div key={h} className="muted tabular" style={{ fontSize: 9.5 }}>{h}</div>
            ))}
          </div>
          {/* Density bar */}
          <div style={{ position: "relative", height: 56, background: "rgb(var(--bg-sunken))", borderRadius: 10, overflow: "hidden" }}>
            {Array.from({ length: 96 }).map((_, i) => {
              const x = i / 96;
              // simulated density: low at night, peak mid-morning and afternoon
              let v;
              if (x < 0.33 || x > 0.85) v = Math.random() * 0.15;
              else if (x > 0.5 && x < 0.55) v = 0.3 + Math.random() * 0.2; // lunch
              else v = 0.4 + Math.random() * 0.55;
              const inLive = x * 100 <= scrub;
              return (
                <div key={i} style={{
                  position: "absolute", bottom: 0,
                  left: `${(i / 96) * 100}%`, width: `${100 / 96}%`,
                  height: `${v * 100}%`,
                  background: inLive ? "rgb(var(--accent))" : "rgb(var(--accent) / 0.25)",
                }} />
              );
            })}
            {/* Scrubber */}
            <div style={{
              position: "absolute", top: -4, bottom: -4, left: `${scrub}%`,
              width: 2, background: "rgb(var(--fg))",
            }} />
            <div style={{
              position: "absolute", top: -22, left: `calc(${scrub}% - 22px)`,
              background: "rgb(var(--fg))", color: "rgb(var(--bg))",
              padding: "2px 7px", borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "var(--font-mono)",
            }}>
              {hour}:{minute}
            </div>
          </div>
          <input type="range" min="0" max="100" step="0.1" value={scrub}
                 onChange={e => setScrub(parseFloat(e.target.value))}
                 style={{ width: "100%", marginTop: 8, accentColor: "rgb(var(--accent))" }} />
        </div>

        <div className="between" style={{ marginTop: 10 }}>
          <div className="center gap-2">
            <button className="btn btn-secondary btn-icon" onClick={() => setScrub(s => Math.max(0, s - 5))}><Icon name="rewind" size={13} /></button>
            <button className="btn btn-primary btn-icon" onClick={() => setPlaying(p => !p)}><Icon name={playing ? "pause" : "play"} size={14} /></button>
            <button className="btn btn-secondary btn-icon" onClick={() => setScrub(s => Math.min(100, s + 5))}><Icon name="fast-forward" size={13} /></button>
            <span className="muted" style={{ fontSize: 11, marginLeft: 6 }}>1× speed</span>
          </div>
          <div className="muted tabular" style={{ fontSize: 11.5 }}>
            <span className="mono" style={{ fontWeight: 600, color: "rgb(var(--fg))" }}>1,247</span> events on {day} · cursor at <span className="mono" style={{ fontWeight: 600, color: "rgb(var(--fg))" }}>{hour}:{minute}</span>
          </div>
        </div>
      </div>

      {/* Filter bar + results */}
      <div className="grid" style={{ gridTemplateColumns: "260px 1fr" }}>
        {/* Filters */}
        <div className="surface" style={{ padding: 14, borderRadius: 16 }}>
          <div className="micro" style={{ marginBottom: 10 }}>Filters</div>

          <FilterGroup label="Event type">
            {[
              { l: "All events", c: 1247, on: true },
              { l: "Syncs",      c: 384, on: false },
              { l: "Saves",      c: 412, on: false },
              { l: "Opens",      c: 188, on: false },
              { l: "Warnings",   c: 92, on: false },
              { l: "Errors",     c: 16, on: false },
              { l: "Clashes",    c: 65, on: false },
              { l: "Teams",      c: 38, on: false },
            ].map(o => (
              <CheckRow key={o.l} {...o} />
            ))}
          </FilterGroup>

          <div className="divider" style={{ margin: "14px 0" }} />

          <FilterGroup label="Project">
            {D.projects.slice(0, 5).map(p => (
              <CheckRow key={p.code} l={p.code} c={Math.floor(Math.random()*200+50)} on={false} />
            ))}
          </FilterGroup>

          <div className="divider" style={{ margin: "14px 0" }} />

          <FilterGroup label="Employee">
            {D.people.slice(0, 5).map(p => (
              <CheckRow key={p.id} l={p.name} c={Math.floor(Math.random()*80+10)} on={false} />
            ))}
          </FilterGroup>
        </div>

        {/* Results */}
        <div className="surface" style={{ padding: 0, borderRadius: 16, overflow: "hidden" }}>
          <div className="between" style={{ padding: "12px 14px", borderBottom: "1px solid rgb(var(--hairline))" }}>
            <CardTitle title="Results" subtitle="1,247 events · Today · all filters applied" icon="list" />
            <div className="center gap-2">
              <button className="btn btn-secondary btn-sm"><Icon name="arrow-up-down" size={11} /> Newest</button>
              <button className="btn btn-secondary btn-sm"><Icon name="download" size={11} /> CSV</button>
              <button className="btn btn-secondary btn-sm"><Icon name="file-text" size={11} /> PDF</button>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr><th>Time</th><th>Event</th><th>Employee</th><th>Project</th><th>Detail</th><th>Machine</th></tr>
            </thead>
            <tbody>
              {activity.map(a => {
                const k = D.eventKinds[a.kind];
                const user = a.user && a.user !== "—" ? D.byId(a.user) : null;
                return (
                  <tr key={a.id}>
                    <td className="mono tabular" style={{ fontSize: 11 }}>
                      {(() => {
                        const t = new Date(Date.now() - a.t * 60 * 1000);
                        return t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                      })()}
                    </td>
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
                    <td>
                      {user ? (
                        <div className="center gap-2">
                          <Avatar name={user.name} initials={user.initials} size={20} discipline={user.discipline} status={user.status} />
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{user.name}</span>
                        </div>
                      ) : <span className="muted">System</span>}
                    </td>
                    <td>{a.project === "—" ? <span className="muted">—</span> : <span className="code-pill">{a.project}</span>}</td>
                    <td className="muted" style={{ fontSize: 11.5 }}>{a.detail}</td>
                    <td className="mono muted" style={{ fontSize: 10.5 }}>{user?.machine || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="between" style={{ padding: "10px 14px", borderTop: "1px solid rgb(var(--hairline))" }}>
            <span className="muted" style={{ fontSize: 11.5 }}>Showing 1 – {activity.length} of 1,247</span>
            <div className="center gap-1">
              <button className="btn btn-ghost btn-sm" disabled>Prev</button>
              <button className="btn btn-secondary btn-sm">1</button>
              <button className="btn btn-ghost btn-sm">2</button>
              <button className="btn btn-ghost btn-sm">3</button>
              <span className="muted">…</span>
              <button className="btn btn-ghost btn-sm">68</button>
              <button className="btn btn-ghost btn-sm">Next</button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

function FilterGroup({ label, children }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.06, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{children}</div>
    </div>
  );
}

function CheckRow({ l, c, on }) {
  const [checked, setChecked] = React.useState(on);
  return (
    <label className="row-hover" style={{
      display: "flex", alignItems: "center", gap: 9,
      padding: "6px 8px", borderRadius: 8, cursor: "pointer", fontSize: 11.5,
    }}>
      <span style={{
        height: 14, width: 14, borderRadius: 4,
        background: checked ? "rgb(var(--accent))" : "rgb(var(--bg-elev))",
        border: `1px solid rgb(var(--${checked ? "accent" : "border-strong"}))`,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {checked && <Icon name="check" size={9} color="white" strokeWidth={3} />}
      </span>
      <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} style={{ display: "none" }} />
      <span className="truncate" style={{ flex: 1 }}>{l}</span>
      <span className="tabular muted" style={{ fontSize: 10.5 }}>{c}</span>
    </label>
  );
}
