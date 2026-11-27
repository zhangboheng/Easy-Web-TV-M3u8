// Easy Web TV Service Worker
// v8.6.0: cache hot-linked game card images across version bumps, but only
// after a CORS re-fetch confirms a real 2xx (an opaque no-cors 404 looks like
// status 0 and would suppress the card's Games-icon onerror fallback).
// Cache name is kept in sync with js/version.js by check-version.js.
const CACHE_NAME = 'easy-web-tv-v8.6.3';

// Assets to cache on install - only local assets that exist
// v8.5.0: slimmed down to the index shell only; route pages, engines and
// platform assets are cached at runtime by the fetch handler on first visit.
// v8.5.4: browser-local media library (novel/manga/music/video) with 8-language
// panel i18n, single-scan folder resolution and throttled progress writes.
// v8.5.5: local manga PDF support (vendored pdf.js), storage/resolution/decoding
// hardening, and unified route headers.
// v8.5.6: curated YouTube embeds (7 Blender open movies, official iframe only,
// 8-language source picker), Mist Gate hot-linked game, and Theatre card layout fix.
// v8.5.7: refreshed Theatre/Adult sources, full-screen two-column Settings panel,
// Porn-category and badge sync with Sensitive Content, source-tab i18n fallback,
// and a hardened global keydown handler.
// v8.5.8: unified CORS proxy pool with a persistent health cache (a proxy that
// just failed is demoted for 1-30min and every fetch path re-reads the pool per
// request, so demotions and Settings changes apply without a reload), per-attempt
// timeouts on every failover loop, and the UI translated into 96 languages.
// v8.5.9: redesigned Source Control (built-in rows + custom sources for Movie/Adult),
// unified module/player headers, grid card-height fix, 96-language inline texts,
// a language-switch fix that preserves saved source selections, the Legend of
// Sword and Fairy (DOS) player with per-page isolation, and online game card art.
// v8.6.3: rebuilt Games catalogue cards (wrapper div + inner link, favourites and
// card actions menu, IME-safe search, sort/URL state, d-pad ring) and added the
// standalone catalogues/gameplay.html shell for the four local web games.
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/css/style.css',
  '/css/main.css',
  '/js/index.js',
  '/js/proxy-config.js',
  '/js/source-config.js',
  '/js/settings-probe.js',
  '/js/translator.js',
  '/js/translations.js',
  '/js/dom.js',
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

