// Easy Web TV Service Worker
const CACHE_NAME = 'easy-web-tv-v5';

// Assets to cache on install - only local assets that exist
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/css/style.css',
  '/css/main.css',
  '/js/index.js',
  '/js/translator.js',
  '/js/locales/translations.js',
  '/js/core/dom.js',
  '/images/logo.png',
  '/images/logo-192.png',
  '/images/logo-512.png',
  '/images/bg.jpg',
  '/images/menuicon.png',
  '/images/tv.svg',
  '/images/comprehensive.svg',
  '/images/radio.svg',
  '/images/reading.svg',
  '/images/manga.svg',
  '/images/music.svg',
  '/images/game.svg',
  '/images/category.svg',
  '/images/language.svg',
  '/images/earth.svg',
  '/manifest.json'
];

// External domains to skip caching (CDN, cross-origin resources)
const SKIP_CACHE_DOMAINS = [
  'vjs.zencdn.net',
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'iptv-org.github.io',
  'api.',
  'ipdata.co',
  'locationiq.com'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network-first for same-origin, fallback to cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip non-http(s) requests (chrome-extension, etc.)
  if (!event.request.url.startsWith('http://') && !event.request.url.startsWith('https://')) {
    return;
  }

  // Skip external domains (CDN, cross-origin) - they should not be cached
  const requestUrl = new URL(event.request.url);
  for (const domain of SKIP_CACHE_DOMAINS) {
    if (requestUrl.hostname.includes(domain) || event.request.url.includes(domain)) {
      // Just fetch from network, don't cache
      event.respondWith(fetch(event.request).catch(() => console.log('[ServiceWorker] External fetch failed, but that is expected for:', event.request.url)));
      return;
    }
  }

  // Network-first: always fetch fresh HTML/JS/CSS online so they stay in sync;
  // fall back to the cached copy only when the network is unavailable (offline).
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const isSameOrigin = requestUrl.origin === self.location.origin;
        if (response && response.ok && response.status === 200 && isSameOrigin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === 'navigate') return caches.match('/index.html');
        return new Response('', { status: 504, statusText: 'Offline' });
      })
  );
});

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New content available!',
      icon: '/images/logo.png',
      badge: '/images/logo.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Easy Web TV', options)
    );
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const url = event.notification.data.url;
      
      // Check if a window is already open
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
