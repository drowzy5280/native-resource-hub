import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit')

    const scholarships = await prisma.scholarship.findMany({
      take: limit ? parseInt(limit) : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(scholarships)
  } catch (error) {
    console.error('Error fetching scholarships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scholarships' },
      { status: 500 }
    )
  }
}
