import { SectionHeader } from '@/components/SectionHeader'
import { TribeCard } from '@/components/TribeCard'
import { getCachedTribes } from '@/lib/cache'
import { prisma } from '@/lib/prisma'

// Revalidate this page every hour (3600 seconds)
export const revalidate = 3600

export default async function TribesPage() {
  // Get tribes from cache (revalidates every hour)
  const tribesData = await getCachedTribes()

  // Get program counts separately (not cached)
  const tribes = await Promise.all(
    tribesData.map(async (tribe) => {
      const programCount = await prisma.resource.count({
        where: { tribeId: tribe.id, deletedAt: null },
      })
      return {
        ...tribe,
        _count: { programs: programCount },
      }
    })
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        title="Federally Recognized Tribes"
        description={`Browse ${tribes.length} tribes and their available programs`}
      />

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
