import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Tag } from '@/components/Tag'
import { AdUnit } from '@/components/GoogleAdsense'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/formatting'
import { Metadata } from 'next'
import { ArticleSchema, BreadcrumbSchema } from '@/components/StructuredData'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
    include: {
      tribe: {
        select: { name: true },
      },
    },
  })

  if (!resource) {
    return {
      title: 'Resource Not Found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'
  const pageUrl = `${baseUrl}/resources/${params.id}`

  const description = resource.description.length > 160
    ? `${resource.description.substring(0, 157)}...`
    : resource.description

  const keywords = [
    'Native American',
    'Indigenous',
    resource.type,
    ...resource.tags,
    resource.tribe?.name,
    resource.state,
  ].filter((k): k is string => Boolean(k))

  return {
    title: `${resource.title} | Tribal Resource Hub`,
    description,
    keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: resource.title,
      description,
      url: pageUrl,
      siteName: 'Tribal Resource Hub',
      locale: 'en_US',
      type: 'article',
      publishedTime: resource.createdAt.toISOString(),
      modifiedTime: resource.updatedAt.toISOString(),
      tags: resource.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: resource.title,
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

export default async function ResourceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
    include: {
      tribe: true,
    },
  })

  if (!resource) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'
  const pageUrl = `${baseUrl}/resources/${params.id}`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ArticleSchema
        title={resource.title}
        description={resource.description}
        datePublished={resource.createdAt.toISOString()}
        dateModified={resource.updatedAt.toISOString()}
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Resources', url: '/resources' },
          { name: resource.title, url: `/resources/${params.id}` },
        ]}
      />
      {/* Ad Unit */}
      <div className="mb-8 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '728px' }} />
      </div>

      <div className="bg-white rounded-earth-lg p-8 border border-earth-sand/30">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag label={resource.type} variant="pine" />
            {resource.state && <Tag label={resource.state} variant="clay" />}
          </div>
          <h1 className="text-4xl font-bold text-earth-brown mb-4">
            {resource.title}
          </h1>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-earth-brown mb-3">Description</h2>
          <p className="text-earth-brown/80 leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Eligibility */}
        {resource.eligibility.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-earth-brown mb-3">Eligibility</h2>
            <ul className="list-disc list-inside space-y-2">
              {resource.eligibility.map((req, index) => (
                <li key={index} className="text-earth-brown/80">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-earth-brown mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>

        {/* Tribe */}
        {resource.tribe && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-earth-brown mb-3">Tribe</h2>
            <Link
              href={`/tribes/${resource.tribe.id}`}
              className="text-earth-teal hover:underline text-lg"
            >
              {resource.tribe.name}
            </Link>
          </div>
        )}

        {/* Links */}
        <div className="mb-8">
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-earth-teal text-white rounded-earth font-medium hover:bg-earth-teal/90 transition-colors"
            >
              Visit Official Website ↗
            </a>
          )}
        </div>

        {/* Meta */}
        <div className="border-t border-earth-sand pt-6 text-sm text-earth-brown/60">
          <p>Last updated: {formatDate(resource.updatedAt)}</p>
          {resource.source && <p>Source: {resource.source}</p>}
        </div>
      </div>

      {/* Ad Unit */}
      <div className="mt-8 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '728px' }} />
      </div>
    </div>
  )
}
