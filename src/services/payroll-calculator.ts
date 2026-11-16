import { db } from '../db/database';
import { Employee, OvertimeCategoryConfig, OvertimeConfig, PayrollRecord, PayrollRule } from '../types';
import { DEFAULT_ATTENDANCE_CONFIG } from './attendance-config-service';
import {
  BPJS_CONFIG,
  calculateEmployeeBpjsSimulation,
  calculateEmployeeTaxSimulation,
} from './tax-bpjs-service';
import { calculateAllowancePreview } from '../utils/allowance-calculator';
import { getAllowanceCategory } from '../utils/allowance-classification';
import { getPositionDetails } from './position-service';

function computeTieredMultiplierTotal(
  hours: number,
  cfg: OvertimeCategoryConfig,
  hourlyWage: number
): number {
  const wholeHours = Math.floor(hours);
  const fraction = hours - wholeHours;
  const tiers =
    cfg.tieredMultipliers && cfg.tieredMultipliers.length > 0
      ? cfg.tieredMultipliers
      : [cfg.multiplierFirstHour || 1.5, cfg.multiplierNextHours || 2.0];

  let total = 0;
  for (let i = 0; i < wholeHours; i++) {
    const mult = tiers[Math.min(i, tiers.length - 1)] || cfg.multiplierNextHours || 2.0;
    total += hourlyWage * mult;
  }
  if (fraction > 0) {
    const nextMult = tiers[Math.min(wholeHours, tiers.length - 1)] || cfg.multiplierNextHours || 2.0;
    total += hourlyWage * nextMult * fraction;
  }
  return Math.round(total);
}

function computeTieredNominalTotal(hours: number, cfg: OvertimeCategoryConfig): number {
  const wholeHours = Math.floor(hours);
  const fraction = hours - wholeHours;
  const nominals =
    cfg.tieredNominals && cfg.tieredNominals.length > 0
      ? cfg.tieredNominals
      : [cfg.staticFirstHourRate || 35000, cfg.staticNextHoursRate || 45000];

  let total = 0;
  for (let i = 0; i < wholeHours; i++) {
    const rate = nominals[Math.min(i, nominals.length - 1)] || cfg.ratePerHour || 25000;
    total += rate;
  }
  if (fraction > 0) {
    const nextRate = nominals[Math.min(wholeHours, nominals.length - 1)] || cfg.ratePerHour || 25000;
    total += nextRate * fraction;
  }
  return Math.round(total);
}

export function calculateOvertimeAmountForShift(
  durationHours: number,
  wageCategory: string,
  emp: Employee,
  overtimeConfig?: OvertimeConfig
): number {
  const hours = Math.max(0, Number(durationHours || 0));
  if (hours <= 0) return 0;

  const cfg = overtimeConfig || DEFAULT_ATTENDANCE_CONFIG.overtimeConfig!;
  const isOffday = wageCategory.toUpperCase() === 'OFFDAY';
  const catCfg = isOffday ? cfg.offday : cfg.normalWorkday;

  const basic = Math.max(0, Number(emp.basicSalary || 0));
  const divider = Math.max(1, Number(catCfg.baseDivider || 173));
  const hourlyWage = basic / divider;

  if (catCfg.calculationBasis === 'nominal') {
    if (catCfg.calculationType === 'static') {
      return Math.round(hours * Number(catCfg.ratePerHour || 25000));
    }
    return computeTieredNominalTotal(hours, catCfg);
  }

  if (catCfg.calculationType === 'static') {
    const flatMult = Number(catCfg.flatSalaryMultiplier ?? catCfg.flatMultiplier ?? 1.5);
    if (catCfg.calculationBasis === 'government' || catCfg.calculationBasis === 'salary_hourly' || catCfg.calculationBasis === 'manual_divider' || catCfg.calculationBasis === 'salary') {
      return Math.round(hours * hourlyWage * flatMult);
    }
    return Math.round(hours * Number(catCfg.ratePerHour || 25000));
  }

  return computeTieredMultiplierTotal(hours, catCfg, hourlyWage);
}

function getServiceMonths(joinDate?: string, referenceDate?: string): number {
  if (!joinDate) return 12;
  const start = new Date(joinDate);
  const ref = referenceDate ? new Date(referenceDate) : new Date();
  if (isNaN(start.getTime()) || isNaN(ref.getTime())) return 12;
  const months =
    (ref.getFullYear() - start.getFullYear()) * 12 + (ref.getMonth() - start.getMonth());
  return Math.max(1, months);
}

