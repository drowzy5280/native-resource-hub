'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ScholarshipsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Scholarships page error:', error)
  }, [error])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div
        className="max-w-xl mx-auto text-center bg-white rounded-earth-lg p-8 border border-desert/30 shadow-soft"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-6xl mb-4" aria-hidden="true">🎓</div>
        <h1 className="text-2xl font-heading font-bold text-text mb-4">
          Unable to Load Scholarships
        </h1>
        <p className="text-text-secondary mb-6">
          We had trouble loading scholarship opportunities. Please try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-gold text-stone-dark rounded-earth font-medium hover:bg-gold-dark transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
          >
            Try Again
          </button>
          <Link
            href="/resources?tags=education"
            className="px-6 py-2.5 bg-white text-gold-dark border-2 border-gold rounded-earth font-medium hover:bg-gold/5 transition-colors text-center"
          >
            Browse Education Resources
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
