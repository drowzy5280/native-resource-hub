'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function TribesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Tribes page error:', error)
  }, [error])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div
        className="max-w-xl mx-auto text-center bg-white rounded-earth-lg p-8 border border-desert/30 shadow-soft"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-6xl mb-4" aria-hidden="true">🏛️</div>
        <h1 className="text-2xl font-heading font-bold text-text mb-4">
          Unable to Load Tribes Directory
        </h1>
        <p className="text-text-secondary mb-6">
          We had trouble loading the tribes directory. This might be a temporary issue.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-clay text-white rounded-earth font-medium hover:bg-clay-dark transition-colors focus:outline-none focus:ring-2 focus:ring-clay focus:ring-offset-2"
          >
            Try Again
          </button>
          <Link
            href="/resources"
            className="px-6 py-2.5 bg-white text-clay border-2 border-clay rounded-earth font-medium hover:bg-clay/5 transition-colors text-center"
          >
            Browse Resources
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-text-muted mt-6">
            Error Reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
