import React, { useEffect, useState, useCallback } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SPLASH_VARIANTS = [
  { src: '/gambar/splashscreen-9x20.webp', ratio: 9 / 20 },
  { src: '/gambar/splashscreen-9x16.webp', ratio: 9 / 16 },
  { src: '/gambar/splashscreen-3x4.webp', ratio: 3 / 4 },
  { src: '/gambar/splashscreen-4x3.webp', ratio: 4 / 3 },
  { src: '/gambar/splashscreen-16x9.webp', ratio: 16 / 9 },
] as const;

function getBestSplashSrc(): string {
  if (typeof window === 'undefined' || window.innerHeight <= 0) {
    return '/gambar/splashscreen-16x9.webp';
  }
  const viewportRatio = window.innerWidth / window.innerHeight;
  let best: (typeof SPLASH_VARIANTS)[number] = SPLASH_VARIANTS[0];
  let smallestDiff = Infinity;

  for (const variant of SPLASH_VARIANTS) {
    const diff = Math.abs(Math.log(viewportRatio / variant.ratio));
    if (diff < smallestDiff) {
      smallestDiff = diff;
      best = variant;
    }
  }
  return best.src;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [splashSrc, setSplashSrc] = useState<string>(() => getBestSplashSrc());
  const [imageReady, setImageReady] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const updateSplashForViewport = useCallback(() => {
    setSplashSrc(getBestSplashSrc());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateSplashForViewport);
    return () => window.removeEventListener('resize', updateSplashForViewport);
  }, [updateSplashForViewport]);

  // Immediately mark ready if already cached by browser, with safety fallback timeout
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setImageReady(true);
      return;
    }
    const fallbackTimer = window.setTimeout(() => {
      setImageReady(true);
    }, 800);
    return () => window.clearTimeout(fallbackTimer);
  }, [splashSrc]);

  useEffect(() => {
    if (!imageReady) return;

    const fadeTimer = window.setTimeout(() => {
      setFadingOut(true);
    }, 1500);

    const doneTimer = window.setTimeout(() => {
      onComplete();
    }, 1800);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [imageReady, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end justify-center bg-white overflow-hidden transition-opacity duration-300 select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <img
        ref={imgRef}
        src={splashSrc}
        alt="HRMatrix Indonesia - Partner Solusi Terpercaya HR & GA Indonesia"
        onLoad={() => setImageReady(true)}
        onError={() => setImageReady(true)}
        draggable={false}
        className={`w-full h-full object-contain object-bottom transition-opacity duration-300 ${
          imageReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default SplashScreen;
