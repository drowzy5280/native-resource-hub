'use client'

import { useState, useEffect } from 'react'
import { SectionHeader } from '@/components/SectionHeader'
import { RecommendationsPanel } from '@/components/RecommendationsPanel'

type APIRecommendation = {
  id: string
  title: string
  description: string
  type: 'resource' | 'scholarship'
  matchScore: number
  matchReasons: string[]
  url: string
  actionItems?: string[]
}

type Recommendation = {
  id: string
  title: string
  type: 'scholarship' | 'resource' | 'guide'
  matchScore: number
  reason: string
  url: string
  amount?: string
  deadline?: Date
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/recommendations')

        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.statusText}`)
        }

        const data = await response.json()

        // Transform API recommendations to UI format
        const transformedRecommendations = data.recommendations.map((rec: any) => ({
          id: rec.id,
          title: rec.title,
          type: rec.type,
          matchScore: rec.matchScore,
          reason: rec.matchReasons.join(' '), // Combine reasons into single string
          url: rec.url,
          actionItems: rec.actionItems,
        }))

        setRecommendations(transformedRecommendations)
        setIsAuthenticated(data.userAuthenticated)
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setError(err instanceof Error ? err.message : 'Failed to load recommendations')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <SectionHeader
        title="Your Recommendations"
        description="Discover opportunities tailored to your unique profile and goals"
      />

      {/* Info Banner */}
      <div className="bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-6 mb-8 border border-desert/20">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-pine/20 rounded-earth flex items-center justify-center">
            <svg className="w-6 h-6 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-text mb-2">
              AI-Powered Personalization
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Our intelligent recommendation system uses Claude AI to analyze your profile, interests, and eligibility
              to surface the most relevant scholarships and resources. {isAuthenticated
                ? 'The more you interact with the platform, the better your recommendations become.'
                : 'Sign in to get personalized recommendations based on your profile and saved resources.'}
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 border-4 border-pine/20 border-t-pine rounded-full animate-spin mb-4"></div>
          <p className="text-text-secondary font-medium">Generating personalized recommendations...</p>
          <p className="text-text-muted text-sm mt-2">This may take a few moments</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-error/10 border-l-4 border-error rounded-r-earth-lg p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-heading font-bold text-error mb-2">
                Failed to Load Recommendations
              </h3>
              <p className="text-text-secondary mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-pine text-white rounded-earth font-semibold hover:bg-pine-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Panel */}
      {!isLoading && !error && (
        <>
          <RecommendationsPanel recommendations={recommendations} />

          {/* Auth CTA for non-authenticated users */}
          {!isAuthenticated && recommendations.length > 0 && (
            <div className="mt-8 bg-gradient-to-br from-gold/10 via-cream to-pine/10 rounded-earth-lg p-8 border border-desert/20 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-text mb-3">
                  Get Even Better Recommendations
                </h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  These are general recommendations based on popular resources. Sign in to receive personalized
                  recommendations based on your tribe, location, saved resources, and interests.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <a
                    href="/sign-in"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors"
                  >
                    Sign In
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </a>
                  <a
                    href="/sign-up"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-semibold hover:bg-pine/5 transition-colors"
                  >
                    Create Account
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* How to Improve Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
              <div className="w-12 h-12 bg-pine/10 rounded-earth flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-heading font-bold text-text mb-2">Complete Your Profile</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Add more details about your education, interests, and goals to receive more accurate recommendations.
              </p>
            </div>

            <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
              <div className="w-12 h-12 bg-clay/10 rounded-earth flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-heading font-bold text-text mb-2">Save Resources</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Save resources you're interested in. Our AI learns from your preferences to refine future recommendations.
              </p>
            </div>

            <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
              <div className="w-12 h-12 bg-gold/10 rounded-earth flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-heading font-bold text-text mb-2">Stay Active</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Regularly check back for updates. We add new opportunities daily and refresh recommendations weekly.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
