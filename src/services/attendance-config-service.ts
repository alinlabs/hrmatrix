import type { CSSProperties } from 'react';
import { db } from '../db/database';
import { AttendanceConfig, WorkShift } from '../types';

export const FIVE_DEFAULT_SHIFTS: WorkShift[] = [
  {
    id: 'shift-reguler',
    code: 'REGULER',
    name: 'Non Shift',
    startTime: '08:00',
    endTime: '17:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    color: 'blue',
    isOff: false,
  },
  {
    id: 'shift-1-pagi',
    code: 'PAGI',
    name: 'Shift 1 (Pagi)',
    startTime: '07:00',
    endTime: '16:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    color: 'emerald',
    isOff: false,
  },
  {
    id: 'shift-2-siang',
    code: 'SIANG',
    name: 'Shift 2 (Siang)',
    startTime: '15:00',
    endTime: '00:00',
    breakStartTime: '18:00',
    breakEndTime: '19:00',
    color: 'amber',
    crossDay: true,
    isOff: false,
  },
  {
    id: 'shift-3-malam',
    code: 'MALAM',
    name: 'Shift 3 (Malam)',
    startTime: '23:00',
    endTime: '08:00',
    breakStartTime: '03:00',
    breakEndTime: '04:00',
    color: 'purple',
    crossDay: true,
    isOff: false,
  },
  {
    id: 'shift-off',
    code: 'OFF',
    name: 'Libur (OFF)',
    startTime: '00:00',
    endTime: '00:00',
    color: 'rose',
    isOff: true,
  },
];

export const DEFAULT_ATTENDANCE_CONFIG: AttendanceConfig = {
  id: 'attendanceConfig',
  systemType: 'normal',
  normalWorkDays: 5,
  normalStartTime: '08:00',
  normalEndTime: '17:00',
  normalBreakStartTime: '12:00',
  normalBreakEndTime: '13:00',
  targetDailyHours: 8,
  normalDailySchedules: {
    senin: { active: true, startTime: '08:00', endTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00' },
    selasa: { active: true, startTime: '08:00', endTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00' },
    rabu: { active: true, startTime: '08:00', endTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00' },
    kamis: { active: true, startTime: '08:00', endTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00' },
    jumat: { active: true, startTime: '08:00', endTime: '17:00', breakStartTime: '11:30', breakEndTime: '13:00' },
    sabtu: { active: false, startTime: '08:00', endTime: '14:00', breakStartTime: '', breakEndTime: '' },
    minggu: { active: false, startTime: '08:00', endTime: '17:00', breakStartTime: '', breakEndTime: '' },
  },
  lateToleranceMinutes: 15,
  earlyLeaveToleranceMinutes: 10,
  autoLateDetection: true,
  maxLateHours: 4,
  maxLateMinutes: 240,
  lateDeductionConfig: {
    enabled: false,
    scheme: 'duration',
    workingDaysPerMonth: 21,
    workingHoursPerDay: 8,
  },
  minimumOvertimeMinutes: 60,
  autoOvertime: true,
  overtimeConfig: {
    dayMode: 'separate',
    minimumOvertimeMinutes: 60,
    autoOvertime: true,
    normalWorkday: {
      calculationType: 'multiplier',
      calculationBasis: 'salary_hourly',
      ratePerHour: 25000,
      baseDivider: 173,
      multiplierFirstHour: 1.5,
      multiplierNextHours: 2.0,
      flatMultiplier: 1.5,
      tieredMultipliers: [1.5, 2.0],
      tieredNominals: [35000, 45000],
    },
    offday: {
      calculationType: 'multiplier',
      calculationBasis: 'salary_hourly',
      ratePerHour: 50000,
      baseDivider: 173,
      multiplierFirstHour: 2.0,
      multiplierNextHours: 3.0,
      flatMultiplier: 2.0,
      tieredMultipliers: [2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 3.0],
      tieredNominals: [50000, 60000],
    },
  },
  shifts: FIVE_DEFAULT_SHIFTS,
  shiftPatterns: [],
  departmentAssignments: [],
  groupAssignments: [],
  employeeAssignments: [],
  shiftGroups: [],
  savedSchedulePatterns: [],
  updatedAt: new Date().toISOString(),
};

export async function getAttendanceConfig(): Promise<AttendanceConfig> {
  try {
    const row = await db.settings.get('attendanceConfig');
    const raw = ((row as any)?.data || row) as Partial<AttendanceConfig> | undefined;
    if (raw && raw.id === 'attendanceConfig') {
      return {
        ...DEFAULT_ATTENDANCE_CONFIG,
        ...raw,
        shifts: raw.shifts && raw.shifts.length > 0 ? raw.shifts : FIVE_DEFAULT_SHIFTS,
        normalDailySchedules: {
          ...DEFAULT_ATTENDANCE_CONFIG.normalDailySchedules,
          ...(raw.normalDailySchedules || {}),
        },
        overtimeConfig: {
          ...DEFAULT_ATTENDANCE_CONFIG.overtimeConfig!,
          ...(raw.overtimeConfig || {}),
        },
      };
    }
  } catch {
    // Fallback to default config
  }
  return DEFAULT_ATTENDANCE_CONFIG;
}

export async function saveAttendanceConfig(config: AttendanceConfig): Promise<AttendanceConfig> {
  const toSave: AttendanceConfig = {
    ...DEFAULT_ATTENDANCE_CONFIG,
    ...config,
    id: 'attendanceConfig',
    updatedAt: new Date().toISOString(),
  };
  await db.settings.put({
    ...toSave,
    id: 'attendanceConfig',
    data: toSave,
  });
  return toSave;
}

export function getShiftBadgeClasses(color: string): string {
  switch (color?.toLowerCase()) {
    case 'blue':
    case '#2563eb':
    case '#3b82f6':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'emerald':
    case 'green':
    case '#059669':
    case '#10b981':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'amber':
    case 'yellow':
    case '#d97706':
    case '#f59e0b':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'purple':
    case '#7c3aed':
    case '#8b5cf6':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'rose':
    case 'red':
    case '#e11d48':
    case '#f43f5e':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'indigo':
    case '#4f46e5':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    default:
      if (color?.startsWith('#')) {
        return '';
      }
      return 'bg-blue-50 text-blue-700 border-blue-200';
  }
}

export function getShiftBadgeStyle(color: string): CSSProperties {
  if (color?.startsWith('#')) {
    return {
      backgroundColor: `${color}15`,
      color: color,
      borderColor: `${color}35`,
    };
  }
  return {};
}
