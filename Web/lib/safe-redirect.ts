/**
 * Sanitize redirect URLs to prevent open-redirect vulnerabilities.
 * Only allows internal paths that start with a single "/" and not "//".
 */
export function getSafeRedirectUrl(url?: string | null, fallback = "/"): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes("://")) {
    return trimmed;
  }
  return fallback;
}
