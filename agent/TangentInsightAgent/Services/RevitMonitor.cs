using System.Diagnostics;

namespace TangentInsightAgent.Services;

public sealed class RevitState
{
    public bool    RevitRunning { get; set; }
    public string? RevitVersion { get; set; }   // R2024 / R2025 ...
    public string? RevitDoc     { get; set; }   // active document / project guess
    public bool    AcadRunning  { get; set; }
    public bool    NavisRunning { get; set; }
}

/// <summary>
/// Detects Autodesk apps by process. Revit version is read from the running
/// EXE's FileVersionInfo (Revit 2024 = 24.x, 2025 = 25.x, 2026 = 26.x). The
/// active document is parsed from Revit's main window title, which Autodesk
/// formats as "  Autodesk Revit 2025 - [DOC - View]".
/// </summary>
public static class RevitMonitor
{
    public static RevitState Scan()
    {
        var s = new RevitState();

        s.AcadRunning  = Process.GetProcessesByName("acad").Length   > 0;
        s.NavisRunning = Process.GetProcessesByName("Roamer").Length > 0;  // Navisworks

        var revit = Process.GetProcessesByName("Revit");
        if (revit.Length == 0) return s;

        s.RevitRunning = true;
        var p = revit[0];

        // ---- version from the EXE ----
        try
        {
            var fv = p.MainModule?.FileVersionInfo;
            int major = fv?.FileMajorPart ?? 0;
            s.RevitVersion = major switch
            {
                >= 26 => "R2026",
                25    => "R2025",
                24    => "R2024",
                23    => "R2023",
                22    => "R2022",
                _     => major > 0 ? $"R{1998 + major}" : null
            };
        }
        catch { /* AnyCPU process module access can fail across bitness */ }

        // ---- active document from window title ----
        try
        {
            var title = p.MainWindowTitle;
            if (!string.IsNullOrWhiteSpace(title))
            {
                s.RevitDoc = ParseDoc(title);
                if (s.RevitVersion is null)
                {
                    foreach (var yr in new[] { "2026", "2025", "2024", "2023", "2022" })
                        if (title.Contains(yr)) { s.RevitVersion = "R" + yr; break; }
                }
            }
        }
        catch { /* ignore */ }

        return s;
    }

    // "Autodesk Revit 2025 - [neom-line-s12-CENTRAL - Floor Plan: L01]"
    //   -> "neom-line-s12-CENTRAL"
    private static string? ParseDoc(string title)
    {
        var open = title.IndexOf('[');
        if (open >= 0)
        {
            var close = title.IndexOf(']', open);
            var inner = close > open ? title[(open + 1)..close] : title[(open + 1)..];
            var dash  = inner.IndexOf(" - ", StringComparison.Ordinal);
            inner = dash > 0 ? inner[..dash] : inner;
            inner = inner.Trim();
            if (inner.Length > 0 && !inner.StartsWith("Autodesk", StringComparison.OrdinalIgnoreCase))
                return inner;
        }
        var seg = title.Split(" - ", StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        return seg.Length >= 2 ? seg[1] : null;
    }
}
