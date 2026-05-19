using System.IO;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace TangentInsightAgent.Services;

/// <summary>
/// Resolves the signed-in Autodesk user email. Autodesk has changed this file
/// across versions (legacy JSON token store -> newer XML LoginState). We probe
/// the known locations and parse whatever format is present, falling back to
/// the Windows account if nothing is found.
/// </summary>
public static class AutodeskIdentity
{
    private static readonly Regex EmailRx =
        new(@"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public static string? ResolveEmail()
    {
        var local   = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        var roaming = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);

        string[] candidates =
        {
            Path.Combine(local,   @"Autodesk\Web Services\LoginState.xml"),
            Path.Combine(local,   @"Autodesk\Identity Services\login.xml"),
            Path.Combine(roaming, @"Autodesk\ADPSSO\state.json"),
            Path.Combine(local,   @"Autodesk\Web Services\AdSSO.dat"),
        };

        foreach (var path in candidates)
        {
            try
            {
                if (!File.Exists(path)) continue;
                var text  = File.ReadAllText(path);
                var email = path.EndsWith(".xml", StringComparison.OrdinalIgnoreCase)
                            ? FromXml(text) ?? FirstEmail(text)
                            : FromJson(text) ?? FirstEmail(text);

                if (!string.IsNullOrWhiteSpace(email))
                {
                    Log.Info($"Autodesk identity: {email} (from {Path.GetFileName(path)})");
                    return email;
                }
            }
            catch (Exception ex) { Log.Warn($"Identity probe failed {path}: {ex.Message}"); }
        }

        Log.Info("Autodesk identity not found; falling back to Windows user.");
        return null;
    }

    private static string? FromXml(string xml)
    {
        try
        {
            var doc = XDocument.Parse(xml);
            foreach (var name in new[] { "UserName", "Email", "userId", "LoginId", "user" })
            {
                var el = doc.Descendants()
                            .FirstOrDefault(e => string.Equals(e.Name.LocalName, name,
                                                 StringComparison.OrdinalIgnoreCase));
                if (el is not null && EmailRx.IsMatch(el.Value)) return el.Value.Trim();
            }
        }
        catch { /* not well-formed; fall through to regex */ }
        return null;
    }

    private static string? FromJson(string json)
    {
        try
        {
            using var d = JsonDocument.Parse(json);
            foreach (var key in new[] { "email", "userName", "user_name", "login", "preferred_username" })
                if (d.RootElement.TryGetProperty(key, out var v) &&
                    v.ValueKind == JsonValueKind.String)
                {
                    var s = v.GetString();
                    if (!string.IsNullOrWhiteSpace(s) && EmailRx.IsMatch(s)) return s;
                }
        }
        catch { /* not JSON; fall through */ }
        return null;
    }

    private static string? FirstEmail(string blob)
    {
        var m = EmailRx.Match(blob);
        return m.Success ? m.Value : null;
    }
}
