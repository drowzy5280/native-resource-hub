/**
 * @jest-environment node
 */
import { GET } from '@/app/api/resources/list/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    resource: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}))

// Mock rate limiter
jest.mock('@/lib/rateLimit', () => ({
  apiRateLimiter: {
    check: jest.fn().mockResolvedValue({
      success: true,
      remaining: 59,
      reset: Date.now() + 60000,
    }),
  },
  addRateLimitHeaders: jest.fn((headers: Headers) => headers),
}))

describe('/api/resources/list', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return paginated resources', async () => {
    const mockResources = [
      {
        id: '1',
        type: 'federal',
        title: 'Test Resource 1',
        description: 'Description 1',
        url: 'https://example.com/1',
        eligibility: ['Native American'],
        tags: ['education'],
        state: null,
        tribeId: null,
        tribe: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        source: null,
      },
      {
        id: '2',
        type: 'state',
        title: 'Test Resource 2',
        description: 'Description 2',
        url: 'https://example.com/2',
        eligibility: ['Native American', 'Youth'],
        tags: ['health'],
        state: 'CA',
        tribeId: null,
        tribe: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        source: null,
      },
    ]

    ;(prisma.resource.findMany as jest.Mock).mockResolvedValue(mockResources)
    ;(prisma.resource.count as jest.Mock).mockResolvedValue(2)

    const request = new NextRequest('http://localhost:3000/api/resources/list')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data).toHaveLength(2)
    expect(data.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 2,
      totalPages: 1,
    })
  })

  it('should filter by resource type', async () => {
    const mockResources = [
      {
        id: '1',
        type: 'federal',
        title: 'Federal Resource',
        description: 'Description',
        url: 'https://example.com/1',
        eligibility: ['Native American'],
        tags: ['education'],
        state: null,
        tribeId: null,
        tribe: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        source: null,
      },
    ]

    ;(prisma.resource.findMany as jest.Mock).mockResolvedValue(mockResources)
    ;(prisma.resource.count as jest.Mock).mockResolvedValue(1)

    const request = new NextRequest(
      'http://localhost:3000/api/resources/list?type=federal'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].type).toBe('federal')
  })

  it('should handle pagination parameters', async () => {
    ;(prisma.resource.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.resource.count as jest.Mock).mockResolvedValue(50)

    const request = new NextRequest(
      'http://localhost:3000/api/resources/list?page=2&limit=10'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.pagination).toEqual({
      page: 2,
      limit: 10,
      total: 50,
      totalPages: 5,
    })

    expect(prisma.resource.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        skip: 10,
      })
    )
  })

  it('should return 400 for invalid resource type', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/resources/list?type=invalid'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid resource type')
  })

  it('should handle database errors gracefully', async () => {
    ;(prisma.resource.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new NextRequest('http://localhost:3000/api/resources/list')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch resources')
  })

  it('should include tribe information when available', async () => {
    const mockResources = [
      {
        id: '1',
        type: 'tribal',
        title: 'Tribal Resource',
        description: 'Description',
        url: 'https://example.com/1',
        eligibility: ['Tribal members'],
        tags: ['housing'],
        state: null,
        tribeId: 'tribe-1',
        tribe: {
          id: 'tribe-1',
          name: 'Example Tribe',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        source: null,
      },
    ]

    ;(prisma.resource.findMany as jest.Mock).mockResolvedValue(mockResources)
    ;(prisma.resource.count as jest.Mock).mockResolvedValue(1)

    const request = new NextRequest('http://localhost:3000/api/resources/list')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data[0].tribe).toBeDefined()
    expect(data.data[0].tribe.name).toBe('Example Tribe')
  })
})
