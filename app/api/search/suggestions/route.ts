import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const searchTerm = query.trim()

    // Get suggestions from resources, scholarships, and common tags
    const [resources, scholarships, commonTags] = await Promise.all([
      // Get matching resource titles (limit 3)
      prisma.resource.findMany({
        where: {
          deletedAt: null,
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        select: { title: true },
        take: 3,
      }),
      // Get matching scholarship names (limit 3)
      prisma.scholarship.findMany({
        where: {
          deletedAt: null,
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        select: { name: true },
        take: 3,
      }),
      // Get matching tags from resources
      prisma.resource.findMany({
        where: {
          deletedAt: null,
          tags: {
            hasSome: [searchTerm],
          },
        },
        select: { tags: true },
        take: 10,
      }),
    ])

    // Extract unique tags that match
    const matchingTags = new Set<string>()
    commonTags.forEach((resource) => {
      resource.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
          matchingTags.add(tag)
        }
      })
    })

    // Combine all suggestions
    const suggestions = [
      ...resources.map((r) => ({ type: 'resource', text: r.title })),
      ...scholarships.map((s) => ({ type: 'scholarship', text: s.name })),
      ...Array.from(matchingTags).slice(0, 4).map((tag) => ({ type: 'tag', text: tag })),
    ].slice(0, 8) // Limit to 8 total suggestions

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error fetching search suggestions:', error)
    return NextResponse.json({ suggestions: [] }, { status: 500 })
  }
}
