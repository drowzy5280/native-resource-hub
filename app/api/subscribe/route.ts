import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // In production, you would:
    // 1. Add to your email service (SendGrid, Mailchimp, etc.)
    // 2. Store in database
    // 3. Send confirmation email

    // For now, we'll just log and return success
    console.log('New subscriber:', email)

    // Example integration with SendGrid (uncomment when ready):
    // await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     contacts: [{ email }],
    //     list_ids: [process.env.SENDGRID_LIST_ID],
    //   }),
    // })

    return NextResponse.json({ success: true, message: 'Subscribed successfully' })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
