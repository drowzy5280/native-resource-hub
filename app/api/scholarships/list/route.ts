import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiRateLimiter, addRateLimitHeaders } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

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
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit')

    const scholarships = await prisma.scholarship.findMany({
      take: limit ? parseInt(limit) : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json(scholarships, { headers })
  } catch (error) {
    console.error('Error fetching scholarships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scholarships' },
      { status: 500 }
    )
  }
}
