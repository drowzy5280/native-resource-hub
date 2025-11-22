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
    <div className="bg-white rounded-earth-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-earth-sand/30">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-earth-brown mb-2">
          {name}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {region && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-earth-tan/20 text-earth-brown">
              {region}
            </span>
          )}
          {federalRecognitionStatus && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-earth-teal/10 text-earth-teal">
              {federalRecognitionStatus}
            </span>
          )}
        </div>

        {programCount !== undefined && (
          <p className="text-sm text-earth-brown/70">
            {programCount} {programCount === 1 ? 'program' : 'programs'} available
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Link
          href={`/tribes/${id}`}
          className="text-sm font-medium text-earth-teal hover:text-earth-teal/80 transition-colors"
        >
          View Programs →
        </Link>
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-earth-rust hover:text-earth-rust/80 transition-colors"
          >
            Official Website ↗
          </a>
        )}
      </div>
    </div>
  )
}
