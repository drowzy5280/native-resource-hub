import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tribe = searchParams.get('tribe')
    const state = searchParams.get('state')
    const tags = searchParams.getAll('tags')

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const skip = (page - 1) * limit

    const where: any = {
      AND: [{ deletedAt: null }],
    }

    if (tribe) {
      where.AND.push({ tribeId: tribe })
    }

    if (state) {
      where.AND.push({
        OR: [
          { state: state },
          { state: null }, // Include resources available to all states
        ],
      })
    }

    if (tags.length > 0) {
      where.AND.push({
        tags: {
          hasSome: tags,
        },
      })
    }

    // Get total count for pagination
    const total = await prisma.resource.count({ where })

    const resources = await prisma.resource.findMany({
      where,
      include: {
        tribe: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip,
    })

    return NextResponse.json({
      resources,
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
    console.error('Error matching resources:', error)
    return NextResponse.json(
      { error: 'Failed to match resources' },
      { status: 500 }
    )
  }
}
