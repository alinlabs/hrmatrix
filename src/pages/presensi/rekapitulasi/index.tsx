import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/database';
import { format, endOfMonth } from 'date-fns';
import { AttendanceConfig } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui';
import { 
  Calendar, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Search, 
  Filter, 
  X,
  BarChart3,
  FoldHorizontal,
  UnfoldHorizontal,
  ZoomIn,
  ZoomOut,
  ChevronDown
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { ModalFilterRekap, MONTHS } from './modal-filter';
import { ModalDetailKaryawan, EmployeeSummaryData } from './modal-detail-karyawan';
import { formatEmployeeName, formatDepartmentName, formatPositionName } from '../utils-helper';
import { getLeavePolicies } from '../../../services/leaveService';
import { LeaveTypePolicy } from '../../../types';
import { 
  PageHeaderTitle, 
  PageHeaderSearch, 
  DesktopHeaderActions, 
  MobileHeaderActions 
} from '../../../context/MobileNavContext';
import { InitialEmptyCard } from '../../../components/ui/initial-empty-card';
import emptyRecapAnimation from '../../../assets/animations/empty-recap.json';

interface RekapitulasiProps {
  config: AttendanceConfig | null;
}

export function Rekapitulasi({ config }: RekapitulasiProps) {
  const currentMonthStr = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const currentYearStr = new Date().getFullYear().toString();

  const timeToMinutes = (time?: string | null) => {
    if (!time) return 0;
    const [h, m] = time.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [selectedYear, setSelectedYear] = useState(currentYearStr);
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showStats, setShowStats] = useState(false);

  // Adaptive Search & Filter Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedEmployeeSummary, setSelectedEmployeeSummary] = useState<EmployeeSummaryData | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [expandedCols, setExpandedCols] = useState({
    hadir: false,
    terlambat: false,
    cuti: false,
    ketidakhadiran: false
  });
  const [zoomOffset, setZoomOffset] = useState<number>(0);

  const toggleCol = (col: keyof typeof expandedCols) => {
    setExpandedCols(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const handleCollapseAll = () => {
    setExpandedCols({
      hadir: false,
      terlambat: false,
      cuti: false,
      ketidakhadiran: false
    });
  };

  const handleExpandAll = () => {
    setExpandedCols({
      hadir: true,
      terlambat: true,
      cuti: true,
      ketidakhadiran: true
    });
  };

  const handleZoomIn = () => setZoomOffset(prev => Math.min(prev + 1, 4));
  const handleZoomOut = () => setZoomOffset(prev => Math.max(prev - 1, -4));
  const handleResetZoom = () => setZoomOffset(0);

  const [leavePolicies, setLeavePolicies] = useState<LeaveTypePolicy[]>([]);
  useEffect(() => {
    getLeavePolicies().then(setLeavePolicies);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  useScrollLock(isFilterModalOpen || !!selectedEmployeeSummary);

  // Live queries
  const employees = useLiveQuery(() => db.employees.toArray()) || [];
  const attendances = useLiveQuery(() => db.attendance.toArray()) || [];
  const departments = useLiveQuery(() => db.departments.toArray()) || [];
  const positions = useLiveQuery(() => db.positions.toArray()) || [];
  const leaves = useLiveQuery(() => db.leaves.toArray()) || [];

  const deptMap = useMemo(() => new Map(departments.map(d => [d.id, d.name])), [departments]);
  const posMap = useMemo(() => new Map(positions.map(p => [p.id, p.name])), [positions]);

  const hasActiveFilters = 
    departmentFilter !== 'ALL' || 
    statusFilter !== 'ALL' || 
    selectedMonth !== currentMonthStr || 
    selectedYear !== currentYearStr;

  const handleResetFilters = () => {
    setSelectedMonth(currentMonthStr);
    setSelectedYear(currentYearStr);
    setDepartmentFilter('ALL');
    setStatusFilter('ALL');
  };

  const selectedMonthLabel = useMemo(() => {
    const found = MONTHS.find(m => m.value === selectedMonth);
    return found ? found.label : selectedMonth;
  }, [selectedMonth]);

  const absenceReasonsList = useMemo(() => {
    if (!config?.absenceReasons) return [];
    return config.absenceReasons.map(r => typeof r === 'string' ? r : r.name);
  }, [config]);

  // Filter attendance by year and month
  const targetPrefix = `${selectedYear}-${selectedMonth}`;
  const filteredAttendances = attendances.filter((att) => att.date.startsWith(targetPrefix));
  const filteredLeaves = leaves.filter((l) => (l.startDate.startsWith(targetPrefix) || l.endDate.startsWith(targetPrefix)) && l.status === 'Approved');

  // Filtered records for selected employee modal
  const selectedEmployeeAttendances = useMemo(() => {
    if (!selectedEmployeeSummary) return [];
    return filteredAttendances.filter(a => a.employeeId === selectedEmployeeSummary.employee.id);
  }, [filteredAttendances, selectedEmployeeSummary]);

  const selectedEmployeeLeaves = useMemo(() => {
    if (!selectedEmployeeSummary) return [];
    return filteredLeaves.filter(l => l.employeeId === selectedEmployeeSummary.employee.id);
  }, [filteredLeaves, selectedEmployeeSummary]);

  // Compute summary per employee
  const employeeSummaries = useMemo(() => {
    // Generate all days in the selected month
    const mStart = new Date(`${selectedYear}-${selectedMonth}-01T00:00:00`);
    const mEnd = endOfMonth(mStart);
    const daysInMonth: string[] = [];
    for (let d = new Date(mStart); d <= mEnd; d.setDate(d.getDate() + 1)) {
      daysInMonth.push(format(d, 'yyyy-MM-dd'));
    }

    const mStartStr = format(mStart, 'yyyy-MM-dd');
    const mEndStr = format(mEnd, 'yyyy-MM-dd');

    const relevantEmployees = employees.filter(emp => {
      if (emp.joinDate && emp.joinDate > mEndStr) return false;
      if (emp.status === 'Terminated' && emp.endDate && emp.endDate < mStartStr) return false;
      return true;
    });

    return relevantEmployees.map((emp) => {
      const records = filteredAttendances.filter((a) => a.employeeId === emp.id);
      const empLeaves = filteredLeaves.filter(l => l.employeeId === emp.id);
      
      let presentIn = 0;
      let presentOut = 0;
      let lateIn = 0;
      let earlyOut = 0;
      let generalAbsent = 0;
      let presentCount = 0;
      let lateCount = 0;
      let leaveCount = 0;
      let absentCount = 0;
      let totalDaysRecorded = 0;
      
      const absentDetails: Record<string, number> = {};
      absenceReasonsList.forEach(r => absentDetails[r] = 0);
      const cutiDetails: Record<string, number> = {};
      leavePolicies.forEach(p => cutiDetails[p.id] = 0);

      daysInMonth.forEach(dateStr => {
        const attRecord = records.find(r => r.date === dateStr);
        const leaveRecord = empLeaves.find(l => dateStr >= l.startDate && dateStr <= l.endDate);
        
        let currentStatus = attRecord ? attRecord.status : 'NotSet';
        if (!attRecord && leaveRecord) {
           currentStatus = 'Leave';
        }

        if (currentStatus === 'NotSet') return;
        
        totalDaysRecorded++;

        if (currentStatus === 'Present') presentCount++;
        else if (currentStatus === 'Late') lateCount++;
        else if (currentStatus === 'Leave' || currentStatus === 'Sick') leaveCount++;
        else if (currentStatus === 'Absent') absentCount++;

        if ((currentStatus === 'Present' || currentStatus === 'Late') && attRecord) {
          if (attRecord.checkIn) presentIn++;
          if (attRecord.checkOut) presentOut++;
          if (currentStatus === 'Late') lateIn++;

          if (attRecord.checkOut) {
            let expectedEnd = config?.normalEndTime;
            if (config?.systemType === 'shift' && attRecord.shiftId) {
              const shift = config?.shifts?.find(s => s.id === attRecord.shiftId);
              if (shift) expectedEnd = shift.endTime;
            }
            if (expectedEnd && timeToMinutes(attRecord.checkOut) < timeToMinutes(expectedEnd)) {
              earlyOut++;
            }
          }
        } 
        else if (currentStatus === 'Absent' && attRecord) {
          let matched = false;
          if (attRecord.notes) {
            const notesLower = attRecord.notes.toLowerCase();
            for (const r of absenceReasonsList) {
              if (notesLower.includes(r.toLowerCase())) {
                absentDetails[r]++;
                matched = true;
                break;
              }
            }
          }
          if (!matched) generalAbsent++;
        }
        else if (currentStatus === 'Leave' || currentStatus === 'Sick') {
          if (leaveRecord) {
             const matchedPolicy = leavePolicies.find(p => p.name === leaveRecord.leaveType || p.code === leaveRecord.leaveType || p.id === leaveRecord.leaveType);
             if (matchedPolicy) {
                cutiDetails[matchedPolicy.id]++;
             }
          } else if (attRecord && attRecord.notes) {
             // Fallback if marked leave manually
          }
        }
      });

      const deptName = deptMap.get(emp.departmentId) || emp.departmentId || '-';
      const posName = posMap.get(emp.positionId) || emp.positionId || '-';
      return {
        employee: emp,
        deptName,
        posName,
        presentCount,
        lateCount,
        leaveCount,
        absentCount,
        totalDaysRecorded,
        presentIn,
        presentOut,
        lateIn,
        earlyOut,
        generalAbsent,
        absentDetails,
        cutiDetails
      };
    }).filter((item) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const matchName = item.employee.fullName.toLowerCase().includes(q);
        const matchNik = item.employee.employeeId ? item.employee.employeeId.toLowerCase().includes(q) : false;
        const matchDept = item.deptName.toLowerCase().includes(q);
        const matchPos = item.posName.toLowerCase().includes(q);
        if (!matchName && !matchNik && !matchDept && !matchPos) {
          return false;
        }
      }

      // Department filter
      if (departmentFilter !== 'ALL' && item.employee.departmentId !== departmentFilter) {
        return false;
      }

      // Status / Criteria filter
      if (statusFilter === 'HADIR_PENUH' && item.presentCount <= 0) {
        return false;
      }
      if (statusFilter === 'TERLAMBAT' && item.lateCount <= 0) {
        return false;
      }
      if (statusFilter === 'CUTI' && item.leaveCount <= 0) {
        return false;
      }
      if (statusFilter === 'ALPA' && item.absentCount <= 0) {
        return false;
      }

      return true;
    });
  }, [employees, filteredAttendances, filteredLeaves, search, departmentFilter, statusFilter, deptMap, posMap, leavePolicies, absenceReasonsList, config]);

  const totalPresentAll = employeeSummaries.reduce((sum, item) => sum + item.presentCount, 0);
  const totalLateAll = employeeSummaries.reduce((sum, item) => sum + item.lateCount, 0);
  const totalLeaveAll = employeeSummaries.reduce((sum, item) => sum + item.leaveCount, 0);
  const totalAbsentAll = employeeSummaries.reduce((sum, item) => sum + item.absentCount, 0);
  const hasAnyExpanded = expandedCols.hadir || expandedCols.terlambat || expandedCols.cuti || expandedCols.ketidakhadiran;

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {/* Top Header Title with Period Selector Dropdown Subtitle */}
      <PageHeaderTitle 
        title="Rekapitulasi" 
        subtitle={
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 font-medium leading-none hover:text-blue-600 transition-colors cursor-pointer group text-left"
            title="Ganti Periode & Filter"
          >
            <span className="group-hover:text-blue-600 transition-colors">
              Periode {selectedMonthLabel} {selectedYear}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          </button>
        } 
      />

      {/* Standard Header Actions */}
      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className={`relative h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white border hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all ${
                  search || hasActiveFilters
                    ? 'border-blue-300 text-blue-600 bg-blue-50/50'
                    : 'border-slate-200 text-slate-700 hover:text-blue-600'
                }`}
                title="Cari & Filter Rekapitulasi"
              >
                <Search className="w-4 h-4 stroke-[1.8]" />
                {(search || hasActiveFilters) && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowStats(!showStats)}
                className={`h-8 w-8 sm:h-9 sm:w-9 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center ${
                  showStats
                    ? 'bg-blue-50 border-blue-400 text-blue-600 ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                title={showStats ? 'Sembunyikan Ringkasan Statistik' : 'Tampilkan Ringkasan Statistik'}
              >
                <BarChart3 className="w-4 h-4 stroke-[1.8]" />
              </button>
            </div>
          </DesktopHeaderActions>
          <MobileHeaderActions>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className={`relative h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white border hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all ${
                  search || hasActiveFilters
                    ? 'border-blue-300 text-blue-600 bg-blue-50/50'
                    : 'border-slate-200 text-slate-700 hover:text-blue-600'
                }`}
                title="Cari & Filter Rekapitulasi"
              >
                <Search className="w-4 h-4 stroke-[1.8]" />
                {(search || hasActiveFilters) && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowStats(!showStats)}
                className={`h-8 w-8 sm:h-9 sm:w-9 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center ${
                  showStats
                    ? 'bg-blue-50 border-blue-400 text-blue-600 ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                title={showStats ? 'Sembunyikan Ringkasan Statistik' : 'Tampilkan Ringkasan Statistik'}
              >
                <BarChart3 className="w-4 h-4 stroke-[1.8]" />
              </button>
            </div>
          </MobileHeaderActions>
        </>
      )}

      {/* Header Search Mode */}
      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={search}
          onSearchChange={setSearch}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Cari nama karyawan, NIK, divisi..."
          onFilterClick={() => setIsFilterModalOpen(true)}
          isFilterActive={hasActiveFilters}
        />
      )}

      {/* Active Filters Pill Bar if any filter is active */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] text-slate-500 font-medium mr-1">Filter Aktif:</span>
          {(selectedMonth !== currentMonthStr || selectedYear !== currentYearStr) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium">
              Periode: {selectedMonthLabel} {selectedYear}
              <button
                type="button"
                onClick={() => {
                  setSelectedMonth(currentMonthStr);
                  setSelectedYear(currentYearStr);
                }}
                className="hover:text-blue-900 cursor-pointer"
                title="Kembalikan ke bulan sekarang"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {departmentFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
              Dept: {deptMap.get(departmentFilter) || departmentFilter}
              <button
                type="button"
                onClick={() => setDepartmentFilter('ALL')}
                className="hover:text-emerald-900 cursor-pointer"
                title="Hapus filter departemen"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {statusFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-medium">
              Kriteria: {
                statusFilter === 'HADIR_PENUH' ? 'Hadir Terbanyak' :
                statusFilter === 'TERLAMBAT' ? 'Ada Terlambat' :
                statusFilter === 'CUTI' ? 'Ada Cuti' : 'Ada Ketidakhadiran'
              }
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className="hover:text-indigo-900 cursor-pointer"
                title="Hapus kriteria kehadiran"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] text-slate-500 hover:text-rose-600 underline ml-1 cursor-pointer font-medium"
          >
            Reset Semua
          </button>
        </div>
      )}

      {/* Aggregate Stats Cards (Toggled via Chart Icon Card) */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-1 pb-1">
              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">Total Hadir</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{totalPresentAll}</p>
                <span className="text-[10px] text-emerald-600 font-medium">Bulan Terpilih</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">Terlambat</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{totalLateAll}</p>
                <span className="text-[10px] text-amber-600 font-medium">Bulan Terpilih</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">Cuti</span>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{totalLeaveAll}</p>
                <span className="text-[10px] text-blue-600 font-medium">Bulan Terpilih</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">Ketidakhadiran</span>
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{totalAbsentAll}</p>
                <span className="text-[10px] text-red-600 font-medium">Bulan Terpilih</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {attendances.length === 0 ? (
        <div className="mt-4">
          <InitialEmptyCard
            title="Laporan & Rekapitulasi Kosong!"
            description="Belum ada data kehadiran untuk dianalisis. Data rekap akan otomatis muncul setelah karyawan mulai melakukan absensi."
            buttonText="Ke Halaman Presensi"
            ButtonIcon={UserCheck}
            onAction={() => window.location.href = '/attendance/presensi'}
            animationData={emptyRecapAnimation}
          />
        </div>
      ) : (
      <Card className="border-slate-200 shadow-2xs overflow-hidden">
        <CardContent className="p-0">
          {/* Card Info & Toolbar: Expand/Collapse All + Zoom Controls */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/90 px-3 py-2 border-b border-slate-200 font-medium">
            <div className="flex items-center gap-1.5">
              <span>Klik Header Kolom untuk memperluas rincian</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 border-r border-slate-300 pr-2 mr-0.5">
                <button 
                  type="button"
                  onClick={handleCollapseAll} 
                  className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors cursor-pointer" 
                  title="Ringkas Semua Kolom"
                >
                  <FoldHorizontal className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button"
                  onClick={handleExpandAll} 
                  className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors cursor-pointer" 
                  title="Perluas Semua Kolom"
                >
                  <UnfoldHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-0.5">
                <button 
                  type="button"
                  onClick={handleZoomOut} 
                  disabled={zoomOffset <= -4}
                  className="p-1 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-slate-600 transition-colors cursor-pointer" 
                  title="Perkecil Skala Kolom & Teks"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-slate-200 px-1.5 py-0.5 rounded transition-colors cursor-pointer min-w-[34px] text-center"
                  title="Klik untuk reset skala 100%"
                >
                  {Math.round(((11.5 + zoomOffset * 1) / 11.5) * 100)}%
                </button>
                <button 
                  type="button"
                  onClick={handleZoomIn} 
                  disabled={zoomOffset >= 4}
                  className="p-1 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-slate-600 transition-colors cursor-pointer" 
                  title="Perbesar Skala Kolom & Teks"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Scaling Styles */}
          {(() => {
            const tableFontSize = 11.5 + zoomOffset * 1;
            const tablePx = Math.max(3, Math.round(11 + zoomOffset * 1.8));
            const tablePy = Math.max(2, Math.round(9 + zoomOffset * 1.3));
            const tableSubPx = Math.max(2, Math.round(7 + zoomOffset * 1.1));
            const tableSubPy = Math.max(2, Math.round(5 + zoomOffset * 0.8));
            const colEmpWidth = Math.max(85, Math.round(135 + zoomOffset * 14));
            const colDeptWidth = Math.max(85, Math.round(135 + zoomOffset * 14));

            return (
              <div className="overflow-x-auto">
                <table 
                  className="w-full text-left border-collapse" 
                  style={{ 
                    fontSize: `${tableFontSize}px`,
                    '--tbl-px': `${tablePx}px`,
                    '--tbl-py': `${tablePy}px`,
                    '--tbl-sub-px': `${tableSubPx}px`,
                    '--tbl-sub-py': `${tableSubPy}px`,
                    '--col-emp-w': `${colEmpWidth}px`,
                    '--col-dept-w': `${colDeptWidth}px`
                  } as React.CSSProperties}
                >
                  <thead>
                    {!hasAnyExpanded ? (
                      /* 1-Line Header saat semua kolom diringkas / default (tanpa sel sub-kolom atau baris 'Total') */
                      <tr className="bg-slate-50 border-b border-slate-200 text-[1em] font-semibold text-slate-600">
                        <th 
                          className="sticky left-0 bg-slate-50 z-10 border-r border-slate-200 shadow-2xs whitespace-nowrap overflow-hidden"
                          style={{ padding: 'var(--tbl-py) var(--tbl-px)', width: 'var(--col-emp-w)', minWidth: 'var(--col-emp-w)', maxWidth: 'var(--col-emp-w)' }}
                        >
                          Karyawan
                        </th>
                        <th 
                          className="border-r border-slate-200 whitespace-nowrap overflow-hidden"
                          style={{ padding: 'var(--tbl-py) var(--tbl-px)', width: 'var(--col-dept-w)', minWidth: 'var(--col-dept-w)', maxWidth: 'var(--col-dept-w)' }}
                        >
                          <div>Departemen</div>
                          <div className="text-[0.9em] text-slate-400 font-normal">Posisi</div>
                        </th>
                        <th 
                          className="text-center whitespace-nowrap border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                          style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                          onClick={() => toggleCol('hadir')}
                          title="Klik untuk melihat rincian Hadir (Masuk / Pulang)"
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>Hadir</span>
                            <ChevronDown 
                              className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                                expandedCols.hadir 
                                  ? 'rotate-180 text-emerald-700' 
                                  : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                              }`} 
                            />
                          </div>
                        </th>
                        <th 
                          className="text-center whitespace-nowrap border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                          style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                          onClick={() => toggleCol('terlambat')}
                          title="Klik untuk melihat rincian Terlambat (Masuk / Pulang Cepat)"
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>Terlambat</span>
                            <ChevronDown 
                              className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                                expandedCols.terlambat 
                                  ? 'rotate-180 text-amber-700' 
                                  : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                              }`} 
                            />
                          </div>
                        </th>
                        <th 
                          className="text-center whitespace-nowrap border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                          style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                          onClick={() => toggleCol('cuti')}
                          title="Klik untuk melihat rincian Cuti per Kebijakan"
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>Cuti</span>
                            <ChevronDown 
                              className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                                expandedCols.cuti 
                                  ? 'rotate-180 text-blue-700' 
                                  : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                              }`} 
                            />
                          </div>
                        </th>
                        <th 
                          className="text-center whitespace-nowrap border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                          style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                          onClick={() => toggleCol('ketidakhadiran')}
                          title="Klik untuk melihat rincian Alasan Ketidakhadiran"
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>Ketidakhadiran</span>
                            <ChevronDown 
                              className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                                expandedCols.ketidakhadiran 
                                  ? 'rotate-180 text-rose-700' 
                                  : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                              }`} 
                            />
                          </div>
                        </th>
                        <th 
                          className="text-center whitespace-nowrap"
                          style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                        >
                          Total Hari
                        </th>
                      </tr>
                    ) : (
                      /* 2-Line Header saat ada minimal satu kolom yang diperluas */
                      <>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[1em] font-semibold text-slate-600">
                          <th 
                            className="sticky left-0 bg-slate-50 z-10 border-r border-slate-200 shadow-2xs whitespace-nowrap overflow-hidden" 
                            style={{ padding: 'var(--tbl-py) var(--tbl-px)', width: 'var(--col-emp-w)', minWidth: 'var(--col-emp-w)', maxWidth: 'var(--col-emp-w)' }}
                            rowSpan={2}
                          >
                            Karyawan
                          </th>
                          <th 
                            className="border-r border-slate-200 whitespace-nowrap overflow-hidden" 
                            style={{ padding: 'var(--tbl-py) var(--tbl-px)', width: 'var(--col-dept-w)', minWidth: 'var(--col-dept-w)', maxWidth: 'var(--col-dept-w)' }}
                            rowSpan={2}
                          >
                            <div>Departemen</div>
                            <div className="text-[0.9em] text-slate-400 font-normal">Posisi</div>
                          </th>
                          <th 
                            className={`text-center whitespace-nowrap border-r border-slate-200 cursor-pointer transition-colors group select-none ${
                              expandedCols.hadir ? 'bg-emerald-50/80 text-emerald-950 font-bold border-b border-emerald-200' : 'hover:bg-slate-100'
                            }`}
                            style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                            colSpan={expandedCols.hadir ? 3 : 1}
                            rowSpan={expandedCols.hadir ? 1 : 2}
                            onClick={() => toggleCol('hadir')}
                            title={expandedCols.hadir ? 'Klik untuk meringkas' : 'Klik untuk memperluas'}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <span>Hadir</span>
                              <ChevronDown 
                                className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                                  expandedCols.hadir 
                                    ? 'rotate-180 text-emerald-700' 
                                    : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                                }`} 
                              />
                            </div>
                          </th>
                          <th 
                            className={`text-center whitespace-nowrap border-r border-slate-200 cursor-pointer transition-colors group select-none ${
                              expandedCols.terlambat ? 'bg-amber-50/80 text-amber-950 font-bold border-b border-amber-200' : 'hover:bg-slate-100'
                            }`}
                            style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                            colSpan={expandedCols.terlambat ? 3 : 1}
                            rowSpan={expandedCols.terlambat ? 1 : 2}
                            onClick={() => toggleCol('terlambat')}
                            title={expandedCols.terlambat ? 'Klik untuk meringkas' : 'Klik untuk memperluas'}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <span>Terlambat</span>
                              <ChevronDown 
                                className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                                  expandedCols.terlambat 
                                    ? 'rotate-180 text-amber-700' 
                                    : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                                }`} 
                              />
                            </div>
                          </th>
                          <th 
                            className={`text-center whitespace-nowrap border-r border-slate-200 cursor-pointer transition-colors group select-none ${
                              expandedCols.cuti ? 'bg-blue-50/80 text-blue-950 font-bold border-b border-blue-200' : 'hover:bg-slate-100'
                            }`}
                            style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                            colSpan={expandedCols.cuti ? leavePolicies.length + 1 : 1}
                            rowSpan={expandedCols.cuti ? 1 : 2}
                            onClick={() => toggleCol('cuti')}
                            title={expandedCols.cuti ? 'Klik untuk meringkas' : 'Klik untuk memperluas'}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <span>Cuti</span>
                              <ChevronDown 
                                className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                                  expandedCols.cuti 
                                    ? 'rotate-180 text-blue-700' 
                                    : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                                }`} 
                              />
                            </div>
                          </th>
                          <th 
                            className={`text-center whitespace-nowrap border-r border-slate-200 cursor-pointer transition-colors group select-none ${
                              expandedCols.ketidakhadiran ? 'bg-rose-50/80 text-rose-950 font-bold border-b border-rose-200' : 'hover:bg-slate-100'
                            }`}
                            style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                            colSpan={expandedCols.ketidakhadiran ? absenceReasonsList.length + 2 : 1}
                            rowSpan={expandedCols.ketidakhadiran ? 1 : 2}
                            onClick={() => toggleCol('ketidakhadiran')}
                            title={expandedCols.ketidakhadiran ? 'Klik untuk meringkas' : 'Klik untuk memperluas'}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <span>Ketidakhadiran</span>
                              <ChevronDown 
                                className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out shrink-0 stroke-[1.5] ${
                                  expandedCols.ketidakhadiran 
                                    ? 'rotate-180 text-rose-700' 
                                    : 'rotate-0 text-slate-400 group-hover:text-slate-600'
                                }`} 
                              />
                            </div>
                          </th>
                          <th 
                            className="text-center whitespace-nowrap" 
                            style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                            rowSpan={2}
                          >
                            Total Hari
                          </th>
                        </tr>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[1em] font-semibold text-slate-600">
                          {/* Hadir Sub-columns (hanya dirender jika diperluas) */}
                          {expandedCols.hadir && (
                            <>
                              <th 
                                className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-emerald-50/60 font-semibold text-emerald-900"
                                style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                              >
                                Masuk
                              </th>
                              <th 
                                className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-emerald-50/60 font-semibold text-emerald-900"
                                style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                              >
                                Pulang
                              </th>
                              <th 
                                className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-emerald-100/70 font-bold text-emerald-950"
                                style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                              >
                                Total
                              </th>
                            </>
                          )}

                          {/* Terlambat Sub-columns (hanya dirender jika diperluas) */}
                          {expandedCols.terlambat && (
                            <>
                              <th 
                                className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-amber-50/60 font-semibold text-amber-900"
                                style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                              >
                                Masuk
                              </th>
                              <th 
                                className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-amber-50/60 font-semibold text-amber-900"
                                style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                              >
                                Pulang Cepat
                              </th>
                              <th 
                                className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-amber-100/70 font-bold text-amber-950"
                                style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                              >
                                Total
                              </th>
                            </>
                          )}

                          {/* Cuti Sub-columns (hanya dirender jika diperluas) */}
                          {expandedCols.cuti && (
                            <>
                              {leavePolicies.map(p => (
                                <th 
                                  key={p.id} 
                                  className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-blue-50/60 font-semibold text-blue-900"
                                  style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                                >
                                  {p.name}
                                </th>
                              ))}
                              <th 
                                className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-blue-100/70 font-bold text-blue-950"
                                style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                              >
                                Total
                              </th>
                            </>
                          )}

                          {/* Ketidakhadiran Sub-columns (hanya dirender jika diperluas) */}
                          {expandedCols.ketidakhadiran && (
                            <>
                              {absenceReasonsList.map(r => (
                                <th 
                                  key={r} 
                                  className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-red-50/60 font-semibold text-red-900"
                                  style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                                >
                                  {r}
                                </th>
                              ))}
                              <th 
                                className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-red-50/60 font-semibold text-red-900"
                                style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                              >
                                Lainnya
                              </th>
                              <th 
                                className="text-center whitespace-nowrap border-r border-slate-200 text-[0.9em] bg-red-100/70 font-bold text-red-950"
                                style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                              >
                                Total
                              </th>
                            </>
                          )}
                        </tr>
                      </>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employeeSummaries.length === 0 ? (
                      <tr>
                        <td 
                          colSpan={7 + (expandedCols.hadir ? 2 : 0) + (expandedCols.terlambat ? 2 : 0) + (expandedCols.cuti ? leavePolicies.length : 0) + (expandedCols.ketidakhadiran ? absenceReasonsList.length + 1 : 0)} 
                          className="p-8 text-center text-slate-400 text-xs"
                        >
                          Tidak ada data karyawan yang sesuai dengan kriteria pencarian / filter.
                        </td>
                      </tr>
                    ) : (
                      employeeSummaries.map((summary) => {
                        const displayName = formatEmployeeName(summary.employee.fullName);
                        const displayDept = formatDepartmentName(summary.deptName || '-');
                        const displayOnlyPos = formatPositionName(summary.posName || 'Staff');
                        const empIdDisplay = summary.employee.employeeId || summary.employee.id || '-';

                        return (
                          <tr 
                            key={summary.employee.id} 
                            onClick={() => setSelectedEmployeeSummary(summary)}
                            className="group hover:bg-blue-50/50 transition-colors cursor-pointer"
                            title={`Klik untuk melihat detail rekap presensi ${displayName}`}
                          >
                            <td 
                              className="sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r border-slate-200 shadow-2xs overflow-hidden"
                              style={{ padding: 'var(--tbl-py) var(--tbl-px)', width: 'var(--col-emp-w)', minWidth: 'var(--col-emp-w)', maxWidth: 'var(--col-emp-w)' }}
                            >
                              <div className="text-[0.9em] text-slate-500 font-normal overflow-hidden text-clip whitespace-nowrap" title={empIdDisplay}>
                                {empIdDisplay}
                              </div>
                              <div className="font-bold text-slate-900 text-[1.05em] overflow-hidden text-clip whitespace-nowrap mt-0.5" title={summary.employee.fullName}>
                                {displayName}
                              </div>
                            </td>
                            <td 
                              className="overflow-hidden border-r border-slate-200"
                              style={{ padding: 'var(--tbl-py) var(--tbl-px)', width: 'var(--col-dept-w)', minWidth: 'var(--col-dept-w)', maxWidth: 'var(--col-dept-w)' }}
                            >
                              <div className="text-[0.9em] text-slate-500 font-normal overflow-hidden text-clip whitespace-nowrap" title={summary.deptName}>
                                {displayDept}
                              </div>
                              <div className="font-bold text-slate-900 text-[1.05em] overflow-hidden text-clip whitespace-nowrap mt-0.5" title={summary.posName}>
                                {displayOnlyPos}
                              </div>
                            </td>

                            {/* Hadir */}
                            {expandedCols.hadir && (
                              <>
                                <td 
                                  className="text-center border-r border-slate-200"
                                  style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                                >
                                  <span className="font-medium text-slate-600">{summary.presentIn || '-'}</span>
                                </td>
                                <td 
                                  className="text-center border-r border-slate-200"
                                  style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                                >
                                  <span className="font-medium text-slate-600">{summary.presentOut || '-'}</span>
                                </td>
                              </>
                            )}
                            <td 
                              className={`text-center border-r border-slate-200 ${expandedCols.hadir ? 'bg-slate-50' : ''}`}
                              style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                            >
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[1em]">
                                {summary.presentCount}
                              </span>
                            </td>

                            {/* Terlambat */}
                            {expandedCols.terlambat && (
                              <>
                                <td 
                                  className="text-center border-r border-slate-200"
                                  style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                                >
                                  <span className="font-medium text-slate-600">{summary.lateIn || '-'}</span>
                                </td>
                                <td 
                                  className="text-center border-r border-slate-200"
                                  style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                                >
                                  <span className="font-medium text-slate-600">{summary.earlyOut || '-'}</span>
                                </td>
                              </>
                            )}
                            <td 
                              className={`text-center border-r border-slate-200 ${expandedCols.terlambat ? 'bg-slate-50' : ''}`}
                              style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                            >
                              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[1em]">
                                {summary.lateCount}
                              </span>
                            </td>

                            {/* Cuti */}
                            {expandedCols.cuti && leavePolicies.map(p => (
                              <td 
                                key={p.id} 
                                className="text-center border-r border-slate-200"
                                style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                              >
                                <span className="font-medium text-slate-600">{summary.cutiDetails[p.id] || '-'}</span>
                              </td>
                            ))}
                            <td 
                              className={`text-center border-r border-slate-200 ${expandedCols.cuti ? 'bg-slate-50' : ''}`}
                              style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                            >
                              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[1em]">
                                {summary.leaveCount}
                              </span>
                            </td>

                            {/* Ketidakhadiran */}
                            {expandedCols.ketidakhadiran && absenceReasonsList.map(r => (
                              <td 
                                key={r} 
                                className="text-center border-r border-slate-200"
                                style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                              >
                                <span className="font-medium text-slate-600">{summary.absentDetails[r] || '-'}</span>
                              </td>
                            ))}
                            {expandedCols.ketidakhadiran && (
                              <td 
                                className="text-center border-r border-slate-200"
                                style={{ padding: 'var(--tbl-sub-py) var(--tbl-sub-px)' }}
                              >
                                <span className="font-medium text-slate-600">{summary.generalAbsent || '-'}</span>
                              </td>
                            )}
                            <td 
                              className={`text-center border-r border-slate-200 ${expandedCols.ketidakhadiran ? 'bg-slate-50' : ''}`}
                              style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                            >
                              <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded text-[1em]">
                                {summary.absentCount}
                              </span>
                            </td>

                            <td 
                              className="text-center font-bold text-slate-700 text-[1em] whitespace-nowrap"
                              style={{ padding: 'var(--tbl-py) var(--tbl-px)' }}
                            >
                              {summary.totalDaysRecorded} Hari
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </CardContent>
      </Card>
      )}

      {/* Modal / Bottom Sheet Filter */}
      <ModalFilterRekap
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        departments={departments}
        hasActiveFilters={hasActiveFilters}
        onReset={handleResetFilters}
      />

      {/* Modal Rincian Rekap Presensi Karyawan */}
      {selectedEmployeeSummary && (
        <ModalDetailKaryawan
          isOpen={!!selectedEmployeeSummary}
          onClose={() => setSelectedEmployeeSummary(null)}
          summary={selectedEmployeeSummary}
          attendances={selectedEmployeeAttendances}
          leaves={selectedEmployeeLeaves}
          selectedMonthLabel={selectedMonthLabel}
          selectedYear={selectedYear}
          leavePolicies={leavePolicies}
          config={config}
        />
      )}
    </div>
  );
}

