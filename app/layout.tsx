import type { Metadata } from 'next'
import { Work_Sans, Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { MobileNav } from '@/components/MobileNav'
import { UserMenu } from '@/components/UserMenu'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAdsense } from '@/components/GoogleAdsense'
import { OrganizationSchema, WebSiteSchema } from '@/components/StructuredData'

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'),
  title: {
    default: 'Tribal Resource Hub | Native American Resources, Scholarships & Programs',
    template: '%s | Tribal Resource Hub',
  },
  description: 'A community-driven hub connecting Indigenous families, youth, and elders to trusted resources, programs, and support. Find federal, state, and tribal programs, scholarships, and services for Native American communities.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  keywords: [
    'Native American',
    'Indigenous',
    'tribal resources',
    'Native American scholarships',
    'tribal programs',
    'Indigenous support',
    'community resources',
    'federal programs',
    'tribal services',
    'Native American education',
    'tribal assistance',
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
    title: 'Tribal Resource Hub',
    description: 'A community-driven hub connecting Indigenous families, youth, and elders to trusted resources, programs, and support.',
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
    title: 'Tribal Resource Hub',
    description: 'A community-driven hub connecting Indigenous families, youth, and elders to trusted resources, programs, and support.',
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
      </head>
      <body className="font-body bg-cream antialiased">
        <GoogleAdsense publisherId={process.env.NEXT_PUBLIC_ADSENSE_ID || ''} />

        {/* Header */}
        <nav className="bg-white/95 backdrop-blur-sm shadow-soft border-b border-desert/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-clay to-gold rounded-full flex items-center justify-center shadow-soft group-hover:shadow-soft-lg transition-all">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-heading font-bold text-midnight">
                  Tribal Resource Hub
                </span>
              </Link>

              <div className="flex items-center space-x-8">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                  <Link
                    href="/resources"
                    className="px-4 py-2 text-midnight hover:text-clay transition-colors font-medium rounded-earth hover:bg-desert/10"
                  >
                    Resources
                  </Link>
                  <Link
                    href="/tribes"
                    className="px-4 py-2 text-midnight hover:text-clay transition-colors font-medium rounded-earth hover:bg-desert/10"
                  >
                    Tribes
                  </Link>
                  <Link
                    href="/scholarships"
                    className="px-4 py-2 text-midnight hover:text-clay transition-colors font-medium rounded-earth hover:bg-desert/10"
                  >
                    Scholarships
                  </Link>
                  <UserMenu />
                </div>

                {/* Mobile Navigation */}
                <MobileNav />
              </div>
            </div>
          </div>
        </nav>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-midnight text-cream mt-16 sm:mt-20 lg:mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
              <div className="sm:col-span-2 md:col-span-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-clay to-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading font-bold">Tribal Resource Hub</h3>
                </div>
                <p className="text-cream/70 text-sm sm:text-base leading-relaxed">
                  A community-driven hub connecting Indigenous families, youth, and elders to trusted resources, programs, and support.
                </p>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-heading font-semibold mb-3 sm:mb-4">Quick Links</h4>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <li>
                    <Link href="/resources" className="text-cream/70 hover:text-gold transition-colors inline-block py-1 min-h-[44px] flex items-center">
                      Browse Resources
                    </Link>
                  </li>
                  <li>
                    <Link href="/tribes" className="text-cream/70 hover:text-gold transition-colors inline-block py-1 min-h-[44px] flex items-center">
                      Find Tribes
                    </Link>
                  </li>
                  <li>
                    <Link href="/scholarships" className="text-cream/70 hover:text-gold transition-colors inline-block py-1 min-h-[44px] flex items-center">
                      Scholarships
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-heading font-semibold mb-3 sm:mb-4">Our Mission</h4>
                <p className="text-cream/70 text-sm sm:text-base leading-relaxed">
                  Supporting Indigenous communities by providing easy access to resources from federal, state, and tribal sources.
                </p>
              </div>
            </div>

            <div className="border-t border-cream/10 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-cream/50">
              <p>&copy; {new Date().getFullYear()} Tribal Resource Hub. All rights reserved.</p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
