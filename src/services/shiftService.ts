import { db } from '../db/database';
import { ShiftSchedule, ShiftSwap, ExtraShift, AttendanceConfig, WorkShift, Employee } from '../types';
import { getAttendanceConfig, FIVE_DEFAULT_SHIFTS } from './attendanceConfigService';

// ==========================================
// 1. HELPER & UTILITIES FOR SCHEDULE RESOLUTION
// ==========================================

export interface ResolvedShiftInfo {
  id: string;
  name: string;
  code: string;
  startTime?: string;
  endTime?: string;
  color?: string;
  isOff: boolean;
}

/**
 * Resolves full shift details (name, code, startTime, endTime, isOff)
 * based on shiftId and active config / fallback default shifts.
 */
export const resolveShiftDetails = (
  shiftId: string,
  config?: AttendanceConfig | null
): ResolvedShiftInfo => {
  if (!shiftId || shiftId === 'OFF' || shiftId === 'shift-off') {
    return {
      id: 'OFF',
      name: 'Libur (OFF)',
      code: 'OFF',
      startTime: undefined,
      endTime: undefined,
      color: 'rose',
      isOff: true
    };
  }

  if (shiftId === 'NORMAL' || shiftId === 'shift-reguler') {
    const normalStart = config?.normalStartTime || '08:00';
    const normalEnd = config?.normalEndTime || '17:00';
    return {
      id: 'shift-reguler',
      name: 'NON SHIFT',
      code: 'NON SHIFT',
      startTime: normalStart,
      endTime: normalEnd,
      color: 'emerald',
      isOff: false
    };
  }

  const shiftsList = config?.shifts || FIVE_DEFAULT_SHIFTS;
  const found = shiftsList.find(s => s.id === shiftId || s.code === shiftId);

  if (found) {
    return {
      id: found.id,
      name: found.name,
      code: found.code || found.name,
      startTime: found.startTime,
      endTime: found.endTime,
      color: found.color || 'blue',
      isOff: !!found.isOff
    };
  }

  return {
    id: shiftId,
    name: shiftId,
    code: shiftId,
    startTime: '08:00',
    endTime: '17:00',
    color: 'blue',
    isOff: false
  };
};

/**
 * Check if two dates (YYYY-MM-DD) are in the same ISO/Indonesian calendar week (Monday to Sunday)
 */
export const isSameCalendarWeek = (dateStr1: string, dateStr2: string): boolean => {
  if (!dateStr1 || !dateStr2) return false;
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const dt1 = new Date(y1, m1 - 1, d1, 12, 0, 0);
  const dt2 = new Date(y2, m2 - 1, d2, 12, 0, 0);
  if (isNaN(dt1.getTime()) || isNaN(dt2.getTime())) return false;

  // Monday of dateStr1
  const day1 = dt1.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const diff1 = dt1.getDate() - day1 + (day1 === 0 ? -6 : 1);
  const monday1 = new Date(dt1);
  monday1.setDate(diff1);
  monday1.setHours(0, 0, 0, 0);

  // Monday of dateStr2
  const day2 = dt2.getDay();
  const diff2 = dt2.getDate() - day2 + (day2 === 0 ? -6 : 1);
  const monday2 = new Date(dt2);
  monday2.setDate(diff2);
  monday2.setHours(0, 0, 0, 0);

  return monday1.getTime() === monday2.getTime();
};

/**
 * Add or subtract days from a YYYY-MM-DD date string
 */
export const shiftDateByDays = (dateStr: string, days: number): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d + days, 12, 0, 0);
  const resY = date.getFullYear();
  const resM = String(date.getMonth() + 1).padStart(2, '0');
  const resD = String(date.getDate()).padStart(2, '0');
  return `${resY}-${resM}-${resD}`;
};

// ==========================================
// 2. ROSTER & SHIFT SCHEDULE SERVICES
// ==========================================

export const getShiftSchedulesByDateRange = async (startDate: string, endDate: string): Promise<ShiftSchedule[]> => {
  return await db.shiftSchedules
    .filter(s => s.date >= startDate && s.date <= endDate)
    .toArray();
};

