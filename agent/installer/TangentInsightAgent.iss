; ============================================================================
; Tangent Insight Agent — Inno Setup script
; Build the app first:
;   dotnet publish agent/TangentInsightAgent/TangentInsightAgent.csproj ^
;     -c Release -r win-x64 --self-contained false ^
;     -p:PublishSingleFile=true -o agent/publish
; Then compile this .iss with Inno Setup 6.
; ============================================================================

#define AppName    "Tangent Insight Agent"
#define AppVersion "1.0.0"
#define AppPublisher "Tangent Landscape Architecture"
#define AppExe     "TangentInsightAgent.exe"

[Setup]
AppId={{E7C2A4F1-2B3D-4E5A-9C10-TANGENTINSIGHT}}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
DefaultDirName={autopf}\Tangent Insight Agent
DefaultGroupName=Tangent Insight
DisableProgramGroupPage=yes
OutputDir=Output
OutputBaseFilename=TangentInsightAgent-Setup-{#AppVersion}
Compression=lzma2
SolidCompression=yes
PrivilegesRequired=admin
ArchitecturesInstallIn64BitMode=x64compatible
WizardStyle=modern
UninstallDisplayName={#AppName}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "autostart"; Description: "Start automatically when I sign in to Windows"; GroupDescription: "Startup:"; Flags: checkedonce

[Files]
; Publish output (single-file exe + appsettings.json).
Source: "..\publish\{#AppExe}";       DestDir: "{app}"; Flags: ignoreversion
Source: "..\publish\appsettings.json"; DestDir: "{app}"; Flags: onlyifdoesntexist
; If you did NOT use PublishSingleFile, switch the above to:
; Source: "..\publish\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

[Icons]
Name: "{group}\Tangent Insight Agent"; Filename: "{app}\{#AppExe}"
Name: "{group}\Edit configuration";    Filename: "notepad.exe"; Parameters: """{app}\appsettings.json"""
Name: "{group}\Uninstall";             Filename: "{uninstallexe}"

[Registry]
; Per-machine autostart (only if the task is selected).
Root: HKLM; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; \
  ValueType: string; ValueName: "TangentInsightAgent"; \
  ValueData: """{app}\{#AppExe}"""; Flags: uninsdeletevalue; Tasks: autostart

[Run]
Filename: "notepad.exe"; Parameters: """{app}\appsettings.json"""; \
  Description: "Open appsettings.json to set Supabase URL / anon key / MachineId"; \
  Flags: postinstall shellexec skipifsilent
Filename: "{app}\{#AppExe}"; Description: "Launch Tangent Insight Agent"; \
  Flags: postinstall nowait skipifsilent

[UninstallRun]
Filename: "taskkill.exe"; Parameters: "/IM {#AppExe} /F"; Flags: runhidden; RunOnceId: "KillAgent"
