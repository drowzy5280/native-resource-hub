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
        <div className="bg-white rounded-earth-lg p-12 border border-earth-sand/30 shadow-soft-lg">
          {/* Error Icon */}
          <div className="text-8xl mb-6">⚠️</div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-earth-brown mb-4">
            Something Went Wrong
          </h1>
          <p className="text-earth-brown/70 mb-2 max-w-md mx-auto">
            We encountered an unexpected error while loading this page.
          </p>

          {/* Error Details (in development) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-earth text-left">
              <p className="text-sm font-mono text-red-800 break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={reset}
              className="px-8 py-3 bg-earth-teal text-white rounded-earth-lg font-medium hover:bg-earth-teal/90 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-8 py-3 bg-white text-earth-teal border-2 border-earth-teal rounded-earth-lg font-medium hover:bg-earth-teal/5 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-12 pt-8 border-t border-earth-sand">
            <p className="text-sm text-earth-brown/60">
              If this problem persists, please try refreshing the page or contact support.
            </p>
            {error.digest && (
              <p className="text-xs text-earth-brown/50 mt-2">
                Reference: {error.digest}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
