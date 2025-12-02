import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resourceId, resourceTitle, reason } = body

    if (!resourceId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log the report (in production, this would send an email or create a database entry)
    console.log('Outdated Resource Report:', {
      resourceId,
      resourceTitle,
      reason,
      timestamp: new Date().toISOString(),
    })

    // TODO: In production, implement one of these:
    // 1. Send email to admins
    // 2. Create a "Reports" table in database
    // 3. Send to external logging service
    // 4. Create a GitHub issue

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting outdated resource report:', error)
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    )
  }
}
