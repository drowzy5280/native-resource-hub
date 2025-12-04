import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addColumns() {
  console.log('Adding missing columns to content tables...')

  try {
    // Add missing FAQ columns
    console.log('Adding FAQ columns...')
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "FAQ"
      ADD COLUMN IF NOT EXISTS "helpful" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "notHelpful" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "published" BOOLEAN DEFAULT true;
    `)

    // Add missing SuccessStory columns
    console.log('Adding SuccessStory columns...')
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "SuccessStory"
      ADD COLUMN IF NOT EXISTS "location" TEXT,
      ADD COLUMN IF NOT EXISTS "resourceType" TEXT,
      ADD COLUMN IF NOT EXISTS "testimonial" TEXT;
    `)

    // Add missing ResourceGuide columns
    console.log('Adding ResourceGuide columns...')
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "ResourceGuide"
      ADD COLUMN IF NOT EXISTS "icon" TEXT,
      ADD COLUMN IF NOT EXISTS "author" TEXT,
      ADD COLUMN IF NOT EXISTS "readTime" INTEGER;
    `)

    console.log('✅ Columns added successfully!')
  } catch (error) {
    console.error('❌ Failed to add columns:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addColumns()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
