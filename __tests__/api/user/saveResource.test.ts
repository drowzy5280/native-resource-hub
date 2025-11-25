/**
 * @jest-environment node
 */
import { POST } from '@/app/api/user/saveResource/route'
import { NextRequest } from 'next/server'
import { generateCSRFToken } from '@/lib/csrf'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    savedResource: {
      create: jest.fn(),
    },
  },
}))

jest.mock('@/lib/auth', () => ({
  requireAuth: jest.fn(),
}))

describe('/api/user/saveResource', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should reject request without CSRF token', async () => {
    const request = new NextRequest('http://localhost:3000/api/user/saveResource', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-123',
        resourceId: 'resource-123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toBe('CSRF token missing')
  })

  it('should reject request with invalid CSRF token', async () => {
    const request = new NextRequest('http://localhost:3000/api/user/saveResource', {
      method: 'POST',
      headers: {
        'x-csrf-token': 'invalid-token',
      },
      body: JSON.stringify({
        userId: 'user-123',
        resourceId: 'resource-123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toBe('Invalid or expired CSRF token')
  })

  it('should save resource with valid CSRF token and auth', async () => {
    const { requireAuth } = require('@/lib/auth')
    const { prisma } = require('@/lib/prisma')

    requireAuth.mockResolvedValue(mockUser)
    prisma.savedResource.create.mockResolvedValue({
      id: 'saved-123',
      userId: 'user-123',
      resourceId: 'resource-123',
      createdAt: new Date(),
      resource: { id: 'resource-123', title: 'Test Resource' },
    })

    const csrfToken = generateCSRFToken()
    const request = new NextRequest('http://localhost:3000/api/user/saveResource', {
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify({
        userId: 'user-123',
        resourceId: 'resource-123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.id).toBe('saved-123')
    expect(requireAuth).toHaveBeenCalled()
    expect(prisma.savedResource.create).toHaveBeenCalled()
  })

  it('should reject when user tries to save for another user', async () => {
    const { requireAuth } = require('@/lib/auth')
    requireAuth.mockResolvedValue(mockUser)

    const csrfToken = generateCSRFToken()
    const request = new NextRequest('http://localhost:3000/api/user/saveResource', {
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify({
        userId: 'different-user-123',
        resourceId: 'resource-123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toContain('Forbidden')
  })
})
