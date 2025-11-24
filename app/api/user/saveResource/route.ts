import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SaveResourceSchema } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request)

    const body = await request.json()
    const validated = SaveResourceSchema.parse(body)

    // Verify the user is saving for themselves
    if (validated.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - Cannot save resources for other users' },
        { status: 403 }
      )
    }

    const savedResource = await prisma.savedResource.create({
      data: {
        userId: validated.userId,
        resourceId: validated.resourceId,
      },
      include: {
        resource: true,
      },
    })

    return NextResponse.json(savedResource)
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
    console.error('Error saving resource:', error)
    return NextResponse.json(
      { error: 'Failed to save resource' },
      { status: 500 }
    )
  }
}
