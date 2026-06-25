interface LocalBusinessSchemaProps {
  name?: string;
  url?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
}

export function LocalBusinessSchema({
  name = 'Vakeel',
  url,
  phone,
  email,
  address,
  city = 'New Delhi',
  state = 'Delhi',
  postalCode,
  latitude,
  longitude,
  openingHours = 'Mo-Sa 09:00-19:00',
}: LocalBusinessSchemaProps) {
  const baseUrl = url || process.env.APP_URL || 'https://vakeel.com';

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name,
    url: baseUrl,
    image: `${baseUrl}/logo.png`,
    description: `${name} provides AI-powered legal and compliance services including company registration, GST filing, trademark registration, and annual compliance for businesses across India.`,
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      ...(address && { streetAddress: address }),
      addressLocality: city,
      addressRegion: state,
      ...(postalCode && { postalCode }),
      addressCountry: 'IN',
    },
    ...(latitude && longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude,
        longitude,
      },
    }),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    serviceType: [
      'Company Registration',
      'GST Registration',
      'Trademark Registration',
      'Tax Filing',
      'Legal Compliance',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
