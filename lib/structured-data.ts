import type { Organization, WebSite, BreadcrumbList, ScholarshipOrGrant } from 'schema-dts'

/**
 * Structured data helpers for SEO
 * Generates JSON-LD structured data for different page types
 */

export function generateOrganizationSchema(): Organization {
  return {
    '@type': 'Organization',
    '@context': 'https://schema.org',
    name: 'Native Resource Hub',
    description: 'Connecting Native communities with resources, scholarships, and tribal programs',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English'],
    },
  }
}

export function generateWebSiteSchema(): WebSite {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'

  return {
    '@type': 'WebSite',
    '@context': 'https://schema.org',
    name: 'Native Resource Hub',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    '@context': 'https://schema.org',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateScholarshipSchema(scholarship: {
  name: string
  description: string
  amount?: string | null
  deadline?: Date | null
  url: string
  eligibility?: string | null
}): ScholarshipOrGrant {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'

  return {
    '@type': 'MonetaryGrant',
    '@context': 'https://schema.org',
    name: scholarship.name,
    description: scholarship.description,
    ...(scholarship.amount && { amount: { '@type': 'MonetaryAmount', value: scholarship.amount } }),
    ...(scholarship.deadline && { applicationDeadline: scholarship.deadline.toISOString() }),
    url: `${baseUrl}${scholarship.url}`,
    ...(scholarship.eligibility && { eligibleRegion: scholarship.eligibility }),
    funder: {
      '@type': 'Organization',
      name: 'Native Resource Hub',
    },
  }
}

export function generateGovernmentServiceSchema(resource: {
  title: string
  description: string
  type: string
  url: string
  state?: string | null
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'

  return {
    '@type': 'GovernmentService',
    '@context': 'https://schema.org',
    name: resource.title,
    description: resource.description,
    url: `${baseUrl}${resource.url}`,
    serviceType: resource.type,
    ...(resource.state && {
      areaServed: {
        '@type': 'State',
        name: resource.state,
      },
    }),
    provider: {
      '@type': 'GovernmentOrganization',
      name: `${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} Government`,
    },
  }
}

/**
 * Helper to inject structured data into page
 */
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
