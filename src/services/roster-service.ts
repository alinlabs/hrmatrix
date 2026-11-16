import {
  AttendanceConfig,
  DepartmentScheduleAssignment,
  Employee,
  SavedSchedulePattern,
  ShiftGroupAssignment,
  ShiftSchedule,
  WorkShift,
} from '../types';
import { FIVE_DEFAULT_SHIFTS, saveAttendanceConfig } from './attendance-config-service';

export interface EffectiveShiftInfo {
  shiftId: string;
  shiftName: string;
  code?: string;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
  color: string;
  isOff: boolean;
  crossDay?: boolean;
  source: 'override' | 'employee' | 'group' | 'department' | 'normal';
  notes?: string;
  sched?: ShiftSchedule;
}

const DAY_KEYS_BY_INDEX = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'] as const;

function parseDateLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map((n) => parseInt(n, 10));
  if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
    return new Date(y, m - 1, d);
  }
  return new Date(dateStr);
}

function diffDays(dateA: string, dateB: string): number {
  const a = parseDateLocal(dateA);
  const b = parseDateLocal(dateB);
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utcA - utcB) / 86400000);
}

function resolveShiftById(shifts: WorkShift[], shiftId?: string, shiftName?: string): WorkShift | undefined {
  if (!shiftId && !shiftName) return undefined;
  return (
    shifts.find((s) => s.id === shiftId) ||
    shifts.find((s) => s.code?.toUpperCase() === String(shiftId || '').toUpperCase()) ||
    shifts.find((s) => s.name?.toLowerCase() === String(shiftName || '').toLowerCase())
  );
}

export function getEffectiveShiftForEmployee(
  emp: Employee,
  dateStr: string,
  config: AttendanceConfig | null | undefined,
  customSchedulesMap?: Map<string, ShiftSchedule>
): EffectiveShiftInfo {
  const shifts = config?.shifts && config.shifts.length > 0 ? config.shifts : FIVE_DEFAULT_SHIFTS;

  // 1. Direct manual/swap override in db.shiftSchedules
  const override = customSchedulesMap?.get(`${emp.id}_${dateStr}`);
  if (override) {
    const isOff =
      override.shiftId === 'OFF' ||
      override.shiftId === 'shift-off' ||
      override.shiftName?.toLowerCase().includes('libur') ||
      override.shiftName?.toUpperCase() === 'OFF';
    const matched = resolveShiftById(shifts, override.shiftId, override.shiftName);
    return {
      shiftId: override.shiftId,
      shiftName: override.shiftName || matched?.name || override.shiftId,
      code: matched?.code || override.shiftId,
      startTime: override.startTime || matched?.startTime || (isOff ? '00:00' : config?.normalStartTime || '08:00'),
      endTime: override.endTime || matched?.endTime || (isOff ? '00:00' : config?.normalEndTime || '17:00'),
      breakStartTime: matched?.breakStartTime,
      breakEndTime: matched?.breakEndTime,
      color: isOff ? 'rose' : matched?.color || 'blue',
      isOff,
      crossDay: matched?.crossDay,
      source: 'override',
      notes: override.notes,
      sched: override,
    };
  }

  // 2. Active saved schedule pattern or top-level assignments
  const activeSaved = config?.savedSchedulePatterns?.find((p) => p.isActive);
  const patterns = config?.shiftPatterns || [];
  const empAssignments = config?.employeeAssignments || [];
  const groupAssignments = activeSaved?.groupAssignments || config?.groupAssignments || [];
  const deptAssignments = activeSaved?.departmentAssignments || config?.departmentAssignments || [];

  const empRule = empAssignments.find((a) => a.employeeId === emp.id);
  const groupRule = groupAssignments.find((g) => g.employeeIds?.includes(emp.id));
  const deptRule = deptAssignments.find((d) => d.departmentId === emp.departmentId);

  const assignment = empRule || groupRule || deptRule;
  const source: EffectiveShiftInfo['source'] = empRule
    ? 'employee'
    : groupRule
      ? 'group'
      : deptRule
        ? 'department'
        : 'normal';

  if (assignment) {
    const pattern = patterns.find((p) => p.id === assignment.shiftPatternId);
    if (pattern && Array.isArray(pattern.cycle) && pattern.cycle.length > 0) {
      const anchor = assignment.anchorDate || dateStr;
      const delta = diffDays(dateStr, anchor);
      const len = pattern.cycle.length;
      const idx = ((delta % len) + len) % len;
      const cycleShiftId = pattern.cycle[idx];
      const matched = resolveShiftById(shifts, cycleShiftId);
      const isOff =
        cycleShiftId === 'OFF' ||
        cycleShiftId === 'shift-off' ||
        Boolean(matched?.isOff);

      return {
        shiftId: matched?.id || cycleShiftId,
        shiftName: matched?.name || (isOff ? 'Libur (OFF)' : cycleShiftId),
        code: matched?.code || cycleShiftId,
        startTime: matched?.startTime || (isOff ? '00:00' : '08:00'),
        endTime: matched?.endTime || (isOff ? '00:00' : '17:00'),
        breakStartTime: matched?.breakStartTime,
        breakEndTime: matched?.breakEndTime,
        color: isOff ? 'rose' : matched?.color || 'blue',
        isOff,
        crossDay: matched?.crossDay,
        source,
      };
    }
  }

  // 3. Fallback to normal non-shift weekly workdays
  const dObj = parseDateLocal(dateStr);
  const dayIdx = dObj.getDay();
  const dayKey = DAY_KEYS_BY_INDEX[dayIdx];
  const dayCfg = config?.normalDailySchedules?.[dayKey];

  const isWorkday = dayCfg
    ? dayCfg.active
    : (config?.normalWorkDays ?? 5) >= 6
      ? dayIdx >= 1 && dayIdx <= 6
      : dayIdx >= 1 && dayIdx <= 5;

  if (!isWorkday) {
    const offShift = shifts.find((s) => s.isOff || s.code === 'OFF');
    return {
      shiftId: offShift?.id || 'OFF',
      shiftName: offShift?.name || 'Libur (OFF)',
      code: 'OFF',
      startTime: '00:00',
      endTime: '00:00',
      color: 'rose',
      isOff: true,
      source: 'normal',
    };
  }

  const regShift =
    shifts.find((s) => s.isDefault || s.code === 'REGULER' || s.id === 'shift-reguler') ||
    shifts.find((s) => !s.isOff);

  return {
    shiftId: regShift?.id || 'shift-reguler',
    shiftName: regShift?.name || 'Non Shift',
    code: regShift?.code || 'REGULER',
    startTime: dayCfg?.startTime || config?.normalStartTime || regShift?.startTime || '08:00',
    endTime: dayCfg?.endTime || config?.normalEndTime || regShift?.endTime || '17:00',
    breakStartTime: dayCfg?.breakStartTime || config?.normalBreakStartTime || regShift?.breakStartTime,
    breakEndTime: dayCfg?.breakEndTime || config?.normalBreakEndTime || regShift?.breakEndTime,
    color: regShift?.color || 'blue',
    isOff: false,
    crossDay: regShift?.crossDay,
    source: 'normal',
  };
}

