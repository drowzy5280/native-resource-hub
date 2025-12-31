import { QueryClient } from '@tanstack/react-query'

/**
 * Stale time configuration per data type
 * Different data types have different freshness requirements
 */
export const STALE_TIMES = {
  // Static data - rarely changes
  tribes: 10 * 60 * 1000, // 10 minutes
  states: 30 * 60 * 1000, // 30 minutes

  // Semi-static data - changes occasionally
  resources: 3 * 60 * 1000, // 3 minutes
  nonprofits: 5 * 60 * 1000, // 5 minutes
  grants: 5 * 60 * 1000, // 5 minutes

  // Time-sensitive data - deadlines matter
  scholarships: 60 * 1000, // 1 minute
  closingSoon: 30 * 1000, // 30 seconds

  // User-specific data
  saved: 60 * 1000, // 1 minute
  user: 5 * 60 * 1000, // 5 minutes

  // Real-time needs
  search: 0, // Always fresh
  analytics: 30 * 1000, // 30 seconds
} as const

/**
 * Query key prefixes for consistent cache management
 */
export const QUERY_KEYS = {
  resources: ['resources'] as const,
  scholarships: ['scholarships'] as const,
  tribes: ['tribes'] as const,
  grants: ['grants'] as const,
  nonprofits: ['nonprofits'] as const,
  saved: ['saved'] as const,
  user: ['user'] as const,
  search: ['search'] as const,
  analytics: ['analytics'] as const,
} as const

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Default stale time for unspecified queries
        staleTime: 60 * 1000,
        // Keep unused data in cache for 5 minutes
        gcTime: 5 * 60 * 1000,
        // Retry failed requests up to 3 times
        retry: 3,
        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Don't refetch on window focus for better UX
        refetchOnWindowFocus: false,
        // Don't refetch on reconnect (can be noisy)
        refetchOnReconnect: 'always',
        // Network mode - online only
        networkMode: 'online',
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        // Network mode for mutations
        networkMode: 'online',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

/**
 * Helper to get stale time for a specific data type
 */
export function getStaleTime(type: keyof typeof STALE_TIMES): number {
  return STALE_TIMES[type]
}

/**
 * Invalidate all queries for a specific entity type
 */
export async function invalidateQueries(
  queryClient: QueryClient,
  type: keyof typeof QUERY_KEYS
) {
  await queryClient.invalidateQueries({ queryKey: QUERY_KEYS[type] })
}

/**
 * Prefetch data for a route
 */
export async function prefetchRouteData(
  queryClient: QueryClient,
  route: 'resources' | 'scholarships' | 'tribes' | 'grants'
) {
  // This can be extended to prefetch specific data for each route
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS[route],
    staleTime: STALE_TIMES[route],
  })
}
