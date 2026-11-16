import { calculateTunjanganJabatan } from '../services/tunjangan-jabatan-service';

export interface AllowanceCalculationContext {
  basicSalary: number;
  level?: string;
  serviceMonths?: number;
  daysAttended?: number;
  workingDaysInMonth?: number;
}

export interface AllowanceCalculationResult {
  amount: number;
  label?: string;
  breakdown?: string;
}

export function calculateAllowancePreview(
  ruleData: any,
  context: AllowanceCalculationContext
): AllowanceCalculationResult {
  if (!ruleData) {
    return { amount: 0, label: 'Tidak ada aturan', breakdown: '' };
  }

  const basicSalary = Math.max(0, Number(context.basicSalary || 0));
  const serviceMonths = Math.max(0, Number(context.serviceMonths ?? 12));
  const workingDays = Math.max(1, Number(context.workingDaysInMonth ?? ruleData.workingDaysPerMonth ?? 22));
  const daysAttended = Math.max(0, Number(context.daysAttended ?? workingDays));

  const ruleName = String(ruleData.nama || ruleData.name || '').toLowerCase();
  const metode = String(ruleData.metode_perhitungan || '').toLowerCase();
  const ruleType = String(ruleData.ruleType || '').toLowerCase();

  // 1. Tunjangan Jabatan berbasis jenjang posisi
  if (ruleName.includes('tunjangan jabatan') || ruleData.id === 'rule-tunjangan-jabatan') {
    const res = calculateTunjanganJabatan(context.level, basicSalary);
    if (res.nominal > 0) {
      return {
        amount: Math.round(res.nominal),
        label: res.matchedLevelName,
        breakdown: `Jenjang ${res.matchedLevelName} (${res.percentage}% referensi)`,
      };
    }
  }

  // 2. Berjenjang / Daftar Jenjang
  if ((metode === 'berjenjang' || ruleType === 'tiered') && Array.isArray(ruleData.daftarJenjang) && ruleData.daftarJenjang.length > 0) {
    const levelLower = String(context.level || '').toLowerCase();
    const matched =
      ruleData.daftarJenjang.find(
        (j: any) =>
          String(j.level || '').toLowerCase() === levelLower ||
          String(j.namaJenjang || '').toLowerCase().includes(levelLower) ||
          (Array.isArray(j.alias) && j.alias.some((a: string) => a.toLowerCase() === levelLower))
      ) || ruleData.daftarJenjang[0];

    const amount = Number(matched?.nominal || 0);
    return {
      amount: Math.round(amount),
      label: matched?.namaJenjang || 'Jenjang Standar',
      breakdown: `Tarif jenjang ${matched?.namaJenjang || ''}`.trim(),
    };
  }

  // 3. Masa kerja / Aturan berjenjang numerik
  if (Array.isArray(ruleData.aturan) && ruleData.aturan.length > 0) {
    const years = serviceMonths / 12;
    const paramVal =
      ruleData.parameter_jenjang?.satuan === 'bulan' ? serviceMonths : years;

    const matchedTier = ruleData.aturan.find((t: any) => {
      const min = t.min !== null && t.min !== undefined ? Number(t.min) : 0;
      const max = t.max !== null && t.max !== undefined ? Number(t.max) : Infinity;
      return paramVal >= min && paramVal <= max;
    });

    if (matchedTier) {
      const val = Number(matchedTier.nilai ?? matchedTier.nominal ?? 0);
      const isPercent =
        String(ruleData.satuan_nilai || matchedTier.tipeNilai || '').toLowerCase().includes('%') ||
        String(ruleData.dasar_perhitungan || '').toLowerCase().includes('gaji pokok');
      const amount = isPercent && val <= 100 ? (basicSalary * val) / 100 : val;
      return {
        amount: Math.round(amount),
        label: matchedTier.keterangan || 'Tarif Berjenjang',
        breakdown: isPercent ? `${val}% × Gaji Pokok` : `Nominal tetap Rp ${Math.round(amount).toLocaleString('id-ID')}`,
      };
    }
  }

  // 4. Harian / Kehadiran
  if (metode === 'harian' || ruleType === 'dailywage' || ruleData.allowanceType === 'attendance' || ruleData.allowanceType === 'attendance_unit') {
    const dailyRate = Number(ruleData.nilai ?? ruleData.unitRate ?? ruleData.fixedAmount ?? 0);
    const amount = dailyRate * daysAttended;
    return {
      amount: Math.round(amount),
      label: `${daysAttended} hari hadir`,
      breakdown: `${daysAttended} hari × Rp ${dailyRate.toLocaleString('id-ID')}`,
    };
  }

  // 5. Prorata (misal THR Keagamaan)
  if (metode === 'prorata' || ruleData.allowanceType === 'thr_religious' || ruleData.allowanceType === 'prorata_tenure') {
    const divisor = Math.max(1, Number(ruleData.prorataDivisorMonths ?? ruleData.periode_dasar ?? 12));
    const ratio = serviceMonths >= divisor ? 1 : serviceMonths / divisor;
    const base =
      ruleData.prorataFixedBase && Number(ruleData.prorataFixedBase) > 0
        ? Number(ruleData.prorataFixedBase)
        : (basicSalary * Number(ruleData.prorataBasePercent ?? 100)) / 100;
    const amount = base * ratio;
    return {
      amount: Math.round(amount),
      label: serviceMonths >= divisor ? 'Penuh (≥ 12 Bulan)' : `Prorata (${serviceMonths}/${divisor} bln)`,
      breakdown: `Rasio ${(ratio * 100).toFixed(0)}% × Rp ${Math.round(base).toLocaleString('id-ID')}`,
    };
  }

  // 6. Persentase dari gaji pokok
  if (
    metode === 'persentase' ||
    ruleType === 'percentage' ||
    ruleType === 'percentagemax' ||
    ruleType === 'percentagewithmax'
  ) {
    const pct = Number(ruleData.nilai ?? ruleData.employeeShare ?? ruleData.employerShare ?? 0);
    let amount = (basicSalary * pct) / 100;
    if (ruleData.maximumBase && basicSalary > ruleData.maximumBase) {
      amount = (Number(ruleData.maximumBase) * pct) / 100;
    }
    return {
      amount: Math.round(amount),
      label: `${pct}% Gaji Pokok`,
      breakdown: `${pct}% × Rp ${basicSalary.toLocaleString('id-ID')}`,
    };
  }

  // 7. Default nominal tetap
  const fixedVal = Number(ruleData.fixedAmount ?? ruleData.nilai ?? 0);
  return {
    amount: Math.round(fixedVal),
    label: 'Nominal Tetap',
    breakdown: `Rp ${Math.round(fixedVal).toLocaleString('id-ID')} / ${ruleData.frekuensi_pembayaran || 'bulan'}`,
  };
}
