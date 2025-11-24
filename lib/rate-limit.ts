import { NextRequest } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// Simple in-memory rate limiter (for production, use Redis or similar)
const store: RateLimitStore = {}

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export function rateLimit(config: RateLimitConfig) {
  return (request: NextRequest): boolean => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const key = `${ip}-${request.nextUrl.pathname}`

    const now = Date.now()
    const record = store[key]

    if (!record || now > record.resetTime) {
      // Create new record or reset expired one
      store[key] = {
        count: 1,
        resetTime: now + config.windowMs,
      }
      return true
    }

    if (record.count >= config.maxRequests) {
      // Rate limit exceeded
      return false
    }

    // Increment count
    record.count++
    return true
  }
}

export function getRateLimitHeaders(key: string): Record<string, string> {
  const record = store[key]
  if (!record) {
    return {}
  }

  const remaining = Math.max(0, 60 - record.count)
  const resetTime = Math.ceil(record.resetTime / 1000)

  return {
    'X-RateLimit-Limit': '60',
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime.toString(),
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}, 60000) // Clean up every minute
