import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  ZoomIn,
  ZoomOut,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { GeneratedPdfArtifact } from '../../utils/pdf-single-source';

if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

export const PDF_ZOOM_STEPS = [0.6, 0.75, 0.9, 1.0, 1.15, 1.3, 1.5, 1.75, 2.0] as const;

export interface PdfHeaderZoomControlsProps {
  zoom: number;
  onZoomChange: (nextZoom: number) => void;
  disabled?: boolean;
}

/**
 * Kontrol Zoom In / Zoom Out ringkas khusus ditempatkan di header modal PDF.
 */
export const PdfHeaderZoomControls: React.FC<PdfHeaderZoomControlsProps> = ({
  zoom,
  onZoomChange,
  disabled = false
}) => {
  const minZoom = PDF_ZOOM_STEPS[0];
  const maxZoom = PDF_ZOOM_STEPS[PDF_ZOOM_STEPS.length - 1];

  const handleZoomOut = () => {
    const prev = [...PDF_ZOOM_STEPS].reverse().find((z) => z < zoom - 0.01);
    onZoomChange(prev ?? minZoom);
  };

  const handleZoomIn = () => {
    const next = PDF_ZOOM_STEPS.find((z) => z > zoom + 0.01);
    onZoomChange(next ?? maxZoom);
  };

  const handleZoomReset = () => {
    onZoomChange(1.0);
  };

  return (
    <div className="inline-flex items-center gap-0.5 bg-slate-100 border border-slate-200 rounded-xl p-0.5 shrink-0 select-none">
      <button
        type="button"
        onClick={handleZoomOut}
        disabled={disabled || zoom <= minZoom}
        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
        title="Perkecil Tampilan (Zoom Out)"
        aria-label="Perkecil Tampilan"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={handleZoomReset}
        disabled={disabled}
        className="px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-white rounded-lg cursor-pointer disabled:opacity-40 min-w-[46px] text-center transition-colors tabular-nums"
        title="Reset Zoom 100%"
      >
        {Math.round(zoom * 100)}%
      </button>

      <button
        type="button"
        onClick={handleZoomIn}
        disabled={disabled || zoom >= maxZoom}
        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
        title="Perbesar Tampilan (Zoom In)"
        aria-label="Perbesar Tampilan"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export interface UnifiedPdfPreviewViewerProps {
  artifact: GeneratedPdfArtifact | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  zoom?: number;
  className?: string;
}

export const UnifiedPdfPreviewViewer: React.FC<UnifiedPdfPreviewViewerProps> = ({
  artifact,
  loading = false,
  error = null,
  onRetry,
  zoom = 1.0,
  className = ''
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [viewerLoading, setViewerLoading] = useState<boolean>(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(780);

  // Measure available width of the scroll container
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const updateWidth = () => {
      if (scrollContainerRef.current) {
        const w = scrollContainerRef.current.clientWidth;
        if (w > 0) {
          setContainerWidth(w);
        }
      }
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Load PDF binary from the Single Source of Truth `artifact.bytes`
  useEffect(() => {
    let isCancelled = false;
    let activeDoc: any = null;
    let loadingTask: any = null;

    if (!artifact || !artifact.bytes || artifact.bytes.byteLength === 0) {
      setPdfDoc(null);
      setNumPages(0);
      return;
    }

    const loadPdfBinary = async () => {
      setViewerLoading(true);
      setViewerError(null);

      try {
        // Clone bytes so pdf.js worker transfer never detaches `artifact.bytes`
        const bytesCopy = new Uint8Array(artifact.bytes.byteLength);
        bytesCopy.set(artifact.bytes);

        loadingTask = pdfjsLib.getDocument({
          data: bytesCopy,
          useWorkerFetch: false,
          useSystemFonts: true
        });

        const doc = await loadingTask.promise;
        if (isCancelled) {
          await doc.destroy();
          return;
        }

        activeDoc = doc;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setViewerLoading(false);
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Error loading PDF artifact in UnifiedPdfPreviewViewer:', err);
          setViewerError(err?.message || 'Gagal memuat pratinjau dokumen PDF.');
          setViewerLoading(false);
        }
      }
    };

    loadPdfBinary();

    return () => {
      isCancelled = true;
      if (loadingTask && typeof loadingTask.destroy === 'function') {
        try {
          loadingTask.destroy();
        } catch {
          // ignore
        }
      }
      if (activeDoc && typeof activeDoc.destroy === 'function') {
        try {
          activeDoc.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [artifact]);

  const isBusy = loading || viewerLoading;
  const activeError = error || viewerError;

  // Compute crisp target A4 sheet width in CSS pixels
  const basePadding = containerWidth < 640 ? 24 : 56;
  const maxBaseSheetWidth = Math.min(Math.max(containerWidth - basePadding, 280), 820);
  const renderedSheetWidth = Math.round(maxBaseSheetWidth * zoom);

  return (
    <div className={`flex flex-col flex-1 min-h-0 h-full bg-slate-200/80 ${className}`}>
      {/* Clean Vertical & Horizontal Scrollable Viewport (Tanpa Toolbar Halaman / Badge) */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-auto p-3 sm:p-6 md:p-8"
      >
        {isBusy && (
          <div className="min-h-full flex flex-col items-center justify-center py-16 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-700">
              Menyusun Dokumen PDF A4 Presisi Tinggi...
            </p>
            <p className="text-[11px] text-slate-500">
              Menyelaraskan tipografi vektor, margin, dan tata letak cetak
            </p>
          </div>
        )}

        {!isBusy && activeError && (
          <div className="min-h-full flex items-center justify-center py-10">
            <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Gagal Memuat Pratinjau PDF</h4>
              <p className="text-xs text-slate-500">{activeError}</p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Muat Ulang PDF</span>
                </button>
              )}
              {artifact?.blobUrl && (
                <div className="w-full h-[500px] mt-3 border border-slate-200 rounded-lg overflow-hidden">
                  <iframe
                    src={artifact.blobUrl}
                    title="PDF Fallback Viewer"
                    className="w-full h-full border-0"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {!isBusy && !activeError && pdfDoc && numPages > 0 && (
          <div className="w-fit min-w-full mx-auto flex flex-col items-center gap-5 sm:gap-7 pb-6">
            {Array.from({ length: numPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <PdfCanvasSheet
                  key={`${artifact?.sha256 || 'pdf'}-page-${pageNumber}`}
                  pdfDoc={pdfDoc}
                  pageNumber={pageNumber}
                  targetWidth={renderedSheetWidth}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

interface PdfCanvasSheetProps {
  pdfDoc: any;
  pageNumber: number;
  targetWidth: number;
}

const PdfCanvasSheet: React.FC<PdfCanvasSheetProps> = ({
  pdfDoc,
  pageNumber,
  targetWidth
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState<boolean>(true);
  const [sheetSize, setSheetSize] = useState<{ width: number; height: number }>(() => ({
    width: targetWidth,
    height: Math.round(targetWidth * (297 / 210))
  }));

  useEffect(() => {
    let isCancelled = false;
    let renderTask: any = null;

    const renderPageToCanvas = async () => {
      if (!canvasRef.current || !pdfDoc) return;
      setRendering(true);

      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const cssWidth = Math.max(targetWidth, 240);
        const cssScale = cssWidth / unscaledViewport.width;
        const cssHeight = Math.round(unscaledViewport.height * cssScale);

        if (!isCancelled) {
          setSheetSize({ width: cssWidth, height: cssHeight });
        }

        // Retina / HiDPI supersampling (minimum 2x, up to 3x on high-DPI displays)
        // Guarantees 100% sharp text & exact 1:1 visual parity with printed PDF
        const deviceDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 2;
        const retinaDpr = Math.min(Math.max(deviceDpr, 2), 3);

        const backingViewport = page.getViewport({ scale: cssScale * retinaDpr });

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = Math.round(backingViewport.width);
        canvas.height = Math.round(backingViewport.height);
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        renderTask = page.render({
          canvasContext: ctx,
          viewport: backingViewport,
          canvas
        } as any);

        await renderTask.promise;
        if (!isCancelled) {
          setRendering(false);
        }
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn(`PDF page ${pageNumber} render warning:`, err);
        }
        if (!isCancelled) {
          setRendering(false);
        }
      }
    };

    renderPageToCanvas();

    return () => {
      isCancelled = true;
      if (renderTask && typeof renderTask.cancel === 'function') {
        try {
          renderTask.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, [pdfDoc, pageNumber, targetWidth]);

  return (
    <div
      className="relative bg-white shadow-[0_6px_26px_rgba(15,23,42,0.14)] ring-1 ring-slate-300/80 overflow-hidden shrink-0"
      style={{
        width: `${sheetSize.width}px`,
        height: `${sheetSize.height}px`
      }}
    >
      {rendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
        </div>
      )}

      <canvas ref={canvasRef} className="block bg-white" />
    </div>
  );
};
