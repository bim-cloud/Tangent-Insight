using System.IO;

namespace TangentInsightAgent.Services;

/// <summary>
/// Writable state MUST live in the per-user profile, not the install folder.
/// Most workstations run the agent as a standard (non-admin) user with the app
/// in Program Files, which is read-only for them — writing logs/queue there
/// would silently fail and break offline durability. %LOCALAPPDATA% is always
/// writable by the logged-in user and is per-user, which is exactly right when
/// several people share a machine under managed profiles.
/// </summary>
public static class AppPaths
{
    public static readonly string DataDir =
        Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "TangentInsightAgent");

    public static string LogDir   => Path.Combine(DataDir, "logs");
    public static string QueueDir => Path.Combine(DataDir, "queue");

    static AppPaths()
    {
        try
        {
            Directory.CreateDirectory(LogDir);
            Directory.CreateDirectory(QueueDir);
        }
        catch { /* best effort; individual writers also guard */ }
    }
}
