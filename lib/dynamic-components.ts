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
    ssr: false, // FilterBar doesn't need SSR as it's client-side only
  }
)

export const DynamicUserMenu = dynamic(
  () => import('@/components/UserMenu').then((mod) => ({ default: mod.UserMenu })),
  {
    ssr: false, // UserMenu needs client-side auth state
  }
)

export const DynamicMobileNav = dynamic(
  () => import('@/components/MobileNav').then((mod) => ({ default: mod.MobileNav })),
  {
    ssr: false,
  }
)

export const DynamicSaveButton = dynamic(
  () => import('@/components/SaveButton').then((mod) => ({ default: mod.SaveButton })),
  {
    ssr: false, // SaveButton requires auth state
  }
)
