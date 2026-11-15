import { db } from '../db/database';
import { 
  ShiftSchedule, 
  AttendanceConfig, 
  SavedSchedulePattern, 
  DepartmentScheduleAssignment,
  ShiftGroupAssignment
} from '../types';
import { saveAttendanceConfig } from './attendanceConfigService';

/**
 * Menghitung selisih hari antara dua tanggal (YYYY-MM-DD).
 */
export const getDaysDifference = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;
  const [y1, m1, d1] = startDate.split('-').map(Number);
  const [y2, m2, d2] = endDate.split('-').map(Number);
  const start = new Date(y1, m1 - 1, d1, 12, 0, 0);
  const end = new Date(y2, m2 - 1, d2, 12, 0, 0);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Menambahkan hari pada string YYYY-MM-DD
 */
export const addDays = (dateStr: string, days: number): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d + days, 12, 0, 0);
  const resY = date.getFullYear();
  const resM = String(date.getMonth() + 1).padStart(2, '0');
  const resD = String(date.getDate()).padStart(2, '0');
  return `${resY}-${resM}-${resD}`;
};

export interface EffectiveShiftResult {
  shiftId: string;
  shiftName: string;
  code?: string;
  startTime?: string;
  endTime?: string;
  color?: string;
  isOff: boolean;
  isManualOverride: boolean;
  isOvershift?: boolean;
  isSwapResult?: boolean;
  notes?: string;
  sched?: ShiftSchedule | null;
}

/**
 * Mendapatkan shift efektif untuk seorang karyawan pada tanggal tertentu secara dinamis
 * "sejauh mata memandang" (infinite continuous timeline projection).
 * 
 * Alur Resolusi:
 * 1. Prioritas 1: Periksa override manual / swap / extra shift di db.shiftSchedules
 * 2. Prioritas 2: Periksa penugasan pola shift departemen (departmentAssignments)
 *    - Jika non-shift: kalkulasi hari kerja normal (5 hari vs 6 hari kerja)
 *    - Jika pola shift: kalkulasi rotasi berdasarkan Tanggal Mulai (anchorDate) dan siklus pola
 */
