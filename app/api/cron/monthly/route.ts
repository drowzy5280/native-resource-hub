import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyCronSecret } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Verify cron secret
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('Starting monthly cron job...')

    // 1. Soft delete outdated resources (older than 2 years)
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

    // Soft delete outdated resources
    const deleted = await prisma.resource.updateMany({
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

    console.log(`Soft deleted ${deleted.count} outdated resources`)

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
