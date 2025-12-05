/**
 * Sanitizes error messages to prevent information leakage in production
 */

import { env } from './env'

/**
 * List of sensitive patterns that should be redacted from error messages
 */
const SENSITIVE_PATTERNS = [
  // Database connection strings
  /postgresql:\/\/[^\s]+/gi,
  /postgres:\/\/[^\s]+/gi,
  /mysql:\/\/[^\s]+/gi,

  // API keys and tokens
  /sk-[a-zA-Z0-9]{20,}/gi,
  /Bearer [a-zA-Z0-9._-]+/gi,

  // Email addresses in error traces
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,

  // File paths
  /[A-Z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*/gi,
  /\/(?:home|usr|var|etc)\/[^\s]*/gi,

  // IP addresses
  /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/gi,
]

/**
 * Generic error messages for different error types
 */
const GENERIC_MESSAGES: Record<string, string> = {
  database: 'Database operation failed',
  authentication: 'Authentication failed',
  validation: 'Invalid input provided',
  authorization: 'Access denied',
  notFound: 'Resource not found',
  rateLimit: 'Too many requests',
  external: 'External service error',
  internal: 'Internal server error',
}

/**
 * Sanitizes an error message by removing sensitive information
 * @param error - The error object or message
 * @param isDevelopment - Whether we're in development mode
 * @returns Sanitized error message
 */
export function sanitizeErrorMessage(
  error: unknown,
  isDevelopment: boolean = env.NODE_ENV === 'development'
): string {
  if (!error) {
    return GENERIC_MESSAGES.internal
  }

  // In development, return full error details
  if (isDevelopment) {
    if (error instanceof Error) {
      return error.message
    }
    return String(error)
  }

  // In production, sanitize the error
  let errorMessage = error instanceof Error ? error.message : String(error)

  // Redact sensitive patterns
  for (const pattern of SENSITIVE_PATTERNS) {
    errorMessage = errorMessage.replace(pattern, '[REDACTED]')
  }

  // Map to generic messages if the error contains certain keywords
  if (errorMessage.toLowerCase().includes('prisma') ||
      errorMessage.toLowerCase().includes('database') ||
      errorMessage.toLowerCase().includes('sql')) {
    return GENERIC_MESSAGES.database
  }

  if (errorMessage.toLowerCase().includes('unauthorized') ||
      errorMessage.toLowerCase().includes('token') ||
      errorMessage.toLowerCase().includes('auth')) {
    return GENERIC_MESSAGES.authentication
  }

  if (errorMessage.toLowerCase().includes('forbidden') ||
      errorMessage.toLowerCase().includes('permission')) {
    return GENERIC_MESSAGES.authorization
  }

  if (errorMessage.toLowerCase().includes('not found')) {
    return GENERIC_MESSAGES.notFound
  }

  if (errorMessage.toLowerCase().includes('rate limit')) {
    return GENERIC_MESSAGES.rateLimit
  }

  if (errorMessage.toLowerCase().includes('fetch') ||
      errorMessage.toLowerCase().includes('external') ||
      errorMessage.toLowerCase().includes('api')) {
    return GENERIC_MESSAGES.external
  }

  // If message is too long or complex, use generic message
  if (errorMessage.length > 100) {
    return GENERIC_MESSAGES.internal
  }

  return errorMessage
}

/**
 * Logs error with full details (for monitoring) while returning sanitized version
 * @param error - The error to log and sanitize
 * @param context - Additional context about where the error occurred
 * @returns Sanitized error message for client response
 */
export function logAndSanitizeError(
  error: unknown,
  context: string
): string {
  // Log full error for monitoring/debugging
  console.error(`[${context}] Error:`, error)

  // Return sanitized message for client
  return sanitizeErrorMessage(error)
}

/**
 * Creates a standardized error response object
 * @param error - The error that occurred
 * @param context - Context about where the error occurred
 * @returns Standardized error response object
 */
export function createErrorResponse(
  error: unknown,
  context: string
): { error: string; requestId?: string } {
  const sanitizedMessage = logAndSanitizeError(error, context)

  return {
    error: sanitizedMessage,
    // In production, you might want to add a request ID for tracking
    ...(env.NODE_ENV === 'development' && {
      details: error instanceof Error ? error.stack : undefined
    }),
  }
}
