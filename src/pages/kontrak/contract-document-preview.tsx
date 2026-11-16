import React, { useEffect, useRef, useState } from 'react';
import { Download, Printer, RefreshCw, X } from 'lucide-react';
import { ContractDocument } from './types';
import {
  createPdfArtifact,
  downloadPdfArtifact,
  GeneratedPdfArtifact,
  printPdfArtifact,
  revokePdfArtifact,
} from '../../utils/pdf-single-source';
import { buildContractPdf } from '../../utils/pdf-contract-builder';
import {
  PdfHeaderZoomControls,
  UnifiedPdfPreviewViewer,
} from '../../components/ui/unified-pdf-preview-viewer';

interface ContractDocumentPreviewProps {
  document: ContractDocument;
  onClose: () => void;
}

export const ContractDocumentPreview: React.FC<ContractDocumentPreviewProps> = ({
  document,
  onClose,
}) => {
  const [artifact, setArtifact] = useState<GeneratedPdfArtifact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [zoom, setZoom] = useState<number>(1.0);
  const activeRef = useRef<GeneratedPdfArtifact | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const bytes = buildContractPdf(document);
        const safeEmp = document.employee.fullName.replace(/[^a-zA-Z0-9_-]+/g, '_');
        const next = await createPdfArtifact(
          bytes,
          `Kontrak_${document.contractType}_${safeEmp}.pdf`,
          document.titleId
        );
        if (!mounted) {
          revokePdfArtifact(next);
          return;
        }
        if (activeRef.current) revokePdfArtifact(activeRef.current);
        activeRef.current = next;
        setArtifact(next);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Gagal membuat pratinjau PDF kontrak.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
      if (activeRef.current) {
        revokePdfArtifact(activeRef.current);
        activeRef.current = null;
      }
    };
  }, [document]);

  const handlePrint = async () => {
    if (!artifact || isPrinting) return;
    setIsPrinting(true);
    try {
      await printPdfArtifact(artifact);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-100">
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-900 truncate">{document.titleId}</h3>
          <p className="text-xs text-slate-500 truncate">
            {document.contractNumber} • {document.employee.fullName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <PdfHeaderZoomControls
            zoom={zoom}
            onZoomChange={setZoom}
            disabled={!artifact || loading}
          />
          <button
            type="button"
            disabled={!artifact || loading}
            onClick={() => artifact && downloadPdfArtifact(artifact)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold disabled:opacity-50 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unduh PDF</span>
          </button>
          <button
            type="button"
            disabled={!artifact || loading || isPrinting}
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer transition-colors"
          >
            {isPrinting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Printer className="w-3.5 h-3.5" />
            )}
            <span>{isPrinting ? 'Menyiapkan...' : 'Cetak'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
            title="Tutup"
            aria-label="Tutup Pratinjau"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <UnifiedPdfPreviewViewer
          artifact={artifact}
          loading={loading}
          error={error}
          zoom={zoom}
        />
      </div>
    </div>
  );
};
