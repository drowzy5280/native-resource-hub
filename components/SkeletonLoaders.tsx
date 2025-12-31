'use client'

/**
 * Skeleton Loaders
 * Consistent skeleton loading states for all list pages
 */

interface SkeletonProps {
  className?: string
}

/**
 * Base skeleton element
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-desert/60 rounded-earth animate-skeleton ${className}`}
      aria-hidden="true"
    />
  )
}

/**
 * Resource card skeleton
 */
export function ResourceCardSkeleton() {
  return (
    <div className="bg-white rounded-earth-lg shadow-card p-6 border border-desert/40">
      {/* Type badge */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-6 w-1/2 mb-4" />

      {/* Description */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6 mb-4" />

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-earth" />
        <Skeleton className="h-10 flex-1 rounded-earth" />
      </div>
    </div>
  )
}

/**
 * Scholarship card skeleton
 */
export function ScholarshipCardSkeleton() {
  return (
    <div className="bg-white rounded-earth-lg shadow-card p-6 border border-desert/40">
      {/* Amount and badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-24 rounded-earth" />
          <Skeleton className="h-7 w-20 rounded-earth" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="h-6 w-4/5 mb-2" />
      <Skeleton className="h-6 w-2/3 mb-4" />

      {/* Description */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />

      {/* Deadline box */}
      <div className="bg-desert/20 rounded-earth p-4 mb-4">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-earth" />
        <Skeleton className="h-10 flex-1 rounded-earth" />
      </div>
    </div>
  )
}

/**
 * Tribe card skeleton
 */
export function TribeCardSkeleton() {
  return (
    <div className="bg-white rounded-earth-lg shadow-card p-6 border border-desert/40">
      {/* Title and badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-16 rounded-earth" />
      </div>

      {/* Info items */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-earth" />
        <Skeleton className="h-10 w-10 rounded-earth" />
      </div>
    </div>
  )
}

/**
 * Grant card skeleton
 */
export function GrantCardSkeleton() {
  return (
    <div className="bg-white rounded-earth-lg shadow-card p-6 border border-desert/40">
      {/* Amount and type */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-7 w-28 rounded-earth" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="h-6 w-4/5 mb-2" />
      <Skeleton className="h-6 w-1/2 mb-4" />

      {/* Agency */}
      <Skeleton className="h-4 w-48 mb-4" />

      {/* Description */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6 mb-4" />

      {/* Deadline */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-earth" />
        <Skeleton className="h-10 flex-1 rounded-earth" />
      </div>
    </div>
  )
}

/**
 * Grid of skeleton cards
 */
interface SkeletonGridProps {
  count?: number
  columns?: 1 | 2 | 3 | 4
  type: 'resource' | 'scholarship' | 'tribe' | 'grant'
}

export function SkeletonGrid({ count = 6, columns = 3, type }: SkeletonGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  const SkeletonComponent = {
    resource: ResourceCardSkeleton,
    scholarship: ScholarshipCardSkeleton,
    tribe: TribeCardSkeleton,
    grant: GrantCardSkeleton,
  }[type]

  return (
    <div
      className={`grid ${gridCols[columns]} gap-6`}
      role="status"
      aria-label={`Loading ${type}s...`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  )
}

/**
 * Page header skeleton
 */
export function PageHeaderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-10 w-64 mb-4" />
      <Skeleton className="h-5 w-96 max-w-full" />
    </div>
  )
}

/**
 * Filter bar skeleton
 */
export function FilterBarSkeleton() {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Skeleton className="h-10 w-32 rounded-earth" />
      <Skeleton className="h-10 w-28 rounded-earth" />
      <Skeleton className="h-10 w-36 rounded-earth" />
      <Skeleton className="h-10 w-24 rounded-earth" />
    </div>
  )
}

/**
 * Full page loading skeleton
 */
export function PageLoadingSkeleton({
  type,
  count = 6,
}: {
  type: 'resource' | 'scholarship' | 'tribe' | 'grant'
  count?: number
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeaderSkeleton />
      <FilterBarSkeleton />
      <SkeletonGrid type={type} count={count} />
    </div>
  )
}

/**
 * Resource detail page skeleton
 */
export function ResourceDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="status" aria-label="Loading resource details...">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-7 w-20 rounded-earth" />
          <Skeleton className="h-7 w-24 rounded-earth" />
        </div>
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-5/6" />
      </div>

      {/* Main content */}
      <div className="bg-white rounded-earth-lg shadow-card p-6 border border-desert/40 mb-8">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Eligibility section */}
      <div className="bg-white rounded-earth-lg shadow-card p-6 border border-desert/40 mb-8">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Skeleton className="h-12 flex-1 rounded-earth" />
        <Skeleton className="h-12 flex-1 rounded-earth" />
      </div>

      <span className="sr-only">Loading resource details, please wait...</span>
    </div>
  )
}

/**
 * Scholarship detail page skeleton
 */
export function ScholarshipDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="status" aria-label="Loading scholarship details...">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-8 w-28 rounded-earth" />
          <Skeleton className="h-8 w-24 rounded-earth" />
        </div>
        <Skeleton className="h-10 w-4/5 mb-2" />
        <Skeleton className="h-10 w-2/3 mb-4" />
      </div>

      {/* Deadline card */}
      <div className="bg-desert/20 rounded-earth-lg p-6 border border-desert/40 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Description */}
      <div className="bg-white rounded-earth-lg shadow-card p-6 border border-desert/40 mb-8">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white rounded-earth-lg shadow-card p-6 border border-desert/40 mb-8">
        <Skeleton className="h-6 w-36 mb-4" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-52" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-44" />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Skeleton className="h-12 flex-1 rounded-earth" />
        <Skeleton className="h-12 flex-1 rounded-earth" />
      </div>

      <span className="sr-only">Loading scholarship details, please wait...</span>
    </div>
  )
}

/**
 * Blog post detail skeleton
 */
export function BlogPostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="status" aria-label="Loading article...">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex gap-3 mb-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Featured image */}
      <Skeleton className="h-64 md:h-96 w-full rounded-earth-lg mb-8" />

      {/* Content */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-6 w-48 mt-6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>

      <span className="sr-only">Loading article, please wait...</span>
    </div>
  )
}

export default SkeletonGrid
