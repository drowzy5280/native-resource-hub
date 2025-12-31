/**
 * Database Backup Script
 *
 * This script exports all data from the database to JSON files
 * for backup and disaster recovery purposes.
 *
 * Usage: npx tsx scripts/backup-database.ts
 *
 * Backup files are saved to: backups/YYYY-MM-DD/
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function backupDatabase() {
  const timestamp = new Date().toISOString().split('T')[0]
  const backupDir = path.join(process.cwd(), 'backups', timestamp)

  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  console.log(`Starting database backup to ${backupDir}...`)

  try {
    // Backup Resources
    console.log('Backing up resources...')
    const resources = await prisma.resource.findMany({
      include: { tribe: true },
    })
    fs.writeFileSync(
      path.join(backupDir, 'resources.json'),
      JSON.stringify(resources, null, 2)
    )
    console.log(`  ✓ ${resources.length} resources backed up`)

    // Backup Scholarships
    console.log('Backing up scholarships...')
    const scholarships = await prisma.scholarship.findMany()
    fs.writeFileSync(
      path.join(backupDir, 'scholarships.json'),
      JSON.stringify(scholarships, null, 2)
    )
    console.log(`  ✓ ${scholarships.length} scholarships backed up`)

    // Backup Tribes
    console.log('Backing up tribes...')
    const tribes = await prisma.tribe.findMany({
      include: {
        programs: true,
        _count: { select: { programs: true } },
      },
    })
    fs.writeFileSync(
      path.join(backupDir, 'tribes.json'),
      JSON.stringify(tribes, null, 2)
    )
    console.log(`  ✓ ${tribes.length} tribes backed up`)

    // Backup Grants
    console.log('Backing up grants...')
    const grants = await prisma.grant.findMany()
    fs.writeFileSync(
      path.join(backupDir, 'grants.json'),
      JSON.stringify(grants, null, 2)
    )
    console.log(`  ✓ ${grants.length} grants backed up`)

    // Backup Users (without sensitive data)
    console.log('Backing up users...')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        tribeId: true,
        state: true,
        createdAt: true,
      },
    })
    fs.writeFileSync(
      path.join(backupDir, 'users.json'),
      JSON.stringify(users, null, 2)
    )
    console.log(`  ✓ ${users.length} users backed up`)

    // Backup ChangeLogs
    console.log('Backing up change logs...')
    const changeLogs = await prisma.changeLog.findMany()
    fs.writeFileSync(
      path.join(backupDir, 'change-logs.json'),
      JSON.stringify(changeLogs, null, 2)
    )
    console.log(`  ✓ ${changeLogs.length} change logs backed up`)

    // Backup SavedResources
    console.log('Backing up saved resources...')
    const savedResources = await prisma.savedResource.findMany()
    fs.writeFileSync(
      path.join(backupDir, 'saved-resources.json'),
      JSON.stringify(savedResources, null, 2)
    )
    console.log(`  ✓ ${savedResources.length} saved resources backed up`)

    // Create backup manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      counts: {
        resources: resources.length,
        scholarships: scholarships.length,
        tribes: tribes.length,
        grants: grants.length,
        users: users.length,
        changeLogs: changeLogs.length,
        savedResources: savedResources.length,
      },
      files: [
        'resources.json',
        'scholarships.json',
        'tribes.json',
        'grants.json',
        'users.json',
        'change-logs.json',
        'saved-resources.json',
      ],
    }
    fs.writeFileSync(
      path.join(backupDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    )

    console.log('\n✓ Backup completed successfully!')
    console.log(`  Location: ${backupDir}`)
    console.log(`  Total records: ${Object.values(manifest.counts).reduce((a, b) => a + b, 0)}`)

    // Clean up old backups (keep last 30 days)
    await cleanOldBackups(30)

  } catch (error) {
    console.error('Backup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function cleanOldBackups(retentionDays: number) {
  const backupsDir = path.join(process.cwd(), 'backups')

  if (!fs.existsSync(backupsDir)) return

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

  const directories = fs.readdirSync(backupsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  let deletedCount = 0
  for (const dir of directories) {
    // Parse directory name as date (YYYY-MM-DD format)
    const dirDate = new Date(dir)
    if (!isNaN(dirDate.getTime()) && dirDate < cutoffDate) {
      const dirPath = path.join(backupsDir, dir)
      fs.rmSync(dirPath, { recursive: true, force: true })
      deletedCount++
    }
  }

  if (deletedCount > 0) {
    console.log(`\n✓ Cleaned up ${deletedCount} old backup(s) (older than ${retentionDays} days)`)
  }
}

// Run backup
backupDatabase()
