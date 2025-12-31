/**
 * CSRF Protection utilities
 * Implements token-based CSRF protection for mutation endpoints
 * with replay attack prevention via server-side token storage
 */

import { randomBytes, createHmac, timingSafeEqual } from 'crypto'
import { env } from './env'

const CSRF_SECRET = env.CSRF_SECRET
const TOKEN_LIFETIME = 60 * 60 * 1000 // 1 hour
const MAX_USED_TOKENS = 10000 // Maximum stored used tokens before cleanup

interface CSRFToken {
  value: string
  timestamp: number
}

/**
 * In-memory store for used CSRF tokens to prevent replay attacks
 * In production with multiple instances, use Redis via Upstash
 */
interface UsedTokenStore {
  tokens: Map<string, number> // token hash -> expiry timestamp
  lastCleanup: number
}

const usedTokenStore: UsedTokenStore = {
  tokens: new Map(),
  lastCleanup: Date.now(),
}

// Cleanup interval: every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000

/**
 * Clean up expired tokens from the store
 */
function cleanupUsedTokens(): void {
  const now = Date.now()

  // Only cleanup if enough time has passed
  if (now - usedTokenStore.lastCleanup < CLEANUP_INTERVAL) {
    return
  }

  // Remove expired tokens
  const entries = Array.from(usedTokenStore.tokens.entries())
  for (const [token, expiry] of entries) {
    if (expiry < now) {
      usedTokenStore.tokens.delete(token)
    }
  }

  // If still too many tokens, remove oldest ones
  if (usedTokenStore.tokens.size > MAX_USED_TOKENS) {
    const entries = Array.from(usedTokenStore.tokens.entries())
    entries.sort((a, b) => a[1] - b[1]) // Sort by expiry

    // Remove oldest 20%
    const toRemove = Math.floor(entries.length * 0.2)
    for (let i = 0; i < toRemove; i++) {
      usedTokenStore.tokens.delete(entries[i][0])
    }
  }

  usedTokenStore.lastCleanup = now
}

/**
 * Hash a token for storage (we don't store raw tokens)
 */
function hashToken(token: string): string {
  return createHmac('sha256', CSRF_SECRET)
    .update(token)
    .digest('hex')
}

/**
 * Mark a token as used to prevent replay attacks
 */
function markTokenAsUsed(token: string, expiryTimestamp: number): void {
  cleanupUsedTokens()
  const tokenHash = hashToken(token)
  usedTokenStore.tokens.set(tokenHash, expiryTimestamp)
}

/**
 * Check if a token has already been used
 */
function isTokenUsed(token: string): boolean {
  const tokenHash = hashToken(token)
  return usedTokenStore.tokens.has(tokenHash)
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
 * Verify a CSRF token with replay attack prevention
 */
export function verifyCSRFToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [value, timestampStr, signature] = decoded.split(':')
    const timestamp = parseInt(timestampStr, 10)

    // Check if values exist
    if (!value || !timestampStr || !signature) {
      return false
    }

    // Check if token has expired
    const expiryTime = timestamp + TOKEN_LIFETIME
    if (Date.now() > expiryTime) {
      return false
    }

    // Check if token has already been used (replay attack prevention)
    if (isTokenUsed(token)) {
      console.warn('CSRF token replay attack detected')
      return false
    }

    // Verify signature using constant-time comparison to prevent timing attacks
    const expectedSignature = createHmac('sha256', CSRF_SECRET)
      .update(`${value}:${timestamp}`)
      .digest('hex')

    // Convert to buffers for timing-safe comparison
    const signatureBuffer = Buffer.from(signature, 'utf-8')
    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8')

    // Ensure same length before comparison (timingSafeEqual requires equal length)
    if (signatureBuffer.length !== expectedBuffer.length) {
      return false
    }

    const isValid = timingSafeEqual(signatureBuffer, expectedBuffer)

    // If valid, mark the token as used to prevent replay
    if (isValid) {
      markTokenAsUsed(token, expiryTime)
    }

    return isValid
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

/**
 * Get statistics about the token store (for monitoring)
 */
export function getCSRFTokenStats(): { usedTokenCount: number; lastCleanup: Date } {
  return {
    usedTokenCount: usedTokenStore.tokens.size,
    lastCleanup: new Date(usedTokenStore.lastCleanup),
  }
}
