import { db } from '../db/database';
import { AttendanceConfig, WorkShift } from '../types';

export const FIVE_DEFAULT_SHIFTS: WorkShift[] = [
  {
    id: 'shift-reguler',
    code: 'NON SHIFT',
    name: 'NON SHIFT',
    startTime: '08:00',
    endTime: '17:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    crossDay: false,
    color: 'emerald', // Badge hijau
    description: 'Jam kerja NON SHIFT kantor',
    isDefault: true,
  },
  {
    id: 'shift-1-pagi',
    code: 'PAGI',
    name: 'Shift 1 (Pagi)',
    startTime: '07:00',
    endTime: '16:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    crossDay: false,
    color: 'blue',
    description: 'Shift operasional pagi',
    isDefault: false,
  },
  {
    id: 'shift-2-siang',
    code: 'SIANG',
    name: 'Shift 2 (Siang / Sore)',
    startTime: '15:00',
    endTime: '00:00',
    breakStartTime: '18:00',
    breakEndTime: '19:00',
    crossDay: true,
    color: 'amber',
    description: 'Shift operasional sore ke malam',
    isDefault: false,
  },
  {
    id: 'shift-3-malam',
    code: 'MALAM',
    name: 'Shift 3 (Malam)',
    startTime: '23:00',
    endTime: '08:00',
    breakStartTime: '03:00',
    breakEndTime: '04:00',
    crossDay: true,
    color: 'purple',
    description: 'Shift operasional malam (lintas hari)',
    isDefault: false,
  },
  {
    id: 'shift-off',
    code: 'OFF',
    name: 'Off (Hari Libur)',
    startTime: '00:00',
    endTime: '00:00',
    breakStartTime: '00:00',
    breakEndTime: '00:00',
    crossDay: false,
    color: 'rose', // Badge merah
    description: 'Hari libur / jadwal off',
    isDefault: false,
    isOff: true,
  },
];

export const DEFAULT_ATTENDANCE_CONFIG: AttendanceConfig = {
  id: 'attendanceConfig',
  systemType: 'normal', // 'normal' | 'shift' | 'mixed'
  normalWorkDays: 5,
  normalStartTime: '08:00',
  normalEndTime: '17:00',
  normalBreakStartTime: '12:00',
  normalBreakEndTime: '13:00',
  lateToleranceMinutes: 15,
  earlyLeaveToleranceMinutes: 0,
  autoLateDetection: true,
  maxLateHours: 4,
  maxLateMinutes: 240,
  lateDeductionConfig: {
    enabled: true,
    scheme: 'uniform',
    uniformAmount: 25000,
    hourlyMode: 'tiered',
    ratePerHour: 20000,
    tieredRates: [
      { hour: 1, amount: 15000 },
      { hour: 2, amount: 30000 },
      { hour: 3, amount: 50000 },
      { hour: 4, amount: 75000 },
    ],
    dailyWageMode: 'pro_rata_hours',
    workingDaysPerMonth: 25,
    workingHoursPerDay: 8,
    dailyWagePercentage: 50,
  },
  minimumOvertimeMinutes: 60,
  autoOvertime: true,
  overtimeConfig: {
    minimumOvertimeMinutes: 60,
    autoOvertime: true,
    normalWorkday: {
      calculationType: 'multiplier',
      ratePerHour: 25000,
      baseDivider: 173,
      multiplierFirstHour: 1.5,
      multiplierNextHours: 2.0,
      flatMultiplier: 1.5,
    },
    offday: {
      calculationType: 'multiplier',
      ratePerHour: 50000,
      baseDivider: 173,
      multiplierFirstHour: 2.0,
      multiplierNextHours: 2.0,
      flatMultiplier: 2.0,
    },
    updatedAt: new Date().toISOString()
  },
  shifts: FIVE_DEFAULT_SHIFTS,
};

/**
 * Get current attendance configuration from local database.
 * If not exists, stores and returns default.
 */
