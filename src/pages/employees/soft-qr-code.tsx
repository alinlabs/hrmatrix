import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { Share2, Download, Check, Star, QrCode } from 'lucide-react';
import { HRMatrixLogo } from '../../components/ui';

// 1x1 transparent PNG untuk memberi ruang kosong di tengah QR khusus tampilan live
const TRANSPARENT_CENTER_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=';

export interface SoftQRCodeHandle {
  download: () => Promise<void>;
  share: () => Promise<void>;
  openMyPresensi: () => void;
  copied: boolean;
  isDownloading: boolean;
  activeQrValue: string;
}

interface SoftQRCodeProps {
  employeeId: string;
  nik?: string;
  employeeName: string;
  logoUrl?: string;
  size?: number;
  onCloseModal?: () => void;
  hideInlineActions?: boolean;
  onActionsChange?: (actions: {
    download: () => Promise<void>;
    share: () => Promise<void>;
    openMyPresensi: () => void;
    copied: boolean;
    isDownloading: boolean;
  }) => void;
}

export type QRLevelMode = 'standard' | 'strong';

export const SoftQRCode = forwardRef<SoftQRCodeHandle, SoftQRCodeProps>(function SoftQRCode(
  {
    employeeId,
    nik,
    employeeName,
    logoUrl = '/icon.svg',
    size = 230,
    onCloseModal,
    hideInlineActions = false,
    onActionsChange,
  },
  ref
) {
  const navigate = useNavigate();
  const [qrMode, setQrMode] = useState<QRLevelMode>('standard');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);

  // Compute QR value based on selected mode
  // Simple Standar: [id karyawan]
  // Akurasi Tinggi: [id karyawan]/[NIK]
  const activeQrValue = React.useMemo(() => {
    const cleanEmpId = (employeeId || '').trim();
    if (qrMode === 'standard') {
      return cleanEmpId;
    }
    const cleanNik = (nik || '').trim() || 'NO-NIK';
    return `${cleanEmpId}/${cleanNik}`;
  }, [qrMode, employeeId, nik]);

  // Initialize or update QRCodeStyling instance
  useEffect(() => {
    const qrOptions: Partial<Options> = {
      width: size,
      height: size,
      data: activeQrValue,
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
      dotsOptions: {
        type: 'square', // isi code tetap kotak-kotak
        color: '#0F172A',
      },
      cornersSquareOptions: {
        type: 'extra-rounded', // kotak besar pojok ber-radius
        color: '#0F172A',
      },
      cornersDotOptions: {
        type: 'dot', // isi kotak besar pojok ber-radius
        color: '#0F172A',
      },
      backgroundOptions: {
        color: '#FFFFFF',
      },
    };

    if (!qrCodeInstanceRef.current) {
      qrCodeInstanceRef.current = new QRCodeStyling(qrOptions);
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = '';
        qrCodeInstanceRef.current.append(qrContainerRef.current);
      }
    } else {
      qrCodeInstanceRef.current.update(qrOptions);
    }
  }, [activeQrValue, size]);

  // Handle Share Link (Copy link to clipboard)
  const handleShareLink = async () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/my-presensi?code=${encodeURIComponent(activeQrValue)}`;

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        window.prompt('Salin tautan QR Karyawan:', shareUrl);
      }
    } else {
      window.prompt('Salin tautan QR Karyawan:', shareUrl);
    }
  };

  // Handle Download Image (PNG) - Menggunakan Static Non-Lottie Logo
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const sanitizedName = (employeeName || employeeId).replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `QR_${sanitizedName}_${qrMode.toUpperCase()}`;
      
      const downloadQr = new QRCodeStyling({
        width: 1000,
        height: 1000,
        data: activeQrValue,
        margin: 16,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: 'H',
        },
        image: logoUrl || '/icon.svg',
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.28,
          margin: 6,
          crossOrigin: 'anonymous',
        },
        dotsOptions: {
          type: 'square',
          color: '#0F172A',
        },
        cornersSquareOptions: {
          type: 'extra-rounded',
          color: '#0F172A',
        },
        cornersDotOptions: {
          type: 'dot',
          color: '#0F172A',
        },
        backgroundOptions: {
          color: '#FFFFFF',
        },
      });

      await downloadQr.download({
        name: filename,
        extension: 'png',
      });
    } catch (err) {
      console.error('Failed to download QR code image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle Buka My Presensi
  const handleOpenMyPresensi = () => {
    if (onCloseModal) {
      onCloseModal();
    }
    navigate(`/my-presensi?code=${encodeURIComponent(activeQrValue)}`);
  };

  useImperativeHandle(
    ref,
    () => ({
      download: handleDownload,
      share: handleShareLink,
      openMyPresensi: handleOpenMyPresensi,
      copied,
      isDownloading,
      activeQrValue,
    }),
    [activeQrValue, copied, isDownloading, employeeName, employeeId, qrMode]
  );

  useEffect(() => {
    if (onActionsChange) {
      onActionsChange({
        download: handleDownload,
        share: handleShareLink,
        openMyPresensi: handleOpenMyPresensi,
        copied,
        isDownloading,
      });
    }
  }, [copied, isDownloading, activeQrValue, employeeName, employeeId, qrMode]);

  return (
    <div className="flex flex-col items-center w-full space-y-3.5">
      {/* 1. Tab Model Level QR: Simple Standar | Akurasi Tinggi (Full Width from Left to Right) */}
      <div className="w-full">
        <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-semibold w-full">
          <button
            type="button"
            onClick={() => setQrMode('standard')}
            className={`py-2 px-3 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center ${
              qrMode === 'standard'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Simple Standar</span>
          </button>
          <button
            type="button"
            onClick={() => setQrMode('strong')}
            className={`py-2 px-3 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              qrMode === 'strong'
                ? 'bg-white text-blue-700 shadow-xs border border-blue-200/60 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Akurasi Tinggi</span>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
          </button>
        </div>

        {/* Level description text */}
        <div className="text-xs text-center text-slate-500 mt-2 px-1 leading-snug">
          {qrMode === 'standard' ? (
            <span>QR simple dan cepat untuk proses verifikasi yang mudah</span>
          ) : (
            <span className="text-blue-900 font-medium">Autentikasi Karyawan Dengan Tingkat Verifikasi yang tinggi</span>
          )}
        </div>
      </div>

      {/* 2. QR Code Box (Soft Rounded, Elegant White Card) with Lottie Centerpiece */}
      <div className="relative p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-center transition-all">
        <div 
          ref={qrContainerRef} 
          className="flex items-center justify-center overflow-hidden rounded-xl bg-white"
          style={{ width: size, height: size }}
        />
        {/* Lottie Animated Centerpiece - Scaled precisely with Level H Error Correction */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div 
            className="bg-white rounded-lg p-0.5 shadow-2xs flex items-center justify-center overflow-hidden"
            style={{ 
              width: Math.round(size * 0.20), 
              height: Math.round(size * 0.20) 
            }}
          >
            <HRMatrixLogo className="w-full h-full" animated={true} />
          </div>
        </div>
      </div>

      {/* 3. Action Buttons (Only rendered inline if hideInlineActions is false) */}
      {!hideInlineActions && (
        <div className="flex items-center gap-2 w-full pt-0.5">
          {/* Tombol 1: Buka My Presensi */}
          <button
            type="button"
            onClick={handleOpenMyPresensi}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-98 cursor-pointer"
            title="Buka Halaman My Presensi"
          >
            <QrCode className="w-4 h-4" />
            <span>Buka My Presensi</span>
          </button>

          {/* Tombol 2: Icon Link (Share / Copy Link) */}
          <button
            type="button"
            onClick={handleShareLink}
            className={`p-2.5 h-10 w-10 flex items-center justify-center rounded-xl border transition-all active:scale-95 cursor-pointer shrink-0 shadow-2xs ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600'
            }`}
            title="Salin Tautan Presensi"
            aria-label="Salin Tautan Presensi"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>

          {/* Tombol 3: Icon Download (Unduh Gambar QR) */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2.5 h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-600 transition-all active:scale-95 cursor-pointer shrink-0 disabled:opacity-60 shadow-2xs"
            title="Unduh Gambar QR Code"
            aria-label="Unduh Gambar QR Code"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
});

