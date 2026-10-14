import React, { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../../db/database';
import { AttendanceConfig, Attendance } from '../../../types';
import { useCompany } from '../../../context/CompanyContext';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { saveAttendanceConfig } from '../../../services/attendanceConfigService';
import { calculateAttendance } from '../../../services/attendanceCalculator';
import { setSingleShiftSchedule } from '../../../services/shiftService';
import { getPositionName, getDepartmentName } from '../../../services/positionService';

import { 
  Search, 
  Settings, 
  Plus, 
  ChevronDown,
  Users,
  QrCode
} from 'lucide-react';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch 
} from '../../../context/MobileNavContext';
import { 
  PresentNowProps, 
  ViewMode, 
  EmployeeAttendanceItem, 
  PresensiFormData, 
  QuickUpdatePayload 
} from './types';
import { todayStr, calculateAttendanceStats, formatFullDateIndo } from './utils-helper';
import { PresensiHeader } from './presensi-header';
import emptyAttendanceAnimation from '../../../assets/animations/empty-attendance.json';
import { StatsSummary } from './stats-summary';
import { PresensiCardView } from './presensi-card-view';
import { PresensiTableView } from './presensi-table-view';
import { InitialEmptyCard } from '../../../components/ui/initial-empty-card';
import { ModalTools, LiburType } from './modal-tools';
import { ModalScan } from './modal-scan';
import { ModalPresensiManual } from './modal-presensi-manual';
import { ModalMassShift } from './modal-mass-shift';
import { ModalFilter } from './modal-filter';
import { ModalShiftFilter } from './modal-shift-filter';
import { ModalPengaturan } from './modal-pengaturan';
import { getEffectiveShiftForEmployee } from '../../../services/rosterService';
import { ShiftSchedule } from '../../../types';

