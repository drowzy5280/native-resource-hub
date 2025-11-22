import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tags = searchParams.getAll('tags')

    const where: any = {}

    if (tags.length > 0) {
      where.tags = {
        hasSome: tags,
      }
    }

    const scholarships = await prisma.scholarship.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(scholarships)
  } catch (error) {
    console.error('Error matching scholarships:', error)
    return NextResponse.json(
      { error: 'Failed to match scholarships' },
      { status: 500 }
    )
  }
}
