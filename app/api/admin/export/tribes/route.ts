import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { stringify } from 'csv-stringify/sync'

const prisma = new PrismaClient()

export async function GET() {
  try {
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
    return NextResponse.json(
      { error: `Export failed: ${error.message}` },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
