import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { format, endOfMonth } from 'date-fns';
import { AttendanceConfig, LeaveTypePolicy } from '../../types';
import {
  UserCheck,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  X,
  BarChart3,
  ChevronDown,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useScrollLock } from '../../hooks/use-scroll-lock';
import { ModalFilterRekap, MONTHS } from './modal-rekap-filter';
import { ModalDetailKaryawan, EmployeeSummaryData } from './modal-rekap-detail-karyawan';
import { RekapitulasiTable, ExpandedColsState } from './rekapitulasi-table';
import { getLeavePolicies } from '../../services/leave-service';
import {
  PageHeaderTitle,
  PageHeaderSearch,
  DesktopHeaderActions,
  MobileHeaderActions,
} from '../../context/mobile-nav-context';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyRecapAnimation from '../../assets/animations/empty-recap.json';

interface RekapitulasiProps {
  config: AttendanceConfig | null;
}

export function Rekapitulasi({ config }: RekapitulasiProps) {
  const navigate = useNavigate();
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

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedEmployeeSummary, setSelectedEmployeeSummary] = useState<EmployeeSummaryData | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [expandedCols, setExpandedCols] = useState<ExpandedColsState>({
    hadir: false,
    terlambat: false,
    cuti: false,
    ketidakhadiran: false,
  });
  const [zoomOffset, setZoomOffset] = useState<number>(0);

  const toggleCol = (col: keyof ExpandedColsState) => {
    setExpandedCols(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const handleCollapseAll = () => {
    setExpandedCols({
      hadir: false,
      terlambat: false,
      cuti: false,
      ketidakhadiran: false,
    });
  };

  const handleExpandAll = () => {
    setExpandedCols({
      hadir: true,
      terlambat: true,
      cuti: true,
      ketidakhadiran: true,
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
    return config.absenceReasons.map(r => (typeof r === 'string' ? r : r.name));
  }, [config]);

  const targetPrefix = `${selectedYear}-${selectedMonth}`;
  const filteredAttendances = useMemo(
    () => attendances.filter(att => att.date.startsWith(targetPrefix)),
    [attendances, targetPrefix]
  );
  const filteredLeaves = useMemo(
    () =>
      leaves.filter(
        l => (l.startDate.startsWith(targetPrefix) || l.endDate.startsWith(targetPrefix)) && l.status === 'Approved'
      ),
    [leaves, targetPrefix]
  );

  const selectedEmployeeAttendances = useMemo(() => {
    if (!selectedEmployeeSummary) return [];
    return filteredAttendances.filter(a => a.employeeId === selectedEmployeeSummary.employee.id);
  }, [filteredAttendances, selectedEmployeeSummary]);

  const selectedEmployeeLeaves = useMemo(() => {
    if (!selectedEmployeeSummary) return [];
    return filteredLeaves.filter(l => l.employeeId === selectedEmployeeSummary.employee.id);
  }, [filteredLeaves, selectedEmployeeSummary]);

  const employeeSummaries = useMemo(() => {
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

    return relevantEmployees
      .map((emp): EmployeeSummaryData => {
        const records = filteredAttendances.filter(a => a.employeeId === emp.id);
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
        absenceReasonsList.forEach(r => {
          absentDetails[r] = 0;
        });
        const cutiDetails: Record<string, number> = {};
        leavePolicies.forEach(p => {
          cutiDetails[p.id] = 0;
        });

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
          } else if (currentStatus === 'Absent' && attRecord) {
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
          } else if (currentStatus === 'Leave' || currentStatus === 'Sick') {
            if (leaveRecord) {
              const matchedPolicy = leavePolicies.find(
                p => p.name === leaveRecord.leaveType || p.code === leaveRecord.leaveType || p.id === leaveRecord.leaveType
              );
              if (matchedPolicy) {
                cutiDetails[matchedPolicy.id]++;
              }
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
          cutiDetails,
        };
      })
      .filter(item => {
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

        if (departmentFilter !== 'ALL' && item.employee.departmentId !== departmentFilter) {
          return false;
        }

        if (statusFilter === 'HADIR_PENUH' && item.presentCount <= 0) return false;
        if (statusFilter === 'TERLAMBAT' && item.lateCount <= 0) return false;
        if (statusFilter === 'CUTI' && item.leaveCount <= 0) return false;
        if (statusFilter === 'ALPA' && item.absentCount <= 0) return false;

        return true;
      });
  }, [
    employees,
    filteredAttendances,
    filteredLeaves,
    search,
    departmentFilter,
    statusFilter,
    deptMap,
    posMap,
    leavePolicies,
    absenceReasonsList,
    config,
    selectedMonth,
    selectedYear,
  ]);

  const totalPresentAll = employeeSummaries.reduce((sum, item) => sum + item.presentCount, 0);
  const totalLateAll = employeeSummaries.reduce((sum, item) => sum + item.lateCount, 0);
  const totalLeaveAll = employeeSummaries.reduce((sum, item) => sum + item.leaveCount, 0);
  const totalAbsentAll = employeeSummaries.reduce((sum, item) => sum + item.absentCount, 0);

  const actionButtons = (
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
  );

  return (
    <div className="w-full flex-1 flex flex-col space-y-2 sm:space-y-2.5">
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

      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{actionButtons}</DesktopHeaderActions>
          <MobileHeaderActions>{actionButtons}</MobileHeaderActions>
        </>
      )}

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
              Kriteria:{' '}
              {statusFilter === 'HADIR_PENUH'
                ? 'Hadir Terbanyak'
                : statusFilter === 'TERLAMBAT'
                  ? 'Ada Terlambat'
                  : statusFilter === 'CUTI'
                    ? 'Ada Cuti'
                    : 'Ada Ketidakhadiran'}
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
        <div className="mt-2 w-full flex-1 flex flex-col">
          <InitialEmptyCard
            title="Laporan & Rekapitulasi Kosong!"
            description="Belum ada data kehadiran untuk dianalisis. Data rekap akan otomatis muncul setelah karyawan mulai melakukan absensi."
            buttonText="Ke Halaman Presensi"
            ButtonIcon={UserCheck}
            onAction={() => navigate('/presensi')}
            animationData={emptyRecapAnimation}
          />
        </div>
      ) : (
        <RekapitulasiTable
          employeeSummaries={employeeSummaries}
          expandedCols={expandedCols}
          toggleCol={toggleCol}
          handleCollapseAll={handleCollapseAll}
          handleExpandAll={handleExpandAll}
          zoomOffset={zoomOffset}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
          leavePolicies={leavePolicies}
          absenceReasonsList={absenceReasonsList}
          onSelectEmployee={setSelectedEmployeeSummary}
        />
      )}

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

export const RekapitulasiPage = Rekapitulasi;
export default Rekapitulasi;
