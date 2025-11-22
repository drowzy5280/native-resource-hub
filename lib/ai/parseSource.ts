import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface ParsedResource {
  title: string
  description: string
  eligibility: string[]
  tags: string[]
  url?: string
  amount?: string
  deadline?: string
  confidence: number
}

const ParsedResourceSchema = z.object({
  title: z.string(),
  description: z.string(),
  eligibility: z.array(z.string()),
  tags: z.array(z.string()),
  url: z.string().optional(),
  amount: z.string().optional(),
  deadline: z.string().optional(),
  confidence: z.number().min(0).max(1),
})

export async function parseSource(
  html: string,
  sourceUrl: string,
  type: 'resource' | 'scholarship' | 'tribal'
): Promise<ParsedResource> {
  const prompt = buildPrompt(type)

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `${prompt}\n\nSource URL: ${sourceUrl}\n\nHTML Content:\n${html.slice(0, 50000)}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  try {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    const validated = ParsedResourceSchema.parse(parsed)

    return validated
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    throw new Error('Failed to parse resource from HTML')
  }
}

function buildPrompt(type: 'resource' | 'scholarship' | 'tribal'): string {
  const basePrompt = `You are an expert at extracting structured data from HTML content for Native American resources.

Your task is to analyze the HTML and extract relevant information into a structured JSON format.

Return ONLY valid JSON in this exact format:
{
  "title": "Program or resource title",
  "description": "Clear, concise description (2-3 sentences)",
  "eligibility": ["requirement 1", "requirement 2"],
  "tags": ["tag1", "tag2", "tag3"],
  "url": "direct application or info URL",
  "confidence": 0.0-1.0
}

Guidelines:
- Extract factual information only
- Be specific about eligibility requirements
- Use relevant tags like "education", "health", "housing", "emergency", "youth", "elders"
- Include location/state if mentioned
- Confidence should reflect how clear the information is (0.0 = very unclear, 1.0 = very clear)
- If information is missing, use empty string or empty array`

  if (type === 'scholarship') {
    return `${basePrompt}

For scholarships, also extract:
- "amount": "dollar amount or range"
- "deadline": "ISO date format YYYY-MM-DD if available"

Focus on scholarships specifically for Native American students.`
  }

  if (type === 'tribal') {
    return `${basePrompt}

Focus on tribal-specific programs, services, and resources.
Include tribal enrollment requirements if mentioned.`
  }

  return basePrompt
}

export async function batchParseResources(
  sources: Array<{ html: string; url: string; type: 'resource' | 'scholarship' | 'tribal' }>
): Promise<ParsedResource[]> {
  const results: ParsedResource[] = []

  for (const source of sources) {
    try {
      const parsed = await parseSource(source.html, source.url, source.type)
      results.push(parsed)

      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Failed to parse source ${source.url}:`, error)
      // Continue with next source
    }
  }

  return results
}

export async function validateResourceUpdate(
  original: string,
  updated: string,
  context: string
): Promise<{ isValid: boolean; confidence: number; reason: string }> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `Compare these two versions and determine if the update is valid and accurate.

Context: ${context}

Original: ${original}
Updated: ${updated}

Respond with JSON only:
{
  "isValid": true/false,
  "confidence": 0.0-1.0,
  "reason": "brief explanation"
}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON in validation response')
  }

  return JSON.parse(jsonMatch[0])
}
