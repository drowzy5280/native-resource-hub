import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const SaveResourceSchema = z.object({
  resourceId: z.string().uuid(),
})

// Get all saved resources for the current user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    const savedResources = await prisma.savedResource.findMany({
      where: {
        userId: user.id,
        resource: {
          deletedAt: null,
        },
      },
      include: {
        resource: {
          select: {
            id: true,
            type: true,
            title: true,
            description: true,
            url: true,
            eligibility: true,
            tags: true,
            state: true,
            tribeId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      saved: savedResources.map((sr) => ({
        id: sr.id,
        savedAt: sr.createdAt,
        resource: sr.resource,
      })),
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching saved resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved resources' },
      { status: 500 }
    )
  }
}

// Save a resource for the current user
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()

    // Validate input
    const { resourceId } = SaveResourceSchema.parse(body)

    // Check if resource exists and is not deleted
    const resource = await prisma.resource.findFirst({
      where: {
        id: resourceId,
        deletedAt: null,
      },
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Create saved resource (will fail if already saved due to unique constraint)
    const savedResource = await prisma.savedResource.create({
      data: {
        userId: user.id,
        resourceId,
      },
      include: {
        resource: true,
      },
    })

    return NextResponse.json(
      {
        message: 'Resource saved successfully',
        saved: {
          id: savedResource.id,
          savedAt: savedResource.createdAt,
          resource: savedResource.resource,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    // Check for unique constraint violation (already saved)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Resource already saved' },
        { status: 409 }
      )
    }
    console.error('Error saving resource:', error)
    return NextResponse.json(
      { error: 'Failed to save resource' },
      { status: 500 }
    )
  }
}
