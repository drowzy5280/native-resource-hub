/**
 * @jest-environment node
 */
import { GET } from '@/app/api/scholarships/list/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    scholarship: {
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

describe('/api/scholarships/list', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all scholarships', async () => {
    const mockScholarships = [
      {
        id: '1',
        name: 'Test Scholarship 1',
        amount: '$5,000',
        deadline: new Date('2025-12-31'),
        description: 'Scholarship for Native American students',
        tags: ['education', 'undergraduate'],
        eligibility: ['Native American', 'High School Senior'],
        url: 'https://example.com/scholarship1',
        source: 'Example Foundation',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: '2',
        name: 'Test Scholarship 2',
        amount: '$10,000',
        deadline: new Date('2025-11-30'),
        description: 'Graduate scholarship',
        tags: ['education', 'graduate'],
        eligibility: ['Native American', 'Graduate Student'],
        url: 'https://example.com/scholarship2',
        source: 'Example University',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]

    ;(prisma.scholarship.findMany as jest.Mock).mockResolvedValue(mockScholarships)

    const request = new NextRequest('http://localhost:3000/api/scholarships/list')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(2)
    expect(data[0].name).toBe('Test Scholarship 1')
    expect(data[1].name).toBe('Test Scholarship 2')
  })

  it('should respect limit parameter', async () => {
    const mockScholarships = [
      {
        id: '1',
        name: 'Test Scholarship 1',
        amount: '$5,000',
        deadline: new Date('2025-12-31'),
        description: 'Description',
        tags: ['education'],
        eligibility: ['Native American'],
        url: 'https://example.com/1',
        source: 'Source',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]

    ;(prisma.scholarship.findMany as jest.Mock).mockResolvedValue(mockScholarships)

    const request = new NextRequest('http://localhost:3000/api/scholarships/list?limit=5')
    await GET(request)

    expect(prisma.scholarship.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 5,
      })
    )
  })

  it('should order by creation date descending', async () => {
    ;(prisma.scholarship.findMany as jest.Mock).mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/scholarships/list')
    await GET(request)

    expect(prisma.scholarship.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: {
          createdAt: 'desc',
        },
      })
    )
  })

  it('should handle database errors gracefully', async () => {
    ;(prisma.scholarship.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new NextRequest('http://localhost:3000/api/scholarships/list')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch scholarships')
  })

  it('should return empty array when no scholarships exist', async () => {
    ;(prisma.scholarship.findMany as jest.Mock).mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/scholarships/list')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual([])
  })
})
