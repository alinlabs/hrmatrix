import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Tag, Calculator, ChevronRight, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { ModalAddKompensasiMenuProps } from './types';

export const ModalAddKompensasiMenu: React.FC<ModalAddKompensasiMenuProps> = ({
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-md p-5 sm:p-6">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">Tambah Kompensasi Baru</h3>
          <p className="text-xs text-slate-500 mt-0.5">Pilih jenis formulir kompensasi atau aturan yang ingin dibuat</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {/* Option 1: Buat Tunjangan */}
        <button
          onClick={() => handleSelect('/kompensasi/add/tunjangan')}
          className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700">
                Buat Tunjangan
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Master template komponen tunjangan karyawan & bonus
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Option 2: Buat Jaminan Sosial */}
        <button
          onClick={() => handleSelect('/kompensasi/add/jaminan')}
          className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700">
                Buat Jaminan Sosial
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Regulasi iuran BPJS Kesehatan & BPJS Ketenagakerjaan
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Option 3: Buat Pajak */}
        <button
          onClick={() => handleSelect('/kompensasi/add/pajak')}
          className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700">
                Buat Pajak
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Aturan perhitungan pajak PPh 21 dan formula TER
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    </Modal>
  );
};
