interface ServiceSchemaProps {
  name: string;
  description?: string | null;
  url: string;
  provider?: string;
}

export function ServiceSchema({ name, description, url, provider = 'Vakeel' }: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description: description || `Get ${name} completely online with ${provider}.`,
    url,
    provider: {
      '@type': 'Organization',
      name: provider,
      url: process.env.APP_URL || 'https://vakeel.com',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    serviceType: 'Legal & Compliance Service',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
