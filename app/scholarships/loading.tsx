import { LoadingCardGrid } from '@/components/LoadingSpinner'

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-8 bg-earth-sand/30 rounded w-64 mb-8 animate-pulse"></div>
      <LoadingCardGrid count={6} />
    </div>
  )
}