export async function getAttendanceConfig(): Promise<AttendanceConfig> {
  try {
    const record = await db.settings.get('attendanceConfig');
    if (record && (record as unknown as AttendanceConfig).systemType) {
      const cfg = record as unknown as AttendanceConfig;
      // Ensure shifts has default list if empty or missing shifts
      if (!cfg.shifts || cfg.shifts.length === 0) {
        cfg.shifts = FIVE_DEFAULT_SHIFTS;
      } else {
        // Ensure NON SHIFT and OFF exist in shifts if not present
        const hasReguler = cfg.shifts.some(s => s.code === 'REGULER' || s.code === 'NON SHIFT' || s.id === 'shift-reguler');
        const hasOff = cfg.shifts.some(s => s.code === 'OFF' || s.id === 'shift-off' || s.isOff);
        let updatedShifts = [...cfg.shifts];
        if (!hasReguler) {
          updatedShifts.unshift(FIVE_DEFAULT_SHIFTS[0]);
        }
        if (!hasOff) {
          updatedShifts.push(FIVE_DEFAULT_SHIFTS[4]);
        }

        // Migrate legacy default shift times to 8 hours working + 1 hour break standard
        let hasShiftTimeUpdates = false;
        updatedShifts = updatedShifts.map(s => {
          if (s.id === 'shift-1-pagi' && (s.endTime === '15:00' || s.breakStartTime === '11:30')) {
            hasShiftTimeUpdates = true;
            return {
              ...s,
              startTime: '07:00',
              endTime: '16:00',
              breakStartTime: '12:00',
              breakEndTime: '13:00',
            };
          }
          if (s.id === 'shift-2-siang' && s.endTime === '23:00' && s.startTime === '15:00') {
            hasShiftTimeUpdates = true;
            return {
              ...s,
              startTime: '15:00',
              endTime: '00:00',
              breakStartTime: '18:00',
              breakEndTime: '19:00',
              crossDay: true,
            };
          }
          if (s.id === 'shift-3-malam' && s.endTime === '07:00' && s.startTime === '23:00') {
            hasShiftTimeUpdates = true;
            return {
              ...s,
              startTime: '23:00',
              endTime: '08:00',
              breakStartTime: '03:00',
              breakEndTime: '04:00',
              crossDay: true,
            };
          }
          return s;
        });

        if (updatedShifts.length !== cfg.shifts.length || hasShiftTimeUpdates) {
          cfg.shifts = updatedShifts;
          await db.settings.put(cfg as any);
        }
      }

      // Ensure shiftGroups have distinct colors
      if (cfg.shiftGroups && cfg.shiftGroups.length > 0) {
        let hasColorUpdates = false;
        const palette = ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#0EA5E9', '#EC4899'];
        cfg.shiftGroups = cfg.shiftGroups.map((g, idx) => {
          if (!g.color || !g.color.startsWith('#')) {
            hasColorUpdates = true;
            const fallbackColor = g.id?.includes('regu-a') ? '#2563EB' : g.id?.includes('regu-b') ? '#10B981' : g.id?.includes('it-') ? '#8B5CF6' : palette[idx % palette.length];
            return { ...g, color: fallbackColor };
          }
          return g;
        });
        if (hasColorUpdates) {
          await db.settings.put(cfg as any);
        }
      }

      return cfg;
    }
    // Save default config
    await db.settings.put(DEFAULT_ATTENDANCE_CONFIG as any);
    return DEFAULT_ATTENDANCE_CONFIG;
  } catch (error) {
    console.error('Failed to get attendance config, using default', error);
    return DEFAULT_ATTENDANCE_CONFIG;
  }
}

/**
 * Save updated attendance configuration
 */
export async function saveAttendanceConfig(config: AttendanceConfig): Promise<void> {
  const updated: AttendanceConfig = {
    ...config,
    id: 'attendanceConfig',
    updatedAt: new Date().toISOString(),
  };
  await db.settings.put(updated as any);
}

/**
 * Determine automatic attendance status based on check-in time, tolerance, and mode
 */
export function determineAttendanceStatus(
  checkInTime: string,
  config: AttendanceConfig,
  shiftId?: string
): 'Present' | 'Late' | 'Absent' {
  if (!checkInTime) return 'Present';
  if (!config.autoLateDetection) return 'Present';

  let expectedStartTime = config.normalStartTime;

  if (config.systemType === 'shift') {
    const activeShift = config.shifts?.find((s) => s.id === shiftId) || config.shifts?.find((s) => s.isDefault) || config.shifts?.[0];
    if (activeShift) {
      expectedStartTime = activeShift.startTime;
    }
  }

  const [expectedH, expectedM] = expectedStartTime.split(':').map(Number);
  const [checkInH, checkInM] = checkInTime.split(':').map(Number);

  const expectedTotalMinutes = expectedH * 60 + expectedM;
  const checkInTotalMinutes = checkInH * 60 + checkInM;

  const lateMinutes = checkInTotalMinutes - expectedTotalMinutes;

  if (lateMinutes > config.lateToleranceMinutes) {
    const maxLateLimit = config.maxLateMinutes ?? ((config.maxLateHours || 0) * 60);
    if (maxLateLimit > 0 && lateMinutes > maxLateLimit) {
      return 'Absent';
    }
    return 'Late';
  }

  return 'Present';
}

/**
 * Format shift color into Tailwind classnames or inline style for Hex Colors
 */
export function getShiftBadgeStyle(color: string) {
  if (color && color.startsWith('#')) {
    return {
      backgroundColor: `${color}18`,
      color: color,
      borderColor: `${color}40`,
    };
  }
  return undefined;
}

export function getShiftBadgeClasses(color: WorkShift['color']) {
  if (color && color.startsWith('#')) {
    return 'border';
  }
  switch (color) {
    case 'blue':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'emerald':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'amber':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'purple':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'rose':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'indigo':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'slate':
      return 'bg-slate-50 text-slate-700 border-slate-200';
    case 'gray':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}
