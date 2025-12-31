'use client'

import { useState } from 'react'

interface EmailCaptureProps {
  variant?: 'inline' | 'card' | 'banner'
  title?: string
  description?: string
  buttonText?: string
  successMessage?: string
  className?: string
}

export function EmailCapture({
  variant = 'card',
  title = 'Get Deadline Reminders',
  description = 'Never miss a scholarship deadline. Get personalized reminders sent to your inbox.',
  buttonText = 'Subscribe',
  successMessage = 'Thanks for subscribing! Check your email to confirm.',
  className = '',
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Subscription failed')
      }

      setStatus('success')
      setEmail('')
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (variant === 'inline') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border-2 border-desert/40 rounded-earth-lg focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20 text-sm"
            disabled={status === 'loading' || status === 'success'}
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-4 py-2 bg-pine text-white rounded-earth-lg font-medium hover:bg-pine-dark disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
          >
            {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : buttonText}
          </button>
        </form>
        <p className="text-xs text-text-muted mt-1">
          By subscribing, you agree to receive emails. Unsubscribe anytime.
        </p>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-pine/10 to-gold/10 py-4 px-6 ${className}`}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 text-center sm:text-left">
            <p className="font-heading font-semibold text-text">{title}</p>
            <p className="text-sm text-text-secondary">{description}</p>
          </div>
          {status === 'success' ? (
            <p className="text-pine font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </p>
          ) : (
            <div className="flex flex-col items-center sm:items-end gap-1">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="px-4 py-2 border-2 border-desert/40 rounded-earth-lg focus:border-pine focus:outline-none text-sm w-48"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-4 py-2 bg-pine text-white rounded-earth-lg font-medium hover:bg-pine-dark disabled:opacity-50 transition-colors text-sm"
                >
                  {status === 'loading' ? '...' : buttonText}
                </button>
              </form>
              <p className="text-xs text-text-muted">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          )}
        </div>
        {status === 'error' && (
          <p className="text-clay text-sm text-center mt-2">{errorMessage}</p>
        )}
      </div>
    )
  }

  // Card variant (default)
  return (
    <div className={`bg-white rounded-earth-xl border border-desert/20 shadow-soft p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-pine/10 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-heading font-semibold text-text">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-pine bg-pine/10 rounded-earth-lg p-4">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border-2 border-desert/40 rounded-earth-lg focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
            disabled={status === 'loading'}
          />
          {status === 'error' && (
            <p className="text-clay text-sm">{errorMessage}</p>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-4 py-3 bg-pine text-white rounded-earth-lg font-medium hover:bg-pine-dark disabled:opacity-50 transition-colors"
          >
            {status === 'loading' ? 'Subscribing...' : buttonText}
          </button>
          <p className="text-xs text-text-muted text-center">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      )}
    </div>
  )
}

export function DeadlineReminderSignup({ scholarshipId, scholarshipName, deadline }: { scholarshipId: string; scholarshipName: string; deadline: Date }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, scholarshipId, scholarshipName, deadline }),
      })

      if (!response.ok) throw new Error('Failed to set reminder')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-pine text-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Reminder set! We'll email you before the deadline.
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Get reminder"
          className="flex-1 px-3 py-1.5 border border-desert/40 rounded-earth text-sm focus:border-pine focus:outline-none"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="px-3 py-1.5 bg-gold text-white rounded-earth text-sm font-medium hover:bg-gold-dark disabled:opacity-50 transition-colors"
        >
          {status === 'loading' ? '...' : 'Remind Me'}
        </button>
      </form>
      <p className="text-xs text-text-muted mt-1">
        We'll only email you about this deadline.
      </p>
    </div>
  )
}
