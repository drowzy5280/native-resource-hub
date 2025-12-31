'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl?: string
}

export function Pagination({ currentPage, totalPages, baseUrl = '' }: PaginationProps) {
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  if (totalPages <= 1) return null

  const pages = []
  const showEllipsis = totalPages > 7

  if (showEllipsis) {
    // Always show first page
    pages.push(1)

    // Show ellipsis or pages near current page
    if (currentPage > 3) {
      pages.push(-1) // -1 represents ellipsis
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }

    // Show ellipsis before last page
    if (currentPage < totalPages - 2) {
      pages.push(-2) // -2 represents ellipsis
    }

    // Always show last page
    pages.push(totalPages)
  } else {
    // Show all pages if there are 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  }

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2 mt-8"
      role="navigation"
      aria-label="Pagination"
    >
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="min-w-[44px] min-h-[44px] px-3 sm:px-4 py-2 rounded-earth border border-stone/40 bg-white text-text font-medium hover:bg-desert/30 hover:border-stone/60 transition-colors flex items-center justify-center gap-1"
          aria-label="Go to previous page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <button
          disabled
          className="min-w-[44px] min-h-[44px] px-3 sm:px-4 py-2 rounded-earth border border-desert bg-desert/20 text-stone-light cursor-not-allowed flex items-center justify-center gap-1"
          aria-label="No previous page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>
      )}

      {/* Page numbers */}
      <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
        {pages.map((page, index) => {
          if (page < 0) {
            // Render ellipsis
            return (
              <span key={`ellipsis-${index}`} className="min-w-[44px] min-h-[44px] px-2 sm:px-4 py-2 flex items-center justify-center text-text-secondary font-medium" aria-hidden="true">
                ...
              </span>
            )
          }

          const isActive = page === currentPage

          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`
                min-w-[44px] min-h-[44px] px-3 sm:px-4 py-2 rounded-earth border transition-colors flex items-center justify-center font-medium
                ${
                  isActive
                    ? 'bg-pine text-white border-pine'
                    : 'bg-white text-text border-stone/40 hover:bg-desert/30 hover:border-stone/60'
                }
              `}
              aria-label={`Page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </Link>
          )
        })}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="min-w-[44px] min-h-[44px] px-3 sm:px-4 py-2 rounded-earth border border-stone/40 bg-white text-text font-medium hover:bg-desert/30 hover:border-stone/60 transition-colors flex items-center justify-center gap-1"
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <button
          disabled
          className="min-w-[44px] min-h-[44px] px-3 sm:px-4 py-2 rounded-earth border border-desert bg-desert/20 text-stone-light cursor-not-allowed flex items-center justify-center gap-1"
          aria-label="No next page"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  )
}
