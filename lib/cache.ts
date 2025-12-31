import { unstable_cache, revalidateTag } from 'next/cache'
import { prisma } from './prisma'

/**
 * Caching utilities for frequently accessed data
 * Uses Next.js unstable_cache for server-side caching
 */

// Cache tribes list for 1 hour (3600 seconds)
export const getCachedTribes = unstable_cache(
  async () => {
    return prisma.tribe.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    })
  },
  ['tribes-list'],
  {
    revalidate: 3600, // 1 hour
    tags: ['tribes'],
  }
)

// Cache tribe counts for 5 minutes (300 seconds)
export const getCachedTribeCount = unstable_cache(
  async () => {
    return prisma.tribe.count({ where: { deletedAt: null } })
  },
  ['tribe-count'],
  {
    revalidate: 300, // 5 minutes
    tags: ['tribes', 'counts'],
  }
)

// Cache resource counts by type for 5 minutes
export const getCachedResourceCounts = unstable_cache(
  async () => {
    const [total, federal, state, tribal, emergency, scholarship] = await Promise.all([
      prisma.resource.count({ where: { deletedAt: null } }),
      prisma.resource.count({ where: { deletedAt: null, type: 'federal' } }),
      prisma.resource.count({ where: { deletedAt: null, type: 'state' } }),
      prisma.resource.count({ where: { deletedAt: null, type: 'tribal' } }),
      prisma.resource.count({ where: { deletedAt: null, type: 'emergency' } }),
      prisma.resource.count({ where: { deletedAt: null, type: 'scholarship' } }),
    ])

    return {
      total,
      byType: {
        federal,
        state,
        tribal,
        emergency,
        scholarship,
      },
    }
  },
  ['resource-counts'],
  {
    revalidate: 300, // 5 minutes
    tags: ['resources', 'counts'],
  }
)

// Cache scholarship counts for 5 minutes
export const getCachedScholarshipCounts = unstable_cache(
  async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [total, upcoming, expired, rolling] = await Promise.all([
      prisma.scholarship.count({ where: { deletedAt: null } }),
      prisma.scholarship.count({
        where: {
          deletedAt: null,
          deadline: { gte: today },
        },
      }),
      prisma.scholarship.count({
        where: {
          deletedAt: null,
          deadline: { lt: today },
        },
      }),
      prisma.scholarship.count({
        where: {
          deletedAt: null,
          deadline: null,
        },
      }),
    ])

    return {
      total,
      upcoming,
      expired,
      rolling,
    }
  },
  ['scholarship-counts'],
  {
    revalidate: 300, // 5 minutes
    tags: ['scholarships', 'counts'],
  }
)

// Cache featured/recent resources for homepage (10 minutes)
export const getCachedFeaturedResources = unstable_cache(
  async (limit: number = 6) => {
    return prisma.resource.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        tribe: {
          select: { id: true, name: true },
        },
      },
    })
  },
  ['featured-resources'],
  {
    revalidate: 600, // 10 minutes
    tags: ['resources', 'featured'],
  }
)

// Cache upcoming scholarships for homepage (10 minutes)
export const getCachedUpcomingScholarships = unstable_cache(
  async (limit: number = 4) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return prisma.scholarship.findMany({
      where: {
        deletedAt: null,
        deadline: { gte: today },
      },
      orderBy: { deadline: 'asc' },
      take: limit,
    })
  },
  ['upcoming-scholarships'],
  {
    revalidate: 600, // 10 minutes
    tags: ['scholarships', 'upcoming'],
  }
)

// Cache scholarships closing soon (within 30 days) for homepage urgency widget
export const getCachedClosingSoonScholarships = unstable_cache(
  async (limit: number = 6) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const thirtyDaysFromNow = new Date(today)
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    return prisma.scholarship.findMany({
      where: {
        deletedAt: null,
        deadline: {
          gte: today,
          lte: thirtyDaysFromNow,
        },
      },
      orderBy: { deadline: 'asc' },
      take: limit,
    })
  },
  ['closing-soon-scholarships'],
  {
    revalidate: 300, // 5 minutes (more frequent updates for urgency)
    tags: ['scholarships', 'closing-soon'],
  }
)

// Cache single tribe by ID for 30 minutes
export const getCachedTribeById = unstable_cache(
  async (id: string) => {
    return prisma.tribe.findUnique({
      where: { id, deletedAt: null },
    })
  },
  ['tribe-by-id'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['tribes'],
  }
)

// Cache program counts per tribe for 1 hour (used on tribes list page)
// Returns a plain object for serialization compatibility
export const getCachedTribeProgramCounts = unstable_cache(
  async (): Promise<Record<string, number>> => {
    const programCounts = await prisma.resource.groupBy({
      by: ['tribeId'],
      where: { deletedAt: null, tribeId: { not: null } },
      _count: { id: true },
    })
    // Return plain object instead of Map for cache serialization
    return Object.fromEntries(
      programCounts.map((pc) => [pc.tribeId as string, pc._count.id])
    )
  },
  ['tribe-program-counts'],
  {
    revalidate: 3600, // 1 hour
    tags: ['tribes', 'resources', 'counts'],
  }
)

// Cache featured nonprofits for homepage (10 minutes)
export const getCachedFeaturedNonprofits = unstable_cache(
  async (limit: number = 6) => {
    return prisma.resource.findMany({
      where: {
        deletedAt: null,
        OR: [
          { tags: { has: 'advocacy' } },
          { tags: { has: 'legal' } },
          { tags: { has: 'government services' } },
          { tags: { has: 'tribal affairs' } },
          { tags: { has: 'cultural preservation' } },
          { tags: { has: 'community services' } },
          { tags: { has: 'social services' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        tribe: {
          select: { id: true, name: true },
        },
      },
    })
  },
  ['featured-nonprofits'],
  {
    revalidate: 600, // 10 minutes
    tags: ['resources', 'nonprofits', 'featured'],
  }
)

/**
 * Helper function to revalidate cache tags
 * Use this after mutations (create, update, delete)
 */
export const revalidateTags = (tags: string[]) => {
  tags.forEach(tag => revalidateTag(tag))
}
