import { useState, useLayoutEffect, useEffect, RefObject } from 'react';

interface UseDropdownPlacementOptions {
  isOpen: boolean;
  containerRef: RefObject<HTMLElement | null>;
  defaultMaxHeight?: number;
  minHeight?: number;
}

export function useDropdownPlacement({
  isOpen,
  containerRef,
  defaultMaxHeight = 240,
  minHeight = 120,
}: UseDropdownPlacementOptions) {
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
  const [maxHeight, setMaxHeight] = useState<number>(defaultMaxHeight);

  const calculatePlacement = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Check if bottom navigation or mobile action portal is visible on screen
    const bottomNav = document.getElementById('mobile-bottom-navigation');
    const actionPortal = document.getElementById('mobile-bottom-action-portal');
    
    let bottomNavHeight = 0;
    if (bottomNav && window.getComputedStyle(bottomNav).display !== 'none') {
      bottomNavHeight = Math.max(bottomNavHeight, bottomNav.offsetHeight || 64);
    }
    if (actionPortal && window.getComputedStyle(actionPortal).display !== 'none' && actionPortal.children.length > 0) {
      bottomNavHeight = Math.max(bottomNavHeight, actionPortal.offsetHeight || 64);
    }

    const viewportHeight = window.innerHeight;
    const effectiveBottom = viewportHeight - bottomNavHeight;
    const spaceBelow = effectiveBottom - rect.bottom;
    const spaceAbove = rect.top;

    // If space below is constrained (less than 230px) and there is more space above,
    // intelligently flip UPWARDS (dropup) so it won't be blocked by the bottom edge or bottom nav
    if (spaceBelow < 230 && spaceAbove > spaceBelow) {
      setPlacement('top');
      const calculatedMax = Math.min(defaultMaxHeight, Math.max(minHeight, spaceAbove - 16));
      setMaxHeight(calculatedMax);
    } else {
      setPlacement('bottom');
      const calculatedMax = Math.min(defaultMaxHeight, Math.max(minHeight, spaceBelow - 16));
      setMaxHeight(calculatedMax);
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      calculatePlacement();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Recalculate on window resize or scroll
    const handleUpdate = () => {
      calculatePlacement();
    };

    window.addEventListener('resize', handleUpdate, { passive: true });
    window.addEventListener('scroll', handleUpdate, { passive: true, capture: true });

    // Ensure the opened trigger/dropdown is scrolled into view if it was near the edge
    const scrollTimer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }, 40);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
      clearTimeout(scrollTimer);
    };
  }, [isOpen]);

  return {
    placement,
    maxHeight,
    isDropup: placement === 'top',
    dropdownClasses: placement === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
  };
}
