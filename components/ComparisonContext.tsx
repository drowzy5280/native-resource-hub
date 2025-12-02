'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface ComparisonScholarship {
  id: string
  name: string
  organization: string
  amount: string
  deadline: string | null
  description: string
  eligibility: string[]
  state: string | null
}

interface ComparisonContextType {
  scholarships: ComparisonScholarship[]
  addScholarship: (scholarship: ComparisonScholarship) => boolean
  removeScholarship: (id: string) => void
  clearAll: () => void
  isInComparison: (id: string) => boolean
  maxItems: number
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

const MAX_COMPARISON_ITEMS = 4
const STORAGE_KEY = 'scholarship_comparison'

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [scholarships, setScholarships] = useState<ComparisonScholarship[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setScholarships(parsed)
      } catch (error) {
        console.error('Failed to parse comparison data:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Save to localStorage whenever scholarships change
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scholarships))
  }, [scholarships, mounted])

  const addScholarship = (scholarship: ComparisonScholarship): boolean => {
    // Check if already in comparison
    if (scholarships.some(s => s.id === scholarship.id)) {
      return false
    }

    // Check if at max capacity
    if (scholarships.length >= MAX_COMPARISON_ITEMS) {
      return false
    }

    setScholarships(prev => [...prev, scholarship])
    return true
  }

  const removeScholarship = (id: string) => {
    setScholarships(prev => prev.filter(s => s.id !== id))
  }

  const clearAll = () => {
    setScholarships([])
  }

  const isInComparison = (id: string): boolean => {
    return scholarships.some(s => s.id === id)
  }

  return (
    <ComparisonContext.Provider
      value={{
        scholarships,
        addScholarship,
        removeScholarship,
        clearAll,
        isInComparison,
        maxItems: MAX_COMPARISON_ITEMS,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}
