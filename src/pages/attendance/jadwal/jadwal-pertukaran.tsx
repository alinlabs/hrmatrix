import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  PlusCircle, 
  ArrowRightLeft, 
  Trash2, 
  Search, 
  Filter,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/database';
import { 
  ShiftSchedule, 
  ShiftSwapType, 
  ShiftSwapInitiator, 
  ShiftSwap 
} from '../../../types';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { 
  createShiftSwap, 
  updateShiftSwap, 
  deleteShiftSwap, 
  migrateAndSeedShiftSwaps,
  validateGantiShift,
  validateTukarShift,
  validateTukarOff
} from '../../../services/shiftService';
import { getEffectiveShiftForEmployee } from '../../../services/rosterService';

import { JadwalPertukaranProps, ModalMode } from './types';
import { 
  getJenisPengajuanLabel, 
  formatTanggalPengajuan3Lines, 
  formatTanggalIndo, 
  formatShortName, 
  isSameShiftType 
} from './utils-pertukaran-helper';
import { ModalForm } from './modal-pertukaran-form';
import { ModalFilter } from './modal-pertukaran-filter';
import { 
  PageHeaderTitle, 
  PageHeaderSearch, 
  DesktopHeaderActions, 
  MobileHeaderActions,
  HideBottomNav 
} from '../../../context/MobileNavContext';
import { useScrollToTop } from '../../../components/layout/ScrollToTop';
import { InitialEmptyCard } from '../../../components/ui/initial-empty-card';
import emptyShiftAnimation from '../../../assets/animations/empty-shift.json';

