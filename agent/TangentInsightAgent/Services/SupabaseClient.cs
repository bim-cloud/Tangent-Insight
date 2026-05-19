using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using TangentInsightAgent.Models;

namespace TangentInsightAgent.Services;

/// <summary>
/// Thin PostgREST client. The agent only ever INSERTs into public.agent_samples
/// and upserts public.agent_machines — RLS (migration 0004) makes the anon key
/// safe to embed because it has no read access to workforce data.
/// </summary>
public sealed class SupabaseClient
{
    private readonly HttpClient _http;
    private readonly string _base;
    private readonly string _key;

    public SupabaseClient(AgentConfig.SupabaseCfg cfg)
    {
        _base = cfg.Url.TrimEnd('/');
        _key  = cfg.AnonKey;
        _http = new HttpClient { Timeout = TimeSpan.FromSeconds(15) };
        _http.DefaultRequestHeaders.Add("apikey", _key);
        _http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _key);
    }

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(_base) &&
        !_base.Contains("YOUR-PROJECT") &&
        !string.IsNullOrWhiteSpace(_key) &&
        _key != "YOUR-ANON-KEY";

    public async Task<bool> SendSampleAsync(AgentSample sample)
    {
        if (!IsConfigured) { Log.Warn("Supabase not configured (edit appsettings.json)."); return false; }
        try
        {
            using var resp = await PostAsync("agent_samples", sample, prefer: "return=minimal");
            if (resp.IsSuccessStatusCode) return true;
            Log.Warn($"agent_samples POST -> {(int)resp.StatusCode} {resp.ReasonPhrase}");
            return false;
        }
        catch (Exception ex) { Log.Warn($"SendSample failed: {ex.Message}"); return false; }
    }

    public async Task RegisterMachineAsync(string machineId, string? personId,
                                            string? autodeskUser, string appVersion)
    {
        if (!IsConfigured) return;
        try
        {
            var row = new
            {
                machine_id    = machineId,
                host_name     = Environment.MachineName,
                person_id     = string.IsNullOrWhiteSpace(personId) ? null : personId,
                autodesk_user = autodeskUser,
                agent_version = appVersion,
                os            = Environment.OSVersion.VersionString,
                online        = true,
                last_seen     = DateTime.UtcNow.ToString("o")
            };
            using var resp = await PostAsync("agent_machines", row,
                prefer: "resolution=merge-duplicates,return=minimal");
            if (!resp.IsSuccessStatusCode)
                Log.Warn($"agent_machines upsert -> {(int)resp.StatusCode}");
        }
        catch (Exception ex) { Log.Warn($"RegisterMachine failed: {ex.Message}"); }
    }

    private Task<HttpResponseMessage> PostAsync(string table, object body, string prefer)
    {
        var json = JsonSerializer.Serialize(body);
        var req  = new HttpRequestMessage(HttpMethod.Post, $"{_base}/rest/v1/{table}")
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
        req.Headers.TryAddWithoutValidation("Prefer", prefer);
        return _http.SendAsync(req);
    }
}
