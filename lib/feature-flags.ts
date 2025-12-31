/**
 * Feature Flags System
 * Simple feature flag management for gradual rollouts and A/B testing.
 * Can be extended to use a service like LaunchDarkly or Flagsmith.
 */

/**
 * Feature flag definitions
 */
export interface FeatureFlags {
  // Core features
  enableGrants: boolean
  enableBrokenLinkChecker: boolean
  enableAIRecommendations: boolean
  enableAIEligibility: boolean

  // UI features
  enableDarkMode: boolean
  enableComparisonTool: boolean
  enableRecentlyViewed: boolean
  enableAdvancedFilters: boolean

  // Performance features
  enableFullTextSearch: boolean
  enableRedisRateLimit: boolean

  // Admin features
  enableBulkOperations: boolean
  enableCSVImport: boolean
  enableCSVExport: boolean
  enableAnalyticsDashboard: boolean

  // Experimental features
  enableNewHomepage: boolean
  enableResourceGuides: boolean
  enableSuccessStories: boolean
}

/**
 * Default feature flag values
 */
const DEFAULT_FLAGS: FeatureFlags = {
  // Core features - all enabled
  enableGrants: true,
  enableBrokenLinkChecker: true,
  enableAIRecommendations: true,
  enableAIEligibility: true,

  // UI features - all enabled
  enableDarkMode: true,
  enableComparisonTool: true,
  enableRecentlyViewed: true,
  enableAdvancedFilters: true,

  // Performance features
  enableFullTextSearch: false, // Will enable after migration
  enableRedisRateLimit: true,

  // Admin features - all enabled
  enableBulkOperations: true,
  enableCSVImport: true,
  enableCSVExport: true,
  enableAnalyticsDashboard: true,

  // Experimental features - disabled by default
  enableNewHomepage: false,
  enableResourceGuides: true,
  enableSuccessStories: true,
}

/**
 * Environment variable overrides (NEXT_PUBLIC_FF_* pattern)
 */
function getEnvOverrides(): Partial<FeatureFlags> {
  const overrides: Partial<FeatureFlags> = {}

  // Check for environment variable overrides
  const flagKeys = Object.keys(DEFAULT_FLAGS) as (keyof FeatureFlags)[]

  for (const key of flagKeys) {
    // Convert camelCase to SCREAMING_SNAKE_CASE
    const envKey = `NEXT_PUBLIC_FF_${key
      .replace(/([A-Z])/g, '_$1')
      .toUpperCase()}`

    const envValue = process.env[envKey]

    if (envValue !== undefined) {
      overrides[key] = envValue === 'true' || envValue === '1'
    }
  }

  return overrides
}

/**
 * Cached flags (computed once)
 */
let cachedFlags: FeatureFlags | null = null

/**
 * Get all feature flags with environment overrides applied
 */
export function getFeatureFlags(): FeatureFlags {
  if (cachedFlags) {
    return cachedFlags
  }

  const overrides = getEnvOverrides()
  cachedFlags = { ...DEFAULT_FLAGS, ...overrides }

  return cachedFlags
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags()
  return flags[flag]
}

/**
 * Hook-friendly feature flag getter (for client components)
 */
export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  // This is safe to call from both server and client
  return isFeatureEnabled(flag)
}

/**
 * Get multiple feature flags at once
 */
export function getFeatures<K extends keyof FeatureFlags>(
  keys: K[]
): Pick<FeatureFlags, K> {
  const flags = getFeatureFlags()
  const result = {} as Pick<FeatureFlags, K>

  for (const key of keys) {
    result[key] = flags[key]
  }

  return result
}

/**
 * Conditionally execute code based on a feature flag
 */
export function whenEnabled<T>(
  flag: keyof FeatureFlags,
  fn: () => T,
  fallback?: T
): T | undefined {
  if (isFeatureEnabled(flag)) {
    return fn()
  }
  return fallback
}

/**
 * Higher-order function for feature-gated route handlers
 */
export function withFeatureFlag(
  flag: keyof FeatureFlags,
  handler: Function,
  fallbackMessage = 'This feature is not currently available'
) {
  return async (...args: unknown[]) => {
    if (!isFeatureEnabled(flag)) {
      return new Response(
        JSON.stringify({ error: fallbackMessage }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }
    return handler(...args)
  }
}

/**
 * Reset cached flags (useful for testing)
 */
export function resetFeatureFlags(): void {
  cachedFlags = null
}
