import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { apiRateLimiter, adminRateLimiter, strictRateLimiter, addRateLimitHeaders } from './rateLimit'
import { requireAuth, requireAdmin } from './auth'
import { requireCSRFToken } from './csrf'

/**
 * Configuration options for API middleware
 */
export interface ApiMiddlewareOptions {
  /** Require authentication */
  auth?: boolean
  /** Require admin role */
  admin?: boolean
  /** Require CSRF token validation */
  csrf?: boolean
  /** Rate limiting type */
  rateLimit?: 'api' | 'admin' | 'strict' | 'none'
  /** Custom rate limit (overrides default) */
  customRateLimit?: number
  /** Zod schema for request body validation */
  bodySchema?: z.ZodSchema
  /** Zod schema for query params validation */
  querySchema?: z.ZodSchema
}

/**
 * Context object passed to the route handler
 */
export interface ApiContext<TBody = any, TQuery = any> {
  /** Authenticated user (if auth is required) */
  user?: {
    id: string
    email: string
    role: string
    tribeId: string | null
    state: string | null
    deletedAt: Date | null
  }
  /** Validated request body */
  body?: TBody
  /** Validated query parameters */
  query?: TQuery
  /** Rate limit result for adding headers */
  rateLimit?: {
    remaining: number
    reset: number
  }
}

/**
 * Result from the route handler
 */
export type ApiHandlerResult = NextResponse | { data: any; status?: number } | any

/**
 * Route handler function signature
 */
export type ApiHandler<TBody = any, TQuery = any> = (
  request: NextRequest,
  context: ApiContext<TBody, TQuery>,
  params?: any
) => Promise<ApiHandlerResult>

/**
 * Creates a standardized API handler with common middleware applied
 *
 * @example
 * ```typescript
 * export const GET = withApiMiddleware(
 *   async (request, { user, query }) => {
 *     return { data: { message: 'Hello!', user } }
 *   },
 *   { auth: true, querySchema: MyQuerySchema }
 * )
 * ```
 */
export function withApiMiddleware<TBody = any, TQuery = any>(
  handler: ApiHandler<TBody, TQuery>,
  options: ApiMiddlewareOptions = {}
): (request: NextRequest, ...args: any[]) => Promise<NextResponse> {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const context: ApiContext<TBody, TQuery> = {}

    try {
      // 1. Rate Limiting
      if (options.rateLimit !== 'none') {
        const limiterType = options.rateLimit || 'api'
        const limiter =
          limiterType === 'admin'
            ? adminRateLimiter
            : limiterType === 'strict'
            ? strictRateLimiter
            : apiRateLimiter

        const rateLimitResult = await limiter.check(
          request,
          options.customRateLimit
        )

        if (!rateLimitResult.success) {
          const headers = new Headers()
          addRateLimitHeaders(headers, rateLimitResult)
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429, headers }
          )
        }

        context.rateLimit = {
          remaining: rateLimitResult.remaining,
          reset: rateLimitResult.reset,
        }
      }

      // 2. CSRF Token Validation (for all state-changing methods)
      if (options.csrf && (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH' || request.method === 'DELETE')) {
        const csrfCheck = requireCSRFToken(request)
        if (!csrfCheck.valid) {
          return NextResponse.json({ error: csrfCheck.error }, { status: 403 })
        }
      }

      // 3. Authentication
      if (options.admin) {
        context.user = await requireAdmin(request)
      } else if (options.auth) {
        context.user = await requireAuth(request)
      }

      // 4. Body Validation
      if (options.bodySchema && (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH')) {
        try {
          const rawBody = await request.json()
          context.body = options.bodySchema.parse(rawBody)
        } catch (error) {
          if (error instanceof ZodError) {
            return NextResponse.json(
              { error: 'Invalid request body', details: error.errors },
              { status: 400 }
            )
          }
          throw error
        }
      }

      // 5. Query Parameter Validation
      if (options.querySchema) {
        const searchParams = request.nextUrl.searchParams
        const queryObject: any = {}
        searchParams.forEach((value, key) => {
          queryObject[key] = value
        })

        try {
          context.query = options.querySchema.parse(queryObject)
        } catch (error) {
          if (error instanceof ZodError) {
            return NextResponse.json(
              { error: 'Invalid query parameters', details: error.errors },
              { status: 400 }
            )
          }
          throw error
        }
      }

      // 6. Execute Handler
      const result = await handler(request, context, args[0])

      // 7. Format Response
      if (result instanceof NextResponse) {
        // Handler returned a NextResponse directly
        if (context.rateLimit) {
          addRateLimitHeaders(result.headers, context.rateLimit)
        }
        return result
      }

      // Handler returned data object
      const responseData = result?.data !== undefined ? result.data : result
      const status = result?.status || 200
      const headers = new Headers()

      if (context.rateLimit) {
        addRateLimitHeaders(headers, context.rateLimit)
      }

      return NextResponse.json(responseData, { status, headers })
    } catch (error) {
      // 8. Error Handling
      console.error('API error:', error)

      // Auth errors
      if (error instanceof Error) {
        if (error.message === 'Unauthorized') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        if (error.message.includes('Forbidden') || error.message.includes('Admin')) {
          return NextResponse.json(
            { error: 'Forbidden - Insufficient permissions' },
            { status: 403 }
          )
        }
      }

      // Validation errors
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        )
      }

      // Generic error
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Shorthand for creating an authenticated API handler
 */
export function withAuth<TBody = any, TQuery = any>(
  handler: ApiHandler<TBody, TQuery>,
  options: Omit<ApiMiddlewareOptions, 'auth'> = {}
) {
  return withApiMiddleware(handler, { ...options, auth: true })
}

/**
 * Shorthand for creating an admin-only API handler
 */
export function withAdmin<TBody = any, TQuery = any>(
  handler: ApiHandler<TBody, TQuery>,
  options: Omit<ApiMiddlewareOptions, 'auth' | 'admin'> = {}
) {
  return withApiMiddleware(handler, { ...options, admin: true })
}
