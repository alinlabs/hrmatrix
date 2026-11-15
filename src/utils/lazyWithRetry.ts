import { ComponentType, lazy } from 'react';

/**
 * A wrapper around React.lazy that handles dynamic import failures.
 * When Vite reloads or network chunks are out of date, importing a module script can fail.
 * This wrapper catches that error, retries the import, and if needed safely reloads to get fresh chunks.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    const storageKey = 'page_reloaded_module_script_failed';
    const pageHasBeenForceRefreshed = window.sessionStorage.getItem(storageKey);

    try {
      const component = await componentImport();
      window.sessionStorage.removeItem(storageKey);
      return component;
    } catch (error) {
      console.warn('Dynamic import failed, retrying...', error);
      try {
        // Wait 300ms and retry
        await new Promise((resolve) => setTimeout(resolve, 300));
        const component = await componentImport();
        window.sessionStorage.removeItem(storageKey);
        return component;
      } catch (retryError) {
        console.warn('Dynamic import retry failed:', retryError);
        if (!pageHasBeenForceRefreshed) {
          window.sessionStorage.setItem(storageKey, 'true');
          window.location.reload();
          return new Promise<{ default: T }>(() => {});
        }
        // Fallback: retry once more without throwing error to prevent app crash
        try {
          return await componentImport();
        } catch (finalError) {
          console.error('Final dynamic import attempt failed:', finalError);
          throw finalError;
        }
      }
    }
  });
}
