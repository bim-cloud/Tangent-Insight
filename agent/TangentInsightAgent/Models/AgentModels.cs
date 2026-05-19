using System.Text.Json.Serialization;

namespace TangentInsightAgent.Models;

public sealed class AgentConfig
{
    public SupabaseCfg Supabase { get; set; } = new();
    public AgentCfg    Agent    { get; set; } = new();

    public sealed class SupabaseCfg
    {
        public string Url     { get; set; } = "";
        public string AnonKey { get; set; } = "";
    }

    public sealed class AgentCfg
    {
        public string   MachineId                     { get; set; } = Environment.MachineName;
        public string   PersonId                      { get; set; } = "";
        public int      SampleIntervalSeconds         { get; set; } = 60;
        public bool     HeartbeatOnlyWhenInteractive  { get; set; } = false;
        public string[] TeamsProcessNames             { get; set; } = { "ms-teams", "Teams" };
        public string   LogLevel                      { get; set; } = "Info";
    }
}

/// <summary>One observation pushed to public.agent_samples.</summary>
public sealed class AgentSample
{
    [JsonPropertyName("machine_id")]       public string  MachineId      { get; set; } = "";
    [JsonPropertyName("host_name")]        public string  HostName       { get; set; } = Environment.MachineName;
    [JsonPropertyName("person_id")]        public string? PersonId       { get; set; }
    [JsonPropertyName("autodesk_user")]    public string? AutodeskUser   { get; set; }
    [JsonPropertyName("windows_user")]     public string  WindowsUser    { get; set; } = Environment.UserName;
    [JsonPropertyName("sampled_at")]       public string  SampledAt      { get; set; } = DateTime.UtcNow.ToString("o");
    [JsonPropertyName("foreground_app")]   public string? ForegroundApp  { get; set; }
    [JsonPropertyName("window_title")]     public string? WindowTitle    { get; set; }
    [JsonPropertyName("idle_ms")]          public long    IdleMs         { get; set; }
    [JsonPropertyName("revit_running")]    public bool    RevitRunning   { get; set; }
    [JsonPropertyName("revit_version")]    public string? RevitVersion   { get; set; }
    [JsonPropertyName("revit_doc")]        public string? RevitDoc       { get; set; }
    [JsonPropertyName("acad_running")]     public bool    AcadRunning    { get; set; }
    [JsonPropertyName("navis_running")]    public bool    NavisRunning   { get; set; }
    [JsonPropertyName("teams_running")]    public bool    TeamsRunning   { get; set; }
    [JsonPropertyName("teams_in_meeting")] public bool    TeamsInMeeting { get; set; }
    [JsonPropertyName("cpu_pct")]          public double? CpuPct         { get; set; }
    [JsonPropertyName("raw")]              public object? Raw            { get; set; }
}
