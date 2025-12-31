import { SectionHeader } from '@/components/SectionHeader'
import { ResourceCard } from '@/components/ResourceCard'
import { AdvancedFilterBar } from '@/components/AdvancedFilterBar'
import { Pagination } from '@/components/Pagination'
import { BannerAd } from '@/components/GoogleAdsense'
import { prisma } from '@/lib/prisma'
import type { Prisma, ResourceType } from '@prisma/client'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const ITEMS_PER_PAGE = 20

export const metadata: Metadata = {
  title: 'Browse Resources | Tribal Resource Hub',
  description: 'Explore 175+ verified resources for Native American communities including federal programs (IHS, BIA, HUD), state assistance, tribal services, and emergency support. Filter by state, category, or program type to find education, healthcare, housing, employment, and cultural preservation resources.',
  keywords: [
    'Native American resources',
    'Indigenous programs',
    'tribal services',
    'federal programs',
    'state programs',
    'Native American support',
    'tribal assistance',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'}/resources`,
  },
  openGraph: {
    title: 'Browse Resources',
    description: 'Discover federal, state, and tribal programs for Native American communities.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'}/resources`,
    siteName: 'Tribal Resource Hub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Resources',
    description: 'Discover federal, state, and tribal programs for Native American communities.',
  },
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: {
    tags?: string
    type?: string
    state?: string
    page?: string
    sort?: string
    difficulty?: string
  }
}) {
  const currentPage = parseInt(searchParams.page || '1', 10)
  const skip = (currentPage - 1) * ITEMS_PER_PAGE
  const sortBy = searchParams.sort || 'newest'

  const where: Prisma.ResourceWhereInput = {
    deletedAt: null,
  }

  // Handle multiple tags
  if (searchParams.tags) {
    const tagArray = searchParams.tags.split(',').filter(Boolean)
    if (tagArray.length > 0) {
      where.tags = {
        hasSome: tagArray,
      }
    }
  }

  // Handle multiple types
  if (searchParams.type) {
    const typeArray = searchParams.type.split(',').filter(Boolean)
    if (typeArray.length > 0) {
      where.type = {
        in: typeArray as ResourceType[],
      }
    }
  }

  // Handle multiple states
  if (searchParams.state) {
    const stateArray = searchParams.state.split(',').filter(Boolean)
    if (stateArray.length > 0) {
      where.OR = [
        { state: { in: stateArray } },
        { state: null }, // Include national resources
      ]
    }
  }

  // Handle difficulty filter
  if (searchParams.difficulty) {
    const difficultyArray = searchParams.difficulty.split(',').filter(Boolean)
    if (difficultyArray.length > 0) {
      where.difficulty = {
        in: difficultyArray as any[],
      }
    }
  }

  // Determine sort order
  let orderBy: Prisma.ResourceOrderByWithRelationInput = { createdAt: 'desc' }
  switch (sortBy) {
    case 'oldest':
      orderBy = { createdAt: 'asc' }
      break
    case 'title-asc':
      orderBy = { title: 'asc' }
      break
    case 'title-desc':
      orderBy = { title: 'desc' }
      break
    case 'updated':
      orderBy = { updatedAt: 'desc' }
      break
    default:
      orderBy = { createdAt: 'desc' }
  }

  const [resources, totalCount] = await Promise.all([
    prisma.resource.findMany({
      where,
      orderBy,
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

      {/* SEO Info Section */}
      {currentPage === 1 && (
        <div className="bg-desert/10 rounded-earth-lg p-6 mb-8 border border-desert/20">
          <p className="text-text leading-relaxed">
            Browse verified resources for Native American, Alaska Native, and Indigenous communities across all 50 states.
            Our comprehensive database includes <strong>federal programs</strong> (Indian Health Service, Bureau of Indian Affairs, HUD Native American programs),
            <strong> state assistance</strong> programs, <strong>tribal services</strong>, and <strong>emergency support</strong>.
            Filter by resource type, state, or category to find education grants, healthcare services, housing assistance,
            employment programs, legal aid, cultural preservation initiatives, and emergency relief. Each resource includes
            eligibility requirements, contact information, and direct links to official application sites.
          </p>
        </div>
      )}

      {/* Advanced Filter Bar */}
      <AdvancedFilterBar
        showTypeFilter={true}
        showStateFilter={true}
        showTagFilter={true}
        showDifficultyFilter={true}
        showSortFilter={true}
        sortOptions={[
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'title-asc', label: 'Title (A-Z)' },
          { value: 'title-desc', label: 'Title (Z-A)' },
          { value: 'updated', label: 'Recently Updated' },
        ]}
      />

      {/* Ad Unit */}
      <div className="my-8 flex justify-center">
        <BannerAd />
      </div>

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
          <p className="text-text/60 text-lg">
            No resources found. Try adjusting your filters.
          </p>
        </div>
      )}

      {/* Ad Unit */}
      <div className="my-8 flex justify-center">
        <BannerAd />
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/resources" />
    </div>
  )
}
