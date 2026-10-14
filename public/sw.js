/**
 * HRMatrix Service Worker (sw.js)
 * Provides offline capabilities, asset caching, and PWA installability.
 */

const CACHE_NAME = 'hrmatrix-pwa-v5';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest-presensi.json',
  '/icon.svg',
  '/icon-3people.svg',
  '/gambar/pwa-maskable-512x512.png',
  '/gambar/pwa-presensi-512x512.png',
  '/gambar/favicon.png'
];

// Install Event - Precache Core Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pre-caching some assets failed:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate with SPA Navigation Fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip chrome-extension, internal schemes, or third-party APIs
  if (!url.protocol.startsWith('http')) return;

  // Never intercept sitemap, robots, XML/TXT feeds or API proxy routes - bypass directly to the server
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname === '/sitemap' ||
    url.pathname === '/sitemap/' ||
    url.pathname === '/sitemap.xml' ||
    url.pathname === '/robots.txt' ||
    url.pathname.endsWith('.xml') ||
    url.pathname.endsWith('.txt')
  ) {
    return;
  }

  // Never intercept Vite internal modules, node_modules, or development scripts
  if (
    url.pathname.includes('/node_modules/') ||
    url.pathname.includes('/@vite/') ||
    url.pathname.includes('/@fs/') ||
    url.pathname.includes('/src/') ||
    url.searchParams.has('v') ||
    url.searchParams.has('t') ||
    url.hostname === 'localhost' ||
    url.hostname.includes('ais-dev-') ||
    url.port === '3000'
  ) {
    return;
  }

  // Handle SPA Navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Dynamic Web App Manifest for My Presensi with active link preservation
  if (url.pathname === '/manifest-presensi.json') {
    const startUrlParam = url.searchParams.get('start_url');
    event.respondWith(
      (async () => {
        try {
          const cached = await caches.match('/manifest-presensi.json');
          const response = cached || (await fetch('/manifest-presensi.json'));
          const manifest = await response.json();
          if (startUrlParam) {
            const decoded = decodeURIComponent(startUrlParam);
            manifest.start_url = decoded;
            manifest.id = decoded;
          }
          return new Response(JSON.stringify(manifest), {
            headers: {
              'Content-Type': 'application/manifest+json; charset=utf-8',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          });
        } catch (err) {
          return fetch(event.request);
        }
      })()
    );
    return;
  }

  // Handle static assets & scripts: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request fails, return cached response if present
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for message to skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
