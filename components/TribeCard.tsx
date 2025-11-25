'use client'

import Link from 'next/link'

interface TribeCardProps {
  id: string
  name: string
  region?: string | null
  website?: string | null
  federalRecognitionStatus?: string | null
  programCount?: number
}

export function TribeCard({
  id,
  name,
  region,
  website,
  federalRecognitionStatus,
  programCount,
}: TribeCardProps) {
  return (
    <div className="bg-white rounded-earth-lg card-shadow p-6 border border-desert/20 hover:border-pine/30 transition-all group">
      <div className="mb-5">
        {/* Tribe Icon */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pine to-pine-dark rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-heading font-semibold text-midnight mb-2 group-hover:text-pine transition-colors line-clamp-2">
              {name}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {region && (
            <span className="px-3 py-1.5 text-xs font-medium rounded-earth bg-desert/20 text-midnight border border-desert/40">
              {region}
            </span>
          )}
          {federalRecognitionStatus && (
            <span className="px-3 py-1.5 text-xs font-medium rounded-earth bg-pine/10 text-pine border border-pine/20">
              {federalRecognitionStatus}
            </span>
          )}
        </div>

        {programCount !== undefined && (
          <div className="flex items-center gap-2 text-sm text-midnight/70">
            <svg className="w-4 h-4 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium">
              {programCount} {programCount === 1 ? 'program' : 'programs'} available
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4 border-t border-desert/20">
        <Link
          href={`/tribes/${id}`}
          className="text-sm font-medium text-pine hover:text-pine-light transition-colors flex items-center gap-1"
        >
          View Programs
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-clay hover:text-clay-light transition-colors flex items-center gap-1"
          >
            Official Website
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
