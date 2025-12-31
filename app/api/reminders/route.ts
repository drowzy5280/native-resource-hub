import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, scholarshipId, scholarshipName, deadline } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    if (!scholarshipId || !scholarshipName) {
      return NextResponse.json({ error: 'Scholarship information is required' }, { status: 400 })
    }

    // In production, you would:
    // 1. Store the reminder in your database
    // 2. Set up a cron job to send reminders before deadline
    // 3. Use a service like SendGrid, Mailchimp, or Resend for emails

    console.log('New deadline reminder:', { email, scholarshipId, scholarshipName, deadline })

    // Calculate reminder dates (7 days and 1 day before deadline)
    const deadlineDate = new Date(deadline)
    const oneWeekBefore = new Date(deadlineDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneDayBefore = new Date(deadlineDate.getTime() - 1 * 24 * 60 * 60 * 1000)

    console.log('Reminder dates:', {
      deadline: deadlineDate.toISOString(),
      oneWeekBefore: oneWeekBefore.toISOString(),
      oneDayBefore: oneDayBefore.toISOString(),
    })

    // Example: Store reminder in database
    // await prisma.reminder.create({
    //   data: {
    //     email,
    //     scholarshipId,
    //     scholarshipName,
    //     deadline: deadlineDate,
    //     reminderDates: [oneWeekBefore, oneDayBefore],
    //   },
    // })

    return NextResponse.json({
      success: true,
      message: 'Reminder set successfully',
      reminderDates: {
        oneWeekBefore: oneWeekBefore.toISOString(),
        oneDayBefore: oneDayBefore.toISOString(),
      },
    })
  } catch (error) {
    console.error('Reminder error:', error)
    return NextResponse.json({ error: 'Failed to set reminder' }, { status: 500 })
  }
}
