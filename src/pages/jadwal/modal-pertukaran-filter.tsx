import React from 'react';
import { 
  Filter, 
  X, 
  UserCheck, 
  User, 
  Building2, 
  ArrowRightLeft, 
  Zap, 
  Users, 
  RefreshCw 
} from 'lucide-react';
import { ModalFilterProps } from './types';
import { Modal } from '../../components/ui/Modal';

export function ModalFilter({
  isOpen,
  onClose,
  filterInitiator,
  setFilterInitiator,
  filterSwapType,
  setFilterSwapType,
  hasActiveFilters
}: ModalFilterProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-md"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-none">Filter Pertukaran Shift</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Atur penyaringan daftar riwayat jadwal</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs">
          {/* Bagian 1: Berdasarkan Inisiator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                1. Berdasarkan Inisiator
              </span>
              {filterInitiator !== 'ALL' && (
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Aktif
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFilterInitiator('ALL')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  filterInitiator === 'ALL'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold">Semua</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Semua inisiator</div>
              </button>

              <button
                type="button"
                onClick={() => setFilterInitiator('Employee')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  filterInitiator === 'Employee'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-600" /> Karyawan
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Mandiri</div>
              </button>

              <button
                type="button"
                onClick={() => setFilterInitiator('Company')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  filterInitiator === 'Company'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-indigo-600" /> Perusahaan
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Instruksi HR</div>
              </button>
            </div>
          </div>

          {/* Bagian 2: Berdasarkan Jenis Penyesuaian */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                2. Berdasarkan Jenis Penyesuaian
              </span>
              {filterSwapType !== 'ALL' && (
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Aktif
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFilterSwapType('ALL')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer sm:col-span-3 ${
                  filterSwapType === 'ALL'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold">Semua Kategori</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Semua jenis pergantian & pertukaran</div>
              </button>

              <button
                type="button"
                onClick={() => setFilterSwapType('ganti_shift')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  filterSwapType === 'ganti_shift' || filterSwapType === 'direct_shift_change'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600" /> Ganti Shift
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ganti shift tgl sama/beda</div>
              </button>

              <button
                type="button"
                onClick={() => setFilterSwapType('tukar_shift')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  filterSwapType === 'tukar_shift' || filterSwapType === 'peer_to_peer'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> Tukar Shift
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Tukar antar karyawan</div>
              </button>

              <button
                type="button"
                onClick={() => setFilterSwapType('tukar_off')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  filterSwapType === 'tukar_off' || filterSwapType === 'self_date_swap'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" /> Tukar Off
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Tukar hari off & kerja</div>
              </button>
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setFilterInitiator('ALL');
                  setFilterSwapType('ALL');
                }}
                className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-rose-100"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors shadow-2xs text-center"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </Modal>
  );
}
