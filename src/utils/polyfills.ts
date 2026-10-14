/**
 * Polyfills for browser compatibility (specifically Safari/WebKit and iframes).
 */

// Polyfill Promise.withResolvers if not present in the runtime
if (typeof Promise !== 'undefined' && typeof (Promise as any).withResolvers === 'undefined') {
  (Promise as any).withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// Polyfill ReadableStream.prototype[Symbol.asyncIterator]
// In WebKit / iOS Safari, "for await (const value of readableStream)" throws
// "TypeError: undefined is not a function (near '...value of readableStream...')"
// because ReadableStream is missing Symbol.asyncIterator.
if (typeof ReadableStream !== 'undefined') {
  const rsProto = ReadableStream.prototype as any;
  if (!rsProto[Symbol.asyncIterator]) {
    rsProto[Symbol.asyncIterator] = async function* () {
      const reader = this.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) return;
          yield value;
        }
      } finally {
        reader.releaseLock();
      }
    };
  }

  if (!rsProto.values) {
    rsProto.values = rsProto[Symbol.asyncIterator];
  }
}

// Suppress benign Vite HMR/WebSocket errors when HMR is disabled in container/iframe environments
if (typeof window !== 'undefined') {
  const isViteHmrError = (msg?: string) => {
    if (!msg) return false;
    return (
      msg.includes('ws.send') ||
      msg.includes('failed to connect to websocket') ||
      msg.includes('[vite] failed to connect') ||
      msg.includes('[vite] undefined is not an object') ||
      msg.includes('server-options.html#server-hmr')
    );
  };

  if (window.console && window.console.error) {
    const origConsoleError = window.console.error;
    window.console.error = function (...args: any[]) {
      const first = typeof args[0] === 'string' ? args[0] : '';
      if (isViteHmrError(first)) return;
      origConsoleError.apply(window.console, args);
    };
  }

  window.addEventListener('error', (event) => {
    if (isViteHmrError(event.message) || isViteHmrError(event.error?.message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = typeof reason === 'string' ? reason : reason?.message || '';
    if (isViteHmrError(msg)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

