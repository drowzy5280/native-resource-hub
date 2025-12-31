/**
 * Centralized Admin Middleware
 * Provides consistent authentication, authorization, CSRF protection,
 * and rate limiting for all admin routes.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError, ZodSchema } from 'zod'
import { adminRateLimiter, addRateLimitHeaders } from './rateLimit'
import { requireAdmin } from './auth'
import { requireCSRFToken } from './csrf'
import { logger } from './logger'

/**
 * Admin user context from authentication
 */
export interface AdminUser {
  id: string
  email: string
  role: string
  tribeId: string | null
  state: string | null
  deletedAt: Date | null
}

/**
 * Context passed to admin route handlers
 */
export interface AdminContext<TBody = unknown, TQuery = unknown> {
  user: AdminUser
  body?: TBody
  query?: TQuery
  rateLimit?: {
    remaining: number
    reset: number
  }
}

/**
 * Options for admin middleware
 */
export interface AdminMiddlewareOptions<TBody = unknown, TQuery = unknown> {
  /** Zod schema for request body validation */
  bodySchema?: ZodSchema<TBody>
  /** Zod schema for query params validation */
  querySchema?: ZodSchema<TQuery>
  /** Skip CSRF validation (use sparingly, only for GET requests) */
  skipCSRF?: boolean
  /** Custom rate limit (overrides default 30/min) */
  rateLimit?: number
  /** Skip rate limiting entirely */
  skipRateLimit?: boolean
  /** Operation name for logging */
  operation?: string
}

/**
 * Admin route handler function signature
 */
export type AdminHandler<TBody = unknown, TQuery = unknown> = (
  request: NextRequest,
  context: AdminContext<TBody, TQuery>
) => Promise<NextResponse | { data: unknown; status?: number }>

/**
 * Creates a standardized admin API handler with all security middleware applied
 *
 * Features:
 * - Rate limiting (30 req/min by default)
 * - CSRF token validation (for mutations)
 * - Admin role verification
 * - Request body/query validation
 * - Structured logging
 * - Consistent error handling
 *
 * @example
 * ```typescript
 * export const POST = withAdminMiddleware(
 *   async (request, { user, body }) => {
 *     const resource = await prisma.resource.create({ data: body })
 *     return { data: resource, status: 201 }
 *   },
 *   {
 *     bodySchema: ResourceCreateSchema,
 *     operation: 'create-resource'
 *   }
 * )
 * ```
 */
export function withAdminMiddleware<TBody = unknown, TQuery = unknown>(
  handler: AdminHandler<TBody, TQuery>,
  options: AdminMiddlewareOptions<TBody, TQuery> = {}
): (request: NextRequest, ...args: unknown[]) => Promise<NextResponse> {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now()
    const operation = options.operation || 'admin-operation'

    try {
      // 1. Rate Limiting
      if (!options.skipRateLimit) {
        const rateLimitResult = await adminRateLimiter.check(request, options.rateLimit)

        if (!rateLimitResult.success) {
          logger.warn('Admin rate limit exceeded', {
            operation,
            ip: request.headers.get('x-forwarded-for') || 'unknown',
          })

          const headers = new Headers()
          addRateLimitHeaders(headers, rateLimitResult)
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429, headers }
          )
        }
      }

      // 2. CSRF Token Validation (for all mutations)
      const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)
      if (isMutation && !options.skipCSRF) {
        const csrfCheck = requireCSRFToken(request)
        if (!csrfCheck.valid) {
          logger.warn('CSRF validation failed', {
            operation,
            error: csrfCheck.error,
          })
          return NextResponse.json({ error: csrfCheck.error }, { status: 403 })
        }
      }

      // 3. Admin Authentication & Authorization
      let user: AdminUser
      try {
        user = await requireAdmin(request)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unauthorized'
        logger.warn('Admin authentication failed', {
          operation,
          error: message,
        })

        if (message === 'Unauthorized') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json(
          { error: 'Forbidden - Admin access required' },
          { status: 403 }
        )
      }

      const context: AdminContext<TBody, TQuery> = { user }

      // 4. Body Validation
      if (options.bodySchema && isMutation) {
        try {
          const rawBody = await request.json()
          context.body = options.bodySchema.parse(rawBody)
        } catch (error) {
          if (error instanceof ZodError) {
            logger.info('Admin request validation failed', {
              operation,
              errors: error.errors,
            })
            return NextResponse.json(
              { error: 'Invalid request body', details: error.errors },
              { status: 400 }
            )
          }
          if (error instanceof SyntaxError) {
            return NextResponse.json(
              { error: 'Invalid JSON in request body' },
              { status: 400 }
            )
          }
          throw error
        }
      }

      // 5. Query Parameter Validation
      if (options.querySchema) {
        const searchParams = request.nextUrl.searchParams
        const queryObject: Record<string, string> = {}
        searchParams.forEach((value, key) => {
          queryObject[key] = value
        })

        try {
          context.query = options.querySchema.parse(queryObject)
        } catch (error) {
          if (error instanceof ZodError) {
            logger.info('Admin query validation failed', {
              operation,
              errors: error.errors,
            })
            return NextResponse.json(
              { error: 'Invalid query parameters', details: error.errors },
              { status: 400 }
            )
          }
          throw error
        }
      }

      // 6. Execute Handler
      logger.info('Admin operation started', {
        operation,
        userId: user.id,
        method: request.method,
      })

      const result = await handler(request, context)

      // 7. Format Response
      const duration = Date.now() - startTime

      if (result instanceof NextResponse) {
        logger.info('Admin operation completed', {
          operation,
          userId: user.id,
          duration,
        })
        return result
      }

      const responseData = result?.data !== undefined ? result.data : result
      const status = result?.status || 200

      logger.info('Admin operation completed', {
        operation,
        userId: user.id,
        status,
        duration,
      })

      return NextResponse.json(responseData, { status })
    } catch (error) {
      // 8. Error Handling
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      logger.error('Admin operation failed', {
        operation,
        error: errorMessage,
        duration,
      })

      // Validation errors
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        )
      }

      // Generic error (don't expose internal details)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Shorthand for GET admin routes (no CSRF, rate limited)
 */
export function withAdminGet<TQuery = unknown>(
  handler: AdminHandler<unknown, TQuery>,
  options: Omit<AdminMiddlewareOptions<unknown, TQuery>, 'bodySchema' | 'skipCSRF'> = {}
) {
  return withAdminMiddleware(handler, { ...options, skipCSRF: true })
}

/**
 * Shorthand for POST admin routes (full validation)
 */
export function withAdminPost<TBody = unknown>(
  handler: AdminHandler<TBody, unknown>,
  options: Omit<AdminMiddlewareOptions<TBody, unknown>, 'querySchema'> = {}
) {
  return withAdminMiddleware(handler, options)
}

/**
 * Shorthand for bulk operations with higher rate limit
 */
export function withAdminBulk<TBody = unknown>(
  handler: AdminHandler<TBody, unknown>,
  options: Omit<AdminMiddlewareOptions<TBody, unknown>, 'rateLimit'> = {}
) {
  return withAdminMiddleware(handler, { ...options, rateLimit: 10 }) // Lower rate for bulk ops
}
