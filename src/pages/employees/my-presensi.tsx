import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { motion, AnimatePresence } from 'motion/react';
import { useCompany } from '../../context/CompanyContext';
import { X, Check, Share, PlusSquare } from 'lucide-react';
import { HRMatrixLogo, GoogleIcon, AppleIcon } from '../../components/ui';
import { useIsAppleOrSafari } from '../../utils/deviceDetector';

// 1x1 transparent PNG untuk memberi ruang kosong di tengah QR khusus tampilan live
const TRANSPARENT_CENTER_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function MyPresensiPage() {
  const [searchParams] = useSearchParams();
  const { company } = useCompany();

  // Ambil nilai QR murni dari URL parameter (?code=... atau ?qr=...)
  // Jika dibuka kembali dari shortcut/app standalone, ambil fallback dari localStorage
  const urlCode = searchParams.get('code') || searchParams.get('qr') || '';
  
  const [storedCode, setStoredCode] = useState<string>(() => {
    if (urlCode) {
      try {
        localStorage.setItem('hrmatrix_mypresensi_code', urlCode);
      } catch {}
      return urlCode;
    }
    try {
      return localStorage.getItem('hrmatrix_mypresensi_code') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    if (urlCode) {
      setStoredCode(urlCode);
      try {
        localStorage.setItem('hrmatrix_mypresensi_code', urlCode);
      } catch {}
    }
  }, [urlCode]);

  const qrPayload = (urlCode || storedCode || 'HRMATRIX-PRESENSI').trim();

  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);

  // Responsive QR size based on viewport so it fits without scrolling with header, texts & button
  const [qrSize, setQrSize] = useState(() => {
    if (typeof window === 'undefined') return 200;
    const availableDim = Math.min(window.innerWidth - 100, window.innerHeight - 300, 225);
    return Math.max(160, Math.floor(availableDim));
  });

  useEffect(() => {
    const handleResize = () => {
      const availableDim = Math.min(window.innerWidth - 100, window.innerHeight - 300, 225);
      setQrSize(Math.max(160, Math.floor(availableDim)));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Geolocation & Date Formatter (Format: [Desa/Kelurahan], [Hari] [Tanggal])
  const [villageName, setVillageName] = useState<string>(() => {
    try {
      return localStorage.getItem('hrmatrix_mypresensi_village') || '';
    } catch {
      return '';
    }
  });
  const [isLocating, setIsLocating] = useState<boolean>(!villageName);

  const formattedDate = useMemo(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const now = new Date();
    const dayName = days[now.getDay()];
    const dateNum = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    return `${dayName} ${dateNum} ${monthName} ${year}`;
  }, []);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Coba reverse geocode cepat via BigDataCloud client API (lokal bahasa Indonesia)
          const bdcRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`,
            { signal: AbortSignal.timeout(4500) }
          );
          if (bdcRes.ok) {
            const bdcData = await bdcRes.json();
            const adminVillage = bdcData.localityInfo?.administrative?.find(
              (adm: any) =>
                adm.adminLevel === 7 ||
                adm.adminLevel === 8 ||
                /desa|kelurahan/i.test(adm.description || '')
            )?.name;
            const detected = adminVillage || bdcData.locality || bdcData.city || '';
            if (detected) {
              const cleanName = detected.replace(/^(Kelurahan|Desa)\s+/i, '').trim();
              setVillageName(cleanName);
              try {
                localStorage.setItem('hrmatrix_mypresensi_village', cleanName);
              } catch {}
              setIsLocating(false);
              return;
            }
          }
        } catch {}

        try {
          // Fallback reverse geocode via OpenStreetMap Nominatim
          const nomRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id&addressdetails=1`,
            { signal: AbortSignal.timeout(4500) }
          );
          if (nomRes.ok) {
            const nomData = await nomRes.json();
            const addr = nomData.address || {};
            const detected =
              addr.village ||
              addr.suburb ||
              addr.quarter ||
              addr.neighbourhood ||
              addr.city_district ||
              addr.town ||
              addr.city ||
              '';
            if (detected) {
              const cleanName = detected.replace(/^(Kelurahan|Desa)\s+/i, '').trim();
              setVillageName(cleanName);
              try {
                localStorage.setItem('hrmatrix_mypresensi_village', cleanName);
              } catch {}
            }
          }
        } catch {}
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation lookup notice:', err.message);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 120000,
      }
    );
  }, []);

  const locationDateLabel = useMemo(() => {
    if (villageName) {
      return `${villageName}, ${formattedDate}`;
    }
    if (isLocating) {
      return `Mencari lokasi..., ${formattedDate}`;
    }
    if (company?.city) {
      return `${company.city}, ${formattedDate}`;
    }
    return formattedDate;
  }, [villageName, isLocating, formattedDate, company?.city]);

  // Inisialisasi dan pembaruan QR Code Styling
  useEffect(() => {
    const qrOptions: Partial<Options> = {
      width: qrSize,
      height: qrSize,
      data: qrPayload,
      margin: 4,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'H',
      },
      image: TRANSPARENT_CENTER_PLACEHOLDER,
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.22,
        margin: 2,
        crossOrigin: 'anonymous',
      },
      // Standarisasi: Isi data tetap kotak-kotak
      dotsOptions: {
        type: 'square',
        color: '#0F172A',
      },
      // Kotak besar locator di pojok kiri atas, kanan atas, kiri bawah ber-radius halus
      cornersSquareOptions: {
        type: 'extra-rounded',
        color: '#0F172A',
      },
      // Isi titik locator pojok sedikit ber-radius
      cornersDotOptions: {
        type: 'dot',
        color: '#0F172A',
      },
      backgroundOptions: {
        color: '#FFFFFF',
      },
    };

    if (!qrInstanceRef.current) {
      qrInstanceRef.current = new QRCodeStyling(qrOptions);
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = '';
        qrInstanceRef.current.append(qrContainerRef.current);
      }
    } else {
      qrInstanceRef.current.update(qrOptions);
    }
  }, [qrPayload, qrSize]);

  // PWA Install State & Event Listener
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const isAppleOrSafari = useIsAppleOrSafari();

  useEffect(() => {
    // Cek apakah sedang berjalan dalam mode standalone (sudah terinstall sebagai PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

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

  const handleInstallClick = async () => {
    if (isAppleOrSafari) {
      setShowGuideModal(true);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Jika browser tidak menembakkan beforeinstallprompt (misal Chrome Desktop / Android manual), buka panduan instan
      setShowGuideModal(true);
    }
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden animate-card-gradient flex flex-col justify-between items-center py-5 sm:py-7 px-4 select-none">
      {/* Orb Cahaya 1 (Kiri Atas) */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-20 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(147,197,253,0.22)_40%,transparent_70%)] blur-3xl pointer-events-none animate-ambient-pulse-1"
      />

      {/* Orb Cahaya 2 (Kanan Bawah) */}
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-20 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.40)_0%,rgba(59,130,246,0.22)_45%,transparent_70%)] blur-3xl pointer-events-none animate-ambient-pulse-2"
      />

      {/* Sapuan Kilau Kaca */}
      <div
        aria-hidden="true"
        className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none animate-sheen-sweep"
      />

      {/* HEADER ATAS: 2 Line Title */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-0.5 animate-in fade-in slide-in-from-top-3 duration-300">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
          My Presensi
        </h1>
        <p className="text-[11px] sm:text-xs font-light text-blue-100/90 tracking-widest uppercase">
          HR MATRIX SYSTEM
        </p>
      </div>

      {/* TENGAH: Pure Center QR Card Container with Lottie Centerpiece, Top Instruction, and Bottom GPS Location */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2 w-full max-w-sm gap-2.5 sm:gap-3">
        {/* Teks Atas di Luar Card QR: Putih Kecil Tipis */}
        <p className="text-[11px] sm:text-xs font-light text-white/85 text-center tracking-wide drop-shadow-xs select-none">
          Arahkan code QR ke depan scanner
        </p>

        {/* Card QR dengan Shadow Effect Lebih Terlihat & Dinamis (Elegan, Berbobot, Tidak Over) */}
        <div className="relative group">
          {/* Ambient Dynamic Backlight Glow */}
          <div 
            aria-hidden="true"
            className="absolute -inset-1 rounded-[28px] bg-gradient-to-b from-white/30 via-blue-400/20 to-blue-900/30 blur-md pointer-events-none -z-10"
          />

          <div className="relative bg-white rounded-3xl border border-white/70 shadow-[0_22px_45px_-10px_rgba(3,15,46,0.45),0_8px_18px_-6px_rgba(15,23,42,0.22)] p-4 sm:p-5 flex items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            <div
              ref={qrContainerRef}
              className="flex items-center justify-center overflow-hidden rounded-2xl bg-white"
              style={{ width: qrSize, height: qrSize }}
            />
            {/* Lottie Animated Centerpiece - Scaled precisely with Level H Error Correction */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <div 
                className="bg-white rounded-lg p-0.5 shadow-2xs flex items-center justify-center overflow-hidden"
                style={{ 
                  width: Math.round(qrSize * 0.20), 
                  height: Math.round(qrSize * 0.20) 
                }}
              >
                <HRMatrixLogo className="w-full h-full" animated={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Teks Bawah di Luar Card QR: [Desa/Kelurahan], [Hari] [Tanggal] */}
        <p className="text-xs sm:text-[13px] font-normal text-white/95 text-center tracking-normal drop-shadow-xs select-none">
          {locationDateLabel}
        </p>
      </div>

      {/* BAWAH: Tombol Install My Presensi */}
      <div className="relative z-10 pb-1 sm:pb-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
        {isInstalled ? (
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-300" />
            <span>Aplikasi Terpasang</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleInstallClick}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/35 shadow-lg shadow-blue-950/20 transition-all active:scale-95 cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0 shadow-xs">
              {isAppleOrSafari ? (
                <AppleIcon className="w-3.5 h-3.5 text-slate-900" />
              ) : (
                <GoogleIcon className="w-3.5 h-3.5" />
              )}
            </span>
            <span>Install My Presensi</span>
          </button>
        )}
      </div>

      {/* PANDUAN DALAM BENTUK BOTTOM SHEET UNTUK IOS / IPHONE & CHROME PWA */}
      <AnimatePresence>
        {showGuideModal && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden overscroll-none touch-none select-none"
            id="mypresensi-bottomsheet-portal"
          >
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setShowGuideModal(false)}
            />

            {/* Bottom Sheet Dialog */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.8 }}
              className="relative w-full max-w-lg bg-white rounded-t-[28px] shadow-2xl border-t border-slate-200/80 flex flex-col max-h-[88vh] overflow-hidden z-10 box-border text-slate-800 touch-pan-y select-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle Bar Indicator */}
              <div className="pt-2.5 pb-1 flex justify-center shrink-0">
                <div className="w-12 h-1.5 bg-slate-300/80 rounded-full" />
              </div>

              {/* Bottom Sheet Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs p-1.5">
                    <img src="/gambar/pwa-presensi-512x512.png" alt="Logo My Presensi" className="w-7 h-7 object-contain rounded-md" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                      {isAppleOrSafari ? 'Pasang di iPhone / iPad' : 'Pasang Aplikasi My Presensi'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-normal truncate">
                      {isAppleOrSafari ? 'Ikon 3 orang mandiri untuk akses instan di Home Screen' : 'Ikon 3 orang mandiri untuk akses cepat presensi'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2"
                  title="Tutup"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Sheet Body (Scrollable) */}
              <div className="p-5 overflow-y-auto space-y-3 text-xs leading-relaxed text-slate-600">
                {isAppleOrSafari ? (

                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <div className="text-xs text-slate-700 leading-relaxed">
                        Ketuk tombol <strong>Bagikan (Share)</strong>{' '}
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-blue-50 text-blue-600 align-middle mx-0.5">
                          <Share className="w-3.5 h-3.5 inline" />
                        </span>{' '}
                        pada bilah navigasi bawah browser Safari.
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <div className="text-xs text-slate-700 leading-relaxed">
                        Gulir menu ke bawah lalu pilih opsi{' '}
                        <strong className="inline-flex items-center gap-1 font-semibold text-slate-900">
                          <PlusSquare className="w-3.5 h-3.5 inline text-blue-600" /> Tambahkan ke Layar Utama
                        </strong>{' '}
                        (Add to Home Screen).
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <div className="text-xs text-slate-700 leading-relaxed">
                        Ketuk <strong>Tambah (Add)</strong> di pojok kanan atas. Ikon My Presensi (logo 3 orang) langsung terpasang di Home Screen HP Anda menuju halaman presensi ini!
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <div className="text-xs text-slate-700 leading-relaxed">
                        Buka menu opsi browser (titik 3 di pojok kanan atas Google Chrome / Edge).
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <div className="text-xs text-slate-700 leading-relaxed">
                        Pilih <strong>Pasang aplikasi (Install app)</strong> atau <strong>Tambahkan ke Layar Utama</strong>.
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <div className="text-xs text-slate-700 leading-relaxed">
                        Aplikasi My Presensi akan terpasang sebagai aplikasi mandiri dengan logo 3 orang yang siap dibuka langsung menuju kehadiran Anda.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Sheet Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  Mengerti
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default MyPresensiPage;
