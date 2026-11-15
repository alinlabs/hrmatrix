import React from 'react';
import { X, Plus, LayoutTemplate } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

interface ModalAddOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCreateNew: () => void;
  onSelectTemplate: () => void;
}

export const ModalAddOptions: React.FC<ModalAddOptionsProps> = ({
  isOpen,
  onClose,
  onSelectCreateNew,
  onSelectTemplate,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-md p-0 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-2.5 min-w-0 pr-3">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
              Tambah Job Desk
            </h3>
            <p className="text-[11px] text-slate-500 font-normal truncate">
              Pilih metode pembuatan standar posisi
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-3 bg-white">
        <button
          type="button"
          onClick={() => {
            onClose();
            onSelectTemplate();
          }}
          className="w-full text-left p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-blue-500 hover:shadow-xs transition-all group flex items-start gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
            <LayoutTemplate className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Pilih Cepat Pakai Template
              </h4>
              <span className="text-[10px] font-semibold bg-emerald-500 text-white px-1.5 py-0.2 rounded-md">
                Rekomendasi
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Gunakan template standar industri yang sudah lengkap dengan KPI, wewenang, dan struktur gaji.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onSelectCreateNew();
          }}
          className="w-full text-left p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-blue-500 hover:shadow-xs transition-all group flex items-start gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Buat Baru Dari Awal
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Buat posisi khusus dengan form kosong terstruktur sesuai kebutuhan internal perusahaan Anda.
            </p>
          </div>
        </button>
      </div>
    </Modal>
  );
};


