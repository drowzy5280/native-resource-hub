'use client'

import { useState } from 'react'
import { ShareButton } from './ShareButton'
import { PrintButton } from './PrintButton'

interface ResourceActionsProps {
  resourceId: string
  resourceTitle: string
  resourceUrl?: string
  className?: string
}

export function ResourceActions({
  resourceId,
  resourceTitle,
  resourceUrl,
  className = '',
}: ResourceActionsProps) {
  const pageUrl = `/resources/${resourceId}`

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Share Button */}
      <ShareButton
        url={pageUrl}
        title={resourceTitle}
        description={`Check out ${resourceTitle} on Tribal Resource Hub`}
      />

      {/* Print Button */}
      <PrintButton />

      {/* Visit Resource (if external URL) */}
      {resourceUrl && (
        <a
          href={resourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-pine text-white rounded-earth-lg hover:bg-pine-dark transition-colors font-medium"
        >
          Visit Resource
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  )
}

export function QuickActions({ url = '', title = 'Resource', className = '' }: { url?: string; title?: string; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <button className="inline-flex items-center gap-2 px-3 py-2 bg-pine/10 text-pine rounded-earth hover:bg-pine/20 transition-colors text-sm font-medium">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        Save
      </button>
      <button className="inline-flex items-center gap-2 px-3 py-2 bg-gold/10 text-gold-dark rounded-earth hover:bg-gold/20 transition-colors text-sm font-medium">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Compare
      </button>
      <ShareButton url={url} title={title} />
      <PrintButton />
    </div>
  )
}

export function EmailToSelf({ resourceTitle, resourceUrl }: { resourceTitle: string; resourceUrl: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('sending')

    // In production, this would send an API request
    // For now, we'll use mailto as a fallback
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      `Resource: ${resourceTitle}`
    )}&body=${encodeURIComponent(
      `Hi,\n\nI found this resource on Tribal Resource Hub that might be helpful:\n\n${resourceTitle}\n${resourceUrl}\n\nVisit Tribal Resource Hub for more Native American resources: https://tribalresourcehub.com`
    )}`

    window.location.href = mailtoLink
    setStatus('sent')
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <div className="bg-desert/20 rounded-earth-lg p-4">
      <h4 className="font-medium text-text mb-2 flex items-center gap-2">
        <svg className="w-5 h-5 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Email This to Yourself
      </h4>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-3 py-2 border border-desert/40 rounded-earth text-sm focus:border-pine focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="px-4 py-2 bg-pine text-white rounded-earth text-sm font-medium hover:bg-pine-dark disabled:opacity-50 transition-colors"
        >
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Send'}
        </button>
      </form>
    </div>
  )
}
