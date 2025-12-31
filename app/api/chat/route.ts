import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { strictRateLimiter } from '@/lib/rateLimit'

// Valid US states for input sanitization
const VALID_STATES = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
  'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho',
  'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana',
  'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
  'mississippi', 'missouri', 'montana', 'nebraska', 'nevada',
  'new hampshire', 'new jersey', 'new mexico', 'new york',
  'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon',
  'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
  'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
  'west virginia', 'wisconsin', 'wyoming'
] as const

// Sanitize user input - remove potentially harmful characters
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>{}]/g, '') // Remove potential HTML/script injection
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
    .slice(0, 500) // Limit message length
}

// Simple keyword-based matching for resource discovery
const keywords = {
  scholarship: ['scholarship', 'education', 'college', 'university', 'tuition', 'student', 'degree', 'financial aid'],
  housing: ['housing', 'home', 'rent', 'mortgage', 'hud', 'shelter', 'apartment'],
  healthcare: ['health', 'medical', 'ihs', 'indian health service', 'doctor', 'hospital', 'dental', 'vision'],
  emergency: ['emergency', 'urgent', 'immediate', 'crisis', 'help now', 'assistance'],
  education: ['education', 'school', 'learning', 'training', 'ged', 'vocational'],
  employment: ['job', 'employment', 'work', 'career', 'hiring', 'training program'],
  legal: ['legal', 'law', 'court', 'attorney', 'lawyer', 'rights'],
  food: ['food', 'nutrition', 'snap', 'wic', 'hunger', 'meal'],
  enrollment: ['enroll', 'enrollment', 'tribe', 'tribal', 'membership', 'cdib', 'register'],
}

function detectIntent(message: string): string[] {
  const lowerMessage = message.toLowerCase()
  const detectedIntents: string[] = []

  for (const [intent, words] of Object.entries(keywords)) {
    if (words.some((word) => lowerMessage.includes(word))) {
      detectedIntents.push(intent)
    }
  }

  return detectedIntents.length > 0 ? detectedIntents : ['general']
}

function generateResponse(intents: string[], hasResults: boolean): string {
  if (!hasResults) {
    return "I couldn't find specific resources matching your query, but I can help you explore our database. Try browsing by category or use more specific terms. You can also check our guides section for helpful information."
  }

  const responses: Record<string, string> = {
    scholarship: "I found some scholarships that might interest you. These programs provide financial support for Native American students pursuing education. Make sure to check the eligibility requirements and deadlines for each.",
    housing: "Here are some housing assistance programs available for Native American communities. These include federal, state, and tribal programs that can help with rent, home ownership, and emergency shelter.",
    healthcare: "I found healthcare resources that may help you. The Indian Health Service and related programs provide comprehensive medical care. Many services are available regardless of where you live.",
    emergency: "I understand you need urgent assistance. Here are emergency resources that can provide immediate help. Many of these programs have expedited application processes.",
    education: "Here are educational resources and programs available for Native American students and families. These include tutoring, GED programs, vocational training, and more.",
    employment: "I found employment and career resources that might help. These programs offer job training, placement assistance, and career development specifically for Native American job seekers.",
    legal: "Here are legal resources and assistance programs. These organizations provide free or low-cost legal help for Native Americans on issues ranging from tribal law to civil rights.",
    food: "I found nutrition and food assistance programs. These include federal programs like SNAP, as well as tribal and nonprofit food distribution services.",
    enrollment: "Here's information about tribal enrollment. Each tribe has its own enrollment criteria and process. I've included resources to help you understand the requirements and get started.",
    general: "Here are some resources that might be helpful based on your question. You can also browse our full resource directory or use the filters to narrow down options.",
  }

  const primaryIntent = intents[0]
  return responses[primaryIntent] || responses.general
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - use strict limiter for chat to prevent abuse
    const rateLimitResult = await strictRateLimiter.check(request)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before sending another message.' },
        { status: 429 }
      )
    }

    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Sanitize input
    const sanitizedMessage = sanitizeInput(message)

    if (sanitizedMessage.length < 2) {
      return NextResponse.json({ error: 'Message is too short' }, { status: 400 })
    }

    const intents = detectIntent(sanitizedMessage)
    const lowerMessage = sanitizedMessage.toLowerCase()

    // Extract potential state mentions - only from validated list
    const mentionedState = VALID_STATES.find(state => lowerMessage.includes(state))

    // Extract safe search terms (first 3 words, alphanumeric only)
    const searchTerms = sanitizedMessage
      .split(' ')
      .slice(0, 3)
      .filter(word => /^[a-zA-Z0-9]+$/.test(word))
      .join(' ')

    // Search for resources
    const resources = await prisma.resource.findMany({
      where: {
        deletedAt: null,
        OR: [
          ...(searchTerms ? [
            { title: { contains: searchTerms, mode: 'insensitive' as const } },
            { description: { contains: searchTerms, mode: 'insensitive' as const } },
          ] : []),
          { tags: { hasSome: intents } },
          ...(mentionedState ? [{ state: { contains: mentionedState, mode: 'insensitive' as const } }] : []),
        ],
      },
      take: 3,
      orderBy: { featured: 'desc' },
      select: {
        id: true,
        title: true,
        type: true,
      },
    })

    // Search for scholarships if education/scholarship intent
    let scholarships: Array<{ id: string; name: string }> = []
    if (intents.includes('scholarship') || intents.includes('education')) {
      scholarships = await prisma.scholarship.findMany({
        where: {
          deletedAt: null,
          ...(searchTerms ? {
            OR: [
              { name: { contains: searchTerms, mode: 'insensitive' } },
              { description: { contains: searchTerms, mode: 'insensitive' } },
            ],
          } : {}),
        },
        take: 3,
        orderBy: [{ featured: 'desc' }, { deadline: 'asc' }],
        select: {
          id: true,
          name: true,
        },
      })
    }

    // Build suggestions array
    const suggestions = [
      ...resources.map((r) => ({
        type: 'resource' as const,
        id: r.id,
        title: r.title,
        url: `/resources/${r.id}`,
      })),
      ...scholarships.map((s) => ({
        type: 'scholarship' as const,
        id: s.id,
        title: s.name,
        url: `/scholarships/${s.id}`,
      })),
    ].slice(0, 5)

    const responseMessage = generateResponse(intents, suggestions.length > 0)

    return NextResponse.json({
      message: responseMessage,
      suggestions,
      intents,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    )
  }
}
