export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';

/**
 * Sitemap index — splits the sitemap into multiple sub-sitemaps for scalability.
 * Google recommends max 50,000 URLs per sitemap file.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://vakeel.com';

  // Return sitemap index entries pointing to sub-sitemaps
  return [
    {
      url: `${baseUrl}/services-sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blogs-sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/pages-sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/categories-sitemap.xml`,
      lastModified: new Date(),
    },
  ];
}
