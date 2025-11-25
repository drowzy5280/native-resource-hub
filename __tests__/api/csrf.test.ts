/**
 * @jest-environment node
 */
import { GET } from '@/app/api/csrf/route'
import { NextRequest } from 'next/server'
import { verifyCSRFToken } from '@/lib/csrf'

describe('/api/csrf', () => {
  it('should generate a valid CSRF token', async () => {
    const request = new NextRequest('http://localhost:3000/api/csrf')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.token).toBeDefined()
    expect(typeof data.token).toBe('string')
    expect(data.token.length).toBeGreaterThan(0)
  })

  it('should generate a token that can be verified', async () => {
    const request = new NextRequest('http://localhost:3000/api/csrf')
    const response = await GET(request)
    const data = await response.json()

    const isValid = verifyCSRFToken(data.token)
    expect(isValid).toBe(true)
  })

  it('should generate different tokens on each request', async () => {
    const request1 = new NextRequest('http://localhost:3000/api/csrf')
    const response1 = await GET(request1)
    const data1 = await response1.json()

    const request2 = new NextRequest('http://localhost:3000/api/csrf')
    const response2 = await GET(request2)
    const data2 = await response2.json()

    expect(data1.token).not.toBe(data2.token)
  })
})
