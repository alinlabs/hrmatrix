import React from 'react';
import { Search, X, Settings2, User, FoldHorizontal, UnfoldHorizontal, ZoomOut, ZoomIn, Edit } from 'lucide-react';
import { Employee, Department, LeaveTypePolicy } from '../../types';
import { EmployeeLeaveSummary } from '../../services/leaveService';
import { PageHeaderTitle, PageHeaderSearch, DesktopHeaderActions, MobileHeaderActions } from '../../context/MobileNavContext';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import { formatEmployeeName, formatPositionName } from './utils-helper';
import { CutiDualNav } from './cuti-dual-nav';
import emptyLeaveAnimation from '../../assets/animations/empty-leave.json';

interface ViewKuotaProps {
  employees: Employee[];
  employeeLeaveSummaries: EmployeeLeaveSummary[];
  leavePolicies: LeaveTypePolicy[];
  departmentMap: Map<string, string>;
  positionMap: Map<string, string>;
  onSelectSubTab: (tab: 'pengajuan' | 'kuota' | 'kebijakan') => void;
  isSearchQuotaOpen: boolean;
  setIsSearchQuotaOpen: (val: boolean) => void;
  searchQuota: string;
  setSearchQuota: (val: string) => void;
  searchQuotaInputRef: React.RefObject<HTMLInputElement>;
  filterDeptQuota: string;
  setFilterDeptQuota: (val: string) => void;
  filterStatusQuota: string;
  setFilterStatusQuota: (val: string) => void;
  selectedYear: number;
  setSelectedYear: (val: number) => void;
  currentYear: number;
  setIsFilterQuotaModalOpen: (val: boolean) => void;
  hasActiveFiltersQuota: boolean;
  handleResetFiltersQuota: () => void;
  setIsSettingsModalOpen: (val: boolean) => void;
  handleOpenEditQuota: (summary: EmployeeLeaveSummary) => void;
  setSelectedEmployeeBalance: (summary: EmployeeLeaveSummary | null) => void;
  expandedPolicyIds: string[];
  setExpandedPolicyIds: (val: string[]) => void;
  zoomOffset: number;
  setZoomOffset: (val: number) => void;
  handleCollapseAll: () => void;
  handleExpandAll: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  toggleExpandPolicy: (id: string) => void;
}

