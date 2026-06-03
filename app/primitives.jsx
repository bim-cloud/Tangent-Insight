/* Tangent Insight — primitives (icons, mini-charts, pills, etc.) */

window.Icon = function Icon({ name, size = 16, color, strokeWidth = 1.8, className = "", style = {} }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.setAttribute("data-lucide", name);
      ref.current.innerHTML = "";
      window.lucide.createIcons({
        attrs: { width: size, height: size, "stroke-width": strokeWidth },
        nodes: [ref.current],
      });
    }
  }, [name, size, strokeWidth]);
  return (
    <i
      ref={ref}
      data-lucide={name}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        color: color || "currentColor",
        flexShrink: 0,
        ...style,
      }}
    />
  );
};

window.Avatar = function Avatar({ name, initials, size = 28, discipline, status, src }) {
  const ringClass =
    discipline === "DETAILER" ? "ring-detailer" :
    status === "online" ? "ring-online" :
    status === "offline" ? "ring-offline" : "";
  const colorSeed = (initials || name || "").charCodeAt(0) % 5;
  const grads = [
    "linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-2)))",
    "linear-gradient(135deg, #22D3EE, #3B82F6)",
    "linear-gradient(135deg, #A78BFA, #A855F7)",
    "linear-gradient(135deg, #34D399, #14B8A6)",
    "linear-gradient(135deg, #FBBF24, #F97316)",
  ];
  return (
    <div
      className={`avatar ${ringClass}`}
      style={{
        height: size,
        width: size,
        fontSize: Math.max(9, size * 0.38),
        background: grads[colorSeed],
      }}
      title={name}
    >
      {initials || (name ? name[0] : "?")}
    </div>
  );
};

window.AvatarStack = function AvatarStack({ users, max = 4, size = 22 }) {
  const D = window.TI_DATA;
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      {shown.map((id, i) => {
        const p = typeof id === "string" ? D.byId(id) : id;
        if (!p) return null;
        return (
          <div key={i} style={{ marginLeft: i ? -6 : 0, position: "relative", zIndex: max - i }}>
            <Avatar name={p.name} initials={p.initials} size={size} discipline={p.discipline} status={p.status} />
          </div>
        );
      })}
      {extra > 0 && (
        <div style={{
          marginLeft: -6,
          height: size, width: size, borderRadius: 9999,
          background: "rgb(var(--bg-sunken))",
          border: "1px solid rgb(var(--card))",
          color: "rgb(var(--fg-muted))",
          fontSize: 10, fontWeight: 600,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>+{extra}</div>
      )}
    </div>
  );
};

/* ===== Pills ===== */
window.Pill = function Pill({ tone = "neutral", children, dot, icon }) {
  return (
    <span className={`pill pill-${tone}`}>
      {dot && <span className="dot" style={{ background: "currentColor" }} />}
      {icon && <Icon name={icon} size={10} strokeWidth={2.2} />}
      {children}
    </span>
  );
};

window.HealthPill = function HealthPill({ health }) {
  const m = {
    ON_TRACK: { tone: "success", label: "On track" },
    DELAY:    { tone: "warning", label: "Delayed" },
    CRITICAL: { tone: "danger",  label: "Critical" },
  }[health] || { tone: "neutral", label: health };
  return <Pill tone={m.tone} dot>{m.label}</Pill>;
};

window.StagePill = function StagePill({ stage }) {
  const m = window.TI_DATA.stages[stage] || { label: stage, color: "#64748B" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 10, fontWeight: 600, letterSpacing: 0.04,
      padding: "2px 7px", borderRadius: 9999, textTransform: "uppercase",
      background: m.color + "22", color: m.color, border: "1px solid " + m.color + "55",
    }}>
      <span className="dot" style={{ background: m.color }} />
      {m.label}
    </span>
  );
};

window.LiveDot = function LiveDot({ tone = "" }) {
  return <span className={`live-dot ${tone}`} />;
};

/* ===== Sparkline ===== */
window.Sparkline = function Sparkline({ data, width = 80, height = 22, color = "currentColor", fill = true, strokeWidth = 1.6 }) {
  if (!data || !data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => [i * stepX, height - 2 - ((v - min) / range) * (height - 4)]);
  const d = points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("");
  const area = `${d} L${width},${height} L0,${height} Z`;
  const id = "sg-" + (data.join("") + width).replace(/[^0-9a-z]/gi, "").slice(0, 12);
  return (
    <svg className="spark" viewBox={`0 0 ${width} ${height}`} width={width} height={height} preserveAspectRatio="none">
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.35" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${id})`} />
        </>
      )}
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length-1][0]} cy={points[points.length-1][1]} r={2.2} fill={color} />
    </svg>
  );
};

