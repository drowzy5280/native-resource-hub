import type { Metadata, Viewport } from 'next'
import { Work_Sans, Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { MobileNav } from '@/components/MobileNav'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAdsense } from '@/components/GoogleAdsense'
import { OrganizationSchema, WebSiteSchema } from '@/components/StructuredData'
import { ToastProvider } from '@/components/Toast'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import { GeometricPattern } from '@/components/Patterns'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ComparisonProvider } from '@/components/ComparisonContext'
import { ComparisonBar } from '@/components/ComparisonBar'
import { RecentlyViewedProvider } from '@/components/RecentlyViewedContext'
import { BottomNav } from '@/components/BottomNav'
import { OfflineIndicator } from '@/components/OfflineIndicator'
import { AccessibilityControls } from '@/components/AccessibilityControls'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'
import { AnchorAd } from '@/components/GoogleAdsense'

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'),
  title: {
    default: 'Tribal Resource Hub | Native American Resources, Benefits, Scholarships & Programs',
    template: '%s | Tribal Resource Hub',
  },
  description: 'Discover 175+ verified resources, scholarships, and benefits for Native American and Indigenous communities. Access federal programs, state assistance, tribal services, nonprofit organizations, and educational opportunities across all 50 states. Free comprehensive guide for enrolled tribal members, descendants, students, elders, and first-time benefit seekers.',
  keywords: [
    'Native American resources',
    'Indigenous resources',
    'tribal benefits',
    'Native American scholarships',
    'Indian Health Service',
    'BIA assistance',
    'tribal programs',
    'Indigenous support',
    'Native American education',
    'tribal enrollment',
    'federal Indian programs',
    'state tribal assistance',
    'Native American healthcare',
    'tribal housing assistance',
    'Indigenous nonprofits',
    'Native American legal services',
    'tribal emergency assistance',
    'urban Indian health',
    'Native American culture',
    'First Nations resources',
    'Alaska Native programs',
    'Native Hawaiian services',
  ],
  authors: [{ name: 'Tribal Resource Hub' }],
  creator: 'Tribal Resource Hub',
  publisher: 'Tribal Resource Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tribal Resource Hub | Native American Resources & Benefits Guide',
    description: 'Free comprehensive guide to 175+ Native American resources, scholarships, and benefits. Access federal programs, state assistance, tribal services, and nonprofit organizations serving Indigenous communities nationwide.',
    url: '/',
    siteName: 'Tribal Resource Hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tribal Resource Hub - Connecting Indigenous Communities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tribal Resource Hub | Native American Resources & Benefits',
    description: 'Your free guide to 175+ Native American resources, scholarships, and benefits. Federal programs, state assistance, tribal services, and nonprofits serving Indigenous communities.',
    creator: '@tribalresourcehub',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tribal Resource Hub',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${workSans.variable} ${inter.variable}`}>
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
        <meta name="theme-color" content="#7A9B7E" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tribal Hub" />
        <link rel="apple-touch-icon" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
      </head>
      <body className="font-body bg-cream antialiased">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-pine focus:text-white focus:rounded-earth focus:shadow-soft-lg focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <ServiceWorkerRegister />
        <OfflineIndicator />
        <AccessibilityControls />
        <ThemeProvider>
          <RecentlyViewedProvider>
          <ComparisonProvider>
            <ToastProvider>
              <GoogleAdsense publisherId={process.env.NEXT_PUBLIC_ADSENSE_ID || ''} />

          {/* Header */}
        <nav className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-sm border-b border-desert/40 dark:border-gray-700 sticky top-0 z-50 shadow-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-pine to-gold rounded-full flex items-center justify-center group-hover:shadow-soft transition-all flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-text dark:text-white">
                  <span className="hidden sm:inline">Tribal Resource Hub</span>
                  <span className="sm:hidden">Tribal Hub</span>
                </span>
              </Link>

              <div className="flex items-center space-x-4">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                  <Link
                    href="/resources"
                    className="px-4 py-2 text-text-secondary hover:text-pine transition-colors font-medium rounded-earth hover:bg-desert/30 dark:text-gray-300 dark:hover:text-gold dark:hover:bg-white/10"
                  >
                    Resources
                  </Link>
                  <Link
                    href="/nonprofits"
                    className="px-4 py-2 text-text-secondary hover:text-pine transition-colors font-medium rounded-earth hover:bg-desert/30 dark:text-gray-300 dark:hover:text-gold dark:hover:bg-white/10"
                  >
                    Nonprofits
                  </Link>
                  <Link
                    href="/tribes"
                    className="px-4 py-2 text-text-secondary hover:text-pine transition-colors font-medium rounded-earth hover:bg-desert/30 dark:text-gray-300 dark:hover:text-gold dark:hover:bg-white/10"
                  >
                    Tribes
                  </Link>
                  <Link
                    href="/scholarships"
                    className="px-4 py-2 text-text-secondary hover:text-pine transition-colors font-medium rounded-earth hover:bg-desert/30 dark:text-gray-300 dark:hover:text-gold dark:hover:bg-white/10"
                  >
                    Scholarships
                  </Link>
                </div>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Mobile Navigation */}
                <MobileNav />
              </div>
            </div>
          </div>
        </nav>

        <ErrorBoundary>
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
        </ErrorBoundary>

        <footer className="bg-desert/30 border-t border-desert/50 mt-16 sm:mt-20 lg:mt-24 relative overflow-hidden">
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 text-pine opacity-[0.03]">
            <GeometricPattern className="w-full h-full" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
              <div className="sm:col-span-2 md:col-span-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pine to-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-text">Tribal Resource Hub</h3>
                </div>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  A community-driven hub connecting Indigenous families, youth, and elders to trusted resources, programs, and support.
                </p>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-heading font-semibold mb-3 sm:mb-4 text-text">Quick Links</h4>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <li>
                    <Link href="/resources" className="text-text-secondary hover:text-pine transition-colors inline-block py-1 min-h-[44px] flex items-center">
                      Browse Resources
                    </Link>
                  </li>
                  <li>
                    <Link href="/nonprofits" className="text-text-secondary hover:text-pine transition-colors inline-block py-1 min-h-[44px] flex items-center">
                      Nonprofits
                    </Link>
                  </li>
                  <li>
                    <Link href="/tribes" className="text-text-secondary hover:text-pine transition-colors inline-block py-1 min-h-[44px] flex items-center">
                      Find Tribes
                    </Link>
                  </li>
                  <li>
                    <Link href="/scholarships" className="text-text-secondary hover:text-pine transition-colors inline-block py-1 min-h-[44px] flex items-center">
                      Scholarships
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-heading font-semibold mb-3 sm:mb-4 text-text">Our Mission</h4>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  Supporting Indigenous communities by providing easy access to resources from federal, state, and tribal sources.
                </p>
              </div>
            </div>

            <div className="border-t border-desert/50 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-text-muted">
              <p>&copy; {new Date().getFullYear()} Tribal Resource Hub. All rights reserved.</p>
            </div>
          </div>
        </footer>
                <Analytics />
                <ComparisonBar />
                <BottomNav />
                <KeyboardShortcuts />
                <AnchorAd position="bottom" />
              </ToastProvider>
            </ComparisonProvider>
          </RecentlyViewedProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
