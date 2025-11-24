import { NextResponse } from 'next/server'
import { generateCSRFToken } from '@/lib/csrf'

/**
 * GET /api/csrf - Get CSRF token
 * Used by client to get token before making mutation requests
 */
export async function GET() {
  const token = generateCSRFToken()

  return NextResponse.json({
    token,
  })
}
