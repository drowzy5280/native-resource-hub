import Link from 'next/link'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-earth-brown mb-2">{title}</h3>
      <p className="text-earth-brown/70 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-block px-6 py-3 bg-earth-teal text-white rounded-earth hover:bg-earth-teal/90 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

export function NoResourcesFound() {
  return (
    <EmptyState
      icon="🔍"
      title="No Resources Found"
      description="We couldn't find any resources matching your criteria. Try adjusting your filters or check back later."
      actionLabel="View All Resources"
      actionHref="/resources"
    />
  )
}

export function NoScholarshipsFound() {
  return (
    <EmptyState
      icon="🎓"
      title="No Scholarships Found"
      description="There are no scholarships matching your search. Check back soon for new opportunities."
      actionLabel="View All Scholarships"
      actionHref="/scholarships"
    />
  )
}

export function NoTribesFound() {
  return (
    <EmptyState
      icon="🏛️"
      title="No Tribes Found"
      description="We couldn't find any tribes matching your search."
      actionLabel="View All Tribes"
      actionHref="/tribes"
    />
  )
}
