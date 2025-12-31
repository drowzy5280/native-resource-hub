import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { GrantSchema } from '@/lib/validators'
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

    // Validate input with Zod schema
    const validated = GrantSchema.parse(body)

    // Create grant with validated data
    const grant = await prisma.grant.create({
      data: {
        name: validated.name,
        description: validated.description,
        url: validated.url || null,
        fundingAgency: validated.fundingAgency || null,
        grantType: validated.grantType,
        amount: validated.amount || null,
        amountMin: validated.amountMin || null,
        amountMax: validated.amountMax || null,
        deadline: validated.deadline || null,
        eligibility: validated.eligibility,
        tags: validated.tags,
        eligibleApplicants: validated.eligibleApplicants,
        applicationProcess: validated.applicationProcess || null,
        requiredDocuments: validated.requiredDocuments,
        contactEmail: validated.contactEmail || null,
        contactPhone: validated.contactPhone || null,
        cfda: validated.cfda || null,
        opportunityNumber: validated.opportunityNumber || null,
        matchingRequired: validated.matchingRequired,
        matchingPercentage: validated.matchingPercentage || null,
        renewalEligibility: validated.renewalEligibility,
        source: validated.source || null,
      },
    })

    return NextResponse.json({ success: true, data: grant }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Failed to create grant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create grant' },
      { status: 500 }
    )
  }
}
