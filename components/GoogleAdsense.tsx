'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface GoogleAdsenseProps {
  publisherId: string // Your AdSense publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
}

export function GoogleAdsense({ publisherId }: GoogleAdsenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <>
      {/* AdSense Script */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  )
}

// Display Ad Component
interface AdUnitProps {
  adSlot: string // Your ad slot ID
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  fullWidthResponsive?: boolean
  style?: React.CSSProperties
}

export function AdUnit({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = {}
}: AdUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense ad unit error:', err)
    }
  }, [])

  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className="bg-gray-200 p-4 text-center border-2 border-dashed border-gray-400 rounded" style={style}>
        <p className="text-sm text-gray-600">Ad Placeholder (Development Mode)</p>
        <p className="text-xs text-gray-500">Slot: {adSlot}</p>
      </div>
    )
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  )
}
