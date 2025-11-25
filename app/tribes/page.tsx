import { SectionHeader } from '@/components/SectionHeader'
import { TribeCard } from '@/components/TribeCard'
import { AdUnit } from '@/components/GoogleAdsense'
import { getCachedTribes } from '@/lib/cache'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to avoid build-time database connections
export const dynamic = 'force-dynamic'
// Revalidate this page every hour (3600 seconds)
export const revalidate = 3600

export default async function TribesPage() {
  // Get tribes from cache (revalidates every hour)
  const tribesData = await getCachedTribes()

  // Get all program counts in a single query to avoid connection pool exhaustion
  const programCounts = await prisma.resource.groupBy({
    by: ['tribeId'],
    where: { deletedAt: null, tribeId: { not: null } },
    _count: { id: true },
  })

  // Map counts to tribes
  const countMap = new Map(
    programCounts.map((pc) => [pc.tribeId, pc._count.id])
  )

  const tribes = tribesData.map((tribe) => ({
    ...tribe,
    _count: { programs: countMap.get(tribe.id) || 0 },
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        title="Federally Recognized Tribes"
        description={`Browse ${tribes.length} tribes and their available programs`}
      />

      {/* Ad Unit */}
      <div className="my-8 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '970px' }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tribes.map((tribe) => (
          <TribeCard
            key={tribe.id}
            id={tribe.id}
            name={tribe.name}
            region={tribe.region}
            website={tribe.website}
            federalRecognitionStatus={tribe.federalRecognitionStatus}
            programCount={tribe._count.programs}
          />
        ))}
      </div>

      {/* Ad Unit */}
      <div className="my-8 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '970px' }} />
      </div>

      {tribes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-earth-brown/60 text-lg">
            No tribes found. Check back soon as we add more data.
          </p>
        </div>
      )}
    </div>
  )
}
