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

export const DynamicMobileNav = dynamic(
  () => import('@/components/MobileNav').then((mod) => ({ default: mod.MobileNav })),
  {
    ssr: false,
  }
)
