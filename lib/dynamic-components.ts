/**
 * Dynamic component imports for code splitting
 * This reduces the initial bundle size by lazy-loading components
 */

import dynamic from 'next/dynamic'
import { LoadingSpinner } from '@/components/LoadingSpinner'

// Dynamically import heavy client components with loading states

export const DynamicFilterBar = dynamic(
  () => import('@/components/FilterBar').then((mod) => ({ default: mod.FilterBar })),
  {
    loading: () => (
      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-4 mb-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-earth-sand/30 rounded w-1/4"></div>
            <div className="h-10 bg-earth-sand/30 rounded"></div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-earth-sand/30 rounded w-1/4"></div>
            <div className="h-10 bg-earth-sand/30 rounded"></div>
          </div>
        </div>
      </div>
    ),
    ssr: false, // FilterBar doesn't need SSR as it's client-side only
  }
)

export const DynamicUserMenu = dynamic(
  () => import('@/components/UserMenu').then((mod) => ({ default: mod.UserMenu })),
  {
    loading: () => <div className="w-8 h-8 bg-earth-sand/30 rounded-full animate-pulse" />,
    ssr: false, // UserMenu needs client-side auth state
  }
)

export const DynamicMobileNav = dynamic(
  () => import('@/components/MobileNav').then((mod) => ({ default: mod.MobileNav })),
  {
    loading: () => (
      <button className="md:hidden p-2 rounded-earth">
        <div className="w-6 h-6 bg-earth-sand/30 rounded animate-pulse"></div>
      </button>
    ),
    ssr: false,
  }
)

export const DynamicSaveButton = dynamic(
  () => import('@/components/SaveButton').then((mod) => ({ default: mod.SaveButton })),
  {
    loading: () => <LoadingSpinner size="sm" />,
    ssr: false, // SaveButton requires auth state
  }
)
