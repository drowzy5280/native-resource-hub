import { notFound } from 'next/navigation'
import { cache } from 'react'
import { Tag } from '@/components/Tag'
import { BannerAd } from '@/components/GoogleAdsense'
import { prisma } from '@/lib/prisma'
import { formatDeadline, formatDate } from '@/lib/formatting'
import { Metadata } from 'next'
import { ScholarshipSchema, BreadcrumbSchema } from '@/components/StructuredData'
import { Breadcrumb } from '@/components/Breadcrumb'
import { BrokenLinkWarning } from '@/components/BrokenLinkWarning'

// Cache the scholarship query to avoid duplicate database calls
const getScholarship = cache(async (id: string) => {
  return prisma.scholarship.findUnique({
    where: { id },
  })
})

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const scholarship = await getScholarship(params.id)

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
  // Uses cached query - same request as generateMetadata, no duplicate DB call
  const scholarship = await getScholarship(params.id)

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
        <BannerAd />
      </div>

      <div className="bg-white rounded-earth-lg shadow-card p-8 border border-desert/40">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            {scholarship.amount && (
              <span className="px-4 py-2 text-lg font-semibold rounded-earth bg-gold/20 text-gold-dark border border-gold/40">
                {scholarship.amount}
              </span>
            )}
            {deadlineInfo && !deadlineInfo.isPast && deadlineInfo.daysUntil <= 30 && (
              <Tag label="Closing Soon" variant="clay" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-text mb-4">
            {scholarship.name}
          </h1>
        </div>

        {/* Deadline */}
        {deadlineInfo && !deadlineInfo.isPast && (
          <div className="mb-8 p-4 bg-desert/20 rounded-earth-lg border border-desert/40">
            <h2 className="text-lg font-semibold text-text mb-1">Application Deadline</h2>
            <p className="text-2xl font-bold text-clay-dark mb-1">
              {deadlineInfo.formatted}
            </p>
            <p className="text-text-secondary">
              {deadlineInfo.daysUntil} days remaining
            </p>
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text mb-3">About This Scholarship</h2>
          <p className="text-text-secondary leading-relaxed">
            {scholarship.description}
          </p>
        </div>

        {/* Quick Info Grid */}
        {(scholarship.minGPA || scholarship.recipientsPerYear || scholarship.amountMin || scholarship.tribalEnrollmentReq !== null) && (
          <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {scholarship.minGPA && (
              <div className="bg-desert/10 rounded-earth p-4 border border-desert/30">
                <div className="text-sm text-text-muted mb-1">Minimum GPA</div>
                <div className="text-2xl font-bold text-text">{scholarship.minGPA.toFixed(2)}</div>
              </div>
            )}
            {scholarship.tribalEnrollmentReq !== null && (
              <div className="bg-desert/10 rounded-earth p-4 border border-desert/30">
                <div className="text-sm text-text-muted mb-1">Tribal Enrollment</div>
                <div className="text-lg font-semibold text-text flex items-center gap-2">
                  {scholarship.tribalEnrollmentReq ? (
                    <>
                      <span className="text-success">●</span>
                      Required
                    </>
                  ) : (
                    <>
                      <span className="text-text-muted">●</span>
                      Not Required
                    </>
                  )}
                </div>
              </div>
            )}
            {scholarship.recipientsPerYear && (
              <div className="bg-desert/10 rounded-earth p-4 border border-desert/30">
                <div className="text-sm text-text-muted mb-1">Annual Awards</div>
                <div className="text-2xl font-bold text-text">{scholarship.recipientsPerYear}</div>
              </div>
            )}
            {(scholarship.amountMin || scholarship.amountMax) && (
              <div className="bg-desert/10 rounded-earth p-4 border border-desert/30">
                <div className="text-sm text-text-muted mb-1">Award Range</div>
                <div className="text-lg font-semibold text-text">
                  {scholarship.amountMin && scholarship.amountMax
                    ? `$${scholarship.amountMin.toLocaleString()} - $${scholarship.amountMax.toLocaleString()}`
                    : scholarship.amountMin
                    ? `From $${scholarship.amountMin.toLocaleString()}`
                    : scholarship.amountMax
                    ? `Up to $${scholarship.amountMax.toLocaleString()}`
                    : 'Varies'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Video Tutorial */}
        {scholarship.videoUrl && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">Application Guide Video</h2>
            <div className="aspect-video rounded-earth overflow-hidden bg-desert/20">
              <iframe
                src={scholarship.videoUrl}
                title={`${scholarship.name} application guide`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Eligibility */}
        {scholarship.eligibility.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">Eligibility Requirements</h2>
            <ul className="space-y-2">
              {scholarship.eligibility.map((req, index) => (
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

        {/* Specific Majors */}
        {scholarship.specificMajors && scholarship.specificMajors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">Eligible Majors/Fields of Study</h2>
            <div className="flex flex-wrap gap-2">
              {scholarship.specificMajors.map((major) => (
                <span
                  key={major}
                  className="px-4 py-2 bg-pine/10 text-pine-dark border border-pine/30 rounded-earth font-medium text-sm"
                >
                  {major}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Application Requirements */}
        {(scholarship.essayRequired || scholarship.letterOfRecRequired) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">Application Requirements</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {scholarship.essayRequired && (
                <div className="bg-clay/10 rounded-earth p-4 border border-clay/30">
                  <div className="flex items-center gap-2 text-clay-dark font-semibold mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Essay Required
                  </div>
                  <p className="text-sm text-text-secondary">You will need to submit an essay as part of your application</p>
                </div>
              )}
              {scholarship.letterOfRecRequired && scholarship.letterOfRecRequired > 0 && (
                <div className="bg-clay/10 rounded-earth p-4 border border-clay/30">
                  <div className="flex items-center gap-2 text-clay-dark font-semibold mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {scholarship.letterOfRecRequired} Letter{scholarship.letterOfRecRequired > 1 ? 's' : ''} of Recommendation
                  </div>
                  <p className="text-sm text-text-secondary">
                    You will need {scholarship.letterOfRecRequired} letter{scholarship.letterOfRecRequired > 1 ? 's' : ''} of recommendation
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Application Process */}
        {scholarship.applicationProcess && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">How to Apply</h2>
            <div className="bg-pine/5 rounded-earth p-6 border border-pine/20">
              <div className="whitespace-pre-line text-text-secondary leading-relaxed">
                {scholarship.applicationProcess}
              </div>
            </div>
          </div>
        )}

        {/* Required Documents */}
        {scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">Required Documents</h2>
            <div className="bg-white rounded-earth border-2 border-desert/40 divide-y divide-desert/30">
              {scholarship.requiredDocuments.map((doc, index) => (
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

        {/* Renewal Eligibility */}
        {scholarship.renewalEligibility && (
          <div className="mb-8">
            <div className="bg-success/10 rounded-earth p-6 border-l-4 border-success">
              <h3 className="text-lg font-semibold text-text mb-2 flex items-center gap-2">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Renewable Scholarship
              </h3>
              <p className="text-text-secondary">
                This scholarship may be renewed for multiple years. Check the application guidelines for renewal criteria.
              </p>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {(scholarship.contactPhone || scholarship.contactEmail) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-3">Contact Information</h2>
            <div className="bg-white rounded-earth border border-desert/40 p-6 space-y-4">
              {scholarship.contactPhone && (
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-pine flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <div className="text-sm text-text-muted">Phone</div>
                    <a href={`tel:${scholarship.contactPhone}`} className="text-pine hover:underline font-medium">
                      {scholarship.contactPhone}
                    </a>
                  </div>
                </div>
              )}
              {scholarship.contactEmail && (
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-pine flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-sm text-text-muted">Email</div>
                    <a href={`mailto:${scholarship.contactEmail}`} className="text-pine hover:underline font-medium">
                      {scholarship.contactEmail}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {scholarship.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>

        {/* Apply Button */}
        {scholarship.url && (
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={scholarship.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-gold text-white rounded-earth-lg font-semibold text-lg hover:bg-gold-dark transition-colors shadow-soft"
              >
                Apply Now ↗
              </a>
              <BrokenLinkWarning
                url={scholarship.url}
                lastVerified={scholarship.lastVerified}
              />
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="border-t border-desert/40 pt-6 text-sm text-text-muted">
          <p>Last updated: {formatDate(scholarship.updatedAt)}</p>
          {scholarship.source && <p>Source: {scholarship.source}</p>}
        </div>
      </div>

      {/* Ad Unit */}
      <div className="mt-8 flex justify-center">
        <BannerAd />
      </div>
    </div>
  )
}
