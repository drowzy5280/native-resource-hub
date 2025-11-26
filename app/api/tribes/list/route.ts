import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiRateLimiter, addRateLimitHeaders } from '@/lib/rateLimit'

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await apiRateLimiter.check(request)
  if (!rateLimitResult.success) {
    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers }
    )
  }

  try {
    const tribes = await prisma.tribe.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: { programs: true },
        },
      },
    })

    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json(tribes, { headers })
  } catch (error) {
    console.error('Error fetching tribes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tribes' },
      { status: 500 }
    )
  }
}
