import { AttendanceConfig, WorkShift } from '../types';

export interface AttendanceCalculationResult {
  status: 'Present' | 'Late' | 'Absent';
  lateMinutes: number;
  earlyLeaveMinutes: number;
  overtimeMinutes: number;
  workDurationMinutes: number;
  workHours: number;
}

export interface LateDeductionCalculationResult {
  amount: number;
  basis?: string;
  dailyWage?: number;
  perMinuteWage?: number;
}

function parseTimeToMinutes(timeStr?: string): number | null {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

export function calculateAttendance(
  checkIn?: string,
  checkOut?: string,
  config?: AttendanceConfig | null,
  shiftObj?: WorkShift | null
): AttendanceCalculationResult {
  const startStr = shiftObj?.startTime || config?.normalStartTime || '08:00';
  const endStr = shiftObj?.endTime || config?.normalEndTime || '17:00';
  const breakStartStr = shiftObj?.breakStartTime ?? config?.normalBreakStartTime ?? '12:00';
  const breakEndStr = shiftObj?.breakEndTime ?? config?.normalBreakEndTime ?? '13:00';

  const schedStart = parseTimeToMinutes(startStr) ?? 480;
  let schedEnd = parseTimeToMinutes(endStr) ?? 1020;
  if (schedEnd <= schedStart || shiftObj?.crossDay) {
    if (schedEnd <= schedStart) schedEnd += 1440;
  }

  let breakMinutes = 0;
  const bStart = parseTimeToMinutes(breakStartStr);
  const bEnd = parseTimeToMinutes(breakEndStr);
  if (bStart !== null && bEnd !== null) {
    let diffB = bEnd - bStart;
    if (diffB < 0) diffB += 1440;
    if (diffB > 0 && diffB <= 180) {
      breakMinutes = diffB;
    }
  }

  const inMins = parseTimeToMinutes(checkIn);
  if (inMins === null) {
    return {
      status: 'Absent',
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      overtimeMinutes: 0,
      workDurationMinutes: 0,
      workHours: 0,
    };
  }

  const tolerance = config?.lateToleranceMinutes ?? 15;
  const earlyTolerance = config?.earlyLeaveToleranceMinutes ?? 10;
  const maxLateMinutes = config?.maxLateMinutes ?? (config?.maxLateHours ? config.maxLateHours * 60 : 240);
  const minOvertimeMinutes = config?.minimumOvertimeMinutes ?? 60;

  let effectiveIn = inMins;
  // Cross-day night shift edge case (e.g., scheduled 23:00, checked in 00:05)
  if (schedStart >= 1200 && inMins < 360) {
    effectiveIn += 1440;
  }

  const rawLate = Math.max(0, effectiveIn - schedStart);
  const lateMinutes = rawLate > tolerance ? rawLate : 0;

  let outMins = parseTimeToMinutes(checkOut);
  if (outMins === null) {
    outMins = schedEnd;
  } else {
    if (outMins < effectiveIn) {
      outMins += 1440;
    }
  }

  const rawEarly = Math.max(0, schedEnd - outMins);
  const earlyLeaveMinutes = rawEarly > earlyTolerance ? rawEarly : 0;

  const rawOvertime = Math.max(0, outMins - schedEnd);
  const overtimeMinutes = rawOvertime >= minOvertimeMinutes ? rawOvertime : 0;

  const grossDuration = Math.max(0, outMins - effectiveIn);
  const netDuration = grossDuration > breakMinutes + 120 ? grossDuration - breakMinutes : grossDuration;
  const workHours = Math.round((netDuration / 60) * 100) / 100;

  let status: 'Present' | 'Late' | 'Absent' = 'Present';
  if (config?.autoLateDetection !== false && lateMinutes > 0) {
    if (maxLateMinutes > 0 && rawLate > maxLateMinutes) {
      status = 'Absent';
    } else {
      status = 'Late';
    }
  }

  return {
    status,
    lateMinutes,
    earlyLeaveMinutes,
    overtimeMinutes,
    workDurationMinutes: netDuration,
    workHours,
  };
}

export function calculateLateDeductionAmount(
  lateMinutes: number,
  basicSalary: number,
  config?: AttendanceConfig | null
): LateDeductionCalculationResult {
  const mins = Math.max(0, Math.round(lateMinutes || 0));
  const salary = Math.max(0, Number(basicSalary || 0));
  const lateCfg = config?.lateDeductionConfig;

  if (!lateCfg?.enabled || mins <= 0) {
    return { amount: 0, basis: 'Tidak aktif / Tidak terlambat' };
  }

  const workDays = Math.max(1, lateCfg.workingDaysPerMonth || 21);
  const hoursPerDay = Math.max(1, lateCfg.workingHoursPerDay || 8);
  const dailyWage = salary / workDays;
  const perHourWage = dailyWage / hoursPerDay;
  const perMinuteWage = perHourWage / 60;

  if (lateCfg.scheme === 'static' || lateCfg.scheme === 'uniform') {
    if (lateCfg.staticSubMethod === 'percentage') {
      const pct = Number(lateCfg.staticPercentage || 5);
      const amount = Math.round((dailyWage * pct) / 100);
      return {
        amount,
        dailyWage,
        perMinuteWage,
        basis: `Statis ${pct}% upah harian`,
      };
    }
    const amount = Math.round(Number(lateCfg.staticAmount ?? lateCfg.uniformAmount ?? 25000));
    return {
      amount,
      dailyWage,
      perMinuteWage,
      basis: `Statis nominal Rp ${amount.toLocaleString('id-ID')}`,
    };
  }

  if (lateCfg.scheme === 'tiered' || lateCfg.scheme === 'hourly') {
    const lateHourTier = Math.max(1, Math.ceil(mins / 60));
    const tiers = lateCfg.tieredRates || [];
    const matchedTier =
      tiers.find((t) => t.hour === lateHourTier) ||
      [...tiers].sort((a, b) => b.hour - a.hour).find((t) => t.hour <= lateHourTier) ||
      tiers[0];

    if (matchedTier) {
      if (lateCfg.tieredSubMethod === 'percentage') {
        const pct = Number(matchedTier.percentage || 0);
        const amount = Math.round((dailyWage * pct) / 100);
        return {
          amount,
          dailyWage,
          perMinuteWage,
          basis: `Bertingkat Jam ke-${lateHourTier} (${pct}% upah harian)`,
        };
      }
      const amount = Math.round(Number(matchedTier.amount || 0));
      return {
        amount,
        dailyWage,
        perMinuteWage,
        basis: `Bertingkat Jam ke-${lateHourTier} (Rp ${amount.toLocaleString('id-ID')})`,
      };
    }
  }

  // Default: duration (per-minute proportional deduction)
  const amount = Math.round(mins * perMinuteWage);
  return {
    amount,
    dailyWage,
    perMinuteWage,
    basis: `${mins} menit × Rp ${Math.round(perMinuteWage).toLocaleString('id-ID')}/menit`,
  };
}
