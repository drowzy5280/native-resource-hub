import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseSource } from '@/lib/ai/parseSource'
import { verifyCronSecret } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Verify cron secret
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('Starting daily cron job...')

    // Example: Fetch and parse data from known sources
    const sources = [
      {
        url: 'https://example.com/native-resources',
        type: 'resource' as const,
      },
      // Add more sources here
    ]

    const results = []

    for (const source of sources) {
      try {
        // Fetch HTML (you would implement actual fetching here)
        // const html = await fetch(source.url).then(r => r.text())
        // const parsed = await parseSource(html, source.url, source.type)

        // For now, just log
        console.log(`Would fetch and parse: ${source.url}`)

        // Upsert resources
        // await prisma.resource.upsert({
        //   where: { url: parsed.url },
        //   update: { ...parsed },
        //   create: { ...parsed },
        // })

        results.push({ url: source.url, status: 'success' })
      } catch (error) {
        console.error(`Failed to process ${source.url}:`, error)
        results.push({ url: source.url, status: 'error' })
      }
    }

    console.log('Daily cron job completed')

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error('Daily cron job failed:', error)
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}
