'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          className="bg-clay/10 border border-clay/30 rounded-earth-lg p-6 my-4"
          role="alert"
          aria-live="assertive"
        >
          <h3 className="text-lg font-semibold text-clay-dark mb-2">
            Something went wrong
          </h3>
          <p className="text-clay mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-clay text-white rounded-earth hover:bg-clay-dark transition-colors focus:outline-none focus:ring-2 focus:ring-clay/50"
            aria-label="Dismiss error and try again"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      className="bg-clay/10 border border-clay/30 rounded-earth-lg p-6 my-4"
      role="alert"
      aria-live="polite"
    >
      <h3 className="text-lg font-semibold text-clay-dark mb-2">Error</h3>
      <p className="text-clay mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-clay text-white rounded-earth hover:bg-clay-dark transition-colors focus:outline-none focus:ring-2 focus:ring-clay/50"
          aria-label="Retry the failed operation"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
