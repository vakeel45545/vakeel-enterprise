import { MetadataRoute } from 'next';
import { getServices, getCities, getBlogs } from '@/lib/api/services';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';

  const [services, cities, blogs] = await Promise.all([
    getServices(),
    getCities(),
    getBlogs(),
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Add services
  services?.forEach((service) => {
    sitemapEntries.push({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(service.updated_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    // Add service + city combinations
    cities?.forEach((city) => {
      sitemapEntries.push({
        url: `${baseUrl}/services/${service.slug}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  // Add blogs
  blogs?.forEach((blog) => {
    sitemapEntries.push({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  return sitemapEntries;
}
