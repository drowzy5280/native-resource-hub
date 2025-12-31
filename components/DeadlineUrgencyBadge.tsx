'use client'

import { useMemo } from 'react'

interface DeadlineUrgencyBadgeProps {
  deadline: Date | string | null | undefined
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show days remaining text */
  showDays?: boolean
  /** Additional className */
  className?: string
}

/**
 * Calculate urgency level based on days until deadline
 */
function getUrgencyLevel(daysUntil: number): 'urgent' | 'warning' | 'soon' | 'normal' | 'past' {
  if (daysUntil < 0) return 'past'
  if (daysUntil <= 3) return 'urgent'
  if (daysUntil <= 7) return 'warning'
  if (daysUntil <= 14) return 'soon'
  return 'normal'
}

/**
 * Deadline Urgency Badge
 * Visual indicator for scholarship/grant deadlines
 */
export function DeadlineUrgencyBadge({
  deadline,
  size = 'md',
  showDays = true,
  className = '',
}: DeadlineUrgencyBadgeProps) {
  const { daysUntil, urgency, label } = useMemo(() => {
    if (!deadline) return { daysUntil: null, urgency: null, label: '' }

    const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
    const now = new Date()
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const urgencyLevel = getUrgencyLevel(diffDays)

    let urgencyLabel = ''
    if (diffDays < 0) {
      urgencyLabel = 'Expired'
    } else if (diffDays === 0) {
      urgencyLabel = 'Today!'
    } else if (diffDays === 1) {
      urgencyLabel = 'Tomorrow!'
    } else if (diffDays <= 3) {
      urgencyLabel = `${diffDays}d left!`
    } else if (diffDays <= 7) {
      urgencyLabel = `${diffDays} days`
    } else if (diffDays <= 14) {
      urgencyLabel = `${diffDays} days`
    } else {
      urgencyLabel = `${diffDays}d`
    }

    return { daysUntil: diffDays, urgency: urgencyLevel, label: urgencyLabel }
  }, [deadline])

  if (!deadline || urgency === null || daysUntil === null) {
    return null
  }

  // Don't show badge for deadlines more than 30 days away
  if (daysUntil > 30) {
    return null
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  const urgencyClasses = {
    past: 'bg-stone/20 text-stone border-stone/30',
    urgent: 'bg-error text-white border-error animate-pulse',
    warning: 'bg-clay text-white border-clay',
    soon: 'bg-gold text-stone-dark border-gold',
    normal: 'bg-pine/20 text-pine-dark border-pine/30',
  }

  const urgencyIcons = {
    past: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    urgent: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    warning: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    soon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    normal: null,
  }

  const ariaLabel = useMemo(() => {
    if (daysUntil < 0) return 'Deadline has passed'
    if (daysUntil === 0) return 'Deadline is today'
    if (daysUntil === 1) return 'Deadline is tomorrow'
    return `${daysUntil} days until deadline`
  }, [daysUntil])

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-semibold rounded-earth border
        ${sizeClasses[size]}
        ${urgencyClasses[urgency]}
        ${className}
      `}
      role="status"
      aria-label={ariaLabel}
    >
      {urgencyIcons[urgency]}
      {showDays && <span>{label}</span>}
    </span>
  )
}

/**
 * Deadline countdown timer for detail pages
 */
export function DeadlineCountdown({
  deadline,
  className = '',
}: {
  deadline: Date | string | null | undefined
  className?: string
}) {
  const { daysUntil, hoursUntil, isPast, formattedDate } = useMemo(() => {
    if (!deadline) return { daysUntil: 0, hoursUntil: 0, isPast: true, formattedDate: '' }

    const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
    const now = new Date()
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return {
      daysUntil: diffDays,
      hoursUntil: diffHours,
      isPast: diffTime < 0,
      formattedDate: deadlineDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }
  }, [deadline])

  if (!deadline) return null

  const urgency = getUrgencyLevel(daysUntil)

  const urgencyBgClasses = {
    past: 'bg-stone/10 border-stone/30',
    urgent: 'bg-error/10 border-error/30',
    warning: 'bg-clay/10 border-clay/30',
    soon: 'bg-gold/10 border-gold/30',
    normal: 'bg-pine/10 border-pine/30',
  }

  const urgencyTextClasses = {
    past: 'text-stone',
    urgent: 'text-error',
    warning: 'text-clay-dark',
    soon: 'text-gold-dark',
    normal: 'text-pine-dark',
  }

  return (
    <div
      className={`rounded-earth-lg p-4 border ${urgencyBgClasses[urgency]} ${className}`}
      role="timer"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 mb-2">
        <svg
          className={`w-5 h-5 ${urgencyTextClasses[urgency]}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className={`font-semibold ${urgencyTextClasses[urgency]}`}>
          Application Deadline
        </span>
        <DeadlineUrgencyBadge deadline={deadline} size="sm" showDays />
      </div>

      <p className="text-text font-medium mb-1">
        <time dateTime={typeof deadline === 'string' ? deadline : deadline.toISOString()}>
          {formattedDate}
        </time>
      </p>

      {!isPast && (
        <p className="text-sm text-text-secondary">
          {daysUntil === 0 ? (
            <span className="font-semibold text-error">Deadline is today!</span>
          ) : daysUntil === 1 ? (
            <>
              <span className="font-semibold">{hoursUntil} hours</span> remaining
            </>
          ) : (
            <>
              <span className="font-semibold">{daysUntil} days</span> and{' '}
              <span className="font-semibold">{hoursUntil} hours</span> remaining
            </>
          )}
        </p>
      )}

      {isPast && (
        <p className="text-sm text-stone font-medium">
          This deadline has passed
        </p>
      )}
    </div>
  )
}

export default DeadlineUrgencyBadge
