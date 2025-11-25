'use client'

import Link from 'next/link'
import { Tag } from './Tag'

interface ResourceCardProps {
  id: string
  title: string
  description: string
  type: string
  tags: string[]
  tribe?: {
    id: string
    name: string
  }
  state?: string | null
  url?: string | null
}

export function ResourceCard({
  id,
  title,
  description,
  type,
  tags,
  tribe,
  state,
  url,
}: ResourceCardProps) {
  return (
    <div className="bg-white rounded-earth-lg card-shadow p-6 border border-desert/20 hover:border-clay/30 transition-all group">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1.5 text-xs font-medium rounded-earth bg-pine/10 text-pine border border-pine/20">
            {type}
          </span>
          {state && (
            <span className="px-3 py-1.5 text-xs font-medium rounded-earth bg-clay/10 text-clay border border-clay/20">
              {state}
            </span>
          )}
        </div>
        <h3 className="text-xl font-heading font-semibold text-midnight mb-2 group-hover:text-clay transition-colors line-clamp-2">
          {title}
        </h3>
      </div>

      <p className="text-midnight/70 mb-5 line-clamp-3 leading-relaxed">
        {description}
      </p>

      {tribe && (
        <Link
          href={`/tribes/${tribe.id}`}
          className="text-sm font-medium text-pine hover:text-pine-light transition-colors mb-4 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {tribe.name}
        </Link>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {tags.slice(0, 3).map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
        {tags.length > 3 && (
          <span className="text-xs text-midnight/50 font-medium">
            +{tags.length - 3} more
          </span>
        )}
      </div>

      <div className="flex gap-4 pt-4 border-t border-desert/20">
        <Link
          href={`/resources/${id}`}
          className="text-sm font-medium text-pine hover:text-pine-light transition-colors flex items-center gap-1"
        >
          View Details
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-clay hover:text-clay-light transition-colors flex items-center gap-1"
          >
            Visit Website
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
