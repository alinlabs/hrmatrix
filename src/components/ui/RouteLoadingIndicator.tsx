import React, { useEffect, useState } from 'react';
import { HRMatrixLogo } from './Logo';
import { cn } from '../../utils/cn';

interface RouteLoadingIndicatorProps {
  fullScreen?: boolean;
  label?: string;
  showDelayMs?: number;
  className?: string;
}

/**
 * Branded route/section loading indicator reusing HRMatrix's Lottie logo asset.
 * Uses a brief anti-flash visibility threshold so instant/cached transitions never flicker,
 * while never delaying the mount of resolved route components.
 */
export function RouteLoadingIndicator({
  fullScreen = false,
  label = 'Memuat halaman...',
  showDelayMs = 150,
  className,
}: RouteLoadingIndicatorProps) {
  const [visible, setVisible] = useState(showDelayMs <= 0);

  useEffect(() => {
    if (showDelayMs <= 0) {
      setVisible(true);
      return;
    }
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, showDelayMs);
    return () => window.clearTimeout(timer);
  }, [showDelayMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'w-full flex flex-col items-center justify-center transition-opacity duration-150 select-none',
        fullScreen ? 'min-h-screen bg-white' : 'flex-1 min-h-[260px] py-16',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className
      )}
    >
      <HRMatrixLogo className="w-12 h-12 mb-3" animated={true} />
      {label && (
        <span className="text-xs font-medium text-slate-500">{label}</span>
      )}
    </div>
  );
}

export default RouteLoadingIndicator;
