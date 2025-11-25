import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { stringify } from 'csv-stringify/sync'

const prisma = new PrismaClient()

export async function GET() {
  try {
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
    return NextResponse.json(
      { error: `Export failed: ${error.message}` },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