export async function saveOrUpdateSchedulePattern(
  activeConfig: AttendanceConfig,
  payload: {
    id?: string;
    name: string;
    description?: string;
    departmentAssignments: DepartmentScheduleAssignment[];
    groupAssignments: ShiftGroupAssignment[];
    makeActive?: boolean;
  }
): Promise<AttendanceConfig> {
  const now = new Date().toISOString();
  const existing = activeConfig.savedSchedulePatterns || [];
  const patternId = payload.id || `sched_${Date.now()}`;

  const updatedPattern: SavedSchedulePattern = {
    id: patternId,
    name: payload.name.trim(),
    description: payload.description?.trim() || '',
    departmentAssignments: payload.departmentAssignments || [],
    groupAssignments: payload.groupAssignments || [],
    createdAt: existing.find((p) => p.id === patternId)?.createdAt || now,
    updatedAt: now,
    isActive: payload.makeActive !== false,
  };

  let nextPatterns = existing.some((p) => p.id === patternId)
    ? existing.map((p) => (p.id === patternId ? updatedPattern : p))
    : [updatedPattern, ...existing];

  if (updatedPattern.isActive) {
    nextPatterns = nextPatterns.map((p) => ({
      ...p,
      isActive: p.id === patternId,
    }));
  }

  const nextConfig: AttendanceConfig = {
    ...activeConfig,
    savedSchedulePatterns: nextPatterns,
    ...(updatedPattern.isActive
      ? {
          departmentAssignments: updatedPattern.departmentAssignments,
          groupAssignments: updatedPattern.groupAssignments,
        }
      : {}),
  };

  return saveAttendanceConfig(nextConfig);
}

export async function activateSavedSchedulePattern(
  activeConfig: AttendanceConfig,
  patternId: string
): Promise<AttendanceConfig> {
  const existing = activeConfig.savedSchedulePatterns || [];
  const target = existing.find((p) => p.id === patternId);
  if (!target) return activeConfig;

  const nextPatterns = existing.map((p) => ({
    ...p,
    isActive: p.id === patternId,
  }));

  return saveAttendanceConfig({
    ...activeConfig,
    savedSchedulePatterns: nextPatterns,
    departmentAssignments: target.departmentAssignments || [],
    groupAssignments: target.groupAssignments || [],
  });
}

export async function deleteSavedSchedulePattern(
  activeConfig: AttendanceConfig,
  patternId: string
): Promise<AttendanceConfig> {
  const nextPatterns = (activeConfig.savedSchedulePatterns || []).filter((p) => p.id !== patternId);
  return saveAttendanceConfig({
    ...activeConfig,
    savedSchedulePatterns: nextPatterns,
  });
}
