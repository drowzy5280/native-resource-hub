'use client'

import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface Analytics {
  totals: {
    resources: number
    scholarships: number
    tribes: number
  }
  recent: {
    resourcesLast30Days: number
  }
  resourcesByType: { type: string; count: number }[]
  resourcesByState: { state: string; count: number }[]
  scholarships: {
    total: number
    upcoming: number
    closingSoon: number
  }
  verification: {
    total: number
    verified: number
    unverified: number
  }
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics')
        if (!response.ok) throw new Error('Failed to fetch analytics')
        const data = await response.json()
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-clay">Failed to load analytics: {error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">
        Analytics Dashboard
      </h1>

      {/* Total Counts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pine/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{analytics.totals.resources}</p>
              <p className="text-gray-600 text-sm">Total Resources</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <span className="text-pine font-medium">+{analytics.recent.resourcesLast30Days}</span> in last 30 days
          </div>
        </div>

        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{analytics.totals.scholarships}</p>
              <p className="text-gray-600 text-sm">Total Scholarships</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <span className="text-gold-dark font-medium">{analytics.scholarships.closingSoon}</span> closing soon
          </div>
        </div>

        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-clay/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{analytics.totals.tribes}</p>
              <p className="text-gray-600 text-sm">Total Tribes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resources by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">
            Resources by Type
          </h2>
          <div className="space-y-3">
            {analytics.resourcesByType.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{item.type}</span>
                <span className="text-gray-900 font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">
            Top States (by Resources)
          </h2>
          <div className="space-y-3">
            {analytics.resourcesByState.map((item) => (
              <div key={item.state} className="flex items-center justify-between">
                <span className="text-gray-700">{item.state}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-desert/20 rounded-full h-2">
                    <div
                      className="bg-pine h-2 rounded-full"
                      style={{
                        width: `${(item.count / analytics.resourcesByState[0].count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-900 font-semibold w-12 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft mb-8">
        <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">
          Verification Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-pine">{analytics.verification.verified}</p>
            <p className="text-gray-600 mt-1">Verified</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-clay">{analytics.verification.unverified}</p>
            <p className="text-gray-600 mt-1">Unverified</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">
              {Math.round((analytics.verification.verified / analytics.verification.total) * 100)}%
            </p>
            <p className="text-gray-600 mt-1">Verification Rate</p>
          </div>
        </div>
      </div>

      {/* Scholarship Deadlines */}
      <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
        <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">
          Scholarship Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-gold-dark">{analytics.scholarships.upcoming}</p>
            <p className="text-gray-600 mt-1">Upcoming Deadlines</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-clay">{analytics.scholarships.closingSoon}</p>
            <p className="text-gray-600 mt-1">Closing in 30 Days</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-400">
              {analytics.scholarships.total - analytics.scholarships.upcoming}
            </p>
            <p className="text-gray-600 mt-1">Past Deadlines</p>
          </div>
        </div>
      </div>
    </div>
  )
}
