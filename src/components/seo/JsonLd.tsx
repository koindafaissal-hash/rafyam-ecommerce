import { SITE } from '@/lib/site';

export function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Boutique située derrière le siège de SIDWAYA',
      addressLocality: SITE.city,
      addressCountry: 'BF',
    },
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.tiktok],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '17:00' },
    ],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '127' },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}