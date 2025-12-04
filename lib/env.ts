import { z } from 'zod'

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Database
  DATABASE_URL: z.string().url(),

  // Anthropic AI
  ANTHROPIC_API_KEY: z.string().min(1),

  // Cron Secret
  CRON_SECRET: z.string().min(1),

  // CSRF Protection
  CSRF_SECRET: z.string().min(32, 'CSRF_SECRET must be at least 32 characters'),

  // Email (optional)
  RESEND_API_KEY: z.string().min(1).optional(),
  FROM_EMAIL: z.string().email().optional(),

  // Upstash Redis (optional - for serverless rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  // Logging (optional - for production logging)
  AXIOM_DATASET: z.string().min(1).optional(),
  AXIOM_TOKEN: z.string().min(1).optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

// Validate environment variables on module load
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map(e => e.path.join('.')).join(', ')
      throw new Error(
        `Missing or invalid environment variables: ${missing}\n` +
        `Please check your .env file against .env.example`
      )
    }
    throw error
  }
}

export const env = validateEnv()
