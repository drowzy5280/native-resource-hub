interface VerificationBadgeProps {
  lastVerified?: Date | null
  verifiedBy?: string | null
  compact?: boolean
}

export function VerificationBadge({ lastVerified, verifiedBy, compact = false }: VerificationBadgeProps) {
  if (!lastVerified) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${compact ? 'text-xs' : 'text-sm'} text-text-muted`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {!compact && <span>Not verified</span>}
      </div>
    )
  }

  const verifiedDate = new Date(lastVerified)
  const daysSinceVerification = Math.floor((Date.now() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24))

  // Determine badge color based on age
  let badgeColor = 'text-pine bg-pine/10 border-pine/20'
  let icon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  if (daysSinceVerification > 180) {
    // Over 6 months - warning
    badgeColor = 'text-gold-dark bg-gold/10 border-gold/20'
    icon = (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  } else if (daysSinceVerification > 365) {
    // Over 1 year - needs verification
    badgeColor = 'text-clay bg-clay/10 border-clay/20'
    icon = (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  const timeAgo = formatDistanceToNow(verifiedDate, { addSuffix: true })

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-earth text-xs font-medium border ${badgeColor}`} title={`Verified ${timeAgo}${verifiedBy ? ` by ${verifiedBy}` : ''}`}>
        {icon}
        <span>Verified</span>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-earth text-sm font-medium border ${badgeColor}`}>
      {icon}
      <span>Verified {timeAgo}</span>
      {verifiedBy && <span className="text-xs opacity-70">by {verifiedBy}</span>}
    </div>
  )
}

// Utility function to format dates
function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return options?.addSuffix ? 'just now' : 'now'
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return options?.addSuffix ? `${minutes} minute${minutes > 1 ? 's' : ''} ago` : `${minutes}m`
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600)
    return options?.addSuffix ? `${hours} hour${hours > 1 ? 's' : ''} ago` : `${hours}h`
  }
  if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400)
    return options?.addSuffix ? `${days} day${days > 1 ? 's' : ''} ago` : `${days}d`
  }
  if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000)
    return options?.addSuffix ? `${months} month${months > 1 ? 's' : ''} ago` : `${months}mo`
  }
  const years = Math.floor(seconds / 31536000)
  return options?.addSuffix ? `${years} year${years > 1 ? 's' : ''} ago` : `${years}y`
}
