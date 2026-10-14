import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  Maximize2,
  Minimize2,
  Languages,
  X,
  RefreshCw
} from 'lucide-react';
import { ContractDocument } from './types';
import {
  buildContractPdfArtifact,
  extractContractPlainText
} from './contractPdfGenerator';
import {
  GeneratedPdfArtifact,
  downloadPdfArtifact,
  printPdfArtifact,
  revokePdfArtifact
} from '../../utils/pdfSingleSource';
import { UnifiedPdfPreviewViewer } from '../../components/ui/UnifiedPdfPreviewViewer';

interface ContractDocumentPreviewProps {
  document: ContractDocument;
  onPrint?: () => void;
  onClose?: () => void;
}

export const ContractDocumentPreview: React.FC<ContractDocumentPreviewProps> = ({
  document: doc,
  onClose
}) => {
  const [artifact, setArtifact] = useState<GeneratedPdfArtifact | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const activeArtifactRef = useRef<GeneratedPdfArtifact | null>(null);

  const isBilingual = doc.languageMode === 'bilingual';
  const isEnglish = doc.languageMode === 'en';

  // Generate Single Source of Truth PDF Artifact whenever `doc` changes
  const generateArtifact = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextArtifact = await buildContractPdfArtifact(doc);

      // Revoke previous Blob URL to prevent memory leaks
      if (activeArtifactRef.current) {
        revokePdfArtifact(activeArtifactRef.current);
      }

      activeArtifactRef.current = nextArtifact;
      setArtifact(nextArtifact);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to build contract PDF artifact:', err);
      setError(err?.message || 'Gagal menyusun dokumen PDF.');
      setLoading(false);
    }
  }, [doc]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const nextArtifact = await buildContractPdfArtifact(doc);
        if (!isMounted) {
          revokePdfArtifact(nextArtifact);
          return;
        }
        if (activeArtifactRef.current) {
          revokePdfArtifact(activeArtifactRef.current);
        }
        activeArtifactRef.current = nextArtifact;
        setArtifact(nextArtifact);
        setLoading(false);
      } catch (err: any) {
        if (isMounted) {
          console.error('Failed to build contract PDF artifact:', err);
          setError(err?.message || 'Gagal menyusun dokumen PDF.');
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [doc]);

  // Cleanup Blob URL on unmount
  useEffect(() => {
    return () => {
      if (activeArtifactRef.current) {
        revokePdfArtifact(activeArtifactRef.current);
        activeArtifactRef.current = null;
      }
    };
  }, []);

  const handleCopyText = async () => {
    try {
      const plainText = extractContractPlainText(doc);
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  // Download the exact same PDF binary shown in preview
  const handleDownloadPdf = () => {
    if (!artifact) return;
    downloadPdfArtifact(artifact);
  };

  // Print the exact same PDF binary shown in preview
  const handlePrintPdf = async () => {
    if (!artifact || isPrinting) return;
    setIsPrinting(true);
    try {
      await printPdfArtifact(artifact);
    } catch (err) {
      console.error('Failed to print PDF artifact:', err);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-slate-100 ${
        isFullscreen
          ? 'fixed inset-0 z-50 overflow-hidden bg-slate-900/90'
          : 'rounded-2xl border border-slate-200 overflow-hidden shadow-xs'
      }`}
    >
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-white border-b border-slate-200 shrink-0 print:hidden">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs font-semibold text-slate-800 tracking-tight truncate max-w-[240px] sm:max-w-[360px]">
            Pratinjau PDF Resmi: <span className="font-bold text-slate-900">{doc.titleId}</span>
          </span>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-slate-600">
            <Languages className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-semibold text-blue-700">
              {isBilingual
                ? '2 Bahasa (Bilingual Kolom Ganda)'
                : isEnglish
                ? 'Bahasa Inggris'
                : 'Bahasa Indonesia'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {/* Salin Teks */}
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs active:bg-slate-100"
            title="Salin seluruh isi teks dokumen untuk Word / Google Docs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Salin Teks</span>
              </>
            )}
          </button>

          {/* Unduh PDF (Single Source of Truth) */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={!artifact || loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 border border-slate-300/80 rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="Unduh file PDF yang 100% identik dengan tampilan pratinjau"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>Unduh PDF</span>
          </button>

          {/* Cetak PDF (Single Source of Truth) */}
          <button
            type="button"
            onClick={handlePrintPdf}
            disabled={!artifact || loading || isPrinting}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-xs active:bg-blue-800"
            title="Cetak dokumen PDF A4 presisi yang sama dengan pratinjau"
          >
            {isPrinting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Printer className="w-3.5 h-3.5" />
            )}
            <span>{isPrinting ? 'Menyiapkan Cetak...' : 'Cetak PDF'}</span>
          </button>

          {/* Layar Penuh */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Tutup Modal */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ml-0.5"
              title="Tutup Pratinjau Dokumen"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Unified PDF Viewer (Menampilkan PDF Final yang Identik dengan Unduh & Cetak) */}
      <UnifiedPdfPreviewViewer
        artifact={artifact}
        loading={loading}
        error={error}
        onRetry={generateArtifact}
      />
    </div>
  );
};
