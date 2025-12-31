import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { Breadcrumb } from '@/components/Breadcrumb'
import { BrokenLinkWarning } from '@/components/BrokenLinkWarning'
import { Tag } from '@/components/Tag'
import { formatDeadline } from '@/lib/formatting'

interface GrantPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: GrantPageProps): Promise<Metadata> {
  const grant = await prisma.grant.findUnique({
    where: { id: params.id, deletedAt: null },
  })

  if (!grant) {
    return {
      title: 'Grant Not Found',
    }
  }

  return {
    title: `${grant.name} | Native American Grants`,
    description: grant.description.slice(0, 160),
    openGraph: {
      title: grant.name,
      description: grant.description.slice(0, 160),
      type: 'article',
    },
  }
}

const grantTypeLabels: Record<string, { label: string; color: string }> = {
  federal: { label: 'Federal Grant', color: 'bg-pine/20 text-pine-dark border-pine/40' },
  state: { label: 'State Grant', color: 'bg-gold/20 text-gold-dark border-gold/40' },
  tribal: { label: 'Tribal Grant', color: 'bg-clay/20 text-clay-dark border-clay/40' },
  foundation: { label: 'Foundation Grant', color: 'bg-stone/20 text-stone-dark border-stone/40' },
  corporate: { label: 'Corporate Grant', color: 'bg-desert-dark/30 text-stone-dark border-desert-dark/40' },
}

export default async function GrantPage({ params }: GrantPageProps) {
  const grant = await prisma.grant.findUnique({
    where: { id: params.id, deletedAt: null },
  })

  if (!grant) {
    notFound()
  }

  const deadlineInfo = grant.deadline ? formatDeadline(grant.deadline) : null
  const typeInfo = grantTypeLabels[grant.grantType] || grantTypeLabels.federal

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Grants', href: '/grants' },
    { label: grant.name },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-4 py-1.5 text-sm font-semibold rounded-earth border ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
          {grant.amount && (
            <span className="px-4 py-1.5 text-sm font-heading font-bold rounded-earth bg-pine/15 text-pine-dark border border-pine/30">
              {grant.amount}
            </span>
          )}
          {deadlineInfo && !deadlineInfo.isPast && deadlineInfo.daysUntil <= 30 && (
            <span className="px-3 py-1 text-xs font-medium rounded-earth bg-clay/15 text-clay-dark border border-clay/30 animate-pulse">
              Closing Soon
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text mb-4">
          {grant.name}
        </h1>

        {grant.fundingAgency && (
          <p className="text-lg text-text-secondary font-medium mb-4">
            Funded by: {grant.fundingAgency}
          </p>
        )}

        {/* Deadline Info */}
        {deadlineInfo && !deadlineInfo.isPast && (
          <div className="p-4 bg-desert/20 rounded-earth-lg border border-desert/40 mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-clay flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-semibold text-text">
                  Application Deadline: {deadlineInfo.formatted}
                </p>
                <p className="text-sm text-text-secondary">
                  {deadlineInfo.daysUntil} days remaining
                </p>
              </div>
            </div>
          </div>
        )}

        {deadlineInfo?.isPast && (
          <div className="p-4 bg-clay/10 rounded-earth-lg border border-clay/30 mb-6">
            <p className="font-semibold text-clay-dark">
              This grant deadline has passed. Check back for future funding cycles.
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Description */}
        <section>
          <h2 className="text-xl font-heading font-semibold text-text mb-4">Description</h2>
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">
            {grant.description}
          </p>
        </section>

        {/* Eligibility */}
        {grant.eligibility.length > 0 && (
          <section>
            <h2 className="text-xl font-heading font-semibold text-text mb-4">Eligibility Requirements</h2>
            <ul className="space-y-2">
              {grant.eligibility.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-pine flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-secondary">{req}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Eligible Applicants */}
        {grant.eligibleApplicants.length > 0 && (
          <section>
            <h2 className="text-xl font-heading font-semibold text-text mb-4">Who Can Apply</h2>
            <div className="flex flex-wrap gap-2">
              {grant.eligibleApplicants.map((applicant, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-desert/30 text-text border border-desert/50 rounded-earth font-medium"
                >
                  {applicant}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Matching Requirements */}
        {grant.matchingRequired && (
          <section>
            <h2 className="text-xl font-heading font-semibold text-text mb-4">Matching Requirements</h2>
            <div className="p-4 bg-gold/10 rounded-earth-lg border border-gold/30">
              <p className="text-text">
                <strong>Cost Share Required:</strong>{' '}
                {grant.matchingPercentage
                  ? `${grant.matchingPercentage}% matching funds required`
                  : 'Matching funds required (percentage varies)'}
              </p>
            </div>
          </section>
        )}

        {/* Required Documents */}
        {grant.requiredDocuments.length > 0 && (
          <section>
            <h2 className="text-xl font-heading font-semibold text-text mb-4">Required Documents</h2>
            <ul className="space-y-2">
              {grant.requiredDocuments.map((doc, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold-dark flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-text-secondary">{doc}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Application Process */}
        {grant.applicationProcess && (
          <section>
            <h2 className="text-xl font-heading font-semibold text-text mb-4">Application Process</h2>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {grant.applicationProcess}
            </p>
          </section>
        )}

        {/* Grant Identifiers */}
        {(grant.cfda || grant.opportunityNumber) && (
          <section>
            <h2 className="text-xl font-heading font-semibold text-text mb-4">Grant Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {grant.cfda && (
                <div className="p-4 bg-desert/20 rounded-earth border border-desert/40">
                  <p className="text-sm text-text-muted mb-1">CFDA Number</p>
                  <p className="font-mono font-medium text-text">{grant.cfda}</p>
                </div>
              )}
              {grant.opportunityNumber && (
                <div className="p-4 bg-desert/20 rounded-earth border border-desert/40">
                  <p className="text-sm text-text-muted mb-1">Opportunity Number</p>
                  <p className="font-mono font-medium text-text">{grant.opportunityNumber}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Contact Information */}
        {(grant.contactEmail || grant.contactPhone) && (
          <section>
            <h2 className="text-xl font-heading font-semibold text-text mb-4">Contact Information</h2>
            <div className="space-y-3">
              {grant.contactEmail && (
                <a
                  href={`mailto:${grant.contactEmail}`}
                  className="flex items-center gap-3 text-pine hover:text-pine-dark transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {grant.contactEmail}
                </a>
              )}
              {grant.contactPhone && (
                <a
                  href={`tel:${grant.contactPhone}`}
                  className="flex items-center gap-3 text-pine hover:text-pine-dark transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {grant.contactPhone}
                </a>
              )}
            </div>
          </section>
        )}

        {/* Tags */}
        {grant.tags.length > 0 && (
          <section>
            <h2 className="text-xl font-heading font-semibold text-text mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {grant.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          </section>
        )}

        {/* Apply Button */}
        {grant.url && (
          <div className="pt-6 border-t border-desert/40">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={grant.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-pine text-white rounded-earth-lg font-semibold text-lg hover:bg-pine-dark transition-colors shadow-soft"
              >
                Apply Now
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <BrokenLinkWarning
                url={grant.url}
                lastVerified={grant.lastVerified}
              />
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="pt-6 border-t border-desert/40 text-sm text-text-muted">
          <p>Last updated: {grant.updatedAt.toLocaleDateString()}</p>
          {grant.source && <p>Source: {grant.source}</p>}
        </div>
      </div>
    </div>
  )
}
