import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const grant = await prisma.grant.findUnique({
      where: {
        id: params.id,
        deletedAt: null,
      },
    })

    if (!grant) {
      return NextResponse.json(
        { error: 'Grant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(grant)
  } catch (error) {
    console.error('Failed to fetch grant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch grant' },
      { status: 500 }
    )
  }
}
