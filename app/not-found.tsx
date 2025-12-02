import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | Tribal Resource Hub',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-earth-lg p-12 border border-earth-sand/30 shadow-soft-lg">
          {/* 404 Icon */}
          <div className="text-8xl mb-6">🪶</div>

          {/* Error Code */}
          <h1 className="text-6xl font-bold text-earth-brown mb-4">404</h1>

          {/* Error Message */}
          <h2 className="text-2xl font-semibold text-earth-brown mb-4">
            Page Not Found
          </h2>
          <p className="text-earth-brown/70 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to exploring resources for Native American communities.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-earth-teal text-white rounded-earth-lg font-medium hover:bg-earth-teal/90 transition-colors"
            >
              Go to Homepage
            </Link>
            <Link
              href="/resources"
              className="px-8 py-3 bg-white text-earth-teal border-2 border-earth-teal rounded-earth-lg font-medium hover:bg-earth-teal/5 transition-colors"
            >
              Browse Resources
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-earth-sand">
            <p className="text-sm text-earth-brown/60 mb-4">You might be looking for:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/scholarships" className="text-earth-teal hover:underline text-sm">
                Scholarships
              </Link>
              <span className="text-earth-brown/30">•</span>
              <Link href="/tribes" className="text-earth-teal hover:underline text-sm">
                Tribes
              </Link>
              <span className="text-earth-brown/30">•</span>
              <Link href="/search" className="text-earth-teal hover:underline text-sm">
                Search
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
