import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  FileCheck2
} from 'lucide-react';
import { GeneratedPdfArtifact } from '../../utils/pdfSingleSource';

if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface UnifiedPdfPreviewViewerProps {
  artifact: GeneratedPdfArtifact | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

const ZOOM_STEPS = [0.65, 0.8, 1.0, 1.15, 1.3, 1.5, 1.75];

export const UnifiedPdfPreviewViewer: React.FC<UnifiedPdfPreviewViewerProps> = ({
  artifact,
  loading = false,
  error = null,
  onRetry,
  className = ''
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewerLoading, setViewerLoading] = useState<boolean>(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(780);
  const [zoom, setZoom] = useState<number>(1.0);

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
      setCurrentPage(1);
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
        setCurrentPage(prev => (prev > doc.numPages ? 1 : prev));
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

  // Track visible page on scroll
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || numPages <= 1) return;

    const containerRect = container.getBoundingClientRect();
    const containerMid = containerRect.top + containerRect.height * 0.35;

    let bestPage = 1;
    let bestDist = Infinity;

    for (let p = 1; p <= numPages; p++) {
      const pageEl = pageRefs.current[p];
      if (!pageEl) continue;
      const rect = pageEl.getBoundingClientRect();
      const dist = Math.abs(rect.top - containerMid);
      if (dist < bestDist) {
        bestDist = dist;
        bestPage = p;
      }
    }

    setCurrentPage(bestPage);
  }, [numPages]);

  const scrollToPage = (targetPage: number) => {
    const clamped = Math.max(1, Math.min(numPages, targetPage));
    setCurrentPage(clamped);
    const pageEl = pageRefs.current[clamped];
    if (pageEl && scrollContainerRef.current) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleZoomIn = () => {
    const next = ZOOM_STEPS.find(z => z > zoom + 0.01);
    setZoom(next ?? ZOOM_STEPS[ZOOM_STEPS.length - 1]);
  };

  const handleZoomOut = () => {
    const prev = [...ZOOM_STEPS].reverse().find(z => z < zoom - 0.01);
    setZoom(prev ?? ZOOM_STEPS[0]);
  };

  const handleZoomReset = () => {
    setZoom(1.0);
  };

  const isBusy = loading || viewerLoading;
  const activeError = error || viewerError;

  // Compute target A4 sheet width in pixels
  const basePadding = containerWidth < 640 ? 24 : 48;
  const maxBaseSheetWidth = Math.min(Math.max(containerWidth - basePadding, 280), 820);
  const renderedSheetWidth = Math.round(maxBaseSheetWidth * zoom);

  return (
    <div className={`flex flex-col flex-1 min-h-0 bg-slate-200/80 ${className}`}>
      {/* Secondary PDF Control Strip: Page Navigation, Zoom & SSOT Verification */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-slate-100 border-b border-slate-200/90 text-xs select-none shrink-0 print:hidden">
        {/* Left: Page Counter & Navigation */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200/90 text-slate-700 font-semibold text-[11px] shadow-2xs">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {numPages > 0 ? `Halaman ${currentPage} dari ${numPages}` : 'Menyiapkan Halaman A4...'}
            </span>
          </span>

          {numPages > 1 && (
            <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-md p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => scrollToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 text-slate-700 cursor-pointer disabled:cursor-not-allowed"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollToPage(currentPage + 1)}
                disabled={currentPage >= numPages}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 text-slate-700 cursor-pointer disabled:cursor-not-allowed"
                title="Halaman Berikutnya"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {artifact && (
            <span
              className="hidden md:inline-flex items-center gap-1 text-[10px] text-slate-500 font-mono bg-slate-200/60 px-2 py-0.5 rounded"
              title={`SHA-256 PDF Identik: ${artifact.sha256}`}
            >
              A4 Vector PDF • {(artifact.byteLength / 1024).toFixed(1)} KB • #{artifact.sha256.slice(0, 8)}
            </span>
          )}
        </div>

        {/* Right: Zoom Controls */}
        <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= ZOOM_STEPS[0]}
            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="Perkecil Tampilan"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleZoomReset}
            className="px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:bg-slate-100 rounded cursor-pointer min-w-[48px] text-center"
            title="Reset Zoom 100%"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="Perbesar Tampilan"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {zoom !== 1.0 && (
            <button
              type="button"
              onClick={handleZoomReset}
              className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
              title="Kembalikan Ukuran Normal"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Scrollable Viewport for Paginated A4 PDF Sheets */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto p-3 sm:p-6 md:p-8 flex flex-col items-center gap-6"
      >
        {isBusy && (
          <div className="my-auto py-16 flex flex-col items-center justify-center text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-700">
              Menyusun Dokumen PDF A4 Presisi Tinggi...
            </p>
            <p className="text-[11px] text-slate-500">
              Menyelaraskan tipografi, margin, dan pemenggalan halaman otomatis
            </p>
          </div>
        )}

        {!isBusy && activeError && (
          <div className="my-auto max-w-md w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
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
        )}

        {!isBusy && !activeError && pdfDoc && numPages > 0 && (
          <div className="flex flex-col items-center gap-6 w-full pb-6">
            {Array.from({ length: numPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <div
                  key={`${artifact?.sha256 || 'pdf'}-page-${pageNumber}`}
                  ref={el => {
                    pageRefs.current[pageNumber] = el;
                  }}
                  className="flex flex-col items-center"
                >
                  <PdfCanvasSheet
                    pdfDoc={pdfDoc}
                    pageNumber={pageNumber}
                    totalPages={numPages}
                    targetWidth={renderedSheetWidth}
                  />
                </div>
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
  totalPages: number;
  targetWidth: number;
}

const PdfCanvasSheet: React.FC<PdfCanvasSheetProps> = ({
  pdfDoc,
  pageNumber,
  totalPages,
  targetWidth
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState<boolean>(true);

  // Standard A4 aspect ratio (1 : 1.4142) for placeholder sizing before canvas paint
  const estimatedHeight = Math.round(targetWidth * (297 / 210));

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
        const cssScale = Math.max(targetWidth, 240) / unscaledViewport.width;

        // Render at high-DPI (up to 2.5x) for crisp typography on Retina/HiDPI screens
        const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2.5) : 1.5;
        const renderViewport = page.getViewport({ scale: cssScale * dpr });

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = Math.floor(renderViewport.width);
        canvas.height = Math.floor(renderViewport.height);
        canvas.style.width = `${Math.floor(unscaledViewport.width * cssScale)}px`;
        canvas.style.height = `${Math.floor(unscaledViewport.height * cssScale)}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        renderTask = page.render({
          canvasContext: ctx,
          viewport: renderViewport,
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
      className="relative bg-white shadow-xl border border-slate-300/90 transition-all"
      style={{
        width: `${targetWidth}px`,
        minHeight: `${estimatedHeight}px`
      }}
    >
      {/* Subtle Page Badge on top-right corner of the sheet */}
      <div className="absolute -top-3 right-3 px-2 py-0.5 rounded bg-slate-800/85 text-white text-[10px] font-medium tracking-wide shadow-2xs pointer-events-none select-none z-10">
        Halaman {pageNumber} / {totalPages}
      </div>

      {rendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/75 z-10">
          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
        </div>
      )}

      <canvas ref={canvasRef} className="block bg-white" />
    </div>
  );
};
