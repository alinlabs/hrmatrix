import { LateDeductionConfig, LateDeductionSyncRecord, LateDeductionPayrollSummary } from '../types';

/**
 * Menghitung denda keterlambatan aktual berdasarkan presensi & konfigurasi denda,
 * serta menghasilkan struktur data yang siap disinkronkan ke Payroll.
 */
export function calculateLateDeductionAmount(
  lateMinutes: number,
  monthlySalary: number,
  config: LateDeductionConfig
): {
  nominalDeduction: number;
  calculationBasis: string;
  dailyWage: number;
  perMinuteWage: number;
  scheme: 'duration' | 'tiered' | 'static';
  subMethod: 'per_minute' | 'nominal' | 'percentage';
} {
  const workingDays = config.workingDaysPerMonth || 21;
  const workingHours = config.workingHoursPerDay || 8;
  const totalMinutesPerMonth = workingDays * workingHours * 60; // e.g. 21 * 8 * 60 = 10.080 menit
  
  const dailyWage = monthlySalary > 0 ? monthlySalary / workingDays : 0;
  const perMinuteWage = monthlySalary > 0 && totalMinutesPerMonth > 0 ? monthlySalary / totalMinutesPerMonth : 0;

  if (!config.enabled || lateMinutes <= 0) {
    return {
      nominalDeduction: 0,
      calculationBasis: lateMinutes <= 0 ? 'Tepat Waktu' : 'Denda Keterlambatan Nonaktif',
      dailyWage,
      perMinuteWage,
      scheme: (config.scheme as any) || 'duration',
      subMethod: 'nominal',
    };
  }

  // Normalize scheme for backward compatibility
  let currentScheme: string = config.scheme || 'duration';
  if (currentScheme === 'daily_wage') currentScheme = 'duration';
  if (currentScheme === 'hourly') currentScheme = 'tiered';
  if (currentScheme === 'uniform') currentScheme = 'static';

  if (currentScheme === 'duration') {
    // 1. DURASI: Total Menit Terlambat × Nilai Upah per Menit
    // Formula dasar: (Gaji Pokok ÷ Total Menit Kerja per Bulan) × Menit Terlambat
    const exactNominal = lateMinutes * perMinuteWage;
    const nominal = Math.round(exactNominal * 100) / 100;
    const perMinuteFormatted = perMinuteWage.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const basis = `${lateMinutes} menit × Rp ${perMinuteFormatted}/menit (Gaji Pokok Rp ${monthlySalary.toLocaleString('id-ID')} ÷ ${totalMinutesPerMonth.toLocaleString('id-ID')} menit)`;
    
    return {
      nominalDeduction: nominal,
      calculationBasis: basis,
      dailyWage,
      perMinuteWage,
      scheme: 'duration',
      subMethod: 'per_minute',
    };
  }

  if (currentScheme === 'tiered') {
    // 2. BERTINGKAT
    const subMethod = config.tieredSubMethod || 'nominal';
    const lateHours = Math.ceil(lateMinutes / 60); // Math.ceil(minutes/60) -> 1-60m = Jam ke-1, 61-120m = Jam ke-2
    const tiers = config.tieredRates && config.tieredRates.length > 0
      ? [...config.tieredRates].sort((a, b) => a.hour - b.hour)
      : [
          { hour: 1, amount: 10000, percentage: 5 },
          { hour: 2, amount: 20000, percentage: 10 },
          { hour: 3, amount: 30000, percentage: 15 },
        ];

    // Pick applicable tier
    let matchedTier = tiers.find(t => t.hour === lateHours);
    if (!matchedTier && tiers.length > 0) {
      if (lateHours > tiers[tiers.length - 1].hour) {
        matchedTier = tiers[tiers.length - 1]; // pick highest tier if exceeds max defined
      } else {
        matchedTier = tiers[0];
      }
    }

    if (subMethod === 'percentage') {
      const pct = matchedTier?.percentage ?? (matchedTier?.hour ? matchedTier.hour * 5 : 5);
      const exactNominal = dailyWage * (pct / 100);
      const nominal = Math.round(exactNominal * 100) / 100;
      const basis = `Jam ke-${lateHours} (${pct}% × Upah Harian Rp ${Math.round(dailyWage).toLocaleString('id-ID')})`;
      return {
        nominalDeduction: nominal,
        calculationBasis: basis,
        dailyWage,
        perMinuteWage,
        scheme: 'tiered',
        subMethod: 'percentage',
      };
    } else {
      const amount = matchedTier?.amount ?? (matchedTier?.hour ? matchedTier.hour * 10000 : 10000);
      return {
        nominalDeduction: amount,
        calculationBasis: `Jam ke-${lateHours} (Nominal Denda Rp ${amount.toLocaleString('id-ID')})`,
        dailyWage,
        perMinuteWage,
        scheme: 'tiered',
        subMethod: 'nominal',
      };
    }
  }

  // 3. STATIS
  const subMethod = config.staticSubMethod || 'nominal';
  if (subMethod === 'percentage') {
    const pct = config.staticPercentage ?? 5;
    const exactNominal = dailyWage * (pct / 100);
    const nominal = Math.round(exactNominal * 100) / 100;
    const basis = `Statis ${pct}% × Upah Harian Rp ${Math.round(dailyWage).toLocaleString('id-ID')}`;
    return {
      nominalDeduction: nominal,
      calculationBasis: basis,
      dailyWage,
      perMinuteWage,
      scheme: 'static',
      subMethod: 'percentage',
    };
  } else {
    const amount = config.staticAmount ?? config.uniformAmount ?? 25000;
    return {
      nominalDeduction: amount,
      calculationBasis: `Statis Nominal Rp ${amount.toLocaleString('id-ID')} per kejadian`,
      dailyWage,
      perMinuteWage,
      scheme: 'static',
      subMethod: 'nominal',
    };
  }
}

