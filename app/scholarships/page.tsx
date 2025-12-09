import { SectionHeader } from '@/components/SectionHeader'
import { ScholarshipCard } from '@/components/ScholarshipCard'
import { Pagination } from '@/components/Pagination'
import { BannerAd } from '@/components/GoogleAdsense'
import { ScholarshipFilterBar } from '@/components/ScholarshipFilterBar'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

const ITEMS_PER_PAGE = 20

export const metadata: Metadata = {
  title: 'Native American Scholarships | Tribal Resource Hub',
  description: 'Discover scholarships and financial aid for Native American, Alaska Native, and Indigenous students. Browse undergraduate and graduate funding from tribal colleges, STEM programs, medical schools, and tribal-specific scholarships. Track deadlines, amounts ($500-$40,000+), and eligibility requirements for enrolled tribal members and descendants.',
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
  searchParams: {
    page?: string
    sort?: string
    tags?: string
    level?: string
    amount?: string
    deadline?: string
  }
}) {
  const currentPage = parseInt(searchParams.page || '1', 10)
  const skip = (currentPage - 1) * ITEMS_PER_PAGE
  const sortBy = searchParams.sort || 'deadline-asc'

  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison

  // Build where clause for filters
  const baseWhere: Prisma.ScholarshipWhereInput = {
    deletedAt: null,
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

  // Education level filter
  if (searchParams.level) {
    baseWhere.tags = {
      ...baseWhere.tags,
      has: searchParams.level,
    }
  }

  // Amount range filter
  if (searchParams.amount) {
    const [min, max] = searchParams.amount.split('-').map(Number)
    // This is tricky since amount is stored as string. We'll filter client-side for now
    // In production, you might want to store amount as a number
  }

  // Deadline range filter
  let upcomingDeadlineFilter: any = { gte: today }
  if (searchParams.deadline) {
    const deadlineFilter = searchParams.deadline
    if (deadlineFilter === 'rolling') {
      // Special case: only show rolling deadlines
      upcomingDeadlineFilter = null
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
    upcomingWhere ? prisma.scholarship.count({ where: upcomingWhere }) : Promise.resolve(0),
    prisma.scholarship.count({ where: noDeadlineWhere }),
  ])

  // Then query scholarships with proper skip values
  const [upcoming, noDeadline] = await Promise.all([
    upcomingWhere ? prisma.scholarship.findMany({
      where: upcomingWhere,
      orderBy: upcomingOrderBy,
      take: ITEMS_PER_PAGE,
      skip,
    }) : Promise.resolve([]),
    prisma.scholarship.findMany({
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
    const filterByAmount = (scholarships: any[]) => {
      return scholarships.filter(s => {
        if (!s.amount) return false
        const amountMatch = s.amount.match(/\$?([\d,]+)/)?.[1]
        if (!amountMatch) return false
        const amount = parseInt(amountMatch.replace(/,/g, ''))
        return amount >= min && (max === 999999 || amount <= max)
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
        title="Scholarships"
        description={`${totalCount} total scholarships available for Native American students (page ${currentPage} of ${totalPages})`}
      />

      {/* SEO Info Section */}
      {currentPage === 1 && (
        <div className="bg-desert/10 rounded-earth-lg p-6 mb-8 border border-desert/20">
          <p className="text-gray-800 leading-relaxed">
            Find scholarships and financial aid specifically for <strong>Native American, Alaska Native, and Indigenous students</strong> pursuing higher education.
            Our database includes <strong>undergraduate scholarships</strong> for tribal college students, <strong>graduate fellowships</strong> (masters and doctoral programs),
            <strong>STEM scholarships</strong> (science, technology, engineering, math), <strong>medical and health professional</strong> funding,
            <strong>tribal-specific programs</strong> (Cherokee, Navajo, Hopi, and more), and <strong>general aid</strong> for enrolled tribal members and descendants.
            Awards range from $500 to $40,000+ with deadlines throughout the year. Each scholarship listing includes eligibility requirements
            (tribal enrollment, GPA, field of study), award amounts, application deadlines, and direct links to application portals.
          </p>
        </div>
      )}

      {/* Advanced Filter/Sort Bar */}
      <ScholarshipFilterBar totalCount={totalCount} />

      {/* Ad Unit */}
      <div className="my-8 flex justify-center">
        <BannerAd />
      </div>

      {filteredUpcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-6">Upcoming Deadlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUpcoming.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                id={scholarship.id}
                name={scholarship.name}
                description={scholarship.description}
                amount={scholarship.amount}
                deadline={scholarship.deadline}
                tags={scholarship.tags}
                url={scholarship.url}
                organization={scholarship.source || undefined}
                eligibility={scholarship.eligibility}
                state={null}
              />
            ))}
          </div>
        </section>
      )}

      {filteredNoDeadline.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-text mb-6">Rolling Deadlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNoDeadline.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                id={scholarship.id}
                name={scholarship.name}
                description={scholarship.description}
                amount={scholarship.amount}
                deadline={scholarship.deadline}
                tags={scholarship.tags}
                url={scholarship.url}
                organization={scholarship.source || undefined}
                eligibility={scholarship.eligibility}
                state={null}
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
          <p className="text-text/60 text-lg">
            No scholarships found. Check back soon as we add more data.
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/scholarships" />
    </div>
  )
}
