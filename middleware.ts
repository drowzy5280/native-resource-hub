import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit } from './lib/rate-limit'

// Rate limiters for different route types
const apiRateLimit = rateLimit({
  maxRequests: 60,
  windowMs: 60000, // 1 minute
})

const adminRateLimit = rateLimit({
  maxRequests: 30,
  windowMs: 60000, // 1 minute
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    // More strict rate limiting for admin routes
    if (pathname.startsWith('/api/admin/')) {
      if (!adminRateLimit(request)) {
        return NextResponse.json(
          { error: 'Too many requests - Please try again later' },
          { status: 429 }
        )
      }
    } else if (!pathname.startsWith('/api/health') && !pathname.startsWith('/api/cron/')) {
      // Standard rate limiting for other API routes (except health checks and cron)
      if (!apiRateLimit(request)) {
        return NextResponse.json(
          { error: 'Too many requests - Please try again later' },
          { status: 429 }
        )
      }
    }
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

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
