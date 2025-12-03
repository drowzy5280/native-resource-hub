/**
 * Full-text search utilities using PostgreSQL pg_trgm and tsvector
 */

import { prisma } from './prisma'
import { Prisma } from '@prisma/client'

export interface SearchOptions {
  limit?: number
  offset?: number
  minSimilarity?: number // Threshold for trigram similarity (0-1)
  useFullTextSearch?: boolean // Use tsvector full-text search
}

export interface SearchResult<T> {
  item: T
  similarity?: number
  rank?: number
}

/**
 * Search resources using full-text search
 */
export async function searchResources(
  query: string,
  options: SearchOptions = {}
) {
  const {
    limit = 20,
    offset = 0,
    minSimilarity = 0.3,
    useFullTextSearch = true,
  } = options

  const searchTerm = query.trim()

  if (!searchTerm) {
    return []
  }

  if (useFullTextSearch) {
    // Use tsvector full-text search (faster, better for exact words)
    const results = await prisma.$queryRaw<
      Array<{
        id: string
        type: string
        title: string
        description: string
        url: string | null
        eligibility: string[]
        tags: string[]
        state: string | null
        tribeId: string | null
        createdAt: Date
        rank: number
      }>
    >`
      SELECT
        r.*,
        ts_rank(r.search_vector, plainto_tsquery('english', ${searchTerm})) as rank
      FROM "Resource" r
      WHERE
        r."deletedAt" IS NULL
        AND r.search_vector @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY rank DESC, r."createdAt" DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    return results.map((r) => ({
      item: r,
      rank: r.rank,
    }))
  } else {
    // Use trigram similarity (better for fuzzy/typo matching)
    const results = await prisma.$queryRaw<
      Array<{
        id: string
        type: string
        title: string
        description: string
        url: string | null
        eligibility: string[]
        tags: string[]
        state: string | null
        tribeId: string | null
        createdAt: Date
        similarity: number
      }>
    >`
      SELECT
        r.*,
        GREATEST(
          similarity(r.title, ${searchTerm}),
          similarity(r.description, ${searchTerm})
        ) as similarity
      FROM "Resource" r
      WHERE
        r."deletedAt" IS NULL
        AND (r.title % ${searchTerm} OR r.description % ${searchTerm})
      ORDER BY similarity DESC, r."createdAt" DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    return results
      .filter((r) => r.similarity >= minSimilarity)
      .map((r) => ({
        item: r,
        similarity: r.similarity,
      }))
  }
}

/**
 * Search scholarships using full-text search
 */
export async function searchScholarships(
  query: string,
  options: SearchOptions = {}
) {
  const {
    limit = 20,
    offset = 0,
    minSimilarity = 0.3,
    useFullTextSearch = true,
  } = options

  const searchTerm = query.trim()

  if (!searchTerm) {
    return []
  }

  if (useFullTextSearch) {
    const results = await prisma.$queryRaw<
      Array<{
        id: string
        name: string
        amount: string | null
        deadline: Date | null
        description: string
        tags: string[]
        eligibility: string[]
        url: string | null
        createdAt: Date
        rank: number
      }>
    >`
      SELECT
        s.*,
        ts_rank(s.search_vector, plainto_tsquery('english', ${searchTerm})) as rank
      FROM "Scholarship" s
      WHERE
        s."deletedAt" IS NULL
        AND s.search_vector @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY rank DESC, s."createdAt" DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    return results.map((s) => ({
      item: s,
      rank: s.rank,
    }))
  } else {
    const results = await prisma.$queryRaw<
      Array<{
        id: string
        name: string
        amount: string | null
        deadline: Date | null
        description: string
        tags: string[]
        eligibility: string[]
        url: string | null
        createdAt: Date
        similarity: number
      }>
    >`
      SELECT
        s.*,
        GREATEST(
          similarity(s.name, ${searchTerm}),
          similarity(s.description, ${searchTerm})
        ) as similarity
      FROM "Scholarship" s
      WHERE
        s."deletedAt" IS NULL
        AND (s.name % ${searchTerm} OR s.description % ${searchTerm})
      ORDER BY similarity DESC, s."createdAt" DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    return results
      .filter((s) => s.similarity >= minSimilarity)
      .map((s) => ({
        item: s,
        similarity: s.similarity,
      }))
  }
}

/**
 * Search tribes using trigram similarity
 */
export async function searchTribes(query: string, options: SearchOptions = {}) {
  const { limit = 10, offset = 0, minSimilarity = 0.3 } = options

  const searchTerm = query.trim()

  if (!searchTerm) {
    return []
  }

  const results = await prisma.$queryRaw<
    Array<{
      id: string
      name: string
      federalRecognitionStatus: string | null
      website: string | null
      region: string | null
      similarity: number
    }>
  >`
    SELECT
      t.*,
      similarity(t.name, ${searchTerm}) as similarity
    FROM "Tribe" t
    WHERE
      t."deletedAt" IS NULL
      AND t.name % ${searchTerm}
    ORDER BY similarity DESC, t.name ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `

  return results
    .filter((t) => t.similarity >= minSimilarity)
    .map((t) => ({
      item: t,
      similarity: t.similarity,
    }))
}

/**
 * Universal search across all entities
 */
export async function universalSearch(
  query: string,
  options: SearchOptions = {}
) {
  const searchTerm = query.trim()

  if (!searchTerm) {
    return {
      resources: [],
      scholarships: [],
      tribes: [],
    }
  }

  const [resources, scholarships, tribes] = await Promise.all([
    searchResources(searchTerm, { ...options, limit: options.limit || 10 }),
    searchScholarships(searchTerm, { ...options, limit: options.limit || 10 }),
    searchTribes(searchTerm, { ...options, limit: options.limit || 5 }),
  ])

  return {
    resources,
    scholarships,
    tribes,
  }
}

/**
 * Get search suggestions based on partial input
 */
export async function getSearchSuggestions(
  query: string,
  limit: number = 8
): Promise<Array<{ text: string; type: 'resource' | 'scholarship' | 'tag' }>> {
  const searchTerm = query.trim().toLowerCase()

  if (searchTerm.length < 2) {
    return []
  }

  // Get suggestions using trigram similarity
  const [resources, scholarships] = await Promise.all([
    prisma.$queryRaw<Array<{ title: string }>>`
      SELECT DISTINCT title
      FROM "Resource"
      WHERE
        "deletedAt" IS NULL
        AND title % ${searchTerm}
      ORDER BY similarity(title, ${searchTerm}) DESC
      LIMIT 3
    `,
    prisma.$queryRaw<Array<{ name: string }>>`
      SELECT DISTINCT name
      FROM "Scholarship"
      WHERE
        "deletedAt" IS NULL
        AND name % ${searchTerm}
      ORDER BY similarity(name, ${searchTerm}) DESC
      LIMIT 3
    `,
  ])

  return [
    ...resources.map((r) => ({ text: r.title, type: 'resource' as const })),
    ...scholarships.map((s) => ({ text: s.name, type: 'scholarship' as const })),
  ].slice(0, limit)
}
