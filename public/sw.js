// Service Worker for Tribal Resource Hub PWA
const VERSION = '2.0.1'
const CACHE_NAME = `tribal-resource-hub-static-v${VERSION}`
const RUNTIME_CACHE = `tribal-resource-hub-runtime-v${VERSION}`
const IMAGE_CACHE = `tribal-resource-hub-images-v${VERSION}`
const FONT_CACHE = `tribal-resource-hub-fonts-v${VERSION}`

// Cache limits to prevent excessive storage use
const MAX_RUNTIME_CACHE_ITEMS = 50
const MAX_IMAGE_CACHE_ITEMS = 60
const CACHE_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/resources',
  '/scholarships',
  '/tribes',
  '/nonprofits',
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
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE, FONT_CACHE]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Helper: Trim cache to max items
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  if (keys.length > maxItems) {
    await cache.delete(keys[0])
    await trimCache(cacheName, maxItems)
  }
}

// Helper: Check if cache entry is expired
function isCacheExpired(response) {
  if (!response) return true
  const cachedDate = response.headers.get('sw-cache-date')
  if (!cachedDate) return false
  return Date.now() - new Date(cachedDate).getTime() > CACHE_EXPIRATION_TIME
}

// Fetch event - improved caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip API requests (always fetch fresh)
  if (url.pathname.startsWith('/api/')) return

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return

  // Determine cache strategy based on resource type
  const destination = request.destination || 'document'

  // STRATEGY 1: Network First for HTML pages (with offline fallback)
  if (request.mode === 'navigate' || destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone()
          const responseWithDate = new Response(responseClone.body, responseClone)
          responseWithDate.headers.append('sw-cache-date', new Date().toISOString())

          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseWithDate)
            trimCache(RUNTIME_CACHE, MAX_RUNTIME_CACHE_ITEMS)
          })
          return response
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/offline')
          })
        })
    )
    return
  }

  // STRATEGY 2: Cache First for images (with stale-while-revalidate)
  if (destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone()
            const responseWithDate = new Response(responseClone.body, responseClone)
            responseWithDate.headers.append('sw-cache-date', new Date().toISOString())

            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(request, responseWithDate)
              trimCache(IMAGE_CACHE, MAX_IMAGE_CACHE_ITEMS)
            })
          }
          return response
        })

        // Return cached response immediately, update in background
        return cachedResponse || fetchPromise
      })
    )
    return
  }

  // STRATEGY 3: Cache First for fonts (long-term cache)
  if (destination === 'font' || url.pathname.match(/\.(woff2?|ttf|otf|eot)$/)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse

        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone()
            caches.open(FONT_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
      })
    )
    return
  }

  // STRATEGY 4: Stale-While-Revalidate for CSS/JS/other assets
  if (destination === 'style' || destination === 'script' || url.pathname.match(/\.(css|js)$/)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone()
            const responseWithDate = new Response(responseClone.body, responseClone)
            responseWithDate.headers.append('sw-cache-date', new Date().toISOString())

            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseWithDate)
              trimCache(RUNTIME_CACHE, MAX_RUNTIME_CACHE_ITEMS)
            })
          }
          return response
        })

        // Return cached if available and not expired, otherwise fetch
        if (cachedResponse && !isCacheExpired(cachedResponse)) {
          fetchPromise.catch(() => {}) // Update cache in background
          return cachedResponse
        }
        return fetchPromise
      })
    )
    return
  }

  // STRATEGY 5: Network First for everything else
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => caches.match(request))
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
