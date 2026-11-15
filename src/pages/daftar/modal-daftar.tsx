/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCompany } from '../../context/CompanyContext';
import { HideBottomNav } from '../../context/MobileNavContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CompanyBottomSheetProps {
  isSplashActive?: boolean;
}

export function CompanyBottomSheet({ isSplashActive = false }: CompanyBottomSheetProps) {
  const { isBottomSheetOpen, closeCompanySetupModal, openCompanySetupModal } = useCompany();
  const navigate = useNavigate();
  const location = useLocation();

  const [mounted, setMounted] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  // Lock scroll if either modal is open
  useScrollLock(isBottomSheetOpen || isPromoOpen);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Modal display logic on mount/refresh
  useEffect(() => {
    const p = (location.pathname || '').toLowerCase();
    const isExcludedPath = 
      p === '/daftar' || 
      p.includes('sitemap') || 
      p.includes('robots') || 
      p.endsWith('.xml') || 
      p.endsWith('.txt');

    if (isSplashActive || isExcludedPath) return;

    try {
      const isRegDismissed = sessionStorage.getItem('hrmatrix_reg_modal_dismissed') === 'true';
      const isPromoDismissed = sessionStorage.getItem('hrmatrix_promo_modal_dismissed') === 'true';

      if (!isRegDismissed) {
        // First visit in session: open registration modal
        openCompanySetupModal();
      } else if (!isPromoDismissed) {
        // If registration was dismissed but promo hasn't been shown yet: show promo once
        setIsPromoOpen(true);
      }
      // If both are dismissed, do nothing on refresh
    } catch {
      openCompanySetupModal();
    }
  }, [isSplashActive, location.pathname]);

  // Keyboard Escape support
  useEffect(() => {
    if (!isBottomSheetOpen && !isPromoOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isBottomSheetOpen) {
          handleCloseRegistrationModal();
        } else if (isPromoOpen) {
          handleClosePromoModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBottomSheetOpen, isPromoOpen]);

  const handleCloseRegistrationModal = () => {
    try {
      sessionStorage.setItem('hrmatrix_reg_modal_dismissed', 'true');
    } catch {
      // ignore
    }
    closeCompanySetupModal();

    // After closing registration modal, show promo modal once if not previously dismissed
    try {
      const isPromoDismissed = sessionStorage.getItem('hrmatrix_promo_modal_dismissed') === 'true';
      if (!isPromoDismissed) {
        setIsPromoOpen(true);
      }
    } catch {
      setIsPromoOpen(true);
    }
  };

  const handleClosePromoModal = () => {
    try {
      sessionStorage.setItem('hrmatrix_promo_modal_dismissed', 'true');
    } catch {
      // ignore
    }
    setIsPromoOpen(false);
  };

  const handleGoToDaftar = () => {
    try {
      sessionStorage.setItem('hrmatrix_reg_modal_dismissed', 'true');
      sessionStorage.setItem('hrmatrix_promo_modal_dismissed', 'true');
    } catch {
      // ignore
    }
    closeCompanySetupModal();
    setIsPromoOpen(false);
    if (location.pathname !== '/daftar') {
      navigate('/daftar');
    }
  };

  const handleClaimPromoEmail = () => {
    try {
      sessionStorage.setItem('hrmatrix_promo_modal_dismissed', 'true');
    } catch {
      // ignore
    }
    setIsPromoOpen(false);
    
    const recipient = 'hrmatrix.id@gmail.com';
    const subject = encodeURIComponent('Pengajuan Customisasi & Klaim Promo HRMatrix');
    const body = encodeURIComponent(
`Halo Tim HRMatrix Indonesia,

Saya tertarik dengan penawaran promo dan ingin mengajukan customisasi sistem HRMatrix untuk perusahaan kami.

Detail Perusahaan & Kebutuhan:
- Nama Perusahaan: 
- Penanggung Jawab: 
- Nomor WhatsApp / HP: 
- Estimasi Jumlah Karyawan: 
- Kebutuhan Customisasi Khusus: 

Mohon informasi lebih lanjut mengenai promo dan opsi customisasi ini. Terima kasih!`
    );

    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const currentPath = (location.pathname || '').toLowerCase();
  const isExcludedPath = 
    currentPath === '/daftar' || 
    currentPath.includes('sitemap') || 
    currentPath.includes('robots') || 
    currentPath.endsWith('.xml') || 
    currentPath.endsWith('.txt');

  if (!mounted || isSplashActive || isExcludedPath) {
    return null;
  }

  // Animation variants
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

  if (!isBottomSheetOpen && !isPromoOpen) return null;

  return createPortal(
    <AnimatePresence>
      {/* 1. COMPANY REGISTRATION MODAL */}
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
                className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-30 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 active:bg-slate-200 rounded-full transition-all cursor-pointer backdrop-blur-sm"
                aria-label="Tutup modal"
                title="Tutup"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
              </button>

              <div
                className="w-full relative cursor-pointer group rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col justify-end"
                onClick={handleGoToDaftar}
                title="Klik untuk mendaftar profil perusahaan"
              >
                <picture className="w-full block">
                  <source media="(min-width: 768px)" srcSet="/gambar/desktop_banner_daftar.webp" />
                  <img
                    src="/gambar/mobile_banner_daftar.webp"
                    alt="Daftarkan Profil Perusahaan"
                    className="w-full h-auto object-contain max-h-[82vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl transition-transform duration-300 group-hover:scale-[1.005]"
                  />
                </picture>

                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 z-20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGoToDaftar();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-2xl shadow-xl shadow-blue-900/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer backdrop-blur-sm border border-blue-400/30"
                  >
                    <span>Daftarkan Sekarang</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </React.Fragment>
      )}

      {/* 2. PROMO BANNER MODAL */}
      {!isBottomSheetOpen && isPromoOpen && (
        <React.Fragment key="promo-modal">
          <HideBottomNav />
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 pointer-events-auto overflow-hidden select-none"
            id="promo-banner-modal-container"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md cursor-pointer"
              onClick={handleClosePromoModal}
            />

            <motion.div
              variants={isMobile ? mobileVariants : desktopVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-full sm:max-w-md md:max-w-lg xl:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden bg-transparent max-h-[92vh] sm:max-h-[88vh] flex flex-col z-10"
              id="promo-banner-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClosePromoModal();
                }}
                className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-30 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 active:bg-slate-200 rounded-full transition-all cursor-pointer backdrop-blur-sm"
                aria-label="Tutup promo"
                title="Tutup"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
              </button>

              <div
                className="w-full relative cursor-pointer group rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col justify-end"
                onClick={handleClaimPromoEmail}
                title="Klik untuk mengajukan customisasi & klaim promo"
              >
                <picture className="w-full block">
                  <source media="(min-width: 768px)" srcSet="/gambar/desktop_banner_promo.webp" />
                  <img
                    src="/gambar/mobile_banner_promo.webp"
                    alt="Promosi HRMatrix"
                    className="w-full h-auto object-contain max-h-[82vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl transition-transform duration-300 group-hover:scale-[1.005]"
                  />
                </picture>

                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 z-20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClaimPromoEmail();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-2xl shadow-xl shadow-blue-900/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer backdrop-blur-sm border border-blue-400/30"
                  >
                    <span>Dapatkan Promo Sekarang</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>,
    document.body
  );
}
