'use client'

import { useRecentlyViewed, ViewedItemType } from './RecentlyViewedContext'
import Link from 'next/link'

interface RecentlyViewedProps {
  type?: ViewedItemType
  limit?: number
  title?: string
}

export function RecentlyViewed({ type, limit = 5, title }: RecentlyViewedProps) {
  const { items, getItemsByType } = useRecentlyViewed()

  // Get items to display
  const displayItems = type ? getItemsByType(type).slice(0, limit) : items.slice(0, limit)

  if (displayItems.length === 0) {
    return null
  }

  const defaultTitle = type
    ? `Recently Viewed ${type === 'resource' ? 'Resources' : type === 'scholarship' ? 'Scholarships' : 'Tribes'}`
    : 'Recently Viewed'

  const getItemUrl = (itemType: ViewedItemType, id: string) => {
    switch (itemType) {
      case 'resource':
        return `/resources/${id}`
      case 'scholarship':
        return `/scholarships/${id}`
      case 'tribe':
        return `/tribes/${id}`
      default:
        return '/'
    }
  }

  const getTypeIcon = (itemType: ViewedItemType) => {
    switch (itemType) {
      case 'resource':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        )
      case 'scholarship':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      case 'tribe':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
    }
  }

  return (
    <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-heading font-semibold text-midnight">
          {title || defaultTitle}
        </h3>
      </div>

      <div className="space-y-3">
        {displayItems.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={getItemUrl(item.type, item.id)}
            className="block p-3 rounded-earth bg-cream/30 hover:bg-desert/20 transition-colors border border-desert/10 hover:border-gold/30 group"
          >
            <div className="flex items-start gap-3">
              <div className="text-clay/70 group-hover:text-gold transition-colors mt-0.5">
                {getTypeIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-midnight group-hover:text-clay transition-colors line-clamp-1 mb-1">
                  {item.name}
                </h4>
                <p className="text-sm text-midnight/60 line-clamp-2">
                  {item.description}
                </p>
                {item.metadata && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.metadata.amount && (
                      <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold-dark rounded-earth border border-gold/20">
                        {item.metadata.amount}
                      </span>
                    )}
                    {item.metadata.state && (
                      <span className="text-xs px-2 py-0.5 bg-earth-teal/10 text-earth-teal rounded-earth border border-earth-teal/20">
                        {item.metadata.state}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <svg className="w-4 h-4 text-midnight/30 group-hover:text-gold transition-colors flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
