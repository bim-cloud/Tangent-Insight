using System.Diagnostics;

namespace TangentInsightAgent.Services;

/// <summary>
/// Detects whether Microsoft Teams (classic "Teams" or new "ms-teams") is
/// running and whether the user is in a call/meeting. There is no public local
/// API, so we use the well-known signal: an active call spawns a separate
/// window whose title contains "Meeting"/"Call"/"| Microsoft Teams" with a
/// running timer, distinct from the idle main window.
/// </summary>
public static class TeamsMonitor
{
    private static readonly string[] MeetingHints =
        { "Meeting", "Call with", "| Microsoft Teams Call", "is presenting", "Calling", "Ongoing" };

    public static (bool running, bool inMeeting) Scan(string[] processNames)
    {
        var running  = false;
        var inMeeting = false;

        foreach (var name in processNames)
        {
            Process[] procs;
            try { procs = Process.GetProcessesByName(name); } catch { continue; }
            if (procs.Length == 0) continue;
            running = true;

            foreach (var p in procs)
            {
                string title;
                try { title = p.MainWindowTitle ?? ""; } catch { continue; }
                if (string.IsNullOrWhiteSpace(title)) continue;

                foreach (var hint in MeetingHints)
                    if (title.Contains(hint, StringComparison.OrdinalIgnoreCase))
                    {
                        inMeeting = true;
                        break;
                    }
                if (inMeeting) break;
            }
            if (running) break;
        }

        return (running, inMeeting);
    }
}
