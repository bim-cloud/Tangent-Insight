/* Tangent Insight — Brand assets
   Faithful SVG recreations of the Tangent Landscape Architecture wordmark
   so we don't depend on raster files and can recolor for dark mode. */

/* The classic "T in white box on cyan bar · TANGENT wordmark" lockup.
   variant: "full"     — full logo with "LANDSCAPE / ARCHITECTURE" baseline
            "wordmark" — just the cyan bar with T + TANGENT
            "mark"     — just the T-in-square (favicon size)
            "compact"  — wordmark, no subtitle, smaller footprint
*/
window.TangentLogo = function TangentLogo({ variant = "wordmark", height = 36, color, style = {} }) {
  // Tangent brand cyan — keeping it locked to the brand sheet, not theming
  const BRAND = color || "#3FAFE0";
  const INK   = "#0F172A";
  const WHITE = "#FFFFFF";

  if (variant === "mark") {
    // Just the T-in-square — used at favicon / collapsed-sidebar size
    return (
      <svg viewBox="0 0 64 64" height={height} width={height} style={style} aria-label="Tangent">
        <rect x="0" y="0" width="64" height="64" rx="10" fill={BRAND} />
        <rect x="9" y="9" width="46" height="46" rx="3" fill={WHITE} />
        {/* T glyph — rounded geometric */}
        <path
          d="M 18 19 L 46 19 L 46 25 L 35 25 L 35 50 L 29 50 L 29 25 L 18 25 Z"
          fill={INK}
        />
      </svg>
    );
  }

  if (variant === "wordmark" || variant === "compact") {
    // Cyan bar with T-in-box at the left and "TANGENT" at the right
    // viewBox ratio ~ 320:80 → 4:1
    return (
      <svg viewBox="0 0 320 80" height={height} style={style} aria-label="Tangent">
        <rect x="0" y="0" width="320" height="80" rx="6" fill={BRAND} />
        {/* white square containing T */}
        <rect x="6" y="6" width="68" height="68" rx="2" fill={WHITE} />
        <path
          d="M 18 21 L 62 21 L 62 31 L 45 31 L 45 64 L 35 64 L 35 31 L 18 31 Z"
          fill={INK}
        />
        {/* TANGENT wordmark */}
        <text
          x="92" y="56"
          fontFamily="'Space Grotesk', 'Onest', system-ui, sans-serif"
          fontWeight="700"
          fontSize="46"
          letterSpacing="0.04em"
          fill={WHITE}
        >TANGENT</text>
      </svg>
    );
  }

  // variant: full — wordmark above, "LANDSCAPE   ARCHITECTURE" below
  return (
    <svg viewBox="0 0 320 116" height={height} style={style} aria-label="Tangent Landscape Architecture">
      <rect x="0" y="0" width="320" height="80" rx="6" fill={BRAND} />
      <rect x="6" y="6" width="68" height="68" rx="2" fill={WHITE} />
      <path
        d="M 18 21 L 62 21 L 62 31 L 45 31 L 45 64 L 35 64 L 35 31 L 18 31 Z"
        fill={INK}
      />
      <text x="92" y="56"
            fontFamily="'Space Grotesk', 'Onest', system-ui, sans-serif"
            fontWeight="700" fontSize="46" letterSpacing="0.04em" fill={WHITE}>TANGENT</text>
      <text x="0" y="106"
            fontFamily="'Space Grotesk', 'Onest', system-ui, sans-serif"
            fontWeight="600" fontSize="16" letterSpacing="0.18em" fill={INK}>LANDSCAPE</text>
      <text x="320" y="106" textAnchor="end"
            fontFamily="'Space Grotesk', 'Onest', system-ui, sans-serif"
            fontWeight="600" fontSize="16" letterSpacing="0.18em" fill={INK}>ARCHITECTURE</text>
    </svg>
  );
};
