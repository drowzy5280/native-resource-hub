/**
 * Database Restore Script
 *
 * This script restores data from a backup directory to the database.
 * WARNING: This will REPLACE existing data!
 *
 * Usage: npx tsx scripts/restore-database.ts backups/2024-01-15
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function restoreDatabase(backupDir: string) {
  if (!fs.existsSync(backupDir)) {
    console.error(`Backup directory not found: ${backupDir}`)
    process.exit(1)
  }

  const manifestPath = path.join(backupDir, 'manifest.json')
  if (!fs.existsSync(manifestPath)) {
    console.error('Invalid backup: manifest.json not found')
    process.exit(1)
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  console.log(`Restoring from backup: ${manifest.timestamp}`)
  console.log(`Total records to restore: ${Object.values(manifest.counts).reduce((a: any, b: any) => a + b, 0)}`)

  console.log('\n⚠️  WARNING: This will replace existing data!')
  console.log('Press Ctrl+C within 5 seconds to cancel...\n')

  await new Promise(resolve => setTimeout(resolve, 5000))

  try {
    // Clear existing data in reverse dependency order
    console.log('Clearing existing data...')

    await prisma.savedResource.deleteMany()
    console.log('  ✓ Cleared saved resources')

    await prisma.changeLog.deleteMany()
    console.log('  ✓ Cleared change logs')

    await prisma.resource.deleteMany()
    console.log('  ✓ Cleared resources')

    await prisma.scholarship.deleteMany()
    console.log('  ✓ Cleared scholarships')

    await prisma.grant.deleteMany()
    console.log('  ✓ Cleared grants')

    // Note: We don't delete tribes or users as they may have dependencies

    // Restore data
    console.log('\nRestoring data...')

    // Restore Tribes first (resources depend on them)
    if (manifest.files.includes('tribes.json')) {
      const tribes = JSON.parse(fs.readFileSync(path.join(backupDir, 'tribes.json'), 'utf-8'))
      for (const tribe of tribes) {
        const { programs, _count, ...tribeData } = tribe
        await prisma.tribe.upsert({
          where: { id: tribeData.id },
          update: tribeData,
          create: tribeData,
        })
      }
      console.log(`  ✓ Restored ${tribes.length} tribes`)
    }

    // Restore Resources
    if (manifest.files.includes('resources.json')) {
      const resources = JSON.parse(fs.readFileSync(path.join(backupDir, 'resources.json'), 'utf-8'))
      for (const resource of resources) {
        const { tribe, ...resourceData } = resource
        await prisma.resource.create({
          data: resourceData,
        })
      }
      console.log(`  ✓ Restored ${resources.length} resources`)
    }

    // Restore Scholarships
    if (manifest.files.includes('scholarships.json')) {
      const scholarships = JSON.parse(fs.readFileSync(path.join(backupDir, 'scholarships.json'), 'utf-8'))
      for (const scholarship of scholarships) {
        await prisma.scholarship.create({
          data: {
            ...scholarship,
            deadline: scholarship.deadline ? new Date(scholarship.deadline) : null,
            createdAt: new Date(scholarship.createdAt),
            updatedAt: new Date(scholarship.updatedAt),
            deletedAt: scholarship.deletedAt ? new Date(scholarship.deletedAt) : null,
          },
        })
      }
      console.log(`  ✓ Restored ${scholarships.length} scholarships`)
    }

    // Restore Grants
    if (manifest.files.includes('grants.json')) {
      const grants = JSON.parse(fs.readFileSync(path.join(backupDir, 'grants.json'), 'utf-8'))
      for (const grant of grants) {
        await prisma.grant.create({
          data: {
            ...grant,
            deadline: grant.deadline ? new Date(grant.deadline) : null,
            createdAt: new Date(grant.createdAt),
            updatedAt: new Date(grant.updatedAt),
            deletedAt: grant.deletedAt ? new Date(grant.deletedAt) : null,
          },
        })
      }
      console.log(`  ✓ Restored ${grants.length} grants`)
    }

    // Restore Change Logs
    if (manifest.files.includes('change-logs.json')) {
      const changeLogs = JSON.parse(fs.readFileSync(path.join(backupDir, 'change-logs.json'), 'utf-8'))
      for (const log of changeLogs) {
        await prisma.changeLog.create({
          data: {
            ...log,
            createdAt: new Date(log.createdAt),
          },
        })
      }
      console.log(`  ✓ Restored ${changeLogs.length} change logs`)
    }

    console.log('\n✓ Restore completed successfully!')

  } catch (error) {
    console.error('Restore failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Get backup directory from command line args
const backupDir = process.argv[2]

if (!backupDir) {
  console.error('Usage: npx tsx scripts/restore-database.ts <backup-directory>')
  console.error('Example: npx tsx scripts/restore-database.ts backups/2024-01-15')
  process.exit(1)
}

restoreDatabase(backupDir)
