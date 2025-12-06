// AI Parsing Constants
export const MAX_HTML_LENGTH = 50000 // Maximum HTML characters to send to Claude
export const AI_BATCH_DELAY_MS = 1000 // Delay between AI requests to avoid rate limiting
export const AI_MODEL = 'claude-3-5-sonnet-20241022' // Claude model for parsing
export const AI_MAX_TOKENS = 2048 // Maximum tokens in AI response
export const AI_MAX_TOKENS_RECOMMENDATIONS = 3000 // Max tokens for recommendations
export const AI_MAX_TOKENS_ELIGIBILITY = 2000 // Max tokens for eligibility checking

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

// Resource/Scholarship Query Limits
export const MAX_RESOURCES_FOR_RECOMMENDATIONS = 50
export const MAX_SCHOLARSHIPS_FOR_RECOMMENDATIONS = 30
export const MAX_SAVED_RESOURCES_ANALYZED = 20
export const TOP_RECOMMENDATIONS_COUNT = 5

// Link Checking
export const LINK_CHECK_BATCH_SIZE = 10
export const LINK_CHECK_BATCH_DELAY_MS = 500
export const LINK_CHECK_REQUEST_DELAY_MS = 100
export const LINK_CHECK_TIMEOUT_MS = 5000

// Data Retention (in years/months)
export const RESOURCE_OUTDATED_YEARS = 2
export const SCHOLARSHIP_EXPIRED_YEARS = 1
export const CHANGELOG_RETENTION_MONTHS = 6

// ============================================
// Filter Options (shared across components)
// ============================================

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export const RESOURCE_TYPES: FilterOption[] = [
  { value: 'federal', label: 'Federal' },
  { value: 'state', label: 'State' },
  { value: 'tribal', label: 'Tribal' },
  { value: 'emergency', label: 'Emergency' },
]

export const DIFFICULTIES: FilterOption[] = [
  { value: 'simple', label: 'Simple' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'complex', label: 'Complex' },
]

export const POPULAR_TAGS: FilterOption[] = [
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'housing', label: 'Housing' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'youth', label: 'Youth' },
  { value: 'elders', label: 'Elders' },
  { value: 'business', label: 'Business' },
  { value: 'language', label: 'Language' },
  { value: 'legal', label: 'Legal' },
  { value: 'cultural', label: 'Cultural' },
]

export const AMOUNT_RANGES: FilterOption[] = [
  { value: '0-1000', label: 'Under $1,000' },
  { value: '1000-5000', label: '$1,000 - $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000-50000', label: '$10,000+' },
]

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
] as const

export type USState = typeof US_STATES[number]

// ============================================
// Ad Configuration
// ============================================

export const AD_SLOTS = {
  horizontal: '9740169936',
  sidebar: '9740169936',
  inArticle: '9740169936',
} as const

// ============================================
// Scholarship Deadline Thresholds (days)
// ============================================

export const DEADLINE_REMINDER_DAYS = [1, 3, 7] as const
export const DEADLINE_URGENT_DAYS = 7
export const DEADLINE_WARNING_DAYS = 14
export const DEADLINE_UPCOMING_DAYS = 30
