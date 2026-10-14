import React from 'react';
import { Settings, X, LayoutList, Table, Download } from 'lucide-react';
import { Button } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';
import { EmployeeViewMode } from './types';

export interface EmployeeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: 'cards' | 'table' | 'card';
  setViewMode: (mode: any) => void;
  statusFilter: string;
  setStatusFilter: (status: any) => void;
  onExportCSV: () => void;
  totalCount?: number;
}

export function EmployeeSettingsModal({
  isOpen,
  onClose,
  viewMode,
  setViewMode,
  statusFilter,
  setStatusFilter,
  onExportCSV,
  totalCount = 0
}: EmployeeSettingsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="max-w-md p-0 overflow-hidden">
      <div className="bg-white rounded-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Pengaturan & Opsi Tampilan</h3>
              <p className="text-xs text-slate-500">Sesuaikan tata letak dan ekspor data karyawan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* View Mode */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Format Tampilan Daftar
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'card' ? 'card' : 'cards')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'card' || viewMode === 'cards'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <LayoutList className="w-5 h-5 text-blue-600" />
                <span className="text-xs">Kartu (List Card)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Table className="w-5 h-5 text-blue-600" />
                <span className="text-xs">Tabel Lengkap</span>
              </button>
            </div>
          </div>

          {/* Filter Status */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Filter Status Karyawan
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'ALL', label: 'Semua' },
                { id: 'Active', label: 'Aktif' },
                { id: 'Inactive', label: 'Non-Aktif' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatusFilter(item.id)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    statusFilter === item.id
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export CSV */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Ekspor Data
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onExportCSV();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 h-9 text-xs"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Unduh CSV Karyawan {totalCount > 0 ? `(${totalCount} Data)` : ''}</span>
            </Button>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button size="sm" onClick={onClose} className="h-8 text-xs">
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
