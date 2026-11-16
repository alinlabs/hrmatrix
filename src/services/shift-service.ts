import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import {
  AttendanceConfig,
  Employee,
  ExtraShift,
  ShiftSchedule,
  ShiftSwap,
  ShiftSwapInitiator,
  ShiftSwapType,
} from '../types';
import { getAttendanceConfig } from './attendance-config-service';

export interface ShiftValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export function isShiftOff(shiftId?: string | null, shiftName?: string | null): boolean {
  const id = (shiftId || '').toLowerCase();
  const name = (shiftName || '').toLowerCase();
  return id === 'off' || id === 'shift-off' || name === 'off' || name.includes('libur');
}

export async function setSingleShiftSchedule(
  employeeId: string,
  date: string,
  shiftId: string,
  shiftName: string,
  startTime?: string,
  endTime?: string,
  notes?: string,
  flags?: { isOvershift?: boolean; isExtraShift?: boolean; isSwapResult?: boolean }
): Promise<ShiftSchedule> {
  const existing = await db.shiftSchedules
    .where('[employeeId+date]')
    .equals([employeeId, date])
    .first()
    .catch(() => undefined);

  const schedule: ShiftSchedule = {
    id: existing?.id || `${employeeId}_${date}`,
    employeeId,
    date,
    shiftId,
    shiftName,
    startTime,
    endTime,
    isOvershift: flags?.isOvershift ?? existing?.isOvershift,
    isExtraShift: flags?.isExtraShift ?? existing?.isExtraShift,
    isSwapResult: flags?.isSwapResult ?? existing?.isSwapResult,
    notes,
    updatedAt: new Date().toISOString(),
  };

  await db.shiftSchedules.put(schedule);
  return schedule;
}

export function validateGantiShift(
  empId: string,
  date: string,
  detectedShift: any,
  targetShiftId: string
): ShiftValidationResult {
  if (!empId || !date) {
    return { isValid: false, errorMessage: 'Karyawan dan tanggal wajib dipilih.' };
  }
  if (!targetShiftId) {
    return { isValid: false, errorMessage: 'Shift pengganti wajib dipilih.' };
  }
  if (detectedShift && detectedShift.shiftId === targetShiftId) {
    return { isValid: false, errorMessage: 'Shift pengganti harus berbeda dengan shift awal.' };
  }
  if (detectedShift?.isOff || isShiftOff(detectedShift?.shiftId, detectedShift?.shiftName)) {
    return {
      isValid: false,
      errorMessage: 'Tanggal tersebut adalah hari Libur (OFF). Gunakan fitur Tukar Off.',
    };
  }
  return { isValid: true };
}

export function validateTukarShift(
  emp1Id: string,
  date1: string,
  shift1: any,
  emp2Id: string,
  date2: string,
  shift2: any,
  isSameShiftTypeFn?: (a: any, b: any) => boolean
): ShiftValidationResult {
  if (!emp1Id || !date1 || !emp2Id || !date2) {
    return { isValid: false, errorMessage: 'Kedua karyawan dan tanggal wajib dipilih.' };
  }
  if (emp1Id === emp2Id && date1 === date2) {
    return { isValid: false, errorMessage: 'Tidak dapat menukar shift pada karyawan dan tanggal yang sama.' };
  }
  if (!shift1 || !shift2) {
    return { isValid: false, errorMessage: 'Jadwal shift salah satu karyawan belum terdeteksi.' };
  }
  if (shift1.isOff || shift2.isOff) {
    return { isValid: false, errorMessage: 'Tukar shift hanya berlaku antar jadwal masuk kerja (bukan OFF).' };
  }
  if (isSameShiftTypeFn ? isSameShiftTypeFn(shift1, shift2) : shift1.shiftId === shift2.shiftId) {
    return { isValid: false, errorMessage: 'Kedua karyawan memiliki jenis shift yang identik.' };
  }
  return { isValid: true };
}

