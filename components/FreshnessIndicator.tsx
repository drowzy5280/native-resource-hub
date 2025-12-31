'use client'

import { formatDistanceToNow, differenceInDays, differenceInMonths } from 'date-fns'

interface FreshnessIndicatorProps {
  lastVerified?: Date | string | null
  updatedAt?: Date | string | null
  createdAt?: Date | string | null
  showLabel?: boolean
  className?: string
}

type FreshnessLevel = 'fresh' | 'recent' | 'aging' | 'stale' | 'unknown'

function getFreshnessLevel(date: Date): FreshnessLevel {
  const now = new Date()
  const daysDiff = differenceInDays(now, date)
  const monthsDiff = differenceInMonths(now, date)

  if (daysDiff <= 30) return 'fresh'
  if (monthsDiff <= 3) return 'recent'
  if (monthsDiff <= 6) return 'aging'
  if (monthsDiff > 6) return 'stale'
  return 'unknown'
}

const freshnessConfig: Record<FreshnessLevel, {
  label: string
  description: string
  color: string
  bgColor: string
  icon: string
}> = {
  fresh: {
    label: 'Recently Verified',
    description: 'Verified within the last 30 days',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    icon: '✓',
  },
  recent: {
    label: 'Verified',
    description: 'Verified within the last 3 months',
    color: 'text-pine dark:text-pine',
    bgColor: 'bg-pine/10 dark:bg-pine/20',
    icon: '✓',
  },
  aging: {
    label: 'Needs Review',
    description: 'Not verified in over 3 months',
    color: 'text-gold-dark dark:text-gold',
    bgColor: 'bg-gold/10 dark:bg-gold/20',
    icon: '⚠',
  },
  stale: {
    label: 'May Be Outdated',
    description: 'Not verified in over 6 months',
    color: 'text-clay dark:text-clay',
    bgColor: 'bg-clay/10 dark:bg-clay/20',
    icon: '⚠',
  },
  unknown: {
    label: 'Unverified',
    description: 'Verification status unknown',
    color: 'text-text-muted dark:text-stone-light',
    bgColor: 'bg-stone/10 dark:bg-stone/20',
    icon: '?',
  },
}

export function FreshnessIndicator({
  lastVerified,
  updatedAt,
  createdAt,
  showLabel = true,
  className = '',
}: FreshnessIndicatorProps) {
  // Use the most recent date available
  const dateToUse = lastVerified || updatedAt || createdAt
  if (!dateToUse) {
    const config = freshnessConfig.unknown
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-earth text-xs font-medium ${config.bgColor} ${config.color} ${className}`}
        title={config.description}
      >
        <span>{config.icon}</span>
        {showLabel && <span>{config.label}</span>}
      </span>
    )
  }

  const date = new Date(dateToUse)
  const level = getFreshnessLevel(date)
  const config = freshnessConfig[level]
  const timeAgo = formatDistanceToNow(date, { addSuffix: true })

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-earth text-xs font-medium ${config.bgColor} ${config.color} ${className}`}
      title={`${config.description}. Last updated ${timeAgo}`}
    >
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}

// Detailed freshness badge with date
interface FreshnessBadgeProps {
  lastVerified?: Date | string | null
  updatedAt?: Date | string | null
  className?: string
}

export function FreshnessBadge({ lastVerified, updatedAt, className = '' }: FreshnessBadgeProps) {
  const verifiedDate = lastVerified ? new Date(lastVerified) : null
  const updatedDate = updatedAt ? new Date(updatedAt) : null
  const date = verifiedDate || updatedDate

  if (!date) {
    return (
      <div className={`flex items-center gap-2 text-sm text-text-muted dark:text-stone-light ${className}`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Verification status unknown</span>
      </div>
    )
  }

  const level = getFreshnessLevel(date)
  const config = freshnessConfig[level]
  const timeAgo = formatDistanceToNow(date, { addSuffix: true })

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-earth text-sm font-medium ${config.bgColor} ${config.color}`}>
        {level === 'fresh' || level === 'recent' ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
        <span>{config.label}</span>
      </span>
      <span className="text-sm text-text-muted dark:text-stone-light">
        {verifiedDate ? 'Verified' : 'Updated'} {timeAgo}
      </span>
    </div>
  )
}

// Compact freshness dot indicator
interface FreshnessDotProps {
  lastVerified?: Date | string | null
  updatedAt?: Date | string | null
  size?: 'sm' | 'md'
}

export function FreshnessDot({ lastVerified, updatedAt, size = 'sm' }: FreshnessDotProps) {
  const date = lastVerified || updatedAt
  if (!date) return null

  const level = getFreshnessLevel(new Date(date))

  const dotColors: Record<FreshnessLevel, string> = {
    fresh: 'bg-green-500',
    recent: 'bg-pine',
    aging: 'bg-gold',
    stale: 'bg-clay',
    unknown: 'bg-gray-400',
  }

  const sizeClasses = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'

  return (
    <span
      className={`inline-block rounded-full ${sizeClasses} ${dotColors[level]}`}
      title={freshnessConfig[level].description}
    />
  )
}
