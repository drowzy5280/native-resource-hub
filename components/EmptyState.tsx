'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  suggestions?: string[]
  secondaryAction?: {
    label: string
    href: string
  }
  /** Show a "Clear Filters" button when filters are active */
  showClearFilters?: boolean
  /** Callback when clear filters is clicked (alternative to URL-based clearing) */
  onClearFilters?: () => void
  /** Custom clear filters URL path */
  clearFiltersHref?: string
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  actionHref,
  suggestions = [],
  secondaryAction,
  showClearFilters,
  onClearFilters,
  clearFiltersHref,
}: EmptyStateProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if there are any filter params (excluding pagination)
  const hasFilters = Array.from(searchParams?.keys() || []).some(
    (key) => !['page', 'limit'].includes(key)
  )

  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters()
    } else if (clearFiltersHref) {
      router.push(clearFiltersHref)
    } else {
      // Default: go to the same path without query params
      router.push(window.location.pathname)
    }
  }

  const shouldShowClearFilters = showClearFilters !== false && hasFilters

  return (
    <div
      className="text-center py-12 px-4"
      role="status"
      aria-live="polite"
    >
      <div className="text-6xl mb-4" aria-hidden="true">{icon}</div>
      <h3 className="text-xl font-heading font-semibold text-text mb-2">{title}</h3>
      <p className="text-text-muted mb-6 max-w-md mx-auto">{description}</p>

      {/* Clear Filters Button - prominent when filters are active */}
      {shouldShowClearFilters && (
        <div className="mb-6">
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-clay/10 text-clay-dark border-2 border-clay/30 rounded-earth-lg font-medium hover:bg-clay/20 hover:border-clay/50 transition-colors focus:outline-none focus:ring-2 focus:ring-clay focus:ring-offset-2"
            aria-label="Clear all active filters"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear All Filters
          </button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="bg-desert/10 rounded-earth-lg p-6 mb-6 max-w-lg mx-auto text-left">
          <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Try these suggestions:
          </h4>
          <ul className="space-y-2 text-text-secondary text-sm" role="list">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <svg className="w-5 h-5 text-pine flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 px-6 py-3 bg-clay text-white rounded-earth-lg hover:bg-clay-dark transition-colors shadow-soft hover:shadow-soft-lg focus:outline-none focus:ring-2 focus:ring-clay focus:ring-offset-2 min-h-[44px]"
          >
            {actionLabel}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
        {secondaryAction && (
          <Link
            href={secondaryAction.href}
            className="inline-block px-6 py-3 bg-white text-clay border-2 border-clay rounded-earth-lg hover:bg-clay/5 transition-colors focus:outline-none focus:ring-2 focus:ring-clay focus:ring-offset-2 min-h-[44px]"
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  )
}

export function NoResourcesFound() {
  return (
    <EmptyState
      icon="🔍"
      title="No Resources Found"
      description="We couldn't find any resources matching your criteria. Try adjusting your filters or broadening your search."
      suggestions={[
        'Remove or adjust state filters to see more results',
        'Try different categories or resource types',
        'Use broader search terms',
        'Check back later for new resources',
      ]}
      actionLabel="View All Resources"
      actionHref="/resources"
      secondaryAction={{
        label: 'Browse Nonprofits',
        href: '/nonprofits',
      }}
    />
  )
}

export function NoScholarshipsFound() {
  return (
    <EmptyState
      icon="🎓"
      title="No Scholarships Found"
      description="There are no scholarships matching your search. Check back soon for new opportunities."
      suggestions={[
        'Adjust your filters to see more scholarships',
        'Browse scholarships by state or category',
        'Check back regularly - new scholarships are added often',
        'Look for alternative funding in our Resources section',
      ]}
      actionLabel="View All Scholarships"
      actionHref="/scholarships"
      secondaryAction={{
        label: 'Browse Resources',
        href: '/resources?tags=education',
      }}
    />
  )
}

export function NoTribesFound() {
  return (
    <EmptyState
      icon="🏛️"
      title="No Tribes Found"
      description="We couldn't find any tribes matching your search."
      suggestions={[
        'Try searching by state or region',
        'Check your spelling - try alternative tribe names',
        'Browse all tribes to find your nation',
      ]}
      actionLabel="View All Tribes"
      actionHref="/tribes"
      secondaryAction={{
        label: 'Browse Resources',
        href: '/resources',
      }}
    />
  )
}