export function validateTukarOff(
  empId: string,
  date1: string,
  shift1: any,
  date2: string,
  shift2: any,
  targetShiftChoice?: string
): ShiftValidationResult {
  if (!empId || !date1 || !date2) {
    return { isValid: false, errorMessage: 'Karyawan, tanggal asal, dan tanggal pengganti wajib dipilih.' };
  }
  if (date1 === date2) {
    return { isValid: false, errorMessage: 'Tanggal pertukaran OFF harus berbeda.' };
  }
  if (!shift1 || !shift2) {
    return { isValid: false, errorMessage: 'Jadwal pada salah satu tanggal tidak ditemukan.' };
  }
  const off1 = Boolean(shift1.isOff || isShiftOff(shift1.shiftId, shift1.shiftName));
  const off2 = Boolean(shift2.isOff || isShiftOff(shift2.shiftId, shift2.shiftName));
  if (off1 === off2) {
    return {
      isValid: false,
      errorMessage: 'Salah satu tanggal harus berupa Hari Libur (OFF) dan tanggal lainnya Hari Kerja.',
    };
  }
  if (off1 && !targetShiftChoice) {
    return { isValid: false, errorMessage: 'Pilih shift masuk pada tanggal OFF yang ditukar.' };
  }
  return { isValid: true };
}

async function applySwapToSchedules(swap: ShiftSwap): Promise<void> {
  const cfg = await getAttendanceConfig();
  const shifts = cfg.shifts || [];
  const findShift = (id?: string) =>
    shifts.find((s) => s.id === id) ||
    shifts.find((s) => s.code?.toUpperCase() === String(id || '').toUpperCase());

  const targetShift = findShift(swap.targetShiftId);
  const reqShift = findShift(swap.requesterShiftId);
  const type = swap.swapType;

  if (type === 'ganti_shift' || type === 'direct_shift_change') {
    const destDate = swap.targetDate || swap.requesterDate;
    await setSingleShiftSchedule(
      swap.requesterEmployeeId,
      destDate,
      swap.targetShiftId,
      targetShift?.name || swap.targetShiftId,
      targetShift?.startTime,
      targetShift?.endTime,
      swap.reason || 'Ganti Shift',
      { isSwapResult: true }
    );
  } else if (type === 'tukar_shift' || type === 'peer_to_peer') {
    if (swap.targetEmployeeId && swap.targetDate) {
      await setSingleShiftSchedule(
        swap.requesterEmployeeId,
        swap.requesterDate,
        swap.targetShiftId,
        targetShift?.name || swap.targetShiftId,
        targetShift?.startTime,
        targetShift?.endTime,
        swap.reason || 'Tukar Shift',
        { isSwapResult: true }
      );
      await setSingleShiftSchedule(
        swap.targetEmployeeId,
        swap.targetDate,
        swap.requesterShiftId,
        reqShift?.name || swap.requesterShiftId,
        reqShift?.startTime,
        reqShift?.endTime,
        swap.reason || 'Tukar Shift',
        { isSwapResult: true }
      );
    }
  } else if (type === 'tukar_off' || type === 'self_date_swap') {
    const off1 = isShiftOff(swap.requesterShiftId, reqShift?.name);
    if (off1 && swap.targetDate) {
      // date1 was OFF -> now gets targetShiftId; date2 becomes OFF
      await setSingleShiftSchedule(
        swap.requesterEmployeeId,
        swap.requesterDate,
        swap.targetShiftId,
        targetShift?.name || swap.targetShiftId,
        targetShift?.startTime,
        targetShift?.endTime,
        swap.reason || 'Tukar Off',
        { isSwapResult: true }
      );
      await setSingleShiftSchedule(
        swap.requesterEmployeeId,
        swap.targetDate,
        'OFF',
        'Libur (OFF)',
        '00:00',
        '00:00',
        swap.reason || 'Tukar Off',
        { isSwapResult: true }
      );
    } else if (swap.targetDate) {
      // date1 was Work -> becomes OFF; date2 was OFF -> gets targetShiftId
      await setSingleShiftSchedule(
        swap.requesterEmployeeId,
        swap.requesterDate,
        'OFF',
        'Libur (OFF)',
        '00:00',
        '00:00',
        swap.reason || 'Tukar Off',
        { isSwapResult: true }
      );
      await setSingleShiftSchedule(
        swap.requesterEmployeeId,
        swap.targetDate,
        swap.targetShiftId,
        targetShift?.name || swap.targetShiftId,
        targetShift?.startTime,
        targetShift?.endTime,
        swap.reason || 'Tukar Off',
        { isSwapResult: true }
      );
    }
  }
}

