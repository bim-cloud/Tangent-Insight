/* Tangent Insight — Microsoft Teams Activity Monitor */

window.TeamsScreen = function TeamsScreen() {
  const D = window.TI_DATA;
  const live = D.meetings.filter(m => m.state === "live");
  const ended = D.meetings.filter(m => m.state === "ended");
  const upcoming = D.meetings.filter(m => m.state === "upcoming");

  return (
    <PageShell>
      {/* KPI strip */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
        <SmallKpi icon="video"       label="Live meetings"     value={live.length} tone="success" />
        <SmallKpi icon="users"       label="In meetings now"   value="13" tone="info" />
        <SmallKpi icon="phone"       label="Calls today"       value="42" delta="+8" />
        <SmallKpi icon="clock"       label="Meeting hours"     value="38.4" tone="accent" />
        <SmallKpi icon="message-square" label="Chat messages"  value="612" tone="muted" />
        <SmallKpi icon="screen-share" label="Screen shares"    value="18" delta="+3" tone="warning" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        {/* Live meetings — featured card */}
        <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
          <CardTitle title="Live meetings · right now" subtitle="2 calls in progress · 13 attendees" icon="video" live />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {live.map(m => <LiveMeetingCard key={m.id} m={m} />)}
          </div>

          {/* Upcoming */}
          <div className="micro" style={{ margin: "18px 0 8px" }}>Upcoming today</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {upcoming.map(m => {
              const org = D.byId(m.organizer);
              return (
                <div key={m.id} className="row-hover" style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgb(var(--hairline))", display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="mono tabular" style={{ fontSize: 12, fontWeight: 600, color: "rgb(var(--fg-soft))", minWidth: 50 }}>{m.start}</div>
                  <Icon name="video" size={13} color="rgb(var(--fg-muted))" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600 }}>{m.title}</div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{m.duration}m · {m.attendees} attendees · organized by {org?.name}</div>
                  </div>
                  <Pill tone="info">Upcoming</Pill>
                </div>
              );
            })}
          </div>

          {/* Recently ended */}
          <div className="micro" style={{ margin: "18px 0 8px" }}>Recently ended</div>
          <table className="table">
            <thead>
              <tr><th>Meeting</th><th>Started</th><th className="tabular">Duration</th><th>Attendees</th><th>Project</th></tr>
            </thead>
            <tbody>
              {ended.map(m => (
                <tr key={m.id}>
                  <td>
                    <div className="center gap-2">
                      <Icon name="video-off" size={12} color="rgb(var(--fg-muted))" />
                      <span style={{ fontWeight: 500 }}>{m.title}</span>
                    </div>
                  </td>
                  <td className="mono tabular">{m.start}</td>
                  <td className="tabular">{m.duration}m</td>
                  <td><AvatarStack users={D.people.slice(0, m.attendees).map(u => u.id)} size={18} max={4} /></td>
                  <td>{m.project === "—" ? <span className="muted">—</span> : <span className="code-pill">{m.project}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column — analytics */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
            <CardTitle title="Meeting hours by day" subtitle="Last 7 days" icon="bar-chart-3" />
            <BarChart
              height={170}
              data={[
                { name: "Mon", a: 24, b: 22 },
                { name: "Tue", a: 24, b: 19 },
                { name: "Wed", a: 24, b: 28 },
                { name: "Thu", a: 24, b: 31 },
                { name: "Fri", a: 24, b: 25 },
                { name: "Sat", a: 24, b: 4  },
                { name: "Sun", a: 24, b: 2  },
              ]}
            />
            <div className="divider" style={{ margin: "10px 0" }} />
            <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              <MiniMeta label="Total / week" value="131h" />
              <MiniMeta label="Avg / call"   value="32m" />
              <MiniMeta label="Top day"      value="Thu" />
            </div>
          </div>

          {/* Top collaborators */}
          <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
            <CardTitle title="Top collaborators · week" subtitle="By meeting hours" icon="award" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {D.people.slice(0, 6).map((p, i) => {
                const hrs = [14.5, 11.2, 9.8, 8.4, 6.1, 5.2][i];
                return (
                  <div key={p.id} className="center gap-3" style={{ padding: "4px 0" }}>
                    <div className="tabular" style={{ width: 16, fontSize: 11, fontWeight: 700, color: "rgb(var(--fg-muted))" }}>{i + 1}</div>
                    <Avatar name={p.name} initials={p.initials} size={26} discipline={p.discipline} status={p.status} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600 }}>{p.name}</div>
                      <div className="muted" style={{ fontSize: 10.5 }}>{p.role}</div>
                    </div>
                    <div className="tabular" style={{ fontSize: 12, fontWeight: 600 }}>{hrs}h</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Presence */}
          <div className="surface" style={{ padding: "var(--pad-card)", borderRadius: 18 }}>
            <CardTitle title="Presence distribution" subtitle="Tangent firm · now" icon="circle-dot" />
            <div className="center" style={{ justifyContent: "space-around", padding: "10px 0" }}>
              <Donut size={140} thickness={16}
                centerLabel="42" label="TOTAL"
                data={[
                  { value: 28, color: "rgb(var(--success))" },
                  { value: 9,  color: "rgb(var(--accent-2))" },
                  { value: 1,  color: "rgb(var(--warning))" },
                  { value: 4,  color: "rgb(var(--fg-faint))" },
                ]}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <PresenceRow color="rgb(var(--success))"   label="Available" v={28} />
                <PresenceRow color="rgb(var(--accent-2))" label="In a call"  v={9} />
                <PresenceRow color="rgb(var(--warning))"  label="Away / idle" v={1} />
                <PresenceRow color="rgb(var(--fg-faint))" label="Offline"     v={4} />
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
          <button className="btn btn-secondary btn-sm"><Icon name="message-square" size={12} /> Chat</button>
          <button className="btn btn-primary btn-sm"><Icon name="phone" size={12} /> Join</button>
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
