import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apiRateLimiter, adminRateLimiter, addRateLimitHeaders } from './lib/rateLimit'

// Generate unique request ID
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Generate unique request ID for tracing
  const requestId = generateRequestId()

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    // More strict rate limiting for admin routes
    if (pathname.startsWith('/api/admin/')) {
      const result = await adminRateLimiter.check(request)
      if (!result.success) {
        const response = NextResponse.json(
          { error: 'Too many requests - Please try again later' },
          { status: 429 }
        )
        addRateLimitHeaders(response.headers, result)
        return response
      }
    } else if (!pathname.startsWith('/api/health') && !pathname.startsWith('/api/cron/')) {
      // Standard rate limiting for other API routes (except health checks and cron)
      const result = await apiRateLimiter.check(request)
      if (!result.success) {
        const response = NextResponse.json(
          { error: 'Too many requests - Please try again later' },
          { status: 429 }
        )
        addRateLimitHeaders(response.headers, result)
        return response
      }
    }
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Add request ID for tracing
  response.headers.set('X-Request-ID', requestId)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
