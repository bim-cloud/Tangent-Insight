/* Tangent Insight — Sign-in screen */

window.LoginScreen = function LoginScreen() {
  const [mode, setMode] = React.useState("password");        // 'password' | 'magic'
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState({ kind: "idle", msg: "" });

  async function submit(e) {
    e.preventDefault();
    if (!email) { setStatus({ kind: "error", msg: "Enter your work email." }); return; }
    setStatus({ kind: "loading", msg: "Signing in…" });
    const res = mode === "password"
      ? await window.TI_AUTH.signInWithPassword(email.trim(), password)
      : await window.TI_AUTH.signInWithMagicLink(email.trim());
    if (res.error) setStatus({ kind: "error", msg: res.error });
    else if (mode === "magic") setStatus({ kind: "ok", msg: "Check your inbox for the sign-in link." });
    else setStatus({ kind: "idle", msg: "" });
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse 60% 60% at 50% 30%, rgb(var(--accent) / 0.08), transparent 70%)",
      padding: 24,
    }}>
      <div className="surface" style={{ width: "100%", maxWidth: 380, padding: 28, borderRadius: 18 }}>
        <div className="center gap-3" style={{ marginBottom: 18 }}>
          <div style={{
            height: 38, width: 38, borderRadius: 11,
            background: "linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-2)))",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 18px -6px rgb(var(--accent) / 0.5)",
          }}>
            <Icon name="activity" size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Tangent Insight</div>
            <div className="muted" style={{ fontSize: 11.5 }}>BIM intelligence platform</div>
          </div>
        </div>

        <h1 className="h2" style={{ marginTop: 4 }}>Sign in</h1>
        <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
          Use your <span className="mono">tangentlandscape.com</span> email.
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
          <label className="micro">Email</label>
          <input className="input" type="email" autoComplete="email" autoFocus
                 value={email} onChange={e => setEmail(e.target.value)}
                 placeholder="firstname.lastname@tangentlandscape.com" />

          {mode === "password" && (
            <>
              <label className="micro" style={{ marginTop: 4 }}>Password</label>
              <input className="input" type="password" autoComplete="current-password"
                     value={password} onChange={e => setPassword(e.target.value)} />
            </>
          )}

          {status.msg && (
            <div className="muted" style={{
              fontSize: 11.5, padding: "8px 10px", borderRadius: 8,
              background: status.kind === "error" ? "rgb(var(--danger) / 0.08)"
                       : status.kind === "ok"    ? "rgb(var(--success) / 0.08)"
                       : "rgb(var(--bg-sunken))",
              color: status.kind === "error" ? "rgb(var(--danger))"
                  :  status.kind === "ok"    ? "rgb(var(--success))"
                  :  "rgb(var(--fg-soft))",
            }}>{status.msg}</div>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: 6 }}
                  disabled={status.kind === "loading"}>
            {status.kind === "loading"
              ? <><Icon name="loader" size={13} /> Signing in…</>
              : mode === "password"
                  ? <><Icon name="log-in" size={13} /> Sign in</>
                  : <><Icon name="mail" size={13} /> Send magic link</>}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button className="btn btn-ghost btn-sm"
                  onClick={() => { setMode(m => m === "password" ? "magic" : "password"); setStatus({ kind: "idle", msg: "" }); }}>
            {mode === "password" ? "Use a magic link instead" : "Use password instead"}
          </button>
        </div>

        <div className="muted" style={{ fontSize: 10.5, marginTop: 18, textAlign: "center", lineHeight: 1.5 }}>
          Accounts are created by an administrator in Supabase.<br />
          Need access? Contact the BIM team.
        </div>
      </div>
    </div>
  );
};
