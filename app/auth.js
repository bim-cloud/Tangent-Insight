/* ============================================================================
 * Tangent Insight — Supabase Auth (no-build version)
 *
 * Talks directly to Supabase's GoTrue REST API. No npm/bundler needed.
 * Persists the session in localStorage so reloads don't kick the user out.
 *
 * Public API on window.TI_AUTH:
 *   getSession()           -> { user, access_token, refresh_token } | null
 *   onChange(cb)           -> subscribe to session changes
 *   signInWithPassword(email, password) -> { error? }
 *   signInWithMagicLink(email)          -> { error? }
 *   signOut()              -> void
 *
 * Configure: enable Email auth in your Supabase dashboard → Authentication →
 * Providers, and add your Vercel URL to Authentication → URL Configuration →
 * Site URL and Redirect URLs. Then create users in Authentication → Users (or
 * let them sign up — but for an internal tool, manual user creation is safer).
 * ========================================================================== */
(function () {
  "use strict";

  function cfg() {
    return window.TI_SUPABASE || { url: "", anon: "" };
  }
  function key() { return "ti.auth." + (cfg().url || ""); }

  function load() {
    try { return JSON.parse(localStorage.getItem(key()) || "null"); } catch (e) { return null; }
  }
  function save(s) {
    try { s ? localStorage.setItem(key(), JSON.stringify(s)) : localStorage.removeItem(key()); } catch (e) {}
  }

  var session = load();
  var listeners = [];
  function emit() { listeners.forEach(function (cb) { try { cb(session); } catch (e) {} }); }

  function api(path, body, method) {
    var c = cfg();
    if (!c.url || !c.anon) return Promise.reject(new Error("Supabase not configured"));
    return fetch(c.url + "/auth/v1/" + path, {
      method: method || "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: c.anon,
        Authorization: "Bearer " + (session && session.access_token || c.anon),
      },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      return r.json().then(function (j) { return r.ok ? j : Promise.reject(j); });
    });
  }

  function setSession(s) {
    session = s && s.access_token ? {
      access_token: s.access_token,
      refresh_token: s.refresh_token,
      user: s.user || (session && session.user),
      expires_at: s.expires_at || (Math.floor(Date.now() / 1000) + (s.expires_in || 3600)),
    } : null;
    save(session);
    emit();
  }

  // Refresh the access token. force=true ignores the expiry check.
  function doRefresh() {
    if (!session || !session.refresh_token) return Promise.resolve(null);
    return api("token?grant_type=refresh_token", { refresh_token: session.refresh_token })
      .then(function (r) { setSession(r); return session; })
      .catch(function () { setSession(null); return null; });
  }
  function refreshIfNeeded(force) {
    if (!session || !session.refresh_token) return Promise.resolve(session);
    var now = Math.floor(Date.now() / 1000);
    if (!force && session.expires_at && session.expires_at - now > 120) return Promise.resolve(session);
    return doRefresh();
  }

  // Periodic background refresh so a long-open tab never carries a stale token.
  setInterval(function () { refreshIfNeeded(false); }, 60 * 1000);

  window.TI_AUTH = {
    getSession: function () { return session; },
    onChange: function (cb) { listeners.push(cb); return function () { listeners = listeners.filter(function (x) { return x !== cb; }); }; },
    // Screens await this before any authenticated write so the token is fresh —
    // fixes "JWT expired" on Save after the tab has idled.
    getValidToken: function () {
      return refreshIfNeeded(false).then(function (s) { return s ? s.access_token : null; });
    },
    signInWithPassword: function (email, password) {
      return api("token?grant_type=password", { email: email, password: password })
        .then(function (r) { setSession(r); return {}; })
        .catch(function (e) { return { error: e.error_description || e.msg || e.message || "Sign-in failed" }; });
    },
    signInWithMagicLink: function (email) {
      return api("otp", { email: email, create_user: false,
                          email_redirect_to: location.origin + location.pathname })
        .then(function () { return {}; })
        .catch(function (e) { return { error: e.error_description || e.msg || e.message || "Could not send link" }; });
    },
    signOut: function () {
      var s = session;
      setSession(null);
      if (s && s.access_token) api("logout", {}, "POST").catch(function () {});
    },
  };

  // Magic link callback: Supabase puts access_token in the URL hash
  if (location.hash && location.hash.indexOf("access_token=") !== -1) {
    var parts = {};
    location.hash.replace(/^#/, "").split("&").forEach(function (kv) {
      var p = kv.split("="); parts[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || "");
    });
    if (parts.access_token) {
      setSession({
        access_token: parts.access_token,
        refresh_token: parts.refresh_token,
        expires_in: parseInt(parts.expires_in || "3600", 10),
      });
      // Fetch the user record so we have their email/id
      api("user", null, "GET").then(function (u) {
        if (u) setSession(Object.assign({}, session, { user: u }));
      }).catch(function () {});
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  refreshIfNeeded();
})();
