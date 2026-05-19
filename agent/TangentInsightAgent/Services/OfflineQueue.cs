using System.Collections.Concurrent;
using System.IO;
using System.Text.Json;
using TangentInsightAgent.Models;

namespace TangentInsightAgent.Services;

/// <summary>
/// Durable FIFO queue for samples that could not be delivered (laptop offline,
/// VPN drop, Supabase 5xx). Flushed in order on the next successful round-trip
/// so no attendance/activity is lost when an engineer works disconnected.
/// </summary>
public sealed class OfflineQueue
{
    private readonly string _dir =
        Path.Combine(AppContext.BaseDirectory, "queue");
    private readonly ConcurrentQueue<string> _files = new();

    public int Count => _files.Count;

    public OfflineQueue()
    {
        Directory.CreateDirectory(_dir);
        foreach (var f in Directory.GetFiles(_dir, "*.json").OrderBy(f => f))
            _files.Enqueue(f);
        if (_files.Count > 0) Log.Info($"OfflineQueue restored {_files.Count} pending sample(s).");
    }

    public void Enqueue(AgentSample sample)
    {
        try
        {
            var name = Path.Combine(_dir,
                $"{DateTime.UtcNow:yyyyMMddHHmmssfff}-{Guid.NewGuid():N}.json");
            File.WriteAllText(name, JsonSerializer.Serialize(sample));
            _files.Enqueue(name);

            // safety cap: keep the most recent 5000 only
            while (_files.Count > 5000 && _files.TryDequeue(out var old))
                TryDelete(old);
        }
        catch (Exception ex) { Log.Error($"Enqueue failed: {ex.Message}"); }
    }

    /// <summary>Replay queued samples using <paramref name="sender"/> until one fails.</summary>
    public async Task FlushAsync(Func<AgentSample, Task<bool>> sender)
    {
        while (_files.TryPeek(out var path))
        {
            AgentSample? sample = null;
            try
            {
                if (File.Exists(path))
                    sample = JsonSerializer.Deserialize<AgentSample>(File.ReadAllText(path));
            }
            catch { /* corrupt entry: drop it */ }

            if (sample is null) { _files.TryDequeue(out _); TryDelete(path); continue; }

            if (await sender(sample))
            {
                _files.TryDequeue(out _);
                TryDelete(path);
            }
            else
            {
                break;  // still offline; keep order, retry next cycle
            }
        }
    }

    private static void TryDelete(string p)
    {
        try { if (File.Exists(p)) File.Delete(p); } catch { /* ignore */ }
    }
}
