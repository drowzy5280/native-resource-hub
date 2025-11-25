import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ScholarshipSchema } from '@/lib/validators'
import { requireAdmin } from '@/lib/auth'
import { requireCSRFToken } from '@/lib/csrf'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Verify CSRF token
    const csrfCheck = requireCSRFToken(request)
    if (!csrfCheck.valid) {
      return NextResponse.json({ error: csrfCheck.error }, { status: 403 })
    }

    // Require admin authentication
    await requireAdmin(request)

    const body = await request.json()

    // Validate input
    const validated = ScholarshipSchema.parse(body)

    // Create scholarship
    const scholarship = await prisma.scholarship.create({
      data: validated,
    })

    return NextResponse.json(scholarship, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating scholarship:', error)
    return NextResponse.json(
      { error: 'Failed to create scholarship' },
      { status: 500 }
    )
  }
}
