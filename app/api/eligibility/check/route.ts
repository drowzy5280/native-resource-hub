import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { env } from '@/lib/env'
import { apiRateLimiter, addRateLimitHeaders } from '@/lib/rateLimit'
import { RATE_LIMIT_AI, AI_MODEL, AI_MAX_TOKENS_ELIGIBILITY } from '@/lib/constants'

const client = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
})

const EligibilityRequestSchema = z.object({
  tribalEnrollment: z.enum(['yes', 'no', 'unknown']),
  educationStatus: z.enum(['high-school', 'undergraduate', 'graduate', 'not-student']),
  location: z.enum(['reservation', 'urban', 'rural']),
  interests: z.array(z.string()),
})

const EligibilityResultSchema = z.object({
  programType: z.string(),
  eligible: z.boolean(),
  confidence: z.enum(['high', 'medium', 'low']),
  reason: z.string(),
  nextSteps: z.array(z.string()),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
  })),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await apiRateLimiter.check(request, RATE_LIMIT_AI)
    if (!rateLimitResult.success) {
      const headers = new Headers()
      addRateLimitHeaders(headers, rateLimitResult)
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers }
      )
    }

    const body = await request.json()
    const answers = EligibilityRequestSchema.parse(body)

    // Build the prompt for Claude
    const prompt = buildEligibilityPrompt(answers)

    const message = await client.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS_ELIGIBILITY,
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

    let results
    try {
      results = JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Failed to parse AI JSON response:', error)
      throw new Error('Invalid JSON response from AI')
    }

    const validated = z.array(EligibilityResultSchema).parse(results)

    const headers = new Headers()
    addRateLimitHeaders(headers, rateLimitResult)

    return NextResponse.json(
      { results: validated },
      { status: 200, headers }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error checking eligibility:', error)
    return NextResponse.json(
      { error: 'Failed to check eligibility' },
      { status: 500 }
    )
  }
}

function buildEligibilityPrompt(answers: z.infer<typeof EligibilityRequestSchema>): string {
  return `You are an expert eligibility assistant for Native American programs and benefits.
Based on the following information about a user, determine what programs they may be eligible for and provide personalized guidance.

User Information:
- Tribal Enrollment: ${answers.tribalEnrollment}
- Education Status: ${answers.educationStatus}
- Location: ${answers.location}
- Interests: ${answers.interests.join(', ')}

Analyze this information and return a JSON array of eligibility results. Each result should follow this structure:

[
  {
    "programType": "Program category name",
    "eligible": true/false,
    "confidence": "high" | "medium" | "low",
    "reason": "Clear explanation of why they qualify or don't qualify",
    "nextSteps": [
      "Specific action step 1",
      "Specific action step 2",
      "Specific action step 3"
    ],
    "resources": [
      {
        "title": "Resource name",
        "url": "/path/to/resource (use /resources, /scholarships, /guides/slug, /tribes paths)"
      }
    ]
  }
]

IMPORTANT Guidelines:
1. Consider the following program categories based on their interests:
   - Education: Federal scholarships, tribal scholarships, FAFSA programs
   - Healthcare: Indian Health Service (IHS), Urban Indian Health, tribal health programs
   - Housing: NAHASDA, tribal housing authorities, HUD programs
   - Employment: WIOA Native American programs, tribal employment, career development
   - Legal: Native American Rights Fund, tribal legal services
   - Cultural: Cultural preservation grants, language programs, traditional arts

2. Confidence levels:
   - "high": Enrolled tribal member with clear documentation path
   - "medium": Native ancestry but not enrolled, or missing some requirements
   - "low": Unclear eligibility or significant barriers

3. Be specific and actionable in nextSteps - tell them exactly what to do first

4. For resources, use realistic URLs:
   - /scholarships for scholarship listings
   - /resources?type=healthcare for healthcare resources
   - /resources?type=housing for housing
   - /guides/tribal-enrollment for enrollment help
   - /guides/first-time-applying for application guides
   - /tribes to find their tribe

5. Prioritize programs with highest eligibility confidence

Return ONLY the JSON array, no other text.`
}
