import { SectionHeader } from '@/components/SectionHeader'
import { ResourceCard } from '@/components/ResourceCard'
import { FilterBar } from '@/components/FilterBar'
import { Pagination } from '@/components/Pagination'
import { BannerAd } from '@/components/GoogleAdsense'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const ITEMS_PER_PAGE = 20

export const metadata: Metadata = {
  title: 'Native American Nonprofits | Tribal Resource Hub',
  description: 'Connect with 65+ nonprofit organizations dedicated to serving Native American and First Nations communities. Find national advocacy groups (NCAI, NARF), legal services, educational organizations (AISES), health programs, cultural preservation groups, and state-level nonprofits across all 50 states. Free comprehensive directory with contact information and program details.',
  keywords: [
    'Native American nonprofits',
    'Indigenous organizations',
    'tribal advocacy',
    'Native American legal services',
    'Indigenous nonprofits',
    'tribal support organizations',
    'Native American advocacy groups',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'}/nonprofits`,
  },
  openGraph: {
    title: 'Native American Nonprofits',
    description: 'Discover nonprofit organizations serving Native American and Indigenous communities.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'}/nonprofits`,
    siteName: 'Tribal Resource Hub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Native American Nonprofits',
    description: 'Discover nonprofit organizations serving Native American and Indigenous communities.',
  },
}

export default async function NonprofitsPage({
  searchParams,
}: {
  searchParams: { tags?: string; type?: string; state?: string; page?: string; sort?: string }
}) {
  const currentPage = parseInt(searchParams.page || '1', 10)
  const skip = (currentPage - 1) * ITEMS_PER_PAGE
  const sortBy = searchParams.sort || 'newest'

  const where: Prisma.ResourceWhereInput = {
    deletedAt: null,
    // Filter to only show nonprofits - organizations with advocacy, legal, or nonprofit-related tags
    OR: [
      { tags: { hasSome: ['advocacy', 'legal', 'nonprofit'] } },
      { tags: { has: 'advocacy' } },
      { tags: { has: 'legal' } },
      { tags: { has: 'government services' } },
      { tags: { has: 'tribal affairs' } },
      { tags: { has: 'cultural preservation' } },
      { tags: { has: 'community services' } },
      { tags: { has: 'social services' } },
    ],
  }

  if (searchParams.tags) {
    const tagArray = searchParams.tags.split(',').filter(Boolean)
    if (tagArray.length > 0) {
      where.tags = {
        hasSome: tagArray,
      }
    }
  }

  if (searchParams.type) {
    where.type = searchParams.type as any
  }

  if (searchParams.state) {
    where.state = searchParams.state
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

  const [nonprofits, totalCount] = await Promise.all([
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

  // Get counts by type for display
  const [federalCount, stateCount] = await Promise.all([
    prisma.resource.count({
      where: {
        ...where,
        type: 'federal',
      },
    }),
    prisma.resource.count({
      where: {
        ...where,
        type: 'state',
      },
    }),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        title="Native American Nonprofit Organizations"
        description={`Connecting you to ${totalCount} nonprofit organizations serving Indigenous communities (page ${currentPage} of ${totalPages})`}
      />

      {/* SEO Info Section */}
      {currentPage === 1 && (
        <div className="bg-desert/10 rounded-earth-lg p-6 mb-8 border border-desert/20">
          <p className="text-text leading-relaxed">
            Connect with <strong>65+ nonprofit organizations</strong> dedicated to serving Native American, Alaska Native, and First Nations communities.
            Our directory includes <strong>national advocacy groups</strong> (National Congress of American Indians, Native American Rights Fund),
            <strong>legal services</strong> organizations, <strong>educational nonprofits</strong> (American Indian Science and Engineering Society,
            National Indian Education Association), <strong>health programs</strong>, <strong>cultural preservation</strong> groups,
            and <strong>state-level organizations</strong> across all 50 states. Each listing includes program descriptions, eligibility information,
            and direct contact details to help you access legal aid, scholarships, health services, advocacy support, and community resources.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-earth-lg p-6 card-shadow border border-desert/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pine/10 rounded-earth flex items-center justify-center">
              <svg className="w-6 h-6 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-pine">{federalCount}</div>
              <div className="text-text-muted">National Organizations</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-earth-lg p-6 card-shadow border border-desert/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-clay/10 rounded-earth flex items-center justify-center">
              <svg className="w-6 h-6 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-clay">{stateCount}</div>
              <div className="text-text-muted">State Organizations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        showTypeFilter={true}
        showStateFilter={true}
        showSortFilter={true}
        sortOptions={[
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'title-asc', label: 'Name (A-Z)' },
          { value: 'title-desc', label: 'Name (Z-A)' },
          { value: 'updated', label: 'Recently Updated' },
        ]}
      />

      {/* Ad Unit */}
      <div className="my-8 flex justify-center">
        <BannerAd />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nonprofits.map((nonprofit) => (
          <ResourceCard
            key={nonprofit.id}
            id={nonprofit.id}
            title={nonprofit.title}
            description={nonprofit.description}
            type={nonprofit.type}
            tags={nonprofit.tags}
            tribe={nonprofit.tribe || undefined}
            state={nonprofit.state}
            url={nonprofit.url}
          />
        ))}
      </div>

      {nonprofits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text/60 text-lg">
            No nonprofit organizations found. Try adjusting your filters.
          </p>
        </div>
      )}

      {/* Ad Unit */}
      <div className="my-8 flex justify-center">
        <BannerAd />
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/nonprofits" />
    </div>
  )
}
