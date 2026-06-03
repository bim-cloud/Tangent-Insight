/* ============================================================================
 * Tangent Insight — shared UI utilities (TI_UTIL)
 * Real implementations behind the buttons: export, print, copy, toast.
 * Plain JS, no deps. Attaches to window.TI_UTIL.
 * ========================================================================== */
(function () {
  "use strict";

  function download(filename, data, mime) {
    try {
      var blob = new Blob([data], { type: mime || "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(function () { a.remove(); URL.revokeObjectURL(url); }, 100);
      return true;
    } catch (e) { console.error("download failed", e); return false; }
  }

  function csvEscape(v) {
    if (v == null) return "";
    if (Array.isArray(v)) v = v.join("; ");
    var s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  // rows: array of objects, fields: array of keys (or null = infer from first row)
  function exportCsv(name, rows, fields) {
    if (!rows || !rows.length) { toast("Nothing to export", "warning"); return false; }
    fields = fields || Object.keys(rows[0]);
    var header = fields.join(",");
    var body = rows.map(function (r) {
      return fields.map(function (f) { return csvEscape(r[f]); }).join(",");
    }).join("\n");
    var ok = download(stamp(name) + ".csv", header + "\n" + body, "text/csv;charset=utf-8");
    if (ok) toast("Exported " + rows.length + " rows to CSV", "success");
    return ok;
  }

  function exportJson(name, data) {
    var ok = download(stamp(name) + ".json", JSON.stringify(data, null, 2), "application/json");
    if (ok) toast("Exported JSON", "success");
    return ok;
  }

  function stamp(name) {
    return (name || "tangent-export") + "-" + new Date().toISOString().slice(0, 10);
  }

  function copyText(text) {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () { toast("Copied to clipboard", "success"); });
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); ta.remove();
        toast("Copied to clipboard", "success");
      }
      return true;
    } catch (e) { toast("Copy failed", "warning"); return false; }
  }

  // Print a clean HTML report in a new window.
  function printReport(title, htmlBody) {
    try {
      var w = window.open("", "_blank", "width=900,height=700");
      if (!w) { toast("Pop-up blocked — allow pop-ups to print", "warning"); return false; }
      w.document.write(
        '<!doctype html><html><head><title>' + esc(title) + '</title>' +
        '<style>body{font:13px -apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;padding:32px;}' +
        'h1{font-size:20px;margin:0 0 4px;}h2{font-size:14px;color:#475569;margin:18px 0 8px;}' +
        'table{width:100%;border-collapse:collapse;margin:10px 0;}' +
        'th,td{border:1px solid #e2e8f0;padding:6px 8px;text-align:left;font-size:11px;}' +
        'th{background:#f1f5f9;font-weight:600;}.muted{color:#64748b;}' +
        '@media print{button{display:none;}}</style></head><body>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0ea5b7;padding-bottom:10px;margin-bottom:16px;">' +
        '<div><h1>' + esc(title) + '</h1><div class="muted">Tangent Insight · ' + new Date().toLocaleString("en-GB") + '</div></div>' +
        '</div>' + htmlBody +
        '<script>window.onload=function(){setTimeout(function(){window.print();},300);}<\/script>' +
        '</body></html>'
      );
      w.document.close();
      return true;
    } catch (e) { toast("Print failed", "warning"); return false; }
  }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ---- Toast notifications --------------------------------------------------
  var stack = null;
  function ensureStack() {
    if (stack && document.body.contains(stack)) return stack;
    stack = document.createElement("div");
    stack.id = "ti-toast-stack";
    stack.style.cssText =
      "position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;";
    document.body.appendChild(stack);
    return stack;
  }
  function toast(msg, kind) {
    kind = kind || "info";
    var colors = {
      success: "16 185 129", warning: "245 158 11", danger: "239 68 68", info: "14 165 183",
    };
    var c = colors[kind] || colors.info;
    var el = document.createElement("div");
    var reduce = window.TI_MOTION && window.TI_MOTION.getMode() === "off";
    el.style.cssText =
      "pointer-events:auto;min-width:200px;max-width:340px;padding:11px 14px;border-radius:12px;" +
      "background:rgba(15,23,42,0.94);color:#fff;font:500 12.5px -apple-system,Segoe UI,Roboto,sans-serif;" +
      "box-shadow:0 12px 30px -12px rgba(0,0,0,0.5);border-left:3px solid rgb(" + c + ");" +
      "backdrop-filter:blur(8px);display:flex;align-items:center;gap:10px;" +
      (reduce ? "" : "opacity:0;transform:translateX(20px);transition:opacity .3s,transform .3s;");
    el.innerHTML = '<span style="height:8px;width:8px;border-radius:50%;background:rgb(' + c + ');flex:none;"></span><span>' + esc(msg) + "</span>";
    ensureStack().appendChild(el);
    if (!reduce) requestAnimationFrame(function () { el.style.opacity = "1"; el.style.transform = "translateX(0)"; });
    setTimeout(function () {
      if (!reduce) { el.style.opacity = "0"; el.style.transform = "translateX(20px)"; }
      setTimeout(function () { if (el.parentNode) el.remove(); }, 320);
    }, 2600);
  }

  window.TI_UTIL = {
    download: download, exportCsv: exportCsv, exportJson: exportJson,
    copyText: copyText, printReport: printReport, toast: toast, esc: esc,
  };
})();
