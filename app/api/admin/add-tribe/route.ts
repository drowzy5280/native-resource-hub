import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TribeSchema } from '@/lib/validators'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validated = TribeSchema.parse(body)

    // Create tribe
    const tribe = await prisma.tribe.create({
      data: validated,
    })

    return NextResponse.json(tribe, { status: 201 })
  } catch (error) {
    console.error('Error creating tribe:', error)
    return NextResponse.json(
      { error: 'Failed to create tribe' },
      { status: 500 }
    )
  }
}
