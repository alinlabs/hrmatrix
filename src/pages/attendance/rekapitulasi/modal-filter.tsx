import React from 'react';
import { 
  Filter, 
  X, 
  Calendar, 
  Building2, 
  UserCheck, 
  RotateCcw,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Department } from '../../../types';
import { Modal } from '../../../components/ui/Modal';

export interface ModalFilterRekapProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: string;
  setSelectedMonth: (val: string) => void;
  selectedYear: string;
  setSelectedYear: (val: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  departments: Department[];
  hasActiveFilters: boolean;
  onReset: () => void;
}

export const MONTHS = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

export const YEARS = ['2024', '2025', '2026', '2027', '2028'];

export function ModalFilterRekap({
  isOpen,
  onClose,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  departments,
  hasActiveFilters,
  onReset,
}: ModalFilterRekapProps) {
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
              <h3 className="font-bold text-sm text-slate-900 leading-none">Filter Rekapitulasi</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Saring data kehadiran & periode rekap</p>
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
          {/* 1. Periode Rekap (Bulan & Tahun) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                1. Periode Bulan & Tahun
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Bulan</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-9 text-xs rounded-xl border border-slate-200 px-3 bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer"
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Tahun</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full h-9 text-xs rounded-xl border border-slate-200 px-3 bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Filter Departemen */}
          {departments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  2. Departemen / Divisi
                </span>
                {departmentFilter !== 'ALL' && (
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Aktif
                  </span>
                )}
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full h-9 text-xs rounded-xl border border-slate-200 px-3 bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer"
              >
                <option value="ALL">Semua Departemen</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 3. Kriteria Kehadiran */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                3. Kriteria Kehadiran Karyawan
              </span>
              {statusFilter !== 'ALL' && (
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Aktif
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer sm:col-span-2 ${
                  statusFilter === 'ALL'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold">Semua Karyawan</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Tampilkan semua data tanpa filter khusus</div>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('HADIR_PENUH')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  statusFilter === 'HADIR_PENUH'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold flex items-center gap-1.5 text-emerald-700">
                  <UserCheck className="w-3.5 h-3.5" /> Hadir Terbanyak
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Hadir &gt; 0 hari</div>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('TERLAMBAT')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  statusFilter === 'TERLAMBAT'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold ring-1 ring-amber-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold flex items-center gap-1.5 text-amber-700">
                  <Clock className="w-3.5 h-3.5" /> Ada Terlambat
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Terlambat &gt; 0 kali</div>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('CUTI')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  statusFilter === 'CUTI'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold flex items-center gap-1.5 text-blue-700">
                  <FileText className="w-3.5 h-3.5" /> Cuti
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Cuti &gt; 0 hari</div>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('ALPA')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  statusFilter === 'ALPA'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 font-bold ring-1 ring-rose-500/20'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold flex items-center gap-1.5 text-rose-700">
                  <AlertTriangle className="w-3.5 h-3.5" /> Ada Ketidakhadiran
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ketidakhadiran &gt; 0 hari</div>
              </button>
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onReset}
                className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-rose-100"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white transition-all shadow-2xs cursor-pointer text-center"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </Modal>
  );
}