export function JadwalPertukaran({ activeConfig, availableShifts, getShiftBadge, onBack }: JadwalPertukaranProps) {
  useScrollToTop();
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Modal State
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedSwap, setSelectedSwap] = useState<ShiftSwap | null>(null);

  const [swapType, setSwapType] = useState<ShiftSwapType>('ganti_shift');
  const [initiator, setInitiator] = useState<ShiftSwapInitiator>('Employee');

  // Common / Requester employee
  const [selectedEmp1, setSelectedEmp1] = useState('');
  const [date1, setDate1] = useState(todayStr);

  // Tukar Shift (Rekan) & Tukar Off target fields
  const [selectedEmp2, setSelectedEmp2] = useState('');
  const [date2, setDate2] = useState(todayStr);
  const [isSameDateTukarShift, setIsSameDateTukarShift] = useState(false);

  // Ganti Shift target shift field & optional target date
  const [targetShiftChoice, setTargetShiftChoice] = useState('');
  const [gantiShiftTargetDate, setGantiShiftTargetDate] = useState(todayStr);

  const [swapReason, setSwapReason] = useState('');
  const [showCategoryInfo, setShowCategoryInfo] = useState(false);
  const [showTukarOffRules, setShowTukarOffRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTable, setSearchTable] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [zoomOffset, setZoomOffset] = useState<number>(0);
  const handleZoomIn = () => setZoomOffset(prev => Math.min(prev + 1, 4));
  const handleZoomOut = () => setZoomOffset(prev => Math.max(prev - 1, -4));
  const handleResetZoom = () => setZoomOffset(0);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  // Filter Modal & Criteria State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterInitiator, setFilterInitiator] = useState<'ALL' | ShiftSwapInitiator>('ALL');
  const [filterSwapType, setFilterSwapType] = useState<'ALL' | ShiftSwapType>('ALL');

  // Live queries from Dexie DB
  const employees = useLiveQuery(async () => {
    try {
      return await db.employees.toArray();
    } catch {
      return [];
    }
  }) || [];

  const shiftSchedules = useLiveQuery(async () => {
    try {
      return await db.shiftSchedules.toArray();
    } catch {
      return [];
    }
  }) || [];

  const shiftSwaps = useLiveQuery(async () => {
    try {
      if (!db.shiftSwaps) return [];
      const list = await db.shiftSwaps.toArray();
      return list.sort((a, b) => (b.requesterDate || '').localeCompare(a.requesterDate || ''));
    } catch {
      return [];
    }
  }) || [];

  const departments = useLiveQuery(async () => {
    try { return await db.departments.toArray(); } catch { return []; }
  }) || [];

  const positions = useLiveQuery(async () => {
    try { return await db.positions.toArray(); } catch { return []; }
  }) || [];

  const deptMap = useMemo(() => new Map(departments.map(d => [d.id, d.name])), [departments]);
  const posMap = useMemo(() => new Map(positions.map(p => [p.id, p.name])), [positions]);

  const empMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

  // Seed sample data and migrate legacy records
  useEffect(() => {
    if (employees.length > 0) {
      migrateAndSeedShiftSwaps(employees);
    }
  }, [employees]);

  const customSchedulesMap = useMemo(() => {
    const map = new Map<string, ShiftSchedule>();
    shiftSchedules.forEach(s => {
      map.set(`${s.employeeId}_${s.date}`, s);
    });
    return map;
  }, [shiftSchedules]);

  // Lock body scroll when any modal is open
  useScrollLock(isSwapModalOpen || isFilterModalOpen);

  const hasActiveFilters = filterInitiator !== 'ALL' || filterSwapType !== 'ALL';

  // Auto-detect shift for Karyawan 1 (on date1)
  const emp1Obj = useMemo(() => empMap.get(selectedEmp1), [empMap, selectedEmp1]);
  const detectedShift1 = useMemo(() => {
    if (!emp1Obj || !date1) return null;
    return getEffectiveShiftForEmployee(emp1Obj, date1, activeConfig || null, customSchedulesMap);
  }, [emp1Obj, date1, activeConfig, customSchedulesMap]);

  // Auto-detect shift for Karyawan 2 (on date2 in tukar_shift / peer_to_peer)
  const emp2Obj = useMemo(() => empMap.get(selectedEmp2), [empMap, selectedEmp2]);
  const detectedShift2Peer = useMemo(() => {
    if (!emp2Obj || !date2 || (swapType !== 'tukar_shift' && swapType !== 'peer_to_peer')) return null;
    return getEffectiveShiftForEmployee(emp2Obj, date2, activeConfig || null, customSchedulesMap);
  }, [emp2Obj, date2, swapType, activeConfig, customSchedulesMap]);

  // Auto-detect shift for Karyawan 1 on date2 (in tukar_off / self_date_swap)
  const detectedShift2Self = useMemo(() => {
    if (!emp1Obj || !date2 || (swapType !== 'tukar_off' && swapType !== 'self_date_swap')) return null;
    return getEffectiveShiftForEmployee(emp1Obj, date2, activeConfig || null, customSchedulesMap);
  }, [emp1Obj, date2, swapType, activeConfig, customSchedulesMap]);

  // Filter employees for Karyawan 2 (Pengganti) - exclude self
  const employeesForEmp2 = useMemo(() => {
    return employees.filter(emp => emp.id !== selectedEmp1);
  }, [employees, selectedEmp1]);

  // Check if identical shift exists in tukar_shift
  const isHasIdenticalShiftError = useMemo(() => {
    if ((swapType === 'tukar_shift' || swapType === 'peer_to_peer') && detectedShift1 && detectedShift2Peer) {
      return isSameShiftType(detectedShift1, detectedShift2Peer);
    }
    return false;
  }, [swapType, detectedShift1, detectedShift2Peer]);

  // Filter available shifts for Tukar OFF (no OFF option, and exclude date2 shift if date1 is not OFF)
  const tukarOffShiftList = useMemo(() => {
    const activeWorkingShifts = availableShifts.filter(s => !s.isOff && s.id !== 'OFF' && s.name.toLowerCase() !== 'off' && !s.name.toLowerCase().includes('libur'));
    const isDate1Off = detectedShift1?.isOff || detectedShift1?.shiftId === 'OFF';

    if (!isDate1Off) {
      // If Date 1 is NOT OFF (working day), filter out shift that matches detectedShift2Self on date 2
      return activeWorkingShifts.filter(s => {
        if (detectedShift2Self) {
          const sObj = { shiftId: s.id, shiftName: s.name, code: s.code || s.id, isOff: s.isOff };
          if (isSameShiftType(sObj, detectedShift2Self)) return false;
        }
        return true;
      });
    }

    // If Date 1 IS OFF, show active working shifts
    return activeWorkingShifts;
  }, [availableShifts, detectedShift1, detectedShift2Self]);

  // Filter available shifts for Ganti Shift (exclude OFF and exclude detected shift on date1)
  const filteredGantiShifts = useMemo(() => {
    return availableShifts.filter(s => {
      // Exclude OFF
      if (s.id === 'OFF' || s.isOff || s.name.toLowerCase() === 'off' || s.name.toLowerCase().includes('libur')) {
        return false;
      }
      // Exclude shift matching detectedShift1 on date1
      if (detectedShift1) {
        if (s.id === detectedShift1.shiftId) return false;
        if (detectedShift1.shiftName && s.name.toLowerCase() === detectedShift1.shiftName.toLowerCase()) return false;
      }
      return true;
    });
  }, [availableShifts, detectedShift1]);

  // Validate target shift choice for ganti shift
  useEffect(() => {
    if (swapType === 'ganti_shift' || swapType === 'direct_shift_change') {
      if (targetShiftChoice && !filteredGantiShifts.some(s => s.id === targetShiftChoice)) {
        setTargetShiftChoice('');
      }
    }
  }, [swapType, targetShiftChoice, filteredGantiShifts]);

  // Validate target shift choice for tukar off
  useEffect(() => {
    if (swapType === 'tukar_off' || swapType === 'self_date_swap') {
      if (targetShiftChoice && !tukarOffShiftList.some(s => s.id === targetShiftChoice)) {
        setTargetShiftChoice('');
      }
    }
  }, [swapType, targetShiftChoice, tukarOffShiftList]);

  // Open modal handler (Create Mode)
  const handleOpenModal = () => {
    setSelectedSwap(null);
    setModalMode('create');
    setSwapType('ganti_shift');
    setInitiator('Employee');
    setSelectedEmp1('');
    setDate1('');
    setSelectedEmp2('');
    setDate2('');
    setIsSameDateTukarShift(false);
    setGantiShiftTargetDate('');
    setTargetShiftChoice('');
    setSwapReason('');
    setShowCategoryInfo(false);
    setShowTukarOffRules(false);
    setIsSwapModalOpen(true);
  };

  // Open modal handler (View Mode from Table Click)
  const handleRowClick = (swap: ShiftSwap) => {
    setSelectedSwap(swap);
    setModalMode('view');
    setIsSwapModalOpen(true);
  };

  // Switch from View Mode to Edit Mode
  const handleSwitchToEdit = () => {
    if (!selectedSwap) return;
    const rawType = selectedSwap.swapType || 'ganti_shift';
    const normalizedType: ShiftSwapType = 
      rawType === 'peer_to_peer' ? 'tukar_shift' : 
      rawType === 'self_date_swap' ? 'tukar_off' : 
      rawType === 'direct_shift_change' ? 'ganti_shift' : (rawType as ShiftSwapType);

    setSwapType(normalizedType);
    setInitiator(selectedSwap.initiator || 'Employee');
    setSelectedEmp1(selectedSwap.requesterEmployeeId || '');
    setDate1(selectedSwap.requesterDate || todayStr);
    setSelectedEmp2(selectedSwap.targetEmployeeId || '');
    setDate2(selectedSwap.targetDate || todayStr);
    setIsSameDateTukarShift(Boolean(selectedSwap.requesterDate && selectedSwap.targetDate && selectedSwap.requesterDate === selectedSwap.targetDate));
    setGantiShiftTargetDate(selectedSwap.targetDate || selectedSwap.requesterDate || todayStr);
    setTargetShiftChoice(selectedSwap.targetShiftId || (availableShifts[0]?.id || 'shift-1-pagi'));
    setSwapReason(selectedSwap.reason || '');
    setModalMode('edit');
  };

  // Handle Save Swap / Reschedule (Create or Edit)
  const handleSaveSwap = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmp1) {
      alert('Silakan pilih karyawan terlebih dahulu.');
      return;
    }

    if (!detectedShift1) {
      alert('Gagal mendeteksi jadwal asal untuk karyawan pada tanggal yang dipilih.');
      return;
    }

    const isEditMode = modalMode === 'edit' && selectedSwap;

    if (swapType === 'ganti_shift' || swapType === 'direct_shift_change') {
      const valResult = validateGantiShift(selectedEmp1, date1, detectedShift1, targetShiftChoice);
      if (!valResult.isValid) {
        alert(valResult.errorMessage || 'Data ganti shift tidak valid.');
        return;
      }

      setIsSubmitting(true);
      try {
        if (isEditMode) {
          await updateShiftSwap(selectedSwap.id, {
            swapType: 'ganti_shift',
            initiator,
            requestDate: date1,
            requesterEmployeeId: selectedEmp1,
            requesterDate: date1,
            requesterShiftId: detectedShift1.shiftId,
            targetDate: date1,
            targetShiftId: targetShiftChoice,
            reason: swapReason.trim()
          });
          setIsSwapModalOpen(false);
          alert('Perubahan ganti shift berhasil disimpan!');
        } else {
          await createShiftSwap({
            swapType: 'ganti_shift',
            initiator,
            requestDate: date1,
            requesterEmployeeId: selectedEmp1,
            requesterDate: date1,
            requesterShiftId: detectedShift1.shiftId,
            targetDate: date1,
            targetShiftId: targetShiftChoice,
            reason: swapReason.trim()
          });
          setIsSwapModalOpen(false);
          alert('Ganti shift berhasil disimpan dan langsung diperbarui ke jadwal!');
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan saat menyimpan ganti shift.');
      } finally {
        setIsSubmitting(false);
      }
    } else if (swapType === 'tukar_shift' || swapType === 'peer_to_peer') {
      const valResult = validateTukarShift(
        selectedEmp1,
        date1,
        detectedShift1,
        selectedEmp2,
        date2,
        detectedShift2Peer,
        isSameShiftType
      );
      if (!valResult.isValid) {
        alert(valResult.errorMessage || 'Data tukar shift tidak valid.');
        return;
      }

      setIsSubmitting(true);
      try {
        if (isEditMode) {
          await updateShiftSwap(selectedSwap.id, {
            swapType: 'tukar_shift',
            initiator,
            requestDate: date1,
            requesterEmployeeId: selectedEmp1,
            targetEmployeeId: selectedEmp2,
            requesterDate: date1,
            requesterShiftId: detectedShift1.shiftId,
            targetDate: date2,
            targetShiftId: detectedShift2Peer!.shiftId,
            reason: swapReason.trim()
          });
          setIsSwapModalOpen(false);
          alert('Perubahan tukar shift antar karyawan berhasil disimpan!');
        } else {
          await createShiftSwap({
            swapType: 'tukar_shift',
            initiator,
            requestDate: date1,
            requesterEmployeeId: selectedEmp1,
            targetEmployeeId: selectedEmp2,
            requesterDate: date1,
            requesterShiftId: detectedShift1.shiftId,
            targetDate: date2,
            targetShiftId: detectedShift2Peer!.shiftId,
            reason: swapReason.trim()
          });
          setIsSwapModalOpen(false);
          alert('Tukar shift antar karyawan berhasil disimpan dan langsung diterapkan ke jadwal!');
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan saat menyimpan tukar shift.');
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
        if (isEditMode) {
          await updateShiftSwap(selectedSwap.id, {
            swapType: 'tukar_off',
            initiator,
            requestDate: date1,
            requesterEmployeeId: selectedEmp1,
            requesterDate: date1,
            requesterShiftId: detectedShift1.shiftId,
            targetDate: date2,
            targetShiftId: targetShiftChoice || detectedShift2Self!.shiftId,
            reason: swapReason.trim()
          });
          setIsSwapModalOpen(false);
          alert('Perubahan tukar hari OFF berhasil disimpan!');
        } else {
          await createShiftSwap({
            swapType: 'tukar_off',
            initiator,
            requestDate: date1,
            requesterEmployeeId: selectedEmp1,
            requesterDate: date1,
            requesterShiftId: detectedShift1.shiftId,
            targetDate: date2,
            targetShiftId: targetShiftChoice || detectedShift2Self!.shiftId,
            reason: swapReason.trim()
          });
          setIsSwapModalOpen(false);
          alert('Tukar hari OFF berhasil disimpan dan jadwal langsung disesuaikan!');
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan saat menyimpan tukar OFF.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const filteredSwaps = useMemo(() => {
    let list = shiftSwaps;
    if (filterSwapType !== 'ALL') {
      list = list.filter(s => (s.swapType || 'peer_to_peer') === filterSwapType);
    }
    if (filterInitiator !== 'ALL') {
      list = list.filter(s => (s.initiator || 'Employee') === filterInitiator);
    }
    if (!searchTable.trim()) return list;
    const q = searchTable.toLowerCase();
    return list.filter(swap => {
      const reqName = empMap.get(swap.requesterEmployeeId)?.fullName.toLowerCase() || '';
      const reqNik = empMap.get(swap.requesterEmployeeId)?.employeeId?.toLowerCase() || '';
      const targetName = swap.targetEmployeeId ? (empMap.get(swap.targetEmployeeId)?.fullName.toLowerCase() || '') : '';
      const targetNik = swap.targetEmployeeId ? (empMap.get(swap.targetEmployeeId)?.employeeId?.toLowerCase() || '') : '';
      const reason = (swap.reason || '').toLowerCase();
      const initiatorText = swap.initiator === 'Company' ? 'perusahaan' : 'karyawan';
      return (
        reqName.includes(q) ||
        reqNik.includes(q) ||
        targetName.includes(q) ||
        targetNik.includes(q) ||
        reason.includes(q) ||
        initiatorText.includes(q)
      );
    });
  }, [shiftSwaps, filterSwapType, filterInitiator, searchTable, empMap]);

  // Standard Header Actions
  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* 1. Search Action */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`relative h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white border hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all ${
          searchTable || hasActiveFilters
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari & Filter Pertukaran Shift"
      >
        <Search className="w-4 h-4 stroke-[1.8]" />
        {(searchTable || hasActiveFilters) && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      {/* 2. Plus Action */}
      <button 
        type="button"
        onClick={handleOpenModal} 
        title="Buat Pertukaran / Ganti Shift"
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xs shrink-0 transition-all cursor-pointer"
      >
        <PlusCircle className="w-4 h-4 stroke-[2]" />
      </button>
    </div>
  );

  return (
    <div className="space-y-3.5">
      <HideBottomNav />
      {/* Top Header Title with Back Action */}
      <PageHeaderTitle 
        title="Tukar Shift" 
        subtitle="Pengajuan Tukar & Ganti Shift" 
        onBack={onBack} 
        hideHamburger={true} 
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
          searchQuery={searchTable}
          onSearchChange={setSearchTable}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Cari nama karyawan, NIK, alasan..."
          onFilterClick={() => setIsFilterModalOpen(true)}
          isFilterActive={hasActiveFilters}
        />
      )}

      {/* Active Filter Pill indicator if filtered */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-600 bg-blue-50/70 border border-blue-100 px-3 py-1.5 rounded-xl">
          <span className="font-semibold text-blue-900">Filter Aktif:</span>
          {filterInitiator !== 'ALL' && (
            <span className="px-2 py-0.5 bg-white rounded-md border border-blue-200 text-blue-700 font-medium">
              Inisiator: {filterInitiator === 'Company' ? 'Perusahaan (HR)' : 'Karyawan'}
            </span>
          )}
          {filterSwapType !== 'ALL' && (
            <span className="px-2 py-0.5 bg-white rounded-md border border-blue-200 text-blue-700 font-medium">
              Tipe: {getJenisPengajuanLabel(filterSwapType)}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setFilterInitiator('ALL');
              setFilterSwapType('ALL');
            }}
            className="text-blue-600 hover:text-blue-800 font-bold ml-1 cursor-pointer underline"
          >
            Reset
          </button>
        </div>
      )}

      {/* Main Table */}
      {shiftSwaps.length === 0 ? (
        <div className="mt-4">
          <InitialEmptyCard
            title="Kelola Pertukaran Shift!"
            description="Atur pergantian shift karyawan dengan mudah dan terpusat."
            buttonText="Buat Pertukaran / Ganti Shift"
            ButtonIcon={ArrowRightLeft}
            onAction={handleOpenModal}
            animationData={emptyShiftAnimation}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Card Info & Zoom Toolbar */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/90 px-3 py-2 border-b border-slate-200 font-medium">
            <div className="flex items-center overflow-hidden">
              <span className="truncate">Klik baris data untuk melihat atau mengedit rincian penyesuaian shift</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-0.5">
                <button 
                  type="button"
                  onClick={handleZoomOut} 
                  disabled={zoomOffset <= -4}
                  className="p-1 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-slate-600 transition-colors cursor-pointer" 
                  title="Perkecil Skala Teks"
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
                  title="Perbesar Skala Teks"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {(() => {
            const tableFontSize = 11.5 + zoomOffset * 1;
            const tablePx = Math.max(4, Math.round(14 + zoomOffset * 2.0));
            const tablePy = Math.max(3, Math.round(10 + zoomOffset * 1.5));

            return (
              <div className="overflow-x-auto">
                <table 
                  className="w-full text-left border-collapse"
                  style={{ 
                    fontSize: `${tableFontSize}px`,
                    '--tbl-px': `${tablePx}px`,
                    '--tbl-py': `${tablePy}px`
                  } as React.CSSProperties}
                >
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="whitespace-nowrap">Jenis Pengajuan</th>
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="min-w-[140px]">Jadwal Awal</th>
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="min-w-[140px]">Jadwal Pengganti</th>
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="min-w-[185px] max-w-[300px]">Inisiator & Keterangan</th>
                    <th style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="text-center whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSwaps.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="py-10 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <ArrowRightLeft className="w-6 h-6 text-slate-300" />
                          <p className="font-medium text-slate-600">Belum ada riwayat pertukaran/penyesuaian shift.</p>
                          <p className="text-[0.9em] text-slate-400">Klik tombol "+" di atas untuk mencatat penyesuaian baru.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSwaps.map(swap => {
                      const currentType = swap.swapType || 'peer_to_peer';
                      const reqEmp = empMap.get(swap.requesterEmployeeId);
                      const targetEmp = swap.targetEmployeeId ? empMap.get(swap.targetEmployeeId) : null;
                      const isCompany = swap.initiator === 'Company';

                      const jenisPengajuanText = getJenisPengajuanLabel(currentType);

                      const reqEmpName = reqEmp?.fullName || swap.requesterEmployeeId;
                      const targetEmpName = targetEmp?.fullName || swap.targetEmployeeId || '';

                      return (
                        <tr 
                          key={swap.id} 
                          onClick={() => handleRowClick(swap)}
                          className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                        >
                          {/* Jenis Pengajuan (Teks Biasa Bold Tanpa Badge) */}
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="whitespace-nowrap">
                            <span className="font-bold text-slate-800">
                              {jenisPengajuanText}
                            </span>
                          </td>

                          {/* Jadwal Awal (Urutan: Nama, Badge Shift, Tanggal) */}
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="min-w-[140px]">
                            <div className="font-semibold text-slate-900 leading-tight whitespace-nowrap" title={reqEmpName}>
                              {formatShortName(reqEmpName)}
                            </div>
                            <div className="mt-1 w-fit text-[0.9em]">
                              {getShiftBadge(swap.requesterShiftId)}
                            </div>
                            <div className="text-[0.9em] text-slate-500 mt-1 font-normal">
                              {formatTanggalIndo(swap.requesterDate)}
                            </div>
                          </td>

                          {/* Jadwal Pengganti */}
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="min-w-[140px]">
                            {(currentType === 'tukar_shift' || currentType === 'peer_to_peer') ? (
                              <>
                                <div className="font-semibold text-slate-900 leading-tight whitespace-nowrap" title={targetEmpName}>
                                  {formatShortName(targetEmpName)}
                                </div>
                                <div className="mt-1 w-fit text-[0.9em]">
                                  {getShiftBadge(swap.targetShiftId)}
                                </div>
                                <div className="text-[0.9em] text-slate-500 mt-1 font-normal">
                                  {formatTanggalIndo(swap.targetDate || swap.requesterDate)}
                                </div>
                              </>
                            ) : (currentType === 'tukar_off' || currentType === 'self_date_swap') ? (
                              <>
                                <div className="font-semibold text-slate-900 leading-tight whitespace-nowrap">
                                  Bekerja Pada
                                </div>
                                <div className="mt-1 w-fit text-[0.9em]">
                                  {getShiftBadge(swap.targetShiftId || 'OFF')}
                                </div>
                                <div className="text-[0.9em] text-slate-500 mt-1 font-normal">
                                  {formatTanggalIndo(swap.targetDate || swap.requesterDate)}
                                </div>
                              </>
                            ) : (!swap.targetDate || swap.targetDate === swap.requesterDate) ? (
                              <>
                                <div className="font-semibold text-slate-900 leading-tight whitespace-nowrap">
                                  Shift Diganti
                                </div>
                                <div className="mt-1 w-fit text-[0.9em]">
                                  {getShiftBadge(swap.targetShiftId)}
                                </div>
                                <div className="text-[0.9em] text-slate-500 mt-1 font-normal">
                                  Pada hari yang sama
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="font-semibold text-slate-900 leading-tight whitespace-nowrap">
                                  Shift Baru
                                </div>
                                <div className="mt-1 w-fit text-[0.9em]">
                                  {getShiftBadge(swap.targetShiftId)}
                                </div>
                                <div className="text-[0.9em] text-slate-500 mt-1 font-normal">
                                  {formatTanggalIndo(swap.targetDate)}
                                </div>
                              </>
                            )}
                          </td>

                          {/* Inisiator & Keterangan */}
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="min-w-[185px] max-w-[300px]" title={swap.reason || undefined}>
                            <div className="font-semibold text-slate-800 leading-tight">
                              {isCompany ? 'Perusahaan (HR)' : 'Karyawan'}
                            </div>
                            <p className="line-clamp-2 leading-relaxed text-[0.95em] text-slate-500 mt-0.5">
                              {swap.reason || '-'}
                            </p>
                          </td>

                          {/* Aksi */}
                          <td style={{ padding: 'var(--tbl-py) var(--tbl-px)' }} className="text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm('Hapus pencatatan pertukaran/penyesuaian shift ini?')) {
                                  await deleteShiftSwap(swap.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Catatan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
      </div>
      )}

      {/* MODAL PERTUKARAN / PENYESUAIAN SHIFT (CREATE / VIEW / EDIT) */}
      <ModalForm
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        modalMode={modalMode}
        selectedSwap={selectedSwap}
        handleSwitchToEdit={handleSwitchToEdit}
        handleSaveSwap={handleSaveSwap}
        isSubmitting={isSubmitting}
        
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

      {/* MODAL / BOTTOM SHEET FILTER */}
      <ModalFilter
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterInitiator={filterInitiator}
        setFilterInitiator={setFilterInitiator}
        filterSwapType={filterSwapType}
        setFilterSwapType={setFilterSwapType}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
}

export default JadwalPertukaran;
