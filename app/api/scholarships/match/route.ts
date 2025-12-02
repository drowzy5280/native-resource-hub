import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tags = searchParams.getAll('tags')

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const skip = (page - 1) * limit

    const where: any = {
      deletedAt: null,
    }

    if (tags.length > 0) {
      where.tags = {
        hasSome: tags,
      }
    }

    // Get total count for pagination
    const total = await prisma.scholarship.count({ where })

    const scholarships = await prisma.scholarship.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip,
    })

    return NextResponse.json({
      scholarships,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Error matching scholarships:', error)
    return NextResponse.json(
      { error: 'Failed to match scholarships' },
      { status: 500 }
    )
  }
}
