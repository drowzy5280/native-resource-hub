'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ResourcesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Resources page error:', error)
  }, [error])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div
        className="max-w-xl mx-auto text-center bg-white rounded-earth-lg p-8 border border-desert/30 shadow-soft"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-6xl mb-4" aria-hidden="true">📋</div>
        <h1 className="text-2xl font-heading font-bold text-text mb-4">
          Unable to Load Resources
        </h1>
        <p className="text-text-secondary mb-6">
          We had trouble loading the resources. This might be a temporary issue.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-pine text-white rounded-earth font-medium hover:bg-pine-dark transition-colors focus:outline-none focus:ring-2 focus:ring-pine focus:ring-offset-2"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 bg-white text-pine border-2 border-pine rounded-earth font-medium hover:bg-pine/5 transition-colors text-center"
          >
            Go Home
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
