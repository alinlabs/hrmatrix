import { RefObject, useEffect, useState } from 'react';

export interface UseDropdownPlacementOptions {
  isOpen: boolean;
  containerRef: RefObject<HTMLElement | null>;
  defaultMaxHeight?: number;
  minHeight?: number;
  preferredPlacement?: 'auto' | 'top' | 'bottom';
}

export interface UseDropdownPlacementResult {
  placement: 'top' | 'bottom';
  maxHeight: number;
  dropdownClasses: string;
}

export function useDropdownPlacement({
  isOpen,
  containerRef,
  defaultMaxHeight = 240,
  minHeight = 140,
  preferredPlacement = 'auto',
}: UseDropdownPlacementOptions): UseDropdownPlacementResult {
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
  const [maxHeight, setMaxHeight] = useState<number>(defaultMaxHeight);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const calculate = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const spaceBelow = Math.max(0, viewportHeight - rect.bottom - 16);
      const spaceAbove = Math.max(0, rect.top - 16);

      let resolved: 'top' | 'bottom' = 'bottom';
      if (preferredPlacement === 'top') {
        resolved = 'top';
      } else if (preferredPlacement === 'bottom') {
        resolved = 'bottom';
      } else {
        if (spaceBelow < minHeight && spaceAbove > spaceBelow) {
          resolved = 'top';
        } else {
          resolved = 'bottom';
        }
      }

      const availableSpace = resolved === 'top' ? spaceAbove : spaceBelow;
      const computedMax = Math.max(minHeight, Math.min(defaultMaxHeight, availableSpace));

      setPlacement(resolved);
      setMaxHeight(computedMax);
    };

    calculate();
    window.addEventListener('resize', calculate);
    window.addEventListener('scroll', calculate, true);

    return () => {
      window.removeEventListener('resize', calculate);
      window.removeEventListener('scroll', calculate, true);
    };
  }, [isOpen, containerRef, defaultMaxHeight, minHeight, preferredPlacement]);

  const dropdownClasses =
    placement === 'top'
      ? 'bottom-full mb-1.5 origin-bottom'
      : 'top-full mt-1.5 origin-top';

  return { placement, maxHeight, dropdownClasses };
}
