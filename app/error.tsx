'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div
          className="bg-white rounded-earth-lg p-8 sm:p-12 border border-desert/30 shadow-soft-lg"
          role="alert"
          aria-live="assertive"
        >
          {/* Error Icon */}
          <div className="text-6xl sm:text-8xl mb-6" aria-hidden="true">⚠️</div>

          {/* Error Message */}
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-text mb-4">
            Something Went Wrong
          </h1>
          <p className="text-text-secondary mb-2 max-w-md mx-auto">
            We encountered an unexpected error while loading this page.
          </p>

          {/* Error Details (in development) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-6 p-4 bg-error/10 border border-error/30 rounded-earth text-left">
              <p className="text-sm font-mono text-error break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-error/70 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={reset}
              className="px-6 sm:px-8 py-3 bg-pine text-white rounded-earth-lg font-medium hover:bg-pine-dark transition-colors focus:outline-none focus:ring-2 focus:ring-pine focus:ring-offset-2 min-h-[44px]"
              aria-label="Try loading this page again"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 sm:px-8 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-medium hover:bg-pine/5 transition-colors focus:outline-none focus:ring-2 focus:ring-pine focus:ring-offset-2 min-h-[44px] flex items-center justify-center"
            >
              Go to Homepage
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-desert/40">
            <p className="text-sm text-text-muted">
              If this problem persists, please try refreshing the page or contact support.
            </p>
            {error.digest && (
              <p className="text-xs text-text-muted mt-2">
                Reference: {error.digest}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
