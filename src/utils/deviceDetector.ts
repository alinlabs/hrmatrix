import { useState, useEffect } from 'react';

/**
 * Mendeteksi secara akurat apakah device pengguna adalah perangkat iOS (iPhone, iPad, iPod)
 * atau peramban Safari di ekosistem Apple (macOS / iPadOS / iOS).
 *
 * Sesuai instruksi:
 * - Jika terdeteksi Safari atau iOS -> menggunakan Apple
 * - Jika Android / Windows / Chrome / dll -> menggunakan Google
 */
export function isAppleOrSafariDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const ua = (navigator.userAgent || '').toLowerCase();
  const platform = ((navigator as any).platform || '').toLowerCase();
  const vendor = (navigator.vendor || '').toLowerCase();
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  // 1. Deteksi iOS Hardware: iPhone, iPad, iPod
  const isDirectIOS = /iphone|ipad|ipod/.test(ua);
  if (isDirectIOS) return true;

  // 2. Deteksi iPadOS (iPad yang menyamar sebagai desktop MacIntel di Safari)
  const isIPadOS = platform === 'macintel' && maxTouchPoints > 1;
  if (isIPadOS) return true;

  // 3. Deteksi browser iOS pihak ketiga (CriOS = Chrome di iOS, FxiOS = Firefox di iOS, EdgiOS = Edge di iOS)
  const isIOSThirdPartyBrowser = /crios|fxios|edgios|optios/.test(ua);
  if (isIOSThirdPartyBrowser) return true;

  // 4. Deteksi Browser Safari (Apple Safari di macOS / iOS)
  // Periksa apakah vendor mengandung 'apple' ATAU string memuat 'safari'
  // dan BUKAN peramban berbasis Chromium / Android / Firefox desktop / Edge
  const isAppleVendor = vendor.includes('apple');
  const hasSafariString = ua.includes('safari');
  const isOtherBrowser = /chrome|chromium|edg|opr|opera|firefox|android|samsungbrowser/.test(ua);

  if ((isAppleVendor || hasSafariString) && !isOtherBrowser) {
    return true;
  }

  // 5. MacOS dengan Safari / WebKit native
  const isMac = /macintosh|macintel|macppc|mac68k/.test(platform) || /mac os x/.test(ua);
  if (isMac && hasSafariString && !isOtherBrowser) {
    return true;
  }

  return false;
}

/**
 * React Hook untuk mendeteksi apakah device adalah Apple / iOS / Safari secara reaktif
 */
export function useIsAppleOrSafari(): boolean {
  const [isApple, setIsApple] = useState<boolean>(() => {
    return isAppleOrSafariDevice();
  });

  useEffect(() => {
    setIsApple(isAppleOrSafariDevice());
  }, []);

  return isApple;
}
