export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-8 animate-pulse">
        <div className="h-4 bg-earth-sand/30 rounded w-16"></div>
        <div className="h-4 bg-earth-sand/30 rounded w-4"></div>
        <div className="h-4 bg-earth-sand/30 rounded w-28"></div>
        <div className="h-4 bg-earth-sand/30 rounded w-4"></div>
        <div className="h-4 bg-earth-sand/30 rounded w-40"></div>
      </div>

      {/* Ad Unit Placeholder */}
      <div className="mb-8 flex justify-center">
        <div className="h-24 bg-earth-sand/20 rounded w-full max-w-[728px] animate-pulse"></div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-earth-lg p-8 border border-earth-sand/30 animate-pulse">
        {/* Amount Badge Skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 bg-earth-sand/30 rounded-full w-32"></div>
          <div className="h-8 bg-earth-sand/30 rounded-full w-28"></div>
        </div>

        {/* Title Skeleton */}
        <div className="h-10 bg-earth-sand/30 rounded w-3/4 mb-4"></div>

        {/* Deadline Section */}
        <div className="mb-8 p-4 bg-earth-sand/20 rounded-earth-lg">
          <div className="h-5 bg-earth-sand/30 rounded w-40 mb-2"></div>
          <div className="h-8 bg-earth-sand/30 rounded w-48 mb-1"></div>
          <div className="h-4 bg-earth-sand/20 rounded w-32"></div>
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <div className="h-6 bg-earth-sand/30 rounded w-48 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-earth-sand/20 rounded w-full"></div>
            <div className="h-4 bg-earth-sand/20 rounded w-full"></div>
            <div className="h-4 bg-earth-sand/20 rounded w-5/6"></div>
          </div>
        </div>

        {/* Eligibility Section */}
        <div className="mb-8">
          <div className="h-6 bg-earth-sand/30 rounded w-52 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-earth-sand/20 rounded w-full"></div>
            <div className="h-4 bg-earth-sand/20 rounded w-11/12"></div>
            <div className="h-4 bg-earth-sand/20 rounded w-5/6"></div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="mb-8">
          <div className="h-6 bg-earth-sand/30 rounded w-28 mb-3"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-8 bg-earth-sand/20 rounded-full w-24"></div>
            <div className="h-8 bg-earth-sand/20 rounded-full w-32"></div>
            <div className="h-8 bg-earth-sand/20 rounded-full w-20"></div>
          </div>
        </div>

        {/* Apply Button Skeleton */}
        <div className="mb-8">
          <div className="h-14 bg-earth-sand/30 rounded-earth-lg w-40"></div>
        </div>

        {/* Meta Section */}
        <div className="border-t border-earth-sand pt-6">
          <div className="h-3 bg-earth-sand/20 rounded w-48"></div>
        </div>
      </div>

      {/* Bottom Ad Unit Placeholder */}
      <div className="mt-8 flex justify-center">
        <div className="h-24 bg-earth-sand/20 rounded w-full max-w-[728px] animate-pulse"></div>
      </div>
    </div>
  )
}
