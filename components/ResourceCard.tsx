'use client'

import Link from 'next/link'
import { Tag } from './Tag'
import { SaveButton } from './SaveButton'

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
  userId?: string
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
  userId,
}: ResourceCardProps) {
  return (
    <div className="bg-white rounded-earth-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-earth-sand/30">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-earth-teal/10 text-earth-teal">
              {type}
            </span>
            {state && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-earth-rust/10 text-earth-rust">
                {state}
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold text-earth-brown mb-2">
            {title}
          </h3>
        </div>
        {userId && <SaveButton userId={userId} resourceId={id} />}
      </div>

      <p className="text-earth-brown/80 mb-4 line-clamp-3">
        {description}
      </p>

      {tribe && (
        <Link
          href={`/tribes/${tribe.id}`}
          className="text-sm text-earth-teal hover:underline mb-3 inline-block"
        >
          {tribe.name}
        </Link>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 4).map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
        {tags.length > 4 && (
          <span className="text-xs text-earth-brown/60">
            +{tags.length - 4} more
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <Link
          href={`/resources/${id}`}
          className="text-sm font-medium text-earth-teal hover:text-earth-teal/80 transition-colors"
        >
          View Details →
        </Link>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-earth-rust hover:text-earth-rust/80 transition-colors"
          >
            Visit Website ↗
          </a>
        )}
      </div>
    </div>
  )
}
