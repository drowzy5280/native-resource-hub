/**
 * Data import/export utilities for admin
 * Supports CSV and JSON formats
 */

import { prisma } from './prisma'
import { ResourceSchema, ScholarshipSchema, TribeSchema } from './validators'

export interface ImportResult {
  success: boolean
  imported: number
  failed: number
  errors: Array<{ row: number; error: string }>
}

/**
 * Parse CSV string to array of objects
 */
export function parseCSV(csvString: string): Record<string, string>[] {
  const lines = csvString.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim())

  return lines.slice(1).map((line, index) => {
    const values = line.split(',').map((v) => v.trim())
    const obj: Record<string, string> = {}

    headers.forEach((header, i) => {
      obj[header] = values[i] || ''
    })

    return obj
  })
}

/**
 * Convert array of objects to CSV string
 */
export function toCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header]
        const stringValue = value !== null && value !== undefined ? String(value) : ''
        // Escape commas and quotes
        return stringValue.includes(',') || stringValue.includes('"')
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue
      }).join(',')
    ),
  ]

  return csvRows.join('\n')
}

/**
 * Import resources from CSV
 */
export async function importResourcesFromCSV(csvString: string): Promise<ImportResult> {
  const rows = parseCSV(csvString)
  const result: ImportResult = {
    success: true,
    imported: 0,
    failed: 0,
    errors: [],
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    try {
      // Parse tags and eligibility from comma-separated strings
      const tags = row.tags ? row.tags.split(';').map((t) => t.trim()) : []
      const eligibility = row.eligibility ? row.eligibility.split(';').map((e) => e.trim()) : []

      const resourceData = {
        type: row.type,
        title: row.title,
        description: row.description,
        url: row.url || undefined,
        state: row.state || undefined,
        tribeId: row.tribeId || undefined,
        tags,
        eligibility,
        source: row.source || 'CSV Import',
      }

      // Validate with schema
      const validated = ResourceSchema.parse(resourceData)

      // Create resource
      await prisma.resource.create({
        data: validated,
      })

      result.imported++
    } catch (error: any) {
      result.failed++
      result.errors.push({
        row: i + 2, // +2 because of header and 0-index
        error: error.message || 'Unknown error',
      })
    }
  }

  result.success = result.failed === 0

  return result
}

/**
 * Import scholarships from CSV
 */
export async function importScholarshipsFromCSV(csvString: string): Promise<ImportResult> {
  const rows = parseCSV(csvString)
  const result: ImportResult = {
    success: true,
    imported: 0,
    failed: 0,
    errors: [],
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    try {
      const tags = row.tags ? row.tags.split(';').map((t) => t.trim()) : []
      const eligibility = row.eligibility ? row.eligibility.split(';').map((e) => e.trim()) : []

      const scholarshipData = {
        name: row.name,
        amount: row.amount || undefined,
        deadline: row.deadline ? new Date(row.deadline) : undefined,
        description: row.description,
        url: row.url || undefined,
        tags,
        eligibility,
        source: row.source || 'CSV Import',
      }

      const validated = ScholarshipSchema.parse(scholarshipData)

      await prisma.scholarship.create({
        data: validated,
      })

      result.imported++
    } catch (error: any) {
      result.failed++
      result.errors.push({
        row: i + 2,
        error: error.message || 'Unknown error',
      })
    }
  }

  result.success = result.failed === 0

  return result
}

/**
 * Export resources to CSV
 */
export async function exportResourcesToCSV(): Promise<string> {
  const resources = await prisma.resource.findMany({
    where: { deletedAt: null },
    include: { tribe: true },
  })

  const data = resources.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    description: r.description,
    url: r.url || '',
    state: r.state || '',
    tribe: r.tribe?.name || '',
    tribeId: r.tribeId || '',
    tags: r.tags.join(';'),
    eligibility: r.eligibility.join(';'),
    source: r.source || '',
    createdAt: r.createdAt.toISOString(),
  }))

  return toCSV(data)
}

/**
 * Export scholarships to CSV
 */
export async function exportScholarshipsToCSV(): Promise<string> {
  const scholarships = await prisma.scholarship.findMany({
    where: { deletedAt: null },
  })

  const data = scholarships.map((s) => ({
    id: s.id,
    name: s.name,
    amount: s.amount || '',
    deadline: s.deadline ? s.deadline.toISOString() : '',
    description: s.description,
    url: s.url || '',
    tags: s.tags.join(';'),
    eligibility: s.eligibility.join(';'),
    source: s.source || '',
    createdAt: s.createdAt.toISOString(),
  }))

  return toCSV(data)
}

/**
 * Export tribes to CSV
 */
export async function exportTribesToCSV(): Promise<string> {
  const tribes = await prisma.tribe.findMany({
    where: { deletedAt: null },
  })

  const data = tribes.map((t) => ({
    id: t.id,
    name: t.name,
    federalRecognitionStatus: t.federalRecognitionStatus || '',
    website: t.website || '',
    languageLinks: t.languageLinks.join(';'),
    enrollmentOffice: t.enrollmentOffice || '',
    region: t.region || '',
  }))

  return toCSV(data)
}
