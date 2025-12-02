import { NextRequest, NextResponse } from 'next/server'
import { stringify } from 'csv-stringify/sync'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin(request)

    const resources = await prisma.resource.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })

    // Convert to CSV format
    const csvData = resources.map((resource) => ({
      type: resource.type,
      title: resource.title,
      description: resource.description,
      url: resource.url || '',
      eligibility: resource.eligibility.join(';'),
      tags: resource.tags.join(';'),
      state: resource.state || '',
      tribeId: resource.tribeId || '',
      source: resource.source || '',
    }))

    const csv = stringify(csvData, {
      header: true,
      columns: ['type', 'title', 'description', 'url', 'eligibility', 'tags', 'state', 'tribeId', 'source'],
    })

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="resources-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error: any) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    return NextResponse.json(
      { error: `Export failed: ${error.message}` },
      { status: 500 }
    )
  }
}
