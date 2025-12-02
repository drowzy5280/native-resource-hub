import { PrismaClient } from '@prisma/client'
import { env } from './env'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query'] : ['error'],
    // Connection pooling is configured via DATABASE_URL parameters:
    // ?connection_limit=10&pool_timeout=10&connect_timeout=10
    // For Supabase with pgBouncer, use the connection pooling URL
  })

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
