'use client'

import { useState } from 'react'
import Link from 'next/link'

type Deadline = {
  id: string
  title: string
  type: 'scholarship' | 'grant' | 'application'
  deadline: Date
  amount?: string
  url: string
  tags?: string[]
}

type DeadlineTimelineProps = {
  deadlines: Deadline[]
  maxItems?: number
  showFilters?: boolean
  groupByMonth?: boolean
}

export function DeadlineTimeline({ deadlines, maxItems = 10 }: DeadlineTimelineProps) {
  const [filter, setFilter] = useState<'all' | 'scholarship' | 'grant' | 'application'>('all')

  // Filter and sort deadlines
  const filteredDeadlines = deadlines
    .filter(d => filter === 'all' || d.type === filter)
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, maxItems)

  const getTimeUntil = (deadline: Date) => {
    const now = new Date()
    const diff = deadline.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days < 0) return { text: 'Passed', color: 'text-text-muted', urgent: false }
    if (days === 0) return { text: 'Today', color: 'text-error', urgent: true }
    if (days === 1) return { text: 'Tomorrow', color: 'text-error', urgent: true }
    if (days <= 7) return { text: `${days} days`, color: 'text-warning', urgent: true }
    if (days <= 30) return { text: `${days} days`, color: 'text-info', urgent: false }
    if (days <= 60) return { text: `${Math.floor(days / 7)} weeks`, color: 'text-success', urgent: false }
    return { text: `${Math.floor(days / 30)} months`, color: 'text-text-secondary', urgent: false }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scholarship': return '🎓'
      case 'grant': return '💰'
      case 'application': return '📝'
      default: return '📅'
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'scholarship': return 'bg-pine/10 text-pine border-pine/30'
      case 'grant': return 'bg-gold/10 text-gold-dark border-gold/30'
      case 'application': return 'bg-clay/10 text-clay border-clay/30'
      default: return 'bg-desert/20 text-text border-desert/40'
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {[
          { id: 'all', label: 'All Deadlines' },
          { id: 'scholarship', label: 'Scholarships' },
          { id: 'grant', label: 'Grants' },
          { id: 'application', label: 'Applications' },
        ].map((option) => (
          <button
            key={option.id}
            onClick={() => setFilter(option.id as any)}
            className={`px-4 py-2 rounded-earth border-2 transition-all font-medium ${
              filter === option.id
                ? 'bg-pine text-white border-pine shadow-soft'
                : 'bg-white text-text border-desert/40 hover:border-pine/40'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filteredDeadlines.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-earth-lg border border-desert/20">
          <p className="text-text-secondary">No upcoming deadlines found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDeadlines.map((deadline, index) => {
            const timeUntil = getTimeUntil(deadline.deadline)

            return (
              <Link
                key={deadline.id}
                href={deadline.url}
                className="group block bg-white rounded-earth-lg p-6 border-2 border-desert/20 hover:border-pine/40 transition-all shadow-soft hover:shadow-soft-lg"
              >
                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      timeUntil.urgent ? 'bg-warning/20 ring-4 ring-warning/20' : 'bg-desert/10'
                    }`}>
                      {getTypeIcon(deadline.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-heading font-bold text-text group-hover:text-pine transition-colors line-clamp-1">
                          {deadline.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-earth border ${getTypeBadgeColor(deadline.type)}`}>
                            {deadline.type}
                          </span>
                          {deadline.amount && (
                            <span className="text-sm text-text-secondary font-semibold">
                              {deadline.amount}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Time until deadline */}
                      <div className="flex-shrink-0 text-right">
                        <div className={`text-lg font-bold ${timeUntil.color}`}>
                          {timeUntil.text}
                        </div>
                        <div className="text-xs text-text-muted">
                          {deadline.deadline.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {timeUntil.urgent && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-desert/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              timeUntil.text === 'Today' || timeUntil.text === 'Tomorrow'
                                ? 'bg-error'
                                : 'bg-warning'
                            }`}
                            style={{
                              width: timeUntil.text === 'Today' ? '100%' :
                                     timeUntil.text === 'Tomorrow' ? '90%' : '70%'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* View all link */}
      {filteredDeadlines.length === maxItems && (
        <div className="text-center">
          <Link
            href="/scholarships"
            className="inline-flex items-center gap-2 text-pine hover:text-pine-dark font-medium transition-colors"
          >
            View All Deadlines
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}
