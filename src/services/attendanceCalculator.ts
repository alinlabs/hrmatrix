import { AttendanceConfig, WorkShift, ShiftSchedule } from '../types';

export interface AttendanceCalculation {
  status: 'Present' | 'Late' | 'Absent' | 'Sick' | 'Leave' | 'OFF' | 'Holiday' | 'WFH';
  lateMinutes: number;
  earlyLeaveMinutes: number;
  overtimeMinutes: number;
  workDurationMinutes: number;
  effectiveDurationMinutes: number;
  crossMidnight: boolean;
  expectedStartTime?: string;
  expectedEndTime?: string;
}

/**
 * Konversi waktu "HH:mm" ke menit sejak jam 00:00.
 */
export const timeToMinutes = (time: string): number => {
  if (!time || !time.includes(':')) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

/**
 * Engine kalkulasi terpusat untuk absensi.
 * Menghandle cross-midnight, keterlambatan, pulang awal, dan lembur.
 */
export const calculateAttendance = (
  checkIn: string | undefined | null,
  checkOut: string | undefined | null,
  config: AttendanceConfig,
  shift?: WorkShift,
  customSchedule?: ShiftSchedule
): AttendanceCalculation => {
  
  // Default metrics
  let lateMinutes = 0;
  let earlyLeaveMinutes = 0;
  let overtimeMinutes = 0;
  let workDurationMinutes = 0;
  let effectiveDurationMinutes = 0;
  let crossMidnight = false;
  
  // Menentukan Jadwal Harian (Schedule Resolution)
  let expectedStartTime = config.normalStartTime;
  let expectedEndTime = config.normalEndTime;
  let breakStart = config.normalBreakStartTime;
  let breakEnd = config.normalBreakEndTime;
  let lateTolerance = config.lateToleranceMinutes || 0;
  let earlyLeaveTolerance = config.earlyLeaveToleranceMinutes || 0;
  let minOvertime = config.minimumOvertimeMinutes || 0;
  
  // Jika ini mode shift dan shift ada
  if (shift && shift.isOff) {
    return {
      status: 'OFF',
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      overtimeMinutes: 0,
      workDurationMinutes: 0,
      effectiveDurationMinutes: 0,
      crossMidnight: false
    };
  } else if (shift) {
    expectedStartTime = shift.startTime;
    expectedEndTime = shift.endTime;
    breakStart = shift.breakStartTime || '';
    breakEnd = shift.breakEndTime || '';
    lateTolerance = shift.lateToleranceMinutes ?? lateTolerance;
    earlyLeaveTolerance = shift.earlyLeaveToleranceMinutes ?? earlyLeaveTolerance;
    crossMidnight = !!shift.crossDay;
  }
  
  // Override dari jadwal custom karyawan jika ada (Overshift)
  if (customSchedule) {
    if (customSchedule.shiftId === 'OFF') {
      return {
        status: 'OFF',
        lateMinutes: 0,
        earlyLeaveMinutes: 0,
        overtimeMinutes: 0,
        workDurationMinutes: 0,
        effectiveDurationMinutes: 0,
        crossMidnight: false
      };
    }
    if (customSchedule.startTime) expectedStartTime = customSchedule.startTime;
    if (customSchedule.endTime) expectedEndTime = customSchedule.endTime;
    // Cross midnight bisa dideteksi jika endTime < startTime
    if (timeToMinutes(expectedEndTime) < timeToMinutes(expectedStartTime)) {
      crossMidnight = true;
    } else if (customSchedule.startTime && customSchedule.endTime) {
      crossMidnight = false;
    }
  }

  // Jika tidak ada check-in, asumsikan absent (bisa diganti menjadi 'Leave' dsb di logika bisnis lain)
  if (!checkIn) {
    return {
      status: 'Absent',
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      overtimeMinutes: 0,
      workDurationMinutes: 0,
      effectiveDurationMinutes: 0,
      crossMidnight,
      expectedStartTime,
      expectedEndTime
    };
  }

  // Lakukan Kalkulasi
  const expStartMins = timeToMinutes(expectedStartTime);
  let expEndMins = timeToMinutes(expectedEndTime);
  if (crossMidnight || expEndMins < expStartMins) {
    expEndMins += 24 * 60; // Tambah 24 jam untuk end time
    crossMidnight = true; // Safety
  }

  const inMins = timeToMinutes(checkIn);
  let outMins = checkOut ? timeToMinutes(checkOut) : 0;
  
  // Cross Midnight logic untuk checkOut
  // Jika cross-midnight dan check-out sangat pagi (misal < jam 12 siang), anggap dia hari berikutnya
  if (checkOut) {
    if (crossMidnight && outMins < expStartMins) {
      outMins += 24 * 60;
    }
    
    // Total Duration
    workDurationMinutes = Math.max(0, outMins - inMins);
  }

  // Kalkulasi Terlambat
  if (inMins > expStartMins + lateTolerance) {
    lateMinutes = inMins - expStartMins;
  }

  // Kalkulasi Pulang Awal
  if (checkOut && outMins < expEndMins - earlyLeaveTolerance) {
    earlyLeaveMinutes = expEndMins - outMins;
  }
  
  // Break calculation
  let breakDuration = 0;
  if (breakStart && breakEnd) {
    let bStart = timeToMinutes(breakStart);
    let bEnd = timeToMinutes(breakEnd);
    if (bEnd < bStart) bEnd += 24 * 60;
    breakDuration = Math.max(0, bEnd - bStart);
  }
  
  // Effective Duration = Work - Break (If they were at work during break)
  if (checkOut) {
    effectiveDurationMinutes = Math.max(0, workDurationMinutes - breakDuration);
  }

  // Kalkulasi Lembur (Early Overtime & After-hours)
  if (config.autoOvertime !== false && checkOut) {
    let rawOvertime = 0;
    // Early overtime
    if (inMins < expStartMins) rawOvertime += (expStartMins - inMins);
    // After-hours overtime
    if (outMins > expEndMins) rawOvertime += (outMins - expEndMins);
    
    if (rawOvertime >= minOvertime) {
      overtimeMinutes = rawOvertime;
    }
  }

  // Tentukan Status
  let status: AttendanceCalculation['status'] = 'Present';
  const maxLateLimit = config.maxLateMinutes ?? ((config.maxLateHours || 0) * 60);

  if (maxLateLimit > 0 && lateMinutes > maxLateLimit) {
    // Jika melebihi batas maksimal terlambat, otomatis dianggap Alpa / Tidak Hadir
    status = 'Absent';
  } else if (lateMinutes > 0 && earlyLeaveMinutes > 0) {
    status = 'Late'; // Bisa gabungan, tapi prioritas Late
  } else if (lateMinutes > 0) {
    status = 'Late';
  } else if (earlyLeaveMinutes > 0) {
    status = 'Present'; // Still present if leaving early, just tracking earlyLeaveMinutes
  }

  return {
    status,
    lateMinutes,
    earlyLeaveMinutes,
    overtimeMinutes,
    workDurationMinutes,
    effectiveDurationMinutes,
    crossMidnight,
    expectedStartTime,
    expectedEndTime
  };
};

/**
 * Helper terpusat untuk kalkulasi Denda / Potongan Terlambat pemotong gaji pokok.
 * Mendukung 3 skema:
 * 1. Denda Seragam (Uniform/Flat)
 * 2. Berdasarkan Jam Telat (Hourly: Flat per jam atau Berjenjang)
 * 3. Berdasarkan Gaji Harian Kerja (Daily Wage: Proporsional Jam Kerja atau Persentase Upah Harian)
 */
export function calculateLateDeductionAmount(
  lateMinutes: number,
  basicSalary: number,
  config?: AttendanceConfig | null
): {
  amount: number;
  description: string;
  scheme: 'uniform' | 'hourly' | 'daily_wage' | 'none';
} {
  if (!config?.lateDeductionConfig?.enabled || !lateMinutes || lateMinutes <= (config.lateToleranceMinutes || 0)) {
    return { amount: 0, description: 'Tidak ada potongan denda', scheme: 'none' };
  }

  const dConfig = config.lateDeductionConfig;
  const lateHours = Math.max(1, Math.ceil(lateMinutes / 60)); // Bulatkan ke jam berikutnya (1 jam, 2 jam, 3 jam, dst)

  // 1. Skema Denda Seragam (Flat Nominal)
  if (dConfig.scheme === 'uniform') {
    const amt = dConfig.uniformAmount || 0;
    return {
      amount: amt,
      description: `Denda Seragam Rp ${amt.toLocaleString('id-ID')} / kejadian`,
      scheme: 'uniform',
    };
  }

  // 2. Skema Berdasarkan Jam Telat (Hourly)
  if (dConfig.scheme === 'hourly') {
    if (dConfig.hourlyMode === 'tiered' && dConfig.tieredRates && dConfig.tieredRates.length > 0) {
      // Cari tier yang sesuai atau tier tertinggi
      const sortedTiers = [...dConfig.tieredRates].sort((a, b) => a.hour - b.hour);
      const matchedTier = sortedTiers.find(t => t.hour === lateHours) || sortedTiers[sortedTiers.length - 1];
      const amt = matchedTier?.amount || 0;
      return {
        amount: amt,
        description: `Denda Telat Jam ke-${lateHours} (Rp ${amt.toLocaleString('id-ID')})`,
        scheme: 'hourly',
      };
    } else {
      // Tarif tetap per jam
      const rate = dConfig.ratePerHour || 0;
      const amt = lateHours * rate;
      return {
        amount: amt,
        description: `Denda Telat ${lateHours} Jam @ Rp ${rate.toLocaleString('id-ID')}/jam = Rp ${amt.toLocaleString('id-ID')}`,
        scheme: 'hourly',
      };
    }
  }

  // 3. Skema Berdasarkan Gaji Harian Kerja (Daily Wage Otomatis)
  if (dConfig.scheme === 'daily_wage') {
    const workingDays = dConfig.workingDaysPerMonth > 0 ? dConfig.workingDaysPerMonth : 25;
    const workingHours = dConfig.workingHoursPerDay > 0 ? dConfig.workingHoursPerDay : 8;
    const dailyWage = basicSalary > 0 ? (basicSalary / workingDays) : 0;
    const hourlyWage = dailyWage > 0 ? (dailyWage / workingHours) : 0;

    if (dConfig.dailyWageMode === 'percentage') {
      const pct = (dConfig.dailyWagePercentage || 50) / 100;
      const amt = Math.round(dailyWage * pct);
      return {
        amount: amt,
        description: `Potongan ${dConfig.dailyWagePercentage || 50}% Gaji Harian (Rp ${amt.toLocaleString('id-ID')})`,
        scheme: 'daily_wage',
      };
    } else if (dConfig.dailyWageMode === 'fixed_fraction') {
      const fraction = dConfig.fixedFraction || 0.5;
      const amt = Math.round(dailyWage * fraction);
      return {
        amount: amt,
        description: `Potongan ${fraction * 100}% Upah Harian (Rp ${amt.toLocaleString('id-ID')})`,
        scheme: 'daily_wage',
      };
    } else {
      // Mode 'pro_rata_hours' (Default Proporsional Jam Kerja)
      // Hitung per jam keterlambatan dari upah per jam
      const amt = Math.round(lateHours * hourlyWage);
      return {
        amount: amt,
        description: `Proporsional Gaji Harian (${lateHours} Jam @ Rp ${Math.round(hourlyWage).toLocaleString('id-ID')}/jam = Rp ${amt.toLocaleString('id-ID')})`,
        scheme: 'daily_wage',
      };
    }
  }

  return { amount: 0, description: '-', scheme: 'none' };
}