export async function createShiftSwap(input: {
  swapType: ShiftSwapType;
  initiator: ShiftSwapInitiator;
  requestDate?: string;
  requesterEmployeeId: string;
  targetEmployeeId?: string;
  requesterDate: string;
  requesterShiftId: string;
  targetDate?: string;
  targetShiftId: string;
  reason: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}): Promise<ShiftSwap> {
  const now = new Date().toISOString();
  const record: ShiftSwap = {
    id: uuidv4(),
    requestDate: input.requestDate || new Date().toISOString().split('T')[0],
    swapType: input.swapType,
    initiator: input.initiator,
    requesterEmployeeId: input.requesterEmployeeId,
    targetEmployeeId: input.targetEmployeeId,
    requesterDate: input.requesterDate,
    requesterShiftId: input.requesterShiftId,
    targetDate: input.targetDate || input.requesterDate,
    targetShiftId: input.targetShiftId,
    reason: input.reason || '',
    status: input.status || 'Approved',
    createdAt: now,
    updatedAt: now,
  };

  await db.shiftSwaps.put(record);
  if (record.status === 'Approved') {
    await applySwapToSchedules(record);
  }
  return record;
}

export async function updateShiftSwap(
  id: string,
  updates: Partial<ShiftSwap>
): Promise<ShiftSwap | undefined> {
  const existing = await db.shiftSwaps.get(id);
  if (!existing) return undefined;
  const updated: ShiftSwap = {
    ...existing,
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  await db.shiftSwaps.put(updated);
  if (updated.status === 'Approved') {
    await applySwapToSchedules(updated);
  }
  return updated;
}

export async function deleteShiftSwap(id: string): Promise<void> {
  await db.shiftSwaps.delete(id);
}

export async function migrateAndSeedShiftSwaps(_employees?: Employee[]): Promise<void> {
  // No-op safe migration hook; ensures existing legacy shiftSwaps have swapType normalized
  try {
    const existing = await db.shiftSwaps.toArray();
    for (const s of existing) {
      if (!s.swapType) {
        await db.shiftSwaps.update(s.id, {
          swapType: s.targetEmployeeId ? 'tukar_shift' : 'ganti_shift',
        });
      }
    }
  } catch {
    // Ignore
  }
}

export function resolveWageCategory(
  source: {
    wageCategory?: string;
    mandatoryShiftId?: string;
    mandatoryShiftName?: string;
  },
  config?: AttendanceConfig | null,
  dayMode?: 'separate' | 'unified'
): string {
  const effectiveDayMode = dayMode || config?.overtimeConfig?.dayMode || 'separate';
  if (effectiveDayMode === 'unified') {
    return 'SERAGAM';
  }
  if (source.wageCategory === 'OFFDAY' || source.wageCategory === 'NORMAL') {
    return source.wageCategory;
  }
  if (isShiftOff(source.mandatoryShiftId, source.mandatoryShiftName)) {
    return 'OFFDAY';
  }
  return 'NORMAL';
}

export async function createExtraShift(input: {
  employeeId: string;
  workDate: string;
  shiftId: string;
  shiftName: string;
  extraType?: 'full_shift' | 'half_shift' | 'custom_hours' | 'hourly';
  durationHours?: number;
  mandatoryShiftId?: string;
  mandatoryShiftName?: string;
  wageCategory?: string;
  customStartTime?: string;
  customEndTime?: string;
  isNonShiftEmployee?: boolean;
  compensatoryOffDate?: string;
  reason: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}): Promise<ExtraShift> {
  const record: ExtraShift = {
    id: uuidv4(),
    employeeId: input.employeeId,
    workDate: input.workDate,
    shiftId: input.shiftId,
    shiftName: input.shiftName,
    extraType: input.extraType || 'custom_hours',
    durationHours: input.durationHours,
    mandatoryShiftId: input.mandatoryShiftId,
    mandatoryShiftName: input.mandatoryShiftName,
    wageCategory: input.wageCategory || 'NORMAL',
    customStartTime: input.customStartTime,
    customEndTime: input.customEndTime,
    isNonShiftEmployee: input.isNonShiftEmployee,
    compensatoryOffDate: input.compensatoryOffDate,
    reason: input.reason || '',
    status: input.status || 'Approved',
    createdAt: new Date().toISOString(),
  };

  await db.extraShifts.put(record);
  return record;
}

export async function deleteExtraShift(id: string): Promise<void> {
  await db.extraShifts.delete(id);
}
