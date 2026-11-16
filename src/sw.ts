/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<string | { url: string; revision: string | null }>;
};

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

// Bypass service worker for /api/, sitemap XML, robots.txt, and llms.txt
registerRoute(
  ({ url }) =>
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

// SPA Navigation fallback for offline PWA support across all client routes (/demo, /employees, /payroll, etc.)
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    denylist: [
      /^\/api\//,
      /^\/sitemap/,
      /^\/robots\.txt$/,
      /^\/llms\.txt$/,
      /^\/manifest.*\.json$/,
      /\.(?:js|mjs|css|json|xml|txt|svg|png|webp|jpg|jpeg|gif|ico|woff|woff2|map)$/,
    ],
  })
);

// Dynamic Web App Manifest for My Presensi with active start_url preservation
registerRoute(
  ({ url }) => url.pathname === '/manifest-presensi.json',
  async ({ event, url }) => {
    const startUrlParam = url.searchParams.get('start_url');
    try {
      const response = await fetch('/manifest-presensi.json');
      const manifest = (await response.json()) as Record<string, unknown>;
      if (startUrlParam) {
        const decoded = decodeURIComponent(startUrlParam);
        manifest.start_url = decoded;
        manifest.id = decoded;
      }
      return new Response(JSON.stringify(manifest), {
        headers: {
          'Content-Type': 'application/manifest+json; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    } catch {
      return fetch((event as FetchEvent).request);
    }
  }
);

// Runtime caching for images and Google Fonts
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({ cacheName: 'hrmatrix-images-cache' })
);

registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({ cacheName: 'hrmatrix-fonts-cache' })
);

self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
