/**
 * Normalizes URLs to ensure consistency and prevent routing errors.
 * Example: '/Services/GST' -> '/services/gst'
 */
export function normalizeUrl(url: string | null | undefined): string {
  if (!url) return '/';
  
  // Lowercase the URL and trim spaces
  let normalized = url.toLowerCase().trim();
  
  // Ensure starts with a slash if it's a relative path and not a hash
  if (!normalized.startsWith('http') && !normalized.startsWith('/') && !normalized.startsWith('#')) {
    normalized = '/' + normalized;
  }
  
  // Remove trailing slash except for root
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  
  return normalized;
}
