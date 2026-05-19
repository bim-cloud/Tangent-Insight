namespace TangentInsightAgent.Services;

/// <summary>
/// Resolves the unique-per-human Windows identity. In a managed AD environment
/// every person has a distinct domain account even when an Autodesk license is
/// shared between people, so this — not the Autodesk email — is the reliable
/// identity key. Uses only Environment (no NuGet / DirectoryServices needed):
/// "DOMAIN\sam" for domain accounts, "MACHINE\sam" for local accounts.
/// </summary>
public static class IdentityHelper
{
    public static string WindowsAccount()
    {
        try
        {
            var domain = Environment.UserDomainName;
            var user   = Environment.UserName;
            return string.IsNullOrWhiteSpace(domain) ? user : $"{domain}\\{user}";
        }
        catch { return Environment.UserName; }
    }
}
