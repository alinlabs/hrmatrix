import { useEffect, useRef } from 'react';

let lockCount = 0;
let originalHtmlOverflow = '';
let originalBodyOverflow = '';

export function lockScroll() {
  if (typeof document === 'undefined') return;
  
  if (lockCount === 0) {
    originalHtmlOverflow = document.documentElement.style.overflow || '';
    originalBodyOverflow = document.body.style.overflow || '';

    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}

export function unlockScroll() {
  if (typeof document === 'undefined') return;

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');

    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.overflow = originalBodyOverflow;
  }
}

export function resetAllScrollLocks() {
  if (typeof document === 'undefined') return;
  lockCount = 0;
  document.documentElement.classList.remove('modal-open');
  document.body.classList.remove('modal-open');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.documentElement.style.touchAction = '';
  document.body.style.touchAction = '';
}

/**
 * Custom React Hook to lock scrolling on html and body elements
 * while allowing scroll within modal containers.
 * Uses local ref tracking to guarantee 1-to-1 lock and unlock pairs.
 */
export function useScrollLock(isLocked: boolean) {
  const isLockedRef = useRef(false);

  useEffect(() => {
    if (isLocked && !isLockedRef.current) {
      lockScroll();
      isLockedRef.current = true;
    } else if (!isLocked && isLockedRef.current) {
      unlockScroll();
      isLockedRef.current = false;
    }

    return () => {
      if (isLockedRef.current) {
        unlockScroll();
        isLockedRef.current = false;
      }
    };
  }, [isLocked]);
}

