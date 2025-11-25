'use client'

import { useState } from 'react'
import { useToast } from './Toast'

interface ShareButtonProps {
  url: string
  title: string
  description?: string
}

export function ShareButton({ url, title, description }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const toast = useToast()

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      toast.addToast('Link copied to clipboard!', 'success')
      setShowMenu(false)
    } catch (error) {
      toast.addToast('Failed to copy link', 'error')
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title)
    const body = encodeURIComponent(
      `${description ? description + '\n\n' : ''}Check out this resource: ${fullUrl}`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
    setShowMenu(false)
  }

  const shareViaNativeAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl,
        })
        setShowMenu(false)
      } catch (error) {
        // User cancelled or share failed
      }
    }
  }

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-pine bg-pine/5 hover:bg-pine/10 border border-pine/20 hover:border-pine/40 rounded-earth transition-all"
        aria-label="Share"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Share
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-earth-lg shadow-lg border border-desert/20 py-2 z-20">
            {hasNativeShare && (
              <button
                onClick={shareViaNativeAPI}
                className="w-full px-4 py-2 text-left text-sm text-midnight hover:bg-desert/10 transition-colors flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share...
              </button>
            )}
            <button
              onClick={copyToClipboard}
              className="w-full px-4 py-2 text-left text-sm text-midnight hover:bg-desert/10 transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Link
            </button>
            <button
              onClick={shareViaEmail}
              className="w-full px-4 py-2 text-left text-sm text-midnight hover:bg-desert/10 transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Share via Email
            </button>
          </div>
        </>
      )}
    </div>
  )
}
