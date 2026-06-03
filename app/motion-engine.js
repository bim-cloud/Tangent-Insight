/* ============================================================================
 * Tangent Insight — Motion Engine (TI_MOTION)
 *
 * Decoupled from all business logic. Provides:
 *   - Device capability tiering (high / mid / low) with auto-fallback
 *   - A global "mode": "full" | "performance" | "off" (persisted)
 *   - A single shared rAF scheduler (one loop drives every animation)
 *   - Spring physics (critically-dampable) for magnetic/inertia effects
 *   - Motion throttling: when the page is busy (data refresh, hidden tab,
 *     dropped frames) decorative work is paused so the dashboard stays
 *     responsive and data-accurate.
 *
 * Nothing here touches Supabase, KPIs, or any data. Visual only.
 * ========================================================================== */
(function () {
  "use strict";

  // ---- Device tiering -------------------------------------------------------
  function detectTier() {
    try {
      var mem   = navigator.deviceMemory || 4;          // GB (Chrome only)
      var cores = navigator.hardwareConcurrency || 4;
      var mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // WebGL availability
      var gl = false;
      try {
        var c = document.createElement("canvas");
        gl = !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
      } catch (e) { gl = false; }

      if (reduce) return { tier: "low", webgl: gl, reason: "prefers-reduced-motion" };
      if (mobile && (mem <= 4 || cores <= 4)) return { tier: "low", webgl: gl, reason: "mobile/limited" };
      if (mem <= 4 || cores <= 4)             return { tier: "mid", webgl: gl, reason: "midrange" };
      return { tier: "high", webgl: gl, reason: "capable" };
    } catch (e) {
      return { tier: "mid", webgl: false, reason: "detect-failed" };
    }
  }

  var caps = detectTier();

  // ---- Mode -----------------------------------------------------------------
  // Default: full on high tier, performance on mid, off on low.
  function defaultMode() {
    if (caps.tier === "low") return "performance";   // never "off" by default; still smooth, just light
    if (caps.tier === "mid") return "performance";
    return "full";
  }
  var mode;
  try { mode = localStorage.getItem("ti.motion") || defaultMode(); }
  catch (e) { mode = defaultMode(); }

  var listeners = [];
  function emit() { listeners.forEach(function (cb) { try { cb(mode, caps); } catch (e) {} }); }

  // ---- Shared rAF scheduler -------------------------------------------------
  var tasks = [];               // {fn, id}
  var nextId = 1;
  var running = false;
  var lastT = 0;
  var throttled = false;        // when true, decorative tasks are skipped
  var slowFrames = 0;

  function loop(t) {
    if (!running) return;
    var dt = lastT ? Math.min(64, t - lastT) : 16;     // clamp big gaps (tab switch)
    lastT = t;

    // Frame-health watchdog: if we keep seeing slow frames, auto-throttle
    if (dt > 34) { slowFrames++; } else { slowFrames = Math.max(0, slowFrames - 1); }
    var autoThrottle = slowFrames > 12;

    var doDecorative = !throttled && !autoThrottle && !document.hidden && mode !== "off";
    for (var i = 0; i < tasks.length; i++) {
      var task = tasks[i];
      if (task.decorative && !doDecorative) continue;
      try { task.fn(dt, t); } catch (e) {}
    }
    requestAnimationFrame(loop);
  }
  function ensureRunning() {
    if (running) return;
    running = true; lastT = 0;
    requestAnimationFrame(loop);
  }
  function add(fn, opts) {
    var id = nextId++;
    tasks.push({ fn: fn, id: id, decorative: !!(opts && opts.decorative) });
    ensureRunning();
    return function remove() { tasks = tasks.filter(function (x) { return x.id !== id; }); };
  }

  // External code (e.g. the data layer during a heavy refresh) can request a
  // temporary throttle so decorative work yields the main thread.
  var throttleCount = 0;
  function pushThrottle() { throttleCount++; throttled = true; }
  function popThrottle()  { throttleCount = Math.max(0, throttleCount - 1); throttled = throttleCount > 0; }

  // ---- Spring physics -------------------------------------------------------
  // A small critically-dampable spring integrator. Call step(dt) each frame.
  function Spring(opts) {
    opts = opts || {};
    this.stiffness = opts.stiffness != null ? opts.stiffness : 170;
    this.damping   = opts.damping   != null ? opts.damping   : 22;
    this.mass      = opts.mass      != null ? opts.mass      : 1;
    this.value = opts.from || 0;
    this.target = opts.to || 0;
    this.velocity = 0;
  }
  Spring.prototype.setTarget = function (t) { this.target = t; };
  Spring.prototype.step = function (dtMs) {
    var dt = Math.min(0.064, (dtMs || 16) / 1000);
    var Fspring = -this.stiffness * (this.value - this.target);
    var Fdamp   = -this.damping * this.velocity;
    var a = (Fspring + Fdamp) / this.mass;
    this.velocity += a * dt;
    this.value += this.velocity * dt;
    return this.value;
  };
  Spring.prototype.atRest = function () {
    return Math.abs(this.velocity) < 0.01 && Math.abs(this.value - this.target) < 0.01;
  };

  // ---- Easing (for non-spring transitions) ----------------------------------
  var easing = {
    spring:   function (t) { return 1 - Math.pow(2, -10 * t) * Math.cos((t * 10 - 0.75) * (2 * Math.PI) / 3); },
    outExpo:  function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
    inOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    overshoot: function (t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  };

  // ---- Public API -----------------------------------------------------------
  window.TI_MOTION = {
    caps: caps,
    getMode: function () { return mode; },
    setMode: function (m) {
      mode = m;
      try { localStorage.setItem("ti.motion", m); } catch (e) {}
      document.documentElement.setAttribute("data-motion", m);
      document.documentElement.setAttribute("data-tier", caps.tier);
      emit();
    },
    cycleMode: function () {
      var order = ["full", "performance", "off"];
      this.setMode(order[(order.indexOf(mode) + 1) % order.length]);
    },
    onChange: function (cb) { listeners.push(cb); return function () { listeners = listeners.filter(function (x) { return x !== cb; }); }; },
    add: add,
    Spring: Spring,
    easing: easing,
    pushThrottle: pushThrottle,
    popThrottle: popThrottle,
    isFull: function () { return mode === "full"; },
    isOff:  function () { return mode === "off"; },
    // lerp helper
    lerp: function (a, b, t) { return a + (b - a) * t; },
  };

  // Reflect initial state onto <html> so CSS can react.
  document.documentElement.setAttribute("data-motion", mode);
  document.documentElement.setAttribute("data-tier", caps.tier);

  // If the tab is hidden, decorative tasks already pause (document.hidden);
  // when it returns, reset the slow-frame counter so we don't false-throttle.
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) { slowFrames = 0; lastT = 0; }
  });

  console.info("[TI_MOTION] tier=" + caps.tier + " webgl=" + caps.webgl + " mode=" + mode);
})();
