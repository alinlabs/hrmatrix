import React from 'react';
import { Filter, Layers, ArrowUpDown, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { ContractCategory } from './types';

interface ModalFilterDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: ContractCategory | 'ALL';
  setSelectedCategory: (cat: ContractCategory | 'ALL') => void;
  sortBy: 'newest' | 'oldest' | 'name';
  setSortBy: (sort: 'newest' | 'oldest' | 'name') => void;
  onResetFilter: () => void;
}

export const ModalFilterDocument: React.FC<ModalFilterDocumentProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  onResetFilter,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-md"
      hideBottomNav={false}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Filter className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Filter & Urutkan Dokumen
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Saring berkas berdasarkan kategori & urutan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Filter Kategori Dokumen */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Kategori Dokumen
            </label>
            <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
              {[
                { id: 'ALL', label: 'Semua Dokumen' },
                { id: 'KONTRAK_BARU', label: 'Kontrak Baru' },
                { id: 'PERPANJANG_KONTRAK', label: 'Perpanjangan' },
                { id: 'PROMOSI', label: 'Promosi' },
                { id: 'SURAT_PERINGATAN', label: 'Peringatan' },
                { id: 'PEMBERHENTIAN', label: 'Pemberhentian' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Urutkan Berkas */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
              Urutkan Berkas
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
              {[
                { id: 'newest', label: 'Terbaru' },
                { id: 'oldest', label: 'Terlama' },
                { id: 'name', label: 'Nama A-Z' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSortBy(item.id as any)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    sortBy === item.id
                      ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white space-y-2">
          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
            onClick={onClose}
          >
            Terapkan Filter
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={onResetFilter}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
