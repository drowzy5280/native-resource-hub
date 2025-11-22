import { notFound } from 'next/navigation'
import { SectionHeader } from '@/components/SectionHeader'
import { ResourceCard } from '@/components/ResourceCard'
import { Tag } from '@/components/Tag'
import { prisma } from '@/lib/prisma'

export default async function TribeDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const tribe = await prisma.tribe.findUnique({
    where: { id: params.id },
    include: {
      programs: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!tribe) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Tribe Header */}
      <div className="bg-white rounded-earth-lg p-8 mb-8 border border-earth-sand/30">
        <h1 className="text-4xl font-bold text-earth-brown mb-4">
          {tribe.name}
        </h1>

        <div className="flex flex-wrap gap-3 mb-6">
          {tribe.region && <Tag label={tribe.region} variant="teal" />}
          {tribe.federalRecognitionStatus && (
            <Tag label={tribe.federalRecognitionStatus} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {tribe.website && (
            <div>
              <h3 className="font-semibold text-earth-brown mb-2">Official Website</h3>
              <a
                href={tribe.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-earth-teal hover:underline"
              >
                {tribe.website}
              </a>
            </div>
          )}

          {tribe.enrollmentOffice && (
            <div>
              <h3 className="font-semibold text-earth-brown mb-2">Enrollment Office</h3>
              <p className="text-earth-brown/80">{tribe.enrollmentOffice}</p>
            </div>
          )}
        </div>

        {tribe.languageLinks.length > 0 && (
          <div>
            <h3 className="font-semibold text-earth-brown mb-2">Language Resources</h3>
            <ul className="space-y-1">
              {tribe.languageLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-earth-teal hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Programs */}
      <SectionHeader
        title="Available Programs"
        description={`${tribe.programs.length} programs and resources`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tribe.programs.map((program) => (
          <ResourceCard
            key={program.id}
            id={program.id}
            title={program.title}
            description={program.description}
            type={program.type}
            tags={program.tags}
            state={program.state}
            url={program.url}
          />
        ))}
      </div>

      {tribe.programs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-earth-lg">
          <p className="text-earth-brown/60 text-lg">
            No programs currently listed for this tribe.
          </p>
        </div>
      )}
    </div>
  )
}
