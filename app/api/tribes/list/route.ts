import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PaginationSchema } from '@/lib/validators'
import { apiRateLimiter, addRateLimitHeaders } from '@/lib/rateLimit'
import { ZodError } from 'zod'
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
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')
    const sort = searchParams.get('sort') || 'name'
    const order = searchParams.get('order') || 'asc'
    const search = searchParams.get('search')
    const region = searchParams.get('region')
    const federalRecognition = searchParams.get('federalRecognition')

    // Validate pagination parameters
    const pagination = PaginationSchema.parse({
      page: page || '1',
      limit: limit || '20',
      sort: sort === 'name' ? 'name' : sort === 'createdAt' ? 'createdAt' : 'name',
      order: order === 'asc' ? 'asc' : 'desc',
    })

    const skip = (pagination.page - 1) * pagination.limit

    // Build where clause
    const where: Prisma.TribeWhereInput = {
      deletedAt: null,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (region) {
      where.region = { contains: region, mode: 'insensitive' }
    }

    if (federalRecognition) {
      where.federalRecognitionStatus = { contains: federalRecognition, mode: 'insensitive' }
    }

    // Determine sort order
    let orderBy: Prisma.TribeOrderByWithRelationInput
    switch (pagination.sort) {
      case 'createdAt':
        orderBy = { lastUpdated: pagination.order }
        break
      case 'name':
      default:
        orderBy = { name: pagination.order }
        break
    }

    const [tribes, total] = await Promise.all([
      prisma.tribe.findMany({
        where,
        take: pagination.limit,
        skip,
        orderBy,
        include: {
          _count: {
            select: { programs: true },
          },
        },
      }),
      prisma.tribe.count({ where }),
    ])

    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json({
      success: true,
      data: tribes,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    }, { headers })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error fetching tribes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tribes' },
      { status: 500 }
    )
  }
}
