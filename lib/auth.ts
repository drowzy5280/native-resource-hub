import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { env } from './env'
import { prisma } from './prisma'

// Create a Supabase client with service role key for server-side auth
const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

export async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) {
      return null
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
        tribeId: true,
        state: true,
        deletedAt: true,
      },
    })

    if (!dbUser || dbUser.deletedAt) {
      return null
    }

    return dbUser
  } catch (error) {
    console.error('Error getting user from request:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request)
  if (user.role !== 'admin') {
    throw new Error('Forbidden - Admin access required')
  }
  return user
}

export function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  return authHeader === `Bearer ${env.CRON_SECRET}`
}
