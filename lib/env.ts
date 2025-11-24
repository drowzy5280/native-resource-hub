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
