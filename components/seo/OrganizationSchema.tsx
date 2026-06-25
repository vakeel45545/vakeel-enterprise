interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: Record<string, string> | null;
}

export function OrganizationSchema({
  name = 'Vakeel',
  url,
  logo,
  phone,
  email,
  address,
  socialLinks,
}: OrganizationSchemaProps) {
  const baseUrl = url || process.env.APP_URL || 'https://vakeel.com';

  const sameAs: string[] = [];
  if (socialLinks) {
    Object.values(socialLinks).forEach((link) => {
      if (typeof link === 'string' && link.startsWith('http')) {
        sameAs.push(link);
      }
    });
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: baseUrl,
    logo: logo || `${baseUrl}/logo.png`,
    description: `${name} is India's leading AI-powered legal and compliance platform. Register your company, file GST, get trademarks, and manage compliance.`,
    foundingCountry: 'IN',
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address,
        addressCountry: 'IN',
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      ...(phone && { telephone: phone }),
      ...(email && { email }),
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'IN',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
