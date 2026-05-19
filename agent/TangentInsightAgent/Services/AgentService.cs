using System.Diagnostics;
using TangentInsightAgent.Models;

namespace TangentInsightAgent.Services;

/// <summary>Owns the sampling timer and the collect -> send/queue pipeline.</summary>
public sealed class AgentService : IDisposable
{
    private readonly AgentConfig    _cfg;
    private readonly SupabaseClient _supa;
    private readonly OfflineQueue   _queue = new();
    private readonly CancellationTokenSource _cts = new();

    private string? _autodeskEmail;
    private DateTime _lastIdentityProbe = DateTime.MinValue;

    /// <summary>(statusText, queueDepth) for the tray UI.</summary>
    public event Action<string, int>? StatusChanged;

    public AgentService(AgentConfig cfg)
    {
        _cfg  = cfg;
        _supa = new SupabaseClient(cfg.Supabase);
    }

    public async void Start()
    {
        var version = typeof(AgentService).Assembly.GetName().Version?.ToString() ?? "1.0.0";
        Log.Info($"Tangent Insight Agent {version} starting · machine={_cfg.Agent.MachineId}");

        _autodeskEmail = AutodeskIdentity.ResolveEmail();
        await _supa.RegisterMachineAsync(_cfg.Agent.MachineId,
            NullIfEmpty(_cfg.Agent.PersonId), _autodeskEmail, version);

        var period = TimeSpan.FromSeconds(Math.Max(15, _cfg.Agent.SampleIntervalSeconds));
        _ = Task.Run(() => LoopAsync(period, _cts.Token));
    }

    private async Task LoopAsync(TimeSpan period, CancellationToken ct)
    {
        // First tick immediately, then on the interval.
        while (!ct.IsCancellationRequested)
        {
            try { await TickAsync(); }
            catch (Exception ex) { Log.Error($"Tick failed: {ex.Message}"); }

            try { await Task.Delay(period, ct); }
            catch (TaskCanceledException) { break; }
        }
    }

    private async Task TickAsync()
    {
        // Re-probe Autodesk identity every ~15 min (user may sign in later).
        if ((DateTime.UtcNow - _lastIdentityProbe).TotalMinutes >= 15)
        {
            _autodeskEmail   = AutodeskIdentity.ResolveEmail() ?? _autodeskEmail;
            _lastIdentityProbe = DateTime.UtcNow;
        }

        var (app, title) = FocusIdleTracker.Foreground();
        var idleMs       = FocusIdleTracker.IdleMilliseconds();
        var rv           = RevitMonitor.Scan();
        var (tRun, tMtg) = TeamsMonitor.Scan(_cfg.Agent.TeamsProcessNames);

        var sample = new AgentSample
        {
            MachineId      = _cfg.Agent.MachineId,
            PersonId       = NullIfEmpty(_cfg.Agent.PersonId),
            AutodeskUser   = _autodeskEmail,
            ForegroundApp  = app,
            WindowTitle    = Trim(title, 240),
            IdleMs         = idleMs,
            RevitRunning   = rv.RevitRunning,
            RevitVersion   = rv.RevitVersion,
            RevitDoc       = rv.RevitDoc,
            AcadRunning    = rv.AcadRunning,
            NavisRunning   = rv.NavisRunning,
            TeamsRunning   = tRun,
            TeamsInMeeting = tMtg,
            CpuPct         = SafeCpu(),
            Raw            = new { agent = "win-wpf", interval = _cfg.Agent.SampleIntervalSeconds }
        };

        var ok = await _supa.SendSampleAsync(sample);
        if (ok)
        {
            await _queue.FlushAsync(_supa.SendSampleAsync);   // drain backlog in order
        }
        else
        {
            _queue.Enqueue(sample);
        }

        var idleMin = idleMs / 60000;
        var state   = tMtg ? "In meeting"
                    : idleMin >= 15 ? $"Idle {idleMin}m"
                    : rv.RevitRunning ? $"Revit {rv.RevitVersion} · {rv.RevitDoc ?? "—"}"
                    : "Active";
        StatusChanged?.Invoke(
            $"{(ok ? "Online" : "Offline")} · {state}", _queue.Count);
    }

    private static double? SafeCpu()
    {
        try
        {
            using var p = Process.GetCurrentProcess();
            return Math.Round(p.TotalProcessorTime.TotalMilliseconds /
                   (Environment.ProcessorCount * Environment.TickCount + 1) * 100, 2);
        }
        catch { return null; }
    }

    private static string? NullIfEmpty(string? s) =>
        string.IsNullOrWhiteSpace(s) ? null : s.Trim();

    private static string Trim(string s, int n) =>
        string.IsNullOrEmpty(s) ? s : (s.Length <= n ? s : s[..n]);

    public void Dispose()
    {
        try { _cts.Cancel(); } catch { }
        _cts.Dispose();
        Log.Info("Agent stopped.");
    }
}
