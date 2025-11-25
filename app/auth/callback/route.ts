import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/auth/signin?error=auth_failed', requestUrl.origin))
    }

    // Create user in database if they don't exist
    if (data.user) {
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {
          email: data.user.email!,
        },
        create: {
          id: data.user.id,
          email: data.user.email!,
          role: 'user', // Default role, run make-admin script to upgrade
        },
      })
    }
  }

  // Redirect to home page
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
