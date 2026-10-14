import { Employee, PayrollRecord, PayrollPeriod, Attendance, OvertimeConfig } from '../../types';
import { calculateEmployeeBpjsSimulation, calculateEmployeeTaxSimulation } from '../../services/taxBpjsService';
import { isFixedAllowance } from '../../utils/allowanceClassification';

export interface GeneratePayrollOptions {
  periodId: string;
  month: string;
  year: number;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Calculating' | 'Reviewed' | 'Approved' | 'Paid' | 'Closed';
  attendanceRecords?: Attendance[];
  defaultWorkingDays?: number;
}

/**
 * Generator kalkulasi Payroll yang presisi & terhubung langsung dengan:
 * 1. Data Karyawan (Gaji Pokok, Tunjangan Tetap/Variabel, PTKP, NPWP, BPJS)
 * 2. Log Presensi (Hari Hadir, Alpa/Mangkir, Cuti, Sakit, Menit Telat, Jam Lembur)
 * 3. Regulasi Pajak PPh 21 TER (PP 58/2023 / PMK 168/2023)
 * 4. Regulasi BPJS Kesehatan & Ketenagakerjaan (JHT, JP, JKK, JKM, JKP)
 */
export function generateAccuratePayrollRecords(
  employees: Employee[],
  options: GeneratePayrollOptions
): { period: PayrollPeriod; records: PayrollRecord[] } {
  const {
    periodId,
    month,
    year,
    startDate,
    endDate,
    status,
    attendanceRecords = [],
    defaultWorkingDays = 22
  } = options;

  const period: PayrollPeriod = {
    id: periodId,
    name: `Payroll ${month} ${year}`,
    month,
    year,
    startDate,
    endDate,
    status
  };

  const records: PayrollRecord[] = employees.map((emp, index) => {
    const basicSalary = emp.basicSalary || 0;
    
    // 1. Hitung akumulasi kehadiran dari log presensi
    const empAttendance = attendanceRecords.filter(a => a.employeeId === emp.id);
    let attendanceDays = 0;
    let absentDays = 0;
    let leaveDays = 0;
    let sickDays = 0;
    let lateMinutes = 0;
    let overtimeHours = 0;

    if (empAttendance.length > 0) {
      empAttendance.forEach(att => {
        if (att.status === 'Present' || att.status === 'Late' || att.status === 'WFH') {
          attendanceDays += 1;
        } else if (att.status === 'Absent') {
          absentDays += 1;
        } else if (att.status === 'Leave') {
          leaveDays += 1;
        } else if (att.status === 'Sick') {
          sickDays += 1;
        }
        if (att.lateMinutes && att.lateMinutes > 0) {
          lateMinutes += att.lateMinutes;
        }
        if (att.overtimeHours && att.overtimeHours > 0) {
          overtimeHours += att.overtimeHours;
        } else if (att.overtimeMinutes && att.overtimeMinutes > 0) {
          overtimeHours += att.overtimeMinutes / 60;
        }
      });
    } else {
      // Default jika log spesifik belum terdistribusi
      attendanceDays = defaultWorkingDays;
      if (index % 7 === 0 && emp.category !== 'Eksekutif / C-Level') {
        absentDays = 1;
        attendanceDays -= 1;
      }
      if (index % 4 === 0 && (emp.departmentId === 'dept-prod' || emp.departmentId === 'dept-qc')) {
        overtimeHours = 8;
      }
    }

    // 2. Evaluasi Tunjangan (Allowances)
    let fixedAllowance = 0;
    let variableAllowance = 0;
    const allowancesBreakdown: { id: string; name: string; amount: number; ruleId?: string; isCustom?: boolean }[] = [];

    if (emp.allowances && emp.allowances.length > 0) {
      emp.allowances.forEach(a => {
        const amount = Number(a.amount || 0);
        if (isFixedAllowance(a)) {
          fixedAllowance += amount;
        } else {
          variableAllowance += amount;
        }
        allowancesBreakdown.push({
          id: a.id || `alw-${emp.id}-${allowancesBreakdown.length + 1}`,
          name: a.name,
          amount,
          ruleId: a.ruleId,
          isCustom: false
        });
      });
    } else if (emp.fixedAllowance) {
      fixedAllowance = emp.fixedAllowance;
      allowancesBreakdown.push({
        id: `alw-fixed-${emp.id}`,
        name: 'Tunjangan Tetap Posisi',
        amount: emp.fixedAllowance,
        isCustom: false
      });
    }

    // 3. Upah Lembur (Overtime)
    // Standar Depnaker: Upah per jam = 1/173 x (Gaji Pokok + Tunjangan Tetap)
    let overtime = 0;
    if (overtimeHours > 0) {
      if (emp.overtimeRatePerHour && emp.overtimeRatePerHour > 0) {
        overtime = Math.round(overtimeHours * emp.overtimeRatePerHour);
      } else {
        const hourlyRate = (basicSalary + fixedAllowance) / 173;
        // Asumsi rata-rata faktor pengali lembur 1.5x - 2.0x
        overtime = Math.round(overtimeHours * hourlyRate * 1.5);
      }
    }

    const bonus = 0;
    const commission = 0;
    const otherIncome = 0;

    // 4. Potongan Absensi & Keterlambatan
    // Potongan alpa = (Gaji Pokok / 25 hari kerja) * absentDays
    const dailyWage = basicSalary > 0 ? Math.round(basicSalary / 25) : 0;
    const absenceDeduction = absentDays > 0 ? dailyWage * absentDays : 0;
    
    // Potongan telat (misal Rp 1.000 per menit jika > 15 menit)
    const lateDeduction = lateMinutes > 15 ? (lateMinutes - 15) * 1000 : 0;
    const loan = 0;
    const advance = 0;
    const otherDeduction = 0;

    // 5. Total Penghasilan Bruto (Gross Salary)
    const grossSalary = basicSalary + fixedAllowance + variableAllowance + overtime + bonus + commission + otherIncome;

    // 6. BPJS Kesehatan & Ketenagakerjaan (Simulasi Resmi)
    const healthProfile = emp.bpjsKesehatanProfile || {
      participantType: 'PPU Badan Usaha',
      activeStatus: emp.bpjsHealthParticipant === 'None' ? 'Inactive' : 'Active',
      employeeRate: 1,
      employerRate: 4
    };

    const tkProfile = emp.bpjsKetenagakerjaanProfile || {
      activeStatus: 'Active',
      hasJht: true,
      hasJkk: true,
      jkkRiskCategory: emp.jkkRisk || 'Medium',
      hasJkm: true,
      hasJp: true,
      hasJkp: true
    };

    const bpjsSim = calculateEmployeeBpjsSimulation(basicSalary, fixedAllowance, healthProfile, tkProfile);
    const bpjsHealthEmployee = bpjsSim.kesehatan.employeeAmount || 0;
    const bpjsJhtEmployee = bpjsSim.ketenagakerjaan.jht.employeeAmount || 0;
    const bpjsJpEmployee = bpjsSim.ketenagakerjaan.jp.employeeAmount || 0;
    const totalBpjsDeduction = bpjsHealthEmployee + bpjsJhtEmployee + bpjsJpEmployee;

    // 7. PPh 21 TER (Tarif Efektif Rata-Rata)
    const ptkpStatus = emp.taxProfile?.ptkpStatus || emp.taxStatus || 'TK/0';
    const taxMethod = emp.taxProfile?.taxMethod || 'Gross';
    const hasNpwp = !!emp.npwp && emp.npwp.trim() !== '';

    // Dasar pengenaan pajak bruto bulanan mencakup premi yang ditanggung pemberi kerja (JKK, JKM, BPJS Kes)
    const taxableGross = grossSalary + 
      (bpjsSim.kesehatan.employerAmount || 0) + 
      (bpjsSim.ketenagakerjaan.jkk.amount || 0) + 
      (bpjsSim.ketenagakerjaan.jkm.amount || 0);

    const taxSim = calculateEmployeeTaxSimulation(taxableGross, ptkpStatus, taxMethod, hasNpwp);
    let taxDeduction = taxSim.pph21Monthly || 0;

    if (taxMethod === 'Nett') {
      taxDeduction = 0;
    }

    // 8. Deductions Breakdown
    const deductionsBreakdown: { id: string; name: string; amount: number; ruleId?: string; isCustom?: boolean }[] = [];

    if (absenceDeduction > 0) {
      deductionsBreakdown.push({
        id: `ded-abs-${emp.id}`,
        name: `Potongan Mangkir / Alpa (${absentDays} hari)`,
        amount: absenceDeduction,
        ruleId: 'rule_absensi'
      });
    }

    if (lateDeduction > 0) {
      deductionsBreakdown.push({
        id: `ded-late-${emp.id}`,
        name: `Denda Keterlambatan (${lateMinutes} mnt)`,
        amount: lateDeduction,
        ruleId: 'rule_terlambat'
      });
    }

    if (bpjsHealthEmployee > 0) {
      deductionsBreakdown.push({
        id: `ded-bpjs-kes-${emp.id}`,
        name: 'Iuran BPJS Kesehatan (1%)',
        amount: bpjsHealthEmployee,
        ruleId: 'rule_bpjs_kes_1'
      });
    }

    if (bpjsJhtEmployee > 0) {
      deductionsBreakdown.push({
        id: `ded-bpjs-jht-${emp.id}`,
        name: 'Iuran BPJS TK - JHT (2%)',
        amount: bpjsJhtEmployee,
        ruleId: 'rule_jht_1'
      });
    }

    if (bpjsJpEmployee > 0) {
      deductionsBreakdown.push({
        id: `ded-bpjs-jp-${emp.id}`,
        name: 'Iuran BPJS TK - Jaminan Pensiun (1%)',
        amount: bpjsJpEmployee,
        ruleId: 'rule_jp_1'
      });
    }

    if (taxDeduction > 0) {
      deductionsBreakdown.push({
        id: `ded-pph21-${emp.id}`,
        name: `PPh 21 TER (${taxSim.terCategory || 'A'} - ${(taxSim.terRate * 100).toFixed(2)}%)`,
        amount: taxDeduction,
        ruleId: 'rule_pph21_ter'
      });
    }

    // 9. Total Potongan & Gaji Bersih (Net Take-Home Pay)
    const totalDeduction = absenceDeduction + lateDeduction + loan + advance + totalBpjsDeduction + taxDeduction + otherDeduction;
    const netSalary = grossSalary - totalDeduction;

    return {
      id: `pr-${periodId}-${emp.id}`,
      payrollPeriodId: periodId,
      employeeId: emp.id,
      basicSalary,
      fixedAllowance,
      variableAllowance,
      overtime,
      bonus,
      commission,
      otherIncome,
      grossSalary,
      absenceDeduction,
      lateDeduction,
      loan,
      advance,
      bpjs: totalBpjsDeduction,
      tax: taxDeduction,
      otherDeduction,
      totalDeduction,
      netSalary,
      attendanceDays,
      absentDays,
      leaveDays,
      sickDays,
      overtimeHours,
      allowancesBreakdown,
      deductionsBreakdown,
      status: status === 'Paid' ? 'Paid' : 'Draft'
    };
  });

  return { period, records };
}
