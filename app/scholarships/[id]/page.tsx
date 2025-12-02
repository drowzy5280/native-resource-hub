import { notFound } from 'next/navigation'
import { Tag } from '@/components/Tag'
import { AdUnit } from '@/components/GoogleAdsense'
import { prisma } from '@/lib/prisma'
import { formatDeadline, formatDate } from '@/lib/formatting'
import { Metadata } from 'next'
import { ScholarshipSchema, BreadcrumbSchema } from '@/components/StructuredData'
import { Breadcrumb } from '@/components/Breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const scholarship = await prisma.scholarship.findUnique({
    where: { id: params.id },
  })

  if (!scholarship || scholarship.deletedAt) {
    return {
      title: 'Scholarship Not Found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'
  const pageUrl = `${baseUrl}/scholarships/${params.id}`

  const description = scholarship.description.length > 160
    ? `${scholarship.description.substring(0, 157)}...`
    : scholarship.description

  const amountText = scholarship.amount ? `${scholarship.amount} scholarship` : 'Scholarship'
  const deadlineText = scholarship.deadline
    ? ` - Deadline: ${scholarship.deadline.toLocaleDateString()}`
    : ''

  const keywords = [
    'Native American scholarship',
    'Indigenous scholarship',
    'tribal scholarship',
    'college funding',
    ...scholarship.tags,
    scholarship.amount,
  ].filter((k): k is string => Boolean(k))

  return {
    title: `${scholarship.name} | ${amountText} | Tribal Resource Hub`,
    description: `${description}${deadlineText}`,
    keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: scholarship.name,
      description: `${amountText}. ${description}`,
      url: pageUrl,
      siteName: 'Tribal Resource Hub',
      locale: 'en_US',
      type: 'article',
      publishedTime: scholarship.createdAt.toISOString(),
      modifiedTime: scholarship.updatedAt.toISOString(),
      tags: scholarship.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: scholarship.name,
      description: `${amountText}. ${description}`,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  }
}

export default async function ScholarshipDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const scholarship = await prisma.scholarship.findUnique({
    where: { id: params.id },
  })

  if (!scholarship || scholarship.deletedAt) {
    notFound()
  }

  const deadlineInfo = scholarship.deadline ? formatDeadline(scholarship.deadline) : null
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'
  const pageUrl = `${baseUrl}/scholarships/${params.id}`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ScholarshipSchema
        name={scholarship.name}
        description={scholarship.description}
        amount={scholarship.amount}
        deadline={scholarship.deadline}
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Scholarships', url: '/scholarships' },
          { name: scholarship.name, url: `/scholarships/${params.id}` },
        ]}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Scholarships', href: '/scholarships' },
          { label: scholarship.name },
        ]}
      />

      {/* Ad Unit */}
      <div className="mb-8 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '728px' }} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-earth-lg p-8 border border-earth-sand/30 dark:border-white/30">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            {scholarship.amount && (
              <span className="px-4 py-2 text-lg font-semibold rounded-full bg-earth-teal/10 dark:bg-earth-teal/20 text-earth-teal dark:text-earth-teal">
                {scholarship.amount}
              </span>
            )}
            {deadlineInfo && !deadlineInfo.isPast && deadlineInfo.daysUntil <= 30 && (
              <Tag label="Closing Soon" variant="clay" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-earth-brown dark:text-cream mb-4">
            {scholarship.name}
          </h1>
        </div>

        {/* Deadline */}
        {deadlineInfo && !deadlineInfo.isPast && (
          <div className="mb-8 p-4 bg-earth-cream dark:bg-gray-700 rounded-earth-lg">
            <h2 className="text-lg font-semibold text-earth-brown dark:text-cream mb-1">Application Deadline</h2>
            <p className="text-2xl font-bold text-earth-rust dark:text-gold mb-1">
              {deadlineInfo.formatted}
            </p>
            <p className="text-earth-brown/70 dark:text-cream/70">
              {deadlineInfo.daysUntil} days remaining
            </p>
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-earth-brown dark:text-cream mb-3">About This Scholarship</h2>
          <p className="text-earth-brown/80 dark:text-cream/80 leading-relaxed">
            {scholarship.description}
          </p>
        </div>

        {/* Eligibility */}
        {scholarship.eligibility.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-earth-brown dark:text-cream mb-3">Eligibility Requirements</h2>
            <ul className="list-disc list-inside space-y-2">
              {scholarship.eligibility.map((req, index) => (
                <li key={index} className="text-earth-brown/80 dark:text-cream/80">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-earth-brown dark:text-cream mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {scholarship.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>

        {/* Apply Button */}
        {scholarship.url && (
          <div className="mb-8">
            <a
              href={scholarship.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-earth-teal dark:bg-gold text-white rounded-earth-lg font-semibold text-lg hover:bg-earth-teal/90 dark:hover:bg-gold/90 transition-colors"
            >
              Apply Now ↗
            </a>
          </div>
        )}

        {/* Meta */}
        <div className="border-t border-earth-sand dark:border-white/20 pt-6 text-sm text-earth-brown/60 dark:text-cream/60">
          <p>Last updated: {formatDate(scholarship.updatedAt)}</p>
          {scholarship.source && <p>Source: {scholarship.source}</p>}
        </div>
      </div>

      {/* Ad Unit */}
      <div className="mt-8 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '728px' }} />
      </div>
    </div>
  )
}
