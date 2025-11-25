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
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 rounded-earth border border-earth-sand hover:bg-earth-sand/10 transition-colors"
        >
          Previous
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 rounded-earth border border-earth-sand/30 text-earth-brown/30 cursor-not-allowed"
        >
          Previous
        </button>
      )}

      {/* Page numbers */}
      <div className="flex gap-2">
        {pages.map((page, index) => {
          if (page < 0) {
            // Render ellipsis
            return (
              <span key={`ellipsis-${index}`} className="px-4 py-2">
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
                px-4 py-2 rounded-earth border transition-colors
                ${
                  isActive
                    ? 'bg-earth-brown text-earth-cream border-earth-brown'
                    : 'border-earth-sand hover:bg-earth-sand/10'
                }
              `}
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
          className="px-4 py-2 rounded-earth border border-earth-sand hover:bg-earth-sand/10 transition-colors"
        >
          Next
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 rounded-earth border border-earth-sand/30 text-earth-brown/30 cursor-not-allowed"
        >
          Next
        </button>
      )}
    </div>
  )
}
