'use client'

import Link from 'next/link'
import { SaveButton } from './SaveButton'
import { ShareButton } from './ShareButton'

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
    <article
      className="bg-white rounded-earth-lg shadow-card p-6 border border-desert/30 hover:border-pine/20 transition-all group"
      aria-labelledby={`tribe-title-${id}`}
    >
      <div className="mb-5">
        {/* Tribe Icon and Save Button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className="w-12 h-12 bg-gradient-to-br from-pine to-pine-dark rounded-full flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3
                id={`tribe-title-${id}`}
                className="text-xl font-heading font-semibold text-text mb-2 group-hover:text-pine transition-colors line-clamp-2"
              >
                {name}
              </h3>
            </div>
          </div>
          <SaveButton id={id} type="tribe" title={name} variant="icon" />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {region && (
            <span className="px-3 py-1.5 text-xs font-medium rounded-earth bg-desert/20 text-text border border-desert/40">
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
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg className="w-4 h-4 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium">
              {programCount} {programCount === 1 ? 'program' : 'programs'} available
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-desert/30" role="group" aria-label="Tribe actions">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/tribes/${id}`}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-pine bg-pine/5 hover:bg-pine/10 border border-pine/20 hover:border-pine/40 rounded-earth transition-all flex items-center justify-center gap-2"
            aria-label={`View programs for ${name}`}
          >
            View Programs
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-clay bg-clay/10 hover:bg-clay/15 border border-clay/30 hover:border-clay/50 rounded-earth transition-all flex items-center justify-center gap-2"
              aria-label={`Visit ${name} official website (opens in new tab)`}
            >
              Visit Website
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
        <ShareButton url={`/tribes/${id}`} title={name} description={`${region || 'Native American tribe'} information and programs`} />
      </div>
    </article>
  )
}
