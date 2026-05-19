using System.Windows;
using TangentInsightAgent.Models;

namespace TangentInsightAgent;

public partial class MainWindow : Window
{
    public MainWindow(AgentConfig cfg)
    {
        InitializeComponent();

        try
        {
            var asm = System.Reflection.Assembly.GetExecutingAssembly();
            using var s = asm.GetManifestResourceStream("TangentInsightAgent.app.ico");
            if (s is not null)
                Icon = System.Windows.Media.Imaging.BitmapFrame.Create(
                    s,
                    System.Windows.Media.Imaging.BitmapCreateOptions.None,
                    System.Windows.Media.Imaging.BitmapCacheOption.OnLoad);
        }
        catch { /* keep default window icon */ }

        MachineText.Text  = $"Machine: {cfg.Agent.MachineId}" +
                            (string.IsNullOrWhiteSpace(cfg.Agent.PersonId)
                               ? "  (unmapped)"
                               : $"  →  {cfg.Agent.PersonId}");
        EndpointText.Text = $"Endpoint: {cfg.Supabase.Url}";

        var configured = !cfg.Supabase.Url.Contains("YOUR-PROJECT") &&
                         cfg.Supabase.AnonKey != "YOUR-ANON-KEY";
        HintText.Text = configured
            ? "Sampling Revit / Autodesk / Teams activity on the configured interval."
            : "⚠ Edit appsettings.json — set your Supabase URL and anon key, then restart the agent.";
    }

    public void SetStatus(string status, int queued)
    {
        StatusText.Text = status;
        QueueText.Text  = queued == 0 ? "Queue: 0 pending"
                                      : $"Queue: {queued} pending (offline backlog)";
    }
}
