import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { requireCSRFToken } from '@/lib/csrf'
import { adminRateLimiter, addRateLimitHeaders } from '@/lib/rateLimit'

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

    // Type for CSV records
    interface ScholarshipCSVRecord {
      name?: string
      description?: string
      amount?: string
      deadline?: string
      tags?: string
      eligibility?: string
      url?: string
      source?: string
    }

    for (const record of records as ScholarshipCSVRecord[]) {
      try {
        // Required fields
        if (!record.name || !record.description) {
          failed++
          errors.push(`Missing required fields for: ${record.name || 'Unknown'}`)
          continue
        }

        // Parse arrays (semicolon-separated)
        const tags = record.tags ? record.tags.split(';').map((t: string) => t.trim()).filter(Boolean) : []
        const eligibility = record.eligibility ? record.eligibility.split(';').map((e: string) => e.trim()).filter(Boolean) : []

        // Parse and validate deadline
        let deadline: Date | null = null
        if (record.deadline) {
          const parsedDate = new Date(record.deadline)
          // Check if date is valid (Invalid Date has NaN time value)
          if (!isNaN(parsedDate.getTime())) {
            deadline = parsedDate
          } else {
            console.warn(`Invalid deadline format for ${record.name}: ${record.deadline}`)
          }
        }

        // Create or update scholarship
        await prisma.scholarship.upsert({
          where: { url: record.url || `generated-${Date.now()}-${Math.random()}` },
          update: {
            name: record.name,
            description: record.description,
            amount: record.amount || null,
            deadline,
            tags,
            eligibility,
            source: record.source || null,
          },
          create: {
            name: record.name,
            description: record.description,
            url: record.url || null,
            amount: record.amount || null,
            deadline,
            tags,
            eligibility,
            source: record.source || null,
          },
        })

        imported++
      } catch (error) {
        failed++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`Error importing ${record.name}: ${errorMessage}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      failed,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    // Sanitize error message to avoid leaking internal details
    console.error('Import failed:', error)
    return NextResponse.json(
      { error: 'Import failed. Please check your CSV format and try again.' },
      { status: 500 }
    )
  }
}
