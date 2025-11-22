import { SectionHeader } from '@/components/SectionHeader'
import { ResourceCard } from '@/components/ResourceCard'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { tags?: string; type?: string; state?: string }
}) {
  const where: any = {}

  if (searchParams.tags) {
    where.tags = {
      has: searchParams.tags,
    }
  }

  if (searchParams.type) {
    where.type = searchParams.type
  }

  if (searchParams.state) {
    where.OR = [
      { state: searchParams.state },
      { state: null },
    ]
  }

  const resources = await prisma.resource.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      tribe: {
        select: { id: true, name: true },
      },
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        title="All Resources"
        description={`${resources.length} resources available`}
      />

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
    </div>
  )
}
