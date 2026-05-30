import type { Metadata } from 'next';

const BASE_URL = process.env.APP_URL || 'https://vakeel.com';
const SITE_NAME = 'Vakeel';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-fallback.jpg`;

export interface SEOInput {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  slug?: string;
  path?: string;
  ogImage?: string | null;
  type?: 'website' | 'article';
  publishedTime?: string | null;
  modifiedTime?: string | null;
  author?: string | null;
  tags?: string[] | null;
  noIndex?: boolean;
  canonicalOverride?: string | null;
  siteName?: string;
}

/**
 * Central enterprise SEO metadata generator.
 * Used by all page types: services, blogs, CMS pages, categories.
 */
export function generateSEOMetadata(input: SEOInput): Metadata {
  const {
    title,
    description,
    keywords,
    slug,
    path,
    ogImage,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    tags,
    noIndex = false,
    canonicalOverride,
    siteName = SITE_NAME,
  } = input;

  const resolvedTitle = title
    ? `${title} | ${siteName}`
    : `${siteName} — AI-Powered Legal & Compliance OS for India`;

  const resolvedDescription =
    description ||
    `Trusted by 50,000+ businesses. Register your company, file GST, get trademarks, and manage compliance with ${siteName}'s AI-powered platform.`;

  const canonicalPath = canonicalOverride || (path ? `${BASE_URL}/${path}` : slug ? `${BASE_URL}/${slug}` : BASE_URL);
  const resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;

  // Build keyword string
  const resolvedKeywords = [
    keywords,
    tags?.join(', '),
    title?.toLowerCase(),
    'vakeel',
    'legal compliance india',
    'company registration',
    'gst filing',
  ]
    .filter(Boolean)
    .join(', ');

  const metadata: Metadata = {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: resolvedKeywords,
    alternates: {
      canonical: canonicalPath,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: title ? `${title} | ${siteName}` : resolvedTitle,
      description: resolvedDescription,
      url: canonicalPath,
      siteName,
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ],
      type,
      ...(type === 'article' && publishedTime
        ? {
            publishedTime,
            modifiedTime: modifiedTime || publishedTime,
            authors: author ? [author] : [`${siteName} Team`],
            tags: tags || [],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${siteName}` : resolvedTitle,
      description: resolvedDescription,
      images: [resolvedOgImage],
      site: '@vakeel',
    },
  };

  return metadata;
}

/**
 * Generate metadata for a service page
 */
export function generateServiceSEO(service: {
  title?: string | null;
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  image?: string | null;
  short_description?: string | null;
}): Metadata {
  const title = service.meta_title || service.title;
  const description = service.meta_description || service.short_description?.replace(/<[^>]*>/g, '').slice(0, 160);
  return generateSEOMetadata({
    title,
    description,
    keywords: service.keywords,
    path: `services/${service.slug}`,
    ogImage: service.image,
    type: 'website',
  });
}

/**
 * Generate metadata for a blog post
 */
export function generateBlogSEO(blog: {
  title?: string | null;
  slug: string;
  category?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  tags?: string[] | null;
  thumbnail?: string | null;
  og_image?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  author?: { name: string } | null;
}): Metadata {
  const title = blog.meta_title || blog.title;
  const description = blog.meta_description;
  const path = blog.category
    ? `blog/category/${blog.category.toLowerCase().replace(/\s+/g, '-')}/${blog.slug}`
    : `blog/${blog.slug}`;
  return generateSEOMetadata({
    title,
    description,
    keywords: blog.tags?.join(', '),
    tags: blog.tags || [],
    path,
    ogImage: blog.og_image || blog.thumbnail,
    type: 'article',
    publishedTime: blog.created_at,
    modifiedTime: blog.updated_at,
    author: blog.author?.name,
  });
}

/**
 * Generate metadata for a CMS page
 */
export function generatePageSEO(page: {
  title: string;
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
}): Metadata {
  return generateSEOMetadata({
    title: page.meta_title || page.title,
    description: page.meta_description,
    keywords: page.keywords,
    path: page.slug,
    ogImage: page.og_image,
    canonicalOverride: page.canonical_url,
    type: 'website',
  });
}

/**
 * Generate metadata for a blog category listing page
 */
export function generateCategorySEO(category: string, count: number): Metadata {
  const formatted = category.charAt(0).toUpperCase() + category.slice(1);
  return generateSEOMetadata({
    title: `${formatted} Articles & Guides`,
    description: `Read ${count} articles about ${formatted} on Vakeel. Expert guides on Indian legal compliance, taxation, and business registration.`,
    keywords: `${category}, legal guides, compliance, india, vakeel, ${formatted.toLowerCase()} articles`,
    path: `blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
    type: 'website',
  });
}
