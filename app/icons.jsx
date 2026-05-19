/* Tangent Insight — Custom icon set
   24×24 viewBox · stroke-based · 1.7px stroke · rounded caps
   All icons original. No external library. */

window.TI_ICONS = (function () {
  // Common stroke attrs applied to every icon
  const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

  // Helper for ID-namespacing radials/gradients per icon (none needed for line icons, but useful for filled brand bits)
  return {
    /* ================= Navigation ================= */
    "layout-dashboard": (
      <g {...S}>
        <rect x="3.5" y="3.5" width="7.5" height="9" rx="1.6" />
        <rect x="3.5" y="14.5" width="7.5" height="6" rx="1.6" />
        <rect x="13" y="3.5" width="7.5" height="6" rx="1.6" />
        <rect x="13" y="11.5" width="7.5" height="9" rx="1.6" />
      </g>
    ),
    "radio": (
      <g {...S}>
        <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
        <path d="M7.5 16.5 A 6.4 6.4 0 0 1 7.5 7.5" />
        <path d="M16.5 7.5 A 6.4 6.4 0 0 1 16.5 16.5" />
        <path d="M4.6 19.4 A 10.5 10.5 0 0 1 4.6 4.6" />
        <path d="M19.4 4.6 A 10.5 10.5 0 0 1 19.4 19.4" />
      </g>
    ),
    "box": (
      <g {...S}>
        <path d="M12 2.5 L20.5 7 L20.5 17 L12 21.5 L3.5 17 L3.5 7 Z" />
        <path d="M3.5 7 L12 11.5 L20.5 7" />
        <path d="M12 11.5 L12 21.5" />
      </g>
    ),
    "users": (
      <g {...S}>
        <circle cx="9" cy="8" r="3.4" />
        <path d="M3.2 20 c0 -3.5 2.6 -5.4 5.8 -5.4 s5.8 1.9 5.8 5.4" />
        <path d="M16 4 a 3.2 3.2 0 0 1 0 6.4" />
        <path d="M16.5 14.8 c2.6 0.4 4.3 2.2 4.3 5.2" />
      </g>
    ),
    "user": (
      <g {...S}>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M4.5 20 c0 -4 3.4 -6 7.5 -6 s7.5 2 7.5 6" />
      </g>
    ),
    "user-search": (
      <g {...S}>
        <circle cx="10" cy="7.5" r="3.2" />
        <path d="M3.8 18 c0 -3.2 2.8 -4.8 6.2 -4.8 c1.6 0 3.1 0.4 4.1 1" />
        <circle cx="17" cy="17" r="3" />
        <path d="M19.4 19.4 L21.5 21.5" />
      </g>
    ),
    "video": (
      <g {...S}>
        <rect x="2.5" y="6" width="13" height="12" rx="2" />
        <path d="M15.5 10 L21.5 6.5 L21.5 17.5 L15.5 14 Z" />
      </g>
    ),
    "video-off": (
      <g {...S}>
        <path d="M2.5 8 v8 a 2 2 0 0 0 2 2 h9" />
        <path d="M15.5 14 V10 L21.5 6.5 v 9" />
        <path d="M3 3 L21 21" />
      </g>
    ),
    "calendar-check": (
      <g {...S}>
        <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
        <path d="M3.5 9 H 20.5" />
        <path d="M8 2.5 V 6" />
        <path d="M16 2.5 V 6" />
        <path d="M8.5 14 l 2.4 2.4 L 15.5 12" />
      </g>
    ),
    "calendar": (
      <g {...S}>
        <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
        <path d="M3.5 9 H 20.5" />
        <path d="M8 2.5 V 6" />
        <path d="M16 2.5 V 6" />
      </g>
    ),
    "calendar-plus": (
      <g {...S}>
        <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
        <path d="M3.5 9 H 20.5" />
        <path d="M8 2.5 V 6" /><path d="M16 2.5 V 6" />
        <path d="M12 12 V 18" /><path d="M9 15 H 15" />
      </g>
    ),
    "calendar-clock": (
      <g {...S}>
        <path d="M20.5 9 v -3 a 1.5 1.5 0 0 0 -1.5 -1.5 H 5 a 1.5 1.5 0 0 0 -1.5 1.5 v 13 a 1.5 1.5 0 0 0 1.5 1.5 h 7" />
        <path d="M3.5 9 H 20.5" />
        <path d="M8 2.5 V 6" /><path d="M16 2.5 V 6" />
        <circle cx="17" cy="17" r="4" />
        <path d="M17 15 V 17 L 18.5 18" />
      </g>
    ),
    "history": (
      <g {...S}>
        <path d="M3.5 12 a 8.5 8.5 0 1 0 2.3 -5.8" />
        <path d="M3.5 4 V 7.5 H 7" />
        <path d="M12 7.5 V 12 L 15 14" />
      </g>
    ),
    "file-bar-chart": (
      <g {...S}>
        <path d="M14 2.5 H 6 a 2 2 0 0 0 -2 2 v 15 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 V 8.5 Z" />
        <path d="M14 2.5 V 8.5 H 20" />
        <path d="M8.5 17.5 V 13" />
        <path d="M12 17.5 V 10" />
        <path d="M15.5 17.5 V 14.5" />
      </g>
    ),
    "bar-chart-3": (
      <g {...S}>
        <path d="M4 4 V 20.5 H 20.5" />
        <path d="M8 17 V 11" /><path d="M12 17 V 6" /><path d="M16 17 V 13" /><path d="M20 17 V 9" />
      </g>
    ),
    "bell": (
      <g {...S}>
        <path d="M6 17.5 V 11 a 6 6 0 1 1 12 0 v 6.5 H 5.5 a 0 0 0 0 0 0.5 -0.5 Z" />
        <path d="M10 20.5 a 2 2 0 0 0 4 0" />
      </g>
    ),
    "shield": (
      <g {...S}>
        <path d="M12 2.5 L 4 6 v 6 c 0 4.5 3.5 8 8 9.5 c 4.5 -1.5 8 -5 8 -9.5 V 6 Z" />
      </g>
    ),
    "shield-check": (
      <g {...S}>
        <path d="M12 2.5 L 4 6 v 6 c 0 4.5 3.5 8 8 9.5 c 4.5 -1.5 8 -5 8 -9.5 V 6 Z" />
        <path d="M8.5 11.5 L 11 14 L 15.5 9.5" />
      </g>
    ),
    "settings": (
      <g {...S}>
        <circle cx="12" cy="12" r="2.6" />
        <path d="M19.4 14.5 a 1.65 1.65 0 0 0 0.33 1.82 l 0.06 0.06 a 2 2 0 1 1 -2.83 2.83 l -0.06 -0.06 a 1.65 1.65 0 0 0 -1.82 -0.33 a 1.65 1.65 0 0 0 -1 1.51 V 21 a 2 2 0 0 1 -4 0 v -0.09 a 1.65 1.65 0 0 0 -1.08 -1.51 a 1.65 1.65 0 0 0 -1.82 0.33 l -0.06 0.06 a 2 2 0 1 1 -2.83 -2.83 l 0.06 -0.06 a 1.65 1.65 0 0 0 0.33 -1.82 a 1.65 1.65 0 0 0 -1.51 -1 H 3 a 2 2 0 0 1 0 -4 h 0.09 A 1.65 1.65 0 0 0 4.6 8.55 a 1.65 1.65 0 0 0 -0.33 -1.82 l -0.06 -0.06 a 2 2 0 1 1 2.83 -2.83 l 0.06 0.06 a 1.65 1.65 0 0 0 1.82 0.33 H 9 a 1.65 1.65 0 0 0 1 -1.51 V 3 a 2 2 0 0 1 4 0 v 0.09 a 1.65 1.65 0 0 0 1 1.51 a 1.65 1.65 0 0 0 1.82 -0.33 l 0.06 -0.06 a 2 2 0 1 1 2.83 2.83 l -0.06 0.06 a 1.65 1.65 0 0 0 -0.33 1.82 V 9 a 1.65 1.65 0 0 0 1.51 1 H 21 a 2 2 0 0 1 0 4 h -0.09 a 1.65 1.65 0 0 0 -1.51 1 Z" />
      </g>
    ),

    /* ================= Actions ================= */
    "plus":         <g {...S}><path d="M12 5 V 19" /><path d="M5 12 H 19" /></g>,
    "x":            <g {...S}><path d="M5.5 5.5 L 18.5 18.5" /><path d="M18.5 5.5 L 5.5 18.5" /></g>,
    "x-circle":     <g {...S}><circle cx="12" cy="12" r="9" /><path d="M9 9 L 15 15" /><path d="M15 9 L 9 15" /></g>,
    "check":        <g {...S}><path d="M4.5 12.5 L 9.5 17.5 L 19.5 6.5" /></g>,
    "check-circle": <g {...S}><circle cx="12" cy="12" r="9" /><path d="M8 12.5 L 11 15.5 L 16 9.5" /></g>,
    "search":       <g {...S}><circle cx="11" cy="11" r="6.5" /><path d="M15.8 15.8 L 20.5 20.5" /></g>,
    "filter":       <g {...S}><path d="M4 5 H 20 L 14 12.5 V 19 L 10 21 V 12.5 Z" /></g>,
    "download":     <g {...S}><path d="M12 3.5 V 15.5" /><path d="M7 11 L 12 16 L 17 11" /><path d="M4 19.5 H 20" /></g>,
    "upload":       <g {...S}><path d="M12 20.5 V 8.5" /><path d="M7 13 L 12 8 L 17 13" /><path d="M4 4.5 H 20" /></g>,
    "upload-cloud": (
      <g {...S}>
        <path d="M7 18 a 4 4 0 0 1 0 -8 a 6 6 0 0 1 11.5 -1.5 a 3.5 3.5 0 0 1 -0.5 7 H 17" />
        <path d="M12 13 V 21" /><path d="M9.5 15.5 L 12 13 L 14.5 15.5" />
      </g>
    ),
    "save": (
      <g {...S}>
        <path d="M5 4.5 H 16.5 L 19.5 7.5 V 19.5 H 5 a 0.5 0.5 0 0 1 -0.5 -0.5 V 5 a 0.5 0.5 0 0 1 0.5 -0.5 Z" />
        <path d="M8 4.5 V 9.5 H 15" />
        <rect x="8" y="13" width="8" height="6.5" rx="0.5" />
      </g>
    ),
    "refresh-cw": (
      <g {...S}>
        <path d="M20.5 8.5 a 8 8 0 0 0 -14 -1" />
        <path d="M3.5 15.5 a 8 8 0 0 0 14 1" />
        <path d="M20.5 3.5 V 8.5 H 15.5" />
        <path d="M3.5 20.5 V 15.5 H 8.5" />
      </g>
    ),
    "rotate-ccw": (
      <g {...S}>
        <path d="M3.5 12 a 8.5 8.5 0 1 0 2.5 -6" />
        <path d="M3.5 3.5 V 8.5 H 8.5" />
      </g>
    ),
    "sliders-horizontal": (
      <g {...S}>
        <path d="M3 7 H 21" /><path d="M3 12 H 21" /><path d="M3 17 H 21" />
        <rect x="13.5" y="5" width="3.5" height="4" rx="0.8" fill="currentColor" stroke="none" />
        <rect x="6.5" y="10"  width="3.5" height="4" rx="0.8" fill="currentColor" stroke="none" />
        <rect x="15.5" y="15" width="3.5" height="4" rx="0.8" fill="currentColor" stroke="none" />
      </g>
    ),
    "send": (
      <g {...S}>
        <path d="M21 3 L 11 13" />
        <path d="M21 3 L 14.5 21 L 11 13 L 3 9.5 Z" />
      </g>
    ),
    "pencil": (
      <g {...S}>
        <path d="M16.5 3.5 a 2.1 2.1 0 0 1 3 3 L 7 19 L 3 20.5 L 4.5 16.5 Z" />
        <path d="M14 6 L 18 10" />
      </g>
    ),
    "more-horizontal": <g {...S}><circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" /></g>,
    "chevron-right":   <g {...S}><path d="M9 5 L 16 12 L 9 19" /></g>,
    "chevron-left":    <g {...S}><path d="M15 5 L 8 12 L 15 19" /></g>,
    "chevron-down":    <g {...S}><path d="M5 9 L 12 16 L 19 9" /></g>,
    "chevron-up":      <g {...S}><path d="M5 15 L 12 8 L 19 15" /></g>,
    "arrow-right":     <g {...S}><path d="M5 12 H 19" /><path d="M14 7 L 19 12 L 14 17" /></g>,
    "arrow-up-right":  <g {...S}><path d="M7 17 L 17 7" /><path d="M9 7 H 17 V 15" /></g>,
    "arrow-down-right":<g {...S}><path d="M7 7 L 17 17" /><path d="M17 9 V 17 H 9" /></g>,
    "arrow-up-down":   <g {...S}><path d="M8 3 V 21" /><path d="M5 6 L 8 3 L 11 6" /><path d="M16 21 V 3" /><path d="M13 18 L 16 21 L 19 18" /></g>,

    /* ================= States / Alerts ================= */
    "alert-octagon": <g {...S}><path d="M8 2.5 H 16 L 21.5 8 V 16 L 16 21.5 H 8 L 2.5 16 V 8 Z" /><path d="M12 8 V 13" /><path d="M12 16.5 V 16.6" /></g>,
    "alert-triangle":<g {...S}><path d="M12 3 L 22 20 H 2 Z" /><path d="M12 10 V 14" /><path d="M12 17 V 17.1" /></g>,
    "info":         <g {...S}><circle cx="12" cy="12" r="9" /><path d="M12 11 V 16.5" /><path d="M12 7.5 V 7.6" /></g>,
    "flame":        <g {...S}><path d="M12 2.5 c 0 3 -3 4 -3 8 c 0 1.5 0.5 2.5 1.5 3 c -1 -0.5 -1.5 -1.5 -1.5 -3 c 0 2 -2 3 -2 6 a 5 5 0 0 0 10 0 c 0 -4 -3 -5 -3 -9 c 0 -2 -1 -3 -2 -5 Z" /></g>,
    "zap":          <g {...S}><path d="M14 2 L 4 13 H 12 L 10 22 L 20 11 H 12 L 14 2 Z" /></g>,
    "circle-dot":   <g {...S}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /></g>,

    /* ================= Time ================= */
    "clock":   <g {...S}><circle cx="12" cy="12" r="8.5" /><path d="M12 7 V 12 L 15.5 14" /></g>,
    "timer":   <g {...S}><path d="M9.5 2.5 H 14.5" /><circle cx="12" cy="14" r="7.5" /><path d="M12 10.5 V 14" /><path d="M14 6.5 L 16 4.5" /></g>,
    "alarm-clock": <g {...S}><circle cx="12" cy="13" r="7.5" /><path d="M12 9 V 13 L 14.5 14.5" /><path d="M5 5 L 7 3" /><path d="M19 5 L 17 3" /><path d="M5 19 L 7 21" /></g>,
    "hourglass": <g {...S}><path d="M6 3 H 18 V 6 L 13 12 L 18 18 V 21 H 6 V 18 L 11 12 L 6 6 Z" /></g>,

    /* ================= Sun / Moon ================= */
    "sun":  <g {...S}><circle cx="12" cy="12" r="4" /><path d="M12 3 V 5" /><path d="M12 19 V 21" /><path d="M3 12 H 5" /><path d="M19 12 H 21" /><path d="M5.5 5.5 L 7 7" /><path d="M17 17 L 18.5 18.5" /><path d="M5.5 18.5 L 7 17" /><path d="M17 7 L 18.5 5.5" /></g>,
    "moon": <g {...S}><path d="M20.5 14 A 9 9 0 1 1 10 3.5 a 7 7 0 0 0 10.5 10.5 Z" /></g>,
    "coffee":<g {...S}><path d="M4 9 H 16 V 16 a 4 4 0 0 1 -4 4 H 8 a 4 4 0 0 1 -4 -4 Z" /><path d="M16 11 H 18 a 3 3 0 0 1 0 6 H 16" /><path d="M7 5 c 0 1 -1 1.5 -1 2.5" /><path d="M11 5 c 0 1 -1 1.5 -1 2.5" /></g>,

    /* ================= Folders & Files ================= */
    "folder-kanban": (
      <g {...S}>
        <path d="M3.5 7 a 1.5 1.5 0 0 1 1.5 -1.5 h 4 l 2 2 H 19 a 1.5 1.5 0 0 1 1.5 1.5 V 18 a 1.5 1.5 0 0 1 -1.5 1.5 H 5 a 1.5 1.5 0 0 1 -1.5 -1.5 Z" />
        <path d="M8 12 V 16" /><path d="M12 12 V 14" /><path d="M16 12 V 17" />
      </g>
    ),
    "folder-open": (
      <g {...S}>
        <path d="M5 6 h 4 l 2 2 H 18.5 a 1.5 1.5 0 0 1 1.5 1.5" />
        <path d="M3 18 L 5.5 11 H 21 L 18.5 18 Z" />
      </g>
    ),
    "folder": (
      <g {...S}>
        <path d="M3.5 7 a 1.5 1.5 0 0 1 1.5 -1.5 h 4 l 2 2 H 19 a 1.5 1.5 0 0 1 1.5 1.5 V 18 a 1.5 1.5 0 0 1 -1.5 1.5 H 5 a 1.5 1.5 0 0 1 -1.5 -1.5 Z" />
      </g>
    ),
    "file-text":        <g {...S}><path d="M14 2.5 H 6 a 2 2 0 0 0 -2 2 v 15 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 V 8.5 Z" /><path d="M14 2.5 V 8.5 H 20" /><path d="M8 13 H 16" /><path d="M8 16.5 H 14" /></g>,
    "file-spreadsheet": <g {...S}><path d="M14 2.5 H 6 a 2 2 0 0 0 -2 2 v 15 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 V 8.5 Z" /><path d="M14 2.5 V 8.5 H 20" /><path d="M8 13 H 16" /><path d="M8 17 H 16" /><path d="M12 13 V 21.5" /></g>,
    "file-code":        <g {...S}><path d="M14 2.5 H 6 a 2 2 0 0 0 -2 2 v 15 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 V 8.5 Z" /><path d="M14 2.5 V 8.5 H 20" /><path d="M10 14 L 8 16 L 10 18" /><path d="M14 14 L 16 16 L 14 18" /></g>,
    "file-archive":     <g {...S}><path d="M14 2.5 H 6 a 2 2 0 0 0 -2 2 v 15 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 V 8.5 Z" /><path d="M14 2.5 V 8.5 H 20" /><path d="M11 5 V 7" /><path d="M11 9 V 11" /><path d="M11 13 V 15" /><circle cx="11" cy="17.5" r="1.5" /></g>,
    "file-output":      <g {...S}><path d="M14 2.5 H 6 a 2 2 0 0 0 -2 2 v 15 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 V 8.5 Z" /><path d="M14 2.5 V 8.5 H 20" /><path d="M9 14 H 16" /><path d="M13 11 L 16 14 L 13 17" /></g>,
    "library":          <g {...S}><path d="M4 4 V 20" /><path d="M8 4 V 20" /><path d="M12 5 L 13 19" /><path d="M16 5 L 17 19" /><path d="M20 4 V 20" /></g>,
    "scroll-text":      <g {...S}><path d="M5 3.5 H 17 a 2 2 0 0 1 2 2 v 11 a 4 4 0 0 0 4 4 H 7 a 4 4 0 0 1 -4 -4 V 6 a 2.5 2.5 0 0 1 5 0 V 8 H 3" /><path d="M9 9 H 15" /><path d="M9 13 H 15" /></g>,
    "list":             <g {...S}><path d="M8 6 H 21" /><path d="M8 12 H 21" /><path d="M8 18 H 21" /><circle cx="4" cy="6"  r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" /></g>,
    "list-checks":      <g {...S}><path d="M4 6 L 6 8 L 9 5" /><path d="M11 6.5 H 20" /><path d="M4 13 L 6 15 L 9 12" /><path d="M11 13.5 H 20" /><path d="M4 20 L 6 22 L 9 19" /><path d="M11 20.5 H 18" /></g>,
    "grid-3x3":         <g {...S}><rect x="3.5" y="3.5" width="17" height="17" rx="1.6" /><path d="M9 3.5 V 20.5" /><path d="M15 3.5 V 20.5" /><path d="M3.5 9 H 20.5" /><path d="M3.5 15 H 20.5" /></g>,

    /* ================= Communication ================= */
    "mail":          <g {...S}><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M3 7 L 12 13 L 21 7" /></g>,
    "phone":         <g {...S}><path d="M21 17 v 2.5 a 1.5 1.5 0 0 1 -1.65 1.5 a 17 17 0 0 1 -7.4 -2.7 a 17 17 0 0 1 -5.2 -5.2 a 17 17 0 0 1 -2.7 -7.43 A 1.5 1.5 0 0 1 5.55 4 H 8 a 1.5 1.5 0 0 1 1.5 1.3 c 0.1 0.95 0.3 1.88 0.6 2.77 a 1.5 1.5 0 0 1 -0.35 1.58 L 8.7 10.7 a 13 13 0 0 0 5 5 l 1.05 -1.05 a 1.5 1.5 0 0 1 1.58 -0.35 c 0.89 0.3 1.82 0.5 2.77 0.6 A 1.5 1.5 0 0 1 21 17 Z" /></g>,
    "message-square":<g {...S}><path d="M21 15.5 a 2 2 0 0 1 -2 2 H 7.5 L 3.5 21.5 V 5.5 a 2 2 0 0 1 2 -2 h 13.5 a 2 2 0 0 1 2 2 Z" /></g>,
    "screen-share":  <g {...S}><rect x="2.5" y="3.5" width="19" height="13" rx="2" /><path d="M8 20.5 H 16" /><path d="M12 16.5 V 20.5" /><path d="M12 13 V 7" /><path d="M9 10 L 12 7 L 15 10" /></g>,

    /* ================= Auth ================= */
    "log-in":  <g {...S}><path d="M10 17 L 15 12 L 10 7" /><path d="M15 12 H 4" /><path d="M14 3.5 H 18.5 a 1.5 1.5 0 0 1 1.5 1.5 v 14 a 1.5 1.5 0 0 1 -1.5 1.5 H 14" /></g>,
    "log-out": <g {...S}><path d="M16 17 L 21 12 L 16 7" /><path d="M21 12 H 9" /><path d="M9 3.5 H 5.5 a 1.5 1.5 0 0 0 -1.5 1.5 v 14 a 1.5 1.5 0 0 0 1.5 1.5 H 9" /></g>,
    "lock":    <g {...S}><rect x="4" y="11" width="16" height="10" rx="1.6" /><path d="M7 11 V 8 a 5 5 0 0 1 10 0 v 3" /></g>,
    "unlock":  <g {...S}><rect x="4" y="11" width="16" height="10" rx="1.6" /><path d="M7 11 V 8 a 5 5 0 0 1 9 -3" /></g>,
    "key":     <g {...S}><circle cx="8" cy="14" r="4" /><path d="M11 13 L 20 4" /><path d="M17 7 L 19 9" /><path d="M14 10 L 16 12" /></g>,
    "key-round":<g {...S}><circle cx="8" cy="15" r="4.5" /><path d="M11 12 L 21 2" /><path d="M17 6 L 19 8" /></g>,
    "eye":     <g {...S}><path d="M2.5 12 c 2 -4.5 5.5 -7.5 9.5 -7.5 s 7.5 3 9.5 7.5 c -2 4.5 -5.5 7.5 -9.5 7.5 s -7.5 -3 -9.5 -7.5 Z" /><circle cx="12" cy="12" r="3" /></g>,
    "eye-off": <g {...S}><path d="M3 3 L 21 21" /><path d="M9.5 5 a 12 12 0 0 1 2.5 -0.5 c 4 0 7.5 3 9.5 7.5 a 14 14 0 0 1 -2 3" /><path d="M14 14 a 3 3 0 1 1 -4 -4" /><path d="M6 6 a 12 12 0 0 0 -3.5 6 c 2 4.5 5.5 7.5 9.5 7.5 a 11 11 0 0 0 4 -0.8" /></g>,

    /* ================= Hardware / Network ================= */
    "hard-drive":  <g {...S}><rect x="2.5" y="14" width="19" height="6" rx="1.5" /><path d="M5.5 7 L 8 14" /><path d="M18.5 7 L 16 14" /><path d="M2.5 7 H 21.5" /><circle cx="6"  cy="17" r="0.8" fill="currentColor" stroke="none" /><circle cx="9"  cy="17" r="0.8" fill="currentColor" stroke="none" /></g>,
    "cloud":       <g {...S}><path d="M7 18 a 4 4 0 0 1 0 -8 a 6 6 0 0 1 11.5 -1.5 a 3.5 3.5 0 0 1 -0.5 7 Z" /></g>,
    "database":    <g {...S}><ellipse cx="12" cy="5.5" rx="8" ry="2.5" /><path d="M4 5.5 V 12 c 0 1.4 3.6 2.5 8 2.5 s 8 -1.1 8 -2.5 V 5.5" /><path d="M4 12 V 18.5 c 0 1.4 3.6 2.5 8 2.5 s 8 -1.1 8 -2.5 V 12" /></g>,
    "plug-zap":    <g {...S}><path d="M12 13 L 14 11 V 7 L 12 5 L 10 7 V 11 Z" /><path d="M12 13 L 12 16" /><path d="M9 19 L 12 16 L 15 19" /><path d="M9 7 V 4" /><path d="M15 7 V 4" /></g>,
    "network":     <g {...S}><rect x="9" y="2.5" width="6" height="6" rx="1" /><rect x="3"  y="15.5" width="6" height="6" rx="1" /><rect x="15" y="15.5" width="6" height="6" rx="1" /><path d="M12 8.5 V 12 H 6 V 15.5" /><path d="M12 12 H 18 V 15.5" /></g>,
    "globe":       <g {...S}><circle cx="12" cy="12" r="9" /><path d="M3 12 H 21" /><path d="M12 3 a 13 13 0 0 1 0 18 a 13 13 0 0 1 0 -18 Z" /></g>,
    "credit-card": <g {...S}><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 10 H 21.5" /><path d="M6 15 H 9" /></g>,
    "link":        <g {...S}><path d="M10 14 a 4 4 0 0 0 5.66 0 l 3 -3 a 4 4 0 0 0 -5.66 -5.66 L 11.5 7" /><path d="M14 10 a 4 4 0 0 0 -5.66 0 l -3 3 a 4 4 0 0 0 5.66 5.66 L 12.5 17" /></g>,

    /* ================= BIM / Misc ================= */
    "layers":  <g {...S}><path d="M12 2.5 L 22 7.5 L 12 12.5 L 2 7.5 Z" /><path d="M2 12.5 L 12 17.5 L 22 12.5" /><path d="M2 17 L 12 22 L 22 17" /></g>,
    "building-2": <g {...S}><rect x="4.5" y="3.5" width="15" height="17" rx="1.5" /><path d="M8 7 H 10" /><path d="M14 7 H 16" /><path d="M8 11 H 10" /><path d="M14 11 H 16" /><path d="M8 15 H 10" /><path d="M14 15 H 16" /><path d="M10 20.5 V 17 H 14 V 20.5" /></g>,
    "trophy":     <g {...S}><path d="M8 4 H 16 V 10 a 4 4 0 0 1 -8 0 Z" /><path d="M8 6 H 4 V 8 a 3 3 0 0 0 3 3" /><path d="M16 6 H 20 V 8 a 3 3 0 0 1 -3 3" /><path d="M10 14 H 14 V 17 H 10 Z" /><path d="M8 20 H 16" /><path d="M12 17 V 20" /></g>,
    "award":      <g {...S}><circle cx="12" cy="9" r="6" /><path d="M8 14 L 6 21 L 12 18 L 18 21 L 16 14" /></g>,
    "pie-chart":  <g {...S}><path d="M12 3 a 9 9 0 1 0 9 9 H 12 Z" /><path d="M21 12 A 9 9 0 0 0 12 3 V 12 Z" /></g>,
    "line-chart": <g {...S}><path d="M3.5 19.5 V 4" /><path d="M3.5 19.5 H 21" /><path d="M7 16 L 11 11 L 14 14 L 19.5 7.5" /></g>,
    "activity":   <g {...S}><path d="M3 12 H 6 L 9 4 L 15 20 L 18 12 H 21" /></g>,
    "trending-up": <g {...S}><path d="M21 7 L 13 15 L 9 11 L 3 17" /><path d="M14 7 H 21 V 14" /></g>,
    "trending-down":<g {...S}><path d="M21 17 L 13 9 L 9 13 L 3 7" /><path d="M14 17 H 21 V 10" /></g>,
    "zoom-in":    <g {...S}><circle cx="11" cy="11" r="6.5" /><path d="M15.8 15.8 L 20.5 20.5" /><path d="M8 11 H 14" /><path d="M11 8 V 14" /></g>,
    "zoom-out":   <g {...S}><circle cx="11" cy="11" r="6.5" /><path d="M15.8 15.8 L 20.5 20.5" /><path d="M8 11 H 14" /></g>,
    "sparkles":   <g {...S}><path d="M12 3 L 13.5 9 L 19 10.5 L 13.5 12 L 12 18 L 10.5 12 L 5 10.5 L 10.5 9 Z" /><path d="M19 16 L 19.7 18 L 21.5 18.5 L 19.7 19 L 19 21 L 18.3 19 L 16.5 18.5 L 18.3 18 Z" /></g>,
    "play":       <g {...S}><path d="M7 4.5 V 19.5 L 19 12 Z" /></g>,
    "pause":      <g {...S}><rect x="6.5"  y="4.5" width="3.5" height="15" rx="0.8" /><rect x="14" y="4.5" width="3.5" height="15" rx="0.8" /></g>,
    "rewind":     <g {...S}><path d="M11 5 L 4 12 L 11 19 Z" /><path d="M20 5 L 13 12 L 20 19 Z" /></g>,
    "fast-forward":<g {...S}><path d="M13 5 L 20 12 L 13 19 Z" /><path d="M4 5 L 11 12 L 4 19 Z" /></g>,
    "focus":      <g {...S}><circle cx="12" cy="12" r="3.4" /><path d="M3 7 V 5 a 2 2 0 0 1 2 -2 H 7" /><path d="M21 7 V 5 a 2 2 0 0 0 -2 -2 H 17" /><path d="M3 17 V 19 a 2 2 0 0 0 2 2 H 7" /><path d="M21 17 V 19 a 2 2 0 0 1 -2 2 H 17" /></g>,
    "user-check":  <g {...S}><circle cx="9" cy="8" r="3.6" /><path d="M2.5 20 c 0 -3.6 2.9 -5.6 6.5 -5.6 c 1.4 0 2.7 0.3 3.7 0.9" /><path d="M15 17 L 17 19 L 21 14.5" /></g>,
    "user-minus": <g {...S}><circle cx="9" cy="8" r="3.6" /><path d="M2.5 20 c 0 -3.6 2.9 -5.6 6.5 -5.6 c 1.4 0 2.7 0.3 3.7 0.9" /><path d="M15 16.5 H 21" /></g>,
    "user-x":     <g {...S}><circle cx="9" cy="8" r="3.6" /><path d="M2.5 20 c 0 -3.6 2.9 -5.6 6.5 -5.6 c 1.4 0 2.7 0.3 3.7 0.9" /><path d="M15 14 L 21 20" /><path d="M21 14 L 15 20" /></g>,
    "palette":    <g {...S}><path d="M12 21.5 a 9.5 9.5 0 1 1 9.5 -9.5 c 0 2 -2 2 -3.5 2 H 16 a 2 2 0 0 0 -2 2 c 0 1 1 1.5 1 2.5 a 3 3 0 0 1 -3 3 Z" /><circle cx="8"  cy="9" r="1.2" fill="currentColor" stroke="none" /><circle cx="13" cy="6" r="1.2" fill="currentColor" stroke="none" /><circle cx="17" cy="9" r="1.2" fill="currentColor" stroke="none" /></g>,
    "settings-2": <g {...S}><circle cx="8"  cy="6"  r="2.4" /><path d="M14 6 H 21" /><path d="M3 6 H 5.5" /><circle cx="16" cy="12" r="2.4" /><path d="M3 12 H 13.5" /><path d="M18.5 12 H 21" /><circle cx="8" cy="18" r="2.4" /><path d="M14 18 H 21" /><path d="M3 18 H 5.5" /></g>,
  };
})();

/* ===================================================================
   Re-define the global Icon component to use the custom registry.
   This MUST come after primitives.jsx because primitives.jsx defines
   window.Icon using lucide — we override here.
   =================================================================== */
window.Icon = function Icon({ name, size = 16, color, className = "", style = {} }) {
  const node = window.TI_ICONS[name];
  return (
    <span
      className={className}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size, color: color || "currentColor",
        flexShrink: 0, lineHeight: 0, ...style,
      }}
      data-icon={name}
    >
      {node ? (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          {node}
        </svg>
      ) : (
        // Fallback: a small geometric mark so missing icons still look intentional
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      )}
    </span>
  );
};
