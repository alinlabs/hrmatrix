import React, { useMemo } from 'react';
import { 
  Filter, 
  X, 
  Check
} from 'lucide-react';
import { Department } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui';

interface ModalFilterQuotaProps {
  isOpen: boolean;
  onClose: () => void;
  filterDept: string;
  setFilterDept: (val: string) => void;
  selectedYear: number;
  setSelectedYear: (val: number) => void;
  filterStatus: 'all' | 'remaining' | 'exhausted';
  setFilterStatus: (val: 'all' | 'remaining' | 'exhausted') => void;
  departments: Department[];
  hasActiveFilters: boolean;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { key: 'all', label: 'Semua Status Saldo', desc: 'Tampilkan seluruh karyawan' },
  { key: 'remaining', label: 'Masih Ada Sisa', desc: 'Sisa cuti > 0 hari' },
  { key: 'exhausted', label: 'Kuota Habis / 0', desc: 'Sisa cuti 0 hari' },
];

const AVAILABLE_YEARS = [2027, 2026, 2025, 2024];

export function ModalFilterQuota({
  isOpen,
  onClose,
  filterDept,
  setFilterDept,
  selectedYear,
  setSelectedYear,
  filterStatus,
  setFilterStatus,
  departments,
  hasActiveFilters,
  onReset,
}: ModalFilterQuotaProps) {
  const deptOptions = useMemo(() => {
    return [
      { value: 'all', label: 'Semua Departemen' },
      ...departments.map((d) => ({ value: d.id, label: d.name }))
    ];
  }, [departments]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-md"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Filter className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Filter Saldo & Kuota
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Saring data saldo cuti karyawan
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            title="Tutup"
            aria-label="Tutup"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* 1. Tahun Periode Kuota */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-normal text-slate-600">
                Tahun Periode Kuota
              </label>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Tahun {selectedYear}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_YEARS.map((yr) => {
                const isSelected = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(yr)}
                    className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Status Saldo Cuti */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-normal text-slate-600">
                Status Saldo Cuti
              </label>
              {filterStatus !== 'all' && (
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Aktif
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {STATUS_OPTIONS.map((st) => {
                const isSelected = filterStatus === st.key;
                return (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => setFilterStatus(st.key as 'all' | 'remaining' | 'exhausted')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold ring-1 ring-blue-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold leading-tight">{st.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{st.desc}</div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Filter Departemen */}
          {departments.length > 0 && (
            <div>
              <Select
                label="Departemen / Divisi"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                options={deptOptions}
              />
            </div>
          )}
          
          {hasActiveFilters && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onReset}
                className="w-full py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-rose-100"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions: Single Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer text-center shadow-xs active:scale-[0.99]"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </Modal>
  );
}
