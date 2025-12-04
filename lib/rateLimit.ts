import { NextRequest } from 'next/server'
import { env } from './env'

// Upstash Redis rate limiter (for production/serverless)
let upstashRateLimiter: any = null

// Check if Upstash is configured
const hasUpstashConfig = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN

if (hasUpstashConfig) {
  // Dynamically import Upstash packages only if configured
  import('@upstash/ratelimit').then(({ Ratelimit }) => {
    import('@upstash/redis').then(({ Redis }) => {
      const redis = new Redis({
        url: env.UPSTASH_REDIS_REST_URL!,
        token: env.UPSTASH_REDIS_REST_TOKEN!,
      })

      // Create configured rate limiters
      upstashRateLimiter = {
        api: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
          analytics: true,
        }),
        strict: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
          analytics: true,
        }),
        admin: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(30, '1 m'), // 30 requests per minute
          analytics: true,
        }),
      }
    })
  })
}

// ===== IN-MEMORY RATE LIMITER (Fallback for development) =====

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 5 * 60 * 1000)

interface RateLimitOptions {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

class InMemoryRateLimiter {
  private interval: number
  private uniqueTokenPerInterval: number

  constructor(options: RateLimitOptions) {
    this.interval = options.interval
    this.uniqueTokenPerInterval = options.uniqueTokenPerInterval
  }

  async check(request: NextRequest, limit?: number): Promise<{ success: boolean; remaining: number; reset: number }> {
    const identifier = this.getIdentifier(request)
    const now = Date.now()
    const maxRequests = limit || this.uniqueTokenPerInterval

    if (!store[identifier] || store[identifier].resetTime < now) {
      // New window
      store[identifier] = {
        count: 1,
        resetTime: now + this.interval,
      }
      return {
        success: true,
        remaining: maxRequests - 1,
        reset: store[identifier].resetTime,
      }
    }

    // Existing window
    store[identifier].count++

    if (store[identifier].count > maxRequests) {
      return {
        success: false,
        remaining: 0,
        reset: store[identifier].resetTime,
      }
    }

    return {
      success: true,
      remaining: maxRequests - store[identifier].count,
      reset: store[identifier].resetTime,
    }
  }

  private getIdentifier(request: NextRequest): string {
    // Try to get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')

    const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'

    // Add user agent to make identifier more unique
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const hash = this.simpleHash(`${ip}-${userAgent}`)

    return hash
  }

  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString()
  }
}

// ===== UNIFIED RATE LIMITER CLASS =====

export class RateLimiter {
  private inMemoryLimiter: InMemoryRateLimiter
  private upstashKey: 'api' | 'strict' | 'admin'

  constructor(options: RateLimitOptions, upstashKey: 'api' | 'strict' | 'admin' = 'api') {
    this.inMemoryLimiter = new InMemoryRateLimiter(options)
    this.upstashKey = upstashKey
  }

  async check(request: NextRequest, limit?: number): Promise<{ success: boolean; remaining: number; reset: number }> {
    // Use Upstash if configured, otherwise fall back to in-memory
    if (hasUpstashConfig && upstashRateLimiter) {
      const identifier = this.getIdentifier(request)
      const result = await upstashRateLimiter[this.upstashKey].limit(identifier)

      return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
      }
    }

    // Fallback to in-memory rate limiter
    return this.inMemoryLimiter.check(request, limit)
  }

  private getIdentifier(request: NextRequest): string {
    // Try to get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')

    const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'

    // Add user agent to make identifier more unique
    const userAgent = request.headers.get('user-agent') || 'unknown'

    return `${ip}-${userAgent}`
  }
}

// Pre-configured rate limiters
export const apiRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 60, // 60 requests per minute
}, 'api')

export const strictRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 10, // 10 requests per minute (for sensitive endpoints)
}, 'strict')

export const adminRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 30, // 30 requests per minute for admin
}, 'admin')

// Helper function to add rate limit headers to response
export function addRateLimitHeaders(
  headers: Headers,
  result: { remaining: number; reset: number }
): Headers {
  headers.set('X-RateLimit-Remaining', result.remaining.toString())
  headers.set('X-RateLimit-Reset', result.reset.toString())
  return headers
}
