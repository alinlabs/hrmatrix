/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, cleanupOutdatedCaches, matchPrecache } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies';

declare const __APP_BUILD_ID__: string;
declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<string | { url: string; revision: string | null }>;
};

const CURRENT_BUILD_ID = typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : 'dev';
const META_CACHE_NAME = 'hrmatrix-build-meta';
const META_BUILD_KEY = '/__hrmatrix_build_id__';
const ASSETS_CACHE_NAME = 'hrmatrix-assets-cache';
const IMAGES_CACHE_NAME = 'hrmatrix-images-cache';

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

// Bypass service worker completely for /api/, /version.json, sitemap XML, robots.txt, and llms.txt
registerRoute(
  ({ url }) =>
    url.pathname === '/version.json' ||
    url.pathname.startsWith('/api/') ||
    url.pathname === '/sitemap' ||
    url.pathname === '/sitemap/' ||
    url.pathname === '/sitemap.xml' ||
    url.pathname === '/robots.txt' ||
    url.pathname === '/llms.txt' ||
    url.pathname.endsWith('.xml') ||
    url.pathname.endsWith('.txt'),
  new NetworkOnly()
);

// Network-First SPA Navigation using HTTP ETag revalidation (no-cache instead of no-store)
// so unchanged deploys return fast 304 Not Modified (0 payload bytes) and Edge hits,
// while offline/slow connections fall back seamlessly to precached /index.html.
registerRoute(
  new NavigationRoute(
    async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      try {
        const networkResponse = await fetch('/index.html', {
          cache: 'no-cache',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const contentType = networkResponse.headers.get('content-type') || '';
        if (networkResponse.ok && contentType.includes('text/html')) {
          return networkResponse;
        }
      } catch {
        clearTimeout(timeoutId);
      }

      const cached = await matchPrecache('/index.html');
      if (cached) return cached;

      return fetch('/index.html');
    },
    {
      denylist: [
        /^\/api\//,
        /^\/version\.json$/,
        /^\/sitemap/,
        /^\/robots\.txt$/,
        /^\/llms\.txt$/,
        /^\/manifest.*\.json$/,
        /\.(?:js|mjs|css|json|xml|txt|svg|png|webp|jpg|jpeg|gif|ico|woff|woff2|map)$/,
      ],
    }
  )
);

// Immutable hashed Vite build assets: CacheFirst on-demand so lazy routes/heavy PDF/QR/Jobs
// bundles are only downloaded when needed and persist across unrelated deploys.
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    url.pathname.startsWith('/assets/') &&
    /\.(?:js|mjs|css|woff2?)$/.test(url.pathname),
  new CacheFirst({
    cacheName: ASSETS_CACHE_NAME,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// Dynamic Web App Manifest for My Presensi with active start_url preservation
registerRoute(
  ({ url }) => url.pathname === '/manifest-presensi.json',
  async ({ event, url }) => {
    const startUrlParam = url.searchParams.get('start_url');
    try {
      const response = await fetch('/manifest-presensi.json', { cache: 'no-cache' });
      const manifest = (await response.json()) as Record<string, unknown>;
      if (startUrlParam) {
        const decoded = decodeURIComponent(startUrlParam);
        manifest.start_url = decoded;
        manifest.id = decoded;
      }
      return new Response(JSON.stringify(manifest), {
        headers: {
          'Content-Type': 'application/manifest+json; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      });
    } catch {
      return fetch((event as FetchEvent).request);
    }
  }
);

// Runtime caching for images (StaleWhileRevalidate preserves 2.9MB gambar cache across code deploys)
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: IMAGES_CACHE_NAME,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({
        maxEntries: 120,
        maxAgeSeconds: 30 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
    ],
  })
);

registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({
    cacheName: 'hrmatrix-fonts-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 30 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
    ],
  })
);

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const hadLegacyPrecache = cacheNames.some((n) => n.startsWith('workbox-precache'));

        const metaCache = await caches.open(META_CACHE_NAME);
        const prevResponse = await metaCache.match(META_BUILD_KEY);
        const previousBuildId = prevResponse ? await prevResponse.text() : null;

        await metaCache.put(
          META_BUILD_KEY,
          new Response(CURRENT_BUILD_ID, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          })
        );

        const isUpgrade =
          (previousBuildId !== null && previousBuildId !== CURRENT_BUILD_ID) ||
          (previousBuildId === null && hadLegacyPrecache);

        if (isUpgrade) {
          const windowClients = await self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true,
          });

          for (const client of windowClients) {
            client.postMessage({ type: 'SW_UPDATED', version: CURRENT_BUILD_ID });
            // Legacy SW clients (before app-updater.ts existed) get navigated once to load the latest bundle
            if (previousBuildId === null && 'navigate' in client) {
              try {
                await client.navigate(client.url);
              } catch {
                // Ignore if client cannot be navigated
              }
            }
          }
        }
      } catch {
        // Ignore non-critical activate metadata errors
      }
    })()
  );
});

self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
