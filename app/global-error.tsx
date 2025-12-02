'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            <div className="bg-white rounded-lg p-12 border border-red-200 shadow-2xl">
              {/* Critical Error Icon */}
              <div className="text-8xl mb-6">🔥</div>

              {/* Error Message */}
              <h1 className="text-4xl font-bold text-red-900 mb-4">
                Critical Error
              </h1>
              <p className="text-red-800/80 mb-6 max-w-md mx-auto">
                We encountered a critical error that prevented the application from loading properly.
              </p>

              {/* Error Details */}
              {error.message && (
                <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-900 break-words">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-700 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={reset}
                  className="px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Try to Recover
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  Reload Application
                </button>
              </div>

              {/* Support Info */}
              <div className="mt-12 pt-8 border-t border-red-200">
                <p className="text-sm text-red-800/70">
                  This is a critical application error. Please reload the page or clear your browser cache.
                </p>
                {error.digest && (
                  <p className="text-xs text-red-700/60 mt-2 font-mono">
                    Error Reference: {error.digest}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
