import React, { useEffect, useState } from 'react';

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
  const [fadingOut, setFadingOut] = useState(false);
  const [splashSrc, setSplashSrc] = useState<string>(() => {
    if (typeof window === 'undefined') return '/gambar/splashscreen-16x9.webp';
    return getBestSplashSrc(window.innerWidth, window.innerHeight);
  });

  useEffect(() => {
    const handleResize = () => {
      setSplashSrc(getBestSplashSrc(window.innerWidth, window.innerHeight));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setFadingOut(true);
    }, 1250);

    const doneTimer = window.setTimeout(() => {
      onComplete();
    }, 1550);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white overflow-hidden select-none transition-opacity duration-300 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <img
        src={splashSrc}
        alt="HRMatrix Indonesia"
        fetchPriority="high"
        decoding="sync"
        className="w-full h-full object-contain object-bottom"
      />
    </div>
  );
};

export default SplashScreen;
