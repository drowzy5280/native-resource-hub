import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { adminRateLimiter, addRateLimitHeaders } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await adminRateLimiter.check(request)
  if (!rateLimitResult.success) {
    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers }
    )
  }

  try {
    // Require admin authentication
    await requireAdmin(request)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Fetch analytics data in parallel
    const [
      totalResources,
      totalScholarships,
      totalTribes,
      resourcesByType,
      resourcesByState,
      scholarshipsByDeadline,
      recentResources,
      verificationStats,
    ] = await Promise.all([
      // Total counts
      prisma.resource.count({ where: { deletedAt: null } }),
      prisma.scholarship.count({ where: { deletedAt: null } }),
      prisma.tribe.count({ where: { deletedAt: null } }),

      // Resources by type
      prisma.resource.groupBy({
        by: ['type'],
        where: { deletedAt: null },
        _count: true,
      }),

      // Resources by state
      prisma.resource.groupBy({
        by: ['state'],
        where: {
          deletedAt: null,
          state: { not: null },
        },
        _count: true,
        orderBy: { _count: { state: 'desc' } },
        take: 10,
      }),

      // Scholarships by deadline (upcoming)
      prisma.scholarship.count({
        where: {
          deletedAt: null,
          deadline: { gte: today },
        },
      }),

      // Resources added in last 30 days
      prisma.resource.count({
        where: {
          deletedAt: null,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),

      // Verification status
      prisma.resource.groupBy({
        by: ['lastVerified'],
        where: { deletedAt: null },
        _count: true,
      }),
    ])

    // Calculate verification statistics
    const verified = verificationStats.filter(s => s.lastVerified !== null).length
    const unverified = verificationStats.find(s => s.lastVerified === null)?._count || 0

    // Get scholarships closing soon
    const thirtyDaysFromNow = new Date(today)
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const closingSoonCount = await prisma.scholarship.count({
      where: {
        deletedAt: null,
        deadline: {
          gte: today,
          lte: thirtyDaysFromNow,
        },
      },
    })

    const analytics = {
      totals: {
        resources: totalResources,
        scholarships: totalScholarships,
        tribes: totalTribes,
      },
      recent: {
        resourcesLast30Days: recentResources,
      },
      resourcesByType: resourcesByType.map(r => ({
        type: r.type,
        count: r._count,
      })),
      resourcesByState: resourcesByState.map(r => ({
        state: r.state || 'Unknown',
        count: r._count,
      })),
      scholarships: {
        total: totalScholarships,
        upcoming: scholarshipsByDeadline,
        closingSoon: closingSoonCount,
      },
      verification: {
        total: totalResources,
        verified: verified,
        unverified: unverified,
      },
    }

    return NextResponse.json({ success: true, data: analytics })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
