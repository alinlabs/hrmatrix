import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Layers, 
  X 
} from 'lucide-react';
import { AttendanceConfig } from '../../../types';
import { formatTwoLineDate, statusFilterLabels } from './utils-helper';

interface PresensiHeaderProps {
  filterDate: string;
  setFilterDate: (date: string) => void;
  todayStr: string;
  attendanceConfig: AttendanceConfig | null;
  shiftFilter: string;
  departmentFilter: string;
  statusFilter: string;
  deptMap: Map<string, string>;
  onOpenShiftModal: () => void;
  onResetFilters: () => void;
  onRemoveShiftFilter: () => void;
  onRemoveDeptFilter: () => void;
  onRemoveStatusFilter: () => void;
}

export function PresensiHeader({
  filterDate,
  setFilterDate,
  todayStr,
  attendanceConfig,
  shiftFilter,
  departmentFilter,
  statusFilter,
  deptMap,
  onOpenShiftModal,
  onResetFilters,
  onRemoveShiftFilter,
  onRemoveDeptFilter,
  onRemoveStatusFilter,
}: PresensiHeaderProps) {
  const { dayName, dateNumStr } = formatTwoLineDate(filterDate);
  const hasActiveFilters = filterDate !== todayStr || departmentFilter !== 'ALL' || statusFilter !== 'ALL' || shiftFilter !== 'ALL';
  const showShiftOption = attendanceConfig?.systemType === 'shift' || attendanceConfig?.systemType === 'mixed';
  const selectedShiftObj = attendanceConfig?.shifts?.find(s => s.id === shiftFilter || s.code === shiftFilter);

  if (!showShiftOption && !hasActiveFilters) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Stylish Dual-Card Filter: Tanggal | Shift (Rendered ONLY when Shift / Mixed System) */}
      {showShiftOption && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-1.5 shadow-2xs">
          <div className="grid grid-cols-2 divide-x divide-slate-100">
            {/* Card 1: Tanggal Presensi */}
            <div className="relative flex items-center justify-center gap-2.5 py-2.5 px-3 sm:px-4 rounded-xl hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer group text-slate-700 hover:text-blue-700">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs shrink-0">
                <CalendarIcon className="w-4 h-4 stroke-[1.8]" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs sm:text-sm font-bold leading-tight group-hover:text-blue-700 transition-colors truncate">
                  Tanggal
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight truncate">
                  {dayName}, {dateNumStr}
                </div>
              </div>
              <input 
                type="date" 
                value={filterDate} 
                onChange={(e) => setFilterDate(e.target.value)} 
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker?.();
                  } catch (err) {}
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                title="Pilih Tanggal Presensi"
              />
            </div>

            {/* Card 2: Shift Kerja */}
            <button
              type="button"
              onClick={onOpenShiftModal}
              className="flex items-center justify-center gap-2.5 py-2.5 px-3 sm:px-4 rounded-xl hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer group text-slate-700 hover:text-indigo-700"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs shrink-0">
                <Layers className="w-4 h-4 stroke-[1.8]" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs sm:text-sm font-bold leading-tight group-hover:text-indigo-700 transition-colors truncate">
                  {shiftFilter === 'ALL' ? 'Semua Shift' : (selectedShiftObj ? (selectedShiftObj.code || selectedShiftObj.name) : shiftFilter)}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight truncate">
                  {shiftFilter === 'ALL' ? 'Pilih & Filter Shift' : (selectedShiftObj ? `${selectedShiftObj.startTime} - ${selectedShiftObj.endTime}` : 'Filter Shift')}
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 flex-wrap text-xs pt-0.5">
          <span className="text-slate-400 font-medium text-[11px]">Filter Aktif:</span>
          {filterDate !== todayStr && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
              <CalendarIcon className="w-3 h-3 text-blue-500" />
              {new Date(filterDate + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              <button type="button" onClick={() => setFilterDate(todayStr)} className="hover:text-blue-900 cursor-pointer ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {departmentFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
              Dept: {deptMap.get(departmentFilter) || departmentFilter}
              <button type="button" onClick={onRemoveDeptFilter} className="hover:text-blue-900 cursor-pointer ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {statusFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
              Status: {statusFilterLabels[statusFilter] || statusFilter}
              <button type="button" onClick={onRemoveStatusFilter} className="hover:text-blue-900 cursor-pointer ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {shiftFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold">
              Shift: {(() => {
                const s = attendanceConfig?.shifts?.find(x => x.id === shiftFilter || x.code === shiftFilter);
                return s ? (s.code || s.name) : shiftFilter;
              })()}
              <button type="button" onClick={onRemoveShiftFilter} className="hover:text-indigo-900 cursor-pointer ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer ml-1"
          >
            Reset Semua
          </button>
        </div>
      )}
    </div>
  );
}
