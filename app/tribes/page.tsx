import { SectionHeader } from '@/components/SectionHeader'
import { TribeCard } from '@/components/TribeCard'
import { prisma } from '@/lib/prisma'

export default async function TribesPage() {
  const tribes = await prisma.tribe.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { programs: true },
      },
    },
  })

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
