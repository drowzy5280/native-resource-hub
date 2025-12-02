import { NextRequest, NextResponse } from 'next/server'
import { stringify } from 'csv-stringify/sync'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin(request)

    const scholarships = await prisma.scholarship.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })

    // Convert to CSV format
    const csvData = scholarships.map((scholarship) => ({
      name: scholarship.name,
      description: scholarship.description,
      amount: scholarship.amount || '',
      deadline: scholarship.deadline ? scholarship.deadline.toISOString().split('T')[0] : '',
      url: scholarship.url || '',
      tags: scholarship.tags.join(';'),
      eligibility: scholarship.eligibility.join(';'),
      source: scholarship.source || '',
    }))

    const csv = stringify(csvData, {
      header: true,
      columns: ['name', 'description', 'amount', 'deadline', 'url', 'tags', 'eligibility', 'source'],
    })

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="scholarships-export-${new Date().toISOString().split('T')[0]}.csv"`,
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
