'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type ViewedItemType = 'resource' | 'scholarship' | 'tribe'

export interface ViewedItem {
  id: string
  type: ViewedItemType
  name: string
  description: string
  viewedAt: string
  metadata?: {
    amount?: string
    deadline?: string
    state?: string
    tags?: string[]
  }
}

interface RecentlyViewedContextType {
  items: ViewedItem[]
  addItem: (item: Omit<ViewedItem, 'viewedAt'>) => void
  clearAll: () => void
  getItemsByType: (type: ViewedItemType) => ViewedItem[]
  maxItems: number
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

const MAX_ITEMS = 20
const STORAGE_KEY = 'recently_viewed'

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ViewedItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setItems(parsed)
      } catch (error) {
        console.error('Failed to parse recently viewed data:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, mounted])

  const addItem = (item: Omit<ViewedItem, 'viewedAt'>) => {
    setItems(prev => {
      // Remove existing item if present
      const filtered = prev.filter(i => i.id !== item.id || i.type !== item.type)

      // Add new item at the beginning
      const updated = [{
        ...item,
        viewedAt: new Date().toISOString(),
      }, ...filtered]

      // Keep only the most recent MAX_ITEMS
      return updated.slice(0, MAX_ITEMS)
    })
  }

  const clearAll = () => {
    setItems([])
  }

  const getItemsByType = (type: ViewedItemType): ViewedItem[] => {
    return items.filter(item => item.type === type)
  }

  return (
    <RecentlyViewedContext.Provider
      value={{
        items,
        addItem,
        clearAll,
        getItemsByType,
        maxItems: MAX_ITEMS,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext)
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider')
  }
  return context
}
