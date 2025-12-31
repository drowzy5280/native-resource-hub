/**
 * Bulk Operations API
 * Handles bulk update and delete operations for admin users
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withAdminMiddleware } from '@/lib/admin-middleware'
import { logger } from '@/lib/logger'
import { revalidateTag } from 'next/cache'

// Schema for bulk operations
const BulkOperationSchema = z.object({
  entity: z.enum(['resources', 'scholarships', 'grants', 'tribes']),
  operation: z.enum(['update', 'delete', 'softDelete', 'restore']),
  ids: z.array(z.string().uuid()).min(1).max(100), // Max 100 items per request
  data: z.record(z.unknown()).optional(), // For update operations
})

type BulkOperation = z.infer<typeof BulkOperationSchema>

/**
 * POST /api/admin/bulk
 * Perform bulk operations on entities
 */
export const POST = withAdminMiddleware(
  async (request, { user, body }) => {
    const { entity, operation, ids, data } = body as BulkOperation

    logger.adminOperation(`bulk-${operation}`, user.id, {
      entity,
      count: ids.length,
    })

    let result: { success: number; failed: number; errors: string[] }

    switch (operation) {
      case 'delete':
        result = await handleBulkDelete(entity, ids)
        break
      case 'softDelete':
        result = await handleBulkSoftDelete(entity, ids)
        break
      case 'restore':
        result = await handleBulkRestore(entity, ids)
        break
      case 'update':
        if (!data) {
          return NextResponse.json(
            { error: 'Data is required for update operation' },
            { status: 400 }
          )
        }
        result = await handleBulkUpdate(entity, ids, data)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        )
    }

    // Revalidate cache tags
    revalidateTag(entity)

    return {
      data: {
        operation,
        entity,
        ...result,
      },
      status: 200,
    }
  },
  {
    bodySchema: BulkOperationSchema,
    operation: 'bulk-operation',
    rateLimit: 10, // Lower rate limit for bulk operations
  }
)

async function handleBulkDelete(
  entity: BulkOperation['entity'],
  ids: string[]
): Promise<{ success: number; failed: number; errors: string[] }> {
  const errors: string[] = []
  let success = 0
  let failed = 0

  // Use transaction for atomicity
  try {
    await prisma.$transaction(async (tx) => {
      switch (entity) {
        case 'resources':
          const resourceResult = await tx.resource.deleteMany({
            where: { id: { in: ids } },
          })
          success = resourceResult.count
          failed = ids.length - success
          break
        case 'scholarships':
          const scholarshipResult = await tx.scholarship.deleteMany({
            where: { id: { in: ids } },
          })
          success = scholarshipResult.count
          failed = ids.length - success
          break
        case 'grants':
          const grantResult = await tx.grant.deleteMany({
            where: { id: { in: ids } },
          })
          success = grantResult.count
          failed = ids.length - success
          break
        case 'tribes':
          const tribeResult = await tx.tribe.deleteMany({
            where: { id: { in: ids } },
          })
          success = tribeResult.count
          failed = ids.length - success
          break
      }
    })
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error')
    failed = ids.length
  }

  return { success, failed, errors }
}

async function handleBulkSoftDelete(
  entity: BulkOperation['entity'],
  ids: string[]
): Promise<{ success: number; failed: number; errors: string[] }> {
  const errors: string[] = []
  let success = 0
  let failed = 0

  try {
    await prisma.$transaction(async (tx) => {
      const now = new Date()

      switch (entity) {
        case 'resources':
          const resourceResult = await tx.resource.updateMany({
            where: { id: { in: ids }, deletedAt: null },
            data: { deletedAt: now },
          })
          success = resourceResult.count
          failed = ids.length - success
          break
        case 'scholarships':
          const scholarshipResult = await tx.scholarship.updateMany({
            where: { id: { in: ids }, deletedAt: null },
            data: { deletedAt: now },
          })
          success = scholarshipResult.count
          failed = ids.length - success
          break
        case 'grants':
          const grantResult = await tx.grant.updateMany({
            where: { id: { in: ids }, deletedAt: null },
            data: { deletedAt: now },
          })
          success = grantResult.count
          failed = ids.length - success
          break
        case 'tribes':
          const tribeResult = await tx.tribe.updateMany({
            where: { id: { in: ids }, deletedAt: null },
            data: { deletedAt: now },
          })
          success = tribeResult.count
          failed = ids.length - success
          break
      }
    })
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error')
    failed = ids.length
  }

  return { success, failed, errors }
}

async function handleBulkRestore(
  entity: BulkOperation['entity'],
  ids: string[]
): Promise<{ success: number; failed: number; errors: string[] }> {
  const errors: string[] = []
  let success = 0
  let failed = 0

  try {
    await prisma.$transaction(async (tx) => {
      switch (entity) {
        case 'resources':
          const resourceResult = await tx.resource.updateMany({
            where: { id: { in: ids }, deletedAt: { not: null } },
            data: { deletedAt: null },
          })
          success = resourceResult.count
          failed = ids.length - success
          break
        case 'scholarships':
          const scholarshipResult = await tx.scholarship.updateMany({
            where: { id: { in: ids }, deletedAt: { not: null } },
            data: { deletedAt: null },
          })
          success = scholarshipResult.count
          failed = ids.length - success
          break
        case 'grants':
          const grantResult = await tx.grant.updateMany({
            where: { id: { in: ids }, deletedAt: { not: null } },
            data: { deletedAt: null },
          })
          success = grantResult.count
          failed = ids.length - success
          break
        case 'tribes':
          const tribeResult = await tx.tribe.updateMany({
            where: { id: { in: ids }, deletedAt: { not: null } },
            data: { deletedAt: null },
          })
          success = tribeResult.count
          failed = ids.length - success
          break
      }
    })
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error')
    failed = ids.length
  }

  return { success, failed, errors }
}

async function handleBulkUpdate(
  entity: BulkOperation['entity'],
  ids: string[],
  data: Record<string, unknown>
): Promise<{ success: number; failed: number; errors: string[] }> {
  const errors: string[] = []
  let success = 0
  let failed = 0

  // Sanitize data - remove id and system fields
  const sanitizedData = { ...data }
  delete sanitizedData.id
  delete sanitizedData.createdAt
  delete sanitizedData.updatedAt
  delete sanitizedData.deletedAt

  try {
    await prisma.$transaction(async (tx) => {
      switch (entity) {
        case 'resources':
          const resourceResult = await tx.resource.updateMany({
            where: { id: { in: ids }, deletedAt: null },
            data: sanitizedData as any,
          })
          success = resourceResult.count
          failed = ids.length - success
          break
        case 'scholarships':
          const scholarshipResult = await tx.scholarship.updateMany({
            where: { id: { in: ids }, deletedAt: null },
            data: sanitizedData as any,
          })
          success = scholarshipResult.count
          failed = ids.length - success
          break
        case 'grants':
          const grantResult = await tx.grant.updateMany({
            where: { id: { in: ids }, deletedAt: null },
            data: sanitizedData as any,
          })
          success = grantResult.count
          failed = ids.length - success
          break
        case 'tribes':
          const tribeResult = await tx.tribe.updateMany({
            where: { id: { in: ids }, deletedAt: null },
            data: sanitizedData as any,
          })
          success = tribeResult.count
          failed = ids.length - success
          break
      }
    })
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error')
    failed = ids.length
  }

  return { success, failed, errors }
}
