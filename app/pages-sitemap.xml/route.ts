import { getAllPublishedPages } from '@/lib/api/services';

export const dynamic = 'force-dynamic';

function escapeXml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET() {
  const baseUrl = process.env.APP_URL || 'https://vakeel.com';
  const pages = await getAllPublishedPages();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(baseUrl)}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  for (const page of (pages || [])) {
    xml += `
  <url>
    <loc>${escapeXml(`${baseUrl}/${page.slug}`)}</loc>
    <lastmod>${new Date(page.updated_at || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  xml += `\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
