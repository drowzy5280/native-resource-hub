/**
 * LocalStorage utilities for client-side data persistence
 */

export interface SavedItem {
  id: string
  type: 'resource' | 'scholarship' | 'tribe'
  title: string
  savedAt: string
}

export interface RecentlyViewedItem {
  id: string
  type: 'resource' | 'scholarship' | 'tribe'
  title: string
  viewedAt: string
}

export interface ComparisonItem {
  id: string
  name: string
  amount?: string | null
  deadline?: string | null
  description: string
  tags: string[]
  url?: string | null
}

const KEYS = {
  SAVED_ITEMS: 'trh_saved_items',
  RECENTLY_VIEWED: 'trh_recently_viewed',
  DARK_MODE: 'trh_dark_mode',
  COMPARISON: 'trh_comparison',
} as const

// Helper to safely access localStorage
const isBrowser = typeof window !== 'undefined'

/**
 * Saved Items Management
 */
export const savedItems = {
  getAll(): SavedItem[] {
    if (!isBrowser) return []
    try {
      const data = localStorage.getItem(KEYS.SAVED_ITEMS)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  add(item: Omit<SavedItem, 'savedAt'>): void {
    if (!isBrowser) return
    try {
      const items = this.getAll()
      const exists = items.find((i) => i.id === item.id && i.type === item.type)
      if (!exists) {
        items.unshift({ ...item, savedAt: new Date().toISOString() })
        localStorage.setItem(KEYS.SAVED_ITEMS, JSON.stringify(items))
      }
    } catch (error) {
      console.error('Failed to save item:', error)
    }
  },

  remove(id: string, type: SavedItem['type']): void {
    if (!isBrowser) return
    try {
      const items = this.getAll()
      const filtered = items.filter((i) => !(i.id === id && i.type === type))
      localStorage.setItem(KEYS.SAVED_ITEMS, JSON.stringify(filtered))
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  },

  isSaved(id: string, type: SavedItem['type']): boolean {
    if (!isBrowser) return false
    const items = this.getAll()
    return items.some((i) => i.id === id && i.type === type)
  },

  clear(): void {
    if (!isBrowser) return
    localStorage.removeItem(KEYS.SAVED_ITEMS)
  },
}

/**
 * Recently Viewed Management
 */
export const recentlyViewed = {
  getAll(): RecentlyViewedItem[] {
    if (!isBrowser) return []
    try {
      const data = localStorage.getItem(KEYS.RECENTLY_VIEWED)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  add(item: Omit<RecentlyViewedItem, 'viewedAt'>): void {
    if (!isBrowser) return
    try {
      let items = this.getAll()
      // Remove if already exists
      items = items.filter((i) => !(i.id === item.id && i.type === item.type))
      // Add to front
      items.unshift({ ...item, viewedAt: new Date().toISOString() })
      // Keep only last 20
      items = items.slice(0, 20)
      localStorage.setItem(KEYS.RECENTLY_VIEWED, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to add recently viewed:', error)
    }
  },

  clear(): void {
    if (!isBrowser) return
    localStorage.removeItem(KEYS.RECENTLY_VIEWED)
  },
}

/**
 * Dark Mode Management
 */
export const darkMode = {
  get(): boolean {
    if (!isBrowser) return false
    try {
      const value = localStorage.getItem(KEYS.DARK_MODE)
      if (value !== null) {
        return value === 'true'
      }
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch {
      return false
    }
  },

  set(enabled: boolean): void {
    if (!isBrowser) return
    try {
      localStorage.setItem(KEYS.DARK_MODE, String(enabled))
    } catch (error) {
      console.error('Failed to set dark mode:', error)
    }
  },

  toggle(): boolean {
    const newValue = !this.get()
    this.set(newValue)
    return newValue
  },
}

/**
 * Scholarship Comparison Management
 */
export const comparison = {
  getAll(): ComparisonItem[] {
    if (!isBrowser) return []
    try {
      const data = localStorage.getItem(KEYS.COMPARISON)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  add(item: ComparisonItem): boolean {
    if (!isBrowser) return false
    try {
      const items = this.getAll()
      if (items.length >= 3) {
        return false // Max 3 items
      }
      if (items.find((i) => i.id === item.id)) {
        return false // Already exists
      }
      items.push(item)
      localStorage.setItem(KEYS.COMPARISON, JSON.stringify(items))
      return true
    } catch (error) {
      console.error('Failed to add comparison item:', error)
      return false
    }
  },

  remove(id: string): void {
    if (!isBrowser) return
    try {
      const items = this.getAll()
      const filtered = items.filter((i) => i.id !== id)
      localStorage.setItem(KEYS.COMPARISON, JSON.stringify(filtered))
    } catch (error) {
      console.error('Failed to remove comparison item:', error)
    }
  },

  clear(): void {
    if (!isBrowser) return
    localStorage.removeItem(KEYS.COMPARISON)
  },

  isInComparison(id: string): boolean {
    if (!isBrowser) return false
    const items = this.getAll()
    return items.some((i) => i.id === id)
  },
}