export const getEffectiveShiftForEmployee = (
  employee: { id: string; departmentId?: string },
  dateStr: string,
  config: AttendanceConfig | null,
  customSchedulesMap?: Map<string, ShiftSchedule>
): EffectiveShiftResult => {
  // 1. Cek manual override schedule terlebih dahulu jika ada
  if (customSchedulesMap) {
    const key = `${employee.id}_${dateStr}`;
    const manualSched = customSchedulesMap.get(key);
    if (manualSched) {
      const isOff = manualSched.shiftId === 'OFF';
      const shiftObj = config?.shifts?.find(s => s.id === manualSched.shiftId);
      return {
        shiftId: manualSched.shiftId,
        shiftName: manualSched.shiftName || (isOff ? 'Libur (OFF)' : shiftObj?.name || manualSched.shiftId),
        code: isOff ? 'OFF' : shiftObj?.code || manualSched.shiftId,
        startTime: manualSched.startTime || shiftObj?.startTime,
        endTime: manualSched.endTime || shiftObj?.endTime,
        color: isOff ? 'rose' : shiftObj?.color || 'blue',
        isOff,
        isManualOverride: true,
        isOvershift: manualSched.isOvershift,
        isSwapResult: manualSched.isSwapResult || (manualSched.notes ? manualSched.notes.includes('Tukar') : false),
        notes: manualSched.notes,
        sched: manualSched
      };
    }
  }

  const systemType = config?.systemType || 'normal';
  const shifts = config?.shifts || [];

  // PRIORITAS 2: Cek apakah karyawan masuk ke dalam Group/Regu Bagian Manual (groupAssignments)
  const groupAssign = config?.groupAssignments?.find(
    g => g.employeeIds && g.employeeIds.includes(employee.id) && g.shiftPatternId
  );

  if (groupAssign && groupAssign.shiftPatternId) {
    const pattern = config?.shiftPatterns?.find(p => p.id === groupAssign.shiftPatternId);
    const anchorDate = groupAssign.anchorDate || dateStr;

    if (pattern && pattern.cycle && pattern.cycle.length > 0) {
      const cycleLength = pattern.cycle.length;
      const diff = getDaysDifference(anchorDate, dateStr);
      const cycleIndex = ((diff % cycleLength) + cycleLength) % cycleLength;
      const currentShiftId = pattern.cycle[cycleIndex];

      if (currentShiftId === 'OFF') {
        return {
          shiftId: 'OFF',
          shiftName: 'Libur (OFF)',
          code: 'OFF',
          color: 'rose',
          isOff: true,
          isManualOverride: false,
          sched: null
        };
      }

      const shiftData = shifts.find(s => s.id === currentShiftId);
      if (shiftData) {
        return {
          shiftId: shiftData.id,
          shiftName: shiftData.name,
          code: shiftData.code,
          startTime: shiftData.startTime,
          endTime: shiftData.endTime,
          color: shiftData.color,
          isOff: !!shiftData.isOff,
          isManualOverride: false,
          sched: null
        };
      }

      return {
        shiftId: currentShiftId,
        shiftName: currentShiftId,
        code: currentShiftId,
        color: 'blue',
        isOff: false,
        isManualOverride: false,
        sched: null
      };
    }
  }

  // PRIORITAS 3: Penugasan Pola Departemen (departmentAssignments)
  const deptAssign = config?.departmentAssignments?.find(d => d.departmentId === employee.departmentId);

  // Jika sistem normal atau departemen diset mode normal / NON SHIFT
  const isNormalDept = systemType === 'normal' || !deptAssign || deptAssign.mode === 'normal' || !deptAssign.shiftPatternId;

  if (isNormalDept) {
    const [y, m, dNum] = dateStr.split('-').map(Number);
    const d = new Date(y, m - 1, dNum, 12, 0, 0);
    const dayIndex = d.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
    const workDaysCount = config?.normalWorkDays || 5;
    const isWorkDay = workDaysCount === 6 ? dayIndex !== 0 : (dayIndex >= 1 && dayIndex <= 5);

    if (!isWorkDay) {
      return {
        shiftId: 'OFF',
        shiftName: 'Libur (OFF)',
        code: 'OFF',
        color: 'rose',
        isOff: true,
        isManualOverride: false,
        sched: null
      };
    }

    const checkIn = config?.normalStartTime || '08:00';
    const checkOut = config?.normalEndTime || '17:00';
    return {
      shiftId: 'NORMAL',
      shiftName: 'NON SHIFT',
      code: 'NON SHIFT',
      startTime: checkIn,
      endTime: checkOut,
      color: 'emerald',
      isOff: false,
      isManualOverride: false,
      sched: null
    };
  }

  // Jika departemen menggunakan pola shift
  if (deptAssign && deptAssign.shiftPatternId) {
    const pattern = config?.shiftPatterns?.find(p => p.id === deptAssign.shiftPatternId);
    const anchorDate = deptAssign.anchorDate || dateStr;

    if (pattern && pattern.cycle && pattern.cycle.length > 0) {
      const cycleLength = pattern.cycle.length;
      
      // Jika tanggal sebelum anchorDate, jika diinginkan bisa fallback ke normal atau dihitung mundur
      // Default: hitung siklus rolling berkelanjutan
      const diff = getDaysDifference(anchorDate, dateStr);
      const cycleIndex = ((diff % cycleLength) + cycleLength) % cycleLength;
      const currentShiftId = pattern.cycle[cycleIndex];

      if (currentShiftId === 'OFF') {
        return {
          shiftId: 'OFF',
          shiftName: 'Libur (OFF)',
          code: 'OFF',
          color: 'rose',
          isOff: true,
          isManualOverride: false,
          sched: null
        };
      }

      const shiftData = shifts.find(s => s.id === currentShiftId);
      if (shiftData) {
        return {
          shiftId: shiftData.id,
          shiftName: shiftData.name,
          code: shiftData.code,
          startTime: shiftData.startTime,
          endTime: shiftData.endTime,
          color: shiftData.color,
          isOff: !!shiftData.isOff,
          isManualOverride: false,
          sched: null
        };
      }

      return {
        shiftId: currentShiftId,
        shiftName: currentShiftId,
        code: currentShiftId,
        color: 'blue',
        isOff: false,
        isManualOverride: false,
        sched: null
      };
    }
  }

  // Default fallback
  const firstShift = shifts[0];
  return {
    shiftId: firstShift?.id || 'NORMAL',
    shiftName: firstShift?.name || 'NON SHIFT',
    code: firstShift?.code || 'NON SHIFT',
    startTime: firstShift?.startTime || '08:00',
    endTime: firstShift?.endTime || '17:00',
    color: firstShift?.color || 'emerald',
    isOff: !!firstShift?.isOff,
    isManualOverride: false,
    sched: null
  };
};

