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

export function FAQPageSchema({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string
  description: string
  steps: Array<{ name: string; text: string; url?: string }>
  totalTime?: string // ISO 8601 duration, e.g., "PT30M" for 30 minutes
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: `${baseUrl}${step.url}` }),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocalBusinessSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Tribal Resource Hub',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/icon-512.png`,
      width: 512,
      height: 512,
    },
    description: 'A community-driven hub connecting Indigenous families, youth, and elders to trusted resources, programs, and support.',
    foundingDate: '2024',
    email: 'support@tribalresourcehub.com',
    sameAs: [],
    knowsAbout: [
      'Native American Resources',
      'Indigenous Benefits',
      'Tribal Scholarships',
      'Federal Indian Programs',
      'Bureau of Indian Affairs',
      'Indian Health Service',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function CollectionPageSchema({
  name,
  description,
  url,
  itemCount,
}: {
  name: string
  description: string
  url: string
  itemCount: number
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `${baseUrl}${url}`,
    numberOfItems: itemCount,
    provider: {
      '@type': 'Organization',
      name: 'Tribal Resource Hub',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function GrantSchema({
  name,
  description,
  amount,
  deadline,
  url,
  fundingAgency,
}: {
  name: string
  description: string
  amount?: string | null
  deadline?: Date | null
  url: string
  fundingAgency?: string | null
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MonetaryGrant',
    name,
    description,
    ...(amount && { amount: { '@type': 'MonetaryAmount', value: amount, currency: 'USD' } }),
    ...(deadline && { applicationDeadline: deadline.toISOString() }),
    url,
    ...(fundingAgency && {
      funder: {
        '@type': 'Organization',
        name: fundingAgency,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
