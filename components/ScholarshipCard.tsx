'use client'

import Link from 'next/link'
import { Tag } from './Tag'
import { formatDeadline } from '@/lib/formatting'

interface ScholarshipCardProps {
  id: string
  name: string
  description: string
  amount?: string | null
  deadline?: string | null
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
    <div className="bg-white rounded-earth-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-earth-sand/30">
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          {amount && (
            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-earth-teal/10 text-earth-teal">
              {amount}
            </span>
          )}
          {isClosingSoon && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-earth-rust/20 text-earth-rust">
              Closing Soon
            </span>
          )}
        </div>
        <h3 className="text-xl font-semibold text-earth-brown mb-2">
          {name}
        </h3>
      </div>

      <p className="text-earth-brown/80 mb-4 line-clamp-3">
        {description}
      </p>

      {deadlineInfo && !deadlineInfo.isPast && (
        <div className="mb-4 p-3 bg-earth-cream rounded-earth">
          <p className="text-sm font-medium text-earth-brown">
            Deadline: {deadlineInfo.formatted}
          </p>
          <p className="text-xs text-earth-brown/70 mt-1">
            {deadlineInfo.daysUntil} days remaining
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 4).map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
        {tags.length > 4 && (
          <span className="text-xs text-earth-brown/60">
            +{tags.length - 4} more
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <Link
          href={`/scholarships/${id}`}
          className="text-sm font-medium text-earth-teal hover:text-earth-teal/80 transition-colors"
        >
          View Details →
        </Link>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-earth-rust hover:text-earth-rust/80 transition-colors"
          >
            Apply Now ↗
          </a>
        )}
      </div>
    </div>
  )
}
