# Tangent Insight Agent

Windows tray application (.NET 8 / WPF, **zero NuGet dependencies**) that
samples each workstation and pushes observations to Supabase.

## What it collects (per interval, default 60 s)

| Signal | How |
|--------|-----|
| Revit running + version + active document | process scan + `FileVersionInfo` + window-title parse (R2022–R2026) |
| AutoCAD / Navisworks running | process scan (`acad`, `Roamer`) |
| Foreground app + window title | Win32 `GetForegroundWindow` |
| Idle time | Win32 `GetLastInputInfo` |
| Microsoft Teams meeting state | process + window-title heuristic (classic & new Teams) |
| Autodesk identity (email) | reads `LoginState.xml` / legacy JSON token store |

The server-side trigger (`0004_agent_ingestion.sql`) turns these raw samples
into `people.status`, daily `attendance`, and `activity_events`
(login / open / teams transitions), all in **Asia/Dubai** time.

## Build

```bash
cd agent
dotnet publish TangentInsightAgent/TangentInsightAgent.csproj ^
  -c Release -r win-x64 --self-contained false ^
  -p:PublishSingleFile=true -o publish
```

Produces `publish/TangentInsightAgent.exe` + `publish/appsettings.json`.
(Requires the .NET 8 Desktop Runtime on target machines, or drop
`--self-contained false` for a standalone build.)

## Configure (`appsettings.json`)

```jsonc
{
  "Supabase": { "Url": "https://xxxx.supabase.co", "AnonKey": "eyJ..." },
  "Agent": {
    "MachineId": "TLA-DXB-014",   // must match people.machine in Supabase
    "PersonId":  "u01",            // optional: direct map to people.id
    "SampleIntervalSeconds": 60
  }
}
```

If `PersonId` is blank the server keeps raw samples until you map the machine
(set `agent_machines.person_id`, or fill `appsettings.json` and restart).

## Package + deploy firm-wide

1. Build (above) → `agent/publish/`.
2. Open `agent/installer/TangentInsightAgent.iss` in **Inno Setup 6** → Compile.
3. Distribute `agent/installer/Output/TangentInsightAgent-Setup-1.0.0.exe`.
   - Installs to Program Files, optional **autostart on sign-in**.
   - Opens `appsettings.json` post-install for the per-machine `MachineId`.

## Behaviour notes

- **Single instance** (named mutex) — relaunch just focuses the status window.
- **Offline-durable**: failed posts are written to `queue/` and replayed
  in order on the next successful round-trip (laptop/VPN drops lose nothing).
- **Tray-resident**: closing the window keeps it running; Exit from the tray
  menu stops it.
- Logs roll daily under `logs/` next to the exe.
- Re-probes Autodesk identity every ~15 min (covers sign-in after launch).
