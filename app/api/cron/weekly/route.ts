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
    console.log('Starting weekly cron job...')

    // 1. Check all resource links
    const resources = await prisma.resource.findMany({
      where: {
        url: { not: null },
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
    console.log(`Found ${brokenLinks.length} broken links`)

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

    console.log('Weekly cron job completed')

    return NextResponse.json({
      success: true,
      brokenResourceLinks: brokenLinks.length,
      expiredScholarships: expiredScholarships.length,
      brokenTribeLinks: brokenTribeLinks.length,
    })
  } catch (error) {
    console.error('Weekly cron job failed:', error)
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}
