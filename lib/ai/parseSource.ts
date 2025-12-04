import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { env } from '../env'
import { MAX_HTML_LENGTH, AI_BATCH_DELAY_MS, AI_MODEL, AI_MAX_TOKENS } from '../constants'

const client = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
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
  type: 'resource' | 'scholarship' | 'tribal',
  retryCount = 0
): Promise<ParsedResource> {
  const maxRetries = 2

  try {
    const prompt = buildPrompt(type)

    const message = await client.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nSource URL: ${sourceUrl}\n\nHTML Content:\n${html.slice(0, MAX_HTML_LENGTH)}`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    return extractAndValidateJSON(content.text, ParsedResourceSchema)
  } catch (error: any) {
    // Handle rate limiting with exponential backoff
    if (error?.status === 429 && retryCount < maxRetries) {
      const delayMs = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
      console.log(`Rate limited, retrying in ${delayMs}ms (attempt ${retryCount + 1}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, delayMs))
      return parseSource(html, sourceUrl, type, retryCount + 1)
    }

    console.error('Failed to parse AI response:', error)
    throw new Error(`Failed to parse resource from HTML: ${error?.message || 'Unknown error'}`)
  }
}

/**
 * Extracts and validates JSON from Claude's response text
 * Tries multiple strategies to find valid JSON
 */
function extractAndValidateJSON<T>(text: string, schema: z.ZodSchema<T>): T {
  // Strategy 1: Try to find JSON between code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1])
      return schema.parse(parsed)
    } catch (e) {
      // Continue to next strategy
    }
  }

  // Strategy 2: Try to find JSON object in text
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      return schema.parse(parsed)
    } catch (e) {
      // Continue to next strategy
    }
  }

  // Strategy 3: Try to find JSON array
  const arrayMatch = text.match(/\[[\s\S]*\]/)
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0])
      // If it's an array, try to use the first element
      if (Array.isArray(parsed) && parsed.length > 0) {
        return schema.parse(parsed[0])
      }
    } catch (e) {
      // Continue to error
    }
  }

  // If all strategies fail, throw a detailed error
  throw new Error(`No valid JSON found in response. Text preview: ${text.slice(0, 200)}...`)
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
  sources: Array<{ html: string; url: string; type: 'resource' | 'scholarship' | 'tribal' }>,
  options: { parallel?: boolean; batchSize?: number } = {}
): Promise<ParsedResource[]> {
  const { parallel = true, batchSize = 5 } = options

  // Sequential processing (old behavior, kept for backward compatibility)
  if (!parallel) {
    const results: ParsedResource[] = []
    for (const source of sources) {
      try {
        const parsed = await parseSource(source.html, source.url, source.type)
        results.push(parsed)
        await new Promise(resolve => setTimeout(resolve, AI_BATCH_DELAY_MS))
      } catch (error) {
        console.error(`Failed to parse source ${source.url}:`, error)
      }
    }
    return results
  }

  // Parallel processing with controlled concurrency
  const results: ParsedResource[] = []

  // Process in batches to avoid overwhelming the API
  for (let i = 0; i < sources.length; i += batchSize) {
    const batch = sources.slice(i, i + batchSize)

    const batchPromises = batch.map(async (source, index) => {
      try {
        // Stagger requests slightly to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, index * 200))
        return await parseSource(source.html, source.url, source.type)
      } catch (error) {
        console.error(`Failed to parse source ${source.url}:`, error)
        return null
      }
    })

    const batchResults = await Promise.allSettled(batchPromises)

    // Collect successful results
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value !== null) {
        results.push(result.value)
      }
    })

    // Wait between batches to avoid rate limiting
    if (i + batchSize < sources.length) {
      await new Promise(resolve => setTimeout(resolve, AI_BATCH_DELAY_MS))
    }
  }

  return results
}

const ValidationSchema = z.object({
  isValid: z.boolean(),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
})

export async function validateResourceUpdate(
  original: string,
  updated: string,
  context: string
): Promise<{ isValid: boolean; confidence: number; reason: string }> {
  try {
    const message = await client.messages.create({
      model: AI_MODEL,
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

    return extractAndValidateJSON(content.text, ValidationSchema)
  } catch (error: any) {
    console.error('Failed to validate resource update:', error)
    // Return a safe fallback instead of crashing
    return {
      isValid: false,
      confidence: 0,
      reason: `Validation failed: ${error?.message || 'Unknown error'}`,
    }
  }
}
