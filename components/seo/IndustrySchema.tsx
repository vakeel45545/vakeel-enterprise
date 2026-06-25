interface IndustrySchemaProps {
  name: string;
  description?: string | null;
  url: string;
  imageUrl?: string | null;
}

export function IndustrySchema({ name, description, url, imageUrl }: IndustrySchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${name} Industry Solutions`,
    description: description || `Legal and compliance solutions tailored for the ${name} industry.`,
    url,
    ...(imageUrl && { primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl } }),
    about: {
      '@type': 'Thing',
      name,
    },
    provider: {
      '@type': 'Organization',
      name: 'Vakeel',
      url: process.env.APP_URL || 'https://vakeel.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
