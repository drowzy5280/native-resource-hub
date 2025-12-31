'use client'

import { useEffect, useCallback, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Key prefix for storing scroll positions in sessionStorage
 */
const SCROLL_KEY_PREFIX = 'scroll_position_'

/**
 * Debounce time for saving scroll position (ms)
 */
const DEBOUNCE_TIME = 100

/**
 * Maximum number of scroll positions to store
 */
const MAX_STORED_POSITIONS = 50

/**
 * Get a unique key for the current route
 */
function getScrollKey(pathname: string, searchParams: string): string {
  return `${SCROLL_KEY_PREFIX}${pathname}${searchParams ? `?${searchParams}` : ''}`
}

/**
 * Clean up old scroll positions when storage is full
 */
function cleanupOldPositions() {
  try {
    const keys = Object.keys(sessionStorage).filter((key) =>
      key.startsWith(SCROLL_KEY_PREFIX)
    )

    if (keys.length > MAX_STORED_POSITIONS) {
      // Remove oldest entries (stored earlier in session)
      const toRemove = keys.slice(0, keys.length - MAX_STORED_POSITIONS)
      toRemove.forEach((key) => sessionStorage.removeItem(key))
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Hook for preserving scroll position on back/forward navigation
 *
 * Usage:
 * ```tsx
 * function ResourcesPage() {
 *   useScrollRestoration()
 *   return <div>...</div>
 * }
 * ```
 */
export function useScrollRestoration() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsString = searchParams?.toString() || ''
  const timeoutRef = useRef<NodeJS.Timeout>()
  const isRestoringRef = useRef(false)

  // Save scroll position with debounce
  const saveScrollPosition = useCallback(() => {
    if (isRestoringRef.current) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      try {
        const key = getScrollKey(pathname, searchParamsString)
        const scrollY = window.scrollY

        // Only save if scrolled down
        if (scrollY > 0) {
          sessionStorage.setItem(key, scrollY.toString())
          cleanupOldPositions()
        }
      } catch {
        // Ignore storage errors
      }
    }, DEBOUNCE_TIME)
  }, [pathname, searchParamsString])

  // Restore scroll position
  const restoreScrollPosition = useCallback(() => {
    try {
      const key = getScrollKey(pathname, searchParamsString)
      const savedPosition = sessionStorage.getItem(key)

      if (savedPosition) {
        isRestoringRef.current = true
        const position = parseInt(savedPosition, 10)

        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          window.scrollTo({
            top: position,
            behavior: 'instant',
          })

          // Reset the restoring flag after a short delay
          setTimeout(() => {
            isRestoringRef.current = false
          }, 100)
        })
      }
    } catch {
      // Ignore storage errors
    }
  }, [pathname, searchParamsString])

  // Set up scroll listener and restore on mount
  useEffect(() => {
    // Restore scroll position on mount
    restoreScrollPosition()

    // Add scroll listener to save position
    window.addEventListener('scroll', saveScrollPosition, { passive: true })

    return () => {
      window.removeEventListener('scroll', saveScrollPosition)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [saveScrollPosition, restoreScrollPosition])

  // Also save before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      // Save immediately before unload
      try {
        const key = getScrollKey(pathname, searchParamsString)
        sessionStorage.setItem(key, window.scrollY.toString())
      } catch {
        // Ignore
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pathname, searchParamsString])
}

/**
 * Clear all stored scroll positions
 */
export function clearScrollPositions() {
  try {
    const keys = Object.keys(sessionStorage).filter((key) =>
      key.startsWith(SCROLL_KEY_PREFIX)
    )
    keys.forEach((key) => sessionStorage.removeItem(key))
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clear scroll position for a specific route
 */
export function clearScrollPosition(pathname: string, searchParams = '') {
  try {
    const key = getScrollKey(pathname, searchParams)
    sessionStorage.removeItem(key)
  } catch {
    // Ignore storage errors
  }
}

export default useScrollRestoration
