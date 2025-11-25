import { SectionHeader } from '@/components/SectionHeader'
import { ResourceCard } from '@/components/ResourceCard'
import { FilterBar } from '@/components/FilterBar'
import { Pagination } from '@/components/Pagination'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

const ITEMS_PER_PAGE = 20

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { tags?: string; type?: string; state?: string; page?: string }
}) {
  const currentPage = parseInt(searchParams.page || '1', 10)
  const skip = (currentPage - 1) * ITEMS_PER_PAGE

  const where: Prisma.ResourceWhereInput = {
    deletedAt: null,
  }

  if (searchParams.tags) {
    where.tags = {
      has: searchParams.tags,
    }
  }

  if (searchParams.type) {
    where.type = searchParams.type as any
  }

  if (searchParams.state) {
    where.OR = [
      { state: searchParams.state },
      { state: null },
    ]
  }

  const [resources, totalCount] = await Promise.all([
    prisma.resource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: ITEMS_PER_PAGE,
      skip,
      include: {
        tribe: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.resource.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        title="All Resources"
        description={`${totalCount} total resources (showing ${resources.length} on page ${currentPage} of ${totalPages})`}
      />

      {/* Filter Bar */}
      <FilterBar showTypeFilter={true} showStateFilter={true} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            id={resource.id}
            title={resource.title}
            description={resource.description}
            type={resource.type}
            tags={resource.tags}
            tribe={resource.tribe || undefined}
            state={resource.state}
            url={resource.url}
          />
        ))}
      </div>

      {resources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-earth-brown/60 text-lg">
            No resources found. Try adjusting your filters.
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/resources" />
    </div>
  )
}
