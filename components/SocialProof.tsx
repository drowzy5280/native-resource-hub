'use client'

import { useState, useEffect } from 'react'

interface SocialProofProps {
  resourceId: string
  type: 'resource' | 'scholarship' | 'guide'
  savedCount?: number
  viewCount?: number
  showSaved?: boolean
  showViews?: boolean
  className?: string
}

export function SocialProof({
  resourceId,
  type,
  savedCount = 0,
  viewCount = 0,
  showSaved = true,
  showViews = true,
  className = '',
}: SocialProofProps) {
  const [displaySavedCount, setDisplaySavedCount] = useState(savedCount)
  const [displayViewCount, setDisplayViewCount] = useState(viewCount)

  // Increment view count on mount
  useEffect(() => {
    const incrementView = async () => {
      try {
        await fetch(`/api/${type}s/${resourceId}/view`, { method: 'POST' })
        setDisplayViewCount((prev) => prev + 1)
      } catch {
        // Silently fail
      }
    }

    // Only increment if we're showing views
    if (showViews && resourceId) {
      incrementView()
    }
  }, [resourceId, type, showViews])

  if (!showSaved && !showViews) return null
  if (displaySavedCount === 0 && displayViewCount === 0) return null

  return (
    <div className={`flex items-center gap-4 text-sm text-text-muted ${className}`}>
      {showSaved && displaySavedCount > 0 && (
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-clay" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>{displaySavedCount.toLocaleString()} saved this</span>
        </div>
      )}
      {showViews && displayViewCount > 0 && (
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{displayViewCount.toLocaleString()} views</span>
        </div>
      )}
    </div>
  )
}

export function RecentActivity({ className = '' }: { className?: string }) {
  const [activity, setActivity] = useState<Array<{ action: string; time: string }>>([])

  useEffect(() => {
    // Simulated recent activity - in production, this would come from an API
    const activities = [
      { action: 'Someone saved "BIA Housing Assistance"', time: '2 minutes ago' },
      { action: 'New scholarship deadline approaching', time: '5 minutes ago' },
      { action: 'Resource updated: IHS Healthcare', time: '10 minutes ago' },
    ]
    setActivity(activities)
  }, [])

  if (activity.length === 0) return null

  return (
    <div className={`bg-pine/5 rounded-earth-lg p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-pine rounded-full animate-pulse" />
        Recent Activity
      </h4>
      <div className="space-y-2">
        {activity.map((item, index) => (
          <div key={index} className="text-sm">
            <p className="text-text-secondary">{item.action}</p>
            <p className="text-xs text-text-muted">{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TrustIndicators({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <svg className="w-5 h-5 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Verified Resources</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Updated Daily</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <svg className="w-5 h-5 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span>Community Trusted</span>
      </div>
    </div>
  )
}
