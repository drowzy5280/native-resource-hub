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
    const sort = searchParams.get('sort') || 'deadline'
    const order = searchParams.get('order') || 'asc'
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')
    const featured = searchParams.get('featured')
    const tribalEnrollmentReq = searchParams.get('tribalEnrollmentReq')
    const minGPA = searchParams.get('minGPA')

    // Validate pagination parameters
    const pagination = PaginationSchema.parse({
      page: page || '1',
      limit: limit || '20',
      sort: sort === 'deadline' ? 'deadline' : sort === 'createdAt' ? 'createdAt' : sort === 'name' ? 'name' : 'deadline',
      order: order === 'asc' ? 'asc' : 'desc',
    })

    const skip = (pagination.page - 1) * pagination.limit

    // Build where clause
    const where: Prisma.ScholarshipWhereInput = {
      deletedAt: null,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (tags) {
      const tagArray = tags.split(',').filter(Boolean)
      if (tagArray.length > 0) {
        where.tags = { hasSome: tagArray }
      }
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (tribalEnrollmentReq === 'true') {
      where.tribalEnrollmentReq = true
    } else if (tribalEnrollmentReq === 'false') {
      where.tribalEnrollmentReq = false
    }

    if (minGPA) {
      const gpa = parseFloat(minGPA)
      if (!isNaN(gpa)) {
        where.minGPA = { lte: gpa }
      }
    }

    // Determine sort order
    let orderBy: Prisma.ScholarshipOrderByWithRelationInput
    switch (pagination.sort) {
      case 'deadline':
        orderBy = { deadline: pagination.order }
        break
      case 'name':
        orderBy = { name: pagination.order }
        break
      case 'createdAt':
      default:
        orderBy = { createdAt: pagination.order }
        break
    }

    const [scholarships, total] = await Promise.all([
      prisma.scholarship.findMany({
        where,
        take: pagination.limit,
        skip,
        orderBy,
      }),
      prisma.scholarship.count({ where }),
    ])

    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json({
      success: true,
      data: scholarships,
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
    console.error('Error fetching scholarships:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scholarships' },
      { status: 500 }
    )
  }
}
