const RELOAD_TS_KEY = 'hrmatrix_updater_reload_ts';
const RELOAD_VER_KEY = 'hrmatrix_updater_target_ver';
const RELOAD_COOLDOWN_MS = 15000;
const CHECK_DEBOUNCE_MS = 5 * 60 * 1000; // 5 minutes cooldown for tab-switch checks
const PERIODIC_CHECK_MS = 10 * 60 * 1000; // 10 minutes interval for long-lived tabs

let initialized = false;
let lastCheckAt = 0;
let swRegistration: ServiceWorkerRegistration | null = null;

function getCurrentBuildId(): string {
  try {
    return typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : 'dev';
  } catch {
    return 'dev';
  }
}

function isSpecialNonAppPath(): boolean {
  if (typeof window === 'undefined') return true;
  const path = (window.location.pathname || '').toLowerCase();
  return (
    path.includes('sitemap') ||
    path.includes('robots') ||
    path.endsWith('.xml') ||
    path.endsWith('.txt') ||
    path.startsWith('/api')
  );
}

async function performCleanUpdateReload(targetVersion?: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const now = Date.now();
    const lastReloadTs = Number(sessionStorage.getItem(RELOAD_TS_KEY) || '0');
    if (lastReloadTs && now - lastReloadTs < RELOAD_COOLDOWN_MS) {
      return;
    }

    if (targetVersion) {
      const prevTarget = sessionStorage.getItem(RELOAD_VER_KEY);
      if (prevTarget === targetVersion) {
        return;
      }
      sessionStorage.setItem(RELOAD_VER_KEY, targetVersion);
    }

    sessionStorage.setItem(RELOAD_TS_KEY, String(now));
  } catch {
    // Ignore restricted storage frames
  }

  // Keep immutable hashed assets, images, fonts, and active Workbox precache intact;
  // only clean up legacy non-Workbox shell caches if any exist.
  window.location.reload();
}

async function checkServerVersion(force = false): Promise<void> {
  if (typeof window === 'undefined' || import.meta.env.DEV) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;

  const now = Date.now();
  if (!force && now - lastCheckAt < CHECK_DEBOUNCE_MS) return;
  lastCheckAt = now;

  if (swRegistration) {
    swRegistration.update().catch(() => {});
  }

  try {
    // Use clean URL + cache: 'no-cache' (HTTP ETag validation) so Vercel Edge returns 304 (0 bytes)
    // when unchanged and fresh 200 JSON immediately after a new deploy.
    const res = await fetch('/version.json', {
      cache: 'no-cache',
    });
    if (!res.ok) return;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return;

    const data = (await res.json()) as { version?: string };
    const currentBuildId = getCurrentBuildId();

    if (data?.version && currentBuildId !== 'dev' && data.version !== currentBuildId) {
      if (swRegistration?.waiting) {
        swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      await performCleanUpdateReload(data.version);
    }
  } catch {
    // Offline or transient network error — keep current session intact
  }
}

async function registerAndMonitorServiceWorker(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || import.meta.env.DEV) {
    return;
  }

  const hadController = Boolean(navigator.serviceWorker.controller);

  navigator.serviceWorker.addEventListener('controllerchange', async () => {
    if (!hadController) return;

    try {
      const res = await fetch('/version.json', {
        cache: 'no-cache',
      });
      if (res.ok) {
        const data = (await res.json()) as { version?: string };
        const currentBuildId = getCurrentBuildId();
        if (data?.version && data.version === currentBuildId) {
          return;
        }
        await performCleanUpdateReload(data?.version);
        return;
      }
    } catch {
      // If offline, avoid disruptive reload
      return;
    }

    await performCleanUpdateReload();
  });

  navigator.serviceWorker.addEventListener('message', async (event: MessageEvent) => {
    if (event.data && event.data.type === 'SW_UPDATED') {
      const serverVersion = event.data.version as string | undefined;
      const currentBuildId = getCurrentBuildId();
      if (serverVersion && currentBuildId !== 'dev' && serverVersion !== currentBuildId) {
        await performCleanUpdateReload(serverVersion);
      }
    }
  });

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
    swRegistration = registration;

    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          newWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    });

    registration.update().catch(() => {});
  } catch {
    // Service worker unavailable in restricted environments
  }
}

export function initAppUpdater(): void {
  if (initialized || typeof window === 'undefined' || isSpecialNonAppPath()) {
    return;
  }
  initialized = true;

  if (document.readyState === 'complete') {
    void registerAndMonitorServiceWorker();
    void checkServerVersion(true);
  } else {
    window.addEventListener(
      'load',
      () => {
        void registerAndMonitorServiceWorker();
        void checkServerVersion(true);
      },
      { once: true }
    );
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      void checkServerVersion(false);
    }
  });

  window.addEventListener('online', () => {
    void checkServerVersion(true);
  });

  window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      void checkServerVersion(false);
    }
  }, PERIODIC_CHECK_MS);
}
