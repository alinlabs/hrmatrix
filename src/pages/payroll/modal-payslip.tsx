import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Building2, Printer, Download, X, RefreshCw } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui';
import { ModalPayslipProps } from './types';
import { buildPayslipPdfArtifact } from '../../utils/pdfGenerator';
import {
  GeneratedPdfArtifact,
  downloadPdfArtifact,
  printPdfArtifact,
  revokePdfArtifact
} from '../../utils/pdfSingleSource';
import { UnifiedPdfPreviewViewer } from '../../components/ui/UnifiedPdfPreviewViewer';

export const ModalPayslip: React.FC<ModalPayslipProps> = ({
  isOpen,
  onClose,
  record,
  period,
  company
}) => {
  const [artifact, setArtifact] = useState<GeneratedPdfArtifact | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const activeArtifactRef = useRef<GeneratedPdfArtifact | null>(null);

  const generatePayslipArtifact = useCallback(async () => {
    if (!isOpen || !record || !record.employee || !period) return;
    setLoading(true);
    setError(null);

    try {
      const nextArtifact = await buildPayslipPdfArtifact(record, period, company);
      if (activeArtifactRef.current) {
        revokePdfArtifact(activeArtifactRef.current);
      }
      activeArtifactRef.current = nextArtifact;
      setArtifact(nextArtifact);
      setLoading(false);
    } catch (err: any) {
      console.error('Error building payslip PDF artifact:', err);
      setError(err?.message || 'Gagal menyusun PDF slip gaji.');
      setLoading(false);
    }
  }, [isOpen, record, period, company]);

  useEffect(() => {
    let isMounted = true;

    if (!isOpen || !record || !record.employee || !period) {
      if (activeArtifactRef.current) {
        revokePdfArtifact(activeArtifactRef.current);
        activeArtifactRef.current = null;
      }
      setArtifact(null);
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const nextArtifact = await buildPayslipPdfArtifact(record, period, company);
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
          console.error('Error building payslip PDF artifact:', err);
          setError(err?.message || 'Gagal menyusun PDF slip gaji.');
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [isOpen, record, period, company]);

  useEffect(() => {
    return () => {
      if (activeArtifactRef.current) {
        revokePdfArtifact(activeArtifactRef.current);
        activeArtifactRef.current = null;
      }
    };
  }, []);

  if (!record || !record.employee || !period) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} contentClassName="max-w-4xl">
        <div className="p-6 text-center text-slate-500 text-xs">Memuat data slip gaji...</div>
      </Modal>
    );
  }

  const handleDownload = () => {
    if (!artifact) return;
    downloadPdfArtifact(artifact);
  };

  const handlePrint = async () => {
    if (!artifact || isPrinting) return;
    setIsPrinting(true);
    try {
      await printPdfArtifact(artifact);
    } catch (err) {
      console.error('Failed to print payslip PDF:', err);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="max-w-4xl h-[88vh] flex flex-col overflow-hidden"
    >
      {/* Header Actions */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
              Pratinjau PDF Slip Gaji: {record.employee.fullName}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              Periode: {period.name || `${period.month} ${period.year}`} ({period.startDate} s/d{' '}
              {period.endDate})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!artifact || loading}
            className="h-8.5 text-xs"
          >
            <Download className="w-4 h-4 mr-1.5 text-blue-700" /> Unduh PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            disabled={!artifact || loading || isPrinting}
            className="h-8.5 text-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPrinting ? (
              <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Printer className="w-4 h-4 mr-1.5" />
            )}
            {isPrinting ? 'Menyiapkan...' : 'Cetak PDF'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8.5 w-8.5 p-0 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Unified PDF Viewer (Menampilkan PDF Final yang Identik dengan Unduh & Cetak) */}
      <UnifiedPdfPreviewViewer
        artifact={artifact}
        loading={loading}
        error={error}
        onRetry={generatePayslipArtifact}
      />
    </Modal>
  );
};
