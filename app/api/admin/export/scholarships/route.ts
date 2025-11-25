import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { stringify } from 'csv-stringify/sync'

const prisma = new PrismaClient()

export async function GET() {
  try {
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
    return NextResponse.json(
      { error: `Export failed: ${error.message}` },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
