/**
 * @jest-environment node
 */
import { GET } from '@/app/api/tribes/list/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    tribe: {
      findMany: jest.fn(),
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

describe('/api/tribes/list', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all tribes with program count', async () => {
    const mockTribes = [
      {
        id: '1',
        name: 'Example Tribe 1',
        federalRecognitionStatus: 'Federally Recognized',
        website: 'https://example-tribe1.gov',
        languageLinks: ['https://language1.com'],
        enrollmentOffice: 'Enrollment Office Contact',
        region: 'Southwest',
        lastUpdated: new Date(),
        deletedAt: null,
        _count: {
          programs: 5,
        },
      },
      {
        id: '2',
        name: 'Example Tribe 2',
        federalRecognitionStatus: 'Federally Recognized',
        website: 'https://example-tribe2.gov',
        languageLinks: [],
        enrollmentOffice: null,
        region: 'Northwest',
        lastUpdated: new Date(),
        deletedAt: null,
        _count: {
          programs: 3,
        },
      },
    ]

    ;(prisma.tribe.findMany as jest.Mock).mockResolvedValue(mockTribes)

    const request = new NextRequest('http://localhost:3000/api/tribes/list')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(2)
    expect(data[0]._count.programs).toBe(5)
    expect(data[1]._count.programs).toBe(3)
  })

  it('should order tribes by name ascending', async () => {
    ;(prisma.tribe.findMany as jest.Mock).mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/tribes/list')
    await GET(request)

    expect(prisma.tribe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: {
          name: 'asc',
        },
      })
    )
  })

  it('should include program count in response', async () => {
    ;(prisma.tribe.findMany as jest.Mock).mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/tribes/list')
    await GET(request)

    expect(prisma.tribe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: {
          _count: {
            select: { programs: true },
          },
        },
      })
    )
  })

  it('should handle database errors gracefully', async () => {
    ;(prisma.tribe.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new NextRequest('http://localhost:3000/api/tribes/list')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch tribes')
  })

  it('should return empty array when no tribes exist', async () => {
    ;(prisma.tribe.findMany as jest.Mock).mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/tribes/list')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual([])
  })

  it('should handle tribes with null values', async () => {
    const mockTribes = [
      {
        id: '1',
        name: 'Minimal Tribe',
        federalRecognitionStatus: null,
        website: null,
        languageLinks: [],
        enrollmentOffice: null,
        region: null,
        lastUpdated: new Date(),
        deletedAt: null,
        _count: {
          programs: 0,
        },
      },
    ]

    ;(prisma.tribe.findMany as jest.Mock).mockResolvedValue(mockTribes)

    const request = new NextRequest('http://localhost:3000/api/tribes/list')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0].website).toBeNull()
    expect(data[0].federalRecognitionStatus).toBeNull()
  })
})
