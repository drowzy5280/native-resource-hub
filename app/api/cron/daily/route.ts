import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkLinks } from '@/lib/ai/linkChecker'
import { verifyCronSecret } from '@/lib/auth'
import { notificationService } from '@/lib/email/notifications'

export async function GET(request: NextRequest) {
  // Verify cron secret
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    const dayOfMonth = now.getDate()

    console.log(`Starting smart cron job - Day: ${dayOfWeek}, Date: ${dayOfMonth}`)

    const results: any = {
      date: now.toISOString(),
      tasksRun: [],
    }

    // WEEKLY TASKS - Run every Monday (day 1)
    if (dayOfWeek === 1) {
      console.log('Running WEEKLY tasks...')
      results.tasksRun.push('weekly')

      // 1. Check all resource links
      const resources = await prisma.resource.findMany({
        where: {
          url: { not: null },
          deletedAt: null,
        },
        select: {
          id: true,
          url: true,
          title: true,
        },
      })

      const urls = resources
        .map((r) => r.url)
        .filter((url): url is string => url !== null)

      console.log(`Checking ${urls.length} resource links...`)
      const linkResults = await checkLinks(urls)

      // Log broken links
      const brokenLinks = linkResults.filter((r) => !r.isValid)
      const validLinks = linkResults.filter((r) => r.isValid)
      console.log(`Found ${brokenLinks.length} broken and ${validLinks.length} valid resource links`)

      // Update lastVerified for ALL checked resources (valid and broken)
      for (const result of linkResults) {
        const resource = resources.find((r) => r.url === result.url)
        if (resource) {
          await prisma.resource.update({
            where: { id: resource.id },
            data: {
              lastVerified: now,
              verifiedBy: result.isValid ? 'auto-check' : 'auto-check-broken',
            },
          })
        }
      }

      // Create changelog entries for broken links
      for (const broken of brokenLinks) {
        const resource = resources.find((r) => r.url === broken.url)
        if (resource) {
          await prisma.changeLog.create({
            data: {
              source: resource.title,
              type: 'broken_link',
              originalValue: broken.url,
              updatedValue: null,
              aiConfidence: 1.0,
              approved: false,
            },
          })
        }
      }

      // 2. Check scholarship deadlines
      const scholarships = await prisma.scholarship.findMany({
        where: {
          deadline: { not: null },
          deletedAt: null,
        },
      })

      const today = new Date()
      const expiredScholarships = scholarships.filter(
        (s) => s.deadline && s.deadline < today
      )

      console.log(`Found ${expiredScholarships.length} expired scholarships`)

      // 3. Check tribe websites
      const tribes = await prisma.tribe.findMany({
        where: {
          website: { not: null },
        },
        select: {
          id: true,
          name: true,
          website: true,
        },
      })

      const tribeUrls = tribes
        .map((t) => t.website)
        .filter((url): url is string => url !== null)

      console.log(`Checking ${tribeUrls.length} tribe websites...`)
      const tribeResults = await checkLinks(tribeUrls)
      const brokenTribeLinks = tribeResults.filter((r) => !r.isValid)

      console.log(`Found ${brokenTribeLinks.length} broken tribe links`)

      // 4. Check scholarship URLs
      const scholarshipsWithUrls = await prisma.scholarship.findMany({
        where: {
          url: { not: null },
          deletedAt: null,
        },
        select: {
          id: true,
          url: true,
          name: true,
        },
      })

      const scholarshipUrls = scholarshipsWithUrls
        .map((s) => s.url)
        .filter((url): url is string => url !== null)

      console.log(`Checking ${scholarshipUrls.length} scholarship links...`)
      const scholarshipResults = await checkLinks(scholarshipUrls)
      const brokenScholarshipLinks = scholarshipResults.filter((r) => !r.isValid)
      const validScholarshipLinks = scholarshipResults.filter((r) => r.isValid)

      console.log(`Found ${brokenScholarshipLinks.length} broken and ${validScholarshipLinks.length} valid scholarship links`)

      // Update lastVerified for ALL checked scholarships
      for (const result of scholarshipResults) {
        const scholarship = scholarshipsWithUrls.find((s) => s.url === result.url)
        if (scholarship) {
          await prisma.scholarship.update({
            where: { id: scholarship.id },
            data: {
              lastVerified: now,
              verifiedBy: result.isValid ? 'auto-check' : 'auto-check-broken',
            },
          })
        }
      }

      // Create changelog entries for broken scholarship links
      for (const broken of brokenScholarshipLinks) {
        const scholarship = scholarshipsWithUrls.find((s) => s.url === broken.url)
        if (scholarship) {
          await prisma.changeLog.create({
            data: {
              source: scholarship.name,
              type: 'broken_link',
              originalValue: broken.url,
              updatedValue: null,
              aiConfidence: 1.0,
              approved: false,
            },
          })
        }
      }

      // 5. Check grant URLs
      const grantsWithUrls = await prisma.grant.findMany({
        where: {
          url: { not: null },
          deletedAt: null,
        },
        select: {
          id: true,
          url: true,
          name: true,
        },
      })

      const grantUrls = grantsWithUrls
        .map((g) => g.url)
        .filter((url): url is string => url !== null)

      console.log(`Checking ${grantUrls.length} grant links...`)
      const grantResults = await checkLinks(grantUrls)
      const brokenGrantLinks = grantResults.filter((r) => !r.isValid)
      const validGrantLinks = grantResults.filter((r) => r.isValid)

      console.log(`Found ${brokenGrantLinks.length} broken and ${validGrantLinks.length} valid grant links`)

      // Update lastVerified for ALL checked grants
      for (const result of grantResults) {
        const grant = grantsWithUrls.find((g) => g.url === result.url)
        if (grant) {
          await prisma.grant.update({
            where: { id: grant.id },
            data: {
              lastVerified: now,
              verifiedBy: result.isValid ? 'auto-check' : 'auto-check-broken',
            },
          })
        }
      }

      // Create changelog entries for broken grant links
      for (const broken of brokenGrantLinks) {
        const grant = grantsWithUrls.find((g) => g.url === broken.url)
        if (grant) {
          await prisma.changeLog.create({
            data: {
              source: grant.name,
              type: 'broken_link',
              originalValue: broken.url,
              updatedValue: null,
              aiConfidence: 1.0,
              approved: false,
            },
          })
        }
      }

      // 6. Check grant deadlines
      const grants = await prisma.grant.findMany({
        where: {
          deadline: { not: null },
          deletedAt: null,
        },
      })

      const expiredGrants = grants.filter(
        (g) => g.deadline && g.deadline < today
      )

      console.log(`Found ${expiredGrants.length} expired grants`)

      results.weekly = {
        brokenResourceLinks: brokenLinks.length,
        expiredScholarships: expiredScholarships.length,
        brokenTribeLinks: brokenTribeLinks.length,
        brokenScholarshipLinks: brokenScholarshipLinks.length,
        brokenGrantLinks: brokenGrantLinks.length,
        expiredGrants: expiredGrants.length,
      }
    }

    // MONTHLY TASKS - Run on the 1st of each month
    if (dayOfMonth === 1) {
      console.log('Running MONTHLY tasks...')
      results.tasksRun.push('monthly')

      // 1. Soft delete outdated resources (older than 2 years)
      const twoYearsAgo = new Date()
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

      const deletedResources = await prisma.resource.updateMany({
        where: {
          updatedAt: {
            lt: twoYearsAgo,
          },
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      })

      console.log(`Soft deleted ${deletedResources.count} outdated resources`)

      // 2. Soft delete expired scholarships (past deadline by 1+ year)
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      const expiredScholarships = await prisma.scholarship.updateMany({
        where: {
          deadline: {
            lt: oneYearAgo,
          },
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      })

      console.log(`Soft deleted ${expiredScholarships.count} old expired scholarships`)

      // 2b. Soft delete expired grants (past deadline by 1+ year)
      const expiredGrantsCleanup = await prisma.grant.updateMany({
        where: {
          deadline: {
            lt: oneYearAgo,
          },
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      })

      console.log(`Soft deleted ${expiredGrantsCleanup.count} old expired grants`)

      // 3. Clean up old changelog entries (older than 6 months and approved)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const deletedLogs = await prisma.changeLog.deleteMany({
        where: {
          createdAt: {
            lt: sixMonthsAgo,
          },
          approved: true,
        },
      })

      console.log(`Deleted ${deletedLogs.count} old changelog entries`)

      // 4. Database stats - parallelized for better performance
      const [totalResources, totalScholarships, totalGrants, totalTribes, totalChangeLogs] = await Promise.all([
        prisma.resource.count({ where: { deletedAt: null } }),
        prisma.scholarship.count({ where: { deletedAt: null } }),
        prisma.grant.count({ where: { deletedAt: null } }),
        prisma.tribe.count(),
        prisma.changeLog.count(),
      ])

      const stats = {
        totalResources,
        totalScholarships,
        totalGrants,
        totalTribes,
        totalChangeLogs,
      }

      results.monthly = {
        removedResources: deletedResources.count,
        removedScholarships: expiredScholarships.count,
        removedGrants: expiredGrantsCleanup.count,
        cleanedLogs: deletedLogs.count,
        stats,
      }
    }

    // DAILY TASKS - Run every day
    console.log('Running DAILY tasks...')
    results.tasksRun.push('daily')

    // Send scholarship deadline reminders
    console.log('Sending deadline reminders...')
    try {
      await notificationService.sendDeadlineReminders()
      console.log('Deadline reminders sent successfully')
    } catch (error) {
      console.error('Failed to send deadline reminders:', error)
    }

    // Basic health check and stats - parallelized for better performance
    const [activeResources, activeScholarships, activeGrants, pendingChangelogs] = await Promise.all([
      prisma.resource.count({ where: { deletedAt: null } }),
      prisma.scholarship.count({ where: { deletedAt: null } }),
      prisma.grant.count({ where: { deletedAt: null } }),
      prisma.changeLog.count({ where: { approved: false } }),
    ])

    const dailyStats = {
      activeResources,
      activeScholarships,
      activeGrants,
      pendingChangelogs,
    }

    results.daily = dailyStats

    // Future: Add content fetching from external sources here
    // const sources = [
    //   { url: 'https://example.com/native-resources', type: 'resource' },
    // ]

    console.log('Smart cron job completed')

    return NextResponse.json({
      success: true,
      ...results,
    })
  } catch (error) {
    console.error('Smart cron job failed:', error)
    return NextResponse.json(
      { error: 'Cron job failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
