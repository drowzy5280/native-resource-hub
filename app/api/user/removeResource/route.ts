import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SaveResourceSchema } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import { requireCSRFToken } from '@/lib/csrf'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // Verify CSRF token
    const csrfCheck = requireCSRFToken(request)
    if (!csrfCheck.valid) {
      return NextResponse.json({ error: csrfCheck.error }, { status: 403 })
    }

    // Require authentication
    const user = await requireAuth(request)

    const body = await request.json()
    const validated = SaveResourceSchema.parse(body)

    // Verify the user is removing for themselves
    if (validated.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - Cannot remove resources for other users' },
        { status: 403 }
      )
    }

    await prisma.savedResource.deleteMany({
      where: {
        userId: validated.userId,
        resourceId: validated.resourceId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error removing resource:', error)
    return NextResponse.json(
      { error: 'Failed to remove resource' },
      { status: 500 }
    )
  }
}
