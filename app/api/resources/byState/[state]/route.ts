import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { state: string } }
) {
  try {
    const resources = await prisma.resource.findMany({
      where: {
        OR: [
          { state: params.state },
          { state: null }, // Include resources available to all states
        ],
      },
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
    console.error('Error fetching resources by state:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}
