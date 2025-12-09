'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

interface GoogleAdsenseProps {
  publisherId: string // Your AdSense publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
}

export function GoogleAdsense({ publisherId }: GoogleAdsenseProps) {
  if (!publisherId || process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="lazyOnload" // Changed from beforeInteractive for better performance
    />
  )
}

// Ad slot configuration for different placements
export const AD_SLOTS = {
  // Create separate ad units in your AdSense dashboard for better tracking
  horizontal: '9740169936',
  sidebar: '9740169936',
  inArticle: '9740169936',
  anchor: '9740169936',
  multiplex: '9740169936',
} as const

type AdSlotType = keyof typeof AD_SLOTS

// Display Ad Component with lazy loading
interface AdUnitProps {
  slot?: AdSlotType | string // Named slot or custom slot ID
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  fullWidthResponsive?: boolean
  style?: React.CSSProperties
  className?: string
  lazyLoad?: boolean // Enable lazy loading for below-fold ads
}

export function AdUnit({
  slot = 'horizontal',
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = {},
  className = '',
  lazyLoad = true,
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(!lazyLoad)
  const [adLoaded, setAdLoaded] = useState(false)

  // Get the actual slot ID
  const adSlot = slot in AD_SLOTS ? AD_SLOTS[slot as AdSlotType] : slot

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazyLoad || isVisible) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '200px', // Start loading 200px before visible
        threshold: 0,
      }
    )

    if (adRef.current) {
      observer.observe(adRef.current)
    }

    return () => observer.disconnect()
  }, [lazyLoad, isVisible])

  // Initialize ad when visible
  useEffect(() => {
    if (!isVisible || adLoaded) return

    try {
      // @ts-ignore
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
        setAdLoaded(true)
      }
    } catch (err) {
      console.error('AdSense ad unit error:', err)
    }
  }, [isVisible, adLoaded])

  // Development placeholder
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div
        ref={adRef}
        className={`bg-gray-200 dark:bg-gray-700 p-4 text-center border-2 border-dashed border-gray-400 dark:border-gray-500 rounded ${className}`}
        style={style}
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">Ad Placeholder (Development Mode)</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Slot: {slot} | Format: {adFormat}</p>
      </div>
    )
  }

  return (
    <div ref={adRef} className={className} style={{ minHeight: isVisible ? undefined : '100px', ...style }}>
      {isVisible ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', ...style }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive.toString()}
        />
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded" style={{ minHeight: '100px', ...style }} />
      )}
    </div>
  )
}

// In-Article Ad - optimized for content
export function InArticleAd({ className = '' }: { className?: string }) {
  return (
    <div className={`my-8 ${className}`}>
      <AdUnit
        slot="inArticle"
        adFormat="fluid"
        style={{ minHeight: '250px' }}
        lazyLoad={true}
      />
    </div>
  )
}

// Sidebar Ad - for desktop sidebars
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <div className={`sticky top-24 ${className}`}>
      <AdUnit
        slot="sidebar"
        adFormat="vertical"
        style={{ minHeight: '600px', maxWidth: '300px' }}
        lazyLoad={true}
      />
    </div>
  )
}

// Horizontal Banner Ad
export function BannerAd({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <AdUnit
        slot="horizontal"
        adFormat="horizontal"
        style={{ minHeight: '100px', width: '100%', maxWidth: '970px' }}
        lazyLoad={true}
      />
    </div>
  )
}

// Anchor Ad for Mobile - sticks to bottom of screen
interface AnchorAdProps {
  position?: 'top' | 'bottom'
}

export function AnchorAd({ position = 'bottom' }: AnchorAdProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Only show on mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile || !isVisible || process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <div
      className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-40 bg-white dark:bg-gray-900 shadow-lg safe-area-${position}`}
      style={{ paddingBottom: position === 'bottom' ? 'env(safe-area-inset-bottom)' : undefined }}
    >
      <div className="relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-8 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-t"
          aria-label="Close ad"
        >
          Close
        </button>
        <AdUnit
          slot="anchor"
          adFormat="horizontal"
          style={{ minHeight: '50px' }}
          lazyLoad={false} // Anchor ads should load immediately
        />
      </div>
    </div>
  )
}

// Multiplex Ad - for related content sections
export function MultiplexAd({ className = '' }: { className?: string }) {
  return (
    <div className={`my-8 ${className}`}>
      <AdUnit
        slot="multiplex"
        adFormat="auto"
        style={{ minHeight: '300px' }}
        lazyLoad={true}
      />
    </div>
  )
}
