import { SectionHeader } from '@/components/SectionHeader'
import { ScholarshipCard } from '@/components/ScholarshipCard'
import { Pagination } from '@/components/Pagination'
import { AdUnit } from '@/components/GoogleAdsense'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const ITEMS_PER_PAGE = 20

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const currentPage = parseInt(searchParams.page || '1', 10)
  const skip = (currentPage - 1) * ITEMS_PER_PAGE

  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison

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
      orderBy: { deadline: 'asc' },
      take: ITEMS_PER_PAGE,
      skip,
    }),
    prisma.scholarship.findMany({
      where: {
        deletedAt: null,
        deadline: null,
      },
      orderBy: { createdAt: 'desc' },
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