// Game card images are hot-linked from public hosts (v8.6.0). Cache them on
// first load so a flaky upstream or going offline does not blank the cards;
// the cards still fall back to the local Games icon via their onerror handler.
const GAME_IMAGE_CACHE = 'ewtv-game-images-v1';
const GAME_IMAGE_HOSTS = ['raw.githubusercontent.com', 'cdn.simpleicons.org'];

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
          // Keep the game-image cache across version bumps - it is content
          // addressed by URL and only ever holds successful responses.
          if (cacheName !== CACHE_NAME && cacheName !== GAME_IMAGE_CACHE) {
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

  // Same-origin documents/scripts/stylesheets keep their filenames across
  // releases, so bypass the browser HTTP cache for them before the early
  // proxy/isolation branches. Images, media and Range requests keep the normal
  // cache path; a full revalidation of a video byte range is wasteful.
  const requestUrl = new URL(event.request.url);
  const bypassDestinations = ['', 'document', 'script', 'style', 'worker', 'manifest'];
  const networkRequest = (function () {
    if (requestUrl.origin !== self.location.origin ||
        event.request.headers.get('range') !== null ||
        bypassDestinations.indexOf(event.request.destination) === -1) {
      return event.request;
    }
    try {
      return new Request(event.request, { cache: 'reload' });
    } catch (e) {
      // Older engines can refuse to copy a navigation Request. Keep serving
      // the original request instead of failing the whole fetch handler.
      return event.request;
    }
  })();

  // Hot-linked proxy for Legend of Sword and Fairy (DOS): serve the upstream
  // GitHub Pages files under this origin so the iframe inherits COOP/COEP and
  // can use SharedArrayBuffer. No game files are bundled in this repository.
  const proxyUrl = requestUrl;
  if (proxyUrl.origin === self.location.origin && proxyUrl.pathname.startsWith('/xianjian/')) {
    const upstreamPath = proxyUrl.pathname.replace(/^\/xianjian\//, '') + proxyUrl.search;
    const upstreamUrl = 'https://madeye.github.io/Legend-of-Sword-and-Fairy/' + upstreamPath;
    event.respondWith(
      fetch(upstreamUrl, { mode: 'cors', credentials: 'omit' }).then((response) => {
        const headers = new Headers(response.headers);
        headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
        headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
        headers.set('Cache-Control', 'no-store');
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });
      }).catch(() => new Response('Upstream unavailable', { status: 502 }))
    );
    return;
  }

  // Cross-origin isolation for the PS Vita / PS2 / Classic Mac / rustpal player pages ONLY (v8.5.3+).
  // Injecting COOP/COEP on these top-level navigations lets the embedded
  // vitaslop / TabStationToo / Infinite Mac / rustpal apps use SharedArrayBuffer
  // inside their iframes - without touching any other page's hot-linked frames.
  const isoUrl = requestUrl;
  const ISO_PATHS = ['/routes/vita.html', '/routes/ps2.html', '/routes/mac.html', '/routes/n64recomp.html', '/routes/rustpal.html'];
  if (
    event.request.mode === 'navigate' &&
    isoUrl.origin === self.location.origin &&
    ISO_PATHS.includes(isoUrl.pathname)
  ) {
    event.respondWith(
      fetch(networkRequest)
        .then((response) => {
          const headers = new Headers(response.headers);
          headers.set('Cross-Origin-Opener-Policy', 'same-origin');
          headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
          if (response.ok && response.status === 200) {
            // cache the ORIGINAL response (headers don't matter offline)
            const cacheClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheClone));
          }
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
          });
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          return new Response('', { status: 504, statusText: 'Offline' });
        })
    );
    return;
  }

  // Cache game card images separately so an upstream hiccup or going offline
  // does not leave blank cards (the DOM onerror still shows the Games icon).
  // Both hosts send CORS headers, so re-fetch in cors mode to see the real
  // status: an opaque no-cors response masks a 404 as status 0, which would
  // get cached and permanently suppress the card's onerror fallback.
  const imageUrl = requestUrl;
  if (event.request.destination === 'image' && GAME_IMAGE_HOSTS.includes(imageUrl.hostname)) {
    event.respondWith(
      caches.open(GAME_IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const response = await fetch(new Request(event.request.url, { mode: 'cors', credentials: 'omit' }));
          if (response.ok) {
            cache.put(event.request, response.clone());
            return response;
          }
          // Upstream returned 404/5xx: do NOT cache it, and return a real
          // error so the <img> onerror handler swaps in the Games icon.
          return new Response('', { status: response.status, statusText: 'Image unavailable' });
        } catch (e) {
          return new Response('', { status: 504, statusText: 'Image unavailable' });
        }
      })
    );
    return;
  }

  // Skip external domains (CDN, cross-origin) - they should not be cached
  for (const domain of SKIP_CACHE_DOMAINS) {
    if (requestUrl.hostname.includes(domain) || event.request.url.includes(domain)) {
      // Just fetch from network, don't cache
      event.respondWith(fetch(event.request).catch(() => console.log('[ServiceWorker] External fetch failed, but that is expected for:', event.request.url)));
      return;
    }
  }

  // Network-first: always fetch fresh HTML/JS/CSS online so they stay in sync;
  // fall back to the cached copy only when the network is unavailable (offline).
  // The cache-busting networkRequest was built above and is shared by the
  // isolated-route branch.
  event.respondWith(
    fetch(networkRequest)
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
