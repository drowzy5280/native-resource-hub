import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { error, stack, context, url, userAgent } = await request.json()

    // Log the error for monitoring
    console.error('Client Error Report:', {
      timestamp: new Date().toISOString(),
      error,
      stack,
      context,
      url,
      userAgent,
    })

    // In production, you could:
    // 1. Send to Sentry via API
    // 2. Store in database for review
    // 3. Send to Slack/Discord webhook
    // 4. Send to your preferred logging service

    // Example: Send to Slack (uncomment when ready)
    // if (process.env.SLACK_WEBHOOK_URL) {
    //   await fetch(process.env.SLACK_WEBHOOK_URL, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       text: `Error on Tribal Resource Hub:\n\`\`\`${error}\n${stack}\`\`\`\nURL: ${url}`,
    //     }),
    //   })
    // }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to log error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
