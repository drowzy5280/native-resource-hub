'use client'

import { useEffect } from 'react'
import { useRecentlyViewed, ViewedItem } from './RecentlyViewedContext'

interface ViewTrackerProps {
  item: Omit<ViewedItem, 'viewedAt'>
}

export function ViewTracker({ item }: ViewTrackerProps) {
  const { addItem } = useRecentlyViewed()

  useEffect(() => {
    // Add item to recently viewed when component mounts
    addItem(item)
  }, [item.id, item.type]) // Only re-run if id or type changes

  // This component doesn't render anything
  return null
}
