import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tribe = searchParams.get('tribe')
    const state = searchParams.get('state')
    const tags = searchParams.getAll('tags')

    const where: any = {
      AND: [],
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

    // If no filters, return all resources
    if (where.AND.length === 0) {
      delete where.AND
    }

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
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error matching resources:', error)
    return NextResponse.json(
      { error: 'Failed to match resources' },
      { status: 500 }
    )
  }
}
