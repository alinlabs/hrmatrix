import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Share, PlusSquare, X } from 'lucide-react';
import { GoogleIcon, AppleIcon } from '../ui';
import { Modal } from '../ui/Modal';
import { useIsAppleOrSafari } from '../../utils/deviceDetector';

export type PWAModalType = 'ios' | 'manual' | 'installed' | null;

export const openPWAModal = (type: 'ios' | 'manual' | 'installed') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hrmatrix_open_pwa_modal', { detail: { type } }));
  }
};

export const closePWAModal = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hrmatrix_open_pwa_modal', { detail: { type: null } }));
  }
};

export function PWAInstallModal() {
  const [modalType, setModalType] = useState<PWAModalType>(null);
  const isAppleOrSafari = useIsAppleOrSafari();

  useEffect(() => {
    const handleOpenModal = (event: Event) => {
      const customEvent = event as CustomEvent<{ type: PWAModalType }>;
      if (customEvent.detail && customEvent.detail.type !== undefined) {
        setModalType(customEvent.detail.type);
      }
    };

    window.addEventListener('hrmatrix_open_pwa_modal', handleOpenModal);
    return () => {
      window.removeEventListener('hrmatrix_open_pwa_modal', handleOpenModal);
    };
  }, []);

  const handleClose = () => {
    setModalType(null);
  };

  if (!modalType) return null;

  return (
    <>
      {/* 1. Modal Petunjuk Instalasi iOS Safari (iPhone / iPad) */}
      <Modal
        isOpen={modalType === 'ios'}
        onClose={handleClose}
        contentClassName="sm:max-w-md rounded-t-[28px] sm:rounded-2xl"
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Drag Handle Bar Indicator untuk Bottom Sheet Mobile */}
          <div className="pt-2.5 pb-0.5 flex justify-center sm:hidden shrink-0">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>

          {/* Header Modal - Icon di KIRI, Teks Judul & Deskripsi di KANAN */}
          <div className="flex justify-between items-start p-4 sm:p-5 border-b border-slate-100 shrink-0">
            <div className="flex items-start gap-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs p-1">
                <AppleIcon className="w-5 h-5 text-slate-900" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base text-slate-900 leading-tight">
                  Install di iPhone / iPad
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-normal">
                  Gunakan fitur bawaan Safari untuk menginstall HRMatrix ke Home Screen:
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Tutup"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Modal */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/80">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                1
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                Ketuk tombol{' '}
                <strong className="inline-flex items-center gap-1 font-semibold text-blue-600">
                  <Share className="w-3.5 h-3.5 inline" /> Bagikan (Share)
                </strong>{' '}
                pada toolbar Safari.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/80">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                2
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                Gulir ke bawah lalu pilih opsi{' '}
                <strong className="inline-flex items-center gap-1 font-semibold text-slate-900">
                  <PlusSquare className="w-3.5 h-3.5 inline" /> Tambahkan ke Layar Utama
                </strong>{' '}
                (Add to Home Screen).
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/80">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                3
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                Ketuk <strong>Tambah (Add)</strong> di pojok kanan atas. Ikon HRMatrix akan langsung muncul di Layar Utama HP Anda!
              </div>
            </div>
          </div>

          {/* Footer Modal - Single Primary Action */}
          <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white">
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Mengerti
            </button>
          </div>
        </div>
      </Modal>

      {/* 2. Modal Petunjuk Instalasi Chrome / Edge / Android Fallback */}
      <Modal
        isOpen={modalType === 'manual'}
        onClose={handleClose}
        contentClassName="sm:max-w-md rounded-t-[28px] sm:rounded-2xl"
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Drag Handle Bar Indicator untuk Bottom Sheet Mobile */}
          <div className="pt-2.5 pb-0.5 flex justify-center sm:hidden shrink-0">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>

          <div className="flex justify-between items-start p-4 sm:p-5 border-b border-slate-100 shrink-0">
            <div className="flex items-start gap-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs p-1">
                {isAppleOrSafari ? (
                  <AppleIcon className="w-5 h-5 text-slate-900" />
                ) : (
                  <GoogleIcon className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base text-slate-900 leading-tight">
                  Install Aplikasi HRMatrix
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-normal">
                  Aplikasi ini mendukung PWA (Progressive Web App):
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Tutup"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5 overflow-y-auto space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
              Di peramban <strong>Google Chrome / Microsoft Edge</strong>:
              <br />
              Klik ikon <strong>Install / Unduh Aplikasi</strong> di sebelah kanan bilah alamat (URL bar) atau buka menu <strong>(⋮) → Install HRMatrix</strong>.
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
              Di ponsel <strong>Android</strong>:
              <br />
              Ketuk menu titik tiga <strong>(⋮) → Tambahkan ke Layar Utama (Install App)</strong>.
            </div>
          </div>

          <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white">
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>

      {/* 3. Modal Keterangan Aplikasi Sudah Terpasang */}
      <Modal
        isOpen={modalType === 'installed'}
        onClose={handleClose}
        contentClassName="sm:max-w-md"
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex justify-between items-start p-4 sm:p-5 border-b border-slate-100 shrink-0">
            <div className="flex items-start gap-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base text-slate-900 leading-tight">
                  Aplikasi HRMatrix Aktif
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-normal">
                  Aplikasi ini sudah terpasang dan berjalan dalam mode PWA (Progressive Web App).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Tutup"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-slate-700 leading-relaxed">
              HRMatrix sudah terinstal di perangkat Anda dengan akses instan dari home screen / desktop, penyimpanan data lokal aman, dan kemampuan beroperasi tanpa koneksi internet (offline-ready).
            </div>
          </div>

          <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white">
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
