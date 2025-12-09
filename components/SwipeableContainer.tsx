'use client'

import { useRef, useState, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface SwipeableContainerProps {
  children: ReactNode
  /** Enable swipe back gesture (swipe right to go back) */
  enableBackGesture?: boolean
  /** Custom swipe left handler */
  onSwipeLeft?: () => void
  /** Custom swipe right handler */
  onSwipeRight?: () => void
  /** Minimum swipe distance in pixels */
  threshold?: number
  /** Show visual indicator during swipe */
  showIndicator?: boolean
  /** CSS class name */
  className?: string
}

export function SwipeableContainer({
  children,
  enableBackGesture = true,
  onSwipeLeft,
  onSwipeRight,
  threshold = 80,
  showIndicator = true,
  className = '',
}: SwipeableContainerProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchCurrent, setTouchCurrent] = useState<{ x: number; y: number } | null>(null)
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
    setTouchCurrent({ x: touch.clientX, y: touch.clientY })
    setIsHorizontalSwipe(false)
    setSwipeDirection(null)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y

    // Determine if this is a horizontal swipe (first 10px of movement)
    if (!isHorizontalSwipe && Math.abs(deltaX) > 10) {
      // Only consider it horizontal if more horizontal than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setIsHorizontalSwipe(true)
      }
    }

    if (isHorizontalSwipe) {
      setTouchCurrent({ x: touch.clientX, y: touch.clientY })

      // Determine direction
      if (deltaX > 20) {
        setSwipeDirection('right')
      } else if (deltaX < -20) {
        setSwipeDirection('left')
      }
    }
  }, [touchStart, isHorizontalSwipe])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchCurrent || !isHorizontalSwipe) {
      resetSwipe()
      return
    }

    const deltaX = touchCurrent.x - touchStart.x

    // Right swipe (go back)
    if (deltaX > threshold) {
      if (onSwipeRight) {
        onSwipeRight()
      } else if (enableBackGesture) {
        router.back()
      }
    }
    // Left swipe
    else if (deltaX < -threshold && onSwipeLeft) {
      onSwipeLeft()
    }

    resetSwipe()
  }, [touchStart, touchCurrent, isHorizontalSwipe, threshold, onSwipeRight, onSwipeLeft, enableBackGesture, router])

  const resetSwipe = () => {
    setTouchStart(null)
    setTouchCurrent(null)
    setIsHorizontalSwipe(false)
    setSwipeDirection(null)
  }

  // Calculate swipe progress for visual indicator
  const swipeProgress = touchStart && touchCurrent && isHorizontalSwipe
    ? Math.min(Math.abs(touchCurrent.x - touchStart.x) / threshold, 1)
    : 0

  const swipeOffset = touchStart && touchCurrent && isHorizontalSwipe
    ? touchCurrent.x - touchStart.x
    : 0

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={resetSwipe}
    >
      {/* Back gesture indicator */}
      {showIndicator && enableBackGesture && swipeDirection === 'right' && swipeProgress > 0 && (
        <div
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
          style={{
            opacity: swipeProgress,
            transform: `translateY(-50%) translateX(${Math.min(swipeOffset * 0.3, 40)}px)`,
          }}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              swipeProgress >= 1 ? 'bg-pine text-white' : 'bg-white text-text-secondary'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          {swipeProgress >= 1 && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-pine font-medium whitespace-nowrap">
              Release to go back
            </span>
          )}
        </div>
      )}

      {/* Left swipe indicator (if custom handler provided) */}
      {showIndicator && onSwipeLeft && swipeDirection === 'left' && swipeProgress > 0 && (
        <div
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
          style={{
            opacity: swipeProgress,
            transform: `translateY(-50%) translateX(${Math.max(swipeOffset * 0.3, -40)}px)`,
          }}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              swipeProgress >= 1 ? 'bg-pine text-white' : 'bg-white text-text-secondary'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}

// Swipeable card list for browsing resources/scholarships
interface SwipeableCardListProps {
  children: ReactNode[]
  onEndReached?: () => void
  className?: string
}

export function SwipeableCardList({
  children,
  onEndReached,
  className = '',
}: SwipeableCardListProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSwipeLeft = useCallback(() => {
    if (currentIndex < children.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (onEndReached) {
      onEndReached()
    }
  }, [currentIndex, children.length, onEndReached])

  const handleSwipeRight = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }, [currentIndex])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <SwipeableContainer
        enableBackGesture={false}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        threshold={50}
      >
        <div
          ref={containerRef}
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              {child}
            </div>
          ))}
        </div>
      </SwipeableContainer>

      {/* Pagination dots */}
      {children.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-pine w-4'
                  : 'bg-desert-dark hover:bg-stone-light'
              }`}
              aria-label={`Go to item ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation hint */}
      <p className="text-center text-xs text-text-muted mt-2 md:hidden">
        Swipe left or right to browse
      </p>
    </div>
  )
}
