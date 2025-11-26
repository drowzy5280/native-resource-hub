// Service Worker for Tribal Resource Hub PWA
const CACHE_NAME = 'tribal-resource-hub-v1'
const RUNTIME_CACHE = 'tribal-resource-hub-runtime'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/resources',
  '/scholarships',
  '/tribes',
  '/manifest.json',
  '/offline',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.error('Cache addAll error:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip API requests (always fetch fresh)
  if (request.url.includes('/api/')) {
    return
  }

  // For navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          const responseClone = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
        .catch(() => {
          // Fallback to cache, then offline page
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/offline')
          })
        })
    )
    return
  }

  // For other requests (images, scripts, styles)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200) {
          return response
        }

        const responseClone = response.clone()
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseClone)
        })

        return response
      })
    })
  )
})

// Background sync for saved resources (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-saved-resources') {
    event.waitUntil(syncSavedResources())
  }
})

async function syncSavedResources() {
  // This will sync saved resources when back online
  // Implementation depends on your data sync strategy
  console.log('Syncing saved resources...')
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  const title = data.title || 'Tribal Resource Hub'
  const options = {
    body: data.body || 'New resources available',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    data: data.url || '/',
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  )
})
