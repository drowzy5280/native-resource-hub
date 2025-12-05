/**
 * Caching layer for AI responses to reduce API calls and improve performance
 */

import { env } from './env'
import { CACHE_TTL_LONG } from './constants'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

// In-memory cache as fallback
const memoryCache = new Map<string, CacheEntry<any>>()

// Clean up expired entries every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now()
    const entries = Array.from(memoryCache.entries())
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > entry.ttl * 1000) {
        memoryCache.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

/**
 * Creates a cache key by hashing the input
 * @param prefix - Cache key prefix (e.g., 'recommendations', 'eligibility')
 * @param data - Data to hash for cache key
 * @returns Cache key string
 */
export function createCacheKey(prefix: string, data: any): string {
  const jsonString = JSON.stringify(data)
  // Simple hash function (for production, consider using crypto.subtle.digest)
  let hash = 0
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return `${prefix}:${hash.toString(36)}`
}

/**
 * Gets data from cache
 * @param key - Cache key
 * @returns Cached data or null if not found/expired
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  // Try in-memory cache
  const entry = memoryCache.get(key)
  if (entry) {
    const now = Date.now()
    if (now - entry.timestamp <= entry.ttl * 1000) {
      return entry.data as T
    }
    // Expired, remove it
    memoryCache.delete(key)
  }

  return null
}

/**
 * Sets data in cache
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Time to live in seconds (default: 1 hour)
 */
export async function setInCache<T>(
  key: string,
  data: T,
  ttl: number = CACHE_TTL_LONG
): Promise<void> {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  })

  // Limit cache size to prevent memory issues
  if (memoryCache.size > 1000) {
    // Remove oldest entries
    const entries = Array.from(memoryCache.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    for (let i = 0; i < 100; i++) {
      memoryCache.delete(entries[i][0])
    }
  }
}

/**
 * Removes data from cache
 * @param key - Cache key
 */
export async function removeFromCache(key: string): Promise<void> {
  memoryCache.delete(key)
}

/**
 * Clears all cache entries with a given prefix
 * @param prefix - Cache key prefix to clear
 */
export async function clearCacheByPrefix(prefix: string): Promise<void> {
  const keys = Array.from(memoryCache.keys())
  for (const key of keys) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key)
    }
  }
}

/**
 * Gets data from cache or computes it if not found
 * @param key - Cache key
 * @param computeFn - Function to compute data if not in cache
 * @param ttl - Time to live in seconds
 * @returns Cached or computed data
 */
export async function getCachedOrCompute<T>(
  key: string,
  computeFn: () => Promise<T>,
  ttl: number = CACHE_TTL_LONG
): Promise<T> {
  // Try to get from cache
  const cached = await getFromCache<T>(key)
  if (cached !== null) {
    return cached
  }

  // Compute and cache
  const data = await computeFn()
  await setInCache(key, data, ttl)
  return data
}

/**
 * Helper for caching AI recommendations
 * @param userContext - User context string for cache key
 * @param computeFn - Function to generate recommendations
 * @returns Cached or freshly generated recommendations
 */
export async function getCachedRecommendations<T>(
  userContext: string,
  computeFn: () => Promise<T>
): Promise<T> {
  const cacheKey = createCacheKey('recommendations', userContext)
  return getCachedOrCompute(cacheKey, computeFn, CACHE_TTL_LONG)
}

/**
 * Helper for caching AI eligibility checks
 * @param answers - User answers for cache key
 * @param computeFn - Function to check eligibility
 * @returns Cached or freshly generated eligibility results
 */
export async function getCachedEligibility<T>(
  answers: any,
  computeFn: () => Promise<T>
): Promise<T> {
  const cacheKey = createCacheKey('eligibility', answers)
  return getCachedOrCompute(cacheKey, computeFn, CACHE_TTL_LONG)
}

/**
 * Invalidates recommendation cache for a user
 * @param userId - User ID to invalidate cache for
 */
export async function invalidateUserRecommendations(userId: string): Promise<void> {
  await clearCacheByPrefix(`recommendations:${userId}`)
}
