import React, { ComponentType, LazyExoticComponent } from 'react';

const RETRY_SESSION_PREFIX = 'hrmatrix_lazy_reload_';

/**
 * Wraps React.lazy with automatic retry for transient chunk-loading errors
 * (e.g., after deployments or flaky mobile connections).
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
  delayMs = 300
): LazyExoticComponent<T> {
  return React.lazy(async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await factory();
      } catch (err) {
        lastError = err;
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
        }
      }
    }

    // Attempt a single safe reload if chunk URL became stale after deploy
    if (typeof window !== 'undefined') {
      const msg = lastError instanceof Error ? lastError.message : String(lastError);
      const isChunkError =
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Importing a module script failed') ||
        msg.includes('Loading chunk');
      const key = `${RETRY_SESSION_PREFIX}${window.location.pathname}`;
      try {
        if (isChunkError && !sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1');
          const doReload = () => window.location.reload();
          if (typeof caches !== 'undefined') {
            await caches
              .keys()
              .then((names) => Promise.all(names.map((n) => caches.delete(n))))
              .catch(() => {});
          }
          doReload();
        }
      } catch {
        // Ignore sessionStorage restrictions
      }
    }

    throw lastError;
  });
}
