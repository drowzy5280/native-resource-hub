import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tribe = await prisma.tribe.findUnique({
      where: { id: params.id },
      include: {
        programs: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!tribe) {
      return NextResponse.json(
        { error: 'Tribe not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tribe)
  } catch (error) {
    console.error('Error fetching tribe:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tribe' },
      { status: 500 }
    )
  }
}
