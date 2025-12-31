import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { requireCSRFToken } from '@/lib/csrf'
import { adminRateLimiter, addRateLimitHeaders } from '@/lib/rateLimit'
import { GrantUpdateSchema } from '@/lib/validators'
import { ZodError } from 'zod'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Soft delete
    await prisma.grant.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    console.error('Failed to delete grant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete grant' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()

    // Validate input with partial schema (all fields optional for updates)
    const validated = GrantUpdateSchema.parse(body)

    const grant = await prisma.grant.update({
      where: { id },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.url !== undefined && { url: validated.url || null }),
        ...(validated.fundingAgency !== undefined && { fundingAgency: validated.fundingAgency || null }),
        ...(validated.grantType !== undefined && { grantType: validated.grantType }),
        ...(validated.amount !== undefined && { amount: validated.amount || null }),
        ...(validated.amountMin !== undefined && { amountMin: validated.amountMin || null }),
        ...(validated.amountMax !== undefined && { amountMax: validated.amountMax || null }),
        ...(validated.deadline !== undefined && { deadline: validated.deadline || null }),
        ...(validated.eligibility !== undefined && { eligibility: validated.eligibility }),
        ...(validated.tags !== undefined && { tags: validated.tags }),
        ...(validated.eligibleApplicants !== undefined && { eligibleApplicants: validated.eligibleApplicants }),
        ...(validated.applicationProcess !== undefined && { applicationProcess: validated.applicationProcess || null }),
        ...(validated.requiredDocuments !== undefined && { requiredDocuments: validated.requiredDocuments }),
        ...(validated.contactEmail !== undefined && { contactEmail: validated.contactEmail || null }),
        ...(validated.contactPhone !== undefined && { contactPhone: validated.contactPhone || null }),
        ...(validated.cfda !== undefined && { cfda: validated.cfda || null }),
        ...(validated.opportunityNumber !== undefined && { opportunityNumber: validated.opportunityNumber || null }),
        ...(validated.matchingRequired !== undefined && { matchingRequired: validated.matchingRequired }),
        ...(validated.matchingPercentage !== undefined && { matchingPercentage: validated.matchingPercentage || null }),
        ...(validated.renewalEligibility !== undefined && { renewalEligibility: validated.renewalEligibility }),
        ...(validated.source !== undefined && { source: validated.source || null }),
      },
    })

    return NextResponse.json({ success: true, data: grant })
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
    console.error('Failed to update grant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update grant' },
      { status: 500 }
    )
  }
}
