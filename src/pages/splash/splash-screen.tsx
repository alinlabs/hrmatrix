import React, { useEffect, useRef, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SPLASH_VARIANTS = [
  { key: '9x20', ratio: 9 / 20, src: '/gambar/splashscreen-9x20.webp' },
  { key: '9x16', ratio: 9 / 16, src: '/gambar/splashscreen-9x16.webp' },
  { key: '3x4', ratio: 3 / 4, src: '/gambar/splashscreen-3x4.webp' },
  { key: '4x3', ratio: 4 / 3, src: '/gambar/splashscreen-4x3.webp' },
  { key: '16x9', ratio: 16 / 9, src: '/gambar/splashscreen-16x9.webp' },
] as const;

const PROGRESS_DURATION_MS = 3000;
const FADE_OUT_DURATION_MS = 320;
const IMAGE_LOAD_FALLBACK_TIMEOUT_MS = 12000;

function getBestSplashSrc(width: number, height: number): string {
  if (!width || !height) return '/gambar/splashscreen-16x9.webp';
  const viewportRatio = width / height;
  let best: (typeof SPLASH_VARIANTS)[number] = SPLASH_VARIANTS[0];
  let bestDiff = Infinity;

  for (const variant of SPLASH_VARIANTS) {
    const diff = Math.abs(Math.log(viewportRatio / variant.ratio));
    if (diff < bestDiff) {
      bestDiff = diff;
      best = variant;
    }
  }
  return best.src;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [imageReady, setImageReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const [splashSrc, setSplashSrc] = useState<string>(() => {
    if (typeof window === 'undefined') return '/gambar/splashscreen-16x9.webp';
    return getBestSplashSrc(window.innerWidth, window.innerHeight);
  });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const readyLockRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (!readyLockRef.current) {
        setSplashSrc(getBestSplashSrc(window.innerWidth, window.innerHeight));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const markImageReady = () => {
    if (readyLockRef.current) return;
    readyLockRef.current = true;
    setImageReady(true);
  };

  const handleImageLoaded = () => {
    const img = imgRef.current;
    if (img && typeof img.decode === 'function') {
      img
        .decode()
        .catch(() => {})
        .finally(() => {
          markImageReady();
        });
    } else {
      markImageReady();
    }
  };

  // Handle cached image that may already be complete before onLoad attaches, plus safety timeout
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      handleImageLoaded();
    }

    const fallbackTimer = window.setTimeout(() => {
      markImageReady();
    }, IMAGE_LOAD_FALLBACK_TIMEOUT_MS);

    return () => {
      window.clearTimeout(fallbackTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splashSrc]);

  // Run the 3-second bottom progress line ONLY after the splashscreen image is 100% loaded
  useEffect(() => {
    if (!imageReady) return;

    let rafId = 0;
    let fadeTimer = 0;
    let doneTimer = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, Math.max(0, elapsed / PROGRESS_DURATION_MS));
      setProgress(ratio * 100);

      if (ratio < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setFadingOut(true);
        doneTimer = window.setTimeout(() => {
          onCompleteRef.current();
        }, FADE_OUT_DURATION_MS);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    // Backup timeout in case requestAnimationFrame is throttled in a background tab
    fadeTimer = window.setTimeout(() => {
      setProgress(100);
      setFadingOut(true);
      if (!doneTimer) {
        doneTimer = window.setTimeout(() => {
          onCompleteRef.current();
        }, FADE_OUT_DURATION_MS);
      }
    }, PROGRESS_DURATION_MS + 100);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (fadeTimer) window.clearTimeout(fadeTimer);
      if (doneTimer) window.clearTimeout(doneTimer);
    };
  }, [imageReady]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white overflow-hidden select-none transition-opacity duration-300 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <img
        ref={imgRef}
        src={splashSrc}
        alt="HRMatrix Indonesia"
        fetchPriority="high"
        decoding="sync"
        onLoad={handleImageLoaded}
        onError={markImageReady}
        className={`w-full h-full object-contain object-bottom transition-opacity duration-200 ${
          imageReady ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {imageReady && (
        <div
          className="fixed bottom-0 left-0 right-0 h-1 bg-slate-200/75 overflow-hidden z-[101]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Memuat aplikasi HRMatrix"
        >
          <div
            className="h-full w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 origin-left will-change-transform"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
