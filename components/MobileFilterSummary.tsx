'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

interface FilterSummaryProps {
  /** Total count of items */
  totalCount?: number
  /** Whether results are loading */
  isLoading?: boolean
  /** Callback when clear filters is clicked */
  onClearFilters?: () => void
  /** Labels for filter types */
  filterLabels?: {
    type?: string
    state?: string
    tags?: string
    search?: string
    [key: string]: string | undefined
  }
}

/**
 * Sticky mobile filter summary that shows active filters count and quick clear
 */
export function MobileFilterSummary({
  totalCount,
  isLoading,
  onClearFilters,
  filterLabels = {},
}: FilterSummaryProps) {
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Calculate active filters
  const activeFilters = useMemo(() => {
    const filters: { key: string; value: string; label: string }[] = []

    searchParams?.forEach((value, key) => {
      // Skip pagination and sorting params
      if (['page', 'limit', 'sort', 'order'].includes(key)) return

      const label = filterLabels[key] || key
      filters.push({ key, value, label })
    })

    return filters
  }, [searchParams, filterLabels])

  const filterCount = activeFilters.length

  // Show/hide based on scroll direction and position
  useEffect(() => {
    if (filterCount === 0) {
      setIsVisible(false)
      return
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show when scrolled down past 200px and has filters
      if (currentScrollY > 200 && filterCount > 0) {
        // Show when scrolling up or at top
        if (currentScrollY < lastScrollY || currentScrollY < 300) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      } else {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [filterCount, lastScrollY])

  // Don't render if no filters or on desktop
  if (filterCount === 0) return null

  return (
    <div
      className={`
        fixed bottom-20 left-0 right-0 z-40
        md:hidden
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
      role="status"
      aria-live="polite"
    >
      <div className="mx-4 bg-white border border-desert/40 rounded-earth-lg shadow-soft-lg p-3">
        <div className="flex items-center justify-between gap-3">
          {/* Filter count and results */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center justify-center w-6 h-6 bg-clay text-white text-xs font-bold rounded-full flex-shrink-0">
              {filterCount}
            </span>
            <span className="text-sm text-text-secondary truncate">
              {isLoading ? (
                'Loading...'
              ) : totalCount !== undefined ? (
                <>
                  <span className="font-semibold text-text">{totalCount}</span> results
                </>
              ) : (
                `${filterCount} filter${filterCount !== 1 ? 's' : ''} active`
              )}
            </span>
          </div>

          {/* Clear button */}
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-clay bg-clay/10 hover:bg-clay/20 rounded-earth transition-colors"
              aria-label="Clear all filters"
            >
              Clear
            </button>
          )}
        </div>

        {/* Active filters preview */}
        {activeFilters.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 max-h-12 overflow-hidden">
            {activeFilters.slice(0, 3).map((filter) => (
              <span
                key={`${filter.key}-${filter.value}`}
                className="inline-flex items-center px-2 py-0.5 text-xs bg-desert/50 text-text-secondary rounded-earth truncate max-w-[100px]"
                title={`${filter.label}: ${filter.value}`}
              >
                {filter.value}
              </span>
            ))}
            {activeFilters.length > 3 && (
              <span className="text-xs text-text-muted">
                +{activeFilters.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileFilterSummary
