import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('Starting monthly cron job...')

    // 1. Remove outdated resources (older than 2 years)
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

    const outdatedResources = await prisma.resource.findMany({
      where: {
        updatedAt: {
          lt: twoYearsAgo,
        },
      },
    })

    console.log(`Found ${outdatedResources.length} outdated resources`)

    // Create changelog entries before deletion
    for (const resource of outdatedResources) {
      await prisma.changeLog.create({
        data: {
          source: resource.title,
          type: 'removal',
          originalValue: JSON.stringify(resource),
          updatedValue: null,
          aiConfidence: 1.0,
          approved: true,
        },
      })
    }

    // Delete outdated resources
    const deleted = await prisma.resource.deleteMany({
      where: {
        updatedAt: {
          lt: twoYearsAgo,
        },
      },
    })

    // 2. Remove expired scholarships (past deadline by 6+ months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0]

    const expiredScholarships = await prisma.scholarship.deleteMany({
      where: {
        deadline: {
          lt: sixMonthsAgoStr,
        },
      },
    })

    // 3. Clean up old changelog entries (older than 1 year)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const deletedLogs = await prisma.changeLog.deleteMany({
      where: {
        createdAt: {
          lt: oneYearAgo,
        },
      },
    })

    // 4. Database optimization stats
    const stats = {
      totalResources: await prisma.resource.count(),
      totalScholarships: await prisma.scholarship.count(),
      totalTribes: await prisma.tribe.count(),
      totalUsers: await prisma.user.count(),
      totalChangeLogs: await prisma.changeLog.count(),
    }

    console.log('Monthly cron job completed')

    return NextResponse.json({
      success: true,
      removedResources: deleted.count,
      removedScholarships: expiredScholarships.count,
      cleanedLogs: deletedLogs.count,
      stats,
    })
  } catch (error) {
    console.error('Monthly cron job failed:', error)
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}