/* ===== Counter ===== */
window.Counter = function Counter({ value, duration = 0.9, format = (n) => Math.floor(n).toLocaleString() }) {
  const [n, setN] = React.useState(value || 0);
  const prev = React.useRef(value || 0);
  React.useEffect(() => {
    if (value === prev.current) return;
    const start = prev.current;
    const delta = value - start;
    let raf, t0 = null;
    let cancelled = false;
    // Safety net: if rAF doesn't fire (throttled background tab), set instantly after a short delay
    const safetyTimer = setTimeout(() => { if (!cancelled) { setN(value); prev.current = value; } }, 1200);
    const step = ts => {
      if (cancelled) return;
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setN(start + delta * ease);
      if (p < 1) raf = requestAnimationFrame(step);
      else { prev.current = value; clearTimeout(safetyTimer); }
    };
    raf = requestAnimationFrame(step);
    return () => { cancelled = true; cancelAnimationFrame(raf); clearTimeout(safetyTimer); };
  }, [value, duration]);
  return <>{format(n)}</>;
};

/* ===== KPI Card ===== */
window.KPICard = function KPICard({ k, onNavigate }) {
  const positive = k.trend === "up";
  const isGood = k.key === "overtime" || k.key === "clashes" ? (k.delta < 0) : (k.delta > 0);
  const [pressed, setPressed] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const magRef = window.useMagnetic ? window.useMagnetic(0.18) : React.useRef(null);

  // KPI -> destination tab
  const ROUTE = {
    projects: "revit",     // Active Revit Projects -> Project Monitoring
    online:   "live",      // Users Online Now -> Live Users
    meeting:  "teams",     // In Teams Meetings -> Teams Activity
    hours:    "analytics", // Active Work Hours -> Work Analytics
    overtime: "reports",   // Overtime -> Overtime Analytics (Reports)
    staff:    "employees", // Total Staff Tracked -> Employee Overview
  };
  const target = ROUTE[k.key];
  const clickable = !!(target && onNavigate);

  return (
    <div
      ref={magRef}
      className="surface surface-hover kpi-card"
      onClick={clickable ? () => onNavigate(target) : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNavigate(target); } } : undefined}
      style={{
        position: "relative", overflow: "hidden", padding: "var(--pad-card)", borderRadius: 18,
        cursor: clickable ? "pointer" : "default",
        transform: pressed ? "translateY(0) scale(0.978)" : hover && clickable ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 320ms ease",
        boxShadow: hover && clickable ? "0 14px 30px -12px rgb(0 0 0 / 0.22)" : undefined,
        willChange: "transform",
      }}
    >
      <div style={{
        position: "absolute", top: -40, right: -40, height: 110, width: 110,
        borderRadius: 9999, background: k.grad, opacity: hover && clickable ? 0.26 : 0.15,
        filter: "blur(28px)", transition: "opacity 320ms ease",
      }} />
      <div style={{ position: "relative" }}>
        <div className="between" style={{ marginBottom: 10 }}>
          <div style={{
            display: "inline-flex", height: 32, width: 32, borderRadius: 10,
            alignItems: "center", justifyContent: "center", background: k.grad,
            color: "#fff", boxShadow: "0 4px 10px -2px rgb(0 0 0 / 0.12)",
            transform: hover && clickable ? "scale(1.08) rotate(-3deg)" : "scale(1)",
            transition: "transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
            <Icon name={k.icon} size={16} strokeWidth={2.2} />
          </div>
          <Sparkline data={k.spark} width={72} height={24} color={isGood ? "rgb(var(--success))" : "rgb(var(--danger))"} strokeWidth={1.5} />
        </div>
        <div className="tabular" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          <Counter value={k.value} />
        </div>
        <div className="between" style={{ marginTop: 4, gap: 6 }}>
          <div className="muted" style={{ fontSize: 11, lineHeight: 1.25, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.label}</div>
          {clickable && (
            <div style={{
              fontSize: 11, fontWeight: 600, color: "rgb(var(--accent))",
              display: "inline-flex", alignItems: "center", gap: 2,
              opacity: hover ? 1 : 0, transform: hover ? "translateX(0)" : "translateX(-4px)",
              transition: "opacity 220ms ease, transform 220ms ease",
            }}>
              Open <Icon name="arrow-right" size={11} strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===== Progress bar ===== */
window.Progress = function Progress({ value, max = 100, tone, height = 6, showLabel = false, label }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = tone === "danger" ? "rgb(var(--danger))"
              : tone === "warning" ? "rgb(var(--warning))"
              : tone === "success" ? "rgb(var(--success))"
              : "linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-2)))";
  return (
    <div style={{ width: "100%" }}>
      {showLabel && (
        <div className="between" style={{ marginBottom: 4 }}>
          <span className="micro">{label}</span>
          <span className="tabular muted" style={{ fontSize: 11 }}>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="progress" style={{ height }}>
        <i style={{ width: pct + "%", background: color }} />
      </div>
    </div>
  );
};

/* ===== Bar chart (vertical) ===== */
window.BarChart = function BarChart({ data, height = 200, gradient = true }) {
  const W = 600, H = height, pad = 28;
  const max = Math.max(...data.flatMap(d => [d.a || 0, d.b || 0])) * 1.05 || 1;
  const bw = (W - pad * 2) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      <defs>
        <linearGradient id="bcg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--accent))" stopOpacity="0.95" />
          <stop offset="1" stopColor="rgb(var(--accent))" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={pad} x2={W - pad} y1={H - pad - (H - pad * 2) * f} y2={H - pad - (H - pad * 2) * f} stroke="rgb(var(--border))" strokeDasharray="2 3" />
      ))}
      {data.map((d, i) => {
        const x = pad + i * bw + bw * 0.25;
        const w = bw * 0.5;
        const ha = ((H - pad * 2) * (d.a / max));
        const hb = ((H - pad * 2) * (d.b / max));
        const isOver = d.b > d.a;
        return (
          <g key={d.name}>
            <rect x={x - 3} y={H - pad - ha} width={w / 2} height={ha} rx={3} fill="rgb(var(--border))" />
            <rect x={x + w / 2 + 1} y={H - pad - hb} width={w / 2} height={hb} rx={3} fill={isOver ? "rgb(var(--danger))" : (gradient ? "url(#bcg)" : "rgb(var(--accent))")} />
            <text x={x + w / 2} y={H - 10} textAnchor="middle" fontSize="10" fill="rgb(var(--fg-muted))" fontFamily="Inter">{d.name}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ===== Donut chart ===== */
window.Donut = function Donut({ data, size = 180, thickness = 22, label, centerLabel }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = size / 2 - 4, r = R - thickness;
  const cx = size / 2, cy = size / 2;
  let a0 = -Math.PI / 2;
  const arcs = data.map((d) => {
    const a1 = a0 + (d.value / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = [
      cx + R * Math.cos(a0), cy + R * Math.sin(a0),
      cx + R * Math.cos(a1), cy + R * Math.sin(a1),
      cx + r * Math.cos(a1), cy + r * Math.sin(a1),
      cx + r * Math.cos(a0), cy + r * Math.sin(a0),
    ];
    const d_ = `M${p[0]} ${p[1]} A${R} ${R} 0 ${large} 1 ${p[2]} ${p[3]} L${p[4]} ${p[5]} A${r} ${r} 0 ${large} 0 ${p[6]} ${p[7]} Z`;
    a0 = a1;
    return { d: d_, color: d.color };
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} />)}
      {centerLabel && (
        <>
          <text x={cx} y={cy - 2} textAnchor="middle" fontSize="22" fontWeight="700" fill="rgb(var(--fg))" fontFamily="Inter">{centerLabel}</text>
          {label && <text x={cx} y={cy + 16} textAnchor="middle" fontSize="9.5" fill="rgb(var(--fg-muted))" fontFamily="Inter" letterSpacing="0.08em">{label}</text>}
        </>
      )}
    </svg>
  );
};

/* ===== Line chart (multi-series) ===== */
window.MultiLine = function MultiLine({ series, labels, height = 200, yMax = 100 }) {
  const W = 760, H = height, pad = { l: 30, r: 14, t: 12, b: 24 };
  const n = labels.length;
  const sx = (i) => pad.l + (i * (W - pad.l - pad.r)) / (n - 1);
  const sy = (v) => H - pad.b - (v / yMax) * (H - pad.t - pad.b);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      {[0, 25, 50, 75, 100].map(v => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={sy(v)} y2={sy(v)} stroke="rgb(var(--border))" strokeDasharray="2 3" />
          <text x={6} y={sy(v) + 3} fontSize="9" fill="rgb(var(--fg-faint))" fontFamily="Inter">{v}</text>
        </g>
      ))}
      {series.map((s, k) => {
        const pts = s.values.map((v, i) => [sx(i), sy(v)]);
        const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
        return (
          <g key={k}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.5} fill={s.color} />
          </g>
        );
      })}
      {labels.map((l, i) => (
        <text key={i} x={sx(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="rgb(var(--fg-faint))" fontFamily="Inter">{l}</text>
      ))}
    </svg>
  );
};

/* ===== Heatmap ===== */
window.Heatmap = function Heatmap({ data, days, hours }) {
  const cell = 24, gap = 3;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap }}>
      <div style={{ display: "flex", marginLeft: 28, gap }}>
        {hours.map(h => (
          <div key={h} style={{ width: cell, textAlign: "center", fontSize: 9.5, color: "rgb(var(--fg-faint))" }}>{h}</div>
        ))}
      </div>
      {days.map((day, d) => (
        <div key={day} style={{ display: "flex", alignItems: "center", gap }}>
          <div style={{ width: 24, fontSize: 10, color: "rgb(var(--fg-muted))", textTransform: "uppercase", letterSpacing: 0.04, fontWeight: 600 }}>{day}</div>
          {hours.map((h, hi) => {
            const v = (data.find(x => x.d === d && x.h === hi) || { v: 0 }).v;
            const alpha = 0.08 + v * 0.85;
            return (
              <div key={h} title={`${day} ${h}:00 — ${Math.round(v * 100)}%`} style={{
                width: cell, height: cell, borderRadius: 5,
                background: `rgb(var(--accent) / ${alpha.toFixed(2)})`,
                border: "1px solid rgb(var(--border) / 0.5)",
              }} />
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ===== Waveform (live audio-style monitor) ===== */
window.Waveform = function Waveform({ bars = 40, height = 28, color = "rgb(var(--accent))", speed = 1, active = true }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTick(t => t + 1), 120 / speed);
    return () => clearInterval(id);
  }, [speed, active]);
  const arr = React.useMemo(() => {
    return Array.from({ length: bars }).map((_, i) => {
      const seed = Math.sin((i * 7 + tick) * 0.7) * 0.5 + 0.5;
      const seed2 = Math.sin((i * 3 + tick * 1.3) * 0.4) * 0.5 + 0.5;
      return 0.15 + (seed * 0.6 + seed2 * 0.4) * 0.85;
    });
  }, [tick, bars]);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 2, height }}>
      {arr.map((v, i) => (
        <div key={i} style={{
          width: 3, height: Math.max(2, v * height),
          background: color, borderRadius: 9999,
          opacity: 0.6 + v * 0.4,
          transition: "height 0.15s ease",
        }} />
      ))}
    </div>
  );
};

/* ===== Mini iso wireframe (BIM motif) ===== */
window.WireframeMotif = function WireframeMotif({ size = 56, color = "rgb(var(--accent))" }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="1" strokeLinejoin="round">
      <g opacity="0.7">
        <path d="M32 8 L56 22 L56 42 L32 56 L8 42 L8 22 Z" />
        <path d="M32 8 L32 32" />
        <path d="M8 22 L32 32 L56 22" />
        <path d="M8 42 L32 32 L56 42" />
        <path d="M32 32 L32 56" />
      </g>
      <g opacity="0.4">
        <path d="M20 15 L20 35 L8 42" />
        <path d="M44 15 L44 35 L56 42" />
      </g>
    </svg>
  );
};

/* ===== Card title row ===== */
window.CardTitle = function CardTitle({ title, subtitle, icon, right, live }) {
  return (
    <div className="between" style={{ marginBottom: 12, gap: 10 }}>
      <div className="center gap-3" style={{ minWidth: 0 }}>
        {icon && (
          <div style={{
            height: 28, width: 28, borderRadius: 8,
            background: "rgb(var(--accent) / 0.12)", color: "rgb(var(--accent))",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Icon name={icon} size={15} strokeWidth={2.1} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div className="center gap-2" style={{ whiteSpace: "nowrap" }}>
            <h3 className="h3" style={{ whiteSpace: "nowrap" }}>{title}</h3>
            {live && <LiveDot />}
          </div>
          {subtitle && <div className="muted" style={{ fontSize: 11.5, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>{right}</div>
    </div>
  );
};

/* ===== Time formatter ===== */
window.fmtTime = function (ms = Date.now()) {
  const d = new Date(ms);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

/* Export to scope */
Object.assign(window, {
  Icon: window.Icon, Avatar: window.Avatar, AvatarStack: window.AvatarStack,
  Pill: window.Pill, HealthPill: window.HealthPill, StagePill: window.StagePill,
  LiveDot: window.LiveDot, Sparkline: window.Sparkline, Counter: window.Counter,
  KPICard: window.KPICard, Progress: window.Progress, BarChart: window.BarChart,
  Donut: window.Donut, MultiLine: window.MultiLine, Heatmap: window.Heatmap,
  Waveform: window.Waveform, WireframeMotif: window.WireframeMotif,
  CardTitle: window.CardTitle, fmtTime: window.fmtTime,
});
