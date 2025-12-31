import Link from 'next/link'

interface RelatedItem {
  id: string
  title?: string
  name?: string
  description: string
  type?: string
  tags: string[]
}

interface RelatedResourcesProps {
  items: RelatedItem[]
  resourceType: 'resource' | 'scholarship'
  className?: string
}

// Server component - no client-side fetching needed
// Data should be fetched and passed as props from the parent page
export function RelatedResources({
  items,
  resourceType,
  className = '',
}: RelatedResourcesProps) {
  if (items.length === 0) {
    return null
  }

  const basePath = resourceType === 'scholarship' ? '/scholarships' : '/resources'
  const title = resourceType === 'scholarship' ? 'Related Scholarships' : 'Related Resources'

  return (
    <div className={`${className}`}>
      <h3 className="text-xl font-heading font-bold text-text mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`${basePath}/${item.id}`}
            className="group bg-white rounded-earth p-4 border border-desert/20 hover:border-pine/40 hover:shadow-soft transition-all"
          >
            <h4 className="font-heading font-semibold text-text group-hover:text-pine transition-colors line-clamp-2 mb-2">
              {item.title || item.name}
            </h4>
            <p className="text-sm text-text-secondary line-clamp-2 mb-3">
              {item.description}
            </p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-desert/20 text-text-muted rounded-earth"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

// Loading skeleton for use with Suspense
export function RelatedResourcesSkeleton({
  count = 4,
  resourceType = 'resource',
  className = ''
}: {
  count?: number
  resourceType?: 'resource' | 'scholarship'
  className?: string
}) {
  const title = resourceType === 'scholarship' ? 'Related Scholarships' : 'Related Resources'

  return (
    <div className={`${className}`}>
      <h3 className="text-xl font-heading font-bold text-text mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 animate-pulse rounded-earth h-32"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}

// Helper function to fetch related items server-side
// Use this in your page component to get the data
export async function getRelatedResources(
  prisma: { resource: { findMany: Function } },
  currentId: string,
  currentTags: string[],
  currentType?: string,
  limit: number = 4
) {
  if (currentTags.length === 0) {
    return []
  }

  const resources = await prisma.resource.findMany({
    where: {
      id: { not: currentId },
      deletedAt: null,
      OR: [
        { tags: { hasSome: currentTags } },
        ...(currentType ? [{ type: currentType as 'federal' | 'state' | 'tribal' | 'scholarship' | 'emergency' }] : []),
      ],
    },
    take: limit,
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return resources
}

export async function getRelatedScholarships(
  prisma: { scholarship: { findMany: Function } },
  currentId: string,
  currentTags: string[],
  limit: number = 4
) {
  if (currentTags.length === 0) {
    return []
  }

  const scholarships = await prisma.scholarship.findMany({
    where: {
      id: { not: currentId },
      deletedAt: null,
      tags: { hasSome: currentTags },
    },
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      tags: true,
    },
    orderBy: {
      deadline: 'asc',
    },
  })

  return scholarships
}

// Simple component for showing related items inline
interface RelatedItemsInlineProps {
  items: Array<{ id: string; title?: string; name?: string }>
  basePath: string
  className?: string
}

export function RelatedItemsInline({ items, basePath, className = '' }: RelatedItemsInlineProps) {
  if (items.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <span className="text-sm text-text-muted">Related:</span>
      {items.map((item, index) => (
        <span key={item.id}>
          <Link
            href={`${basePath}/${item.id}`}
            className="text-sm text-pine hover:underline"
          >
            {item.title || item.name}
          </Link>
          {index < items.length - 1 && <span className="text-text-muted">, </span>}
        </span>
      ))}
    </div>
  )
}
