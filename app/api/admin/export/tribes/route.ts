import { NextRequest, NextResponse } from 'next/server'
import { stringify } from 'csv-stringify/sync'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin(request)

    const tribes = await prisma.tribe.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    })

    // Convert to CSV format
    const csvData = tribes.map((tribe) => ({
      name: tribe.name,
      federalRecognitionStatus: tribe.federalRecognitionStatus || '',
      website: tribe.website || '',
      region: tribe.region || '',
      enrollmentOffice: tribe.enrollmentOffice || '',
      languageLinks: tribe.languageLinks.join(';'),
    }))

    const csv = stringify(csvData, {
      header: true,
      columns: ['name', 'federalRecognitionStatus', 'website', 'region', 'enrollmentOffice', 'languageLinks'],
    })

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="tribes-export-${new Date().toISOString().split('T')[0]}.csv"`,
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
