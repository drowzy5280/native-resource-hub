import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ResourceSchema } from '@/lib/validators'
import { requireAdmin } from '@/lib/auth'
import { requireCSRFToken } from '@/lib/csrf'
import { adminRateLimiter, addRateLimitHeaders } from '@/lib/rateLimit'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await adminRateLimiter.check(request)
  if (!rateLimitResult.success) {
    const headers = addRateLimitHeaders(new Headers(), rateLimitResult)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers }
    )
  }

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
    const validated = ResourceSchema.parse(body)

    // Create resource
    const resource = await prisma.resource.create({
      data: validated,
    })

    return NextResponse.json(resource, { status: 201 })
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
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}
