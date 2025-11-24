/**
 * Analytics tracking utilities
 * Supports Google Analytics and custom event tracking
 */

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    })
  }
}

// Custom events for Native Resource Hub
export const trackResourceView = (resourceId: string, resourceType: string) => {
  event({
    action: 'view_resource',
    category: 'engagement',
    label: `${resourceType}:${resourceId}`,
  })
}

export const trackResourceSave = (resourceId: string, resourceType: string) => {
  event({
    action: 'save_resource',
    category: 'engagement',
    label: `${resourceType}:${resourceId}`,
  })
}

export const trackSearch = (query: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'engagement',
    label: query,
    value: resultsCount,
  })
}

export const trackFilterUse = (filterType: string, filterValue: string) => {
  event({
    action: 'filter_use',
    category: 'engagement',
    label: `${filterType}:${filterValue}`,
  })
}

export const trackApplicationStatusChange = (scholarshipId: string, status: string) => {
  event({
    action: 'application_status_change',
    category: 'application',
    label: `${scholarshipId}:${status}`,
  })
}

export const trackReviewSubmit = (resourceId: string, rating: number) => {
  event({
    action: 'review_submit',
    category: 'engagement',
    label: resourceId,
    value: rating,
  })
}

export const trackExternalLinkClick = (url: string, source: string) => {
  event({
    action: 'external_link_click',
    category: 'outbound',
    label: `${source}:${url}`,
  })
}

export const trackAuthEvent = (eventName: string) => {
  event({
    action: eventName,
    category: 'auth',
  })
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}
