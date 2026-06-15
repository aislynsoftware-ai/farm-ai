import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://farmlyt.ai';
const DEFAULT_IMAGE = 'https://farmlyt.ai/logo.png';
const SITE_NAME = 'Farmlyt AI';

export default function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  publishedTime,
  author,
  schema,
  noindex = false,
}) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - AI-Powered Smart Agriculture Platform`;
  const pageDesc = description || 'AI-Powered Smart Agriculture Platform for crop disease detection, plant identification, and smart farming insights.';
  const pageUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <link rel="canonical" href={pageUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@farmlytai" />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Farmlyt AI',
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  description: 'AI-Powered Smart Agriculture Platform for crop disease detection, plant identification, and smart farming insights.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-88922 09021',
    contactType: 'customer service',
    email: 'support@farmlyt.ai',
  },
  sameAs: [
    'https://twitter.com/farmlytai',
  ],
};

export function LocalBusinessSchema(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Farmlyt AI',
    url: SITE_URL,
    logo: DEFAULT_IMAGE,
    description: data.description || 'AI-Powered Smart Agriculture Platform',
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address || '',
      addressLocality: data.city || '',
      addressRegion: data.state || '',
      postalCode: data.zip || '',
      addressCountry: data.country || 'IN',
    },
    telephone: data.phone || '',
    email: data.email || 'support@farmlyt.ai',
  };
}

export function BreadcrumbListSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
