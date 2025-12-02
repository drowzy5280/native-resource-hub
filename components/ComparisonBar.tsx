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
      <div className="fixed bottom-0 left-0 right-0 bg-clay text-cream shadow-soft-lg z-40 border-t-2 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">
                  Comparing {scholarships.length} scholarship{scholarships.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex gap-2">
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-gold text-midnight font-medium rounded-earth hover:bg-gold/90 transition-colors shadow-soft"
              >
                View Comparison
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-cream/10 hover:bg-cream/20 rounded-earth transition-colors text-sm"
              >
                Clear All
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
