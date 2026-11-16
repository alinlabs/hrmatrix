/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { useCompany } from '../../context/company-context';
import { HideBottomNav } from '../../context/mobile-nav-context';
import { useScrollLock } from '../../hooks/use-scroll-lock';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CompanyBottomSheetProps {
  isSplashActive?: boolean;
}

export function CompanyBottomSheet({ isSplashActive = false }: CompanyBottomSheetProps) {
  const { isBottomSheetOpen, isLoading, isRegistered, closeCompanySetupModal, openCompanySetupModal } = useCompany();
  const location = useLocation();
  const hasAutoPromptedRef = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  useScrollLock(isBottomSheetOpen);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show registration modal only once on initial web entry (when not registered yet)
  useEffect(() => {
    const p = (location.pathname || '').toLowerCase();
    const isExcludedPath =
      p === '/demo' ||
      p.startsWith('/demo/') ||
      p === '/daftar' ||
      p === '/my-presensi' ||
      p.includes('sitemap') ||
      p.includes('robots') ||
      p.endsWith('.xml') ||
      p.endsWith('.txt');

    if (isSplashActive || isLoading || isRegistered || isExcludedPath || hasAutoPromptedRef.current) return;

    try {
      const isRegDismissed = sessionStorage.getItem('hrmatrix_reg_modal_dismissed') === 'true';
      if (!isRegDismissed) {
        hasAutoPromptedRef.current = true;
        openCompanySetupModal();
      }
    } catch {
      hasAutoPromptedRef.current = true;
      openCompanySetupModal();
    }
  }, [isSplashActive, isLoading, isRegistered, location.pathname, openCompanySetupModal]);

  const handleCloseRegistrationModal = () => {
    try {
      sessionStorage.setItem('hrmatrix_reg_modal_dismissed', 'true');
    } catch {
      // ignore
    }
    closeCompanySetupModal();
  };

  // Keyboard Escape support
  useEffect(() => {
    if (!isBottomSheetOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseRegistrationModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBottomSheetOpen]);

  const currentPath = (location.pathname || '').toLowerCase();
  const isExcludedPath =
    currentPath === '/demo' ||
    currentPath.startsWith('/demo/') ||
    currentPath === '/daftar' ||
    currentPath === '/my-presensi' ||
    currentPath.includes('sitemap') ||
    currentPath.includes('robots') ||
    currentPath.endsWith('.xml') ||
    currentPath.endsWith('.txt');

  if (!mounted || isSplashActive || isExcludedPath) {
    return null;
  }

  const mobileVariants = {
    hidden: { y: '100%', opacity: 0.5 },
    visible: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 }
  };

  const desktopVariants = {
    hidden: { scale: 0.92, opacity: 0, y: 15 },
    visible: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.92, opacity: 0, y: 15 }
  };

  if (!isBottomSheetOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isBottomSheetOpen && (
        <React.Fragment key="reg-modal">
          <HideBottomNav />
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 pointer-events-auto overflow-hidden select-none"
            id="company-registration-modal-container"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md cursor-pointer"
              onClick={handleCloseRegistrationModal}
            />

            <motion.div
              variants={isMobile ? mobileVariants : desktopVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-full sm:max-w-md md:max-w-lg xl:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden bg-transparent max-h-[92vh] sm:max-h-[88vh] flex flex-col z-10"
              id="company-registration-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseRegistrationModal();
                }}
                className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-30 p-2 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 active:bg-slate-100 rounded-full shadow-sm transition-all cursor-pointer backdrop-blur-sm"
                aria-label="Tutup modal"
                title="Tutup"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
              </button>

              <div className="w-full relative rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col justify-end">
                <picture className="w-full block">
                  <source media="(min-width: 768px)" srcSet="/gambar/desktop_banner_daftar.webp" />
                  <img
                    src="/gambar/mobile_banner_daftar.webp"
                    alt="Selamat Datang di HRMatrix"
                    className="w-full h-auto object-contain max-h-[82vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl"
                  />
                </picture>
              </div>
            </motion.div>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>,
    document.body
  );
}
