import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  CalendarDays, 
  Calendar,
  RotateCcw,
  Search, 
  X, 
  Filter, 
  Settings, 
  ClockPlus, 
  ArrowRightLeft, 
  ZoomIn, 
  ZoomOut, 
  ChevronDown,
  Pencil,
  User,
  Clock,
  Building2,
  Briefcase
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/database';
import { AttendanceConfig, WorkShift, ShiftSchedule, Employee, ShiftSwapType, ShiftSwapInitiator } from '../../../types';
import { Button, Input } from '../../../components/ui';
import { createShiftSwap, validateGantiShift, validateTukarShift, validateTukarOff } from '../../../services/shiftService';
import { getEffectiveShiftForEmployee } from '../../../services/rosterService';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { 
  PageHeaderTitle, 
  PageHeaderSearch, 
  DesktopHeaderActions, 
  MobileHeaderActions 
} from '../../../context/MobileNavContext';
import { InitialEmptyCard } from '../../../components/ui/initial-empty-card';
import emptyScheduleAnimation from '../../../assets/animations/empty-schedule.json';
import { ModalForm as ShiftSwapModalForm } from './modal-pertukaran-form';
import { formatHariTanggalIndo, isSameShiftType } from './utils-pertukaran-helper';
import { ModalMatrixCellDetail } from './modal-matrix-cell-detail';
import { ModalMatrixFilter } from './modal-matrix-filter';

