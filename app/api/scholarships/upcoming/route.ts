import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const scholarships = await prisma.scholarship.findMany({
      where: {
        deadline: {
          not: null,
        },
      },
      orderBy: {
        deadline: 'asc',
      },
      take: 10,
    })

    // Filter to only include upcoming deadlines
    const today = new Date()
    const upcoming = scholarships.filter(s => {
      if (!s.deadline) return false
      return s.deadline >= today
    })

    return NextResponse.json(upcoming)
  } catch (error) {
    console.error('Error fetching upcoming scholarships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upcoming scholarships' },
      { status: 500 }
    )
  }
}
