import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// Remove a saved resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request)

    // Check if saved resource exists and belongs to the user
    const savedResource = await prisma.savedResource.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!savedResource) {
      return NextResponse.json(
        { error: 'Saved resource not found' },
        { status: 404 }
      )
    }

    // Delete the saved resource
    await prisma.savedResource.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({
      message: 'Resource removed from saved items',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error removing saved resource:', error)
    return NextResponse.json(
      { error: 'Failed to remove saved resource' },
      { status: 500 }
    )
  }
}
