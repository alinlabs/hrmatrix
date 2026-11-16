import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, RotateCcw } from 'lucide-react';

interface CameraScannerProps {
  isOpen: boolean;
  onScanSuccess: (decodedText: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  isOpen,
  onScanSuccess,
}) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const onScanSuccessRef = useRef(onScanSuccess);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  // Load available camera devices when opened
  useEffect(() => {
    if (isOpen) {
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length > 0) {
            setAvailableCameras(
              devices.map((d) => ({ id: d.id, label: d.label || `Kamera ${d.id}` }))
            );
            const backCam = devices.find(
              (d) =>
                d.label.toLowerCase().includes('back') ||
                d.label.toLowerCase().includes('rear') ||
                d.label.toLowerCase().includes('environment')
            );
            setSelectedCameraId(backCam ? backCam.id : devices[0].id);
          } else {
            setCameraError('Tidak ada kamera terdeteksi');
          }
        })
        .catch((err) => {
          console.warn('Gagal mendapatkan kamera:', err);
          setCameraError('Akses kamera tidak diizinkan');
        });
    } else {
      setAvailableCameras([]);
      setSelectedCameraId('');
      setCameraError(null);
    }
  }, [isOpen]);

  // Stop camera helper
  const stopCamera = useCallback(async () => {
    if (html5QrcodeRef.current) {
      try {
        const scanner = html5QrcodeRef.current;
        html5QrcodeRef.current = null;
        if (scanner.isScanning) {
          await scanner.stop();
        }
        await scanner.clear();
      } catch (err) {
        console.warn('Error stopping camera:', err);
      }
    }
    setIsCameraActive(false);
  }, []);

  // Start camera helper
  const startCamera = useCallback(async () => {
    if (isTransitioningRef.current) return;
    if (!selectedCameraId) return;

    isTransitioningRef.current = true;
    setCameraError(null);

    try {
      if (html5QrcodeRef.current) {
        try {
          if (html5QrcodeRef.current.isScanning) {
            await html5QrcodeRef.current.stop();
          }
          await html5QrcodeRef.current.clear();
        } catch {}
        html5QrcodeRef.current = null;
      }

      const element = document.getElementById('qr-camera-stream-target');
      if (!element) {
        isTransitioningRef.current = false;
        return;
      }

      const html5Qrcode = new Html5Qrcode('qr-camera-stream-target');
      html5QrcodeRef.current = html5Qrcode;

      await html5Qrcode.start(
        selectedCameraId,
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          onScanSuccessRef.current?.(decodedText);
        },
        () => {
          // ignore frame errors
        }
      );

      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera start error:', err);
      const errMsg = err?.message || String(err || '');
      if (!errMsg.includes('already under transition')) {
        setCameraError('Kamera tidak aktif: ' + (errMsg || 'Izin ditolak'));
      }
      setIsCameraActive(false);
    } finally {
      isTransitioningRef.current = false;
    }
  }, [selectedCameraId]);

  // Effect to manage camera lifecycle
  useEffect(() => {
    if (isOpen && selectedCameraId) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, selectedCameraId, startCamera, stopCamera]);

  return (
    <div className="w-full box-border">
      {/* CSS Reset for HTML5Qrcode video & elements to ensure exact 100% full width and no overflowing handles */}
      <style>{`
        #qr-camera-stream-target {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          position: relative !important;
          overflow: hidden !important;
        }
        #qr-camera-stream-target video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 1rem !important;
          border: none !important;
        }
        #qr-camera-stream-target canvas {
          display: none !important;
        }
        #qr-camera-stream-target div {
          border: none !important;
          box-shadow: none !important;
        }
        #qr-camera-stream-target img {
          display: none !important;
        }
      `}</style>

      {/* CAMERA SCANNER CARD */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden aspect-4/3 max-h-[260px] flex items-center justify-center transition-all box-border ${
          isCameraActive && !cameraError
            ? 'bg-slate-950'
            : 'bg-white'
        }`}
      >
        {/* Stream Target */}
        <div id="qr-camera-stream-target" className="w-full h-full object-cover"></div>

        {/* Camera Switcher / Flip Button at Top Right Corner */}
        {isCameraActive && availableCameras.length > 1 && (
          <button
            type="button"
            onClick={() => {
              const currentIdx = availableCameras.findIndex((c) => c.id === selectedCameraId);
              const nextIdx = (currentIdx + 1) % availableCameras.length;
              setSelectedCameraId(availableCameras[nextIdx].id);
            }}
            className="absolute top-3 right-3 z-20 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl backdrop-blur-md border border-slate-700/80 shadow-md transition-all cursor-pointer active:scale-95"
            title={`Ganti Kamera (${availableCameras.find((c) => c.id === selectedCameraId)?.label || ''})`}
            aria-label="Ganti Kamera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Clean Scanning Frame Overlay */}
        {isCameraActive && !cameraError && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
            <div className="w-48 h-48 sm:w-52 sm:h-52 border border-white/40 rounded-2xl relative flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/80 rounded-tl-md"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/80 rounded-tr-md"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/80 rounded-bl-md"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/80 rounded-br-md"></div>
              
              {/* Subtle Central Crosshair Line */}
              <div className="w-full h-[1px] bg-white/20"></div>
            </div>
          </div>
        )}

        {/* Camera Inactive / Lottie-style Graphic Overlay */}
        {(!isCameraActive || cameraError) && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-6 space-y-3 z-10">
            {/* Lottie-style Animated Graphic */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-100/60 animate-ping opacity-75"></div>
              <div className="absolute inset-2 rounded-full bg-blue-50 border border-blue-200/80 animate-pulse"></div>

              <div className="relative z-10 p-3.5 bg-white text-blue-600 rounded-2xl border border-blue-200 shadow-sm flex items-center justify-center">
                <QrCode className="w-8 h-8 stroke-[1.5] animate-pulse" />
              </div>

              <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/50 animate-[spin_8s_linear_infinite]"></div>
            </div>

            <div className="space-y-1 max-w-xs">
              <h4 className="text-sm font-bold text-slate-800">
                Input Presensi Langsung
              </h4>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                Silakan ketik NIK / ID Karyawan atau gunakan Barcode Scanner USB pada kolom di bawah
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
