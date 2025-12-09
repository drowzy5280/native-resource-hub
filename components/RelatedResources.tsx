'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface RelatedItem {
  id: string
  title: string
  name?: string // For scholarships
  description: string
  type?: string
  tags: string[]
  url?: string
}

interface RelatedResourcesProps {
  currentId: string
  currentTags: string[]
  currentType?: string
  resourceType: 'resource' | 'scholarship'
  limit?: number
  className?: string
}

export function RelatedResources({
  currentId,
  currentTags,
  currentType,
  resourceType,
  limit = 4,
  className = '',
}: RelatedResourcesProps) {
  const [related, setRelated] = useState<RelatedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRelated() {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          currentId,
          tags: currentTags.join(','),
          limit: limit.toString(),
        })
        if (currentType) {
          params.set('type', currentType)
        }

        const endpoint = resourceType === 'scholarship'
          ? `/api/scholarships/match?${params}`
          : `/api/resources/match?${params}`

        const response = await fetch(endpoint)
        if (response.ok) {
          const data = await response.json()
          setRelated(data.slice(0, limit))
        }
      } catch (error) {
        console.error('Failed to fetch related items:', error)
      } finally {
        setLoading(false)
      }
    }

    if (currentTags.length > 0) {
      fetchRelated()
    } else {
      setLoading(false)
    }
  }, [currentId, currentTags, currentType, resourceType, limit])

  if (loading) {
    return (
      <div className={`${className}`}>
        <h3 className="text-xl font-heading font-bold text-text dark:text-white mb-4">
          Related {resourceType === 'scholarship' ? 'Scholarships' : 'Resources'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-earth h-32"
            />
          ))}
        </div>
      </div>
    )
  }

  if (related.length === 0) {
    return null
  }

  const basePath = resourceType === 'scholarship' ? '/scholarships' : '/resources'

  return (
    <div className={`${className}`}>
      <h3 className="text-xl font-heading font-bold text-text dark:text-white mb-4">
        Related {resourceType === 'scholarship' ? 'Scholarships' : 'Resources'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {related.map((item) => (
          <Link
            key={item.id}
            href={`${basePath}/${item.id}`}
            className="group bg-white dark:bg-gray-800 rounded-earth p-4 border border-desert/20 dark:border-gray-700 hover:border-pine/40 dark:hover:border-gold/40 hover:shadow-soft transition-all"
          >
            <h4 className="font-heading font-semibold text-text dark:text-white group-hover:text-pine dark:group-hover:text-gold transition-colors line-clamp-2 mb-2">
              {item.title || item.name}
            </h4>
            <p className="text-sm text-text-secondary dark:text-gray-400 line-clamp-2 mb-3">
              {item.description}
            </p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-desert/20 dark:bg-gray-700 text-text-muted dark:text-gray-400 rounded-earth"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

// Simple component for showing related items inline
interface RelatedItemsInlineProps {
  items: Array<{ id: string; title: string; name?: string }>
  basePath: string
  className?: string
}

export function RelatedItemsInline({ items, basePath, className = '' }: RelatedItemsInlineProps) {
  if (items.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <span className="text-sm text-text-muted dark:text-gray-500">Related:</span>
      {items.map((item, index) => (
        <span key={item.id}>
          <Link
            href={`${basePath}/${item.id}`}
            className="text-sm text-pine dark:text-gold hover:underline"
          >
            {item.title || item.name}
          </Link>
          {index < items.length - 1 && <span className="text-text-muted">, </span>}
        </span>
      ))}
    </div>
  )
}
