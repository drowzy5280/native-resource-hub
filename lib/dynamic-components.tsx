/**
 * Dynamic component imports for code splitting
 * This reduces the initial bundle size by lazy-loading components
 */

import dynamic from 'next/dynamic'
import React, { ComponentType } from 'react'

// Loading fallback components
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-pine border-t-transparent" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

function ChartLoadingFallback() {
  return (
    <div className="bg-desert/20 rounded-earth-lg p-8 animate-pulse">
      <div className="h-64 bg-desert/40 rounded-earth" />
    </div>
  )
}

/**
 * Lazy-loaded Recharts components
 * These are heavy dependencies (~500kb) that should only load when needed
 */
export const LazyLineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart as ComponentType<any>),
  {
    loading: () => <ChartLoadingFallback />,
    ssr: false,
  }
)

export const LazyBarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart as ComponentType<any>),
  {
    loading: () => <ChartLoadingFallback />,
    ssr: false,
  }
)

export const LazyPieChart = dynamic(
  () => import('recharts').then((mod) => mod.PieChart as ComponentType<any>),
  {
    loading: () => <ChartLoadingFallback />,
    ssr: false,
  }
)

export const LazyAreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart as ComponentType<any>),
  {
    loading: () => <ChartLoadingFallback />,
    ssr: false,
  }
)

// Dynamically import heavy client components with loading states

export const DynamicFilterBar = dynamic(
  () => import('@/components/FilterBar').then((mod) => ({ default: mod.FilterBar })),
  {
    ssr: false, // FilterBar doesn't need SSR as it's client-side only
  }
)

export const DynamicMobileNav = dynamic(
  () => import('@/components/MobileNav').then((mod) => ({ default: mod.MobileNav })),
  {
    ssr: false,
  }
)

// Heavy filter components (400+ lines each)
export const DynamicGrantFilterBar = dynamic(
  () => import('@/components/GrantFilterBar').then((mod) => ({ default: mod.GrantFilterBar })),
  {
    ssr: false,
    loading: () => <div className="h-16 bg-gray-100 animate-pulse rounded-earth" />,
  }
)

export const DynamicScholarshipFilterBar = dynamic(
  () => import('@/components/ScholarshipFilterBar').then((mod) => ({ default: mod.ScholarshipFilterBar })),
  {
    ssr: false,
    loading: () => <div className="h-16 bg-gray-100 animate-pulse rounded-earth" />,
  }
)

export const DynamicAdvancedFilterBar = dynamic(
  () => import('@/components/AdvancedFilterBar').then((mod) => ({ default: mod.AdvancedFilterBar })),
  {
    ssr: false,
    loading: () => <div className="h-16 bg-gray-100 animate-pulse rounded-earth" />,
  }
)

// Eligibility Checker Chatbot (485 lines - heaviest component)
export const DynamicEligibilityCheckerChatbot = dynamic(
  () => import('@/components/EligibilityCheckerChatbot').then((mod) => ({ default: mod.EligibilityCheckerChatbot })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-earth-lg shadow-soft p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-32 bg-gray-200 rounded mt-4" />
        </div>
      </div>
    ),
  }
)

// Comparison Modal
export const DynamicComparisonModal = dynamic(
  () => import('@/components/ComparisonModal').then((mod) => ({ default: mod.ComparisonModal })),
  {
    ssr: false,
  }
)

// Resource Stats Dashboard
export const DynamicResourceStatsDashboard = dynamic(
  () => import('@/components/ResourceStatsDashboard').then((mod) => ({ default: mod.ResourceStatsDashboard })),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-earth h-24" />
        ))}
      </div>
    ),
  }
)

// Recommendations Panel
export const DynamicRecommendationsPanel = dynamic(
  () => import('@/components/RecommendationsPanel').then((mod) => ({ default: mod.RecommendationsPanel })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-earth h-32" />
        ))}
      </div>
    ),
  }
)

// Keyboard Shortcuts (not critical for initial render)
export const DynamicKeyboardShortcuts = dynamic(
  () => import('@/components/KeyboardShortcuts').then((mod) => ({ default: mod.KeyboardShortcuts })),
  {
    ssr: false,
  }
)

// Swipeable Container
export const DynamicSwipeableContainer = dynamic(
  () => import('@/components/SwipeableContainer').then((mod) => ({ default: mod.SwipeableContainer })),
  {
    ssr: false,
  }
)

// Search Bar with suggestions
export const DynamicSearchBar = dynamic(
  () => import('@/components/SearchBar').then((mod) => ({ default: mod.SearchBar })),
  {
    ssr: false,
    loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded-earth" />,
  }
)
