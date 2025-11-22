import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SaveResourceSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = SaveResourceSchema.parse(body)

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
    console.error('Error saving resource:', error)
    return NextResponse.json(
      { error: 'Failed to save resource' },
      { status: 500 }
    )
  }
}