/**
 * Menyimpan Konfigurasi Pola Departemen menjadi entri baru atau memperbarui "Pola Jadwal Tersimpan".
 */
export interface SaveSchedulePatternPayload {
  id?: string;
  name: string;
  description?: string;
  departmentAssignments?: DepartmentScheduleAssignment[];
  groupAssignments?: ShiftGroupAssignment[];
  makeActive?: boolean;
}

export const saveOrUpdateSchedulePattern = async (
  config: AttendanceConfig,
  payload: SaveSchedulePatternPayload
): Promise<AttendanceConfig> => {
  const nowStr = new Date().toISOString();
  const patternId = payload.id || crypto.randomUUID();
  const isEditing = Boolean(payload.id);
  const shouldBeActive = payload.makeActive !== false;

  const newSavedPattern: SavedSchedulePattern = {
    id: patternId,
    name: payload.name.trim() || `Pola Jadwal ${new Date().toLocaleDateString('id-ID')}`,
    description: payload.description || '',
    departmentAssignments: JSON.parse(JSON.stringify(payload.departmentAssignments || [])),
    groupAssignments: JSON.parse(JSON.stringify(payload.groupAssignments || [])),
    createdAt: nowStr,
    updatedAt: nowStr,
    isActive: shouldBeActive
  };

  let updatedSavedList: SavedSchedulePattern[] = [];
  const existingList = config.savedSchedulePatterns || [];

  if (isEditing) {
    const existingPattern = existingList.find(p => p.id === patternId);
    if (existingPattern) {
      newSavedPattern.createdAt = existingPattern.createdAt;
    }
    updatedSavedList = existingList.map(p => {
      if (p.id === patternId) {
        return newSavedPattern;
      }
      return shouldBeActive ? { ...p, isActive: false } : p;
    });
  } else {
    const prevList = shouldBeActive 
      ? existingList.map(p => ({ ...p, isActive: false }))
      : [...existingList];
    updatedSavedList = [newSavedPattern, ...prevList];
  }

  const updatedConfig: AttendanceConfig = {
    ...config,
    departmentAssignments: shouldBeActive 
      ? JSON.parse(JSON.stringify(payload.departmentAssignments || []))
      : config.departmentAssignments,
    groupAssignments: shouldBeActive
      ? JSON.parse(JSON.stringify(payload.groupAssignments || []))
      : config.groupAssignments,
    savedSchedulePatterns: updatedSavedList,
    updatedAt: nowStr
  };

  await saveAttendanceConfig(updatedConfig);
  return updatedConfig;
};

/**
 * Mengaktifkan Pola Jadwal Tersimpan ke live system (menuliskan ke active departmentAssignments dan groupAssignments)
 */
export const activateSavedSchedulePattern = async (
  config: AttendanceConfig,
  patternId: string
): Promise<AttendanceConfig> => {
  const target = (config.savedSchedulePatterns || []).find(p => p.id === patternId);
  if (!target) {
    throw new Error('Pola Jadwal Tersimpan tidak ditemukan');
  }

  const updatedSavedList = (config.savedSchedulePatterns || []).map(p => ({
    ...p,
    isActive: p.id === patternId
  }));

  const updatedConfig: AttendanceConfig = {
    ...config,
    departmentAssignments: target.departmentAssignments ? JSON.parse(JSON.stringify(target.departmentAssignments)) : config.departmentAssignments,
    groupAssignments: target.groupAssignments ? JSON.parse(JSON.stringify(target.groupAssignments)) : [],
    savedSchedulePatterns: updatedSavedList,
    updatedAt: new Date().toISOString()
  };

  await saveAttendanceConfig(updatedConfig);
  return updatedConfig;
};

/**
 * Menghapus Pola Jadwal Tersimpan
 */
export const deleteSavedSchedulePattern = async (
  config: AttendanceConfig,
  patternId: string
): Promise<AttendanceConfig> => {
  const updatedSavedList = (config.savedSchedulePatterns || []).filter(p => p.id !== patternId);
  const updatedConfig: AttendanceConfig = {
    ...config,
    savedSchedulePatterns: updatedSavedList,
    updatedAt: new Date().toISOString()
  };

  await saveAttendanceConfig(updatedConfig);
  return updatedConfig;
};
