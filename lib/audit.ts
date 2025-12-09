/**
 * Audit logging system for tracking admin actions and security events
 */

import { prisma } from '@/lib/prisma'

export type AuditAction =
  | 'resource.create'
  | 'resource.update'
  | 'resource.delete'
  | 'scholarship.create'
  | 'scholarship.update'
  | 'scholarship.delete'
  | 'tribe.create'
  | 'tribe.update'
  | 'tribe.delete'
  | 'user.login'
  | 'user.logout'
  | 'user.role_change'
  | 'admin.import'
  | 'admin.export'
  | 'report.resolve'
  | 'report.dismiss'
  | 'security.rate_limit_exceeded'
  | 'security.invalid_csrf'
  | 'security.unauthorized_access'

export interface AuditLogEntry {
  action: AuditAction
  userId?: string
  userEmail?: string
  resourceType?: string
  resourceId?: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

/**
 * Log an audit event
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    // For now, we'll log to the ChangeLog table with a special type
    // In production, you might want a dedicated AuditLog table
    await prisma.changeLog.create({
      data: {
        type: `audit:${entry.action}`,
        source: entry.userEmail || entry.userId || 'system',
        originalValue: entry.resourceId || null,
        updatedValue: JSON.stringify({
          resourceType: entry.resourceType,
          details: entry.details,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          timestamp: new Date().toISOString(),
        }),
        aiConfidence: null,
        approved: true, // Audit logs are always "approved" (recorded)
      },
    })
  } catch (error) {
    // Don't throw - audit logging should not break the main flow
    console.error('Failed to log audit event:', error, entry)
  }
}

/**
 * Helper to extract client info from request
 */
export function getClientInfo(request: Request): { ipAddress: string; userAgent: string } {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  return { ipAddress, userAgent }
}

/**
 * Log admin action
 */
export async function logAdminAction(
  action: AuditAction,
  request: Request,
  details: {
    userId?: string
    userEmail?: string
    resourceType?: string
    resourceId?: string
    additionalInfo?: Record<string, unknown>
  }
): Promise<void> {
  const { ipAddress, userAgent } = getClientInfo(request)

  await logAuditEvent({
    action,
    userId: details.userId,
    userEmail: details.userEmail,
    resourceType: details.resourceType,
    resourceId: details.resourceId,
    details: details.additionalInfo,
    ipAddress,
    userAgent,
  })
}

/**
 * Log security event
 */
export async function logSecurityEvent(
  action: 'security.rate_limit_exceeded' | 'security.invalid_csrf' | 'security.unauthorized_access',
  request: Request,
  details?: Record<string, unknown>
): Promise<void> {
  const { ipAddress, userAgent } = getClientInfo(request)

  await logAuditEvent({
    action,
    details: {
      ...details,
      path: new URL(request.url).pathname,
      method: request.method,
    },
    ipAddress,
    userAgent,
  })
}

/**
 * Get recent audit logs (for admin dashboard)
 */
export async function getRecentAuditLogs(limit = 50): Promise<Array<{
  id: string
  action: string
  actor: string
  details: unknown
  createdAt: Date
}>> {
  const logs = await prisma.changeLog.findMany({
    where: {
      type: {
        startsWith: 'audit:',
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    select: {
      id: true,
      type: true,
      source: true,
      updatedValue: true,
      createdAt: true,
    },
  })

  return logs.map((log) => ({
    id: log.id,
    action: log.type.replace('audit:', ''),
    actor: log.source || 'unknown',
    details: log.updatedValue ? JSON.parse(log.updatedValue) : null,
    createdAt: log.createdAt,
  }))
}
