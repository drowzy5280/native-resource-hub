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

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'pending'

    let whereClause: { type: string; approved?: boolean } = {
      type: 'broken_link',
    }

    if (filter === 'pending') {
      whereClause.approved = false
    } else if (filter === 'resolved') {
      whereClause.approved = true
    }

    const links = await prisma.changeLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ success: true, data: links })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    console.error('Failed to fetch broken links:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch broken links' },
      { status: 500 }
    )
  }
}