export const getShiftSchedulesByDate = async (date: string): Promise<ShiftSchedule[]> => {
  return await db.shiftSchedules.where('date').equals(date).toArray();
};

/**
 * Single source of truth update for an employee's schedule on a specific date.
 * Automatically resolves times, names, and flags.
 */
export const setSingleShiftSchedule = async (
  employeeId: string,
  date: string,
  shiftId: string,
  shiftName?: string,
  startTime?: string,
  endTime?: string,
  notes?: string,
  isOvershift?: boolean
): Promise<void> => {
  let resolvedName = shiftName;
  let resolvedStartTime = startTime;
  let resolvedEndTime = endTime;

  if (shiftId === 'OFF' || shiftId === 'shift-off') {
    resolvedName = 'Libur (OFF)';
    resolvedStartTime = undefined;
    resolvedEndTime = undefined;
  } else if (!resolvedStartTime || !resolvedEndTime || !resolvedName) {
    const config = await getAttendanceConfig();
    const details = resolveShiftDetails(shiftId, config);
    if (!resolvedName) resolvedName = details.name;
    if (!resolvedStartTime) resolvedStartTime = details.startTime;
    if (!resolvedEndTime) resolvedEndTime = details.endTime;
  }

  // Find existing record if any
  const existing = await db.shiftSchedules
    .filter(s => s.employeeId === employeeId && s.date === date)
    .first();

  if (existing) {
    await db.shiftSchedules.update(existing.id, {
      shiftId,
      shiftName: resolvedName || shiftId,
      startTime: resolvedStartTime,
      endTime: resolvedEndTime,
      notes: notes !== undefined ? notes : existing.notes,
      isOvershift: isOvershift !== undefined ? isOvershift : existing.isOvershift,
      updatedAt: new Date().toISOString()
    });
  } else {
    const newId = crypto.randomUUID();
    await db.shiftSchedules.add({
      id: newId,
      employeeId,
      date,
      shiftId,
      shiftName: resolvedName || shiftId,
      startTime: resolvedStartTime,
      endTime: resolvedEndTime,
      notes,
      isOvershift,
      updatedAt: new Date().toISOString()
    });
  }
};

// Mass Overshift / Mass Batch Shift Reassignment
export const massAssignOvershift = async (
  employeeIds: string[],
  startDate: string,
  endDate: string,
  fromShiftId: string,
  toShiftId: string,
  toShiftName: string,
  toStartTime?: string,
  toEndTime?: string
): Promise<number> => {
  const dates: string[] = [];
  let curr = new Date(startDate);
  const end = new Date(endDate);
  while (curr <= end) {
    dates.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }

  let count = 0;
  for (const empId of employeeIds) {
    for (const d of dates) {
      const existing = await db.shiftSchedules
        .filter(s => s.employeeId === empId && s.date === d)
        .first();

      if (fromShiftId === 'ALL' || (existing && existing.shiftId === fromShiftId) || (!existing && fromShiftId === 'OFF')) {
        await setSingleShiftSchedule(
          empId,
          d,
          toShiftId,
          toShiftName,
          toStartTime,
          toEndTime,
          'Overshift Serentak',
          true
        );
        count++;
      }
    }
  }
  return count;
};

// Rotasi Roster Automated Pattern Generator
export const generatePatternRoster = async (
  employeeIds: string[],
  startDate: string,
  endDate: string,
  patternShifts: { id: string; name: string; startTime?: string; endTime?: string }[]
): Promise<number> => {
  if (patternShifts.length === 0) return 0;

  const dates: string[] = [];
  let curr = new Date(startDate);
  const end = new Date(endDate);
  while (curr <= end) {
    dates.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }

  let totalApplied = 0;
  for (const empId of employeeIds) {
    for (let i = 0; i < dates.length; i++) {
      const dateStr = dates[i];
      const shiftObj = patternShifts[i % patternShifts.length];
      await setSingleShiftSchedule(
        empId,
        dateStr,
        shiftObj.id,
        shiftObj.name,
        shiftObj.startTime,
        shiftObj.endTime,
        'Rotasi Pattern System'
      );
      totalApplied++;
    }
  }
  return totalApplied;
};

