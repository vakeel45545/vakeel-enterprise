interface BlogSchemaProps {
  title: string;
  description?: string | null;
  url: string;
  image?: string | null;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authorName?: string | null;
  tags?: string[] | null;
}

export function BlogSchema({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  authorName = 'Vakeel Team',
  tags,
}: BlogSchemaProps) {
  const baseUrl = process.env.APP_URL || 'https://vakeel.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description || title,
    url,
    image: image || `${baseUrl}/og-fallback.jpg`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vakeel',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    keywords: tags?.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
