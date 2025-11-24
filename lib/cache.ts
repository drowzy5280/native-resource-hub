import { unstable_cache } from 'next/cache'
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

/**
 * Helper function to revalidate cache tags
 * Use this after mutations (create, update, delete)
 */
export const revalidateTags = (tags: string[]) => {
  // In Next.js 14, you can use revalidateTag from next/cache
  // This is a placeholder for manual revalidation
  // In production, you'd import and use:
  // import { revalidateTag } from 'next/cache'
  // tags.forEach(tag => revalidateTag(tag))

  console.log('Revalidating tags:', tags)
}
