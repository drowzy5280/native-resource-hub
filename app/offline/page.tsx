import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline',
  robots: {
    index: false,
    follow: false,
  },
}

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-clay to-gold rounded-full flex items-center justify-center shadow-soft-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-heading font-bold text-text mb-4">
          You're Offline
        </h1>

        <p className="text-lg text-text-secondary mb-8 leading-relaxed">
          It looks like you've lost your internet connection. Don't worry, you can still
          browse resources you've viewed before.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-clay text-white rounded-earth-lg font-medium hover:bg-clay-dark transition-all shadow-soft hover:shadow-soft-lg"
          >
            Try Again
          </Link>

          <Link
            href="/resources"
            className="block w-full px-6 py-3 bg-white text-clay border-2 border-clay rounded-earth-lg font-medium hover:bg-clay/5 transition-all"
          >
            View Cached Resources
          </Link>
        </div>

        <div className="mt-12 p-6 bg-desert/20 rounded-earth border border-desert/30">
          <h2 className="font-heading font-semibold text-text mb-2">
            Tip for Rural Areas
          </h2>
          <p className="text-sm text-text-secondary">
            This app works offline! Pages you visit are saved automatically so you can
            access them without internet. Perfect for areas with limited connectivity.
          </p>
        </div>
      </div>
    </div>
  )
}
