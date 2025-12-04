import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Tag } from '@/components/Tag'
import { AdUnit } from '@/components/GoogleAdsense'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/formatting'
import { Metadata } from 'next'
import { ArticleSchema, BreadcrumbSchema } from '@/components/StructuredData'
import { Breadcrumb } from '@/components/Breadcrumb'
import { VerificationBadge } from '@/components/VerificationBadge'
import { ReportOutdatedButton } from '@/components/ReportOutdatedButton'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
    include: {
      tribe: {
        select: { name: true },
      },
    },
  })

  if (!resource || resource.deletedAt) {
    return {
      title: 'Resource Not Found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'
  const pageUrl = `${baseUrl}/resources/${params.id}`

  const description = resource.description.length > 160
    ? `${resource.description.substring(0, 157)}...`
    : resource.description

  const keywords = [
    'Native American',
    'Indigenous',
    resource.type,
    ...resource.tags,
    resource.tribe?.name,
    resource.state,
  ].filter((k): k is string => Boolean(k))

  return {
    title: `${resource.title} | Tribal Resource Hub`,
    description,
    keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: resource.title,
      description,
      url: pageUrl,
      siteName: 'Tribal Resource Hub',
      locale: 'en_US',
      type: 'article',
      publishedTime: resource.createdAt.toISOString(),
      modifiedTime: resource.updatedAt.toISOString(),
      tags: resource.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: resource.title,
      description,
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

export default async function ResourceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
    include: {
      tribe: true,
    },
  })

  if (!resource || resource.deletedAt) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'
  const pageUrl = `${baseUrl}/resources/${params.id}`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ArticleSchema
        title={resource.title}
        description={resource.description}
        datePublished={resource.createdAt.toISOString()}
        dateModified={resource.updatedAt.toISOString()}
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Resources', url: '/resources' },
          { name: resource.title, url: `/resources/${params.id}` },
        ]}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Resources', href: '/resources' },
          { label: resource.title },
        ]}
      />

      {/* Ad Unit */}
      <div className="mb-8 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '728px' }} />
      </div>

      <div className="bg-white rounded-earth-lg shadow-card p-8 border border-desert/40">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag label={resource.type} variant="pine" />
            {resource.state && <Tag label={resource.state} variant="clay" />}
          </div>
          <h1 className="text-4xl font-bold text-text mb-4">
            {resource.title}
          </h1>

          {/* Verification Status and Report Button */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-desert/30">
            <VerificationBadge
              lastVerified={resource.lastVerified}
              verifiedBy={resource.verifiedBy}
            />
            <ReportOutdatedButton
              resourceId={resource.id}
              resourceTitle={resource.title}
              compact
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text mb-3">Description</h2>
          <p className="text-text-secondary leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Quick Info Grid */}
        {(resource.difficulty || resource.processingTime || resource.averageAward || resource.recipientsPerYear) && (
          <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resource.difficulty && (
              <div className="bg-desert/10 rounded-earth p-4 border border-desert/30">
                <div className="text-sm text-text-muted mb-1">Difficulty</div>
                <div className="text-lg font-semibold text-text capitalize flex items-center gap-2">
                  {resource.difficulty === 'simple' && <span className="text-success">●</span>}
                  {resource.difficulty === 'moderate' && <span className="text-warning">●</span>}
                  {resource.difficulty === 'complex' && <span className="text-error">●</span>}
                  {resource.difficulty}
                </div>
              </div>
            )}
            {resource.processingTime && (
              <div className="bg-desert/10 rounded-earth p-4 border border-desert/30">
                <div className="text-sm text-text-muted mb-1">Processing Time</div>
                <div className="text-lg font-semibold text-text">{resource.processingTime}</div>
              </div>
            )}
            {resource.averageAward && (
              <div className="bg-desert/10 rounded-earth p-4 border border-desert/30">
                <div className="text-sm text-text-muted mb-1">Average Award</div>
                <div className="text-lg font-semibold text-text">{resource.averageAward}</div>
              </div>
            )}
            {resource.recipientsPerYear && (
              <div className="bg-desert/10 rounded-earth p-4 border border-desert/30">
                <div className="text-sm text-text-muted mb-1">Annual Recipients</div>
                <div className="text-lg font-semibold text-text">{resource.recipientsPerYear.toLocaleString()}</div>
              </div>
            )}
          </div>
        )}

        {/* Video Tutorial */}
        {resource.videoUrl && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">Video Guide</h2>
            <div className="aspect-video rounded-earth overflow-hidden bg-desert/20">
              <iframe
                src={resource.videoUrl}
                title={`${resource.title} video guide`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Eligibility */}
        {resource.eligibility.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">Eligibility Requirements</h2>
            <ul className="space-y-2">
              {resource.eligibility.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-text-secondary">
                  <svg className="w-5 h-5 text-pine flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Application Process */}
        {resource.applicationProcess && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">How to Apply</h2>
            <div className="bg-pine/5 rounded-earth p-6 border border-pine/20">
              <div className="whitespace-pre-line text-text-secondary leading-relaxed">
                {resource.applicationProcess}
              </div>
            </div>
          </div>
        )}

        {/* Required Documents */}
        {resource.requiredDocuments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">Required Documents</h2>
            <div className="bg-white rounded-earth border-2 border-desert/40 divide-y divide-desert/30">
              {resource.requiredDocuments.map((doc, index) => (
                <div key={index} className="px-6 py-4 flex items-start gap-3">
                  <svg className="w-6 h-6 text-clay flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-text-secondary">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Renewal Information */}
        {(resource.renewalRequired || resource.renewalDeadline) && (
          <div className="mb-8">
            <div className="bg-warning/10 rounded-earth p-6 border-l-4 border-warning">
              <h3 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Renewal Required
              </h3>
              <p className="text-text-secondary">
                {resource.renewalRequired && 'This benefit requires periodic renewal. '}
                {resource.renewalDeadline && `Next renewal deadline: ${formatDate(resource.renewalDeadline)}`}
              </p>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {(resource.contactPhone || resource.contactEmail || resource.officeHours) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">Contact Information</h2>
            <div className="bg-white rounded-earth border border-desert/40 p-6 space-y-4">
              {resource.contactPhone && (
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-pine flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <div className="text-sm text-text-muted">Phone</div>
                    <a href={`tel:${resource.contactPhone}`} className="text-pine hover:underline font-medium">
                      {resource.contactPhone}
                    </a>
                  </div>
                </div>
              )}
              {resource.contactEmail && (
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-pine flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-sm text-text-muted">Email</div>
                    <a href={`mailto:${resource.contactEmail}`} className="text-pine hover:underline font-medium">
                      {resource.contactEmail}
                    </a>
                  </div>
                </div>
              )}
              {resource.officeHours && (
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-pine flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-text-muted">Office Hours</div>
                    <div className="text-text-secondary font-medium">{resource.officeHours}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Language Support */}
        {resource.languageSupport.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">Language Support</h2>
            <div className="flex flex-wrap gap-2">
              {resource.languageSupport.map((language) => (
                <span
                  key={language}
                  className="px-4 py-2 bg-info/10 text-info-dark border border-info/30 rounded-earth font-medium text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>

        {/* Tribe */}
        {resource.tribe && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">Tribe</h2>
            <Link
              href={`/tribes/${resource.tribe.id}`}
              className="text-pine hover:text-pine-dark hover:underline text-lg font-medium"
            >
              {resource.tribe.name}
            </Link>
          </div>
        )}

        {/* Links */}
        <div className="mb-8">
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-pine text-white rounded-earth font-medium hover:bg-pine-dark transition-colors shadow-soft"
            >
              Visit Official Website ↗
            </a>
          )}
        </div>

        {/* Meta */}
        <div className="border-t border-desert/40 pt-6 text-sm text-text-muted">
          <p>Last updated: {formatDate(resource.updatedAt)}</p>
          {resource.source && <p>Source: {resource.source}</p>}
        </div>
      </div>

      {/* Ad Unit */}
      <div className="mt-8 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '728px' }} />
      </div>
    </div>
  )
}
