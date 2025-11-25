import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkLinks } from '@/lib/ai/linkChecker'
import { verifyCronSecret } from '@/lib/auth'

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
      console.log(`Found ${brokenLinks.length} broken resource links`)

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

      results.weekly = {
        brokenResourceLinks: brokenLinks.length,
        expiredScholarships: expiredScholarships.length,
        brokenTribeLinks: brokenTribeLinks.length,
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

      // 4. Database stats
      const stats = {
        totalResources: await prisma.resource.count({ where: { deletedAt: null } }),
        totalScholarships: await prisma.scholarship.count({ where: { deletedAt: null } }),
        totalTribes: await prisma.tribe.count(),
        totalChangeLogs: await prisma.changeLog.count(),
      }

      results.monthly = {
        removedResources: deletedResources.count,
        removedScholarships: expiredScholarships.count,
        cleanedLogs: deletedLogs.count,
        stats,
      }
    }

    // DAILY TASKS - Run every day
    console.log('Running DAILY tasks...')
    results.tasksRun.push('daily')

    // Basic health check and stats
    const dailyStats = {
      activeResources: await prisma.resource.count({ where: { deletedAt: null } }),
      activeScholarships: await prisma.scholarship.count({ where: { deletedAt: null } }),
      pendingChangelogs: await prisma.changeLog.count({ where: { approved: false } }),
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
