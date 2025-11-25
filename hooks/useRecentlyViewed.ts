'use client'

import { useEffect } from 'react'
import { recentlyViewed, RecentlyViewedItem } from '@/lib/localStorage'

/**
 * Hook to track recently viewed items
 */
export function useRecentlyViewed(
  id: string,
  type: RecentlyViewedItem['type'],
  title: string
) {
  useEffect(() => {
    // Add to recently viewed when component mounts
    recentlyViewed.add({ id, type, title })
  }, [id, type, title])
}

/**
 * Hook to get all recently viewed items
 */
export function useRecentlyViewedList() {
  const items = recentlyViewed.getAll()
  return items
}
