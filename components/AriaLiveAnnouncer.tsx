'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type AriaLivePoliteness = 'polite' | 'assertive' | 'off'

interface Announcement {
  id: string
  message: string
  politeness: AriaLivePoliteness
}

interface AriaLiveContextType {
  announce: (message: string, politeness?: AriaLivePoliteness) => void
  announcePolite: (message: string) => void
  announceAssertive: (message: string) => void
}

const AriaLiveContext = createContext<AriaLiveContextType | null>(null)

/**
 * Hook to access the aria-live announcer
 */
export function useAriaLive() {
  const context = useContext(AriaLiveContext)
  if (!context) {
    throw new Error('useAriaLive must be used within AriaLiveProvider')
  }
  return context
}

/**
 * Provider component for aria-live announcements
 * Should be placed near the root of your app
 */
export function AriaLiveProvider({ children }: { children: ReactNode }) {
  const [politeAnnouncement, setPoliteAnnouncement] = useState('')
  const [assertiveAnnouncement, setAssertiveAnnouncement] = useState('')

  const announce = useCallback((message: string, politeness: AriaLivePoliteness = 'polite') => {
    // Clear first to ensure re-announcement of same message
    if (politeness === 'assertive') {
      setAssertiveAnnouncement('')
      // Small delay to ensure screen readers catch the change
      setTimeout(() => setAssertiveAnnouncement(message), 50)
      // Clear after announcement
      setTimeout(() => setAssertiveAnnouncement(''), 3000)
    } else {
      setPoliteAnnouncement('')
      setTimeout(() => setPoliteAnnouncement(message), 50)
      setTimeout(() => setPoliteAnnouncement(''), 5000)
    }
  }, [])

  const announcePolite = useCallback((message: string) => {
    announce(message, 'polite')
  }, [announce])

  const announceAssertive = useCallback((message: string) => {
    announce(message, 'assertive')
  }, [announce])

  return (
    <AriaLiveContext.Provider value={{ announce, announcePolite, announceAssertive }}>
      {children}

      {/* Visually hidden aria-live regions */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {politeAnnouncement}
      </div>

      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="alert"
      >
        {assertiveAnnouncement}
      </div>
    </AriaLiveContext.Provider>
  )
}

/**
 * Standalone aria-live region for static announcements
 * Use when you don't need the full provider
 */
export function AriaLiveRegion({
  message,
  politeness = 'polite',
}: {
  message: string
  politeness?: AriaLivePoliteness
}) {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      role={politeness === 'assertive' ? 'alert' : 'status'}
    >
      {message}
    </div>
  )
}

/**
 * Hook for announcing results count changes
 */
export function useResultsAnnouncement() {
  const { announcePolite } = useAriaLive()

  const announceResults = useCallback(
    (count: number, itemType: string = 'items') => {
      if (count === 0) {
        announcePolite(`No ${itemType} found`)
      } else if (count === 1) {
        announcePolite(`1 ${itemType.replace(/s$/, '')} found`)
      } else {
        announcePolite(`${count} ${itemType} found`)
      }
    },
    [announcePolite]
  )

  return { announceResults }
}

/**
 * Hook for announcing loading states
 */
export function useLoadingAnnouncement() {
  const { announcePolite, announceAssertive } = useAriaLive()

  const announceLoading = useCallback(
    (itemType: string = 'content') => {
      announcePolite(`Loading ${itemType}...`)
    },
    [announcePolite]
  )

  const announceLoaded = useCallback(
    (itemType: string = 'content') => {
      announcePolite(`${itemType} loaded`)
    },
    [announcePolite]
  )

  const announceError = useCallback(
    (message: string = 'An error occurred') => {
      announceAssertive(message)
    },
    [announceAssertive]
  )

  return { announceLoading, announceLoaded, announceError }
}

export default AriaLiveProvider
