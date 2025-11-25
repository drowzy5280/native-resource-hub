/**
 * Skeleton loading states for cards
 */

export function ResourceCardSkeleton() {
  return (
    <div className="bg-white rounded-earth-lg card-shadow p-6 border border-desert/20 animate-pulse">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-20 bg-gray-200 rounded-earth"></div>
          <div className="h-7 w-16 bg-gray-200 rounded-earth"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      </div>

      <div className="space-y-2 mb-5">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <div className="h-6 w-16 bg-gray-200 rounded-earth"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-earth"></div>
        <div className="h-6 w-18 bg-gray-200 rounded-earth"></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-desert/20">
        <div className="h-10 flex-1 bg-gray-200 rounded-earth"></div>
        <div className="h-10 flex-1 bg-gray-200 rounded-earth"></div>
      </div>
    </div>
  )
}

export function ScholarshipCardSkeleton() {
  return (
    <div className="bg-white rounded-earth-lg card-shadow p-6 border border-desert/20 animate-pulse">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-24 bg-gray-200 rounded-earth"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      </div>

      <div className="space-y-2 mb-5">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      <div className="mb-5 p-4 bg-gray-100 rounded-earth">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <div className="h-6 w-16 bg-gray-200 rounded-earth"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-earth"></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-desert/20">
        <div className="h-10 flex-1 bg-gray-200 rounded-earth"></div>
        <div className="h-10 flex-1 bg-gray-200 rounded-earth"></div>
      </div>
    </div>
  )
}

export function TribeCardSkeleton() {
  return (
    <div className="bg-white rounded-earth-lg card-shadow p-6 border border-desert/20 animate-pulse">
      <div className="mb-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-7 w-20 bg-gray-200 rounded-earth"></div>
          <div className="h-7 w-24 bg-gray-200 rounded-earth"></div>
        </div>

        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-desert/20">
        <div className="h-10 flex-1 bg-gray-200 rounded-earth"></div>
        <div className="h-10 flex-1 bg-gray-200 rounded-earth"></div>
      </div>
    </div>
  )
}

export function DetailPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="bg-white rounded-earth-lg p-8 border border-earth-sand/30">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-24 bg-gray-200 rounded-earth"></div>
            <div className="h-8 w-16 bg-gray-200 rounded-earth"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>

        {/* Eligibility */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/6"></div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded-earth"></div>
            <div className="h-6 w-20 bg-gray-200 rounded-earth"></div>
            <div className="h-6 w-18 bg-gray-200 rounded-earth"></div>
            <div className="h-6 w-22 bg-gray-200 rounded-earth"></div>
          </div>
        </div>

        {/* Button */}
        <div className="mb-8">
          <div className="h-12 w-48 bg-gray-200 rounded-earth"></div>
        </div>
      </div>
    </div>
  )
}
