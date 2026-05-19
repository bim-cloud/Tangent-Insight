using System.Drawing;
using System.Windows;
using System.Windows.Forms;
using TangentInsightAgent.Models;
using TangentInsightAgent.Services;
using Application = System.Windows.Application;

namespace TangentInsightAgent;

public partial class App : Application
{
    private Mutex?         _single;
    private NotifyIcon?    _tray;
    private AgentService?  _agent;
    private MainWindow?    _window;
    private AgentConfig    _cfg = new();

    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        _single = new Mutex(true, "TangentInsightAgent.SingleInstance", out var isNew);
        if (!isNew)
        {
            System.Windows.MessageBox.Show("Tangent Insight Agent is already running.",
                "Tangent Insight", MessageBoxButton.OK, MessageBoxImage.Information);
            Shutdown();
            return;
        }

        _cfg = ConfigService.Load();

        _window = new MainWindow(_cfg);
        _window.Closing += (_, args) => { args.Cancel = true; _window!.Hide(); };

        _agent = new AgentService(_cfg);
        _agent.StatusChanged += (text, queued) =>
            Dispatcher.Invoke(() =>
            {
                _window!.SetStatus(text, queued);
                if (_tray is not null)
                    _tray.Text = Trim($"Tangent Insight · {text}", 63);
            });

        BuildTray();
        _agent.Start();

        Log.Info("UI ready (running in tray).");
    }

    private void BuildTray()
    {
        var menu = new ContextMenuStrip();
        menu.Items.Add("Open status", null, (_, _) => ShowWindow());
        menu.Items.Add("View log folder", null, (_, _) =>
        {
            try
            {
                System.Diagnostics.Process.Start("explorer.exe",
                    System.IO.Path.Combine(AppContext.BaseDirectory, "logs"));
            }
            catch { /* ignore */ }
        });
        menu.Items.Add(new ToolStripSeparator());
        menu.Items.Add("Exit", null, (_, _) => ExitApp());

        _tray = new NotifyIcon
        {
            Icon = SystemIcons.Application,
            Visible = true,
            Text = "Tangent Insight Agent",
            ContextMenuStrip = menu
        };
        _tray.DoubleClick += (_, _) => ShowWindow();
    }

    private void ShowWindow()
    {
        _window!.Show();
        _window.WindowState = WindowState.Normal;
        _window.Activate();
    }

    private void ExitApp()
    {
        _agent?.Dispose();
        if (_tray is not null) { _tray.Visible = false; _tray.Dispose(); }
        _single?.ReleaseMutex();
        Shutdown();
    }

    private static string Trim(string s, int n) => s.Length <= n ? s : s[..n];
}
