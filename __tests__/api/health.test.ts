/**
 * @jest-environment node
 */
import { GET } from '@/app/api/health/route'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn(),
  },
}))

describe('/api/health', () => {
  it('should return healthy status when database is up', async () => {
    const { prisma } = require('@/lib/prisma')
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }])

    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('healthy')
    expect(data.services.database).toBe('up')
    expect(data.timestamp).toBeDefined()
  })

  it('should return error status when database is down', async () => {
    const { prisma } = require('@/lib/prisma')
    prisma.$queryRaw.mockRejectedValue(new Error('Connection failed'))

    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.status).toBe('unhealthy')
    expect(data.services.database).toBe('down')
  })
})
