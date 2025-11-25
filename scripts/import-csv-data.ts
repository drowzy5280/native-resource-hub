import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'
import { join } from 'path'

const prisma = new PrismaClient()

async function importCSVData() {
  console.log('🌱 Starting CSV data import...\n')

  try {
    // Import Resources
    console.log('📦 Importing resources...')
    const resourcesCSV = readFileSync(
      join(process.cwd(), 'data', 'federal-resources-comprehensive.csv'),
      'utf-8'
    )

    const resourceRecords = parse(resourcesCSV, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    })

    let resourcesAdded = 0
    let resourcesFailed = 0

    for (const record of resourceRecords) {
      try {
        if (!record.type || !record.title || !record.description) {
          resourcesFailed++
          continue
        }

        const tags = record.tags ? record.tags.split(';').map((t: string) => t.trim()).filter(Boolean) : []
        const eligibility = record.eligibility ? record.eligibility.split(';').map((e: string) => e.trim()).filter(Boolean) : []

        await prisma.resource.upsert({
          where: { url: record.url || `generated-${Date.now()}-${Math.random()}` },
          update: {},
          create: {
            type: record.type,
            title: record.title,
            description: record.description,
            url: record.url || null,
            eligibility,
            tags,
            state: record.state || null,
            source: record.source || null,
          },
        })

        resourcesAdded++
      } catch (error: any) {
        console.error(`Failed to import resource: ${record.title}`, error.message)
        resourcesFailed++
      }
    }

    console.log(`✅ Resources: ${resourcesAdded} imported, ${resourcesFailed} failed\n`)

    // Import Scholarships
    console.log('🎓 Importing scholarships...')
    const scholarshipsCSV = readFileSync(
      join(process.cwd(), 'data', 'scholarships-comprehensive.csv'),
      'utf-8'
    )

    const scholarshipRecords = parse(scholarshipsCSV, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    })

    let scholarshipsAdded = 0
    let scholarshipsFailed = 0

    for (const record of scholarshipRecords) {
      try {
        if (!record.name || !record.description) {
          scholarshipsFailed++
          continue
        }

        const tags = record.tags ? record.tags.split(';').map((t: string) => t.trim()).filter(Boolean) : []
        const eligibility = record.eligibility ? record.eligibility.split(';').map((e: string) => e.trim()).filter(Boolean) : []

        // Only parse deadline if it's a valid date string
        let deadline = null
        if (record.deadline && record.deadline.trim() && record.deadline !== 'Rolling') {
          const parsedDate = new Date(record.deadline)
          if (!isNaN(parsedDate.getTime())) {
            deadline = parsedDate
          }
        }

        await prisma.scholarship.upsert({
          where: { url: record.url || `generated-${Date.now()}-${Math.random()}` },
          update: {},
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

        scholarshipsAdded++
      } catch (error: any) {
        console.error(`Failed to import scholarship: ${record.name}`, error.message)
        scholarshipsFailed++
      }
    }

    console.log(`✅ Scholarships: ${scholarshipsAdded} imported, ${scholarshipsFailed} failed\n`)

    // Import Tribes
    console.log('🏛️  Importing tribes...')
    const tribesCSV = readFileSync(
      join(process.cwd(), 'data', 'tribes-comprehensive.csv'),
      'utf-8'
    )

    const tribeRecords = parse(tribesCSV, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    })

    let tribesAdded = 0
    let tribesFailed = 0

    for (const record of tribeRecords) {
      try {
        if (!record.name) {
          tribesFailed++
          continue
        }

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

        tribesAdded++
      } catch (error: any) {
        console.error(`Failed to import tribe: ${record.name}`, error.message)
        tribesFailed++
      }
    }

    console.log(`✅ Tribes: ${tribesAdded} imported, ${tribesFailed} failed\n`)

    // Summary
    const totals = {
      tribes: await prisma.tribe.count({ where: { deletedAt: null } }),
      resources: await prisma.resource.count({ where: { deletedAt: null } }),
      scholarships: await prisma.scholarship.count({ where: { deletedAt: null } }),
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ CSV IMPORT COMPLETE!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📊 Database Totals:`)
    console.log(`   • Tribes: ${totals.tribes}`)
    console.log(`   • Resources: ${totals.resources}`)
    console.log(`   • Scholarships: ${totals.scholarships}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  } catch (error: any) {
    console.error('❌ Error during import:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importCSVData()
