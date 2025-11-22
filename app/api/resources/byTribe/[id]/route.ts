import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resources = await prisma.resource.findMany({
      where: {
        tribeId: params.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources by tribe:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}
