import React from 'react';
import { Upload, X, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui';

export interface ModalImportScheduleProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadTemplate: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
  importStatus: string | null;
  importError: string | null;
}

export function ModalImportSchedule({
  isOpen,
  onClose,
  onDownloadTemplate,
  onFileUpload,
  isImporting,
  importStatus,
  importError,
}: ModalImportScheduleProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-md"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">Impor Jadwal Massal</h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5 truncate">Unggah berkas CSV untuk memperbarui jadwal</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button 
              type="button"
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Template Downloader */}
          <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 gap-3">
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-800 block">Template Berkas CSV</span>
              <span className="text-[10.5px] text-slate-500 block">Unduh format kolom yang sesuai</span>
            </div>
            <button 
              type="button" 
              onClick={onDownloadTemplate} 
              className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-blue-400 text-blue-600 hover:text-blue-700 font-bold text-[11px] rounded-lg shadow-2xs flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Template
            </button>
          </div>

          {/* File Dropzone / Upload area */}
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center transition-colors bg-slate-50/40">
            <input
              type="file"
              accept=".csv"
              id="modal-csv-file-input"
              onChange={onFileUpload}
              disabled={isImporting}
              className="hidden"
            />
            <label htmlFor="modal-csv-file-input" className="cursor-pointer space-y-1 block">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-100 shadow-2xs">
                <Upload className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-blue-600 block">Klik untuk pilih berkas CSV</span>
              <span className="text-[10px] text-slate-400 block max-w-xs mx-auto">
                Format: employeeId, employeeName, date, shiftCode, notes
              </span>
            </label>
          </div>

          {importStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{importStatus}</span>
            </div>
          )}

          {importError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">{importError}</span>
            </div>
          )}
        </div>

        {/* Single Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white">
          <Button
            type="button"
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            Selesai
          </Button>
        </div>
      </div>
    </Modal>
  );
}
