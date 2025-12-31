import { Suspense } from 'react'
import { SectionHeader } from '@/components/SectionHeader'
import { GrantCard } from '@/components/GrantCard'
import { Pagination } from '@/components/Pagination'
import { BannerAd } from '@/components/GoogleAdsense'
import { GrantFilterBar } from '@/components/GrantFilterBar'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

const ITEMS_PER_PAGE = 20

export const metadata: Metadata = {
  title: 'Native American Grants | Tribal Resource Hub',
  description: 'Find federal, state, and tribal grants for Native American communities. Browse funding opportunities for tribes, tribal organizations, and Native nonprofits. Housing, education, healthcare, economic development, and cultural preservation grants.',
  keywords: [
    'Native American grants',
    'tribal grants',
    'BIA grants',
    'federal Indian grants',
    'tribal funding',
    'Indigenous grants',
    'Native nonprofit grants',
    'tribal organization funding',
    'Indian Health Service grants',
    'HUD tribal grants',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'}/grants`,
  },
  openGraph: {
    title: 'Native American Grants',
    description: 'Find grants and funding opportunities for Native American communities.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'}/grants`,
    siteName: 'Tribal Resource Hub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Native American Grants',
    description: 'Find grants and funding opportunities for Native American communities.',
  },
}

export default async function GrantsPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    sort?: string
    tags?: string
    type?: string
    amount?: string
    deadline?: string
  }
}) {
  const currentPage = parseInt(searchParams.page || '1', 10)
  const skip = (currentPage - 1) * ITEMS_PER_PAGE
  const sortBy = searchParams.sort || 'deadline-asc'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Build where clause for filters
  const baseWhere: Prisma.GrantWhereInput = {
    deletedAt: null,
  }

  // Grant type filter
  if (searchParams.type) {
    baseWhere.grantType = searchParams.type as any
  }

  // Tags filter
  if (searchParams.tags) {
    const tagArray = searchParams.tags.split(',').filter(Boolean)
    if (tagArray.length > 0) {
      baseWhere.tags = {
        hasSome: tagArray,
      }
    }
  }

  // Deadline range filter
  let upcomingDeadlineFilter: Prisma.DateTimeNullableFilter | undefined = { gte: today }
  if (searchParams.deadline) {
    const deadlineFilter = searchParams.deadline
    if (deadlineFilter === 'rolling') {
      upcomingDeadlineFilter = undefined
    } else if (deadlineFilter.startsWith('next-')) {
      const days = parseInt(deadlineFilter.split('-')[1])
      const futureDate = new Date(today)
      futureDate.setDate(futureDate.getDate() + days)
      upcomingDeadlineFilter = {
        gte: today,
        lte: futureDate,
      }
    }
  }

  // Determine sort order
  let upcomingOrderBy: Prisma.GrantOrderByWithRelationInput = { deadline: 'asc' }
  let noDeadlineOrderBy: Prisma.GrantOrderByWithRelationInput = { createdAt: 'desc' }

  switch (sortBy) {
    case 'deadline-asc':
      upcomingOrderBy = { deadline: 'asc' }
      noDeadlineOrderBy = { createdAt: 'desc' }
      break
    case 'amount-desc':
      upcomingOrderBy = { amountMax: 'desc' }
      noDeadlineOrderBy = { amountMax: 'desc' }
      break
    case 'amount-asc':
      upcomingOrderBy = { amountMin: 'asc' }
      noDeadlineOrderBy = { amountMin: 'asc' }
      break
    case 'newest':
      upcomingOrderBy = { createdAt: 'desc' }
      noDeadlineOrderBy = { createdAt: 'desc' }
      break
    case 'name-asc':
      upcomingOrderBy = { name: 'asc' }
      noDeadlineOrderBy = { name: 'asc' }
      break
    case 'name-desc':
      upcomingOrderBy = { name: 'desc' }
      noDeadlineOrderBy = { name: 'desc' }
      break
  }

  // Build where clauses
  const upcomingWhere = searchParams.deadline === 'rolling' ? null : {
    ...baseWhere,
    deadline: upcomingDeadlineFilter,
  }

  const noDeadlineWhere = {
    ...baseWhere,
    deadline: null,
  }

  // First get counts
  const [upcomingCount, noDeadlineCount] = await Promise.all([
    upcomingWhere ? prisma.grant.count({ where: upcomingWhere }) : Promise.resolve(0),
    prisma.grant.count({ where: noDeadlineWhere }),
  ])

  // Then query grants with proper skip values
  const [upcoming, noDeadline] = await Promise.all([
    upcomingWhere ? prisma.grant.findMany({
      where: upcomingWhere,
      orderBy: upcomingOrderBy,
      take: ITEMS_PER_PAGE,
      skip,
    }) : Promise.resolve([]),
    prisma.grant.findMany({
      where: noDeadlineWhere,
      orderBy: noDeadlineOrderBy,
      take: ITEMS_PER_PAGE,
      skip: Math.max(0, skip - upcomingCount),
    }),
  ])

  // Filter by amount range (client-side since amount is stored as string)
  let filteredUpcoming = upcoming
  let filteredNoDeadline = noDeadline

  if (searchParams.amount) {
    const [min, max] = searchParams.amount.split('-').map(Number)
    const filterByAmount = (grants: typeof upcoming) => {
      return grants.filter(g => {
        if (!g.amountMin && !g.amountMax) return false
        const grantMax = g.amountMax || g.amountMin || 0
        const grantMin = g.amountMin || 0
        return grantMax >= min && (max === 999999999 || grantMin <= max)
      })
    }
    filteredUpcoming = filterByAmount(upcoming)
    filteredNoDeadline = filterByAmount(noDeadline)
  }

  const totalCount = upcomingCount + noDeadlineCount
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        title="Grants"
        description={`${totalCount} grant${totalCount !== 1 ? 's' : ''} available for Native American communities (page ${currentPage} of ${Math.max(1, totalPages)})`}
      />

      {/* SEO Info Section */}
      {currentPage === 1 && (
        <div className="bg-desert/10 rounded-earth-lg p-6 mb-8 border border-desert/20">
          <p className="text-text leading-relaxed">
            Discover <strong>grant funding opportunities</strong> for <strong>Native American tribes, tribal organizations, and Indigenous nonprofits</strong>.
            Our database includes <strong>federal grants</strong> from BIA, HUD, USDA, and other agencies, <strong>state grants</strong> for tribal communities,
            <strong>foundation grants</strong> supporting Indigenous causes, and <strong>tribal-specific funding</strong> programs.
            Find grants for <strong>housing</strong>, <strong>education</strong>, <strong>healthcare</strong>, <strong>economic development</strong>,
            <strong>cultural preservation</strong>, <strong>language revitalization</strong>, and more.
            Each listing includes eligibility requirements, funding amounts, application deadlines, and direct links to apply.
          </p>
        </div>
      )}

      {/* Advanced Filter/Sort Bar */}
      <Suspense fallback={<div className="bg-white rounded-earth-lg shadow-soft border border-desert/20 p-4 sm:p-6 mb-6 h-24 animate-pulse" />}>
        <GrantFilterBar totalCount={totalCount} />
      </Suspense>

      {/* Ad Unit */}
      <div className="my-8 flex justify-center">
        <BannerAd />
      </div>

      {filteredUpcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-6">Upcoming Deadlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUpcoming.map((grant) => (
              <GrantCard
                key={grant.id}
                id={grant.id}
                name={grant.name}
                description={grant.description}
                amount={grant.amount}
                deadline={grant.deadline}
                tags={grant.tags}
                url={grant.url}
                fundingAgency={grant.fundingAgency}
                grantType={grant.grantType}
                eligibleApplicants={grant.eligibleApplicants}
                matchingRequired={grant.matchingRequired}
                matchingPercentage={grant.matchingPercentage}
              />
            ))}
          </div>
        </section>
      )}

      {filteredNoDeadline.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-text mb-6">Rolling / Open Grants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNoDeadline.map((grant) => (
              <GrantCard
                key={grant.id}
                id={grant.id}
                name={grant.name}
                description={grant.description}
                amount={grant.amount}
                deadline={grant.deadline}
                tags={grant.tags}
                url={grant.url}
                fundingAgency={grant.fundingAgency}
                grantType={grant.grantType}
                eligibleApplicants={grant.eligibleApplicants}
                matchingRequired={grant.matchingRequired}
                matchingPercentage={grant.matchingPercentage}
              />
            ))}
          </div>
        </section>
      )}

      {/* Ad Unit */}
      <div className="my-8 flex justify-center">
        <BannerAd />
      </div>

      {totalCount === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💰</div>
          <p className="text-text/60 text-lg mb-2">
            No grants found matching your criteria.
          </p>
          <p className="text-text/40 text-sm">
            Try adjusting your filters or check back soon as we add more grant opportunities.
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/grants" />
    </div>
  )
}
