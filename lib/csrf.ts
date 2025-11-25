/**
 * CSRF Protection utilities
 * Implements token-based CSRF protection for mutation endpoints
 */

import { randomBytes, createHmac } from 'crypto'
import { env } from './env'

const CSRF_SECRET = env.CSRF_SECRET
const TOKEN_LIFETIME = 60 * 60 * 1000 // 1 hour

interface CSRFToken {
  value: string
  timestamp: number
}

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const timestamp = Date.now()
  const randomValue = randomBytes(32).toString('hex')
  const signature = createHmac('sha256', CSRF_SECRET)
    .update(`${randomValue}:${timestamp}`)
    .digest('hex')

  const token: CSRFToken = {
    value: randomValue,
    timestamp,
  }

  return Buffer.from(`${token.value}:${token.timestamp}:${signature}`).toString('base64')
}

/**
 * Verify a CSRF token
 */
export function verifyCSRFToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [value, timestampStr, signature] = decoded.split(':')
    const timestamp = parseInt(timestampStr, 10)

    // Check if token has expired
    if (Date.now() - timestamp > TOKEN_LIFETIME) {
      return false
    }

    // Verify signature
    const expectedSignature = createHmac('sha256', CSRF_SECRET)
      .update(`${value}:${timestamp}`)
      .digest('hex')

    return signature === expectedSignature
  } catch (error) {
    return false
  }
}

/**
 * Middleware helper for CSRF protection
 */
export function requireCSRFToken(request: Request): { valid: boolean; error?: string } {
  const token = request.headers.get('x-csrf-token')

  if (!token) {
    return { valid: false, error: 'CSRF token missing' }
  }

  if (!verifyCSRFToken(token)) {
    return { valid: false, error: 'Invalid or expired CSRF token' }
  }

  return { valid: true }
}
