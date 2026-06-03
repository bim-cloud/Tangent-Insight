/* Tangent Insight — Microsoft Teams Activity Monitor */

window.TeamsScreen = function TeamsScreen({ activity, setRoute, setSelectedEmployee }) {
  const D = window.TI_DATA;
  const acts = activity || D.initialActivity || [];

  // ---- Real signals from live data ----
  const inMeetingPeople = D.people.filter(p => p.status === "meeting");
  const teamsEvents     = acts.filter(a => a.kind === "teams");
  const callsToday      = teamsEvents.length;
  const meetingHoursEst = (teamsEvents.length * 20 / 60).toFixed(1);  // ~20 min/event

  // Presence donut from live people (replaces fake "42 / 28 / 9 / 1 / 4")
  const presence = {
    available: D.people.filter(p => p.status === "online").length,
    inCall:    inMeetingPeople.length,
    idle:      D.people.filter(p => p.status === "idle").length,
    offline:   D.people.filter(p => p.status === "offline").length,
    total:     D.people.length,
  };

  // Per-person teams-event counts (replaces fake "Top collaborators · 14.5h, 11.2h...")
  const collabCounts = {};
  teamsEvents.forEach(e => { if (e.user) collabCounts[e.user] = (collabCounts[e.user] || 0) + 1; });
  const topCollabs = Object.keys(collabCounts)
    .map(id => ({ p: D.byId(id), n: collabCounts[id] }))
    .filter(r => r.p)
    .sort((a, b) => b.n - a.n)
    .slice(0, 6);

  return (
    <PageShell>
      {/* KPI strip — only signals the agent can actually source */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <SmallKpi icon="users" label="In a Teams call · now" value={inMeetingPeople.length} tone="info" />
        <SmallKpi icon="phone" label="Teams events · today" value={callsToday} tone="accent" />
        <SmallKpi icon="clock" label="Meeting time · est." value={meetingHoursEst + "h"} tone="accent" />
        <SmallKpi icon="user-check" label="Available now" value={presence.available} tone="success" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        {/* LEFT: Who is in a Teams call right now (real, derived from people.status=meeting) */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="In a Teams call · right now" subtitle={inMeetingPeople.length + " staff currently in a call"} icon="video" live />
          {inMeetingPeople.length === 0 ? (
            <div className="muted" style={{ fontSize: 12.5, padding: 14, textAlign: "center" }}>
              No one is in a Teams call right now. As staff join calls their agent reports the meeting state and they appear here in real time.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {inMeetingPeople.map(p => (
                <div key={p.id}
                     className="row-hover click"
                     onClick={() => { if (setSelectedEmployee) setSelectedEmployee(p.id); if (setRoute) setRoute("employees"); }}
                     style={{ padding: "10px 12px", borderRadius: 12,
                              border: "1px solid rgb(var(--accent-2) / 0.25)",
                              background: "rgb(var(--accent-2) / 0.04)",
                              display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <Avatar name={p.name} initials={p.initials} size={36} discipline={p.discipline} status={p.status} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>
                      {p.role} · <span className="mono">{p.project === "—" ? "no project" : p.project}</span>
                    </div>
                  </div>
                  <Pill tone="info" dot>In a call</Pill>
                </div>
              ))}
            </div>
          )}

          {/* Recent Teams events feed (real) */}
          <div className="micro" style={{ margin: "18px 0 8px" }}>Recent Teams events</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {teamsEvents.length === 0
              ? <div className="muted" style={{ fontSize: 12, padding: 8 }}>No Teams events captured yet today.</div>
              : teamsEvents.slice(0, 8).map(a => <window.FeedItem key={a.id} item={a} />)}
          </div>
        </div>

        {/* RIGHT: charts that are computable from real data */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Events by day-of-week */}
          <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
            <CardTitle title="Teams events by day" subtitle="Last 7 days · from agent" icon="bar-chart-3" />
            <BarChart
              height={170}
              data={(() => {
                const labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
                const counts = [0,0,0,0,0,0,0];
                teamsEvents.forEach(a => {
                  if (!a.at) return;
                  const dow = (new Date(a.at).getDay() + 6) % 7;
                  counts[dow]++;
                });
                return labels.map((n, i) => ({ name: n, a: counts[i], b: counts[i] }));
              })()}
            />
            <div className="divider" style={{ margin: "10px 0" }} />
            <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              <MiniMeta label="Events · today" value={callsToday} />
              <MiniMeta label="In call now"    value={inMeetingPeople.length} />
              <MiniMeta label="People active"  value={topCollabs.length} />
            </div>
          </div>

          {/* Top staff by Teams events (replaces hard-coded "14.5h / 11.2h" hours) */}
          <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
            <CardTitle title="Most Teams activity · feed window" subtitle="By events captured" icon="award" />
            {topCollabs.length === 0 ? (
              <div className="muted" style={{ fontSize: 12, padding: 8 }}>No Teams events from staff yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {topCollabs.map((r, i) => (
                  <div key={r.p.id} className="center gap-3 row-hover click"
                       onClick={() => { if (setSelectedEmployee) setSelectedEmployee(r.p.id); if (setRoute) setRoute("employees"); }}
                       style={{ padding: "4px 6px", borderRadius: 8, cursor: "pointer" }}>
                    <div className="tabular" style={{ width: 16, fontSize: 11, fontWeight: 700, color: "rgb(var(--fg-muted))" }}>{i + 1}</div>
                    <Avatar name={r.p.name} initials={r.p.initials} size={26} discipline={r.p.discipline} status={r.p.status} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600 }}>{r.p.name}</div>
                      <div className="muted" style={{ fontSize: 10.5 }}>{r.p.role}</div>
                    </div>
                    <div className="tabular" style={{ fontSize: 12, fontWeight: 600 }}>{r.n} ev</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Presence distribution from real people */}
          <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
            <CardTitle title="Presence distribution" subtitle={"Tangent firm · " + presence.total + " staff"} icon="circle-dot" />
            <div className="center" style={{ justifyContent: "space-around", padding: "10px 0" }}>
              <Donut size={140} thickness={16}
                centerLabel={String(presence.total)} label="TOTAL"
                data={[
                  { value: presence.available, color: "rgb(var(--success))" },
                  { value: presence.inCall,    color: "rgb(var(--accent-2))" },
                  { value: presence.idle,      color: "rgb(var(--warning))" },
                  { value: presence.offline,   color: "rgb(var(--fg-faint))" },
                ]}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <PresenceRow color="rgb(var(--success))"   label="Available"   v={presence.available} />
                <PresenceRow color="rgb(var(--accent-2))"  label="In a call"   v={presence.inCall} />
                <PresenceRow color="rgb(var(--warning))"   label="Away / idle" v={presence.idle} />
                <PresenceRow color="rgb(var(--fg-faint))"  label="Offline"     v={presence.offline} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

function LiveMeetingCard({ m }) {
  const D = window.TI_DATA;
  const org = D.byId(m.organizer);
  const attendees = D.people.slice(0, m.attendees);
  return (
    <div style={{
      padding: 14, borderRadius: 14,
      background: "linear-gradient(135deg, rgb(var(--accent) / 0.06), rgb(var(--accent-2) / 0.04))",
      border: "1px solid rgb(var(--accent) / 0.25)",
    }}>
      <div className="between" style={{ marginBottom: 10 }}>
        <div className="center gap-3">
          <div style={{
            height: 38, width: 38, borderRadius: 11,
            background: "rgb(var(--accent))", color: "white",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 16px -4px rgb(var(--accent) / 0.45)",
          }}>
            <Icon name="video" size={17} />
          </div>
          <div>
            <div className="center gap-2">
              <LiveDot />
              <span className="micro" style={{ color: "rgb(var(--success))", fontWeight: 700 }}>LIVE · {m.duration}m elapsed</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{m.title}</div>
          </div>
        </div>
        <div className="center gap-2">
          <button className="btn btn-secondary btn-sm"
                  onClick={() => { window.open("https://teams.microsoft.com/l/chat/0/0", "_blank"); }}>
            <Icon name="message-square" size={12} /> Chat
          </button>
          <button className="btn btn-primary btn-sm"
                  onClick={() => { window.open("https://teams.microsoft.com/l/meeting/new", "_blank"); }}>
            <Icon name="phone" size={12} /> Open Teams
          </button>
        </div>
      </div>
      <div className="between">
        <div className="center gap-3">
          <AvatarStack users={attendees.map(a => a.id)} size={22} max={5} />
          <span className="muted" style={{ fontSize: 11.5 }}>{m.attendees} attendees · organized by {org?.name}</span>
        </div>
        {m.project !== "—" && (
          <div className="center gap-2">
            <span className="muted" style={{ fontSize: 11 }}>Linked project</span>
            <span className="code-pill">{m.project}</span>
          </div>
        )}
      </div>
      <div className="divider" style={{ margin: "12px 0 10px" }} />
      <div className="center gap-3">
        <Waveform bars={28} height={20} color="rgb(var(--accent))" speed={1.4} />
        <span className="muted tabular" style={{ fontSize: 11 }}>3 cameras on · 2 sharing screen</span>
        <div style={{ flex: 1 }} />
        <span className="muted mono" style={{ fontSize: 10.5 }}>Started {m.start}</span>
      </div>
    </div>
  );
}

function SmallKpi({ icon, label, value, tone = "default", delta }) {
  const c = tone === "success" ? "rgb(var(--success))"
          : tone === "warning" ? "rgb(var(--warning))"
          : tone === "danger"  ? "rgb(var(--danger))"
          : tone === "info"    ? "rgb(var(--info))"
          : tone === "accent"  ? "rgb(var(--accent))"
          : "rgb(var(--fg))";
  return (
    <div className="surface" style={{ padding: 14, borderRadius: 14 }}>
      <div className="center gap-3">
        <div style={{
          height: 30, width: 30, borderRadius: 8,
          background: c + "1A", color: c,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={icon} size={14} strokeWidth={2.2} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="micro">{label}</div>
          <div className="between">
            <div className="tabular" style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
            {delta && <span className="tabular" style={{ fontSize: 11, fontWeight: 600, color: c }}>{delta}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMeta({ label, value }) {
  return (
    <div className="surface-flat" style={{ padding: "8px 10px", borderRadius: 9 }}>
      <div className="micro" style={{ fontSize: 9.5 }}>{label}</div>
      <div className="tabular" style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function PresenceRow({ color, label, v }) {
  return (
    <div className="center gap-3" style={{ fontSize: 11.5 }}>
      <span className="dot" style={{ background: color, height: 9, width: 9 }} />
      <span style={{ minWidth: 100 }}>{label}</span>
      <span className="tabular" style={{ fontWeight: 700 }}>{v}</span>
    </div>
  );
}
