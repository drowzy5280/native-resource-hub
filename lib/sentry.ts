// Sentry Error Monitoring Configuration
// To enable Sentry, install the package and set SENTRY_DSN in your environment

// npm install @sentry/nextjs
// Then run: npx @sentry/wizard@latest -i nextjs

// This file provides the configuration structure for when Sentry is enabled

export const sentryConfig = {
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session replay - capture user interactions on errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Release tracking (set during build)
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'local',

  // Ignore certain errors
  ignoreErrors: [
    // Network errors
    'Network request failed',
    'Failed to fetch',
    'NetworkError',
    // Browser extensions
    'chrome-extension://',
    'moz-extension://',
    // Third party scripts
    'Script error.',
    // User abort
    'AbortError',
  ],

  // Don't send PII
  sendDefaultPii: false,

  // Tunnel API route (optional, helps with ad blockers)
  // tunnel: '/api/sentry',
}

// Custom error boundary for React components
export function logError(error: Error, context?: Record<string, unknown>) {
  // In production with Sentry enabled:
  // Sentry.captureException(error, { extra: context })

  // For now, log to console
  console.error('Application Error:', error)
  if (context) {
    console.error('Context:', context)
  }

  // You could also send to your own error logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to custom endpoint
    // fetch('/api/log-error', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ error: error.message, stack: error.stack, context }),
    // }).catch(() => {})
  }
}

// Track user actions for debugging
export function trackAction(action: string, data?: Record<string, unknown>) {
  // In production with Sentry enabled:
  // Sentry.addBreadcrumb({
  //   category: 'user-action',
  //   message: action,
  //   data,
  //   level: 'info',
  // })

  if (process.env.NODE_ENV === 'development') {
    console.log('User Action:', action, data)
  }
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => Promise<void>) {
  return async () => {
    const start = performance.now()

    try {
      await fn()
    } finally {
      const duration = performance.now() - start

      // In production with Sentry enabled:
      // Sentry.metrics.distribution(name, duration, { unit: 'millisecond' })

      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`)
      }
    }
  }
}
