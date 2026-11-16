import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PlusCircle, Clock, Search, SlidersHorizontal } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import {
  AttendanceConfig,
  WorkShift,
  ShiftSchedule,
  ExtraShift,
  OvertimeConfig,
  OvertimeCalculationBasis,
} from '../../types';
import { useScrollLock } from '../../hooks/use-scroll-lock';
import {
  PageHeaderTitle,
  PageHeaderSearch,
  DesktopHeaderActions,
  MobileHeaderActions,
  HideBottomNav,
} from '../../context/mobile-nav-context';
import { useScrollToTop } from '../../components/layout/scroll-to-top';
import { createExtraShift, deleteExtraShift, resolveWageCategory, isShiftOff } from '../../services/shift-service';
import { getEffectiveShiftForEmployee } from '../../services/roster-service';
import { saveAttendanceConfig, getAttendanceConfig } from '../../services/attendance-config-service';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyShiftAnimation from '../../assets/animations/empty-shift.json';
import { ModalTabel } from './modal-tabel-tambahan';
import { FormJadwalTambahan } from './form-jadwal-tambahan';
import { ModalKonfigurasi } from './modal-konfigurasi-tambahan';

interface Props {
  activeConfig?: AttendanceConfig | null;
  availableShifts: WorkShift[];
  getShiftBadge: (shiftId: string, shiftNameStr?: string) => React.ReactNode;
  onBack?: () => void;
}

