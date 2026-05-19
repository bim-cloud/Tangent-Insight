using System.IO;
using System.Text.Json;
using TangentInsightAgent.Models;

namespace TangentInsightAgent.Services;

public static class Log
{
    private static readonly object _gate = new();
    private static string _dir => AppPaths.LogDir;
    private static string File =>
        Path.Combine(_dir, $"agent-{DateTime.Now:yyyyMMdd}.log");

    public static void Info (string m) => Write("INFO ", m);
    public static void Warn (string m) => Write("WARN ", m);
    public static void Error(string m) => Write("ERROR", m);

    private static void Write(string lvl, string msg)
    {
        try
        {
            Directory.CreateDirectory(_dir);
            var line = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} [{lvl}] {msg}";
            lock (_gate) System.IO.File.AppendAllText(File, line + Environment.NewLine);
            System.Diagnostics.Debug.WriteLine(line);
        }
        catch { /* logging must never throw */ }
    }
}

public static class ConfigService
{
    public static AgentConfig Load()
    {
        var path = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
        try
        {
            if (File.Exists(path))
            {
                var json = File.ReadAllText(path);
                var cfg  = JsonSerializer.Deserialize<AgentConfig>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    ReadCommentHandling = JsonCommentHandling.Skip,
                    AllowTrailingCommas = true
                });
                if (cfg is not null)
                {
                    if (string.IsNullOrWhiteSpace(cfg.Agent.MachineId))
                        cfg.Agent.MachineId = Environment.MachineName;
                    return cfg;
                }
            }
            Log.Warn($"appsettings.json not found at {path}; using defaults.");
        }
        catch (Exception ex) { Log.Error($"Config load failed: {ex.Message}"); }
        return new AgentConfig { Agent = { MachineId = Environment.MachineName } };
    }
}
