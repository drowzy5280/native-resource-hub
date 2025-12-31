import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiRateLimiter, addRateLimitHeaders } from '@/lib/rateLimit'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await apiRateLimiter.check(request)
  if (!rateLimitResult.success) {
    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429, headers }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const skip = (page - 1) * limit

    const grantType = searchParams.get('type')
    const agency = searchParams.get('agency')
    const tags = searchParams.get('tags')
    const sort = searchParams.get('sort') || 'deadline-asc'
    const search = searchParams.get('search')

    // Build where clause
    const where: Prisma.GrantWhereInput = {
      deletedAt: null,
    }

    if (grantType) {
      where.grantType = grantType as any
    }

    if (agency) {
      where.fundingAgency = {
        contains: agency,
        mode: 'insensitive',
      }
    }

    if (tags) {
      const tagArray = tags.split(',').filter(Boolean)
      if (tagArray.length > 0) {
        where.tags = {
          hasSome: tagArray,
        }
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fundingAgency: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Determine sort order
    let orderBy: Prisma.GrantOrderByWithRelationInput = { deadline: 'asc' }

    switch (sort) {
      case 'deadline-asc':
        orderBy = { deadline: 'asc' }
        break
      case 'deadline-desc':
        orderBy = { deadline: 'desc' }
        break
      case 'amount-desc':
        orderBy = { amountMax: 'desc' }
        break
      case 'amount-asc':
        orderBy = { amountMin: 'asc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'name-asc':
        orderBy = { name: 'asc' }
        break
      case 'name-desc':
        orderBy = { name: 'desc' }
        break
    }

    const [grants, total] = await Promise.all([
      prisma.grant.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.grant.count({ where }),
    ])

    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json({
      success: true,
      data: grants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, { headers })
  } catch (error) {
    console.error('Failed to fetch grants:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch grants' },
      { status: 500 }
    )
  }
}
