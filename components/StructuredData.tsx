export function OrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tribal Resource Hub',
    url: baseUrl,
    logo: `${baseUrl}/icon-512.png`,
    description: 'A community-driven hub connecting Indigenous families, youth, and elders to trusted resources, programs, and support.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English'],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebSiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tribal Resource Hub',
    url: baseUrl,
    description: 'A community-driven hub connecting Indigenous families, youth, and elders to trusted resources, programs, and support.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  url,
}: {
  title: string
  description: string
  datePublished: string
  dateModified: string
  url: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: 'Tribal Resource Hub',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tribal Resource Hub',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon-512.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ScholarshipSchema({
  name,
  description,
  amount,
  deadline,
  url,
}: {
  name: string
  description: string
  amount?: string | null
  deadline?: Date | null
  url: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MonetaryGrant',
    name,
    description,
    ...(amount && { amount: { '@type': 'MonetaryAmount', value: amount } }),
    ...(deadline && { applicationDeadline: deadline.toISOString() }),
    url,
    funder: {
      '@type': 'Organization',
      name: 'Various Tribal and Educational Organizations',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
