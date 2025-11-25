import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse/sync'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
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

    for (const record of records) {
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

        // Parse deadline
        const deadline = record.deadline ? new Date(record.deadline) : null

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
      } catch (error: any) {
        failed++
        errors.push(`Error importing ${record.name}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      failed,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Import failed: ${error.message}` },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
