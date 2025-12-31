import { PrismaClient } from '@prisma/client'
import { env } from './env'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma Client Configuration
 *
 * Connection pooling is optimized for serverless environments:
 * - DATABASE_URL should include: ?connection_limit=1&pool_timeout=10&connect_timeout=10
 * - For Supabase with pgBouncer (transaction mode), use port 6543
 * - connection_limit=1 is recommended for serverless to prevent connection exhaustion
 *
 * For development, a higher connection limit can be used via direct connection.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
    // Datasource configuration
    datasourceUrl: env.DATABASE_URL,
  })

// Prevent multiple instances in development (hot reload)
if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * Graceful shutdown handler for Prisma
 * Ensures connections are properly closed when the process exits
 */
async function gracefulShutdown() {
  await prisma.$disconnect()
}

// Register shutdown handlers
if (typeof process !== 'undefined') {
  process.on('beforeExit', gracefulShutdown)
  process.on('SIGINT', async () => {
    await gracefulShutdown()
    process.exit(0)
  })
  process.on('SIGTERM', async () => {
    await gracefulShutdown()
    process.exit(0)
  })
}

/**
 * Helper for transaction operations with retry logic
 * Useful for handling connection pool exhaustion in serverless
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 100
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Only retry on connection-related errors
      const isRetryable =
        lastError.message.includes('Connection pool') ||
        lastError.message.includes('P2024') || // Timed out
        lastError.message.includes('P2025') // Record not found (race condition)

      if (!isRetryable || attempt === maxRetries) {
        throw lastError
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt))
    }
  }

  throw lastError
}
