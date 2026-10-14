import React from 'react';
import { Filter, RotateCcw, X, Calendar } from 'lucide-react';
import { Department, AttendanceConfig, WorkShift } from '../../types';
import { Modal } from '../../components/ui/Modal';

export interface ModalMatrixFilterProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  departmentFilter: string;
  setDepartmentFilter: (val: string) => void;
  activeConfig: AttendanceConfig | null;
  availableShifts: WorkShift[];
  shiftFilter: string;
  setShiftFilter: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  defaultMonthRange: { start: string; end: string };
  formatDisplayDateIndo: (dateStr: string) => string;
}

export function ModalMatrixFilter({
  isOpen,
  onClose,
  departments,
  departmentFilter,
  setDepartmentFilter,
  activeConfig,
  availableShifts,
  shiftFilter,
  setShiftFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  defaultMonthRange,
  formatDisplayDateIndo,
}: ModalMatrixFilterProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-md"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Filter Tabel Jadwal</h3>
          </div>
          <div className="flex items-center gap-1">
            <button 
              type="button"
              onClick={() => {
                setDepartmentFilter('ALL');
                setShiftFilter('ALL');
                setStartDate(defaultMonthRange.start);
                setEndDate(defaultMonthRange.end);
              }}
              className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset Filter ke Default"
              aria-label="Reset Filter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto overflow-x-hidden text-xs w-full min-w-0 box-border">
          {/* 1. Departemen */}
          <div className="space-y-1.5 min-w-0">
            <label className="block font-semibold text-slate-700">Departemen</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full h-9 text-xs sm:text-sm rounded-lg border border-slate-200 px-3 bg-white font-medium text-slate-700 focus:outline-hidden cursor-pointer box-border"
            >
              <option value="ALL">Semua Departemen</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Jadwal Shift (hanya jika mode kerja shift atau campuran) */}
          {activeConfig?.systemType !== 'normal' && (
            <div className="space-y-1.5 min-w-0">
              <label className="block font-semibold text-slate-700">Jadwal Shift / Status</label>
              <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="w-full h-9 text-xs sm:text-sm rounded-lg border border-slate-200 px-3 bg-white font-medium text-slate-700 focus:outline-hidden cursor-pointer box-border"
              >
                <option value="ALL">Semua Shift / Status</option>
                <option value="OFF">Libur (OFF)</option>
                {availableShifts.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
          )}

          {/* 3. Periode Tanggal (Card Tanggal dengan Teks Statis & Klik Kalender) */}
          <div className="space-y-1.5 min-w-0">
            <label className="block font-semibold text-slate-700">Periode Tanggal</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-w-0">
              {/* Card Dari Tanggal */}
              <div className="relative p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/20 transition-all flex items-center gap-3 cursor-pointer group">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-blue-600 shrink-0 transition-colors">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                    Dari Tanggal
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors block truncate">
                    {formatDisplayDateIndo(startDate)}
                  </span>
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  title="Klik untuk memilih Dari Tanggal"
                />
              </div>

              {/* Card Sampai Tanggal */}
              <div className="relative p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/20 transition-all flex items-center gap-3 cursor-pointer group">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-blue-600 shrink-0 transition-colors">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                    Sampai Tanggal
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors block truncate">
                    {formatDisplayDateIndo(endDate)}
                  </span>
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  title="Klik untuk memilih Sampai Tanggal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
