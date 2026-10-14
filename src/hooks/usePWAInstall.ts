import { useEffect, useState, useCallback } from 'react';
import { openPWAModal } from '../components/pwa/PWAInstallModal';
import { isAppleOrSafariDevice } from '../utils/deviceDetector';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAppleOrSafari, setIsAppleOrSafari] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS devices (iPhone, iPad, iPod, iPadOS on MacIntel)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // Detect Apple ecosystem (iOS device OR Safari browser)
    setIsAppleOrSafari(isAppleOrSafariDevice());

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.error('Error invoking PWA prompt:', err);
    }
    return false;
  }, [deferredPrompt]);

  // Primary install trigger:
  // - Pada iOS / iPhone / iPad: selalu membuka modal panduan instalasi Safari
  // - Selain iOS:
  //    * Jika ada deferredPrompt (Android Chrome / Edge / Desktop PWA): langsung jalankan prompt instalasi PWA
  //    * Jika sudah terinstal: buka modal informasi status terinstal
  //    * Jika belum terinstal & belum ada prompt otomatis: buka modal petunjuk manual
  const handleInstallAction = useCallback(async () => {
    if (isIOS) {
      openPWAModal('ios');
      return;
    }

    if (isInstalled) {
      openPWAModal('installed');
      return;
    }

    if (deferredPrompt) {
      await install();
      return;
    }

    openPWAModal('manual');
  }, [isIOS, isInstalled, deferredPrompt, install]);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAppleOrSafari,
    install,
    handleInstallAction,
  };
}

