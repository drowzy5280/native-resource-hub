export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-8 animate-pulse">
        <div className="h-4 bg-earth-sand/30 rounded w-16"></div>
        <div className="h-4 bg-earth-sand/30 rounded w-4"></div>
        <div className="h-4 bg-earth-sand/30 rounded w-20"></div>
        <div className="h-4 bg-earth-sand/30 rounded w-4"></div>
        <div className="h-4 bg-earth-sand/30 rounded w-40"></div>
      </div>

      {/* Ad Unit Placeholder */}
      <div className="mb-8 flex justify-center">
        <div className="h-24 bg-earth-sand/20 rounded w-full max-w-[970px] animate-pulse"></div>
      </div>

      {/* Tribe Header Card */}
      <div className="bg-white rounded-earth-lg p-8 mb-8 border border-earth-sand/30 animate-pulse">
        {/* Title Skeleton */}
        <div className="h-10 bg-earth-sand/30 rounded w-2/3 mb-4"></div>

        {/* Tags Skeleton */}
        <div className="flex gap-3 mb-6">
          <div className="h-8 bg-earth-sand/30 rounded-full w-24"></div>
          <div className="h-8 bg-earth-sand/30 rounded-full w-32"></div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="h-5 bg-earth-sand/30 rounded w-40 mb-2"></div>
            <div className="h-4 bg-earth-sand/20 rounded w-full"></div>
          </div>
        </div>

        {/* Language Resources */}
        <div className="mb-6">
          <div className="h-5 bg-earth-sand/30 rounded w-44 mb-2"></div>
          <div className="space-y-1">
            <div className="h-4 bg-earth-sand/20 rounded w-64"></div>
            <div className="h-4 bg-earth-sand/20 rounded w-56"></div>
          </div>
        </div>

        {/* Website Button Skeleton */}
        <div className="h-12 bg-earth-sand/30 rounded-earth w-56"></div>
      </div>

      {/* Programs Section */}
      <div className="mb-6 animate-pulse">
        <div className="h-8 bg-earth-sand/30 rounded w-56 mb-2"></div>
        <div className="h-5 bg-earth-sand/20 rounded w-48"></div>
      </div>

      {/* Programs Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-earth-lg p-6 border border-earth-sand/30">
            {/* Tag */}
            <div className="h-6 bg-earth-sand/30 rounded-full w-20 mb-3"></div>
            {/* Title */}
            <div className="h-6 bg-earth-sand/30 rounded w-full mb-3"></div>
            {/* Description */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-earth-sand/20 rounded w-full"></div>
              <div className="h-4 bg-earth-sand/20 rounded w-5/6"></div>
            </div>
            {/* Tags */}
            <div className="flex gap-2">
              <div className="h-6 bg-earth-sand/20 rounded-full w-16"></div>
              <div className="h-6 bg-earth-sand/20 rounded-full w-20"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Ad Unit Placeholder */}
      <div className="my-8 flex justify-center">
        <div className="h-24 bg-earth-sand/20 rounded w-full max-w-[970px] animate-pulse"></div>
      </div>
    </div>
  )
}