export function JadwalTambahan({ activeConfig, availableShifts, getShiftBadge, onBack }: Props) {
  useScrollToTop();

  // Modal State for Tambah Shift
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null);
  const [extraEmp, setExtraEmp] = useState('');
  const [extraWorkDate, setExtraWorkDate] = useState('');
  const [selectedExtraShiftId, setSelectedExtraShiftId] = useState('');
  const [durationHours, setDurationHours] = useState<number>(
    activeConfig?.minimumOvertimeMinutes ? Number((activeConfig.minimumOvertimeMinutes / 60).toFixed(1)) : 1
  );
  const [customStartTime, setCustomStartTime] = useState('17:00');
  const [customEndTime, setCustomEndTime] = useState('20:00');
  const [extraReason, setExtraReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTable, setSearchTable] = useState('');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Modal State for Overtime Configuration
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const normalizeBasis = (b?: string): OvertimeCalculationBasis => {
    if (b === 'government' || b === 'manual_divider' || b === 'nominal' || b === 'salary_hourly') {
      return b;
    }
    if (b === 'salary') return 'salary_hourly';
    return 'salary_hourly';
  };

  // Overtime Config state initialized from activeConfig
  const [minOvertimeMinutes, setMinOvertimeMinutes] = useState<number>(activeConfig?.minimumOvertimeMinutes ?? 60);
  const [isAutoOvertime, setIsAutoOvertime] = useState<boolean>(activeConfig?.autoOvertime !== false);
  const [showPresensiInfo, setShowPresensiInfo] = useState(false);
  const [dayMode, setDayMode] = useState<'separate' | 'unified'>('separate');

  // Normal Day (Hari Kerja)
  const [normalCalcType, setNormalCalcType] = useState<'multiplier' | 'static'>(
    activeConfig?.overtimeConfig?.normalWorkday?.calculationType || 'multiplier'
  );
  const [normalCalcBasis, setNormalCalcBasis] = useState<OvertimeCalculationBasis>(
    normalizeBasis(activeConfig?.overtimeConfig?.normalWorkday?.calculationBasis)
  );
  const [normalStaticRate, setNormalStaticRate] = useState<number>(
    activeConfig?.overtimeConfig?.normalWorkday?.ratePerHour || 25000
  );
  const [normalStaticFirstHourRate, setNormalStaticFirstHourRate] = useState<number>(
    activeConfig?.overtimeConfig?.normalWorkday?.staticFirstHourRate || 35000
  );
  const [normalStaticNextHoursRate, setNormalStaticNextHoursRate] = useState<number>(
    activeConfig?.overtimeConfig?.normalWorkday?.staticNextHoursRate || 45000
  );
  const [normalBaseDivider, setNormalBaseDivider] = useState<number>(
    activeConfig?.overtimeConfig?.normalWorkday?.baseDivider || 173
  );
  const [normalMultFirst, setNormalMultFirst] = useState<number>(
    activeConfig?.overtimeConfig?.normalWorkday?.multiplierFirstHour || 1.5
  );
  const [normalMultNext, setNormalMultNext] = useState<number>(
    activeConfig?.overtimeConfig?.normalWorkday?.multiplierNextHours || 2.0
  );
  const [normalFlatMult, setNormalFlatMult] = useState<number>(
    activeConfig?.overtimeConfig?.normalWorkday?.flatSalaryMultiplier || activeConfig?.overtimeConfig?.normalWorkday?.flatMultiplier || 1.5
  );

  // Custom Tiered Multipliers & Nominals for Normal Day (Min 2, Max 8)
  const [normalTieredMults, setNormalTieredMults] = useState<number[]>(
    activeConfig?.overtimeConfig?.normalWorkday?.tieredMultipliers && activeConfig.overtimeConfig.normalWorkday.tieredMultipliers.length >= 2
      ? activeConfig.overtimeConfig.normalWorkday.tieredMultipliers
      : [activeConfig?.overtimeConfig?.normalWorkday?.multiplierFirstHour || 1.5, activeConfig?.overtimeConfig?.normalWorkday?.multiplierNextHours || 2.0]
  );
  const [normalTieredNominals, setNormalTieredNominals] = useState<number[]>(
    activeConfig?.overtimeConfig?.normalWorkday?.tieredNominals && activeConfig.overtimeConfig.normalWorkday.tieredNominals.length >= 2
      ? activeConfig.overtimeConfig.normalWorkday.tieredNominals
      : [activeConfig?.overtimeConfig?.normalWorkday?.staticFirstHourRate || 35000, activeConfig?.overtimeConfig?.normalWorkday?.staticNextHoursRate || 45000]
  );

  // Offday (Hari Libur / Istirahat)
  const [offdayCalcType, setOffdayCalcType] = useState<'multiplier' | 'static'>(
    activeConfig?.overtimeConfig?.offday?.calculationType || 'multiplier'
  );
  const [offdayCalcBasis, setOffdayCalcBasis] = useState<OvertimeCalculationBasis>(
    normalizeBasis(activeConfig?.overtimeConfig?.offday?.calculationBasis)
  );
  const [offdayStaticRate, setOffdayStaticRate] = useState<number>(
    activeConfig?.overtimeConfig?.offday?.ratePerHour || 50000
  );
  const [offdayStaticFirstHourRate, setOffdayStaticFirstHourRate] = useState<number>(
    activeConfig?.overtimeConfig?.offday?.staticFirstHourRate || 50000
  );
  const [offdayStaticNextHoursRate, setOffdayStaticNextHoursRate] = useState<number>(
    activeConfig?.overtimeConfig?.offday?.staticNextHoursRate || 60000
  );
  const [offdayBaseDivider, setOffdayBaseDivider] = useState<number>(
    activeConfig?.overtimeConfig?.offday?.baseDivider || 173
  );
  const [offdayMultFirst, setOffdayMultFirst] = useState<number>(
    activeConfig?.overtimeConfig?.offday?.multiplierFirstHour || 2.0
  );
  const [offdayMultNext, setOffdayMultNext] = useState<number>(
    activeConfig?.overtimeConfig?.offday?.multiplierNextHours || 2.0
  );
  const [offdayFlatMult, setOffdayFlatMult] = useState<number>(
    activeConfig?.overtimeConfig?.offday?.flatSalaryMultiplier || activeConfig?.overtimeConfig?.offday?.flatMultiplier || 2.0
  );

  // Custom Tiered Multipliers & Nominals for Offday (Min 2, Max 8)
  const [offdayTieredMults, setOffdayTieredMults] = useState<number[]>(
    activeConfig?.overtimeConfig?.offday?.tieredMultipliers && activeConfig.overtimeConfig.offday.tieredMultipliers.length >= 2
      ? activeConfig.overtimeConfig.offday.tieredMultipliers
      : [activeConfig?.overtimeConfig?.offday?.multiplierFirstHour || 2.0, activeConfig?.overtimeConfig?.offday?.multiplierNextHours || 2.0]
  );
  const [offdayTieredNominals, setOffdayTieredNominals] = useState<number[]>(
    activeConfig?.overtimeConfig?.offday?.tieredNominals && activeConfig.overtimeConfig.offday.tieredNominals.length >= 2
      ? activeConfig.overtimeConfig.offday.tieredNominals
      : [activeConfig?.overtimeConfig?.offday?.staticFirstHourRate || 50000, activeConfig?.overtimeConfig?.offday?.staticNextHoursRate || 60000]
  );

  // Synchronize state when activeConfig changes
  useEffect(() => {
    if (activeConfig) {
      setMinOvertimeMinutes(activeConfig.minimumOvertimeMinutes ?? 60);
      setIsAutoOvertime(activeConfig.autoOvertime !== false);
      if (activeConfig.overtimeConfig) {
        const oc = activeConfig.overtimeConfig;
        if (oc.normalWorkday) {
          setNormalCalcType(oc.normalWorkday.calculationType || 'multiplier');
          setNormalCalcBasis(normalizeBasis(oc.normalWorkday.calculationBasis));
          setNormalStaticRate(oc.normalWorkday.ratePerHour || 25000);
          setNormalStaticFirstHourRate(oc.normalWorkday.staticFirstHourRate || 35000);
          setNormalStaticNextHoursRate(oc.normalWorkday.staticNextHoursRate || 45000);
          setNormalBaseDivider(oc.normalWorkday.baseDivider || 173);
          setNormalMultFirst(oc.normalWorkday.multiplierFirstHour || 1.5);
          setNormalMultNext(oc.normalWorkday.multiplierNextHours || 2.0);
          setNormalFlatMult(oc.normalWorkday.flatSalaryMultiplier || oc.normalWorkday.flatMultiplier || 1.5);

          if (oc.normalWorkday.tieredMultipliers && Array.isArray(oc.normalWorkday.tieredMultipliers) && oc.normalWorkday.tieredMultipliers.length >= 2) {
            setNormalTieredMults(oc.normalWorkday.tieredMultipliers);
          } else {
            setNormalTieredMults([oc.normalWorkday.multiplierFirstHour || 1.5, oc.normalWorkday.multiplierNextHours || 2.0]);
          }

          if (oc.normalWorkday.tieredNominals && Array.isArray(oc.normalWorkday.tieredNominals) && oc.normalWorkday.tieredNominals.length >= 2) {
            setNormalTieredNominals(oc.normalWorkday.tieredNominals);
          } else {
            setNormalTieredNominals([oc.normalWorkday.staticFirstHourRate || 35000, oc.normalWorkday.staticNextHoursRate || 45000]);
          }
        }
        if (oc.offday) {
          setOffdayCalcType(oc.offday.calculationType || 'multiplier');
          setOffdayCalcBasis(normalizeBasis(oc.offday.calculationBasis));
          setOffdayStaticRate(oc.offday.ratePerHour || 50000);
          setOffdayStaticFirstHourRate(oc.offday.staticFirstHourRate || 50000);
          setOffdayStaticNextHoursRate(oc.offday.staticNextHoursRate || 60000);
          setOffdayBaseDivider(oc.offday.baseDivider || 173);
          setOffdayMultFirst(oc.offday.multiplierFirstHour || 2.0);
          setOffdayMultNext(oc.offday.multiplierNextHours || 2.0);
          setOffdayFlatMult(oc.offday.flatSalaryMultiplier || oc.offday.flatMultiplier || 2.0);

          if (oc.offday.tieredMultipliers && Array.isArray(oc.offday.tieredMultipliers) && oc.offday.tieredMultipliers.length >= 2) {
            setOffdayTieredMults(oc.offday.tieredMultipliers);
          } else {
            setOffdayTieredMults([oc.offday.multiplierFirstHour || 2.0, oc.offday.multiplierNextHours || 2.0]);
          }

          if (oc.offday.tieredNominals && Array.isArray(oc.offday.tieredNominals) && oc.offday.tieredNominals.length >= 2) {
            setOffdayTieredNominals(oc.offday.tieredNominals);
          } else {
            setOffdayTieredNominals([oc.offday.staticFirstHourRate || 50000, oc.offday.staticNextHoursRate || 60000]);
          }
        }

        if (oc.normalWorkday && oc.offday) {
          const isSameType = oc.normalWorkday.calculationType === oc.offday.calculationType;
          const isSameBasis = normalizeBasis(oc.normalWorkday.calculationBasis) === normalizeBasis(oc.offday.calculationBasis);
          const isSameRate = oc.normalWorkday.ratePerHour === oc.offday.ratePerHour;
          const isSameDivider = oc.normalWorkday.baseDivider === oc.offday.baseDivider;
          if (isSameType && isSameBasis && isSameRate && isSameDivider) {
            setDayMode('unified');
          } else {
            setDayMode('separate');
          }
        }
      }
    }
  }, [activeConfig]);

  // Track initial snapshot for detecting changes in modal
  const [initialSnapshot, setInitialSnapshot] = useState<string>('');

  const currentSnapshotStr = useMemo(() => {
    return JSON.stringify({
      minOvertimeMinutes,
      isAutoOvertime,
      dayMode,
      normalCalcType,
      normalCalcBasis,
      normalStaticRate,
      normalStaticFirstHourRate,
      normalStaticNextHoursRate,
      normalBaseDivider,
      normalMultFirst,
      normalMultNext,
      normalFlatMult,
      normalTieredMults,
      normalTieredNominals,
      offdayCalcType,
      offdayCalcBasis,
      offdayStaticRate,
      offdayStaticFirstHourRate,
      offdayStaticNextHoursRate,
      offdayBaseDivider,
      offdayMultFirst,
      offdayMultNext,
      offdayFlatMult,
      offdayTieredMults,
      offdayTieredNominals,
    });
  }, [
    minOvertimeMinutes,
    isAutoOvertime,
    dayMode,
    normalCalcType,
    normalCalcBasis,
    normalStaticRate,
    normalStaticFirstHourRate,
    normalStaticNextHoursRate,
    normalBaseDivider,
    normalMultFirst,
    normalMultNext,
    normalFlatMult,
    normalTieredMults,
    normalTieredNominals,
    offdayCalcType,
    offdayCalcBasis,
    offdayStaticRate,
    offdayStaticFirstHourRate,
    offdayStaticNextHoursRate,
    offdayBaseDivider,
    offdayMultFirst,
    offdayMultNext,
    offdayFlatMult,
    offdayTieredMults,
    offdayTieredNominals,
  ]);

  useEffect(() => {
    if (isConfigModalOpen) {
      setInitialSnapshot(currentSnapshotStr);
    }
  }, [isConfigModalOpen, currentSnapshotStr]);

  const hasChanges = useMemo(() => {
    return initialSnapshot !== '' && currentSnapshotStr !== initialSnapshot;
  }, [initialSnapshot, currentSnapshotStr]);

  const isConfigValid = useMemo(() => {
    if (minOvertimeMinutes < 0) return false;

    const validateScheme = (
      calcType: 'multiplier' | 'static',
      calcBasis: OvertimeCalculationBasis,
      baseDivider: number,
      staticRate: number,
      flatMult: number,
      tieredMults: number[],
      tieredNominals: number[]
    ) => {
      if (calcType === 'multiplier') {
        if (calcBasis === 'manual_divider' && (!baseDivider || baseDivider <= 0)) return false;
        if (calcBasis === 'nominal') {
          if (!tieredNominals || tieredNominals.length < 2 || tieredNominals.some(n => !n || n <= 0 || isNaN(n))) return false;
        } else {
          if (!tieredMults || tieredMults.length < 2 || tieredMults.some(m => isNaN(m) || m < 0)) return false;
        }
      } else {
        if (calcBasis === 'manual_divider' && (!baseDivider || baseDivider <= 0)) return false;
        if (calcBasis === 'nominal' && (!staticRate || staticRate <= 0)) return false;
        if ((calcBasis === 'salary_hourly' || calcBasis === 'government' || calcBasis === 'manual_divider') && isNaN(flatMult)) return false;
      }
      return true;
    };

    if (!validateScheme(normalCalcType, normalCalcBasis, normalBaseDivider, normalStaticRate, normalFlatMult, normalTieredMults, normalTieredNominals)) {
      return false;
    }

    if (dayMode === 'separate') {
      if (!validateScheme(offdayCalcType, offdayCalcBasis, offdayBaseDivider, offdayStaticRate, offdayFlatMult, offdayTieredMults, offdayTieredNominals)) {
        return false;
      }
    }

    return true;
  }, [
    minOvertimeMinutes,
    dayMode,
    normalCalcType,
    normalCalcBasis,
    normalBaseDivider,
    normalStaticRate,
    normalFlatMult,
    normalTieredMults,
    normalTieredNominals,
    offdayCalcType,
    offdayCalcBasis,
    offdayBaseDivider,
    offdayStaticRate,
    offdayFlatMult,
    offdayTieredMults,
    offdayTieredNominals,
  ]);

  // Live queries from Dexie DB
  const employees = useLiveQuery(async () => {
    try {
      return await db.employees.toArray();
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

  const shiftSchedules = useLiveQuery(async () => {
    try {
      return await db.shiftSchedules.toArray();
    } catch {
      return [];
    }
  }) || [];

  const extraShifts = useLiveQuery(async () => {
    try {
      if (!db.extraShifts) return [];
      const list = await db.extraShifts.toArray();
      return list.sort((a, b) => (b.workDate || b.createdAt).localeCompare(a.workDate || a.createdAt));
    } catch {
      return [];
    }
  }) || [];

  const empMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);
  const posMap = useMemo(() => new Map(positions.map(p => [p.id, p])), [positions]);

  const customSchedulesMap = useMemo(() => {
    const map = new Map<string, ShiftSchedule>();
    shiftSchedules.forEach(s => {
      map.set(`${s.employeeId}_${s.date}`, s);
    });
    return map;
  }, [shiftSchedules]);

  useScrollLock(isExtraModalOpen || isConfigModalOpen);

  const buildOvertimeConfigPayload = (): OvertimeConfig => {
    const normalMults = normalTieredMults.length >= 2 ? normalTieredMults : [normalMultFirst, normalMultNext];
    const normalNominals = normalTieredNominals.length >= 2 ? normalTieredNominals : [normalStaticFirstHourRate, normalStaticNextHoursRate];
    const offdayMults = offdayTieredMults.length >= 2 ? offdayTieredMults : [offdayMultFirst, offdayMultNext];
    const offdayNominals = offdayTieredNominals.length >= 2 ? offdayTieredNominals : [offdayStaticFirstHourRate, offdayStaticNextHoursRate];

    const normalWorkday = {
      calculationType: normalCalcType,
      calculationBasis: normalCalcBasis,
      ratePerHour: Number(normalStaticRate) || 0,
      baseDivider: Number(normalBaseDivider) || 173,
      multiplierFirstHour: Number(normalMults[0]) || 1.5,
      multiplierNextHours: Number(normalMults[normalMults.length - 1]) || 2.0,
      flatMultiplier: normalCalcType === 'static' ? (Number(normalFlatMult) || 1.5) : (Number(normalMults[0]) || 1.5),
      flatSalaryMultiplier: Number(normalFlatMult) || 1.5,
      staticFirstHourRate: Number(normalNominals[0]) || 0,
      staticNextHoursRate: Number(normalNominals[normalNominals.length - 1]) || 0,
      tieredMultipliers: normalMults,
      tieredNominals: normalNominals,
    };

    const offday = dayMode === 'unified'
      ? { ...normalWorkday }
      : {
          calculationType: offdayCalcType,
          calculationBasis: offdayCalcBasis,
          ratePerHour: Number(offdayStaticRate) || 0,
          baseDivider: Number(offdayBaseDivider) || 173,
          multiplierFirstHour: Number(offdayMults[0]) || 2.0,
          multiplierNextHours: Number(offdayMults[offdayMults.length - 1]) || 2.0,
          flatMultiplier: offdayCalcType === 'static' ? (Number(offdayFlatMult) || 2.0) : (Number(offdayMults[0]) || 2.0),
          flatSalaryMultiplier: Number(offdayFlatMult) || 2.0,
          staticFirstHourRate: Number(offdayNominals[0]) || 0,
          staticNextHoursRate: Number(offdayNominals[offdayNominals.length - 1]) || 0,
          tieredMultipliers: offdayMults,
          tieredNominals: offdayNominals,
        };

    return {
      dayMode,
      minimumOvertimeMinutes: Number(minOvertimeMinutes) || 0,
      autoOvertime: isAutoOvertime,
      normalWorkday,
      offday,
      updatedAt: new Date().toISOString(),
    };
  };

  // Auto-save Overtime Configuration whenever valid configuration changes
  useEffect(() => {
    if (!isConfigModalOpen || !hasChanges || !isConfigValid) return;

    const timer = setTimeout(async () => {
      setIsSavingConfig(true);
      try {
        const updatedOvertimeConfig = buildOvertimeConfigPayload();
        const currentCfg = activeConfig || await getAttendanceConfig();
        const updatedConfig: AttendanceConfig = {
          ...currentCfg,
          minimumOvertimeMinutes: Number(minOvertimeMinutes) || 0,
          autoOvertime: isAutoOvertime,
          overtimeConfig: updatedOvertimeConfig,
        };

        await saveAttendanceConfig(updatedConfig);
        setInitialSnapshot(currentSnapshotStr);
      } catch (err) {
        console.error('Auto-saving overtime config error:', err);
      } finally {
        setIsSavingConfig(false);
      }
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfigModalOpen, hasChanges, isConfigValid, currentSnapshotStr, activeConfig]);

  const handleSaveOvertimeConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingConfig(true);
    try {
      const updatedOvertimeConfig = buildOvertimeConfigPayload();
      const currentCfg = activeConfig || await getAttendanceConfig();
      const updatedConfig: AttendanceConfig = {
        ...currentCfg,
        minimumOvertimeMinutes: Number(minOvertimeMinutes) || 0,
        autoOvertime: isAutoOvertime,
        overtimeConfig: updatedOvertimeConfig,
      };

      await saveAttendanceConfig(updatedConfig);
      setInitialSnapshot(currentSnapshotStr);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const selectedEmpObj = useMemo(() => empMap.get(extraEmp), [empMap, extraEmp]);

  const isNonShiftEmployee = useMemo(() => {
    if (!selectedEmpObj) return false;
    const systemType = activeConfig?.systemType || 'normal';
    if (systemType === 'normal') return true;
    const deptAssign = activeConfig?.departmentAssignments?.find(d => d.departmentId === selectedEmpObj.departmentId);
    if (!deptAssign || deptAssign.mode === 'normal' || !deptAssign.shiftPatternId) {
      return true;
    }
    return false;
  }, [selectedEmpObj, activeConfig]);

  const detectedMandatoryShift = useMemo(() => {
    if (!selectedEmpObj || !extraWorkDate) return null;
    return getEffectiveShiftForEmployee(selectedEmpObj, extraWorkDate, activeConfig || null, customSchedulesMap);
  }, [selectedEmpObj, extraWorkDate, activeConfig, customSchedulesMap]);

  const allowedExtraShifts = useMemo(() => {
    if (isNonShiftEmployee || !detectedMandatoryShift) return availableShifts;
    const mandatoryId = detectedMandatoryShift.shiftId;
    return availableShifts.map(s => ({
      ...s,
      isDisabled: !detectedMandatoryShift.isOff && s.id === mandatoryId,
    }));
  }, [availableShifts, detectedMandatoryShift, isNonShiftEmployee]);

  useEffect(() => {
    if (isNonShiftEmployee) {
      setSelectedExtraShiftId('HOURLY');
    } else if (selectedExtraShiftId === 'HOURLY') {
      setSelectedExtraShiftId('');
    } else if (
      selectedExtraShiftId &&
      allowedExtraShifts.find(s => s.id === selectedExtraShiftId && 'isDisabled' in s && s.isDisabled)
    ) {
      setSelectedExtraShiftId('');
    }
  }, [allowedExtraShifts, isNonShiftEmployee, selectedExtraShiftId]);

  const handleOpenModal = () => {
    setEditingExtraId(null);
    setExtraEmp('');
    setExtraWorkDate('');
    setSelectedExtraShiftId('');
    setDurationHours(minOvertimeMinutes ? Number((minOvertimeMinutes / 60).toFixed(1)) : 2);
    setCustomStartTime('17:00');
    setCustomEndTime('20:00');
    setExtraReason('');
    setIsExtraModalOpen(true);
  };

  const handleEditExtraModal = (extra: ExtraShift) => {
    setEditingExtraId(extra.id);
    setExtraEmp(extra.employeeId || '');
    setExtraWorkDate(extra.workDate || '');
    setSelectedExtraShiftId(extra.shiftId === 'HOURLY' ? '' : (extra.shiftId || ''));
    setDurationHours(extra.durationHours || 1);
    setExtraReason(extra.reason || '');
    setIsExtraModalOpen(true);
  };

  const handleSaveExtra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraEmp) {
      alert('Silakan pilih karyawan terlebih dahulu.');
      return;
    }
    if (!extraWorkDate) {
      alert('Silakan pilih tanggal kerja tambahan.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingExtraId) {
        await deleteExtraShift(editingExtraId);
      }

      if (isNonShiftEmployee) {
        const isOff = detectedMandatoryShift
          ? detectedMandatoryShift.isOff
          : isShiftOff(undefined, undefined);
        const mandShiftId = isOff ? 'OFF' : (detectedMandatoryShift?.shiftId || 'NORMAL');
        const mandShiftName = detectedMandatoryShift?.shiftName || (isOff ? 'Libur (OFF)' : 'Jam Kerja Normal');
        const wageCategory = resolveWageCategory({ mandatoryShiftId: mandShiftId, mandatoryShiftName: mandShiftName }, activeConfig, dayMode);

        await createExtraShift({
          employeeId: extraEmp,
          workDate: extraWorkDate,
          shiftId: 'HOURLY',
          shiftName: `Lembur / Jam Tambahan (${Math.round(Number(durationHours) || 1)} Jam)`,
          extraType: 'hourly',
          durationHours: Math.round(Number(durationHours) || 1),
          customStartTime,
          customEndTime,
          isNonShiftEmployee: true,
          mandatoryShiftId: mandShiftId,
          mandatoryShiftName: mandShiftName,
          wageCategory,
          reason: extraReason.trim(),
        });
      } else {
        const chosenShift = availableShifts.find(s => s.id === selectedExtraShiftId);
        if (!chosenShift) {
          alert('Silakan pilih shift tambahan yang valid.');
          setIsSubmitting(false);
          return;
        }

        const calculatedHours = Math.round(Number(durationHours) || 8);
        let calculatedExtraType: 'full_shift' | 'half_shift' | 'custom_hours' = 'custom_hours';
        if (calculatedHours === 8) calculatedExtraType = 'full_shift';
        else if (calculatedHours === 4) calculatedExtraType = 'half_shift';

        const isOff = detectedMandatoryShift
          ? detectedMandatoryShift.isOff
          : isShiftOff(undefined, undefined);
        const mandShiftId = detectedMandatoryShift?.shiftId || (isOff ? 'shift-off' : 'shift-reguler');
        const mandShiftName = detectedMandatoryShift?.shiftName || (isOff ? 'Libur (OFF)' : 'Shift Wajib');
        const wageCategory = resolveWageCategory({ mandatoryShiftId: mandShiftId, mandatoryShiftName: mandShiftName }, activeConfig, dayMode);

        await createExtraShift({
          employeeId: extraEmp,
          workDate: extraWorkDate,
          shiftId: chosenShift.id,
          shiftName: chosenShift.name,
          extraType: calculatedExtraType,
          durationHours: calculatedHours,
          customStartTime: chosenShift.startTime,
          customEndTime: chosenShift.endTime,
          isNonShiftEmployee: false,
          mandatoryShiftId: mandShiftId,
          mandatoryShiftName: mandShiftName,
          wageCategory,
          reason: extraReason.trim(),
        });
      }

      setEditingExtraId(null);
      setIsExtraModalOpen(false);
      alert('Jadwal shift tambahan / lemburan berhasil disimpan!');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan shift tambahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredExtraShifts = useMemo(() => {
    if (!searchTable.trim()) return extraShifts;
    const q = searchTable.toLowerCase();
    return extraShifts.filter(extra => {
      const empName = empMap.get(extra.employeeId)?.fullName.toLowerCase() || '';
      const shiftName = (extra.shiftName || '').toLowerCase();
      const reason = (extra.reason || '').toLowerCase();
      return empName.includes(q) || shiftName.includes(q) || reason.includes(q);
    });
  }, [extraShifts, searchTable, empMap]);

  const isNormalMode = (activeConfig?.systemType || 'normal') === 'normal';
  const pageTitle = isNormalMode ? 'Lembur' : 'Shift Tambahan';

  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`relative h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white border hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all ${
          searchTable
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari"
      >
        <Search className="w-4 h-4 stroke-[1.8]" />
        {searchTable && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setIsConfigModalOpen(true)}
        title="Konfigurasi Lembur & Upah Lemburan"
        className="h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center shrink-0"
      >
        <SlidersHorizontal className="w-4 h-4 stroke-[1.8]" />
      </button>

      <button
        type="button"
        onClick={handleOpenModal}
        title={isNormalMode ? 'Buat Jadwal Lembur' : 'Buat Shift Tambahan / Lembur'}
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xs shrink-0 transition-all cursor-pointer"
      >
        <PlusCircle className="w-4 h-4 stroke-[2]" />
      </button>
    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col space-y-4">
      <HideBottomNav />
      <PageHeaderTitle
        title={pageTitle}
        subtitle="Penjadwalan Lembur & Jam Tambahan"
        onBack={onBack}
        hideHamburger={true}
      />

      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
          <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>
        </>
      )}

      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={searchTable}
          onSearchChange={setSearchTable}
          onClose={() => setIsSearchOpen(false)}
          placeholder="Cari karyawan / catatan..."
        />
      )}

      {filteredExtraShifts.length === 0 ? (
        <div className="mt-2 w-full flex-1 flex flex-col">
          <InitialEmptyCard
            title="Catat Shift Tambahan & Lembur!"
            description="Buat dan kelola jam lembur atau jadwal shift ekstra karyawan dengan mudah."
            buttonText={isNormalMode ? 'Buat Jadwal Lembur' : 'Buat Shift Tambahan / Lembur'}
            ButtonIcon={Clock}
            onAction={handleOpenModal}
            animationData={emptyShiftAnimation}
          />
        </div>
      ) : (
        <ModalTabel
          filteredExtraShifts={filteredExtraShifts}
          empMap={empMap}
          posMap={posMap}
          getShiftBadge={getShiftBadge}
          activeConfig={activeConfig}
          dayMode={dayMode}
          offdayCalcType={offdayCalcType}
          offdayCalcBasis={offdayCalcBasis}
          offdayMultFirst={offdayMultFirst}
          offdayMultNext={offdayMultNext}
          offdayStaticRate={offdayStaticRate}
          offdayFlatMult={offdayFlatMult}
          normalCalcType={normalCalcType}
          normalCalcBasis={normalCalcBasis}
          normalMultFirst={normalMultFirst}
          normalMultNext={normalMultNext}
          normalStaticRate={normalStaticRate}
          normalFlatMult={normalFlatMult}
          deleteExtraShift={deleteExtraShift}
          normalBaseDivider={normalBaseDivider}
          offdayBaseDivider={offdayBaseDivider}
          onEdit={handleEditExtraModal}
        />
      )}

      <FormJadwalTambahan
        isExtraModalOpen={isExtraModalOpen}
        setIsExtraModalOpen={setIsExtraModalOpen}
        handleSaveExtra={handleSaveExtra}
        extraEmp={extraEmp}
        setExtraEmp={setExtraEmp}
        employees={employees}
        extraWorkDate={extraWorkDate}
        setExtraWorkDate={setExtraWorkDate}
        durationHours={durationHours}
        setDurationHours={setDurationHours}
        selectedEmpObj={selectedEmpObj}
        isNonShiftEmployee={isNonShiftEmployee}
        getShiftBadge={getShiftBadge}
        detectedMandatoryShift={detectedMandatoryShift}
        availableShifts={availableShifts}
        selectedExtraShiftId={selectedExtraShiftId}
        setSelectedExtraShiftId={setSelectedExtraShiftId}
        extraReason={extraReason}
        setExtraReason={setExtraReason}
        isSubmitting={isSubmitting}
      />

      <ModalKonfigurasi
        isConfigModalOpen={isConfigModalOpen}
        setIsConfigModalOpen={setIsConfigModalOpen}
        isSavingConfig={isSavingConfig}
        handleSaveOvertimeConfig={handleSaveOvertimeConfig}
        dayMode={dayMode}
        setDayMode={setDayMode}
        isAutoOvertime={isAutoOvertime}
        setIsAutoOvertime={setIsAutoOvertime}
        showPresensiInfo={showPresensiInfo}
        setShowPresensiInfo={setShowPresensiInfo}
        minOvertimeMinutes={minOvertimeMinutes}
        setMinOvertimeMinutes={setMinOvertimeMinutes}
        normalCalcType={normalCalcType}
        setNormalCalcType={setNormalCalcType}
        normalCalcBasis={normalCalcBasis}
        setNormalCalcBasis={setNormalCalcBasis}
        normalBaseDivider={normalBaseDivider}
        setNormalBaseDivider={setNormalBaseDivider}
        normalTieredMults={normalTieredMults}
        setNormalTieredMults={setNormalTieredMults}
        normalTieredNominals={normalTieredNominals}
        setNormalTieredNominals={setNormalTieredNominals}
        normalFlatMult={normalFlatMult}
        setNormalFlatMult={setNormalFlatMult}
        normalStaticRate={normalStaticRate}
        setNormalStaticRate={setNormalStaticRate}
        offdayCalcType={offdayCalcType}
        setOffdayCalcType={setOffdayCalcType}
        offdayCalcBasis={offdayCalcBasis}
        setOffdayCalcBasis={setOffdayCalcBasis}
        offdayBaseDivider={offdayBaseDivider}
        setOffdayBaseDivider={setOffdayBaseDivider}
        offdayTieredMults={offdayTieredMults}
        setOffdayTieredMults={setOffdayTieredMults}
        offdayTieredNominals={offdayTieredNominals}
        setOffdayTieredNominals={setOffdayTieredNominals}
        offdayFlatMult={offdayFlatMult}
        setOffdayFlatMult={setOffdayFlatMult}
        offdayStaticRate={offdayStaticRate}
        setOffdayStaticRate={setOffdayStaticRate}
        normalMultFirst={normalMultFirst}
        normalMultNext={normalMultNext}
        normalStaticFirstHourRate={normalStaticFirstHourRate}
        normalStaticNextHoursRate={normalStaticNextHoursRate}
        offdayMultFirst={offdayMultFirst}
        offdayMultNext={offdayMultNext}
        offdayStaticFirstHourRate={offdayStaticFirstHourRate}
        offdayStaticNextHoursRate={offdayStaticNextHoursRate}
        hasChanges={hasChanges}
        isConfigValid={isConfigValid}
      />
    </div>
  );
}
