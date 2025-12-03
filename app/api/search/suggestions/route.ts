import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiRateLimiter, addRateLimitHeaders } from '@/lib/rateLimit'
import { unstable_cache } from 'next/cache'

export const dynamic = 'force-dynamic'

// Common search terms for quick suggestions
const COMMON_SEARCH_TERMS = [
  { text: 'education', type: 'tag' },
  { text: 'health', type: 'tag' },
  { text: 'housing', type: 'tag' },
  { text: 'emergency', type: 'tag' },
  { text: 'scholarships', type: 'tag' },
  { text: 'legal', type: 'tag' },
  { text: 'business', type: 'tag' },
  { text: 'youth', type: 'tag' },
  { text: 'elders', type: 'tag' },
  { text: 'language', type: 'tag' },
]

// Cache popular tags
const getPopularTags = unstable_cache(
  async () => {
    const resources = await prisma.resource.findMany({
      where: { deletedAt: null },
      select: { tags: true },
      take: 100,
    })

    const tagCounts = new Map<string, number>()
    resources.forEach(r => {
      r.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })

    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([tag]) => tag)
  },
  ['popular-tags'],
  { revalidate: 3600 } // Cache for 1 hour
)

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await apiRateLimiter.check(request)
  if (!rateLimitResult.success) {
    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', suggestions: [] },
      { status: 429, headers }
    )
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      // Return common suggestions if query is too short
      const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
      return NextResponse.json({ suggestions: COMMON_SEARCH_TERMS.slice(0, 5) }, { headers })
    }

    const searchTerm = query.trim().toLowerCase()

    // Quick filter on common terms first
    const quickMatches = COMMON_SEARCH_TERMS.filter(term =>
      term.text.toLowerCase().includes(searchTerm)
    )

    // Get suggestions from database (with timeout)
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout')), 2000)
    )

    const [resources, scholarships, popularTags] = await Promise.race([
      Promise.all([
        // Try full-text search first, fallback to contains
        (async () => {
          try {
            const results = await prisma.$queryRaw<Array<{ title: string }>>`
              SELECT DISTINCT title
              FROM "Resource"
              WHERE
                "deletedAt" IS NULL
                AND (title % ${searchTerm} OR search_vector @@ plainto_tsquery('english', ${searchTerm}))
              ORDER BY
                CASE WHEN title ILIKE ${`%${searchTerm}%`} THEN 0 ELSE 1 END,
                similarity(title, ${searchTerm}) DESC
              LIMIT 3
            `
            return results
          } catch (error) {
            // Fallback if full-text search not set up yet
            return prisma.resource.findMany({
              where: {
                deletedAt: null,
                title: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
              select: { title: true },
              take: 3,
              orderBy: { createdAt: 'desc' },
            })
          }
        })(),
        // Try full-text search for scholarships
        (async () => {
          try {
            const results = await prisma.$queryRaw<Array<{ name: string }>>`
              SELECT DISTINCT name
              FROM "Scholarship"
              WHERE
                "deletedAt" IS NULL
                AND (name % ${searchTerm} OR search_vector @@ plainto_tsquery('english', ${searchTerm}))
              ORDER BY
                CASE WHEN name ILIKE ${`%${searchTerm}%`} THEN 0 ELSE 1 END,
                similarity(name, ${searchTerm}) DESC
              LIMIT 3
            `
            return results
          } catch (error) {
            // Fallback if full-text search not set up yet
            return prisma.scholarship.findMany({
              where: {
                deletedAt: null,
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
              select: { name: true },
              take: 3,
              orderBy: { createdAt: 'desc' },
            })
          }
        })(),
        // Get popular tags
        getPopularTags(),
      ]),
      timeoutPromise,
    ]).catch(() => [[], [], []] as [any[], any[], string[]])

    // Match popular tags
    const matchingPopularTags = popularTags
      .filter(tag => tag.toLowerCase().includes(searchTerm))
      .slice(0, 3)

    // Combine all suggestions, prioritizing exact matches
    const suggestions = [
      ...quickMatches.slice(0, 2),
      ...resources.map((r) => ({ type: 'resource' as const, text: r.title })),
      ...scholarships.map((s) => ({ type: 'scholarship' as const, text: s.name })),
      ...matchingPopularTags.map((tag) => ({ type: 'tag' as const, text: tag })),
    ]
      .filter((item, index, self) =>
        // Remove duplicates based on text
        index === self.findIndex(t => t.text.toLowerCase() === item.text.toLowerCase())
      )
      .slice(0, 8) // Limit to 8 total suggestions

    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json({ suggestions }, { headers })
  } catch (error) {
    console.error('Error fetching search suggestions:', error)
    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json(
      { suggestions: COMMON_SEARCH_TERMS.slice(0, 5) },
      { status: 200, headers } // Return fallback suggestions instead of error
    )
  }
}
