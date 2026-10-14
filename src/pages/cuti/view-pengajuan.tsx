import React, { useMemo } from 'react';
import { Plus, Search, Check, X, CalendarRange, Trash2 } from 'lucide-react';
import { Leave, Employee, Department, Position } from '../../types';
import { PageHeaderTitle, DesktopHeaderActions, MobileHeaderActions } from '../../context/MobileNavContext';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import { formatEmployeeName, formatPositionName, formatShortDateIndo, getLeaveTypeLabel } from './utils-helper';
import { CutiDualNav } from './cuti-dual-nav';
import emptyLeaveAnimation from '../../assets/animations/empty-leave.json';

interface ViewPengajuanProps {
  leaves: Leave[];
  employees: Employee[];
  employeeMap: Map<string, Employee>;
  positionMap: Map<string, Position>;
  departmentMap: Map<string, Department>;
  onSelectSubTab: (tab: 'pengajuan' | 'kuota' | 'kebijakan') => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  searchLeave: string;
  setSearchLeave: (val: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  filterType: string;
  setFilterType: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  filterDept: string;
  setFilterDept: (val: string) => void;
  setIsFilterModalOpen: (val: boolean) => void;
  hasActiveFilters: boolean;
  handleResetFilters: () => void;
  setIsModalOpen: (val: boolean) => void;
  setSelectedLeaveDetail: (leave: Leave | null) => void;
  handleDeleteLeave: (id: string) => Promise<void>;
  getStatusBadge: (status: string) => React.ReactNode;
}

export function ViewPengajuan({
  leaves,
  employees,
  employeeMap,
  positionMap,
  departmentMap,
  onSelectSubTab,
  isSearchOpen,
  setIsSearchOpen,
  searchLeave,
  setSearchLeave,
  searchInputRef,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filterDept,
  setFilterDept,
  setIsFilterModalOpen,
  hasActiveFilters,
  handleResetFilters,
  setIsModalOpen,
  setSelectedLeaveDetail,
  handleDeleteLeave,
  getStatusBadge
}: ViewPengajuanProps) {

  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) => {
      if (filterType !== 'all' && getLeaveTypeLabel(l.leaveType).toLowerCase() !== filterType.toLowerCase()) return false;
      if (filterStatus !== 'all' && l.status !== filterStatus) return false;
      const emp = employeeMap.get(l.employeeId);
      if (filterDept !== 'all' && emp?.departmentId !== filterDept) return false;
      if (searchLeave) {
        const q = searchLeave.toLowerCase();
        const empName = (emp?.fullName || '').toLowerCase();
        if (!empName.includes(q) && !l.reason?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [leaves, filterType, filterStatus, filterDept, searchLeave, employeeMap]);

  return (
    <div className="space-y-3.5">
      <PageHeaderTitle 
        title="Pengajuan Cuti & Izin" 
        subtitle="Daftar Permohonan Cuti" 
      />

      {/* Standard Header Actions */}
      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                title="Cari"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer relative"
                title="Filter Data"
              >
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-filter"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
                </span>
                {hasActiveFilters && (
                  <span className="absolute 1 top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                title="Buat Pengajuan Cuti"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xs shrink-0 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </DesktopHeaderActions>

          <MobileHeaderActions>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer relative"
              >
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-filter"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
                </span>
                {hasActiveFilters && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 border border-white rounded-full"></span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xs shrink-0 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </MobileHeaderActions>
        </>
      )}

      {isSearchOpen && (
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari nama karyawan atau keterangan..."
              value={searchLeave}
              onChange={(e) => setSearchLeave(e.target.value)}
              className="w-full h-9 sm:h-10 pl-9 pr-9 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
            />
            {searchLeave && (
              <button
                type="button"
                onClick={() => setSearchLeave('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchLeave('');
            }}
            className="h-9 sm:h-10 px-3 text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Batal
          </button>
        </div>
      )}

      {/* 2 Tab Tombol Navigasi Sub-Cuti: Saldo Cuti | Kebijakan Cuti */}
      <CutiDualNav activeSubTab="pengajuan" onSelectSubTab={onSelectSubTab} />

      {hasActiveFilters && !isSearchOpen && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {filterType !== 'all' && (
            <span className="inline-flex items-center gap-1 pl-2 pr-1.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-medium text-blue-700">
              Jenis: {filterType}
              <button type="button" onClick={() => setFilterType('all')} className="hover:text-blue-900 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}
          {filterStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 pl-2 pr-1.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-medium text-amber-700">
              Status: {filterStatus}
              <button type="button" onClick={() => setFilterStatus('all')} className="hover:text-amber-900 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}
          {filterDept !== 'all' && (
            <span className="inline-flex items-center gap-1 pl-2 pr-1.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-medium text-emerald-700">
              Dept: {departmentMap.get(filterDept) || 'Semua'}
              <button type="button" onClick={() => setFilterDept('all')} className="hover:text-emerald-900 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}
          <button type="button" onClick={handleResetFilters} className="text-[11px] text-slate-500 hover:text-rose-600 underline ml-1 cursor-pointer font-medium">Reset Semua</button>
        </div>
      )}

      {leaves.length === 0 ? (
        <div className="mt-4">
          <InitialEmptyCard
            title="Kelola Cuti & Izin Tim!"
            description="Pantau dan atur permohonan cuti, izin sakit, dan ketidakhadiran karyawan."
            buttonText="Buat Pengajuan Cuti"
            ButtonIcon={CalendarRange}
            onAction={() => setIsModalOpen(true)}
            animationData={emptyLeaveAnimation}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="px-4 py-3">Karyawan</th>
                  <th className="px-4 py-3 whitespace-nowrap">Jenis Cuti</th>
                  <th className="px-4 py-3 whitespace-nowrap">Periode Cuti</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">Durasi</th>
                  <th className="px-4 py-3 min-w-[280px]">Keterangan</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <CalendarRange className="w-6 h-6 text-slate-300" />
                        <p className="font-medium text-slate-600">Tidak ada data pengajuan cuti/izin.</p>
                        <p className="text-[11px] text-slate-400">Silakan ubah filter pencarian Anda.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((leave) => {
                    const emp = employeeMap.get(leave.employeeId);
                    const rawPos = emp?.positionId ? positionMap.get(emp.positionId)?.name : (emp?.departmentId ? departmentMap.get(emp.departmentId)?.name : 'Staff');
                    const displayPos = formatPositionName(rawPos || 'Staff');
                    const displayName = formatEmployeeName(emp?.fullName || leave.employeeId);
                    
                    return (
                      <tr 
                        key={leave.id} 
                        onClick={() => setSelectedLeaveDetail(leave)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 max-w-[160px] overflow-hidden">
                          <div className="font-semibold text-slate-900 text-xs truncate whitespace-nowrap" title={emp?.fullName || leave.employeeId}>
                            {displayName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal truncate whitespace-nowrap mt-0.5" title={rawPos || 'Staff'}>
                            {displayPos}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold text-[11px] border whitespace-nowrap ${
                            leave.leaveType === 'Tahunan' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            leave.leaveType === 'Melahirkan' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            leave.leaveType === 'Menikah' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                            leave.leaveType === 'Berduka' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                            'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}>
                            {getLeaveTypeLabel(leave.leaveType)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col text-xs leading-snug">
                            <div className="text-slate-600 font-normal">{formatShortDateIndo(leave.startDate)}</div>
                            <div className="text-slate-500 font-normal mt-0.5">{formatShortDateIndo(leave.endDate)}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center justify-center leading-tight">
                            <div className="font-bold text-slate-900 text-sm">{leave.duration}</div>
                            <div className="text-[11px] text-slate-500 font-normal">Hari</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 min-w-[280px] max-w-[420px]" title={leave.reason}>
                          <p className="line-clamp-2 text-xs leading-relaxed">
                            {leave.reason || '-'}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDeleteLeave(leave.id); }} 
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors" 
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
