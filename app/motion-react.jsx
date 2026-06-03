/* ============================================================================
 * Tangent Insight — React motion helpers (built on TI_MOTION)
 * Declarative hooks so screens stay clean. All degrade automatically:
 * in performance/off mode they become no-ops or CSS-only.
 * ========================================================================== */
(function () {
  const { useRef, useEffect, useState, useCallback } = React;
  const M = window.TI_MOTION;

  // Magnetic hover: element drifts toward the pointer with spring physics,
  // then springs back on leave. Returns props to spread on the element.
  window.useMagnetic = function useMagnetic(strength = 0.32) {
    const ref = useRef(null);
    useEffect(() => {
      if (!M || M.getMode() !== "full") return;     // only in Full mode
      const el = ref.current; if (!el) return;
      const sx = new M.Spring({ stiffness: 220, damping: 18 });
      const sy = new M.Spring({ stiffness: 220, damping: 18 });
      let active = false;

      const stop = M.add(() => {
        sx.step(16); sy.step(16);
        el.style.transform = `translate(${sx.value.toFixed(2)}px, ${sy.value.toFixed(2)}px)`;
      }, { decorative: true });

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        sx.setTarget((e.clientX - cx) * strength);
        sy.setTarget((e.clientY - cy) * strength);
        active = true;
      };
      const onLeave = () => { sx.setTarget(0); sy.setTarget(0); active = false; };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        stop();
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        el.style.transform = "";
      };
    }, [strength]);
    return ref;
  };

  // Reveal-on-scroll: adds .ti-revealed when the element enters the viewport.
  window.useInView = function useInView(opts) {
    const ref = useRef(null);
    const [seen, setSeen] = useState(false);
    useEffect(() => {
      const el = ref.current; if (!el) return;
      if (!M || M.getMode() === "off" || !("IntersectionObserver" in window)) { setSeen(true); return; }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { setSeen(true); io.disconnect(); } });
      }, opts || { threshold: 0.12 });
      io.observe(el);
      return () => io.disconnect();
    }, []);
    return [ref, seen];
  };

  // A reusable wrapper that fades/slides children in when scrolled into view.
  window.Reveal = function Reveal({ children, delay = 0, y = 14, style }) {
    const [ref, seen] = window.useInView();
    const off = M && M.getMode() !== "off";
    return React.createElement("div", {
      ref,
      style: Object.assign({
        opacity: off ? (seen ? 1 : 0) : 1,
        transform: off ? (seen ? "translateY(0)" : `translateY(${y}px)`) : "none",
        transition: off ? `opacity 560ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 560ms cubic-bezier(0.22,1,0.36,1) ${delay}ms` : "none",
        willChange: "opacity, transform",
      }, style || {}),
    }, children);
  };

  // Motion mode toggle button (Full / Performance / Off) for the topbar.
  window.MotionToggle = function MotionToggle() {
    const [mode, setMode] = useState(M ? M.getMode() : "off");
    useEffect(() => { if (!M) return; return M.onChange((m) => setMode(m)); }, []);
    if (!M) return null;
    const label = mode === "full" ? "Cinematic" : mode === "performance" ? "Balanced" : "Minimal";
    const icon = mode === "full" ? "sparkles" : mode === "performance" ? "gauge" : "minus-circle";
    return React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      title: "Motion: " + label + " (" + M.caps.tier + " tier). Click to cycle.",
      onClick: () => M.cycleMode(),
      style: { display: "inline-flex", alignItems: "center", gap: 6 },
    },
      React.createElement(window.Icon, { name: icon, size: 13 }),
      React.createElement("span", { style: { fontSize: 11.5 } }, label)
    );
  };
})();
