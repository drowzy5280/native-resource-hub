import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SaveResourceSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = SaveResourceSchema.parse(body)

    await prisma.savedResource.deleteMany({
      where: {
        userId: validated.userId,
        resourceId: validated.resourceId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing resource:', error)
    return NextResponse.json(
      { error: 'Failed to remove resource' },
      { status: 500 }
    )
  }
}
