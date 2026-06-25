import { getDistinctBlogCategories } from '@/lib/api/services';

export const dynamic = 'force-dynamic';

function escapeXml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET() {
  const baseUrl = process.env.APP_URL || 'https://vakeel.com';
  const categories = await getDistinctBlogCategories();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const category of categories) {
    const slug = category.toLowerCase().replace(/\s+/g, '-');
    xml += `
  <url>
    <loc>${escapeXml(`${baseUrl}/blog/category/${slug}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
