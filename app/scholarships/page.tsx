import { SectionHeader } from '@/components/SectionHeader'
import { ScholarshipCard } from '@/components/ScholarshipCard'
import { Pagination } from '@/components/Pagination'
import { AdUnit } from '@/components/GoogleAdsense'
import { FilterBar } from '@/components/FilterBar'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

const ITEMS_PER_PAGE = 20

export const metadata: Metadata = {
  title: 'Native American Scholarships | Tribal Resource Hub',
  description: 'Find scholarships for Native American and Indigenous students. Browse college funding opportunities, grant programs, and educational financial aid for tribal members.',
  keywords: [
    'Native American scholarships',
    'Indigenous scholarships',
    'tribal scholarships',
    'Native American college funding',
    'Indigenous student aid',
    'tribal student grants',
    'Native American education funding',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'}/scholarships`,
  },
  openGraph: {
    title: 'Native American Scholarships',
    description: 'Find scholarships for Native American and Indigenous students.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'}/scholarships`,
    siteName: 'Tribal Resource Hub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Native American Scholarships',
    description: 'Find scholarships for Native American and Indigenous students.',
  },
}

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string }
}) {
  const currentPage = parseInt(searchParams.page || '1', 10)
  const skip = (currentPage - 1) * ITEMS_PER_PAGE
  const sortBy = searchParams.sort || 'deadline-asc'

  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison

  // Determine sort order
  let upcomingOrderBy: Prisma.ScholarshipOrderByWithRelationInput = { deadline: 'asc' }
  let noDeadlineOrderBy: Prisma.ScholarshipOrderByWithRelationInput = { createdAt: 'desc' }

  switch (sortBy) {
    case 'deadline-asc':
      upcomingOrderBy = { deadline: 'asc' }
      noDeadlineOrderBy = { createdAt: 'desc' }
      break
    case 'amount-desc':
      upcomingOrderBy = { amount: 'desc' }
      noDeadlineOrderBy = { amount: 'desc' }
      break
    case 'amount-asc':
      upcomingOrderBy = { amount: 'asc' }
      noDeadlineOrderBy = { amount: 'asc' }
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

  // First get counts
  const [upcomingCount, noDeadlineCount] = await Promise.all([
    prisma.scholarship.count({
      where: {
        deletedAt: null,
        deadline: {
          gte: today,
        },
      },
    }),
    prisma.scholarship.count({
      where: {
        deletedAt: null,
        deadline: null,
      },
    }),
  ])

  // Then query scholarships with proper skip values
  const [upcoming, noDeadline] = await Promise.all([
    prisma.scholarship.findMany({
      where: {
        deletedAt: null,
        deadline: {
          gte: today,
        },
      },
      orderBy: upcomingOrderBy,
      take: ITEMS_PER_PAGE,
      skip,
    }),
    prisma.scholarship.findMany({
      where: {
        deletedAt: null,
        deadline: null,
      },
      orderBy: noDeadlineOrderBy,
      take: ITEMS_PER_PAGE,
      skip: Math.max(0, skip - upcomingCount),
    }),
  ])

  const totalCount = upcomingCount + noDeadlineCount
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        title="Scholarships"
        description={`${totalCount} total scholarships available for Native American students (page ${currentPage} of ${totalPages})`}
      />

      {/* Filter/Sort Bar */}
      <FilterBar
        showTypeFilter={false}
        showStateFilter={false}
        showSortFilter={true}
        sortOptions={[
          { value: 'deadline-asc', label: 'Deadline (Soonest)' },
          { value: 'amount-desc', label: 'Amount (Highest)' },
          { value: 'amount-asc', label: 'Amount (Lowest)' },
          { value: 'newest', label: 'Recently Added' },
          { value: 'name-asc', label: 'Name (A-Z)' },
          { value: 'name-desc', label: 'Name (Z-A)' },
        ]}
      />

      {/* Ad Unit */}
      <div className="my-8 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '970px' }} />
      </div>

      {upcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-earth-brown mb-6">Upcoming Deadlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcoming.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                id={scholarship.id}
                name={scholarship.name}
                description={scholarship.description}
                amount={scholarship.amount}
                deadline={scholarship.deadline}
                tags={scholarship.tags}
                url={scholarship.url}
              />
            ))}
          </div>
        </section>
      )}

      {noDeadline.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-earth-brown mb-6">Rolling Deadlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {noDeadline.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                id={scholarship.id}
                name={scholarship.name}
                description={scholarship.description}
                amount={scholarship.amount}
                deadline={scholarship.deadline}
                tags={scholarship.tags}
                url={scholarship.url}
              />
            ))}
          </div>
        </section>
      )}

      {/* Ad Unit */}
      <div className="my-8 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '970px' }} />
      </div>

      {totalCount === 0 && (
        <div className="text-center py-12">
          <p className="text-earth-brown/60 text-lg">
            No scholarships found. Check back soon as we add more data.
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/scholarships" />
    </div>
  )
}
