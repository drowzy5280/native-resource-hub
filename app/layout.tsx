import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { MobileNav } from '@/components/MobileNav'
import { UserMenu } from '@/components/UserMenu'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Native Resource Hub',
  description: 'Connecting Native communities with resources, scholarships, and tribal programs',
  keywords: ['Native American', 'resources', 'scholarships', 'tribal programs', 'indigenous'],
  openGraph: {
    title: 'Native Resource Hub',
    description: 'Connecting Native communities with resources, scholarships, and tribal programs',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Native Resource Hub',
    description: 'Connecting Native communities with resources, scholarships, and tribal programs',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-earth-cream`}>
        <nav className="bg-white shadow-sm border-b border-earth-sand/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-earth-teal rounded-earth" />
                <span className="text-xl font-bold text-earth-brown">
                  Native Resource Hub
                </span>
              </Link>

              <div className="flex items-center space-x-8">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  <Link
                    href="/resources"
                    className="text-earth-brown hover:text-earth-teal transition-colors font-medium"
                  >
                    Resources
                  </Link>
                  <Link
                    href="/tribes"
                    className="text-earth-brown hover:text-earth-teal transition-colors font-medium"
                  >
                    Tribes
                  </Link>
                  <Link
                    href="/scholarships"
                    className="text-earth-brown hover:text-earth-teal transition-colors font-medium"
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

        <footer className="bg-earth-brown text-earth-cream mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Native Resource Hub</h3>
                <p className="text-earth-cream/80 text-sm">
                  Connecting Native communities with resources, scholarships, and tribal programs.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/resources" className="text-earth-cream/80 hover:text-earth-cream">
                      Browse Resources
                    </Link>
                  </li>
                  <li>
                    <Link href="/tribes" className="text-earth-cream/80 hover:text-earth-cream">
                      Find Tribes
                    </Link>
                  </li>
                  <li>
                    <Link href="/scholarships" className="text-earth-cream/80 hover:text-earth-cream">
                      Scholarships
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">About</h4>
                <p className="text-earth-cream/80 text-sm">
                  This platform aggregates resources from federal, state, and tribal sources
                  to support Native American communities.
                </p>
              </div>
            </div>

            <div className="border-t border-earth-cream/20 mt-8 pt-8 text-center text-sm text-earth-cream/60">
              <p>&copy; {new Date().getFullYear()} Native Resource Hub. All rights reserved.</p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
