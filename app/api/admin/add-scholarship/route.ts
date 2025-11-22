import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ScholarshipSchema } from '@/lib/validators'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validated = ScholarshipSchema.parse(body)

    // Create scholarship
    const scholarship = await prisma.scholarship.create({
      data: validated,
    })

    return NextResponse.json(scholarship, { status: 201 })
  } catch (error) {
    console.error('Error creating scholarship:', error)
    return NextResponse.json(
      { error: 'Failed to create scholarship' },
      { status: 500 }
    )
  }
}
