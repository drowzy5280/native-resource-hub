'use client'

import { useState } from 'react'
import { useComparison } from './ComparisonContext'
import { ComparisonModal } from './ComparisonModal'

export function ComparisonBar() {
  const { scholarships, clearAll } = useComparison()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (scholarships.length === 0) {
    return null
  }

  return (
    <>
      {/* Comparison bar - positioned above BottomNav on mobile */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-clay text-cream shadow-soft-lg z-50 border-t-2 border-gold">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-2 flex-shrink-0">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium text-sm sm:text-base">
                  <span className="hidden xs:inline">Comparing </span>{scholarships.length}<span className="hidden sm:inline"> scholarship{scholarships.length !== 1 ? 's' : ''}</span>
                </span>
              </div>
              {/* Hide scholarship name chips on mobile */}
              <div className="hidden md:flex gap-2">
                {scholarships.map(scholarship => (
                  <div
                    key={scholarship.id}
                    className="bg-cream/20 rounded-earth px-3 py-1 text-sm flex items-center gap-2"
                  >
                    <span className="truncate max-w-[120px]">{scholarship.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="min-h-[44px] px-4 sm:px-6 py-2 bg-gold text-midnight font-medium rounded-earth hover:bg-gold/90 transition-colors shadow-soft text-sm sm:text-base"
                aria-label={`View comparison of ${scholarships.length} scholarships`}
              >
                <span className="hidden sm:inline">View </span>Compare
              </button>
              <button
                onClick={clearAll}
                className="min-h-[44px] min-w-[44px] px-3 sm:px-4 py-2 bg-cream/10 hover:bg-cream/20 rounded-earth transition-colors text-sm flex items-center justify-center"
                aria-label="Clear all scholarships from comparison"
              >
                <span className="hidden sm:inline">Clear All</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
