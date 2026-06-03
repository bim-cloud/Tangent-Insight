/* ============================================================================
 * Tangent Insight — Ambient Background (TI_AMBIENT)
 *
 * A fixed, behind-everything canvas that renders soft floating particles and a
 * parallax glow that drifts with the pointer. Driven by the shared TI_MOTION
 * scheduler so it auto-pauses under load, when the tab is hidden, or in
 * performance/off modes.
 *
 * Uses canvas-2D (works everywhere). On the "low" tier or "off" mode it draws
 * nothing. Particle count scales with tier so mid-range machines stay smooth.
 * ========================================================================== */
(function () {
  "use strict";
  if (!window.TI_MOTION) return;

  var canvas, ctx, w = 0, h = 0, dpr = 1;
  var particles = [];
  var pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  var removeTask = null;

  function tierCount() {
    var t = window.TI_MOTION.caps.tier;
    if (t === "high") return 46;
    if (t === "mid")  return 22;
    return 0;
  }

  function makeParticles() {
    var n = tierCount();
    particles = [];
    for (var i = 0; i < n; i++) {
      particles.push({
        x: Math.random(), y: Math.random(),
        r: 0.6 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.00006,
        vy: -(0.00003 + Math.random() * 0.00009),  // drift gently upward
        a: 0.05 + Math.random() * 0.22,
        depth: 0.3 + Math.random() * 0.7,           // for parallax
        hue: Math.random() < 0.5 ? "accent" : "accent2",
      });
    }
  }

  function resize() {
    if (!canvas) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function frame(dt) {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    // Smooth the pointer toward its target (inertia)
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;

    var accent  = cssVar("--accent")  || "34 211 238";
    var accent2 = cssVar("--accent-2") || "167 139 250";

    // Parallax glow: two large soft radial gradients that drift opposite the pointer
    var gx = (0.5 - pointer.x);
    var gy = (0.5 - pointer.y);
    drawGlow(w * (0.30 + gx * 0.12), h * (0.28 + gy * 0.12), Math.max(w, h) * 0.55, accent, 0.06);
    drawGlow(w * (0.74 - gx * 0.10), h * (0.72 - gy * 0.10), Math.max(w, h) * 0.5, accent2, 0.05);

    // Particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
      if (p.x < -0.05) p.x = 1.05; if (p.x > 1.05) p.x = -0.05;

      var px = (p.x * w) + (0.5 - pointer.x) * 40 * p.depth;
      var py = (p.y * h) + (0.5 - pointer.y) * 40 * p.depth;
      var col = p.hue === "accent" ? accent : accent2;
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + col.split(" ").join(",") + "," + p.a + ")";
      ctx.fill();
    }
  }

  function drawGlow(x, y, r, colorTriplet, alpha) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    var c = colorTriplet.split(" ").join(",");
    g.addColorStop(0, "rgba(" + c + "," + alpha + ")");
    g.addColorStop(1, "rgba(" + c + ",0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function start() {
    stop();
    if (window.TI_MOTION.getMode() !== "full") return;   // ambient only in Full mode
    if (tierCount() === 0) return;

    canvas = document.createElement("canvas");
    canvas.id = "ti-ambient";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:fixed;inset:0;z-index:0;pointer-events:none;";
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext("2d");
    resize();
    makeParticles();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    removeTask = window.TI_MOTION.add(frame, { decorative: true });
  }

  function stop() {
    if (removeTask) { removeTask(); removeTask = null; }
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onMove);
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    canvas = null; ctx = null;
  }

  function onMove(e) {
    pointer.tx = e.clientX / window.innerWidth;
    pointer.ty = e.clientY / window.innerHeight;
  }

  // React to mode changes live
  window.TI_MOTION.onChange(function () { start(); });

  // Boot after DOM is ready
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start);
  else start();
})();
