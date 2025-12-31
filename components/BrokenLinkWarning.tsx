'use client'

import { useState } from 'react'

interface BrokenLinkWarningProps {
  url: string | null
  lastVerified?: Date | null
}

export function BrokenLinkWarning({ url, lastVerified }: BrokenLinkWarningProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [linkStatus, setLinkStatus] = useState<'unknown' | 'working' | 'broken'>('unknown')

  // Show warning if link hasn't been verified in the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const isStale = !lastVerified || lastVerified < thirtyDaysAgo

  const checkLink = async () => {
    if (!url) return

    setIsChecking(true)
    try {
      // Try to fetch the URL via our API to check if it's working
      const response = await fetch('/api/check-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()
      setLinkStatus(data.isValid ? 'working' : 'broken')
    } catch {
      setLinkStatus('broken')
    } finally {
      setIsChecking(false)
    }
  }

  if (!url) return null

  // Don't show warning if link was recently verified and is working
  if (!isStale && linkStatus !== 'broken') return null

  if (linkStatus === 'working') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success-dark rounded-earth text-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Link verified
      </div>
    )
  }

  if (linkStatus === 'broken') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-error/10 text-error-dark rounded-earth text-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Link may be broken
      </div>
    )
  }

  // Show stale warning with option to check
  if (isStale) {
    return (
      <button
        onClick={checkLink}
        disabled={isChecking}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-warning/10 text-warning-dark hover:bg-warning/20 rounded-earth text-sm transition-colors disabled:opacity-50"
        title="Click to verify this link"
      >
        {isChecking ? (
          <>
            <div className="w-4 h-4 border-2 border-warning-dark/30 border-t-warning-dark rounded-full animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Not recently verified
          </>
        )}
      </button>
    )
  }

  return null
}
