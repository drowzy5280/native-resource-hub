import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ResourceTypeEnum, PaginationSchema } from '@/lib/validators'
import { ZodError } from 'zod'
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
    const type = searchParams.get('type')
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')

    // Validate type if provided
    let validatedType = undefined
    if (type) {
      const typeResult = ResourceTypeEnum.safeParse(type)
      if (!typeResult.success) {
        return NextResponse.json(
          { error: 'Invalid resource type' },
          { status: 400 }
        )
      }
      validatedType = typeResult.data
    }

    // Validate pagination parameters
    const pagination = PaginationSchema.parse({
      page: page || '1',
      limit: limit || '20',
    })

    const skip = (pagination.page - 1) * pagination.limit

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where: {
          type: validatedType,
          deletedAt: null,
        },
        take: pagination.limit,
        skip,
        orderBy: {
          createdAt: pagination.order,
        },
        include: {
          tribe: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.resource.count({
        where: {
          type: validatedType,
          deletedAt: null,
        },
      }),
    ])

    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json({
      data: resources,
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
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}
