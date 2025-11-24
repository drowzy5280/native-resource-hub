import { SectionHeader } from '@/components/SectionHeader'
import { ScholarshipCard } from '@/components/ScholarshipCard'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ScholarshipsPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison

  // Query upcoming scholarships and rolling deadlines in parallel
  const [upcoming, noDeadline] = await Promise.all([
    prisma.scholarship.findMany({
      where: {
        deletedAt: null,
        deadline: {
          gte: today,
        },
      },
      orderBy: { deadline: 'asc' },
    }),
    prisma.scholarship.findMany({
      where: {
        deletedAt: null,
        deadline: null,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const totalScholarships = upcoming.length + noDeadline.length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        title="Scholarships"
        description={`${totalScholarships} scholarships available for Native American students`}
      />

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

      {totalScholarships === 0 && (
        <div className="text-center py-12">
          <p className="text-earth-brown/60 text-lg">
            No scholarships found. Check back soon as we add more data.
          </p>
        </div>
      )}
    </div>
  )
}
