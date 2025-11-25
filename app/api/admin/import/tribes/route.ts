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

    for (const record of records as any[]) {
      try {
        // Required fields
        if (!record.name) {
          failed++
          errors.push('Missing required field: name')
          continue
        }

        // Parse language links (semicolon-separated)
        const languageLinks = record.languageLinks
          ? record.languageLinks.split(';').map((l: string) => l.trim()).filter(Boolean)
          : []

        // Check if tribe already exists by name
        const existingTribe = await prisma.tribe.findFirst({
          where: { name: record.name },
        })

        if (existingTribe) {
          // Update existing tribe
          await prisma.tribe.update({
            where: { id: existingTribe.id },
            data: {
              website: record.website || existingTribe.website,
              federalRecognitionStatus: record.federalRecognitionStatus || existingTribe.federalRecognitionStatus,
              region: record.region || existingTribe.region,
              enrollmentOffice: record.enrollmentOffice || existingTribe.enrollmentOffice,
              languageLinks: languageLinks.length > 0 ? languageLinks : existingTribe.languageLinks,
            },
          })
        } else {
          // Create new tribe
          await prisma.tribe.create({
            data: {
              name: record.name,
              website: record.website || null,
              federalRecognitionStatus: record.federalRecognitionStatus || null,
              region: record.region || null,
              enrollmentOffice: record.enrollmentOffice || null,
              languageLinks,
            },
          })
        }

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
