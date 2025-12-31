import { NextRequest, NextResponse } from 'next/server'
import { checkLink } from '@/lib/ai/linkChecker'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format', isValid: false },
        { status: 400 }
      )
    }

    const result = await checkLink(url, { timeout: 10000 })

    return NextResponse.json({
      url: result.url,
      isValid: result.isValid,
      statusCode: result.statusCode,
      error: result.error,
    })
  } catch (error) {
    console.error('Link check failed:', error)
    return NextResponse.json(
      { error: 'Failed to check link', isValid: false },
      { status: 500 }
    )
  }
}
