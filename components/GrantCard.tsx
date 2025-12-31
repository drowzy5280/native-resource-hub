'use client'

import Link from 'next/link'
import { Tag } from './Tag'
import { formatDeadline } from '@/lib/formatting'
import { ShareButton } from './ShareButton'

interface GrantCardProps {
  id: string
  name: string
  description: string
  amount?: string | null
  deadline?: Date | string | null
  tags: string[]
  url?: string | null
  fundingAgency?: string | null
  grantType: string
  eligibleApplicants?: string[]
  matchingRequired?: boolean | null
  matchingPercentage?: number | null
}

const grantTypeLabels: Record<string, { label: string; color: string }> = {
  federal: { label: 'Federal', color: 'bg-pine/20 text-pine-dark border-pine/40' },
  state: { label: 'State', color: 'bg-gold/20 text-gold-dark border-gold/40' },
  tribal: { label: 'Tribal', color: 'bg-clay/20 text-clay-dark border-clay/40' },
  foundation: { label: 'Foundation', color: 'bg-stone/20 text-stone-dark border-stone/40' },
  corporate: { label: 'Corporate', color: 'bg-desert-dark/30 text-stone-dark border-desert-dark/40' },
}

export function GrantCard({
  id,
  name,
  description,
  amount,
  deadline,
  tags,
  url,
  fundingAgency,
  grantType,
  eligibleApplicants = [],
  matchingRequired,
  matchingPercentage,
}: GrantCardProps) {
  const deadlineInfo = deadline ? formatDeadline(deadline) : null
  const isClosingSoon = deadlineInfo && deadlineInfo.daysUntil <= 30 && !deadlineInfo.isPast
  const typeInfo = grantTypeLabels[grantType] || grantTypeLabels.federal

  // Calculate progress bar color and width based on days remaining
  const getProgressInfo = () => {
    if (!deadlineInfo || deadlineInfo.isPast) return null

    const daysUntil = deadlineInfo.daysUntil
    let color = 'bg-pine' // Default: plenty of time
    let width = 100

    // Assume 90 days is full (100%) and calculate percentage
    const maxDays = 90
    width = Math.max(0, Math.min(100, (daysUntil / maxDays) * 100))

    // Color based on urgency
    if (daysUntil <= 7) {
      color = 'bg-clay' // Red/urgent
    } else if (daysUntil <= 30) {
      color = 'bg-gold' // Orange/warning
    } else if (daysUntil <= 60) {
      color = 'bg-gold/70' // Yellow/caution
    } else {
      color = 'bg-pine' // Green/good
    }

    return { color, width }
  }

  const progressInfo = getProgressInfo()

  return (
    <article
      className="bg-white rounded-earth-lg shadow-card p-6 border border-desert/40 hover:border-pine/40 hover:shadow-soft transition-all group"
      aria-labelledby={`grant-title-${id}`}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap" role="list" aria-label="Grant details">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-earth border ${typeInfo.color}`}
              role="listitem"
            >
              {typeInfo.label}
            </span>
            {amount && (
              <span
                className="px-3 py-1.5 text-sm font-heading font-semibold rounded-earth bg-pine/15 text-pine-dark border border-pine/30"
                role="listitem"
                aria-label={`Award amount: ${amount}`}
              >
                {amount}
              </span>
            )}
            {isClosingSoon && (
              <span
                className="px-3 py-1 text-xs font-medium rounded-earth bg-clay/15 text-clay-dark border border-clay/30 animate-pulse"
                role="listitem"
                aria-label="Deadline closing soon"
              >
                Closing Soon
              </span>
            )}
          </div>
        </div>

        <h3
          id={`grant-title-${id}`}
          className="text-xl font-heading font-semibold text-text mb-2 group-hover:text-pine-dark transition-colors line-clamp-2"
        >
          {name}
        </h3>

        {fundingAgency && (
          <p className="text-sm text-text-secondary font-medium mb-2">
            {fundingAgency}
          </p>
        )}
      </div>

      <p className="text-text-secondary mb-4 line-clamp-3 leading-relaxed">
        {description}
      </p>

      {/* Eligible Applicants */}
      {eligibleApplicants.length > 0 && (
        <div className="mb-4 text-sm">
          <span className="font-medium text-text">Eligible: </span>
          <span className="text-text-secondary">
            {eligibleApplicants.slice(0, 3).join(', ')}
            {eligibleApplicants.length > 3 && ` +${eligibleApplicants.length - 3} more`}
          </span>
        </div>
      )}

      {/* Matching Requirement */}
      {matchingRequired && (
        <div className="mb-4 px-3 py-2 bg-gold/10 border border-gold/30 rounded-earth text-sm">
          <span className="font-medium text-gold-dark">
            Matching Required: {matchingPercentage ? `${matchingPercentage}%` : 'Yes'}
          </span>
        </div>
      )}

      {deadlineInfo && !deadlineInfo.isPast && (
        <div
          className="mb-4 p-4 bg-desert/20 rounded-earth border border-desert/40"
          role="region"
          aria-label="Application deadline information"
        >
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium text-text">
              Deadline: <time dateTime={deadline instanceof Date ? deadline.toISOString() : deadline?.toString()}>{deadlineInfo.formatted}</time>
            </p>
          </div>
          <p className="text-xs text-text-secondary ml-6 mb-2">
            {deadlineInfo.daysUntil} days remaining
          </p>
          {progressInfo && (
            <div className="ml-6">
              <div
                className="w-full bg-desert/40 rounded-full h-2 overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(progressInfo.width)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${deadlineInfo.daysUntil} days remaining until deadline`}
              >
                <div
                  className={`h-full ${progressInfo.color} transition-all duration-300 rounded-full`}
                  style={{ width: `${progressInfo.width}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 3).map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
        {tags.length > 3 && (
          <span className="text-xs text-text-muted font-medium">
            +{tags.length - 3} more
          </span>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-desert/40" role="group" aria-label="Grant actions">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/grants/${id}`}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-pine bg-pine/10 hover:bg-pine/15 border border-pine/30 hover:border-pine/50 rounded-earth transition-all flex items-center justify-center gap-2"
            aria-label={`View details for ${name}`}
          >
            View Details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-pine hover:bg-pine-dark border border-pine rounded-earth transition-all flex items-center justify-center gap-2"
              aria-label={`Apply for ${name} (opens in new tab)`}
            >
              Apply Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
        <ShareButton url={`/grants/${id}`} title={name} description={description} />
      </div>
    </article>
  )
}
