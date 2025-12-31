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
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Content Security Policy (aligned with next.config.js)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://vercel.com https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://adservice.google.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;
    frame-ancestors 'self';
    upgrade-insecure-requests;
    connect-src 'self' https://vercel.live https://*.supabase.co https://www.google-analytics.com https://pagead2.googlesyndication.com;
  `.replace(/\s{2,}/g, ' ').trim()

  response.headers.set('Content-Security-Policy', cspHeader)

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
