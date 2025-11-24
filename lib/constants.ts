// AI Parsing Constants
export const MAX_HTML_LENGTH = 50000 // Maximum HTML characters to send to Claude
export const AI_BATCH_DELAY_MS = 1000 // Delay between AI requests to avoid rate limiting
export const AI_MODEL = 'claude-3-5-sonnet-20241022' // Claude model for parsing
export const AI_MAX_TOKENS = 2048 // Maximum tokens in AI response

// Pagination Constants
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100
export const HOME_PAGE_RECENT_RESOURCES = 6
export const HOME_PAGE_UPCOMING_SCHOLARSHIPS = 4

// Rate Limiting (requests per minute)
export const RATE_LIMIT_API = 60
export const RATE_LIMIT_ADMIN = 30
export const RATE_LIMIT_AI = 10

// Cache TTL (in seconds)
export const CACHE_TTL_SHORT = 60 // 1 minute
export const CACHE_TTL_MEDIUM = 300 // 5 minutes
export const CACHE_TTL_LONG = 3600 // 1 hour
