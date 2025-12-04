'use client'

import { useState } from 'react'
import Link from 'next/link'

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

type RecommendationsPanelProps = {
  recommendations: Recommendation[]
  userProfile?: {
    tribalEnrollment?: boolean
    educationLevel?: string
    fieldOfStudy?: string
    state?: string
    interests?: string[]
  }
}

export function RecommendationsPanel({ recommendations, userProfile }: RecommendationsPanelProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scholarship': return '🎓'
      case 'resource': return '📚'
      case 'guide': return '📖'
      default: return '✨'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scholarship': return 'bg-gold/10 text-gold-dark border-gold/30'
      case 'resource': return 'bg-pine/10 text-pine-dark border-pine/30'
      case 'guide': return 'bg-clay/10 text-clay-dark border-clay/30'
      default: return 'bg-desert/20 text-text border-desert/40'
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-success'
    if (score >= 75) return 'text-pine'
    if (score >= 60) return 'text-warning'
    return 'text-text-secondary'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-heading font-bold text-text">Recommended for You</h2>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-pine hover:text-pine-dark transition-colors"
              aria-label="Show explanation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <p className="text-text-secondary">
            Personalized suggestions based on your profile and interests
          </p>
        </div>
        <span className="flex items-center gap-2 px-3 py-1 bg-pine/10 text-pine-dark rounded-earth text-sm font-medium border border-pine/30">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Powered
        </span>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="bg-pine/5 border-l-4 border-pine p-4 rounded-r-earth">
          <h3 className="text-sm font-semibold text-text mb-2">How Recommendations Work</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Our AI analyzes your profile, education level, interests, and location to suggest the most
            relevant resources, scholarships, and guides. Match scores indicate how well each recommendation
            fits your profile. Higher scores mean better matches!
          </p>
          {userProfile && (
            <div className="mt-3 pt-3 border-t border-pine/20">
              <p className="text-xs text-text-muted mb-2">Based on your profile:</p>
              <div className="flex flex-wrap gap-2">
                {userProfile.tribalEnrollment && (
                  <span className="text-xs px-2 py-1 bg-white rounded-earth border border-desert/40">
                    ✓ Tribal Enrollment
                  </span>
                )}
                {userProfile.educationLevel && (
                  <span className="text-xs px-2 py-1 bg-white rounded-earth border border-desert/40">
                    {userProfile.educationLevel}
                  </span>
                )}
                {userProfile.fieldOfStudy && (
                  <span className="text-xs px-2 py-1 bg-white rounded-earth border border-desert/40">
                    {userProfile.fieldOfStudy}
                  </span>
                )}
                {userProfile.state && (
                  <span className="text-xs px-2 py-1 bg-white rounded-earth border border-desert/40">
                    {userProfile.state}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations List */}
      {recommendations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-earth-lg border border-desert/20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-heading font-bold text-text mb-2">
            No recommendations yet
          </h3>
          <p className="text-text-secondary mb-4">
            Complete your profile to get personalized recommendations
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors"
          >
            Complete Profile
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <Link
              key={rec.id}
              href={rec.url}
              className="group block bg-white rounded-earth-lg p-6 border-2 border-desert/20 hover:border-pine/40 transition-all shadow-soft hover:shadow-soft-lg"
            >
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    index === 0 ? 'bg-gold/20 ring-4 ring-gold/20' :
                    index === 1 ? 'bg-success/20' :
                    index === 2 ? 'bg-clay/20' :
                    'bg-desert/10'
                  }`}>
                    {getTypeIcon(rec.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-earth border ${getTypeColor(rec.type)}`}>
                          {rec.type}
                        </span>
                        {index === 0 && (
                          <span className="text-xs font-semibold px-2 py-1 rounded-earth bg-gold/10 text-gold-dark border border-gold/30">
                            ⭐ Top Match
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-heading font-bold text-text group-hover:text-pine transition-colors line-clamp-2 mb-1">
                        {rec.title}
                      </h3>
                      {rec.amount && (
                        <p className="text-sm text-text-secondary font-semibold mb-2">{rec.amount}</p>
                      )}
                      {rec.deadline && (
                        <p className="text-xs text-warning font-medium">
                          Deadline: {rec.deadline.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>

                    {/* Match Score */}
                    <div className="flex-shrink-0 text-right">
                      <div className={`text-2xl font-bold ${getMatchScoreColor(rec.matchScore)}`}>
                        {rec.matchScore}%
                      </div>
                      <div className="text-xs text-text-muted">match</div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-pine/5 rounded-earth p-3 mt-3">
                    <p className="text-sm text-text-secondary leading-relaxed">
                      <strong className="text-text">Why:</strong> {rec.reason}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CTA */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-6 border border-desert/20 text-center">
          <h3 className="text-lg font-heading font-bold text-text mb-2">
            Want more personalized recommendations?
          </h3>
          <p className="text-text-secondary mb-4">
            Update your profile to refine your matches and discover more opportunities
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors"
          >
            Update Profile
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}
