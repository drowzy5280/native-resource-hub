'use client'

import Link from 'next/link'
import { Tag } from './Tag'
import { formatDeadline } from '@/lib/formatting'
import { SaveButton } from './SaveButton'
import { ShareButton } from './ShareButton'
import { AddToCompareButton } from './AddToCompareButton'
import type { ComparisonScholarship } from './ComparisonContext'

interface ScholarshipCardProps {
  id: string
  name: string
  description: string
  amount?: string | null
  deadline?: Date | string | null
  tags: string[]
  url?: string | null
  organization?: string
  eligibility?: string[]
  state?: string | null
}

export function ScholarshipCard({
  id,
  name,
  description,
  amount,
  deadline,
  tags,
  url,
  organization = 'Not specified',
  eligibility = [],
  state = null,
}: ScholarshipCardProps) {
  const deadlineInfo = deadline ? formatDeadline(deadline) : null
  const isClosingSoon = deadlineInfo && deadlineInfo.daysUntil <= 30 && !deadlineInfo.isPast

  // Prepare scholarship data for comparison
  const comparisonData: ComparisonScholarship = {
    id,
    name,
    organization,
    amount: amount || 'Amount varies',
    deadline: deadline ? new Date(deadline).toISOString() : null,
    description,
    eligibility,
    state,
  }

  // Calculate progress bar color and width based on days remaining
  const getProgressInfo = () => {
    if (!deadlineInfo || deadlineInfo.isPast) return null

    const daysUntil = deadlineInfo.daysUntil
    let color = 'bg-earth-teal' // Default: plenty of time
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
      color = 'bg-earth-teal' // Green/good
    }

    return { color, width }
  }

  const progressInfo = getProgressInfo()

  return (
    <article
      className="bg-white rounded-earth-lg shadow-card p-6 border border-desert/40 hover:border-gold/40 hover:shadow-soft transition-all group"
      aria-labelledby={`scholarship-title-${id}`}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-1" role="list" aria-label="Scholarship details">
            {amount && (
              <span
                className="px-4 py-1.5 text-sm font-heading font-semibold rounded-earth bg-gold/20 text-gold-dark border border-gold/40"
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
          <div className="flex items-center gap-2">
            <AddToCompareButton scholarship={comparisonData} variant="compact" />
            <SaveButton id={id} type="scholarship" title={name} variant="icon" />
          </div>
        </div>
        <h3
          id={`scholarship-title-${id}`}
          className="text-xl font-heading font-semibold text-text mb-2 group-hover:text-gold-dark transition-colors line-clamp-2"
        >
          {name}
        </h3>
      </div>

      <p className="text-text-secondary mb-5 line-clamp-3 leading-relaxed">
        {description}
      </p>

      {deadlineInfo && !deadlineInfo.isPast && (
        <div
          className="mb-5 p-4 bg-desert/20 rounded-earth border border-desert/40"
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
              <span className="sr-only">{deadlineInfo.daysUntil} days until deadline</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {tags.slice(0, 3).map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
        {tags.length > 3 && (
          <span className="text-xs text-text-muted font-medium">
            +{tags.length - 3} more
          </span>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-desert/40" role="group" aria-label="Scholarship actions">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/scholarships/${id}`}
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
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gold hover:bg-gold-dark border border-gold rounded-earth transition-all flex items-center justify-center gap-2"
              aria-label={`Apply now for ${name} (opens in new tab)`}
            >
              Apply Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
        <ShareButton url={`/scholarships/${id}`} title={name} description={description} />
      </div>
    </article>
  )
}
