import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tribes = await prisma.tribe.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: { programs: true },
        },
      },
    })

    return NextResponse.json(tribes)
  } catch (error) {
    console.error('Error fetching tribes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tribes' },
      { status: 500 }
    )
  }
}
