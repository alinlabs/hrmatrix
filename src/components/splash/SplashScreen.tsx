import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

/**
 * Helper to determine the best matching splash screen image based on window aspect ratio:
 * - 9:20 (0.450) -> Tall mobile portrait (19.5:9, 20:9)
 * - 9:16 (0.563) -> Standard mobile portrait (16:9)
 * - 3:4  (0.750) -> Tablet portrait (iPads, foldables)
 * - 4:3  (1.333) -> Tablet landscape / standard 4:3 displays
 * - 16:9 (1.777) -> Widescreen desktop / laptop monitors
 */
function getMatchingSplashScreen(): string {
  if (typeof window === 'undefined') return '/gambar/splashscreen-16x9.webp';
  const width = window.innerWidth || document.documentElement.clientWidth || 1920;
  const height = window.innerHeight || document.documentElement.clientHeight || 1080;
  const ratio = width / (height || 1);

  if (ratio <= 0.506) {
    return '/gambar/splashscreen-9x20.webp';
  }
  if (ratio <= 0.656) {
    return '/gambar/splashscreen-9x16.webp';
  }
  if (ratio <= 1.04) {
    return '/gambar/splashscreen-3x4.webp';
  }
  if (ratio <= 1.555) {
    return '/gambar/splashscreen-4x3.webp';
  }
  return '/gambar/splashscreen-16x9.webp';
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [activeImage, setActiveImage] = useState<string>(getMatchingSplashScreen);

  // Update image when viewport resizes or rotates
  const handleResize = useCallback(() => {
    setActiveImage(getMatchingSplashScreen());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    // Lock body and html scroll strictly during splash screen
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Prevent touchmove and wheel scrolling events on window
    const preventScroll = (e: TouchEvent | WheelEvent) => {
      e.preventDefault();
    };

    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('wheel', preventScroll, { passive: false });

    // 5 seconds splash display
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 5000);

    const completeTimer = setTimeout(() => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalBodyTouchAction;
      onComplete();
    }, 5450);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalBodyTouchAction;
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
  };

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="image-splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(6px)', scale: 1.01 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[999999] bg-white select-none overflow-hidden overscroll-none touch-none w-screen h-[100dvh] max-w-full max-h-full cursor-pointer flex items-center justify-center"
          onClick={handleSkip}
          title="Klik untuk melewati"
        >
          {/* Latar Belakang Normal Putih Penuh */}
          <div className="absolute inset-0 w-full h-full bg-white z-0" />

          {/* Gambar Full Responsive di Baris Depan (Foreground) */}
          <picture className="absolute inset-0 w-full h-full block z-10">
            {/* Ultra-tall phone portrait (approx 9:20, 19.5:9, 20:9) */}
            <source media="(max-aspect-ratio: 506/1000)" srcSet="/gambar/splashscreen-9x20.webp" />
            
            {/* Standard phone portrait (approx 9:16) */}
            <source media="(max-aspect-ratio: 656/1000)" srcSet="/gambar/splashscreen-9x16.webp" />
            
            {/* Tablet / iPad portrait (approx 3:4) */}
            <source media="(max-aspect-ratio: 1040/1000)" srcSet="/gambar/splashscreen-3x4.webp" />
            
            {/* Tablet landscape / standard monitor (approx 4:3) */}
            <source media="(max-aspect-ratio: 1555/1000)" srcSet="/gambar/splashscreen-4x3.webp" />
            
            {/* Desktop / Laptop widescreen (approx 16:9, 16:10, 21:9) */}
            <source media="(min-aspect-ratio: 1556/1000)" srcSet="/gambar/splashscreen-16x9.webp" />

            {/* Fallback image */}
            <img
              src={activeImage}
              alt="HRMatrix Splash Screen"
              loading="eager"
              decoding="sync"
              className="w-full h-full object-cover object-center pointer-events-none select-none block"
            />
          </picture>

          {/* Tombol Lewati di sudut kanan atas dengan backdrop blur */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSkip();
            }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 px-3.5 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium tracking-wide transition-all border border-white/20 shadow-sm active:scale-95 cursor-pointer"
          >
            Lewati
          </button>

          {/* Garis Loading Progress Biru Modern di bagian bawah: 5 Detik */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 bg-slate-100/70 backdrop-blur-sm overflow-hidden z-30 border-t border-slate-200/40">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5.0, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 shadow-[0_0_12px_rgba(37,99,235,0.7)]"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
