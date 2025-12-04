import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { env } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import { apiRateLimiter, addRateLimitHeaders } from '@/lib/rateLimit'
import { requireAuth } from '@/lib/auth'

const client = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
})

const RecommendationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['resource', 'scholarship']),
  matchScore: z.number().min(0).max(100),
  matchReasons: z.array(z.string()),
  url: z.string(),
  actionItems: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await apiRateLimiter.check(request, 10)
    if (!rateLimitResult.success) {
      const headers = new Headers()
      addRateLimitHeaders(headers, rateLimitResult)
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers }
      )
    }

    // Get user info (optional - works for both auth and unauth users)
    let user = null
    try {
      user = await requireAuth(request)
    } catch (e) {
      // User not authenticated - will provide generic recommendations
    }

    // Fetch user's profile and saved resources if authenticated
    let userProfile = null
    if (user) {
      userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          tribeId: true,
          state: true,
          birthYear: true,
          tags: true,
          saved: {
            include: {
              resource: {
                select: {
                  type: true,
                  tags: true,
                },
              },
            },
            take: 20,
          },
        },
      })
    }

    // Fetch available resources and scholarships
    const [resources, scholarships] = await Promise.all([
      prisma.resource.findMany({
        where: {
          deletedAt: null,
          ...(user && userProfile?.state ? { state: userProfile.state } : {}),
        },
        take: 50,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          eligibility: true,
          tags: true,
          state: true,
          tribeId: true,
          url: true,
        },
      }),
      prisma.scholarship.findMany({
        where: {
          deletedAt: null,
          deadline: { gte: new Date() },
        },
        take: 30,
        orderBy: { deadline: 'asc' },
        select: {
          id: true,
          name: true,
          description: true,
          eligibility: true,
          amount: true,
          deadline: true,
          tags: true,
        },
      }),
    ])

    // Build context for AI
    const userContext = buildUserContext(userProfile)
    const availableOptions = buildOptionsContext(resources, scholarships)

    // Get AI recommendations
    const recommendations = await generateRecommendations(
      userContext,
      availableOptions
    )

    const headers = new Headers()
    addRateLimitHeaders(headers, rateLimitResult)

    return NextResponse.json(
      { recommendations, userAuthenticated: !!user },
      { status: 200, headers }
    )
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

function buildUserContext(userProfile: any): string {
  if (!userProfile) {
    return 'User is not authenticated. Provide general recommendations for Native American individuals.'
  }

  const parts = []

  if (userProfile.tribeId) {
    parts.push(`User is enrolled in a federally recognized tribe`)
  }

  if (userProfile.state) {
    parts.push(`User lives in ${userProfile.state}`)
  }

  if (userProfile.birthYear) {
    const age = new Date().getFullYear() - userProfile.birthYear
    parts.push(`User is approximately ${age} years old`)
  }

  if (userProfile.tags && userProfile.tags.length > 0) {
    parts.push(`User is interested in: ${userProfile.tags.join(', ')}`)
  }

  if (userProfile.saved && userProfile.saved.length > 0) {
    const savedTypes = userProfile.saved.map((s: any) => s.resource.type)
    const uniqueTypes = Array.from(new Set(savedTypes))
    parts.push(`User has previously saved ${uniqueTypes.join(', ')} resources`)
  }

  return parts.join('. ') + '.'
}

function buildOptionsContext(resources: any[], scholarships: any[]): string {
  const resourceList = resources.slice(0, 20).map((r, i) => {
    return `${i + 1}. [RESOURCE-${r.id}] ${r.title} - ${r.type} - ${r.description.substring(0, 100)}`
  }).join('\n')

  const scholarshipList = scholarships.slice(0, 15).map((s, i) => {
    return `${i + 1}. [SCHOLARSHIP-${s.id}] ${s.name} - ${s.amount || 'Amount varies'} - ${s.description.substring(0, 100)}`
  }).join('\n')

  return `
AVAILABLE RESOURCES:
${resourceList}

AVAILABLE SCHOLARSHIPS:
${scholarshipList}
`
}

async function generateRecommendations(
  userContext: string,
  availableOptions: string
): Promise<any[]> {
  const prompt = `You are an expert advisor for Native American resources and benefits.

USER CONTEXT:
${userContext}

${availableOptions}

Based on the user's profile and the available options above, recommend the TOP 5 MOST RELEVANT items.
Return ONLY a valid JSON array with this exact structure:

[
  {
    "id": "RESOURCE-xyz or SCHOLARSHIP-xyz",
    "title": "Program name",
    "description": "Brief description (max 150 chars)",
    "type": "resource" or "scholarship",
    "matchScore": 85,
    "matchReasons": [
      "Reason 1 why this matches",
      "Reason 2 why this matches"
    ],
    "url": "/resources/id or /scholarships/id",
    "actionItems": [
      "Step 1 to apply",
      "Step 2 to apply"
    ]
  }
]

IMPORTANT:
- Only recommend items from the lists provided above
- Use the exact IDs from the lists (RESOURCE-xyz or SCHOLARSHIP-xyz)
- Match score should be 0-100 based on relevance
- Provide specific, actionable match reasons
- Include 2-4 actionItems per recommendation
- Return ONLY valid JSON, no other text`

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 3000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  // Extract JSON from response
  const jsonMatch = content.text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('No JSON found in response')
  }

  const recommendations = JSON.parse(jsonMatch[0])

  // Validate and transform IDs to actual resource IDs
  return recommendations.map((rec: any) => {
    const actualId = rec.id.replace('RESOURCE-', '').replace('SCHOLARSHIP-', '')
    const isScholarship = rec.id.startsWith('SCHOLARSHIP-')

    return {
      ...rec,
      id: actualId,
      url: isScholarship ? `/scholarships/${actualId}` : `/resources/${actualId}`,
    }
  })
}
