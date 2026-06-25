import { getServices, getCities } from '@/lib/api/services';

export const dynamic = 'force-dynamic';

function escapeXml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET() {
  const baseUrl = process.env.APP_URL || 'https://vakeel.com';

  const [services, cities] = await Promise.all([
    getServices(),
    getCities(),
  ]);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Service pages
  for (const service of (services || [])) {
    xml += `
  <url>
    <loc>${escapeXml(`${baseUrl}/services/${service.slug}`)}</loc>
    <lastmod>${new Date(service.updated_at || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

    // Service × City combinations
    for (const city of (cities || [])) {
      xml += `
  <url>
    <loc>${escapeXml(`${baseUrl}/services/${service.slug}/${city.slug}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }
  }

  xml += `\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
