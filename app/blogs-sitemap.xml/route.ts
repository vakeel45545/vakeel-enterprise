import { getBlogs } from '@/lib/api/services';

export const dynamic = 'force-dynamic';

function escapeXml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET() {
  const baseUrl = process.env.APP_URL || 'https://vakeel.com';
  const blogs = await getBlogs();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(baseUrl)}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

  for (const blog of (blogs || [])) {
    xml += `
  <url>
    <loc>${escapeXml(`${baseUrl}/blog/${blog.slug}`)}</loc>
    <lastmod>${new Date(blog.updated_at || Date.now()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
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
