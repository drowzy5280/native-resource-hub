import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const ReportSchema = z.object({
  resourceId: z.string().uuid(),
  resourceTitle: z.string().min(1).max(500),
  reason: z.string().min(10).max(2000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = ReportSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { resourceId, resourceTitle, reason } = validationResult.data

    // Verify the resource exists
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { id: true },
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Check for duplicate recent reports (within last 24 hours)
    const recentReport = await prisma.resourceReport.findFirst({
      where: {
        resourceId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    })

    if (recentReport) {
      return NextResponse.json({
        success: true,
        message: 'A similar report was recently submitted. Thank you for your feedback!',
        alreadyReported: true,
      })
    }

    // Store the report in the database
    const report = await prisma.resourceReport.create({
      data: {
        resourceId,
        resourceTitle,
        reason,
      },
    })

    // Log for monitoring
    console.log('Outdated Resource Report created:', {
      reportId: report.id,
      resourceId,
      resourceTitle,
      timestamp: report.createdAt.toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully. Our team will review it shortly.',
      reportId: report.id,
    })
  } catch (error) {
    console.error('Error submitting outdated resource report:', error)
    return NextResponse.json(
      { error: 'Failed to submit report. Please try again later.' },
      { status: 500 }
    )
  }
}

// GET endpoint for admins to view reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    const reports = await prisma.resourceReport.findMany({
      where: {
        status: status as 'pending' | 'reviewed' | 'resolved' | 'dismissed',
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({
      reports,
      count: reports.length,
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}
