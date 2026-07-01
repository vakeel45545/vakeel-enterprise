import { google, searchconsole_v1 } from 'googleapis';

export interface GscMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * Fetches Google Search Console metrics for a specific URL.
 * 
 * If GOOGLE_APPLICATION_CREDENTIALS_JSON is missing, it intelligently falls back
 * to a simulated mock engine so local development doesn't break.
 */
export async function getUrlMetrics(urlPath: string, daysBack = 30): Promise<GscMetrics | null> {
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const siteUrl = process.env.GSC_SITE_URL; // e.g. "sc-domain:vaakil.com" or "https://vaakil.com/"

  if (!credentialsJson || !siteUrl) {
    console.warn('[GSC] Credentials missing. Returning mock traffic data for:', urlPath);
    // Simulate real-world traffic variance
    const mockImpressions = Math.floor(Math.random() * 5000);
    return {
      clicks: Math.floor(mockImpressions * 0.05), // ~5% CTR
      impressions: mockImpressions,
      ctr: 0.05,
      position: Math.floor(Math.random() * 50) + 1, // Position 1-50
    };
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentialsJson),
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth });

    // Calculate dates
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Format YYYY-MM-DD
    const end = endDate.toISOString().split('T')[0];
    const start = startDate.toISOString().split('T')[0];

    const targetUrl = urlPath.startsWith('http') ? urlPath : `${siteUrl.replace(/\/$/, '')}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;

    const response = await searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate: start,
        endDate: end,
        dimensions: ['page'],
        dimensionFilterGroups: [
          {
            filters: [
              {
                dimension: 'page',
                operator: 'equals',
                expression: targetUrl,
              },
            ],
          },
        ],
      },
    });

    const rows = response.data.rows;
    if (!rows || rows.length === 0) {
      return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    }

    const data = rows[0];
    return {
      clicks: data.clicks || 0,
      impressions: data.impressions || 0,
      ctr: data.ctr || 0,
      position: data.position || 0,
    };
  } catch (error) {
    console.error('[GSC] API Error:', error);
    return null;
  }
}
