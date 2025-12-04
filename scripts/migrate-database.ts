import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrate() {
  console.log('Starting database migration...')

  try {
    // Add new columns to Resource table
    console.log('Adding columns to Resource table...')
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Resource"
      ADD COLUMN IF NOT EXISTS "applicationProcess" TEXT,
      ADD COLUMN IF NOT EXISTS "requiredDocuments" TEXT[] DEFAULT ARRAY[]::TEXT[],
      ADD COLUMN IF NOT EXISTS "processingTime" TEXT,
      ADD COLUMN IF NOT EXISTS "contactPhone" TEXT,
      ADD COLUMN IF NOT EXISTS "contactEmail" TEXT,
      ADD COLUMN IF NOT EXISTS "officeHours" TEXT,
      ADD COLUMN IF NOT EXISTS "languageSupport" TEXT[] DEFAULT ARRAY[]::TEXT[],
      ADD COLUMN IF NOT EXISTS "videoUrl" TEXT,
      ADD COLUMN IF NOT EXISTS "averageAward" TEXT,
      ADD COLUMN IF NOT EXISTS "recipientsPerYear" INTEGER,
      ADD COLUMN IF NOT EXISTS "renewalRequired" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "renewalDeadline" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "difficulty" TEXT DEFAULT 'moderate',
      ADD COLUMN IF NOT EXISTS "featured" BOOLEAN DEFAULT false;
    `)

    // Add new columns to Scholarship table
    console.log('Adding columns to Scholarship table...')
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Scholarship"
      ADD COLUMN IF NOT EXISTS "essayRequired" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "letterOfRecRequired" INTEGER,
      ADD COLUMN IF NOT EXISTS "minGPA" DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS "specificMajors" TEXT[] DEFAULT ARRAY[]::TEXT[],
      ADD COLUMN IF NOT EXISTS "tribalEnrollmentReq" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "recipientsPerYear" INTEGER,
      ADD COLUMN IF NOT EXISTS "renewalEligibility" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "contactEmail" TEXT,
      ADD COLUMN IF NOT EXISTS "contactPhone" TEXT,
      ADD COLUMN IF NOT EXISTS "applicationProcess" TEXT,
      ADD COLUMN IF NOT EXISTS "requiredDocuments" TEXT[] DEFAULT ARRAY[]::TEXT[],
      ADD COLUMN IF NOT EXISTS "videoUrl" TEXT,
      ADD COLUMN IF NOT EXISTS "featured" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "amountMin" INTEGER,
      ADD COLUMN IF NOT EXISTS "amountMax" INTEGER;
    `)

    // Create ResourceGuide table if not exists
    console.log('Creating ResourceGuide table...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ResourceGuide" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL UNIQUE,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "published" BOOLEAN NOT NULL DEFAULT false,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "viewCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );
    `)

    // Add missing ResourceGuide columns
    console.log('Adding missing ResourceGuide columns...')
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "ResourceGuide"
      ADD COLUMN IF NOT EXISTS "icon" TEXT,
      ADD COLUMN IF NOT EXISTS "author" TEXT,
      ADD COLUMN IF NOT EXISTS "readTime" INTEGER;
    `)

    // Create SuccessStory table if not exists
    console.log('Creating SuccessStory table...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SuccessStory" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "tribe" TEXT,
        "title" TEXT NOT NULL,
        "excerpt" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "imageUrl" TEXT,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "published" BOOLEAN NOT NULL DEFAULT false,
        "viewCount" INTEGER NOT NULL DEFAULT 0,
        "publishedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );
    `)

    // Add missing SuccessStory columns
    console.log('Adding missing SuccessStory columns...')
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "SuccessStory"
      ADD COLUMN IF NOT EXISTS "location" TEXT,
      ADD COLUMN IF NOT EXISTS "resourceType" TEXT,
      ADD COLUMN IF NOT EXISTS "testimonial" TEXT;
    `)

    // Create FAQ table if not exists
    console.log('Creating FAQ table...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "FAQ" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "question" TEXT NOT NULL,
        "answer" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );
    `)

    // Add missing FAQ columns
    console.log('Adding missing FAQ columns...')
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "FAQ"
      ADD COLUMN IF NOT EXISTS "helpful" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "notHelpful" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "published" BOOLEAN DEFAULT true;
    `)

    // Create BlogPost table if not exists
    console.log('Creating BlogPost table...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "BlogPost" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL UNIQUE,
        "title" TEXT NOT NULL,
        "excerpt" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "author" TEXT NOT NULL,
        "imageUrl" TEXT,
        "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "published" BOOLEAN NOT NULL DEFAULT false,
        "viewCount" INTEGER NOT NULL DEFAULT 0,
        "publishedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );
    `)

    console.log('✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrate()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