// ==========================================
// 3. PERTUKARAN & PENYESUAIAN SHIFT (SHIFT SWAP & RESCHEDULE)
// ==========================================

export const createShiftSwap = async (
  swap: Omit<ShiftSwap, 'id' | 'createdAt' | 'status'> & { requestDate?: string; autoApply?: boolean }
): Promise<string> => {
  const id = crypto.randomUUID();
  const todayDateStr = new Date().toISOString().split('T')[0];
  const swapType = swap.swapType || 'ganti_shift';
  const initiator = swap.initiator || 'Employee';

  const newSwap: ShiftSwap = {
    ...swap,
    swapType,
    initiator,
    requestDate: swap.requestDate || todayDateStr,
    id,
    status: 'Approved',
    approvedBy: initiator === 'Company' ? 'Instruksi HR/Perusahaan' : 'HR Admin',
    approvedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  await db.shiftSwaps.add(newSwap);

  // Directly apply the swap to schedules if autoApply is true (default true)
  if (swap.autoApply !== false) {
    await applySwapToSchedules(newSwap);
  }

  return id;
};

/**
 * Applies a shift swap record to the effective shift schedules in IndexedDB.
 */
export const applySwapToSchedules = async (
  swap: ShiftSwap,
  configParam?: AttendanceConfig | null
): Promise<void> => {
  const config = configParam || (await getAttendanceConfig());
  const swapType = swap.swapType || 'ganti_shift';
  const initiator = swap.initiator || 'Employee';
  const initiatorLabel = initiator === 'Company' ? 'Instruksi Perusahaan' : 'Pengajuan Karyawan';

  if (swapType === 'ganti_shift' || swapType === 'direct_shift_change') {
    // 1. GANTI SHIFT (Same employee, same date)
    const targetShiftDetails = resolveShiftDetails(swap.targetShiftId, config);
    await setSingleShiftSchedule(
      swap.requesterEmployeeId,
      swap.requesterDate,
      targetShiftDetails.id,
      targetShiftDetails.name,
      targetShiftDetails.startTime,
      targetShiftDetails.endTime,
      `Ganti Shift: ${targetShiftDetails.name} (${initiatorLabel})`,
      false
    );
  } else if ((swapType === 'tukar_shift' || swapType === 'peer_to_peer') && swap.targetEmployeeId && swap.targetDate) {
    // 2. TUKAR SHIFT (Exchange between 2 employees)
    // Requester gets targetShiftId on requesterDate
    const targetShiftDetails = resolveShiftDetails(swap.targetShiftId, config);
    await setSingleShiftSchedule(
      swap.requesterEmployeeId,
      swap.requesterDate,
      targetShiftDetails.id,
      targetShiftDetails.name,
      targetShiftDetails.startTime,
      targetShiftDetails.endTime,
      `Tukar Shift dengan Rekan (${initiatorLabel})`,
      false
    );

    // Target gets requesterShiftId on targetDate
    const reqShiftDetails = resolveShiftDetails(swap.requesterShiftId, config);
    await setSingleShiftSchedule(
      swap.targetEmployeeId,
      swap.targetDate,
      reqShiftDetails.id,
      reqShiftDetails.name,
      reqShiftDetails.startTime,
      reqShiftDetails.endTime,
      `Tukar Shift dengan Rekan (${initiatorLabel})`,
      false
    );
  } else if ((swapType === 'tukar_off' || swapType === 'self_date_swap') && swap.targetDate) {
    // 3. TUKAR OFF (Move OFF day to another date in the same week for the same employee)
    const isDate1OriginallyOff = swap.requesterShiftId === 'OFF' || swap.requesterShiftId === 'shift-off';
    
    if (!isDate1OriginallyOff) {
      // Date 1 was working day -> becomes OFF
      await setSingleShiftSchedule(
        swap.requesterEmployeeId,
        swap.requesterDate,
        'OFF',
        'Libur (OFF)',
        undefined,
        undefined,
        `Tukar OFF: Libur dipindah ke ${swap.requesterDate} (${initiatorLabel})`,
        false
      );

      // Date 2 was OFF -> becomes the work shift
      const workShiftDetails = resolveShiftDetails(swap.targetShiftId || swap.requesterShiftId, config);
      await setSingleShiftSchedule(
        swap.requesterEmployeeId,
        swap.targetDate,
        workShiftDetails.id,
        workShiftDetails.name,
        workShiftDetails.startTime,
        workShiftDetails.endTime,
        `Tukar OFF: Jadwal Kerja dari ${swap.requesterDate} (${initiatorLabel})`,
        false
      );
    } else {
      // Date 1 was OFF -> becomes the work shift
      const workShiftDetails = resolveShiftDetails(swap.targetShiftId || 'shift-1-pagi', config);
      await setSingleShiftSchedule(
        swap.requesterEmployeeId,
        swap.requesterDate,
        workShiftDetails.id,
        workShiftDetails.name,
        workShiftDetails.startTime,
        workShiftDetails.endTime,
        `Tukar OFF: Jadwal Kerja dari ${swap.targetDate} (${initiatorLabel})`,
        false
      );

      // Date 2 was working day -> becomes OFF
      await setSingleShiftSchedule(
        swap.requesterEmployeeId,
        swap.targetDate,
        'OFF',
        'Libur (OFF)',
        undefined,
        undefined,
        `Tukar OFF: Libur dipindah ke ${swap.targetDate} (${initiatorLabel})`,
        false
      );
    }
  }
};

/**
 * Removes the overriding schedules associated with a swap record.
 */
export const removeSwapFromSchedules = async (swap: ShiftSwap): Promise<void> => {
  const swapType = swap.swapType || 'ganti_shift';

  // Cleanup requester schedule
  if (swap.requesterEmployeeId && swap.requesterDate) {
    const sched1 = await db.shiftSchedules
      .filter(s => s.employeeId === swap.requesterEmployeeId && s.date === swap.requesterDate)
      .first();
    if (sched1) {
      await db.shiftSchedules.delete(sched1.id);
    }
  }

  // Cleanup target schedule
  if ((swapType === 'tukar_shift' || swapType === 'peer_to_peer') && swap.targetEmployeeId && swap.targetDate) {
    const sched2 = await db.shiftSchedules
      .filter(s => s.employeeId === swap.targetEmployeeId && s.date === swap.targetDate)
      .first();
    if (sched2) {
      await db.shiftSchedules.delete(sched2.id);
    }
  } else if ((swapType === 'tukar_off' || swapType === 'self_date_swap') && swap.targetDate && swap.requesterEmployeeId) {
    const sched2 = await db.shiftSchedules
      .filter(s => s.employeeId === swap.requesterEmployeeId && s.date === swap.targetDate)
      .first();
    if (sched2) {
      await db.shiftSchedules.delete(sched2.id);
    }
  }
};

export const approveShiftSwap = async (swapId: string, approvedBy?: string): Promise<void> => {
  const swap = await db.shiftSwaps.get(swapId);
  if (!swap) return;

  const initiator = swap.initiator || 'Employee';
  const updatedSwap: ShiftSwap = {
    ...swap,
    status: 'Approved',
    approvedBy: approvedBy || (initiator === 'Company' ? 'Instruksi HR/Perusahaan' : 'HR Admin'),
    approvedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await db.shiftSwaps.put(updatedSwap);
  await applySwapToSchedules(updatedSwap);
};

export const rejectShiftSwap = async (swapId: string): Promise<void> => {
  const swap = await db.shiftSwaps.get(swapId);
  if (swap) {
    await removeSwapFromSchedules(swap);
  }
  await db.shiftSwaps.update(swapId, { status: 'Rejected', updatedAt: new Date().toISOString() });
};

export const updateShiftSwap = async (
  swapId: string,
  updatedData: Partial<ShiftSwap> & { autoApply?: boolean }
): Promise<void> => {
  const existing = await db.shiftSwaps.get(swapId);
  if (!existing) return;

  // Clean up previous schedule before updating if it was approved
  if (existing.status === 'Approved') {
    await removeSwapFromSchedules(existing);
  }

  const merged: ShiftSwap = { ...existing, ...updatedData, updatedAt: new Date().toISOString() };
  await db.shiftSwaps.put(merged);

  if (updatedData.autoApply !== false && merged.status === 'Approved') {
    await applySwapToSchedules(merged);
  }
};

/**
 * Deletes a shift swap and cleans up the overriding schedules so the active roster
 * reverts to base patterns or previous state.
 */
export const deleteShiftSwap = async (swapId: string): Promise<void> => {
  const swap = await db.shiftSwaps.get(swapId);
  if (swap) {
    await removeSwapFromSchedules(swap);
    await db.shiftSwaps.delete(swapId);
  }
};

// ==========================================
// 4. BUSINESS LOGIC VALIDATIONS FOR HR RULES
// ==========================================

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validate GANTI SHIFT (Same employee, same date)
 */
export const validateGantiShift = (
  employeeId: string,
  date: string,
  currentShift: { shiftId: string; shiftName?: string; isOff?: boolean } | null,
  newShiftId: string
): ValidationResult => {
  if (!employeeId) {
    return { isValid: false, errorMessage: 'Silakan pilih karyawan terlebih dahulu.' };
  }
  if (!date) {
    return { isValid: false, errorMessage: 'Silakan tentukan tanggal shift yang akan diganti.' };
  }
  if (!currentShift) {
    return { isValid: false, errorMessage: 'Gagal mendeteksi jadwal aktif karyawan pada tanggal yang dipilih.' };
  }
  if (currentShift.isOff || currentShift.shiftId === 'OFF') {
    return { 
      isValid: false, 
      errorMessage: 'Ganti shift hanya dapat dilakukan pada hari kerja aktif. Untuk menukar hari libur, gunakan menu TUKAR OFF.' 
    };
  }
  if (!newShiftId) {
    return { isValid: false, errorMessage: 'Silakan pilih shift pengganti yang diinginkan.' };
  }
  if (newShiftId === 'OFF') {
    return { 
      isValid: false, 
      errorMessage: 'Ganti shift tidak dapat mengubah shift menjadi libur (OFF). Gunakan menu TUKAR OFF untuk memindahkan hari libur.' 
    };
  }
  if (newShiftId === currentShift.shiftId) {
    return { 
      isValid: false, 
      errorMessage: 'Shift baru yang dipilih sama persis dengan shift saat ini pada tanggal tersebut.' 
    };
  }

  return { isValid: true };
};

/**
 * Validate TUKAR SHIFT (Direct exchange between 2 employees)
 */
export const validateTukarShift = (
  emp1Id: string,
  date1: string,
  shift1: { shiftId: string; shiftName?: string; code?: string; isOff?: boolean } | null,
  emp2Id: string,
  date2: string,
  shift2: { shiftId: string; shiftName?: string; code?: string; isOff?: boolean } | null,
  isSameShiftTypeFn: (s1: any, s2: any) => boolean
): ValidationResult => {
  if (!emp1Id || !emp2Id) {
    return { isValid: false, errorMessage: 'Silakan pilih Karyawan 1 (Pemohon) dan Karyawan 2 (Pengganti).' };
  }
  if (emp1Id === emp2Id) {
    return { isValid: false, errorMessage: 'Karyawan 1 dan Karyawan 2 tidak boleh orang yang sama pada mode Tukar Shift Antar Karyawan.' };
  }
  if (!date1 || !date2) {
    return { isValid: false, errorMessage: 'Silakan tentukan tanggal shift untuk kedua karyawan.' };
  }
  if (!shift1) {
    return { isValid: false, errorMessage: 'Gagal mendeteksi jadwal Karyawan 1 pada tanggal yang dipilih.' };
  }
  if (!shift2) {
    return { isValid: false, errorMessage: 'Gagal mendeteksi jadwal Karyawan 2 pada tanggal yang dipilih.' };
  }
  if (isSameShiftTypeFn(shift1, shift2)) {
    return { 
      isValid: false, 
      errorMessage: `Pertukaran tidak dapat dilakukan karena Karyawan 1 dan Karyawan 2 memiliki jadwal shift yang sama (${shift1.shiftName || 'Identik'}). Silakan pilih karyawan pengganti atau tanggal lain.` 
    };
  }

  return { isValid: true };
};

/**
 * Validate TUKAR OFF (Move OFF day to working day within the same week for the same employee)
 */
export const validateTukarOff = (
  empId: string,
  date1: string,
  shift1: { shiftId: string; shiftName?: string; isOff?: boolean } | null,
  date2: string,
  shift2: { shiftId: string; shiftName?: string; isOff?: boolean } | null,
  targetShiftChoice?: string
): ValidationResult => {
  if (!empId) {
    return { isValid: false, errorMessage: 'Silakan pilih karyawan terlebih dahulu.' };
  }
  if (!date1 || !date2) {
    return { isValid: false, errorMessage: 'Silakan tentukan Tanggal 1 dan Tanggal 2.' };
  }
  if (date1 === date2) {
    return { isValid: false, errorMessage: 'Tanggal 1 dan Tanggal 2 harus berbeda untuk menukar hari libur OFF.' };
  }
  if (!isSameCalendarWeek(date1, date2)) {
    return { 
      isValid: false, 
      errorMessage: 'Penukaran hari OFF tidak boleh loncat minggu. Tanggal 1 dan Tanggal 2 harus berada dalam pekan/minggu yang sama (Senin - Minggu) agar kuota jam kerja dan hak libur mingguan tetap terjaga.' 
    };
  }
  if (!shift1 || !shift2) {
    return { isValid: false, errorMessage: 'Gagal mendeteksi jadwal lengkap pada tanggal yang dipilih.' };
  }

  const isShift1Off = shift1.isOff || shift1.shiftId === 'OFF';
  const isShift2Off = shift2.isOff || shift2.shiftId === 'OFF';

  if (isShift1Off && isShift2Off) {
    return { 
      isValid: false, 
      errorMessage: 'Kedua tanggal yang dipilih adalah hari OFF. Silakan pilih satu hari kerja dan satu hari libur untuk ditukar.' 
    };
  }

  if (!isShift1Off && !isShift2Off) {
    return { 
      isValid: false, 
      errorMessage: 'TUKAR OFF khusus digunakan untuk memindahkan posisi hari libur (OFF) dan hari kerja. Jika ingin mengubah shift antar hari kerja, gunakan menu GANTI SHIFT atau TUKAR SHIFT.' 
    };
  }

  if (!targetShiftChoice) {
    return { isValid: false, errorMessage: 'Silakan pilih opsi shift pengganti yang akan dijalankan.' };
  }

  return { isValid: true };
};

// ==========================================
// 5. SHIFT TAMBAHAN & LEMBUR (KONVERSI UPAH)
// ==========================================

/**
 * Helper to determine if a mandatory shift represents an OFF / Libur day
 */
export const isShiftOff = (shiftId?: string, shiftName?: string): boolean => {
  if (!shiftId || shiftId === 'OFF' || shiftId === 'shift-off') return true;
  const idUpper = String(shiftId).toUpperCase();
  const nameUpper = String(shiftName || '').toUpperCase();
  return idUpper.includes('OFF') || idUpper === 'LIBUR' || nameUpper.includes('LIBUR') || nameUpper.includes('OFF');
};

/**
 * Determine Wage Category ('NORMAL' | 'OFFDAY' | 'SERAGAM') according to the strict business rules:
 * 1. If overtime configuration is 'unified' / 'SERAGAM':
 *    Wage category is ALWAYS 'SERAGAM' (regardless of whether mandatory shift is a Workday or OFF).
 * 2. If overtime configuration is 'separate' (Normal & Offday):
 *    - If mandatory shift is a Workday (NOT OFF): Wage category is ALWAYS 'NORMAL'.
 *    - If mandatory shift is an OFF day: Wage category is ALWAYS 'OFFDAY'.
 * 
 * In other words:
 * - 'OFFDAY' will NEVER occur when the mandatory shift is a workday.
 * - 'OFFDAY' will NEVER occur when the config scheme is 'SERAGAM'.
 */
export const resolveWageCategory = (
  extra: { mandatoryShiftId?: string; mandatoryShiftName?: string; wageCategory?: string },
  config?: AttendanceConfig | null,
  activeDayMode?: 'separate' | 'unified'
): 'NORMAL' | 'OFFDAY' | 'SERAGAM' => {
  const isUnified = activeDayMode === 'unified' || 
    config?.overtimeConfig?.dayMode === 'unified' ||
    (config?.overtimeConfig?.normalWorkday && config?.overtimeConfig?.offday &&
     config.overtimeConfig.normalWorkday.calculationType === config.overtimeConfig.offday.calculationType &&
     config.overtimeConfig.normalWorkday.calculationBasis === config.overtimeConfig.offday.calculationBasis &&
     config.overtimeConfig.normalWorkday.ratePerHour === config.overtimeConfig.offday.ratePerHour &&
     config.overtimeConfig.normalWorkday.baseDivider === config.overtimeConfig.offday.baseDivider &&
     config.overtimeConfig.normalWorkday.multiplierFirstHour === config.overtimeConfig.offday.multiplierFirstHour &&
     config.overtimeConfig.normalWorkday.multiplierNextHours === config.overtimeConfig.offday.multiplierNextHours &&
     config.overtimeConfig.normalWorkday.flatMultiplier === config.overtimeConfig.offday.flatMultiplier &&
     config.overtimeConfig.normalWorkday.flatSalaryMultiplier === config.overtimeConfig.offday.flatSalaryMultiplier);

  if (isUnified) {
    return 'SERAGAM';
  }

  const isOff = isShiftOff(extra.mandatoryShiftId, extra.mandatoryShiftName);
  if (isOff) {
    return 'OFFDAY';
  }

  return 'NORMAL';
};

export const createExtraShift = async (
  extra: Omit<ExtraShift, 'id' | 'createdAt' | 'status'> & { autoApply?: boolean }
): Promise<string> => {
  const id = crypto.randomUUID();
  const config = await getAttendanceConfig();
  const wageCat = extra.wageCategory || resolveWageCategory(extra, config);

  const newExtra: ExtraShift = {
    ...extra,
    wageCategory: wageCat,
    id,
    status: 'Approved',
    approvedBy: 'HR Admin',
    approvedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  await db.extraShifts.add(newExtra);

  // Apply to schedules if autoApply !== false
  if (extra.autoApply !== false) {
    const noteText = extra.isNonShiftEmployee 
      ? `Lembur/Jam Tambahan: ${extra.durationHours || 0} Jam` 
      : `Shift Tambahan: ${extra.shiftName} (${extra.extraType === 'half_shift' ? '0.5 Shift (4 Jam)' : extra.extraType === 'custom_hours' ? `${extra.durationHours || 0} Jam` : '1 Shift (8 Jam)'})`;

    if (!extra.isNonShiftEmployee && extra.shiftId && extra.shiftId !== 'OFF' && extra.shiftId !== 'HOURLY') {
      await setSingleShiftSchedule(
        extra.employeeId,
        extra.workDate,
        extra.shiftId,
        extra.shiftName,
        extra.customStartTime,
        extra.customEndTime,
        noteText,
        true
      );
    }
  }

  return id;
};

export const updateExtraShift = async (id: string, updates: Partial<ExtraShift>): Promise<void> => {
  await db.extraShifts.update(id, updates);
};

export const approveExtraShift = async (extraId: string, approvedBy?: string): Promise<void> => {
  const extra = await db.extraShifts.get(extraId);
  if (!extra) return;

  await db.extraShifts.update(extraId, {
    status: 'Approved',
    approvedBy: approvedBy || 'HR Admin'
  });

  await setSingleShiftSchedule(
    extra.employeeId,
    extra.workDate,
    extra.shiftId,
    extra.shiftName,
    undefined,
    undefined,
    `Shift Tambahan / Lembur (Approved)`,
    true
  );
};

export const rejectExtraShift = async (extraId: string): Promise<void> => {
  await db.extraShifts.update(extraId, { status: 'Rejected' });
};

export const deleteExtraShift = async (extraId: string): Promise<void> => {
  await db.extraShifts.delete(extraId);
};

// ==========================================
// 6. SAMPLE DATA SEEDING & MIGRATION
// ==========================================

export const migrateAndSeedShiftSwaps = async (employees: { id: string; fullName?: string }[]): Promise<void> => {
  try {
    const existing = await db.shiftSwaps.toArray();
    
    // 1. Migrate any legacy types in DB
    for (const swap of existing) {
      if (swap.swapType === 'peer_to_peer') {
        await db.shiftSwaps.update(swap.id, { swapType: 'tukar_shift' });
      } else if (swap.swapType === 'self_date_swap') {
        await db.shiftSwaps.update(swap.id, { swapType: 'tukar_off' });
      } else if (swap.swapType === 'direct_shift_change') {
        await db.shiftSwaps.update(swap.id, { swapType: 'ganti_shift' });
      }
    }

    // 2. If completely empty and employees exist, seed sample shift swaps
    if (existing.length === 0 && employees.length >= 2) {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      const emp1 = employees[0];
      const emp2 = employees[1];

      // Sample 1: Ganti Shift
      const sample1: ShiftSwap = {
        id: crypto.randomUUID(),
        swapType: 'ganti_shift',
        initiator: 'Employee',
        requestDate: todayStr,
        requesterEmployeeId: emp1.id,
        requesterDate: todayStr,
        requesterShiftId: 'shift-1-pagi',
        targetDate: todayStr,
        targetShiftId: 'shift-2-siang',
        reason: 'Keperluan mendesak keluarga di pagi hari',
        status: 'Approved',
        approvedBy: 'HR Admin',
        approvedAt: today.toISOString(),
        createdAt: today.toISOString()
      };
      await db.shiftSwaps.add(sample1);
      await applySwapToSchedules(sample1);

      // Sample 2: Tukar Shift (Antar Karyawan)
      const sample2: ShiftSwap = {
        id: crypto.randomUUID(),
        swapType: 'tukar_shift',
        initiator: 'Employee',
        requestDate: todayStr,
        requesterEmployeeId: emp1.id,
        requesterDate: tomorrowStr,
        requesterShiftId: 'shift-1-pagi',
        targetEmployeeId: emp2.id,
        targetDate: tomorrowStr,
        targetShiftId: 'shift-2-siang',
        reason: 'Saling tukar shift tugas jaga operasional',
        status: 'Approved',
        approvedBy: 'HR Admin',
        approvedAt: today.toISOString(),
        createdAt: today.toISOString()
      };
      await db.shiftSwaps.add(sample2);
      await applySwapToSchedules(sample2);

      // Sample 3: Tukar Off
      const sample3: ShiftSwap = {
        id: crypto.randomUUID(),
        swapType: 'tukar_off',
        initiator: 'Employee',
        requestDate: todayStr,
        requesterEmployeeId: emp2.id,
        requesterDate: todayStr,
        requesterShiftId: 'OFF',
        targetDate: tomorrowStr,
        targetShiftId: 'shift-1-pagi',
        reason: 'Tukar hari libur OFF dengan jadwal kerja dalam pekan berjalan',
        status: 'Approved',
        approvedBy: 'HR Admin',
        approvedAt: today.toISOString(),
        createdAt: today.toISOString()
      };
      await db.shiftSwaps.add(sample3);
      await applySwapToSchedules(sample3);
    }
  } catch (err) {
    console.error('Failed to migrate/seed shift swaps:', err);
  }
};


