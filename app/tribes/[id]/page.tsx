import { notFound } from 'next/navigation'
import { SectionHeader } from '@/components/SectionHeader'
import { ResourceCard } from '@/components/ResourceCard'
import { Tag } from '@/components/Tag'
import { AdUnit } from '@/components/GoogleAdsense'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/StructuredData'
import { Breadcrumb } from '@/components/Breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const tribe = await prisma.tribe.findUnique({
    where: { id: params.id },
    include: {
      programs: {
        select: { id: true },
      },
    },
  })

  if (!tribe || tribe.deletedAt) {
    return {
      title: 'Tribe Not Found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'
  const pageUrl = `${baseUrl}/tribes/${params.id}`

  const programCount = tribe.programs.length
  const description = `Information about ${tribe.name}${tribe.region ? ` in ${tribe.region}` : ''}. ${programCount} available programs and resources for tribal members.`

  const keywords = [
    'Native American tribe',
    'Indigenous tribe',
    tribe.name,
    tribe.region,
    tribe.federalRecognitionStatus,
    'tribal programs',
    'tribal services',
  ].filter((k): k is string => Boolean(k))

  return {
    title: `${tribe.name} | Tribal Resource Hub`,
    description,
    keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: tribe.name,
      description,
      url: pageUrl,
      siteName: 'Tribal Resource Hub',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tribe.name,
      description,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  }
}

export default async function TribeDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const tribe = await prisma.tribe.findUnique({
    where: { id: params.id },
    include: {
      programs: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!tribe || tribe.deletedAt) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tribes', url: '/tribes' },
          { name: tribe.name, url: `/tribes/${params.id}` },
        ]}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tribes', href: '/tribes' },
          { label: tribe.name },
        ]}
      />

      {/* Ad Unit */}
      <div className="mb-8 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '970px' }} />
      </div>

      {/* Tribe Header */}
      <div className="bg-white dark:bg-gray-800 rounded-earth-lg p-8 mb-8 border border-earth-sand/30 dark:border-white/30">
        <h1 className="text-4xl font-bold text-earth-brown dark:text-cream mb-4">
          {tribe.name}
        </h1>

        <div className="flex flex-wrap gap-3 mb-6">
          {tribe.region && <Tag label={tribe.region} variant="pine" />}
          {tribe.federalRecognitionStatus && (
            <Tag label={tribe.federalRecognitionStatus} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {tribe.enrollmentOffice && (
            <div>
              <h3 className="font-semibold text-earth-brown dark:text-cream mb-2">Enrollment Office</h3>
              <p className="text-earth-brown/80 dark:text-cream/80">{tribe.enrollmentOffice}</p>
            </div>
          )}
        </div>

        {tribe.languageLinks.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-earth-brown dark:text-cream mb-2">Language Resources</h3>
            <ul className="space-y-1">
              {tribe.languageLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-earth-teal dark:text-gold hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Website Button */}
        {tribe.website && (
          <div className="mb-6">
            <a
              href={tribe.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-earth-teal dark:bg-gold text-white rounded-earth font-medium hover:bg-earth-teal/90 dark:hover:bg-gold/90 transition-colors"
            >
              View Official Website ↗
            </a>
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

      {/* Ad Unit */}
      <div className="my-8 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '970px' }} />
      </div>

      {tribe.programs.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-earth-lg">
          <p className="text-earth-brown/60 dark:text-cream/60 text-lg">
            No programs currently listed for this tribe.
          </p>
        </div>
      )}
    </div>
  )
}
