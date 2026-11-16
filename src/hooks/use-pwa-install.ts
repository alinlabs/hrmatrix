import { useEffect, useState, useCallback } from 'react';
import { openPWAModal } from '../components/pwa/pwa-install-modal';
import { isAppleOrSafariDevice } from '../utils/device-detector';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let sharedDeferredPrompt: BeforeInstallPromptEvent | null = null;
let sharedIsInstalled = false;
let listenersInitialized = false;
const subscribers = new Set<() => void>();

function notifySubscribers() {
  subscribers.forEach((cb) => cb());
}

function initPWAListeners() {
  if (listenersInitialized || typeof window === 'undefined') return;
  listenersInitialized = true;

  sharedIsInstalled =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    sharedDeferredPrompt = e as BeforeInstallPromptEvent;
    notifySubscribers();
  });

  window.addEventListener('appinstalled', () => {
    sharedIsInstalled = true;
    sharedDeferredPrompt = null;
    notifySubscribers();
  });
}

if (typeof window !== 'undefined') {
  initPWAListeners();
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(sharedDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState<boolean>(sharedIsInstalled);
  const [isIOS, setIsIOS] = useState(false);
  const [isAppleOrSafari, setIsAppleOrSafari] = useState(false);

  useEffect(() => {
    initPWAListeners();

    const sync = () => {
      setDeferredPrompt(sharedDeferredPrompt);
      setIsInstalled(sharedIsInstalled);
    };
    subscribers.add(sync);
    sync();

    // Detect iOS devices (iPhone, iPad, iPod, iPadOS on MacIntel)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // Detect Apple ecosystem (iOS device OR Safari browser)
    setIsAppleOrSafari(isAppleOrSafariDevice());

    return () => {
      subscribers.delete(sync);
    };
  }, []);

  const install = useCallback(async () => {
    const promptEvent = sharedDeferredPrompt || deferredPrompt;
    if (!promptEvent) return false;
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        sharedIsInstalled = true;
        sharedDeferredPrompt = null;
        notifySubscribers();
        return true;
      }
    } catch (err) {
      console.error('Error invoking PWA prompt:', err);
    }
    return false;
  }, [deferredPrompt]);

  const handleInstallAction = useCallback(async () => {
    if (isIOS) {
      openPWAModal('ios');
      return;
    }

    if (isInstalled) {
      openPWAModal('installed');
      return;
    }

    if (sharedDeferredPrompt || deferredPrompt) {
      await install();
      return;
    }

    openPWAModal('manual');
  }, [isIOS, isInstalled, deferredPrompt, install]);

  return {
    isInstallable: !!(sharedDeferredPrompt || deferredPrompt),
    isInstalled,
    isIOS,
    isAppleOrSafari,
    install,
    handleInstallAction,
  };
}

