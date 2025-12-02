import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin(request)

    const csvContent = await request.text()

    // Parse CSV with relaxed column count to handle commas in fields
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      quote: '"',
      escape: '"',
    })

    let imported = 0
    let failed = 0
    const errors: string[] = []

    for (const record of records as any[]) {
      try {
        // Required fields
        if (!record.type || !record.title || !record.description) {
          failed++
          errors.push(`Missing required fields for: ${record.title || 'Unknown'}`)
          continue
        }

        // Validate type
        const validTypes = ['federal', 'state', 'tribal', 'scholarship', 'emergency']
        if (!validTypes.includes(record.type)) {
          failed++
          errors.push(`Invalid type "${record.type}" for: ${record.title}`)
          continue
        }

        // Parse arrays (semicolon-separated)
        const tags = record.tags ? record.tags.split(';').map((t: string) => t.trim()).filter(Boolean) : []
        const eligibility = record.eligibility ? record.eligibility.split(';').map((e: string) => e.trim()).filter(Boolean) : []

        // Create or update resource
        await prisma.resource.upsert({
          where: { url: record.url || `generated-${Date.now()}-${Math.random()}` },
          update: {
            type: record.type,
            title: record.title,
            description: record.description,
            eligibility,
            tags,
            state: record.state || null,
            tribeId: record.tribeId || null,
            source: record.source || null,
          },
          create: {
            type: record.type,
            title: record.title,
            description: record.description,
            url: record.url || null,
            eligibility,
            tags,
            state: record.state || null,
            tribeId: record.tribeId || null,
            source: record.source || null,
          },
        })

        imported++
      } catch (error: any) {
        failed++
        errors.push(`Error importing ${record.title}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      failed,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // Limit to first 10 errors
    })
  } catch (error: any) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    return NextResponse.json(
      { error: `Import failed: ${error.message}` },
      { status: 500 }
    )
  }
}