export function PresentNow({ 
  config: initialConfig,
  onConfigSaved,
  onSubViewChange
}: PresentNowProps) {
  const { requireCompanyRegistration } = useCompany();

  // Real-time live attendance config from Dexie settings (reflects any changes in Jadwal & Shift immediately)
  const liveSettingsRecord = useLiveQuery(() => db.settings.get('attendanceConfig'));
  const liveConfig = (liveSettingsRecord && (liveSettingsRecord as unknown as AttendanceConfig).systemType)
    ? (liveSettingsRecord as unknown as AttendanceConfig)
    : null;
  const attendanceConfig = liveConfig || initialConfig;

  // Filter & View State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [shiftFilter, setShiftFilter] = useState<string>('ALL');
  const [filterDate, setFilterDate] = useState(todayStr);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [showStats, setShowStats] = useState(false);

  // Modal Visibility State
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [openedFromTools, setOpenedFromTools] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMassShiftModalOpen, setIsMassShiftModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  // Config Modal State
  const [lateTolerance, setLateTolerance] = useState<number>(15);
  const [earlyLeaveTolerance, setEarlyLeaveTolerance] = useState<number>(0);
  const [savingConfig, setSavingConfig] = useState(false);

  // Mass Shift Modal State
  const [massShiftId, setMassShiftId] = useState('');

  // Manual Form State
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
  const [formData, setFormData] = useState<PresensiFormData>({
    employeeId: '',
    date: todayStr,
    shiftId: '',
    checkIn: '08:00',
    checkOut: '17:00',
    status: 'Present',
    notes: '',
  });

  useEffect(() => {
    if (attendanceConfig) {
      setLateTolerance(attendanceConfig.lateToleranceMinutes || 0);
      setEarlyLeaveTolerance(attendanceConfig.earlyLeaveToleranceMinutes || 0);
    }
  }, [attendanceConfig]);

  // Lock body scroll when any popup modal is open
  useScrollLock(isToolsModalOpen || isScanModalOpen || isModalOpen || isMassShiftModalOpen || isFilterModalOpen || isShiftModalOpen);

  // Dexie Queries
  const employees = useLiveQuery(() => db.employees.toArray()) || [];
  const departments = useLiveQuery(() => db.departments.toArray()) || [];
  const positions = useLiveQuery(() => db.positions.toArray()) || [];
  const attendanceRecords = useLiveQuery(
    () => db.attendance.where('date').equals(filterDate).toArray(),
    [filterDate]
  ) || [];
  const leavesRecords = useLiveQuery(
    () => db.leaves.filter(l => l.startDate <= filterDate && l.endDate >= filterDate && l.status === 'Approved').toArray(),
    [filterDate]
  ) || [];
  const shiftSchedulesRecords = useLiveQuery(
    async () => {
      try {
        if (!db.shiftSchedules) return [];
        return await db.shiftSchedules.where('date').equals(filterDate).toArray();
      } catch {
        return [];
      }
    },
    [filterDate]
  ) || [];

  // Maps for efficient lookup
  const deptMap = new Map(departments.map(d => [d.id, d.name]));
  const posMap = new Map(positions.map(p => [p.id, p.name]));
  const attendanceMap = new Map(attendanceRecords.map(r => [r.employeeId, r]));
  const leavesMap = new Map(leavesRecords.map(r => [r.employeeId, r]));
  const shiftScheduleMap = new Map(shiftSchedulesRecords.map(s => [s.employeeId, s]));
  const customSchedulesMap = useMemo(() => {
    const map = new Map<string, ShiftSchedule>();
    shiftSchedulesRecords.forEach(s => {
      map.set(`${s.employeeId}_${s.date}`, s);
    });
    return map;
  }, [shiftSchedulesRecords]);

  // Active employees (exclude terminated employees)
  const activeEmployees = employees.filter(e => e.status !== 'Terminated');

  // Combined records: Employee + Attendance Data on filterDate
  const allEmployeeAttendances: EmployeeAttendanceItem[] = activeEmployees.map(emp => {
    const attRecord = attendanceMap.get(emp.id);
    const leaveRecord = leavesMap.get(emp.id);
    const schedRecord = shiftScheduleMap.get(emp.id);
    const effectiveShift = getEffectiveShiftForEmployee(emp, filterDate, attendanceConfig, customSchedulesMap);
    
    let currentStatus = attRecord ? attRecord.status : 'NotSet';
    if (!attRecord && leaveRecord) {
      currentStatus = 'Leave';
    }

    const assignedShiftId = attRecord?.shiftId || schedRecord?.shiftId || (effectiveShift.isOff ? 'OFF' : effectiveShift.shiftId) || '';
    const assignedShiftName = attRecord?.shiftName || schedRecord?.shiftName || effectiveShift.shiftName || '';
    const posName = getPositionName(emp.positionId) || posMap.get(emp.positionId) || 'Staff';
    const deptName = getDepartmentName(deptMap.get(emp.departmentId) || emp.departmentId, emp.positionId) || 'Umum';

    return {
      employee: emp,
      departmentName: deptName,
      positionName: posName,
      attendance: attRecord || null,
      leaveRecord: leaveRecord || null,
      schedRecord: schedRecord || null,
      hasRecord: !!attRecord,
      status: currentStatus,
      checkIn: attRecord?.checkIn || '',
      checkOut: attRecord?.checkOut || '',
      shiftId: assignedShiftId,
      shiftName: assignedShiftName,
      notes: attRecord?.notes || (schedRecord?.notes ? `Roster: ${schedRecord.notes}` : (effectiveShift.notes ? `Roster: ${effectiveShift.notes}` : (leaveRecord ? `Cuti: ${leaveRecord.leaveType}` : ''))),
    };
  });

  // Filtered list based on search, department, status, and shift
  const filteredEmployeeAttendances = allEmployeeAttendances.filter(item => {
    // Search filter
    const matchesSearch = !search || 
      item.employee.fullName.toLowerCase().includes(search.toLowerCase()) || 
      item.employee.employeeId.toLowerCase().includes(search.toLowerCase());
    
    // Department filter
    const matchesDept = departmentFilter === 'ALL' || item.employee.departmentId === departmentFilter;

    // Status filter
    let matchesStatus = true;
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'NotSet') {
        matchesStatus = !item.hasRecord;
      } else if (statusFilter === 'LeaveGroup') {
        matchesStatus = item.status === 'Leave' || item.status === 'Sick';
      } else {
        matchesStatus = item.status === statusFilter;
      }
    }

    // Shift filter
    let matchesShift = true;
    if (shiftFilter !== 'ALL') {
      const targetShift = attendanceConfig?.shifts?.find(s => s.id === shiftFilter || s.code === shiftFilter);
      if (targetShift) {
        matchesShift = item.shiftId === targetShift.id || 
                       item.shiftName.toLowerCase().includes(targetShift.name.toLowerCase()) || 
                       (targetShift.code && item.shiftName.toLowerCase().includes(targetShift.code.toLowerCase()));
      } else {
        matchesShift = item.shiftId === shiftFilter || item.shiftName === shiftFilter;
      }
    }

    return matchesSearch && matchesDept && matchesStatus && matchesShift;
  });

  // Daily statistics
  const totalActiveEmployees = activeEmployees.length;
  const stats = calculateAttendanceStats(totalActiveEmployees, attendanceRecords);

  // Quick Update for a Single Employee Row / Card
  const handleQuickUpdate = async (employeeId: string, updates: QuickUpdatePayload) => {
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Anda sedang dalam mode eksplorasi. Daftarkan profil perusahaan Anda terlebih dahulu untuk menyimpan data kehadiran.'
    })) {
      return;
    }

    const existing = attendanceMap.get(employeeId);
    const schedRecord = shiftScheduleMap.get(employeeId);
    const empObj = employees.find(e => e.id === employeeId);
    const effectiveShift = empObj ? getEffectiveShiftForEmployee(empObj, filterDate, attendanceConfig, customSchedulesMap) : null;
    const defaultShift = attendanceConfig?.shifts?.find(s => s.id === existing?.shiftId) ||
      attendanceConfig?.shifts?.find(s => s.id === schedRecord?.shiftId) ||
      attendanceConfig?.shifts?.find(s => s.id === effectiveShift?.shiftId) ||
      attendanceConfig?.shifts?.find(s => s.isDefault) || 
      attendanceConfig?.shifts?.[0];
    
    let shiftId = updates.shiftId !== undefined ? updates.shiftId : (existing?.shiftId || defaultShift?.id || '');
    let shiftName = existing?.shiftName || (effectiveShift?.shiftName || '');

    if (attendanceConfig?.systemType === 'shift' && shiftId) {
      const shiftObj = attendanceConfig.shifts?.find(s => s.id === shiftId);
      if (shiftObj) {
        shiftName = `${shiftObj.name} (${shiftObj.startTime} - ${shiftObj.endTime})`;
      }
    }

    // Default time fallbacks
    let defaultCheckIn = attendanceConfig?.systemType === 'shift' && defaultShift
      ? defaultShift.startTime
      : (attendanceConfig?.normalStartTime || '08:00');

    let defaultCheckOut = attendanceConfig?.systemType === 'shift' && defaultShift
      ? defaultShift.endTime
      : (attendanceConfig?.normalEndTime || '17:00');

    // If shift is updated, reset checkIn & checkOut to shift's start & end time
    if (updates.shiftId && attendanceConfig?.systemType === 'shift') {
      const selectedShift = attendanceConfig.shifts?.find(s => s.id === updates.shiftId);
      if (selectedShift) {
        defaultCheckIn = selectedShift.startTime;
        defaultCheckOut = selectedShift.endTime;
      }
    }

    const finalCheckIn = updates.checkIn !== undefined ? updates.checkIn : (existing?.checkIn || defaultCheckIn);
    const finalCheckOut = updates.checkOut !== undefined ? updates.checkOut : (existing?.checkOut || defaultCheckOut);
    let finalStatus = updates.status !== undefined ? updates.status : (existing?.status || 'Present');

    let calcResult = null;
    if (attendanceConfig && finalStatus !== 'Leave' && finalStatus !== 'Sick' && finalStatus !== 'WFH') {
      const shiftObj = attendanceConfig.shifts?.find(s => s.id === shiftId);
      calcResult = calculateAttendance(finalCheckIn, finalCheckOut, attendanceConfig, shiftObj);
      if (updates.status === undefined) finalStatus = calcResult.status as any;
    }

    const payload: Attendance = {
      id: existing ? existing.id : uuidv4(),
      employeeId,
      date: filterDate,
      checkIn: finalCheckIn,
      checkOut: finalCheckOut,
      status: finalStatus,
      shiftId: attendanceConfig?.systemType === 'shift' ? shiftId : undefined,
      shiftName: attendanceConfig?.systemType === 'shift' ? shiftName : undefined,
      notes: updates.notes !== undefined ? updates.notes : (existing?.notes || ''),
      lateMinutes: calcResult ? calcResult.lateMinutes : undefined,
      earlyLeaveMinutes: calcResult ? calcResult.earlyLeaveMinutes : undefined,
      overtimeMinutes: calcResult ? calcResult.overtimeMinutes : undefined,
      workDurationMinutes: calcResult ? calcResult.workDurationMinutes : undefined,
    };

    await db.attendance.put(payload);
  };

  // Mass Apply Selected Shift
  const handleApplyMassShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Anda sedang dalam mode eksplorasi. Daftarkan profil perusahaan Anda terlebih dahulu untuk menyimpan data kehadiran.'
    })) {
      return;
    }

    if (!massShiftId) {
      alert('Silakan pilih shift terlebih dahulu.');
      return;
    }

    const selectedShift = attendanceConfig?.shifts?.find(s => s.id === massShiftId);
    if (!selectedShift) return;

    const shiftName = `${selectedShift.name} (${selectedShift.startTime} - ${selectedShift.endTime})`;

    const recordsToUpdate: Attendance[] = activeEmployees.map(emp => {
      const existing = attendanceMap.get(emp.id);
      return {
        id: existing ? existing.id : uuidv4(),
        employeeId: emp.id,
        date: filterDate,
        checkIn: selectedShift.startTime,
        checkOut: selectedShift.endTime,
        status: existing?.status || 'Present',
        shiftId: massShiftId,
        shiftName: shiftName,
        notes: existing?.notes || 'Update Shift Massal',
      };
    });

    await db.attendance.bulkPut(recordsToUpdate);
    setIsMassShiftModalOpen(false);
  };

  // Open modal for Editing specific Employee
  const handleOpenEditModalForEmployee = (employeeId: string) => {
    const existing = attendanceMap.get(employeeId);
    const schedRecord = shiftScheduleMap.get(employeeId);
    const empObj = employees.find(e => e.id === employeeId);
    const effectiveShift = empObj ? getEffectiveShiftForEmployee(empObj, filterDate, attendanceConfig, customSchedulesMap) : null;
    setEditingAttendance(existing || null);

    const defaultShift = attendanceConfig?.shifts?.find(s => s.id === existing?.shiftId) ||
      attendanceConfig?.shifts?.find(s => s.id === schedRecord?.shiftId) ||
      attendanceConfig?.shifts?.find(s => s.id === effectiveShift?.shiftId) ||
      attendanceConfig?.shifts?.find(s => s.isDefault) || 
      attendanceConfig?.shifts?.[0];
    
    const initialCheckIn = existing?.checkIn || (
      attendanceConfig?.systemType === 'shift' && defaultShift
        ? defaultShift.startTime
        : (attendanceConfig?.normalStartTime || '08:00')
    );
    
    const initialCheckOut = existing?.checkOut || (
      attendanceConfig?.systemType === 'shift' && defaultShift
        ? defaultShift.endTime
        : (attendanceConfig?.normalEndTime || '17:00')
    );

    setFormData({
      employeeId,
      date: filterDate,
      shiftId: existing?.shiftId || defaultShift?.id || '',
      checkIn: initialCheckIn,
      checkOut: initialCheckOut,
      status: existing ? (existing.status as any) : 'Present',
      notes: existing?.notes || '',
    });
    setIsModalOpen(true);
  };

  // Open general Add Modal (allows picking any employee)
  const handleOpenAddModal = () => {
    setEditingAttendance(null);
    setFormData({
      employeeId: '',
      date: filterDate,
      shiftId: '',
      checkIn: '08:00',
      checkOut: '17:00',
      status: 'Present',
      notes: '',
    });
    setIsModalOpen(true);
  };

  // Tool Action 1: Hadirkan Semua (Auto Check-In sesuai form jam & keterangan)
  const handleHadirkanSemua = async (jamMasuk: string, keterangan: string) => {
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Anda sedang dalam mode eksplorasi. Daftarkan profil perusahaan Anda terlebih dahulu untuk menyimpan data kehadiran.'
    })) {
      return;
    }

    const targetItems = filteredEmployeeAttendances;
    if (targetItems.length === 0) {
      alert('Tidak ada karyawan yang sesuai dengan filter aktif.');
      return;
    }

    const recordsToPut: Attendance[] = [];

    for (const item of targetItems) {
      const emp = item.employee;
      const existing = attendanceMap.get(emp.id);
      const schedRecord = shiftScheduleMap.get(emp.id);
      const effectiveShift = getEffectiveShiftForEmployee(emp, filterDate, attendanceConfig, customSchedulesMap);

      // Resolve shift
      let targetShift = attendanceConfig?.shifts?.find(s => s.id === (schedRecord?.shiftId || existing?.shiftId || effectiveShift.shiftId));
      if (!targetShift || targetShift.id === 'OFF' || targetShift.id === 'shift-off') {
        targetShift = attendanceConfig?.shifts?.find(s => s.isDefault) || attendanceConfig?.shifts?.[0];
      }

      const checkInTime = jamMasuk;
      const checkOutTime = existing?.checkOut || '';

      let shiftName: string | undefined = undefined;
      if (attendanceConfig?.systemType === 'shift' && targetShift) {
        shiftName = `${targetShift.name} (${targetShift.startTime} - ${targetShift.endTime})`;
      }

      let status: 'Present' | 'Late' | 'Leave' | 'Sick' | 'Alpha' = 'Present';
      let workDurationMinutes: number | undefined = undefined;
      let overtimeMinutes: number | undefined = undefined;
      let lateMinutes: number | undefined = undefined;
      let earlyLeaveMinutes: number | undefined = undefined;

      if (attendanceConfig) {
        const calc = calculateAttendance(checkInTime, checkOutTime || (targetShift?.endTime || '17:00'), attendanceConfig, targetShift);
        if (calc.lateMinutes > 0) {
          status = 'Late';
        } else {
          status = 'Present';
        }
        if (checkOutTime) {
          workDurationMinutes = calc.workDurationMinutes;
          overtimeMinutes = calc.overtimeMinutes;
          lateMinutes = calc.lateMinutes;
          earlyLeaveMinutes = calc.earlyLeaveMinutes;
        }
      }

      recordsToPut.push({
        id: existing ? existing.id : uuidv4(),
        employeeId: emp.id,
        date: filterDate,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        status: status,
        shiftId: attendanceConfig?.systemType === 'shift' ? targetShift?.id : undefined,
        shiftName: attendanceConfig?.systemType === 'shift' ? shiftName : undefined,
        notes: keterangan || existing?.notes || 'Hadir Tepat Waktu (Masuk Massal)',
        lateMinutes,
        earlyLeaveMinutes,
        workDurationMinutes,
        overtimeMinutes,
      });
    }

    await db.attendance.bulkPut(recordsToPut);
    setIsToolsModalOpen(false);
  };

  // Tool Action 2: Pulangkan Semua (Auto Check-Out sesuai form jam pulang & keterangan)
  const handlePulangkanSemua = async (jamPulang: string, keterangan: string) => {
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Anda sedang dalam mode eksplorasi. Daftarkan profil perusahaan Anda terlebih dahulu untuk menyimpan data kehadiran.'
    })) {
      return;
    }

    const targetItems = filteredEmployeeAttendances;
    if (targetItems.length === 0) {
      alert('Tidak ada karyawan yang sesuai dengan filter aktif.');
      return;
    }

    const recordsToPut: Attendance[] = [];

    for (const item of targetItems) {
      const emp = item.employee;
      const existing = attendanceMap.get(emp.id);
      const schedRecord = shiftScheduleMap.get(emp.id);
      const effectiveShift = getEffectiveShiftForEmployee(emp, filterDate, attendanceConfig, customSchedulesMap);

      // Resolve shift
      let targetShift = attendanceConfig?.shifts?.find(s => s.id === (existing?.shiftId || schedRecord?.shiftId || effectiveShift.shiftId));
      if (!targetShift || targetShift.id === 'OFF' || targetShift.id === 'shift-off') {
        targetShift = attendanceConfig?.shifts?.find(s => s.isDefault) || attendanceConfig?.shifts?.[0];
      }

      const checkInTime = existing?.checkIn || targetShift?.startTime || attendanceConfig?.normalStartTime || '08:00';
      const checkOutTime = jamPulang;

      let shiftName: string | undefined = undefined;
      if (attendanceConfig?.systemType === 'shift' && targetShift) {
        shiftName = `${targetShift.name} (${targetShift.startTime} - ${targetShift.endTime})`;
      }

      let finalStatus = existing?.status || 'Present';
      let workDurationMinutes: number | undefined = undefined;
      let overtimeMinutes: number | undefined = undefined;
      let lateMinutes: number | undefined = undefined;
      let earlyLeaveMinutes: number | undefined = undefined;

      if (attendanceConfig) {
        const calc = calculateAttendance(checkInTime, checkOutTime, attendanceConfig, targetShift);
        if (existing?.status === 'Late') {
          finalStatus = 'Late';
        } else {
          finalStatus = calc.status as any;
        }
        workDurationMinutes = calc.workDurationMinutes;
        overtimeMinutes = calc.overtimeMinutes;
        lateMinutes = calc.lateMinutes;
        earlyLeaveMinutes = calc.earlyLeaveMinutes;
      }

      recordsToPut.push({
        id: existing ? existing.id : uuidv4(),
        employeeId: emp.id,
        date: filterDate,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        status: finalStatus,
        shiftId: attendanceConfig?.systemType === 'shift' ? targetShift?.id : undefined,
        shiftName: attendanceConfig?.systemType === 'shift' ? shiftName : undefined,
        notes: keterangan || existing?.notes || 'Selesai Jam Kerja (Pulang Massal)',
        lateMinutes,
        earlyLeaveMinutes,
        workDurationMinutes,
        overtimeMinutes,
      });
    }

    await db.attendance.bulkPut(recordsToPut);
    setIsToolsModalOpen(false);
  };

  // Tool Action 3: Liburkan Semua (OFF, Libur Nasional, Sakit, Cuti, Alpa)
  const handleLiburkanSemua = async (jenisLibur: LiburType, keterangan: string) => {
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Anda sedang dalam mode eksplorasi. Daftarkan profil perusahaan Anda terlebih dahulu untuk menyimpan data kehadiran.'
    })) {
      return;
    }

    const targetItems = filteredEmployeeAttendances;
    if (targetItems.length === 0) {
      alert('Tidak ada karyawan yang sesuai dengan filter aktif.');
      return;
    }

    if (jenisLibur === 'OFF' || jenisLibur === 'HOLIDAY') {
      const attendanceIdsToDelete: string[] = [];
      const shiftName = jenisLibur === 'HOLIDAY' ? 'Libur Nasional' : 'Libur (OFF)';
      const noteStr = keterangan || (jenisLibur === 'HOLIDAY' ? 'Hari Libur Nasional' : 'Libur Reguler (OFF)');

      for (const item of targetItems) {
        const emp = item.employee;
        const existing = attendanceMap.get(emp.id);

        // Register schedule as OFF in shiftSchedules (linked with Jadwal Matriks)
        await setSingleShiftSchedule(
          emp.id,
          filterDate,
          'OFF',
          shiftName,
          undefined,
          undefined,
          noteStr
        );

        if (existing) {
          attendanceIdsToDelete.push(existing.id);
        }
      }

      if (attendanceIdsToDelete.length > 0) {
        await db.attendance.bulkDelete(attendanceIdsToDelete);
      }
    } else {
      // LEAVE, SICK, ALPHA
      const recordsToPut: Attendance[] = [];
      let mappedStatus: 'Leave' | 'Sick' | 'Absent' = 'Leave';
      if (jenisLibur === 'SICK') mappedStatus = 'Sick';
      if (jenisLibur === 'ALPHA') mappedStatus = 'Absent';

      const defaultNote = 
        jenisLibur === 'LEAVE' ? 'Cuti / Izin Bersama' :
        jenisLibur === 'SICK' ? 'Sakit Massal' : 'Alpa / Tidak Hadir';

      for (const item of targetItems) {
        const emp = item.employee;
        const existing = attendanceMap.get(emp.id);

        recordsToPut.push({
          id: existing ? existing.id : uuidv4(),
          employeeId: emp.id,
          date: filterDate,
          checkIn: '',
          checkOut: '',
          status: mappedStatus,
          shiftId: undefined,
          shiftName: undefined,
          notes: keterangan || existing?.notes || defaultNote,
          workDurationMinutes: 0,
          overtimeMinutes: 0,
        });
      }

      await db.attendance.bulkPut(recordsToPut);
    }

    setIsToolsModalOpen(false);
  };

  const handleDeleteRecord = async (attendanceId: string) => {
    if (!confirm('Hapus catatan presensi ini dan kembalikan status ke "Belum Presensi"?')) return;
    await db.attendance.delete(attendanceId);
  };

  // Employee Change inside Modal
  const handleEmployeeChangeInModal = (empId: string) => {
    if (!empId) {
      setFormData(prev => ({
        ...prev,
        employeeId: '',
        shiftId: '',
        notes: '',
      }));
      return;
    }
    const schedRecord = shiftScheduleMap.get(empId);
    const existingAtt = attendanceMap.get(empId);
    const empObj = employees.find(e => e.id === empId);
    const effectiveShift = empObj ? getEffectiveShiftForEmployee(empObj, filterDate, attendanceConfig, customSchedulesMap) : null;
    
    const defaultShift = attendanceConfig?.shifts?.find(s => s.id === existingAtt?.shiftId) ||
      attendanceConfig?.shifts?.find(s => s.id === schedRecord?.shiftId) ||
      attendanceConfig?.shifts?.find(s => s.id === effectiveShift?.shiftId) ||
      attendanceConfig?.shifts?.find(s => s.isDefault) || 
      attendanceConfig?.shifts?.[0];

    const newCheckIn = existingAtt?.checkIn || (
      attendanceConfig?.systemType === 'shift' && defaultShift 
        ? (effectiveShift?.startTime || defaultShift.startTime) 
        : (attendanceConfig?.normalStartTime || '08:00')
    );
    const newCheckOut = existingAtt?.checkOut || (
      attendanceConfig?.systemType === 'shift' && defaultShift 
        ? (effectiveShift?.endTime || defaultShift.endTime) 
        : (attendanceConfig?.normalEndTime || '17:00')
    );

    let autoStatus = existingAtt?.status || 'Present';
    if (!existingAtt && attendanceConfig) {
      const calc = calculateAttendance(newCheckIn, newCheckOut, attendanceConfig, defaultShift);
      autoStatus = calc.status as any;
    }

    setFormData(prev => ({
      ...prev,
      employeeId: empId,
      shiftId: defaultShift?.id || '',
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      status: autoStatus as any,
      notes: existingAtt?.notes || '',
    }));
  };

  // Shift Change inside Modal
  const handleShiftChangeInModal = (shiftId: string) => {
    const selectedShift = attendanceConfig?.shifts?.find(s => s.id === shiftId);
    if (selectedShift) {
      const calc = attendanceConfig ? calculateAttendance(selectedShift.startTime, selectedShift.endTime, attendanceConfig, selectedShift) : null;
      setFormData(prev => ({
        ...prev,
        shiftId,
        checkIn: selectedShift.startTime,
        checkOut: selectedShift.endTime,
        status: (calc ? calc.status : 'Present') as any
      }));
    } else {
      setFormData(prev => ({ ...prev, shiftId }));
    }
  };

  // CheckIn Change inside Modal
  const handleCheckInChangeInModal = (newCheckIn: string) => {
    let autoStatus = formData.status;
    if (attendanceConfig && (formData.status === 'Present' || formData.status === 'Late')) {
      const shiftObj = attendanceConfig.shifts?.find(s => s.id === formData.shiftId);
      const calc = calculateAttendance(newCheckIn, formData.checkOut, attendanceConfig, shiftObj);
      autoStatus = calc.status as any;
    }
    setFormData(prev => ({
      ...prev,
      checkIn: newCheckIn,
      status: autoStatus as any
    }));
  };

  // Save Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Anda sedang dalam mode eksplorasi. Daftarkan profil perusahaan Anda terlebih dahulu untuk menyimpan data kehadiran.'
    })) {
      return;
    }

    if (!formData.employeeId) {
      alert('Silakan pilih karyawan.');
      return;
    }

    let shiftName = '';
    if (attendanceConfig?.systemType === 'shift' && formData.shiftId) {
      const shiftObj = attendanceConfig.shifts?.find(s => s.id === formData.shiftId);
      if (shiftObj) {
        shiftName = `${shiftObj.name} (${shiftObj.startTime} - ${shiftObj.endTime})`;
      }
    }

    let calcResult = null;
    if (attendanceConfig && formData.status !== 'Leave' && formData.status !== 'Sick' && formData.status !== 'WFH') {
      const shiftObj = attendanceConfig.shifts?.find(s => s.id === formData.shiftId);
      calcResult = calculateAttendance(formData.checkIn, formData.checkOut, attendanceConfig, shiftObj);
    }

    let recordId = editingAttendance ? editingAttendance.id : uuidv4();
    if (!editingAttendance) {
      // Prevent duplicates by checking if a record for this employee and date already exists
      const existingRecords = await db.attendance.where('employeeId').equals(formData.employeeId).toArray();
      const duplicate = existingRecords.find(r => r.date === formData.date);
      if (duplicate) {
        recordId = duplicate.id;
      }
    }

    const payload: Attendance = {
      id: recordId,
      employeeId: formData.employeeId,
      date: formData.date,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      status: formData.status,
      shiftId: attendanceConfig?.systemType === 'shift' ? formData.shiftId : undefined,
      shiftName: attendanceConfig?.systemType === 'shift' ? shiftName : undefined,
      notes: formData.notes,
      lateMinutes: calcResult ? calcResult.lateMinutes : undefined,
      earlyLeaveMinutes: calcResult ? calcResult.earlyLeaveMinutes : undefined,
      overtimeMinutes: calcResult ? calcResult.overtimeMinutes : undefined,
      workDurationMinutes: calcResult ? calcResult.workDurationMinutes : undefined,
    };

    await db.attendance.put(payload);
    setIsModalOpen(false);
  };

  // Save Settings
  const handleSaveSettings = async (updatedConfig: AttendanceConfig) => {
    try {
      setSavingConfig(true);
      await saveAttendanceConfig(updatedConfig);
      if (onConfigSaved) onConfigSaved();
    } catch (error) {
      console.error('Gagal menyimpan konfigurasi:', error);
    } finally {
      setSavingConfig(false);
    }
  };

  const fullDateIndo = formatFullDateIndo(filterDate);

  // Subtitle with interactive date picker trigger and chevron down
  const dateSubtitleNode = useMemo(() => (
    <div className="relative group cursor-pointer inline-flex items-center gap-1">
      <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-none group-hover:text-blue-600 transition-colors">
        {fullDateIndo}
      </span>
      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
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
  ), [fullDateIndo, filterDate]);

  const selectedEmployeeForModal = activeEmployees.find(e => e.id === formData.employeeId);
  const hasModalFilters = departmentFilter !== 'ALL' || statusFilter !== 'ALL';
  const showShiftOption = attendanceConfig?.systemType === 'shift' || attendanceConfig?.systemType === 'mixed';

  // Standard Header Actions (Search, Scan QR, Settings, Plus Tools)
  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* 1. Search Action */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`relative h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white border hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all ${
          search || hasModalFilters
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari & Filter Data Presensi"
      >
        <Search className="w-4 h-4 stroke-[1.8]" />
        {(search || hasModalFilters) && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      {/* 2. Scan QR / Barcode Action */}
      <button
        type="button"
        onClick={() => setIsScanModalOpen(true)}
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all"
        title="Scan QR / Barcode ID Presensi"
      >
        <QrCode className="w-4 h-4 stroke-[1.8]" />
      </button>

      {/* 3. Settings Action */}
      <button
        type="button"
        onClick={() => {
          setIsSettingsModalOpen(true);
          onSubViewChange?.(true);
        }}
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer transition-all"
        title="Konfigurasi Aturan Presensi"
      >
        <Settings className="w-4 h-4 stroke-[1.8]" />
      </button>

      {/* 4. Plus Action */}
      <button
        type="button"
        onClick={() => setIsToolsModalOpen(true)}
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer transition-all"
        title="Tools Presensi & Aksi Cepat"
      >
        <Plus className="w-4 h-4 stroke-[2]" />
      </button>
    </div>
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      {isSettingsModalOpen ? (
        <ModalPengaturan
          isOpen={true}
          onClose={() => {
            setIsSettingsModalOpen(false);
            onSubViewChange?.(false);
          }}
          config={attendanceConfig}
          onSaveConfig={handleSaveSettings}
          savingConfig={savingConfig}
        />
      ) : (
        <>
          {/* Top Header Title & Date Trigger */}
          <PageHeaderTitle 
            title={showShiftOption ? 'Presensi Karyawan' : 'Presensi'} 
            subtitle={dateSubtitleNode} 
          />

          {/* Standard Header Actions (Search, Chart, Settings, Plus) */}
          {!isSearchOpen && (
            <>
              <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
              <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>
            </>
          )}

          {/* Header Search Mode (When open, expands across top header) */}
          {isSearchOpen && (
            <PageHeaderSearch
              searchQuery={search}
              onSearchChange={setSearch}
              onClose={() => setIsSearchOpen(false)}
              placeholder="Cari nama karyawan, NIK..."
              onFilterClick={() => setIsFilterModalOpen(true)}
              isFilterActive={hasModalFilters}
            />
          )}

          {/* Shift Dual-Card & Active Filter Chips (if any) */}
          <PresensiHeader
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            todayStr={todayStr}
            attendanceConfig={attendanceConfig}
            shiftFilter={shiftFilter}
            departmentFilter={departmentFilter}
            statusFilter={statusFilter}
            deptMap={deptMap}
            onOpenShiftModal={() => setIsShiftModalOpen(true)}
            onResetFilters={() => {
              setFilterDate(todayStr);
              setDepartmentFilter('ALL');
              setStatusFilter('ALL');
              setShiftFilter('ALL');
            }}
            onRemoveShiftFilter={() => setShiftFilter('ALL')}
            onRemoveDeptFilter={() => setDepartmentFilter('ALL')}
            onRemoveStatusFilter={() => setStatusFilter('ALL')}
          />

          {totalActiveEmployees === 0 ? (
            <div className="mt-4">
              <InitialEmptyCard
                title="Pantau Kehadiran Tim Anda!"
                description="Kelola jadwal kerja, shift, dan pantau presensi harian secara real-time."
                buttonText="Tambah Karyawan Dulu"
                ButtonIcon={Users}
                onAction={() => window.location.href = '/employees'}
                animationData={emptyAttendanceAnimation}
              />
            </div>
          ) : (
            <div className="space-y-1.5 sm:space-y-2">
              {/* Section Header: Data Statistik Harian */}
              <div className="flex items-center justify-between px-0.5 -mt-0.5 sm:-mt-1">
                <button
                  type="button"
                  onClick={() => setShowStats(!showStats)}
                  className="flex items-center justify-between w-full group cursor-pointer py-0.5"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Data Statistik Harian
                  </span>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md text-slate-500 group-hover:text-blue-600 group-hover:bg-slate-100 flex items-center justify-center transition-all">
                    <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${showStats ? 'rotate-180' : ''}`} />
                  </div>
                </button>
              </div>

              {/* Daily Quick Summary Statistics - Collapsible under indicator text */}
              <StatsSummary
                show={showStats}
                totalActiveEmployees={totalActiveEmployees}
                stats={stats}
              />

              {/* Main Desktop Table (When viewMode === 'table') */}
              <PresensiTableView
                items={filteredEmployeeAttendances}
                viewMode={viewMode}
                attendanceConfig={attendanceConfig}
                onQuickUpdate={handleQuickUpdate}
                onOpenEditModal={handleOpenEditModalForEmployee}
                onDeleteRecord={handleDeleteRecord}
              />

              {/* Card List View (Visible when viewMode === 'card' or on Mobile) */}
              <PresensiCardView
                items={filteredEmployeeAttendances}
                viewMode={viewMode}
                onQuickUpdate={handleQuickUpdate}
              />
            </div>
          )}
        </>
      )}

      {/* Modal Tools Presensi & Aksi Cepat */}
      <ModalTools
        isOpen={isToolsModalOpen}
        onClose={() => setIsToolsModalOpen(false)}
        filterDate={filterDate}
        shiftFilter={shiftFilter}
        departmentFilter={departmentFilter}
        attendanceConfig={attendanceConfig}
        filteredCount={filteredEmployeeAttendances.length}
        totalActiveEmployees={totalActiveEmployees}
        onSelectScan={() => {
          setIsToolsModalOpen(false);
          setIsScanModalOpen(true);
        }}
        onSelectManualInput={() => {
          setOpenedFromTools(true);
          setIsToolsModalOpen(false);
          handleOpenAddModal();
        }}
        onHadirkanSemua={handleHadirkanSemua}
        onPulangkanSemua={handlePulangkanSemua}
        onLiburkanSemua={handleLiburkanSemua}
      />

      {/* Modal Scan QR / Barcode ID Karyawan */}
      <ModalScan
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        employees={employees}
        attendanceConfig={attendanceConfig}
        filterDate={filterDate}
        deptMap={deptMap}
        posMap={posMap}
      />

      {/* Modal Input/Edit Presensi Manual */}
      <ModalPresensiManual
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setOpenedFromTools(false);
        }}
        onBack={() => {
          setIsModalOpen(false);
          if (openedFromTools) {
            setIsToolsModalOpen(true);
            setOpenedFromTools(false);
          }
        }}
        editingAttendance={editingAttendance}
        activeEmployees={activeEmployees}
        selectedEmployee={selectedEmployeeForModal}
        attendanceConfig={attendanceConfig}
        formData={formData}
        setFormData={setFormData}
        onEmployeeChange={handleEmployeeChangeInModal}
        onShiftChange={handleShiftChangeInModal}
        onCheckInChange={handleCheckInChangeInModal}
        onSave={(e) => {
          setOpenedFromTools(false);
          handleSaveModal(e);
        }}
      />

      {/* Modal Shift Massal */}
      <ModalMassShift
        isOpen={isMassShiftModalOpen}
        onClose={() => setIsMassShiftModalOpen(false)}
        attendanceConfig={attendanceConfig}
        activeEmployeesCount={activeEmployees.length}
        filterDate={filterDate}
        massShiftId={massShiftId}
        setMassShiftId={setMassShiftId}
        onApplyMassShift={handleApplyMassShiftSubmit}
      />

      {/* Modal Filter (Departemen & Status) */}
      <ModalFilter
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        departments={departments}
        onResetFilter={() => {
          setFilterDate(todayStr);
          setDepartmentFilter('ALL');
          setStatusFilter('ALL');
        }}
      />

      {/* Modal Shift Filter & Sync */}
      <ModalShiftFilter
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        shiftFilter={shiftFilter}
        setShiftFilter={setShiftFilter}
        attendanceConfig={attendanceConfig}
      />
    </div>
  );
}
