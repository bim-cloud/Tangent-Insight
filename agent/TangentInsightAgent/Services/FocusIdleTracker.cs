using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;

namespace TangentInsightAgent.Services;

/// <summary>Foreground window, owning process and OS idle time via Win32.</summary>
public static class FocusIdleTracker
{
    [StructLayout(LayoutKind.Sequential)]
    private struct LASTINPUTINFO { public uint cbSize; public uint dwTime; }

    [DllImport("user32.dll")] private static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    private static extern int GetWindowText(IntPtr hWnd, StringBuilder s, int n);
    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint pid);
    [DllImport("user32.dll")]
    private static extern bool GetLastInputInfo(ref LASTINPUTINFO p);

    public static long IdleMilliseconds()
    {
        var info = new LASTINPUTINFO { cbSize = (uint)Marshal.SizeOf<LASTINPUTINFO>() };
        if (!GetLastInputInfo(ref info)) return 0;
        return Math.Max(0, Environment.TickCount - (long)info.dwTime);
    }

    public static (string app, string title) Foreground()
    {
        var h = GetForegroundWindow();
        if (h == IntPtr.Zero) return ("", "");

        var sb = new StringBuilder(512);
        GetWindowText(h, sb, sb.Capacity);
        var title = sb.ToString();

        var app = "";
        try
        {
            GetWindowThreadProcessId(h, out var pid);
            if (pid != 0) app = Process.GetProcessById((int)pid).ProcessName;
        }
        catch { /* process may have exited */ }

        return (app, title);
    }
}
