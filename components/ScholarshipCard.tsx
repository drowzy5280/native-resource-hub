'use client'

import Link from 'next/link'
import { Tag } from './Tag'
import { formatDeadline } from '@/lib/formatting'

interface ScholarshipCardProps {
  id: string
  name: string
  description: string
  amount?: string | null
  deadline?: Date | string | null
  tags: string[]
  url?: string | null
}

export function ScholarshipCard({
  id,
  name,
  description,
  amount,
  deadline,
  tags,
  url,
}: ScholarshipCardProps) {
  const deadlineInfo = deadline ? formatDeadline(deadline) : null
  const isClosingSoon = deadlineInfo && deadlineInfo.daysUntil <= 30 && !deadlineInfo.isPast

  return (
    <div className="bg-white rounded-earth-lg card-shadow p-6 border border-desert/20 hover:border-gold/40 transition-all group">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          {amount && (
            <span className="px-4 py-1.5 text-sm font-heading font-semibold rounded-earth bg-gradient-to-r from-gold/20 to-gold/10 text-gold-dark border border-gold/30">
              {amount}
            </span>
          )}
          {isClosingSoon && (
            <span className="px-3 py-1 text-xs font-medium rounded-earth bg-clay/10 text-clay border border-clay/20 animate-pulse">
              Closing Soon
            </span>
          )}
        </div>
        <h3 className="text-xl font-heading font-semibold text-midnight mb-2 group-hover:text-gold-dark transition-colors line-clamp-2">
          {name}
        </h3>
      </div>

      <p className="text-midnight/70 mb-5 line-clamp-3 leading-relaxed">
        {description}
      </p>

      {deadlineInfo && !deadlineInfo.isPast && (
        <div className="mb-5 p-4 bg-gradient-to-br from-desert/20 to-gold/5 rounded-earth border border-desert/30">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium text-midnight">
              Deadline: {deadlineInfo.formatted}
            </p>
          </div>
          <p className="text-xs text-midnight/60 ml-6">
            {deadlineInfo.daysUntil} days remaining
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {tags.slice(0, 3).map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
        {tags.length > 3 && (
          <span className="text-xs text-midnight/50 font-medium">
            +{tags.length - 3} more
          </span>
        )}
      </div>

      <div className="flex gap-4 pt-4 border-t border-desert/20">
        <Link
          href={`/scholarships/${id}`}
          className="text-sm font-medium text-pine hover:text-pine-light transition-colors flex items-center gap-1"
        >
          View Details
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gold-dark hover:text-gold transition-colors flex items-center gap-1 font-semibold"
          >
            Apply Now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
