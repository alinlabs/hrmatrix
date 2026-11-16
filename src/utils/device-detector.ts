import { useMemo } from 'react';

export function isAppleOrSafariDevice(): boolean {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent || '';
  const platform = (navigator as any).userAgentData?.platform || navigator.platform || '';

  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (platform === 'MacIntel' && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1);

  const isMac = /Macintosh|Mac OS X/.test(ua) || /Mac/.test(platform);
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|CriOS|FxiOS/.test(ua);

  return isIOS || (isMac && isSafari);
}

export function useIsAppleOrSafari(): boolean {
  return useMemo(() => isAppleOrSafariDevice(), []);
}
