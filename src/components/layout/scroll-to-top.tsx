import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Utility function to immediately reset scroll position to top (0, 0)
 * across window, document, body, and all scrollable main containers.
 */
export function scrollToTop(smooth: boolean = false) {
  if (typeof window === 'undefined') return;

  const behavior: ScrollBehavior = smooth ? 'smooth' : 'instant';

  const isSidebarElement = (el: Element): boolean => {
    return (
      el.closest('nav') !== null ||
      el.closest('aside') !== null ||
      el.closest('[data-sidebar="true"]') !== null ||
      el.closest('[data-no-scroll-reset="true"]') !== null ||
      el.classList.contains('sidebar')
    );
  };

  const resetAll = (checkInnerOverflows: boolean) => {
    if (window.scrollY !== 0 || window.scrollX !== 0) {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior,
        });
      } catch {
        window.scrollTo(0, 0);
      }
    }

    if (document.documentElement && document.documentElement.scrollTop !== 0) {
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
    }
    if (document.body && document.body.scrollTop !== 0) {
      document.body.scrollTop = 0;
      document.body.scrollLeft = 0;
    }

    const primaryScroll = document.getElementById('main-content-scroll');
    if (primaryScroll && primaryScroll.scrollTop !== 0) {
      primaryScroll.scrollTop = 0;
    }

    if (checkInnerOverflows) {
      const innerContentOverflows = document.querySelectorAll(
        'main .overflow-y-auto, main .overflow-auto, [data-scroll-container="true"] .overflow-y-auto'
      );
      innerContentOverflows.forEach((el) => {
        if (el instanceof HTMLElement && el.scrollTop !== 0 && !isSidebarElement(el)) {
          el.scrollTop = 0;
        }
      });
    }
  };

  resetAll(false);

  requestAnimationFrame(() => {
    resetAll(true);
  });
}

/**
 * Hook to reset scroll position on component mount or trigger
 */
export function useScrollToTop(trigger?: unknown) {
  useEffect(() => {
    scrollToTop();
  }, [trigger]);
}

/**
 * ScrollToTop Component
 * Place this inside BrowserRouter. Automatically scrolls window/page to top on every navigation/route change.
 */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    scrollToTop();
  }, [pathname, search]);

  return null;
}

export default ScrollToTop;