// Calculate default date range from current day until end of current month
const getDefaultMonthDates = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  const formatYMD = (year: number, monthIdx: number, day: number) => {
    const mm = String(monthIdx + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const start = formatYMD(y, m, d);
  const lastDay = new Date(y, m + 1, 0).getDate();
  const end = formatYMD(y, m, lastDay);
  return { start, end };
};

// Format date for display in Indonesian on static cards
const formatDisplayDateIndo = (dateStr: string) => {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  if (!m || m < 1 || m > 12) return dateStr;
  return `${d} ${monthNames[m - 1]} ${y}`;
};

interface Props {
  activeConfig: AttendanceConfig | null;
  availableShifts: WorkShift[];
  getShiftBadge: (shiftId: string, shiftNameStr?: string) => React.ReactNode;
  onOpenSettings?: () => void;
  onOpenLembur?: () => void;
  onOpenTukarShift?: () => void;
  onOpenTambahShift?: () => void;
}

export function JadwalMatriks({ 
  activeConfig, 
  availableShifts, 
  getShiftBadge, 
  onOpenSettings, 
  onOpenLembur,
  onOpenTukarShift,
  onOpenTambahShift 
}: Props) {
  const isNormalMode = (activeConfig?.systemType || 'normal') === 'normal';
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Pending counts for buttons
  const pendingSwapsCount = useLiveQuery(async () => {
    try {
      if (!db.shiftSwaps) return 0;
      const swaps = await db.shiftSwaps.toArray();
      return swaps.filter(s => s.status === 'Pending').length;
    } catch {
      return 0;
    }
  }) || 0;

  const pendingExtrasCount = useLiveQuery(async () => {
    try {
      if (!db.extraShifts) return 0;
      const extras = await db.extraShifts.toArray();
      return extras.filter(e => e.status === 'Pending').length;
    } catch {
      return 0;
    }
  }) || 0;
  
  // Calculate default tracking range: current date to the end of the current month
  const defaultMonthRange = useMemo(() => getDefaultMonthDates(), []);

  const [startDate, setStartDate] = useState(defaultMonthRange.start);
  const [endDate, setEndDate] = useState(defaultMonthRange.end);
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [zoomOffset, setZoomOffset] = useState<number>(0);

  const handleZoomIn = () => setZoomOffset(prev => Math.min(prev + 1, 4));
  const handleZoomOut = () => setZoomOffset(prev => Math.max(prev - 1, -4));
  const handleResetZoom = () => setZoomOffset(0);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // View Cell Detail Modal State (View-first modal)
  const [viewCellDetail, setViewCellDetail] = useState<{
    employee: Employee;
    date: string;
    shiftId: string;
    shiftName: string;
    cellInfo: any;
  } | null>(null);

  // Shift Swap Modal State (Triggered by Pencil icon from View Modal)
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapType, setSwapType] = useState<ShiftSwapType>('ganti_shift');
  const [initiator, setInitiator] = useState<ShiftSwapInitiator>('Employee');
  const [selectedEmp1, setSelectedEmp1] = useState('');
  const [date1, setDate1] = useState(todayStr);
  const [selectedEmp2, setSelectedEmp2] = useState('');
  const [date2, setDate2] = useState(todayStr);
  const [isSameDateTukarShift, setIsSameDateTukarShift] = useState(false);
  const [targetShiftChoice, setTargetShiftChoice] = useState('');
  const [gantiShiftTargetDate, setGantiShiftTargetDate] = useState(todayStr);
  const [swapReason, setSwapReason] = useState('');
  const [showCategoryInfo, setShowCategoryInfo] = useState(false);
  const [showTukarOffRules, setShowTukarOffRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmp1Locked, setIsEmp1Locked] = useState(true);

  // Live queries from Dexie DB
  const employees = useLiveQuery(async () => {
    try {
      return await db.employees.toArray();
    } catch {
      return [];
    }
  }) || [];

  const departments = useLiveQuery(async () => {
    try {
      return await db.departments.toArray();
    } catch {
      return [];
    }
  }) || [];

  const positions = useLiveQuery(async () => {
    try {
      return await db.positions.toArray();
    } catch {
      return [];
    }
  }) || [];

  const shiftSchedules = useLiveQuery(
    async () => {
      try {
        if (!db.shiftSchedules) return [];
        return await db.shiftSchedules.filter(s => s.date >= startDate && s.date <= endDate).toArray();
      } catch {
        return [];
      }
    },
    [startDate, endDate]
  ) || [];

  const allCustomSchedules = useLiveQuery(async () => {
    try {
      if (!db.shiftSchedules) return [];
      return await db.shiftSchedules.toArray();
    } catch {
      return [];
    }
  }) || [];

  // Maps for efficient lookups
  const empMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);
  const deptMap = useMemo(() => new Map(departments.map(d => [d.id, d.name])), [departments]);
  const posMap = useMemo(() => new Map(positions.map(p => [p.id, p.name])), [positions]);

  const customSchedulesMap = useMemo(() => {
    const map = new Map<string, ShiftSchedule>();
    allCustomSchedules.forEach(s => {
      map.set(`${s.employeeId}_${s.date}`, s);
    });
    return map;
  }, [allCustomSchedules]);

  // Detected shifts for Swap modal
  const emp1Obj = useMemo(() => empMap.get(selectedEmp1), [empMap, selectedEmp1]);
  const detectedShift1 = useMemo(() => {
    if (!emp1Obj || !date1) return null;
    return getEffectiveShiftForEmployee(emp1Obj, date1, activeConfig || null, customSchedulesMap);
  }, [emp1Obj, date1, activeConfig, customSchedulesMap]);

  const emp2Obj = useMemo(() => empMap.get(selectedEmp2), [empMap, selectedEmp2]);
  const detectedShift2Peer = useMemo(() => {
    if (!emp2Obj || !date2 || (swapType !== 'tukar_shift' && swapType !== 'peer_to_peer')) return null;
    return getEffectiveShiftForEmployee(emp2Obj, date2, activeConfig || null, customSchedulesMap);
  }, [emp2Obj, date2, swapType, activeConfig, customSchedulesMap]);

  const detectedShift2Self = useMemo(() => {
    if (!emp1Obj || !date2 || (swapType !== 'tukar_off' && swapType !== 'self_date_swap')) return null;
    return getEffectiveShiftForEmployee(emp1Obj, date2, activeConfig || null, customSchedulesMap);
  }, [emp1Obj, date2, swapType, activeConfig, customSchedulesMap]);

  const employeesForEmp2 = useMemo(() => {
    return employees.filter(emp => emp.id !== selectedEmp1);
  }, [employees, selectedEmp1]);

  const isHasIdenticalShiftError = useMemo(() => {
    if ((swapType === 'tukar_shift' || swapType === 'peer_to_peer') && detectedShift1 && detectedShift2Peer) {
      return isSameShiftType(detectedShift1, detectedShift2Peer);
    }
    return false;
  }, [swapType, detectedShift1, detectedShift2Peer]);

  const tukarOffShiftList = useMemo(() => {
    const activeWorkingShifts = availableShifts.filter(s => !s.isOff && s.id !== 'OFF' && s.name.toLowerCase() !== 'off' && !s.name.toLowerCase().includes('libur'));
    const isDate1Off = detectedShift1?.isOff || detectedShift1?.shiftId === 'OFF';

    if (!isDate1Off) {
      return activeWorkingShifts.filter(s => {
        if (detectedShift2Self) {
          const sObj = { shiftId: s.id, shiftName: s.name, code: s.code || s.id, isOff: s.isOff };
          if (isSameShiftType(sObj, detectedShift2Self)) return false;
        }
        return true;
      });
    }
    return activeWorkingShifts;
  }, [availableShifts, detectedShift1, detectedShift2Self]);

  const filteredGantiShifts = useMemo(() => {
    return availableShifts.filter(s => {
      if (s.id === 'OFF' || s.isOff || s.name.toLowerCase() === 'off' || s.name.toLowerCase().includes('libur')) {
        return false;
      }
      if (detectedShift1) {
        if (s.id === detectedShift1.shiftId) return false;
        if (detectedShift1.shiftName && s.name.toLowerCase() === detectedShift1.shiftName.toLowerCase()) return false;
      }
      return true;
    });
  }, [availableShifts, detectedShift1]);

  useEffect(() => {
    if (swapType === 'ganti_shift' || swapType === 'direct_shift_change') {
      if (targetShiftChoice && !filteredGantiShifts.some(s => s.id === targetShiftChoice)) {
        setTargetShiftChoice('');
      }
    }
  }, [swapType, targetShiftChoice, filteredGantiShifts]);

  useEffect(() => {
    if (swapType === 'tukar_off' || swapType === 'self_date_swap') {
      if (targetShiftChoice && !tukarOffShiftList.some(s => s.id === targetShiftChoice)) {
        setTargetShiftChoice('');
      }
    }
  }, [swapType, targetShiftChoice, tukarOffShiftList]);

  // Format short name: if > 2 words (e.g. "Alvareza Hilka Pratama"), trim to first 2 words ("Alvareza Hilka")
  const formatEmployeeName = (fullName: string) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length > 2) {
      return parts.slice(0, 2).join(' ');
    }
    return fullName;
  };

  // Format position name: single line, trim if > 2 words
  const formatPositionName = (posName: string) => {
    if (!posName) return 'Staff';
    const parts = posName.trim().split(/\s+/);
    if (parts.length > 2) {
      return parts.slice(0, 2).join(' ');
    }
    return posName;
  };

  // Lock body scroll when modals are open
  useScrollLock(Boolean(viewCellDetail || isSwapModalOpen || isFilterOpen));

  // Matrix of Dates in Range
  const dateRangeList = useMemo(() => {
    const list: string[] = [];
    if (!startDate || !endDate) return list;
    let curr = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    while (curr <= end && count < 62) {
      list.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + 1);
      count++;
    }
    return list;
  }, [startDate, endDate]);

  // Cell Schedule Lookup Map: `${employeeId}_${date}` -> ShiftSchedule
  const scheduleLookup = useMemo(() => {
    const map = new Map<string, ShiftSchedule>();
    shiftSchedules.forEach(s => {
      map.set(`${s.employeeId}_${s.date}`, s);
    });
    return map;
  }, [shiftSchedules]);

  // Helper calculation for cell shift info using continuous rotation projection
  const getCellShiftInfo = (emp: any, dateStr: string) => {
    return getEffectiveShiftForEmployee(emp, dateStr, activeConfig, scheduleLookup);
  };

  // Filtered employees
  const activeEmployees = useMemo(() => {
    return employees.filter(e => {
      if (e.status === 'Terminated') return false;
      if (departmentFilter !== 'ALL' && e.departmentId !== departmentFilter) return false;
      if (search && !e.fullName.toLowerCase().includes(search.toLowerCase()) && !e.employeeId.toLowerCase().includes(search.toLowerCase())) return false;
      
      if (shiftFilter !== 'ALL') {
        const hasShift = dateRangeList.some(date => {
          const info = getCellShiftInfo(e, date);
          return info.shiftId === shiftFilter;
        });
        if (!hasShift) return false;
      }
      
      return true;
    });
  }, [employees, departmentFilter, search, shiftFilter, dateRangeList, activeConfig, scheduleLookup]);

  // Helper formatting for dates (e.g., "Sen, 25 Aug")
  const formatDateHeader = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return {
      dayName: dayNames[d.getDay()],
      dateNum: d.getDate(),
      monthName: monthNames[d.getMonth()],
      isToday: dateStr === todayStr,
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    };
  };

  // Open Swap Modal from View Detail (clicking pencil icon)
  const handleOpenSwapFromView = () => {
    if (!viewCellDetail) return;
    const emp = viewCellDetail.employee;
    const date = viewCellDetail.date;
    const isOff = viewCellDetail.cellInfo?.isOff || viewCellDetail.shiftId === 'OFF' || viewCellDetail.shiftId === 'shift-off';

    setSelectedEmp1(emp.id);
    setDate1(date);
    setSelectedEmp2('');
    setDate2(date);
    setIsSameDateTukarShift(false);
    setGantiShiftTargetDate(date);
    setSwapReason('');
    setIsEmp1Locked(true);

    if (isOff) {
      setSwapType('tukar_off');
      const firstNonOff = availableShifts.find(s => !s.isOff && s.id !== 'OFF')?.id || availableShifts[0]?.id || '';
      setTargetShiftChoice(firstNonOff);
    } else {
      setSwapType('ganti_shift');
      const defaultTarget = availableShifts.find(s => s.id !== viewCellDetail.shiftId && !s.isOff)?.id || availableShifts[0]?.id || '';
      setTargetShiftChoice(defaultTarget);
    }

    // Close view modal and open swap modal
    setViewCellDetail(null);
    setIsSwapModalOpen(true);
  };

  // Save Shift Swap (synchronizes with ShiftSwaps and Matrix Schedule)
  const handleSaveSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp1 || !date1) {
      alert('Pilih karyawan dan tanggal terlebih dahulu');
      return;
    }

    if (swapType === 'ganti_shift' || swapType === 'direct_shift_change') {
      const valResult = validateGantiShift(
        selectedEmp1,
        date1,
        detectedShift1,
        targetShiftChoice
      );
      if (!valResult.isValid) {
        alert(valResult.errorMessage || 'Data ganti shift tidak valid.');
        return;
      }

      setIsSubmitting(true);
      try {
        await createShiftSwap({
          swapType: 'ganti_shift',
          initiator,
          requestDate: date1,
          requesterEmployeeId: selectedEmp1,
          requesterDate: date1,
          requesterShiftId: detectedShift1!.shiftId,
          targetDate: date1,
          targetShiftId: targetShiftChoice,
          reason: swapReason.trim()
        });
        setIsSwapModalOpen(false);
      } catch (err: any) {
        console.error('Error saving shift swap:', err);
        alert('Gagal menyimpan ganti shift: ' + (err.message || 'Terjadi kesalahan'));
      } finally {
        setIsSubmitting(false);
      }
    } else if (swapType === 'tukar_shift' || swapType === 'peer_to_peer') {
      const effDate2 = isSameDateTukarShift ? date1 : date2;
      const valResult = validateTukarShift(
        selectedEmp1,
        date1,
        detectedShift1,
        selectedEmp2,
        effDate2,
        detectedShift2Peer,
        isSameShiftType
      );
      if (!valResult.isValid) {
        alert(valResult.errorMessage || 'Data tukar shift tidak valid.');
        return;
      }

      setIsSubmitting(true);
      try {
        await createShiftSwap({
          swapType: 'tukar_shift',
          initiator,
          requestDate: date1,
          requesterEmployeeId: selectedEmp1,
          targetEmployeeId: selectedEmp2,
          requesterDate: date1,
          requesterShiftId: detectedShift1!.shiftId,
          targetDate: effDate2,
          targetShiftId: detectedShift2Peer!.shiftId,
          reason: swapReason.trim()
        });
        setIsSwapModalOpen(false);
      } catch (err: any) {
        console.error('Error saving shift swap:', err);
        alert('Gagal menyimpan tukar shift: ' + (err.message || 'Terjadi kesalahan'));
      } finally {
        setIsSubmitting(false);
      }
    } else if (swapType === 'tukar_off' || swapType === 'self_date_swap') {
      const valResult = validateTukarOff(
        selectedEmp1,
        date1,
        detectedShift1,
        date2,
        detectedShift2Self,
        targetShiftChoice
      );
      if (!valResult.isValid) {
        alert(valResult.errorMessage || 'Data tukar OFF tidak valid.');
        return;
      }

      setIsSubmitting(true);
      try {
        await createShiftSwap({
          swapType: 'tukar_off',
          initiator,
          requestDate: date1,
          requesterEmployeeId: selectedEmp1,
          requesterDate: date1,
          requesterShiftId: detectedShift1!.shiftId,
          targetDate: date2,
          targetShiftId: targetShiftChoice || detectedShift2Self!.shiftId,
          reason: swapReason.trim()
        });
        setIsSwapModalOpen(false);
      } catch (err: any) {
        console.error('Error saving shift swap:', err);
        alert('Gagal menyimpan tukar OFF: ' + (err.message || 'Terjadi kesalahan'));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const formatDateRangeIndo = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const s = new Date(startStr);
    const e = new Date(endStr);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return `${startStr} - ${endStr}`;
    const sDay = s.getDate();
    const eDay = e.getDate();
    const sMon = months[s.getMonth()];
    const eMon = months[e.getMonth()];
    const sYear = s.getFullYear();
    const eYear = e.getFullYear();

    if (sYear === eYear) {
      if (sMon === eMon) {
        return `${sDay} - ${eDay} ${sMon} ${sYear}`;
      }
      return `${sDay} ${sMon} - ${eDay} ${eMon} ${sYear}`;
    }
    return `${sDay} ${sMon} ${sYear} - ${eDay} ${eMon} ${eYear}`;
  };

  const dateRangeLabel = formatDateRangeIndo(startDate, endDate);
  const hasActiveFilters = departmentFilter !== 'ALL' || shiftFilter !== 'ALL' || startDate !== defaultMonthRange.start || endDate !== defaultMonthRange.end;

  // Subtitle with interactive filter / date range modal trigger
  const dateSubtitleNode = useMemo(() => (
    <button
      type="button"
      onClick={() => setIsFilterOpen(true)}
      className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 font-medium leading-none hover:text-blue-600 transition-colors cursor-pointer group text-left"
      title="Ubah Periode Tanggal & Filter Jadwal"
    >
      <span className="group-hover:text-blue-600 transition-colors">
        {dateRangeLabel || 'Pilih Periode'}
      </span>
      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
    </button>
  ), [dateRangeLabel]);

  // Standard Header Actions (Search, Settings, Tambah Shift, Tukar Shift)
  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* 1. Search Action */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`relative h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white border hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all ${
          search || hasActiveFilters
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari & Filter Tabel Jadwal"
      >
        <Search className="w-4 h-4 stroke-[1.8]" />
        {(search || hasActiveFilters) && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      {/* 2. Settings Action (Pengaturan Jadwal) */}
      {onOpenSettings && (
        <button
          type="button"
          onClick={onOpenSettings}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all"
          title="Pengaturan Jadwal"
        >
          <Settings className="w-4 h-4 stroke-[1.8]" />
        </button>
      )}

      {/* 3. Icon Tambah Shift / Lembur */}
      {(isNormalMode ? onOpenLembur : onOpenTambahShift) && (
        <button
          type="button"
          onClick={isNormalMode ? onOpenLembur : onOpenTambahShift}
          className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all"
          title={isNormalMode ? "Lembur" : "Tambah Shift / Lembur"}
        >
          <ClockPlus className="w-4 h-4 stroke-[1.8]" />
          {!isNormalMode && pendingExtrasCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] w-4 h-4 rounded-full font-bold flex items-center justify-center">
              {pendingExtrasCount}
            </span>
          )}
        </button>
      )}

      {/* 4. Icon Tukar Shift (Model Shift) */}
      {!isNormalMode && onOpenTukarShift && (
        <button
          type="button"
          onClick={onOpenTukarShift}
          className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all"
          title="Tukar Shift"
        >
          <ArrowRightLeft className="w-4 h-4 stroke-[1.8]" />
          {pendingSwapsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] w-4 h-4 rounded-full font-bold flex items-center justify-center">
              {pendingSwapsCount}
            </span>
          )}
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Top Header Title & Date Range Trigger */}
      <PageHeaderTitle 
        title="Jadwal Kerja & Shift" 
        subtitle={dateSubtitleNode} 
      />

      {/* Standard Header Actions */}
      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
          <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>
        </>
      )}

      {/* Header Search Mode */}
      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={search}
          onSearchChange={setSearch}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Cari karyawan / NIK..."
          onFilterClick={() => setIsFilterOpen(true)}
          isFilterActive={hasActiveFilters}
        />
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 animate-in fade-in duration-150">
          <span className="text-slate-400 font-medium">Filter aktif:</span>
          
          {departmentFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
              Dept: {deptMap.get(departmentFilter) || departmentFilter}
              <button onClick={() => setDepartmentFilter('ALL')} className="hover:text-red-600 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}

          {shiftFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
              Shift: {shiftFilter === 'OFF' ? 'Libur (OFF)' : availableShifts.find(s => s.id === shiftFilter)?.name || shiftFilter}
              <button onClick={() => setShiftFilter('ALL')} className="hover:text-red-600 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}

          {(startDate !== defaultMonthRange.start || endDate !== defaultMonthRange.end) && (
            <span className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
              Periode: {startDate} s/d {endDate}
              <button onClick={() => {
                setStartDate(defaultMonthRange.start);
                setEndDate(defaultMonthRange.end);
              }} className="hover:text-red-600 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}

          <button
            onClick={() => {
              setDepartmentFilter('ALL');
              setShiftFilter('ALL');
              setStartDate(defaultMonthRange.start);
              setEndDate(defaultMonthRange.end);
            }}
            className="text-blue-600 hover:underline font-semibold ml-1.5 cursor-pointer"
          >
            Bersihkan semua
          </button>
        </div>
      )}

      {employees.length === 0 ? (
        <div className="mt-4">
          <InitialEmptyCard
            title="Pantau Jadwal Kerja Tim!"
            description="Atur jadwal kerja dan shift karyawan Anda dengan mudah."
            buttonText="Tambah Karyawan Dulu"
            ButtonIcon={User}
            onAction={() => window.location.href = '/employees'}
            animationData={emptyScheduleAnimation}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Table Matrix Roster Grid */}
        {/* Card Info & Toolbar: Info text + Zoom Controls */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/90 px-3 py-2 border-b border-slate-200 font-medium">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="truncate">Klik Header Kolom untuk memperluas rincian</span>
          </div>
          <div className="flex items-center gap-2">
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

        {(() => {
          const tableFontSize = 11.5 + zoomOffset * 1;
          const tablePx = Math.max(3, Math.round(10 + zoomOffset * 1.6));
          const tablePy = Math.max(2, Math.round(8 + zoomOffset * 1.2));
          const colEmpWidth = Math.max(85, Math.round(135 + zoomOffset * 14));
          const colDateWidth = Math.max(50, Math.round(80 + zoomOffset * 8));

          return (
            <div className="overflow-x-auto">
              <table 
                className="w-full border-collapse text-left"
                style={{ 
                  fontSize: `${tableFontSize}px`,
                  '--tbl-px': `${tablePx}px`,
                  '--tbl-py': `${tablePy}px`,
                  '--col-emp-w': `${colEmpWidth}px`,
                  '--col-date-w': `${colDateWidth}px`
                } as React.CSSProperties}
              >
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[1em] font-semibold text-slate-600">
                    <th 
                      className="sticky left-0 bg-slate-50 z-10 border-r border-slate-200 shadow-2xs whitespace-nowrap overflow-hidden font-bold text-slate-700"
                      style={{ padding: 'var(--tbl-py) var(--tbl-px)', width: 'var(--col-emp-w)', minWidth: 'var(--col-emp-w)', maxWidth: 'var(--col-emp-w)' }}
                    >
                      Karyawan
                    </th>
                    {dateRangeList.map(dStr => {
                      const h = formatDateHeader(dStr);
                      return (
                        <th
                          key={dStr}
                          className={`text-center font-semibold border-l border-slate-200/60 whitespace-nowrap ${
                            h.isToday ? 'bg-blue-50/70 text-blue-800 font-bold' : h.isWeekend ? 'bg-slate-100/60 text-slate-600' : 'text-slate-700'
                          }`}
                          style={{ padding: 'var(--tbl-py) var(--tbl-px)', minWidth: 'var(--col-date-w)' }}
                        >
                          <div className="text-[0.8em] uppercase tracking-wider">{h.dayName}</div>
                          <div className="text-[1.1em] font-bold">{h.dateNum} {h.monthName}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={dateRangeList.length + 1} className="px-4 py-12 text-center text-slate-500 text-sm">
                        Tidak ada karyawan yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    activeEmployees.map(emp => {
                      const rawPos = posMap.get(emp.positionId) || deptMap.get(emp.departmentId) || 'Staff';
                      const displayPos = formatPositionName(rawPos);
                      const displayName = formatEmployeeName(emp.fullName);

                      return (
                        <tr key={emp.id} className="hover:bg-blue-50/50 transition-colors group">
                          {/* Employee Name & Position */}
                          <td 
                            className="sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r border-slate-200 shadow-2xs overflow-hidden"
                            style={{ padding: 'var(--tbl-py) var(--tbl-px)', width: 'var(--col-emp-w)', minWidth: 'var(--col-emp-w)', maxWidth: 'var(--col-emp-w)' }}
                          >
                            <div className="font-bold text-slate-900 text-[1.05em] overflow-hidden text-clip whitespace-nowrap" title={emp.fullName}>
                              {displayName}
                            </div>
                            <div className="text-[0.9em] text-slate-500 font-normal overflow-hidden text-clip whitespace-nowrap mt-0.5" title={rawPos}>
                              {displayPos}
                            </div>
                          </td>

                          {/* Date Cells */}
                          {dateRangeList.map(dStr => {
                            const cellInfo = getCellShiftInfo(emp, dStr);
                            const shiftId = cellInfo.shiftId;
                            const isToday = dStr === todayStr;

                            return (
                              <td
                                key={dStr}
                                onClick={() => {
                                  setViewCellDetail({
                                    employee: emp,
                                    date: dStr,
                                    shiftId: shiftId,
                                    shiftName: cellInfo.shiftName,
                                    cellInfo: cellInfo,
                                  });
                                }}
                                className={`border-l border-slate-100 text-center cursor-pointer hover:bg-blue-50/60 transition-colors ${
                                  isToday ? 'bg-blue-50/20' : ''
                                }`}
                                style={{ padding: 'var(--tbl-py) var(--tbl-px)', minWidth: 'var(--col-date-w)' }}
                                title={`Shift: ${cellInfo.shiftName} ${cellInfo.sched?.notes ? `(${cellInfo.sched.notes})` : ''}`}
                              >
                                {getShiftBadge(shiftId, cellInfo.shiftName)}
                                {cellInfo.sched?.isOvershift && (
                                  <span className="block text-[0.75em] text-purple-600 font-bold mt-0.5">Overshift</span>
                                )}
                                {cellInfo.sched?.notes && cellInfo.sched.notes.includes('Tukar') && (
                                  <span className="block text-[0.75em] text-emerald-600 font-bold mt-0.5">Pertukaran</span>
                                )}
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
          );
        })()}
      </div>
      )}

      {/* MODAL VIEW DETAIL JADWAL SHIFT (STATIS TEXT DENGAN TOMBOL EDIT PENSIL) */}
      <ModalMatrixCellDetail
        isOpen={!!viewCellDetail}
        viewCellDetail={viewCellDetail}
        onClose={() => setViewCellDetail(null)}
        onOpenSwapFromView={handleOpenSwapFromView}
        deptMap={deptMap}
        posMap={posMap}
        getShiftBadge={getShiftBadge}
        formatHariTanggalIndo={formatHariTanggalIndo}
      />

      {/* MODAL PERTUKARAN / UBAH SHIFT (TERKUNCI NAMA KARYAWAN) */}
      <ShiftSwapModalForm
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        modalMode="create"
        selectedSwap={null}
        handleSwitchToEdit={() => {}}
        handleSaveSwap={handleSaveSwap}
        isSubmitting={isSubmitting}
        isEmp1Locked={isEmp1Locked}
        initiator={initiator}
        setInitiator={setInitiator}
        swapType={swapType}
        setSwapType={setSwapType}
        showCategoryInfo={showCategoryInfo}
        setShowCategoryInfo={setShowCategoryInfo}
        swapReason={swapReason}
        setSwapReason={setSwapReason}
        employees={employees}
        employeesForEmp2={employeesForEmp2}
        selectedEmp1={selectedEmp1}
        setSelectedEmp1={setSelectedEmp1}
        selectedEmp2={selectedEmp2}
        setSelectedEmp2={setSelectedEmp2}
        date1={date1}
        setDate1={setDate1}
        date2={date2}
        setDate2={setDate2}
        isSameDateTukarShift={isSameDateTukarShift}
        setIsSameDateTukarShift={setIsSameDateTukarShift}
        setGantiShiftTargetDate={setGantiShiftTargetDate}
        targetShiftChoice={targetShiftChoice}
        setTargetShiftChoice={setTargetShiftChoice}
        showTukarOffRules={showTukarOffRules}
        setShowTukarOffRules={setShowTukarOffRules}
        detectedShift1={detectedShift1}
        detectedShift2Peer={detectedShift2Peer}
        detectedShift2Self={detectedShift2Self}
        filteredGantiShifts={filteredGantiShifts}
        tukarOffShiftList={tukarOffShiftList}
        isHasIdenticalShiftError={isHasIdenticalShiftError}
        empMap={empMap}
        posMap={posMap}
        deptMap={deptMap}
        getShiftBadge={getShiftBadge}
      />

      {/* FILTER MODAL / BOTTOM SHEET */}
      <ModalMatrixFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        departments={departments}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        activeConfig={activeConfig}
        availableShifts={availableShifts}
        shiftFilter={shiftFilter}
        setShiftFilter={setShiftFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        defaultMonthRange={defaultMonthRange}
        formatDisplayDateIndo={formatDisplayDateIndo}
      />
    </div>
  );
}