/**
 * Membuat Sync Record presensi siap kirim ke Payroll
 */
export function createLateDeductionSyncRecord(
  employeeId: string,
  employeeName: string,
  department: string | undefined,
  period: string,
  attendanceDate: string,
  lateMinutes: number,
  monthlySalary: number,
  config: LateDeductionConfig
): LateDeductionSyncRecord {
  const calc = calculateLateDeductionAmount(lateMinutes, monthlySalary, config);
  return {
    id: `late-sync-${employeeId}-${attendanceDate}`,
    employeeId,
    employeeName,
    department,
    period,
    attendanceDate,
    lateMinutes,
    scheme: calc.scheme,
    subMethod: calc.subMethod,
    calculationBasis: calc.calculationBasis,
    monthlyBasicSalary: monthlySalary,
    dailyWage: calc.dailyWage,
    perMinuteWage: calc.perMinuteWage,
    nominalDeduction: calc.nominalDeduction,
    syncedToPayroll: true,
    syncedAt: new Date().toISOString(),
  };
}

/**
 * Membuat rekapitulasi denda per karyawan per periode payroll
 */
export function summarizeLateDeductionsForPayroll(records: LateDeductionSyncRecord[]): LateDeductionPayrollSummary[] {
  const summaryMap = new Map<string, LateDeductionPayrollSummary>();

  for (const rec of records) {
    const key = `${rec.employeeId}_${rec.period}`;
    const existing = summaryMap.get(key);

    if (existing) {
      existing.totalLateIncidents += 1;
      existing.totalLateMinutes += rec.lateMinutes;
      existing.totalNominalDeduction += rec.nominalDeduction;
      existing.records.push(rec);
    } else {
      summaryMap.set(key, {
        employeeId: rec.employeeId,
        employeeName: rec.employeeName,
        period: rec.period,
        totalLateIncidents: 1,
        totalLateMinutes: rec.lateMinutes,
        totalNominalDeduction: rec.nominalDeduction,
        records: [rec],
      });
    }
  }

  return Array.from(summaryMap.values());
}
