import { PayrollRule } from '../types';
import { calculateTunjanganJabatan, isTunjanganJabatanName } from '../services/tunjanganJabatanService';

export interface EmployeeAllowanceContext {
  basicSalary: number;
  serviceMonths: number;
  level?: string;
  daysAttended?: number;
  workingDaysInMonth?: number;
  shiftsWorked?: number;
  overtimeHours?: number;
  overtimeEvents?: number;
}

export interface CalculationResult {
  amount: number;
  formulaDescription: string;
  notes: string;
  isEligible: boolean;
}

export function calculateAllowancePreview(
  rule: Partial<PayrollRule>,
  context: EmployeeAllowanceContext
): CalculationResult {
  const { 
    basicSalary = 0, 
    serviceMonths = 0, 
    level = 'Staff',
    daysAttended = 0, 
    workingDaysInMonth = 25,
    shiftsWorked = 10,
    overtimeHours = 8,
    overtimeEvents = 4
  } = context;

  // Check if rule is Tunjangan Jabatan (level-based structure)
  const ruleName = rule.name || rule.nama || '';
  if (isTunjanganJabatanName(ruleName) || (rule.id && isTunjanganJabatanName(rule.id))) {
    const tjResult = calculateTunjanganJabatan(level, basicSalary);
    return {
      amount: tjResult.nominal,
      formulaDescription: `Jenjang Level ${tjResult.matchedLevelName}: Rp ${new Intl.NumberFormat('id-ID').format(tjResult.nominal)}`,
      notes: tjResult.formulaDescription,
      isEligible: true
    };
  }
  
  const serviceYears = Math.floor(serviceMonths / 12);
  const remainingMonths = serviceMonths % 12;

  // Use Unified Fields if available, otherwise map from legacy fields
  const metode = rule.metode_perhitungan || (
    rule.calculationModel === 'percentage' || rule.ruleType === 'Percentage' ? 'persentase' :
    rule.calculationModel === 'unit_based' || rule.ruleType === 'DailyWage' ? 'harian' :
    rule.calculationModel === 'prorata' ? 'prorata' :
    rule.calculationModel === 'tiered' ? 'berjenjang' :
    rule.calculationModel === 'multiplier' ? 'kelipatan' :
    rule.calculationModel === 'appreciation' ? 'apresiasi' : 'tetap'
  );

  const dasar = rule.dasar_perhitungan || ((metode === 'persentase' || rule.ruleType === 'Percentage') ? 'Gaji Pokok' : 'Nominal');
  let nilai = rule.nilai ?? (rule.fixedAmount || rule.employeeShare || rule.unitRate || 0);
  if (rule.ruleType === 'Percentage' && !rule.nilai && rule.employeeShare) {
    nilai = rule.employeeShare;
  }
  const isPercent = dasar === 'Gaji Pokok' || dasar === 'gaji_pokok' || (rule as any).satuan_nilai === 'persen' || metode === 'persentase';
  const aturanList = rule.aturan || [];

  // Helper to resolve base value
  const getBaseValue = (dasar_calc: string) => {
    const d = (dasar_calc || '').toLowerCase();
    if (d.includes('gaji') || d.includes('pokok') || d.includes('upah')) return basicSalary;
    if (d.includes('kehadiran')) return daysAttended;
    return basicSalary || 1;
  };

  const baseVal = getBaseValue(dasar);

  // 1. Metode: Prorata (e.g. THR)
  if (metode === 'prorata') {
    const periode_dasar = rule.periode_dasar || 12; // e.g. 12 months for THR
    let finalAmount = 0;
    let formulaDesc = '';
    let appliedRule = false;

    // Check specific aturan if available (normally empty for simple THR Prorata)
    if (aturanList.length > 0) {
      for (const a of aturanList) {
        let paramVal = serviceMonths; // Default to months
        let satuan_param = 'bulan';
        
        if (rule.parameter_jenjang && typeof rule.parameter_jenjang === 'object') {
           if (rule.parameter_jenjang.parameter === 'kehadiran') paramVal = daysAttended;
           if (rule.parameter_jenjang.satuan === 'tahun') paramVal = serviceYears;
           if (rule.parameter_jenjang.satuan === 'hari') paramVal = daysAttended; // fallback
           satuan_param = rule.parameter_jenjang.satuan;
        }

        const meetsMin = a.min === null || a.min === undefined || paramVal >= Number(a.min);
        const meetsMax = a.max === null || a.max === undefined || paramVal <= Number(a.max);

        if (meetsMin && meetsMax) {
          appliedRule = true;
          let finalVal = a.nilai || 0;
          if (isPercent) {
             finalAmount = (finalVal / 100) * baseVal;
             formulaDesc = `Persentase Berjenjang: ${finalVal}% × Rp ${new Intl.NumberFormat('id-ID').format(baseVal)}`;
          } else {
             finalAmount = finalVal;
             formulaDesc = `Nominal Berjenjang: Rp ${new Intl.NumberFormat('id-ID').format(finalAmount)}`;
          }
          break;
        }
      }
    }

    if (!appliedRule) {
       // Default Prorata fallback
       if (serviceMonths < 1) {
          return {
             amount: 0,
             formulaDescription: `Masa kerja < 1 bulan`,
             notes: `Belum berhak`,
             isEligible: false
          };
       }
       if (serviceMonths >= periode_dasar) {
          finalAmount = isPercent && nilai > 0 ? (nilai / 100) * baseVal : baseVal;
          formulaDesc = `Penuh: 1 × Rp ${new Intl.NumberFormat('id-ID').format(baseVal)}`;
       } else {
          const prorataRatio = serviceMonths / periode_dasar;
          finalAmount = isPercent && nilai > 0 ? prorataRatio * ((nilai / 100) * baseVal) : prorataRatio * baseVal;
          formulaDesc = `Prorata: (${serviceMonths}/${periode_dasar}) × Rp ${new Intl.NumberFormat('id-ID').format(baseVal)}`;
       }
    }

    return {
      amount: Math.round(finalAmount),
      formulaDescription: formulaDesc,
      notes: `Perhitungan proporsional masa kerja.`,
      isEligible: finalAmount > 0
    };
  }

  // 2. Metode: Berjenjang (Tiered Bonus)
  if (metode === 'berjenjang') {
    if (aturanList.length === 0) {
      return {
        amount: 0, formulaDescription: 'Belum ada aturan berjenjang', notes: 'Aturan kosong', isEligible: false
      };
    }

    let finalAmount = 0;
    let applied = false;
    let matchedTierInfo = '';

    for (const a of aturanList) {
      let paramVal = serviceMonths;
      let satuanName = 'bulan';
      
      if (rule.parameter_jenjang && typeof rule.parameter_jenjang === 'object') {
         if (rule.parameter_jenjang.parameter === 'kehadiran') {
           paramVal = daysAttended;
           satuanName = 'hari';
         } else if (rule.parameter_jenjang.parameter === 'masa_kerja') {
           paramVal = rule.parameter_jenjang.satuan === 'tahun' ? serviceYears : serviceMonths;
           satuanName = rule.parameter_jenjang.satuan === 'tahun' ? 'thn' : 'bln';
         }
      }
      
      const meetsMin = a.min === null || a.min === undefined || paramVal >= Number(a.min);
      const meetsMax = a.max === null || a.max === undefined || paramVal <= Number(a.max);

      if (meetsMin && meetsMax) {
         if (isPercent) {
            finalAmount = ((a.nilai || 0) / 100) * baseVal;
            matchedTierInfo = `Tier [${a.min ?? 0} - ${a.max ?? '∞'} ${satuanName}]: ${a.nilai}% × Gaji Pokok (Rp ${new Intl.NumberFormat('id-ID').format(baseVal)})`;
         } else {
            finalAmount = a.nilai || 0;
            matchedTierInfo = `Tier [${a.min ?? 0} - ${a.max ?? '∞'} ${satuanName}]: Rp ${new Intl.NumberFormat('id-ID').format(finalAmount)}`;
         }
         applied = true;
         break;
      }
    }

    const parameterName = rule.parameter_jenjang && typeof rule.parameter_jenjang === 'object' ? rule.parameter_jenjang.parameter : 'masa_kerja';

    return {
      amount: Math.round(finalAmount),
      formulaDescription: applied ? matchedTierInfo : `Tidak memenuhi syarat batas rentang jenjang`,
      notes: isPercent 
        ? `Dihitung dari persentase Gaji Pokok sesuai tabel jenjang ${parameterName}.`
        : `Dihitung dari nominal tetap sesuai tabel jenjang ${parameterName}.`,
      isEligible: applied && finalAmount > 0
    };
  }

  // 3. Metode: Kelipatan (Multiplier)
  if (metode === 'kelipatan') {
    const ratePerYear = nilai || 0;
    const totalAmount = serviceYears * ratePerYear;
    return {
      amount: Math.round(totalAmount),
      formulaDescription: `${serviceYears} Tahun × Rp ${new Intl.NumberFormat('id-ID').format(ratePerYear)}`,
      notes: `Dikalikan dengan ${serviceYears} tahun pengabdian penuh.`,
      isEligible: totalAmount > 0
    };
  }

  // 4. Metode: Harian (Kehadiran / Unit Based)
  if (metode === 'harian') {
    const unitRate = nilai || 0;
    const count = dasar === 'kehadiran' ? daysAttended : 1; 
    const totalAmount = count * unitRate;

    return {
      amount: Math.round(totalAmount),
      formulaDescription: `${count} Hari Hadir × Rp ${new Intl.NumberFormat('id-ID').format(unitRate)}`,
      notes: `Dihitung otomatis dari rekap ${count} hari kehadiran kerja (in-out) pada periode berjalan.`,
      isEligible: totalAmount > 0
    };
  }

  // 5. Metode: Persentase (e.g. 10% dari Gaji Pokok)
  if (metode === 'persentase') {
    const percent = nilai || 0;
    const total = (percent / 100) * baseVal;
    return {
      amount: Math.round(total),
      formulaDescription: `${percent}% × Rp ${new Intl.NumberFormat('id-ID').format(baseVal)}`,
      notes: `Dihitung dari persentase ${dasar.replace('_', ' ')}.`,
      isEligible: total > 0
    };
  }

  // 6. Metode: Tetap atau Apresiasi (Fixed)
  const fixed = nilai || 0;
  
  // Check minimal service or attendance if defined in aturan (threshold logic)
  if (aturanList.length > 0) {
    let eligible = false;
    for (const a of aturanList) {
       let paramVal = serviceMonths;
       if (rule.parameter_jenjang && typeof rule.parameter_jenjang === 'object') {
          if (rule.parameter_jenjang.parameter === 'kehadiran') paramVal = daysAttended;
          else if (rule.parameter_jenjang.parameter === 'masa_kerja') {
             paramVal = rule.parameter_jenjang.satuan === 'tahun' ? serviceYears : serviceMonths;
          }
       }
       
       const meetsMin = a.min === null || a.min === undefined || paramVal >= Number(a.min);
       const meetsMax = a.max === null || a.max === undefined || paramVal <= Number(a.max);
       
       if (meetsMin && meetsMax) {
          eligible = true;
          break;
       }
    }
    if (!eligible) {
       return {
          amount: 0,
          formulaDescription: `Belum memenuhi syarat minimal`,
          notes: `Tidak memenuhi kondisi/aturan yang ditetapkan.`,
          isEligible: false
       };
    }
  }

  return {
    amount: Math.round(fixed),
    formulaDescription: `Nominal Tetap = Rp ${new Intl.NumberFormat('id-ID').format(fixed)}`,
    notes: 'Nominal komponen tetap acuan.',
    isEligible: fixed > 0
  };
}
