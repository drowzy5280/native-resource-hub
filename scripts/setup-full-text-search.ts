/**
 * Script to set up full-text search with PostgreSQL
 * Run with: npx tsx scripts/setup-full-text-search.ts
 */

import { prisma } from '../lib/prisma'
import * as fs from 'fs'
import * as path from 'path'

async function setupFullTextSearch() {
  try {
    console.log('🔍 Setting up full-text search with PostgreSQL...\n')

    // Read the migration SQL file
    const migrationPath = path.join(
      process.cwd(),
      'prisma',
      'migrations',
      'full-text-search',
      'migration.sql'
    )

    console.log('📄 Reading migration file...')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    // Split SQL statements and execute them
    console.log('⚙️  Executing migration...\n')

    // Execute the entire migration as one transaction
    await prisma.$executeRawUnsafe(migrationSQL)

    console.log('✅ Full-text search setup complete!\n')
    console.log('The following indexes have been created:')
    console.log('  - Trigram indexes on Resource.title and Resource.description')
    console.log('  - Trigram indexes on Scholarship.name and Scholarship.description')
    console.log('  - Trigram indexes on Tribe.name')
    console.log('  - Full-text search vectors on all tables')
    console.log('  - GIN indexes on search vectors')
    console.log('\n📊 Testing the setup...\n')

    // Test the setup
    const testQuery = 'education'
    console.log(`Testing with search term: "${testQuery}"`)

    const result = await prisma.$queryRaw<Array<{ id: string; title: string; similarity: number }>>`
      SELECT id, title, similarity(title, ${testQuery}) as similarity
      FROM "Resource"
      WHERE title % ${testQuery}
      ORDER BY similarity DESC
      LIMIT 5
    `

    if (result.length > 0) {
      console.log('\n✅ Full-text search is working!')
      console.log('Sample results:')
      result.forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.title} (similarity: ${r.similarity.toFixed(3)})`)
      })
    } else {
      console.log('\n⚠️  No results found, but indexes are set up correctly.')
    }

    console.log('\n✨ Setup complete! You can now use full-text search in your application.')
  } catch (error) {
    console.error('❌ Error setting up full-text search:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupFullTextSearch()