export async function processPayrollRecord(
  emp: Employee,
  inputs: Partial<PayrollRecord> & Record<string, any> = {},
  periodStartDate?: string,
  disabledRuleIds: string[] = []
): Promise<Omit<PayrollRecord, 'id' | 'payrollPeriodId'>> {
  const disabledSet = new Set(disabledRuleIds || []);
  const basicSalary = Math.max(
    0,
    Number(inputs.basicSalary !== undefined ? inputs.basicSalary : emp.basicSalary || 0)
  );

  let activeRules: PayrollRule[] = [];
  try {
    activeRules = await db.payrollRules.toArray();
  } catch {
    activeRules = [];
  }
  const rulesById = new Map(activeRules.map((r) => [r.id, r]));

  const posDetails = getPositionDetails(emp.positionId);
  const serviceMonths = getServiceMonths(emp.joinDate, periodStartDate);
  const workingDaysInMonth = 22;
  const daysAttended = Number(inputs.attendanceDays ?? workingDaysInMonth);

  const allowancesBreakdown: {
    id: string;
    name: string;
    amount: number;
    ruleId?: string;
    isCustom?: boolean;
  }[] = [];

  let fixedAllowance = 0;
  let variableAllowance = 0;

  if (Array.isArray(inputs.allowancesBreakdown) && inputs.allowancesBreakdown.length > 0) {
    inputs.allowancesBreakdown.forEach((item: any) => {
      if (item.ruleId && disabledSet.has(item.ruleId)) return;
      const amt = Math.max(0, Number(item.amount || 0));
      allowancesBreakdown.push({
        id: item.id || `alw_${allowancesBreakdown.length + 1}`,
        name: item.name,
        amount: amt,
        ruleId: item.ruleId,
        isCustom: item.isCustom,
      });
      const rule = item.ruleId ? rulesById.get(item.ruleId) : undefined;
      if (getAllowanceCategory(item, rule) === 'Tunjangan Tetap') {
        fixedAllowance += amt;
      } else {
        variableAllowance += amt;
      }
    });
  } else if (Array.isArray(emp.allowances) && emp.allowances.length > 0) {
    emp.allowances.forEach((item, idx) => {
      if (item.ruleId && disabledSet.has(item.ruleId)) return;
      const rule = item.ruleId ? rulesById.get(item.ruleId) : undefined;
      let amt = Number(item.amount || 0);
      if (amt <= 0 && rule) {
        amt = calculateAllowancePreview(rule, {
          basicSalary,
          level: posDetails?.level,
          serviceMonths,
          daysAttended,
          workingDaysInMonth,
        }).amount;
      }
      if (amt > 0) {
        allowancesBreakdown.push({
          id: item.id || `emp_alw_${idx}`,
          name: item.name,
          amount: amt,
          ruleId: item.ruleId,
          isCustom: !item.ruleId,
        });
        if (getAllowanceCategory(item, rule) === 'Tunjangan Tetap') {
          fixedAllowance += amt;
        } else {
          variableAllowance += amt;
        }
      }
    });
  } else {
    fixedAllowance = Number(inputs.fixedAllowance ?? emp.fixedAllowance ?? 0);
    variableAllowance = Number(inputs.variableAllowance ?? 0);
    if (fixedAllowance > 0) {
      allowancesBreakdown.push({ id: 'fixed_alw', name: 'Tunjangan Tetap', amount: fixedAllowance });
    }
    if (variableAllowance > 0) {
      allowancesBreakdown.push({ id: 'var_alw', name: 'Tunjangan Tidak Tetap', amount: variableAllowance });
    }
  }

  const overtime = Math.max(0, Number(inputs.overtime || 0));
  const bonus = Math.max(0, Number(inputs.bonus || 0));
  const commission = Math.max(0, Number(inputs.commission || 0));
  const otherIncome = Math.max(0, Number(inputs.otherIncome || 0));

  const bpjsDisabledAll = disabledSet.has('rule_bpjs_kes_1') && disabledSet.has('rule_bpjs_tk_1');
  const bpjsSim = calculateEmployeeBpjsSimulation(
    basicSalary,
    fixedAllowance,
    emp.bpjsKesehatanProfile,
    emp.bpjsKetenagakerjaanProfile
  );

  const isKesActive =
    emp.bpjsHealthParticipant !== 'None' &&
    emp.bpjsKesehatanProfile?.activeStatus !== 'Inactive' &&
    emp.bpjsKesehatanProfile?.activeStatus !== 'Suspended';
  const isTkActive = emp.bpjsKetenagakerjaanProfile?.activeStatus !== 'Inactive';

  const bpjsKesAmount = disabledSet.has('rule_bpjs_kes_1')
    ? 0
    : isKesActive
      ? bpjsSim.kesehatan.employeeAmount
      : 0;
  const jhtAmount = disabledSet.has('rule_bpjs_tk_jht') || disabledSet.has('rule_bpjs_tk_1')
    ? 0
    : isTkActive
      ? bpjsSim.ketenagakerjaan.jht.employeeAmount
      : 0;
  const jpAmount = disabledSet.has('rule_bpjs_tk_jp') || disabledSet.has('rule_bpjs_tk_1')
    ? 0
    : isTkActive
      ? bpjsSim.ketenagakerjaan.jp.employeeAmount
      : 0;

  const bpjsTotalEmployee = bpjsDisabledAll ? 0 : bpjsKesAmount + jhtAmount + jpAmount;

  const preTaxGross =
    basicSalary + fixedAllowance + variableAllowance + overtime + bonus + commission + otherIncome;

  const isTaxDisabled =
    disabledSet.has('rule_pph21_1') && disabledSet.has('rule_pph21_pasal17');

  const ptkpStatus = emp.taxProfile?.ptkpStatus || emp.taxStatus || 'TK/0';
  const taxMethod = emp.taxProfile?.taxMethod || 'Gross';
  const hasNpwp = Boolean(emp.npwp && emp.npwp.trim().length > 0);

  const taxSim = isTaxDisabled
    ? { pph21Monthly: 0, taxAllowance: 0 }
    : calculateEmployeeTaxSimulation(preTaxGross, ptkpStatus, taxMethod, hasNpwp);

  const taxAllowance = inputs.tax !== undefined ? 0 : taxSim.taxAllowance;
  const tax = inputs.tax !== undefined ? Math.max(0, Number(inputs.tax)) : taxSim.pph21Monthly;

  const grossSalary = Math.round(preTaxGross + taxAllowance);

  const absenceDays = Math.max(0, Number(inputs.absentDays || 0));
  const absenceDeduction =
    inputs.absenceDeduction !== undefined
      ? Math.max(0, Number(inputs.absenceDeduction))
      : absenceDays > 0
        ? Math.round((basicSalary / 22) * absenceDays)
        : 0;

  const lateDeduction = Math.max(0, Number(inputs.lateDeduction || 0));
  const loan = Math.max(0, Number(inputs.loan || 0));
  const advance = Math.max(0, Number(inputs.advance || 0));
  const otherDeduction = Math.max(0, Number(inputs.otherDeduction || 0));

  const bpjs = inputs.bpjs !== undefined ? Math.max(0, Number(inputs.bpjs)) : bpjsTotalEmployee;

  const deductionsBreakdown: {
    id: string;
    name: string;
    amount: number;
    ruleId?: string;
    isCustom?: boolean;
  }[] = [];

  if (bpjsKesAmount > 0 && inputs.bpjs === undefined) {
    deductionsBreakdown.push({
      id: 'ded_bpjs_kesehatan',
      name: `BPJS Kesehatan (${(BPJS_CONFIG.KESEHATAN.EMPLOYEE_RATE * 100).toFixed(0)}%)`,
      amount: bpjsKesAmount,
      ruleId: 'rule_bpjs_kes_1',
    });
  }
  if (jhtAmount > 0 && inputs.bpjs === undefined) {
    deductionsBreakdown.push({
      id: 'ded_bpjs_jht',
      name: 'BPJS Ketenagakerjaan (JHT 2%)',
      amount: jhtAmount,
      ruleId: 'rule_bpjs_tk_1',
    });
  }
  if (jpAmount > 0 && inputs.bpjs === undefined) {
    deductionsBreakdown.push({
      id: 'ded_bpjs_jp',
      name: 'BPJS Ketenagakerjaan (JP 1%)',
      amount: jpAmount,
      ruleId: 'rule_bpjs_tk_1',
    });
  }
  if (bpjs > 0 && inputs.bpjs !== undefined) {
    deductionsBreakdown.push({
      id: 'ded_bpjs_custom',
      name: 'Iuran BPJS Karyawan',
      amount: bpjs,
    });
  }
  if (tax > 0) {
    deductionsBreakdown.push({
      id: 'ded_pph21',
      name: `PPh 21 (${ptkpStatus})`,
      amount: tax,
      ruleId: 'rule_pph21_1',
    });
  }
  if (lateDeduction > 0) {
    deductionsBreakdown.push({
      id: 'ded_late',
      name: 'Denda Keterlambatan',
      amount: lateDeduction,
    });
  }
  if (absenceDeduction > 0) {
    deductionsBreakdown.push({
      id: 'ded_absent',
      name: `Potongan Alpa (${absenceDays} hari)`,
      amount: absenceDeduction,
    });
  }
  if (loan > 0) {
    deductionsBreakdown.push({ id: 'ded_loan', name: 'Cicilan Pinjaman', amount: loan });
  }
  if (advance > 0) {
    deductionsBreakdown.push({ id: 'ded_advance', name: 'Kasbon', amount: advance });
  }
  if (otherDeduction > 0) {
    deductionsBreakdown.push({ id: 'ded_other', name: 'Potongan Lainnya', amount: otherDeduction });
  }

  const totalDeduction = Math.round(
    bpjs + tax + lateDeduction + absenceDeduction + loan + advance + otherDeduction
  );
  const netSalary = Math.max(0, grossSalary - totalDeduction);

  return {
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
    bpjs,
    tax,
    otherDeduction,
    totalDeduction,
    attendanceDays: daysAttended,
    absentDays: absenceDays,
    leaveDays: Number(inputs.leaveDays || 0),
    sickDays: Number(inputs.sickDays || 0),
    overtimeHours: Number(inputs.overtimeHours || 0),
    allowancesBreakdown,
    deductionsBreakdown,
    netSalary,
    status: inputs.status === 'Paid' ? 'Paid' : 'Draft',
  };
}
