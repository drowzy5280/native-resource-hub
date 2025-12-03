import { Suspense } from 'react'
import { universalSearch } from '@/lib/search'
import { prisma } from '@/lib/prisma'
import { SectionHeader } from '@/components/SectionHeader'
import { ResourceCard } from '@/components/ResourceCard'
import { ScholarshipCard } from '@/components/ScholarshipCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface SearchResultsProps {
  searchParams: { q?: string }
}

async function SearchResults({ query }: { query: string }) {
  if (!query || query.trim().length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-earth-brown/60 text-lg">
          Please enter a search term to find resources, scholarships, and tribes.
        </p>
      </div>
    )
  }

  const searchTerm = query.trim()

  // Use full-text search with fallback to basic search
  let resources: any[] = []
  let scholarships: any[] = []
  let tribes: any[] = []

  try {
    // Try using full-text search
    const results = await universalSearch(searchTerm, {
      limit: 20,
      useFullTextSearch: true,
    })

    // Extract items from search results and enrich with relations
    const resourceIds = results.resources.map((r) => r.item.id)
    const scholarshipIds = results.scholarships.map((s) => s.item.id)
    const tribeIds = results.tribes.map((t) => t.item.id)

    // Fetch full data with relations for resources
    if (resourceIds.length > 0) {
      resources = await prisma.resource.findMany({
        where: { id: { in: resourceIds } },
        include: {
          tribe: {
            select: { id: true, name: true },
          },
        },
      })
      // Sort by original search ranking
      resources.sort(
        (a, b) => resourceIds.indexOf(a.id) - resourceIds.indexOf(b.id)
      )
    }

    // Fetch full data for scholarships
    if (scholarshipIds.length > 0) {
      scholarships = await prisma.scholarship.findMany({
        where: { id: { in: scholarshipIds } },
      })
      scholarships.sort(
        (a, b) => scholarshipIds.indexOf(a.id) - scholarshipIds.indexOf(b.id)
      )
    }

    // Fetch full data for tribes
    if (tribeIds.length > 0) {
      tribes = await prisma.tribe.findMany({
        where: { id: { in: tribeIds } },
      })
      tribes.sort((a, b) => tribeIds.indexOf(a.id) - tribeIds.indexOf(b.id))
    }
  } catch (error) {
    console.error('Full-text search error, falling back to basic search:', error)

    // Fallback to basic search if full-text search fails
    ;[resources, scholarships, tribes] = await Promise.all([
      prisma.resource.findMany({
        where: {
          deletedAt: null,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { tags: { hasSome: [searchTerm] } },
          ],
        },
        include: {
          tribe: {
            select: { id: true, name: true },
          },
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.scholarship.findMany({
        where: {
          deletedAt: null,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { tags: { hasSome: [searchTerm] } },
          ],
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tribe.findMany({
        where: {
          deletedAt: null,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { region: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 10,
        orderBy: { name: 'asc' },
      }),
    ])
  }

  const totalResults = resources.length + scholarships.length + tribes.length

  if (totalResults === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-earth-brown/40 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-earth-brown mb-2">
          No results found for &quot;{searchTerm}&quot;
        </h3>
        <p className="text-earth-brown/60 mb-6">
          Try adjusting your search terms or browse our categories.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/resources"
            className="px-6 py-2 bg-earth-teal text-white rounded-earth hover:bg-earth-teal/90 transition-colors"
          >
            Browse Resources
          </Link>
          <Link
            href="/scholarships"
            className="px-6 py-2 bg-earth-sage text-white rounded-earth hover:bg-earth-sage/90 transition-colors"
          >
            Browse Scholarships
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Resources Section */}
      {resources.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-earth-brown">
              Resources ({resources.length})
            </h2>
            <Link
              href="/resources"
              className="text-earth-teal hover:text-earth-teal/80 font-medium"
            >
              View all resources →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                id={resource.id}
                title={resource.title}
                description={resource.description}
                type={resource.type}
                tags={resource.tags}
                tribe={resource.tribe || undefined}
                state={resource.state}
                url={resource.url}
              />
            ))}
          </div>
        </section>
      )}

      {/* Scholarships Section */}
      {scholarships.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-earth-brown">
              Scholarships ({scholarships.length})
            </h2>
            <Link
              href="/scholarships"
              className="text-earth-teal hover:text-earth-teal/80 font-medium"
            >
              View all scholarships →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                id={scholarship.id}
                name={scholarship.name}
                description={scholarship.description}
                amount={scholarship.amount}
                deadline={scholarship.deadline}
                url={scholarship.url}
                tags={scholarship.tags}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tribes Section */}
      {tribes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-earth-brown">
              Tribes ({tribes.length})
            </h2>
            <Link
              href="/tribes"
              className="text-earth-teal hover:text-earth-teal/80 font-medium"
            >
              View all tribes →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tribes.map((tribe) => (
              <Link
                key={tribe.id}
                href={`/tribes/${tribe.id}`}
                className="block bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-earth-brown mb-2">
                  {tribe.name}
                </h3>
                {tribe.region && (
                  <p className="text-earth-brown/70 text-sm">
                    Region: {tribe.region}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchResultsProps) {
  const query = searchParams.q || ''

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        title={query ? `Search Results for "${query}"` : 'Search'}
        description={
          query
            ? 'Showing results across resources, scholarships, and tribes'
            : 'Enter a search term to find what you need'
        }
      />

      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <SearchResults query={query} />
      </Suspense>
    </div>
  )
}
