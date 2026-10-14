import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ExternalLink, RefreshCw, AlertCircle, Download } from 'lucide-react';

interface PdfViewerProps {
  fileDataUrl?: string;
  file?: File;
  fileName: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ fileDataUrl, file, fileName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Measure container width responsively
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;

    const loadPdf = async () => {
      setLoading(true);
      setError(null);

      try {
        let pdfSource: any = null;

        if (file) {
          const buffer = await file.arrayBuffer();
          pdfSource = { data: buffer };
        } else if (fileDataUrl) {
          if (fileDataUrl.startsWith('data:')) {
            const base64 = fileDataUrl.split(',')[1];
            const binaryStr = atob(base64);
            const len = binaryStr.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryStr.charCodeAt(i);
            }
            pdfSource = { data: bytes };
          } else {
            pdfSource = { url: fileDataUrl };
          }
        }

        if (!pdfSource) {
          throw new Error('Sumber file PDF tidak ditemukan.');
        }

        const loadingTask = pdfjsLib.getDocument({
          ...pdfSource,
          useWorkerFetch: false,
          useSystemFonts: true,
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error loading PDF:', err);
        if (!isCancelled) {
          setError(err?.message || 'Gagal memuat dokumen PDF.');
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [file, fileDataUrl]);

  return (
    <div className="w-full flex flex-col space-y-4" ref={containerRef}>
      {/* Sleek Minimal Document Header (Tanpa Card Berat) */}
      <div className="flex items-center justify-between py-1 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-normal text-slate-500 text-xs">
            {numPages > 0 ? `Total ${numPages} Halaman` : 'Dokumen PDF'}
          </span>
        </div>

        {fileDataUrl && (
          <button
            type="button"
            onClick={() => {
              if (fileDataUrl) {
                const win = window.open();
                if (win) {
                  win.document.write(
                    `<iframe src="${fileDataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                  );
                }
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-colors cursor-pointer"
          >
            <span>Buka / Unduh</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
          <p className="text-xs font-normal text-slate-500">Memuat tampilan dokumen PDF...</p>
        </div>
      )}

      {/* Error / Fallback State */}
      {!loading && error && (
        <div className="p-6 text-center border border-slate-200/80 rounded-xl flex flex-col items-center justify-center min-h-[250px] space-y-2 bg-slate-50/50">
          <AlertCircle className="w-6 h-6 text-amber-500" />
          <p className="text-xs font-medium text-slate-800">Gagal Merender Canvas PDF</p>
          <p className="text-[11px] text-slate-500 max-w-sm">{error}</p>
          {fileDataUrl && (
            <div className="w-full mt-3 h-[400px] border border-slate-200 rounded-xl overflow-hidden bg-white">
              <iframe src={fileDataUrl} className="w-full h-full border-0" title="PDF Fallback" />
            </div>
          )}
        </div>
      )}

      {/* Seamless Multi-Page Document View (Direct Sheet Layout, No Bulky Card Wrappers) */}
      {!loading && !error && pdfDoc && numPages > 0 && containerWidth > 0 && (
        <div className="space-y-4 w-full overflow-x-hidden flex flex-col items-center">
          {Array.from({ length: numPages }, (_, index) => (
            <PdfPageRenderer
              key={index + 1}
              pageNumber={index + 1}
              totalPages={numPages}
              pdfDoc={pdfDoc}
              containerWidth={containerWidth}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface PdfPageRendererProps {
  pageNumber: number;
  totalPages: number;
  pdfDoc: any;
  containerWidth: number;
}

const PdfPageRenderer: React.FC<PdfPageRendererProps> = ({
  pageNumber,
  totalPages,
  pdfDoc,
  containerWidth,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState<boolean>(true);

  useEffect(() => {
    let isCancelled = false;
    let renderTask: any = null;

    const renderPage = async () => {
      if (!canvasRef.current || !pdfDoc) return;
      setRendering(true);

      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        // Base unscaled viewport
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        
        // Match exact width with 0 overflow
        const targetWidth = Math.max(containerWidth, 200);
        const scale = targetWidth / unscaledViewport.width;
        
        // DPR support for high resolution crispness
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        const viewport = page.getViewport({ scale: scale * dpr });

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        
        canvas.style.width = '100%';
        canvas.style.height = 'auto';

        const context = canvas.getContext('2d');
        if (!context) return;

        renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
        });

        await renderTask.promise;
        if (!isCancelled) {
          setRendering(false);
        }
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn(`Error rendering page ${pageNumber}:`, err);
        }
        if (!isCancelled) {
          setRendering(false);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask && typeof renderTask.cancel === 'function') {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, pageNumber, containerWidth]);

  return (
    <div className="relative w-full bg-white border border-slate-200/80 rounded-md overflow-hidden shadow-xs">
      {/* Loading Overlay */}
      {rendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 z-10 min-h-[220px]">
          <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
        </div>
      )}
      {/* Clean Direct Document Canvas */}
      <canvas ref={canvasRef} className="block w-full h-auto" />
    </div>
  );
};
