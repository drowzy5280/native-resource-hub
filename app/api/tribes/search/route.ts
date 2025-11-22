import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const tribes = await prisma.tribe.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { region: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        _count: {
          select: { programs: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(tribes)
  } catch (error) {
    console.error('Error searching tribes:', error)
    return NextResponse.json(
      { error: 'Failed to search tribes' },
      { status: 500 }
    )
  }
}