export function ViewKuota({
  employees,
  employeeLeaveSummaries,
  leavePolicies,
  departmentMap,
  positionMap,
  onSelectSubTab,
  isSearchQuotaOpen,
  setIsSearchQuotaOpen,
  searchQuota,
  setSearchQuota,
  searchQuotaInputRef,
  filterDeptQuota,
  setFilterDeptQuota,
  filterStatusQuota,
  setFilterStatusQuota,
  selectedYear,
  setSelectedYear,
  currentYear,
  setIsFilterQuotaModalOpen,
  hasActiveFiltersQuota,
  handleResetFiltersQuota,
  setIsSettingsModalOpen,
  handleOpenEditQuota,
  setSelectedEmployeeBalance,
  expandedPolicyIds,
  setExpandedPolicyIds,
  zoomOffset,
  setZoomOffset,
  handleCollapseAll,
  handleExpandAll,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  toggleExpandPolicy
}: ViewKuotaProps) {

  // Process and filter quota list
  const filteredQuotaList = React.useMemo(() => {
    return employeeLeaveSummaries.filter(s => {
      const empName = s.employeeName.toLowerCase();
      const q = searchQuota.toLowerCase();
      if (q && !empName.includes(q) && !s.employeeId.toLowerCase().includes(q)) return false;
      if (filterDeptQuota !== 'all' && s.departmentId !== filterDeptQuota) return false;
      if (filterStatusQuota === 'remaining' && s.remainingAnnual <= 0) return false;
      if (filterStatusQuota === 'exhausted' && s.remainingAnnual > 0) return false;
      return true;
    }).sort((a, b) => a.employeeName.localeCompare(b.employeeName));
  }, [employeeLeaveSummaries, searchQuota, filterDeptQuota, filterStatusQuota]);

  const totalEmployeesCount = filteredQuotaList.length;
  const avgRemainingLeave = totalEmployeesCount > 0 
    ? (filteredQuotaList.reduce((sum, item) => sum + item.remainingAnnual, 0) / totalEmployeesCount).toFixed(1)
    : 0;
  const totalUsedLeavesThisYear = filteredQuotaList.reduce((sum, item) => sum + item.totalUsedAllTypes, 0);

  const tblPx = 12 + (zoomOffset * 2);
  const tblPy = 10 + (zoomOffset * 2);
  const tableStyle = {
    '--tbl-px': `${tblPx}px`,
    '--tbl-py': `${tblPy}px`,
    fontSize: `${11.5 + zoomOffset * 1}px`
  } as React.CSSProperties;

  const hasAnyExpandedPolicy = expandedPolicyIds.length > 0;

  return (
    <div className="space-y-3.5">
      <PageHeaderTitle 
        title="Saldo & Kuota Cuti" 
        subtitle="Daftar Kuota Karyawan" 
      />

      {!isSearchQuotaOpen && (
        <>
          <DesktopHeaderActions>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchQuotaOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsFilterQuotaModalOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer relative"
              >
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-filter"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
                </span>
                {hasActiveFiltersQuota && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                title="Pengaturan Kebijakan Cuti"
                className="h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs text-slate-700 hover:text-blue-600 flex items-center justify-center shrink-0 transition-all cursor-pointer"
              >
                <Settings2 className="w-4 h-4 stroke-[1.8]" />
              </button>
            </div>
          </DesktopHeaderActions>

          <MobileHeaderActions>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchQuotaOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsFilterQuotaModalOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer relative"
              >
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-filter"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
                </span>
                {hasActiveFiltersQuota && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 border border-white rounded-full"></span>
                )}
              </button>
            </div>
          </MobileHeaderActions>
        </>
      )}

      {isSearchQuotaOpen && (
        <PageHeaderSearch
          searchQuery={searchQuota}
          onSearchChange={setSearchQuota}
          onClose={() => setIsSearchQuotaOpen(false)}
          placeholder="Cari nama karyawan, NIK..."
          onFilterClick={() => setIsFilterQuotaModalOpen(true)}
          isFilterActive={hasActiveFiltersQuota}
        />
      )}

      {/* 2 Tab Tombol Navigasi Sub-Cuti: Pengajuan Cuti | Kebijakan Cuti */}
      <CutiDualNav activeSubTab="kuota" onSelectSubTab={onSelectSubTab} />

      {hasActiveFiltersQuota && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] text-slate-500 font-medium mr-1">Filter Aktif:</span>
          {selectedYear !== currentYear && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium">
              Tahun: {selectedYear}
              <button type="button" onClick={() => setSelectedYear(currentYear)} className="hover:text-blue-900 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}
          {filterStatusQuota !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-medium">
              Saldo: {filterStatusQuota === 'remaining' ? 'Ada Sisa (>0)' : 'Habis (0)'}
              <button type="button" onClick={() => setFilterStatusQuota('all')} className="hover:text-indigo-900 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}
          {filterDeptQuota !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
              Dept: {departmentMap.get(filterDeptQuota) || filterDeptQuota}
              <button type="button" onClick={() => setFilterDeptQuota('all')} className="hover:text-emerald-900 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}
          <button type="button" onClick={handleResetFiltersQuota} className="text-[11px] text-slate-500 hover:text-rose-600 underline ml-1 cursor-pointer font-medium">Reset Semua</button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between min-w-0">
          <div className="min-w-0 pr-1">
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 truncate leading-tight">Total Karyawan</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight">{totalEmployeesCount}</span>
              <span className="text-[10px] text-slate-400 font-normal">Org</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between min-w-0">
          <div className="min-w-0 pr-1">
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 truncate leading-tight">Rata-rata Sisa</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm sm:text-base font-bold text-emerald-600 leading-tight">{avgRemainingLeave}</span>
              <span className="text-[10px] text-emerald-600/70 font-normal">Hari</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between min-w-0">
          <div className="min-w-0 pr-1">
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 truncate leading-tight">Cuti Terpakai</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight">{totalUsedLeavesThisYear}</span>
              <span className="text-[10px] text-slate-400 font-normal">Hari</span>
            </div>
          </div>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="mt-4">
          <InitialEmptyCard
            title="Kelola Saldo Cuti Tim!"
            description="Pantau kuota dan sisa cuti tahunan karyawan secara otomatis."
            buttonText="Tambah Karyawan Dulu"
            ButtonIcon={User}
            onAction={() => window.location.href = '/employees'}
            animationData={emptyLeaveAnimation}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/90 px-3 py-2 border-b border-slate-200 font-medium">
            <div className="flex items-center gap-1.5">
              <span>Klik Header Kolom untuk memperluas rincian</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 border-r border-slate-300 pr-2 mr-0.5">
                <button onClick={handleCollapseAll} className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors cursor-pointer" title="Ringkas Semua Kolom">
                  <FoldHorizontal className="w-3.5 h-3.5" />
                </button>
                <button onClick={handleExpandAll} className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors cursor-pointer" title="Perluas Semua Kolom">
                  <UnfoldHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-0.5">
                <button type="button" onClick={handleZoomOut} disabled={zoomOffset <= -4} className="p-1 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-slate-600 transition-colors cursor-pointer" title="Perkecil Skala">
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={handleResetZoom} className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-slate-200 px-1.5 py-0.5 rounded transition-colors cursor-pointer min-w-[34px] text-center" title="Reset Skala 100%">
                  {Math.round(((11.5 + zoomOffset * 1) / 11.5) * 100)}%
                </button>
                <button type="button" onClick={handleZoomIn} disabled={zoomOffset >= 4} className="p-1 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-slate-600 transition-colors cursor-pointer" title="Perbesar Skala">
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto select-none" style={tableStyle}>
            <table className="w-full text-left border-collapse min-w-[1200px] mb-8">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-600 font-semibold sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <th className="font-bold sticky left-0 z-20 bg-slate-100/90 backdrop-blur-[2px] shadow-[2px_0_4px_rgba(0,0,0,0.03)] border-r border-slate-200" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Nama Karyawan</th>
                  {leavePolicies.map(p => {
                    const isExpanded = expandedPolicyIds.includes(p.id);
                    const isAnnual = p.isAnnualQuotaDeducted || p.id === 'annual' || p.code === 'AL';
                    const hasCarryOver = isAnnual && p.unusedBalanceAction === 'carry_forward';
                    const isConditional = p.periodType === 'conditional';
                    
                    return (
                      <React.Fragment key={p.id}>
                        <th 
                          onClick={() => toggleExpandPolicy(p.id)}
                          colSpan={isExpanded ? (hasCarryOver ? 6 : (isConditional ? 2 : 3)) : 1}
                          className={`border-l border-slate-200 text-center cursor-pointer hover:bg-blue-50/50 transition-colors group ${
                            isExpanded ? 'bg-blue-50/30 font-bold text-slate-800' : ''
                          }`}
                          style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                        >
                          <div className="flex items-center justify-center gap-1.5" title={p.name}>
                            <span className={`group-hover:text-blue-700 transition-colors ${isExpanded ? 'text-blue-700' : ''}`}>
                              {p.name}
                            </span>
                          </div>
                        </th>
                      </React.Fragment>
                    );
                  })}
                </tr>
                <tr className="bg-slate-50 border-b border-slate-200 font-medium text-slate-500 sticky top-[41px] z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <th className="sticky left-0 z-20 bg-slate-50/90 backdrop-blur-[2px] shadow-[2px_0_4px_rgba(0,0,0,0.03)] border-r border-slate-200" style={{ padding: 'var(--tbl-py) var(--tbl-px)', fontSize: '0.9em' }}>Posisi / Dept</th>
                  {leavePolicies.map(p => {
                    const isExpanded = expandedPolicyIds.includes(p.id);
                    const isAnnual = p.isAnnualQuotaDeducted || p.id === 'annual' || p.code === 'AL';
                    const hasCarryOver = isAnnual && p.unusedBalanceAction === 'carry_forward';
                    const isConditional = p.periodType === 'conditional';

                    if (isExpanded) {
                      if (hasCarryOver) {
                        return (
                          <React.Fragment key={p.id}>
                            <th className="text-center border-l border-slate-200 bg-blue-50/30 text-slate-500 whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Kuota Pokok</th>
                            <th className="text-center border-l border-slate-200 bg-blue-50/30 text-slate-500 whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Sisa Lalu</th>
                            <th className="text-center border-l border-slate-200 bg-blue-50/30 text-slate-500 whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Penyesuaian</th>
                            <th className="text-center border-l border-slate-200 bg-blue-50/40 text-blue-700 font-bold whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Total Hak</th>
                            <th className="text-center border-l border-slate-200 bg-blue-50/30 text-rose-600 whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Terpakai</th>
                            <th className="text-center border-l border-slate-200 bg-emerald-50/40 text-emerald-700 font-bold whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>SISA</th>
                          </React.Fragment>
                        );
                      } else if (isConditional) {
                        return (
                          <React.Fragment key={p.id}>
                            <th className="text-center border-l border-slate-200 bg-blue-50/30 text-rose-600 whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Terpakai (Kali/Hari)</th>
                            <th className="text-center border-l border-slate-200 bg-blue-50/30 text-slate-500 whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Batas Maksimal</th>
                          </React.Fragment>
                        );
                      } else {
                        return (
                          <React.Fragment key={p.id}>
                            <th className="text-center border-l border-slate-200 bg-blue-50/30 text-slate-500 whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Total Hak</th>
                            <th className="text-center border-l border-slate-200 bg-blue-50/30 text-rose-600 whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Terpakai</th>
                            <th className="text-center border-l border-slate-200 bg-emerald-50/40 text-emerald-700 font-bold whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>SISA</th>
                          </React.Fragment>
                        );
                      }
                    }
                    return (
                      <th key={p.id} className="text-center border-l border-slate-200 whitespace-nowrap opacity-70" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Pakai/Batas</th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredQuotaList.length === 0 ? (
                  <tr>
                    <td colSpan={leavePolicies.length + 1} className="px-4 py-10 text-center text-slate-500">
                      Tidak ada data yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredQuotaList.map((s) => {
                    const empName = formatEmployeeName(s.employeeName || s.employeeId);
                    const posName = formatPositionName(s.positionId ? positionMap.get(s.positionId) || 'Staff' : (s.departmentId ? departmentMap.get(s.departmentId) || 'Staff' : 'Staff'));

                    return (
                      <tr 
                        key={s.employeeId} 
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => setSelectedEmployeeBalance(s)}
                      >
                        <td className="sticky left-0 z-0 bg-white group-hover:bg-slate-50/80 backdrop-blur-[2px] shadow-[2px_0_4px_rgba(0,0,0,0.01)] border-r border-slate-200 truncate max-w-[200px]" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 pr-2">
                              <div className="font-bold text-slate-900 truncate" title={s.employeeName}>{empName}</div>
                              <div className="text-[0.9em] text-slate-500 truncate mt-0.5 font-normal">{posName}</div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleOpenEditQuota(s); }}
                              className="w-6 h-6 rounded-md bg-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                              title="Edit Kuota / Carry Forward"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        {leavePolicies.map(p => {
                          const isExpanded = expandedPolicyIds.includes(p.id);
                          const isAnnual = p.isAnnualQuotaDeducted || p.id === 'annual' || p.code === 'AL';
                          const hasCarryOver = isAnnual && p.unusedBalanceAction === 'carry_forward';
                          const isConditional = p.periodType === 'conditional';
                          
                          let usedCount = s.policyUsageMap[p.id] || 0;
                          
                          if (isExpanded) {
                            if (hasCarryOver) {
                              return (
                                <React.Fragment key={p.id}>
                                  <td className="text-center border-l border-slate-200 bg-blue-50/10 whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>{s.annualQuota}</td>
                                  <td className="text-center border-l border-slate-100 bg-blue-50/10 whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>
                                    {s.carryForward > 0 ? <span className="text-amber-600 font-bold">+{s.carryForward}</span> : <span className="text-slate-300">-</span>}
                                  </td>
                                  <td className="text-center border-l border-slate-100 bg-blue-50/10 whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>
                                    {s.adjustedQuota > 0 ? <span className="text-emerald-600 font-bold">+{s.adjustedQuota}</span> : (s.adjustedQuota < 0 ? <span className="text-rose-600 font-bold">{s.adjustedQuota}</span> : <span className="text-slate-300">-</span>)}
                                  </td>
                                  <td className="text-center border-l border-blue-100 bg-blue-50/20 text-blue-700 font-bold whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>{s.totalEntitlement}</td>
                                  <td className="text-center border-l border-rose-100 bg-rose-50/10 text-rose-600 font-bold whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>{usedCount > 0 ? usedCount : '-'}</td>
                                  <td className="text-center border-l border-emerald-100 bg-emerald-50/20 text-emerald-700 font-bold whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>{s.remainingAnnual}</td>
                                </React.Fragment>
                              );
                            } else if (isConditional) {
                              return (
                                <React.Fragment key={p.id}>
                                  <td className="text-center border-l border-rose-100 bg-rose-50/10 text-rose-600 font-bold whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>{usedCount > 0 ? usedCount : '-'}</td>
                                  <td className="text-center border-l border-slate-100 bg-slate-50 text-slate-400 whitespace-nowrap text-[0.9em]" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>Kondisional (-)</td>
                                </React.Fragment>
                              );
                            } else {
                              return (
                                <React.Fragment key={p.id}>
                                  <td className="text-center border-l border-slate-200 bg-blue-50/10 whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>{p.defaultQuota > 0 ? p.defaultQuota : 'Fleksibel'}</td>
                                  <td className="text-center border-l border-rose-100 bg-rose-50/10 text-rose-600 font-bold whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>{usedCount > 0 ? usedCount : '-'}</td>
                                  <td className="text-center border-l border-emerald-100 bg-emerald-50/20 text-emerald-700 font-bold whitespace-nowrap" style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}>
                                    {p.defaultQuota > 0 ? Math.max(0, p.defaultQuota - usedCount) : '-'}
                                  </td>
                                </React.Fragment>
                              );
                            }
                          }
                          const maxQuotaDisplay = isConditional 
                             ? '-'
                            : (hasCarryOver 
                                 ? s.totalEntitlement 
                                 : (p.defaultQuota > 0 ? p.defaultQuota : 'Fleksibel'));
                          return (
                            <td 
                              key={p.id} 
                              className={`text-center border-l border-slate-200 whitespace-nowrap transition-opacity ${hasAnyExpandedPolicy ? 'opacity-50 hover:opacity-100' : ''}`}
                              style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                            >
                              <span className={`text-[1em] font-bold ${usedCount > 0 ? 'text-blue-700' : 'text-slate-600'}`}>
                                {usedCount}/{maxQuotaDisplay}
                              </span>
                            </td>
                          );
                        })}
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
