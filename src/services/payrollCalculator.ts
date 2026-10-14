import { Employee, PayrollRecord, OvertimeConfig, OvertimeCategoryConfig } from '../types';
import { db } from '../db/database';
import { calculateEmployeeBpjsSimulation, calculateEmployeeTaxSimulation } from './taxBpjsService';
import { calculateAllowancePreview } from '../utils/allowanceCalculator';
import { isFixedAllowance } from '../utils/allowanceClassification';

export function calculateOvertimeAmountForShift(
  durationHours: number,
  wageCategory: string,
  employee: Employee,
  config: OvertimeConfig | undefined | null
): number {
  if (!durationHours || durationHours <= 0) return 0;
  
  if (employee.overtimeRatePerHour) {
    return durationHours * employee.overtimeRatePerHour;
  }

  if (!config) return 0; // fallback if no config and no employee rate

  let catConfig: OvertimeCategoryConfig;
  
  if (config.dayMode === 'unified' || wageCategory === 'SERAGAM') {
    catConfig = config.normalWorkday;
  } else if (wageCategory === 'OFFDAY') {
    catConfig = config.offday;
  } else {
    catConfig = config.normalWorkday;
  }

  const isMultiplier = catConfig.calculationType === 'multiplier';
  const basis = catConfig.calculationBasis;
  const isSalary = basis === 'salary' || basis === 'salary_hourly' || basis === 'manual_divider';
  
  // Base hourly rate if it's based on salary
  const baseSalary = employee.basicSalary || 0;
  const divider = catConfig.baseDivider || 173;
  const salaryHourlyRate = baseSalary / divider;
  
  let amount = 0;

  if (!isMultiplier) {
    // STATIC calculation
    if (isSalary) {
      amount = durationHours * salaryHourlyRate * (catConfig.flatSalaryMultiplier || 1);
    } else {
      amount = durationHours * (catConfig.ratePerHour || 0);
    }
  } else {
    // MULTIPLIER / TIERED calculation
    if (isSalary) {
      const tiers = catConfig.tieredMultipliers && catConfig.tieredMultipliers.length > 0 
        ? catConfig.tieredMultipliers 
        : [catConfig.multiplierFirstHour || 1, catConfig.multiplierNextHours || 1];
        
      for (let i = 0; i < Math.floor(durationHours); i++) {
        const m = i < tiers.length ? tiers[i] : tiers[tiers.length - 1];
        amount += (salaryHourlyRate * m);
      }
      // Add fractional hour if any based on last tier
      const fraction = durationHours - Math.floor(durationHours);
      if (fraction > 0) {
        const m = Math.floor(durationHours) < tiers.length ? tiers[Math.floor(durationHours)] : tiers[tiers.length - 1];
        amount += (fraction * salaryHourlyRate * m);
      }
    } else {
      // Tiered Nominals
      const tiers = catConfig.tieredNominals && catConfig.tieredNominals.length > 0
        ? catConfig.tieredNominals
        : [catConfig.staticFirstHourRate || catConfig.ratePerHour || 0, catConfig.staticNextHoursRate || catConfig.ratePerHour || 0];
        
      for (let i = 0; i < Math.floor(durationHours); i++) {
        const rate = i < tiers.length ? tiers[i] : tiers[tiers.length - 1];
        amount += rate;
      }
      // Add fractional hour
      const fraction = durationHours - Math.floor(durationHours);
      if (fraction > 0) {
        const rate = Math.floor(durationHours) < tiers.length ? tiers[Math.floor(durationHours)] : tiers[tiers.length - 1];
        amount += (fraction * rate);
      }
    }
  }
  
  return amount;
}

export function calculateGrossSalary(employee: Employee, overtime: number = 0, bonus: number = 0, commission: number = 0, otherIncome: number = 0) {
  const totalAllowances = employee.allowances?.reduce((sum, a) => sum + (a.amount || 0), 0) || (employee.fixedAllowance || 0);
  return (employee.basicSalary || 0) + 
         totalAllowances + 
         overtime + bonus + commission + otherIncome;
}

export function calculateTotalDeduction(absence: number = 0, late: number = 0, loan: number = 0, advance: number = 0, bpjs: number = 0, tax: number = 0, other: number = 0) {
  return absence + late + loan + advance + bpjs + tax + other;
}

export function calculateNetSalary(gross: number, deduction: number) {
  return gross - deduction;
}

export async function processPayrollRecord(
  employee: Employee, 
  inputs: any = {}, 
  periodDate: string = new Date().toISOString(),
  disabledRuleIds: string[] = []
): Promise<Partial<PayrollRecord>> {
  const basicForCalculation = employee.basicSalary || 0; // Common base for BPJS
  // 1. Fetch Active Rules and exclude rules disabled specifically for this period
  const allRules = await db.payrollRules.where('status').equals('Active').toArray();
  const rules = allRules.filter(r => !disabledRuleIds.includes(r.id));

  // Quick active flags for statutory and standard categories
  const isTaxActive = rules.some(r => r.category === 'Tax');
  const isBpjsHealthActive = rules.some(r => r.id === 'rule_bpjs_kes_1' || r.category === 'BPJS Health');
  const isJhtActive = rules.some(r => r.id === 'rule_jht_1');
  const isJpActive = rules.some(r => r.id === 'rule_jp_1');
  const isOvertimeActive = rules.some(r => r.id === 'rule_lembur' || (r.category === 'Allowance' && (r.name.toLowerCase().includes('lembur') || r.name.toLowerCase().includes('overtime'))));
  const isLateDeductionActive = rules.some(r => r.id === 'rule_terlambat' || (r.category === 'Deduction' && (r.name.toLowerCase().includes('terlambat') || r.name.toLowerCase().includes('late'))));
  const isAbsenceDeductionActive = rules.some(r => r.id === 'rule_absensi' || (r.category === 'Deduction' && (r.name.toLowerCase().includes('absen') || r.name.toLowerCase().includes('alpa') || r.name.toLowerCase().includes('izin'))));

  // Evaluate Allowances dynamically based on payrollRules
  let evaluatedAllowances = employee.allowances?.map(a => ({ ...a })) || [];
  
  const employeeContext = {
    basicSalary: basicForCalculation,
    serviceMonths: 12,
    daysAttended: inputs.attendanceDays || 0,
    workingDaysInMonth: inputs.workingDays || 25,
    overtimeHours: inputs.overtimeHours || 0
  };
  
  if (employee.joinDate) {
    const join = new Date(employee.joinDate);
    const period = new Date(periodDate);
    const diffTime = Math.abs(period.getTime() - join.getTime());
    employeeContext.serviceMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
  }

  evaluatedAllowances = evaluatedAllowances.map(a => {
    if (a.ruleId) {
      const rule = rules.find(r => r.id === a.ruleId);
      if (rule) {
        const calcResult = calculateAllowancePreview(rule, employeeContext);
        return { ...a, amount: calcResult.amount };
      } else {
        // Rule is inactive/OFF
        return { ...a, amount: 0 };
      }
    }
    return a;
  });

  const employeeWithEvaluatedAllowances = {
    ...employee,
    allowances: evaluatedAllowances
  };

  const fixedAllowance = evaluatedAllowances
    .filter(a => isFixedAllowance(a))
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  // Evaluate Company Policies first
  let calculatedOvertime = isOvertimeActive ? (inputs.overtime || 0) : 0; // Base from inputs if active
  let calculatedAbsenceDeduction = isAbsenceDeductionActive ? (inputs.absenceDeduction || 0) : 0;
  const lateDeductionAmount = isLateDeductionActive ? (inputs.lateDeduction || 0) : 0;

  if (isOvertimeActive || isAbsenceDeductionActive) {
    const companyPolicies = rules.filter(r => r.origin === 'Company Policy');
    companyPolicies.forEach(policy => {
      // Determine if it's an overtime policy
      if (inputs.overtime === undefined && isOvertimeActive && !employee.overtimeRatePerHour && policy.category === 'Allowance' && (policy.name.toLowerCase().includes('lembur') || policy.name.toLowerCase().includes('overtime'))) {
        if (policy.ruleType === 'Fixed') {
          calculatedOvertime += (inputs.overtimeHours || 0) * (policy.fixedAmount || 0);
        } else if (policy.ruleType === 'Percentage') {
          calculatedOvertime += (inputs.overtimeHours || 0) * basicForCalculation * ((policy.employeeShare || 0) / 100);
        }
      }
      // Determine if it's an absence/leave deduction
      if (isAbsenceDeductionActive && policy.category === 'Deduction') {
        let daysToDeduct = 0;
        const nameLower = policy.name.toLowerCase();
        
        if (nameLower.includes('absen') || nameLower.includes('alpa')) {
          daysToDeduct += (inputs.absentDays || 0);
        }
        if (nameLower.includes('izin') || nameLower.includes('cuti unpaid') || nameLower.includes('unpaid leave')) {
          daysToDeduct += (inputs.leaveDays || 0);
        }
        if (nameLower.includes('sakit unpaid') || (nameLower.includes('sakit') && nameLower.includes('unpaid'))) {
          daysToDeduct += (inputs.sickDays || 0);
        }
        
        if (daysToDeduct > 0 && inputs.absenceDeduction === undefined) {
          if (policy.ruleType === 'Fixed') {
            calculatedAbsenceDeduction += daysToDeduct * (policy.fixedAmount || 0);
          } else if (policy.ruleType === 'Percentage') {
            calculatedAbsenceDeduction += daysToDeduct * basicForCalculation * ((policy.employeeShare || 0) / 100);
          } else if (policy.ruleType === 'DailyWage') {
            const workingDays = policy.workingDaysPerMonth && policy.workingDaysPerMonth > 0 ? policy.workingDaysPerMonth : 25;
            const dailyRate = basicForCalculation / workingDays;
            calculatedAbsenceDeduction += daysToDeduct * dailyRate;
          }
        }
      }
    });
  }

  const employeeRoutineDeductions = employee.deductions?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

  let grossSalary = calculateGrossSalary(
    employeeWithEvaluatedAllowances, 
    calculatedOvertime, 
    inputs.bonus || 0, 
    inputs.commission || 0, 
    inputs.otherIncome || 0
  );
  
  // 2. BPJS Calculations (Kesehatan & Ketenagakerjaan)
  const healthProfile = employee.bpjsKesehatanProfile || {
    participantType: (employee.bpjsHealthParticipant as any) === 'PPU' ? 'PPU Badan Usaha' : (employee.bpjsHealthParticipant as any) || 'PPU Badan Usaha',
    activeStatus: employee.bpjsHealthParticipant === 'None' ? 'Inactive' : 'Active',
    employeeRate: 1,
    employerRate: 4
  };

  const tkProfile = employee.bpjsKetenagakerjaanProfile || {
    activeStatus: 'Active',
    hasJht: isJhtActive,
    hasJkk: rules.some(r => r.id === 'rule_jkk_1'),
    jkkRiskCategory: employee.jkkRisk || 'Very Low',
    hasJkm: rules.some(r => r.id === 'rule_jkm_1'),
    hasJp: isJpActive,
    hasJkp: rules.some(r => r.id === 'rule_jkp_1')
  };

  const bpjsSim = calculateEmployeeBpjsSimulation(basicForCalculation, fixedAllowance, healthProfile, tkProfile);
  const bpjsHealthDeduction = isBpjsHealthActive ? bpjsSim.kesehatan.employeeAmount : 0;
  const bpjsJhtDeduction = isJhtActive ? bpjsSim.ketenagakerjaan.jht.employeeAmount : 0;
  const bpjsJpDeduction = isJpActive ? bpjsSim.ketenagakerjaan.jp.employeeAmount : 0;
  const totalBpjsDeduction = bpjsHealthDeduction + bpjsJhtDeduction + bpjsJpDeduction;

  // 3. Tax Calculations (Pajak Penghasilan PPh 21)
  const taxProfile = employee.taxProfile || {
    ptkpStatus: employee.taxStatus || 'TK/0',
    taxMethod: 'Gross',
    hasNpwp: !!employee.npwp && employee.npwp.trim() !== '',
    nik: employee.nik || '',
    npwp: employee.npwp || '',
    dependents: employee.dependents || 0,
    employeeType: 'Pegawai Tetap'
  };

  const ptkpStatus = taxProfile.ptkpStatus || employee.taxStatus || 'TK/0';
  const taxMethod = taxProfile.taxMethod || 'Gross';
  const hasNpwp = taxProfile.hasNpwp ?? (!!employee.npwp && employee.npwp.trim() !== '');

  let taxDeduction = 0;
  let taxAllowance = 0;

  if (isTaxActive) {
    const taxBaseSalary = grossSalary + 
      (isBpjsHealthActive ? bpjsSim.kesehatan.employerAmount : 0) + 
      (bpjsSim.ketenagakerjaan.jkk.isActive ? bpjsSim.ketenagakerjaan.jkk.amount : 0) + 
      (bpjsSim.ketenagakerjaan.jkm.isActive ? bpjsSim.ketenagakerjaan.jkm.amount : 0);
      
    const taxSim = calculateEmployeeTaxSimulation(taxBaseSalary, ptkpStatus, taxMethod, hasNpwp);
    taxDeduction = taxSim.pph21Monthly;
    taxAllowance = taxSim.taxAllowance;

    if (taxMethod === 'Gross Up' && taxAllowance > 0) {
      grossSalary += taxAllowance;
    } else if (taxMethod === 'Nett') {
      taxDeduction = 0; 
    }
  }

  // 4. Construct breakdown of ALL allowances (Only active rules with amount > 0)
  const masterAllowanceRules = rules.filter(r => r.category === 'Allowance');
  const empAllowances = employee.allowances || [];
  const rawAllowancesBreakdown: { id: string; name: string; amount: number; ruleId?: string; isCustom?: boolean }[] = [];
  const processedEmpAllowanceIds = new Set<string>();

  if (isTaxActive && taxMethod === 'Gross Up' && taxAllowance > 0) {
    rawAllowancesBreakdown.push({
      id: 'tax_allowance_gross_up',
      name: 'Tunjangan PPh 21 (Gross Up)',
      amount: taxAllowance,
      isCustom: false
    });
  }

  const empJoinDate = employee.joinDate ? new Date(employee.joinDate) : new Date();
  const currentPeriod = new Date(periodDate);
  const employeeTenureMonths = Math.max(
    0,
    (currentPeriod.getFullYear() - empJoinDate.getFullYear()) * 12 +
      (currentPeriod.getMonth() - empJoinDate.getMonth())
  );

  masterAllowanceRules.forEach(rule => {
    if (rule.name.toLowerCase().includes('lembur') || rule.name.toLowerCase().includes('overtime')) {
      if (isOvertimeActive && calculatedOvertime > 0) {
        rawAllowancesBreakdown.push({
          id: rule.id,
          name: rule.name,
          amount: calculatedOvertime,
          ruleId: rule.id,
          isCustom: false
        });
      }
      return;
    }

    const matched = empAllowances.find(a => 
      (a.ruleId && a.ruleId === rule.id) || 
      (a.name && a.name.trim().toLowerCase() === rule.name.trim().toLowerCase())
    );

    if (matched && matched.amount !== undefined && matched.amount > 0) {
      processedEmpAllowanceIds.add(matched.id);
      rawAllowancesBreakdown.push({
        id: matched.id || rule.id,
        name: matched.name || rule.name,
        amount: matched.amount,
        ruleId: rule.id,
        isCustom: false
      });
    } else {
      const calculatedResult = calculateAllowancePreview(rule, {
        basicSalary: basicForCalculation,
        serviceMonths: employeeTenureMonths,
        daysAttended: inputs.attendanceDays || 0,
        workingDaysInMonth: rule.workingDaysPerMonth || 25
      });

      if (matched) {
        processedEmpAllowanceIds.add(matched.id);
      }

      if (calculatedResult.amount > 0) {
        rawAllowancesBreakdown.push({
          id: matched?.id || rule.id,
          name: matched?.name || rule.name,
          amount: calculatedResult.amount,
          ruleId: rule.id,
          isCustom: false
        });
      }
    }
  });

  empAllowances.forEach(a => {
    if (!processedEmpAllowanceIds.has(a.id) && (a.amount || 0) > 0) {
      rawAllowancesBreakdown.push({
        id: a.id,
        name: a.name,
        amount: a.amount || 0,
        ruleId: a.ruleId,
        isCustom: true
      });
    }
  });

  if (isOvertimeActive && calculatedOvertime > 0 && !rawAllowancesBreakdown.some(a => a.name.toLowerCase().includes('lembur') || a.name.toLowerCase().includes('overtime'))) {
    rawAllowancesBreakdown.push({
      id: 'field_overtime',
      name: 'Uang Lembur (Overtime)',
      amount: calculatedOvertime,
      isCustom: false
    });
  }

  if (inputs.bonus > 0) {
    rawAllowancesBreakdown.push({ id: 'field_bonus', name: 'Bonus & Insentif', amount: inputs.bonus, isCustom: false });
  }
  if (inputs.commission > 0) {
    rawAllowancesBreakdown.push({ id: 'field_commission', name: 'Komisi Penjualan', amount: inputs.commission, isCustom: false });
  }
  if (inputs.otherIncome > 0) {
    rawAllowancesBreakdown.push({ id: 'field_other_income', name: 'Pendapatan Lain-lain', amount: inputs.otherIncome, isCustom: false });
  }

  const allowancesBreakdown = rawAllowancesBreakdown.filter(a => a.amount > 0);

  // 5. Construct breakdown of ALL deductions (Only active rules with amount > 0)
  const masterDeductionRules = rules.filter(r => r.category === 'Deduction');
  const empDeductions = employee.deductions || [];
  const rawDeductionsBreakdown: { id: string; name: string; amount: number; ruleId?: string; isCustom?: boolean }[] = [];
  const processedEmpDeductionIds = new Set<string>();

  if (isBpjsHealthActive && bpjsHealthDeduction > 0) {
    rawDeductionsBreakdown.push({ id: 'ded_bpjs_kesehatan', name: 'BPJS Kesehatan (1%)', amount: bpjsHealthDeduction, isCustom: false });
  }
  if (isJhtActive && bpjsJhtDeduction > 0) {
    rawDeductionsBreakdown.push({ id: 'ded_bpjs_jht', name: 'BPJS Ketenagakerjaan JHT (2%)', amount: bpjsJhtDeduction, isCustom: false });
  }
  if (isJpActive && bpjsJpDeduction > 0) {
    rawDeductionsBreakdown.push({ id: 'ded_bpjs_jp', name: 'BPJS Ketenagakerjaan JP (1%)', amount: bpjsJpDeduction, isCustom: false });
  }
  if (isTaxActive && taxDeduction > 0) {
    rawDeductionsBreakdown.push({
      id: 'ded_pph21',
      name: taxMethod === 'Nett' ? 'PPh 21 (Ditanggung Perusahaan)' : (taxMethod === 'Gross Up' ? 'Pajak Penghasilan PPh 21 (Gross Up)' : 'Pajak Penghasilan (PPh 21 TER)'),
      amount: taxDeduction,
      isCustom: false
    });
  }

  if (isAbsenceDeductionActive && calculatedAbsenceDeduction > 0) {
    rawDeductionsBreakdown.push({ id: 'ded_absence', name: 'Potongan Ketidakhadiran', amount: calculatedAbsenceDeduction, isCustom: false });
  }
  if (isLateDeductionActive && lateDeductionAmount > 0) {
    rawDeductionsBreakdown.push({ id: 'ded_late', name: 'Potongan Keterlambatan', amount: lateDeductionAmount, isCustom: false });
  }

  masterDeductionRules.forEach(rule => {
    if (rule.name.toLowerCase().includes('absen') || rule.name.toLowerCase().includes('alpa') || rule.name.toLowerCase().includes('izin')) return;
    if (rule.name.toLowerCase().includes('terlambat') || rule.name.toLowerCase().includes('late')) return;

    if (rule.name.toLowerCase().includes('kasbon') || rule.name.toLowerCase().includes('pinjaman') || rule.name.toLowerCase().includes('loan')) {
      const matched = empDeductions.find(d => 
        (d.ruleId && d.ruleId === rule.id) || 
        (d.name && d.name.trim().toLowerCase() === rule.name.trim().toLowerCase())
      );
      if (matched) processedEmpDeductionIds.add(matched.id);
      const loanAmt = inputs.loan || (matched ? matched.amount : 0);
      if (loanAmt > 0) {
        rawDeductionsBreakdown.push({ id: rule.id, name: rule.name, amount: loanAmt, ruleId: rule.id, isCustom: false });
      }
      return;
    }

    const matched = empDeductions.find(d => 
      (d.ruleId && d.ruleId === rule.id) || 
      (d.name && d.name.trim().toLowerCase() === rule.name.trim().toLowerCase())
    );

    if (matched && (matched.amount || 0) > 0) {
      processedEmpDeductionIds.add(matched.id);
      rawDeductionsBreakdown.push({ id: matched.id || rule.id, name: matched.name || rule.name, amount: matched.amount || 0, ruleId: rule.id, isCustom: false });
    }
  });

  empDeductions.forEach(d => {
    if (!processedEmpDeductionIds.has(d.id) && (d.amount || 0) > 0) {
      rawDeductionsBreakdown.push({ id: d.id, name: d.name, amount: d.amount || 0, ruleId: d.ruleId, isCustom: true });
    }
  });

  if (inputs.otherDeduction > 0) {
    rawDeductionsBreakdown.push({ id: 'field_other_deduction', name: 'Potongan Lain-lain', amount: inputs.otherDeduction, isCustom: false });
  }

  const deductionsBreakdown = rawDeductionsBreakdown.filter(d => d.amount > 0);

  const otherDeductionsTotal = (inputs.otherDeduction || 0) + employeeRoutineDeductions;

  const totalDeduction = calculateTotalDeduction(
    calculatedAbsenceDeduction,
    lateDeductionAmount,
    inputs.loan || 0,
    inputs.advance || 0,
    totalBpjsDeduction,
    taxDeduction,
    otherDeductionsTotal
  );

  const netSalary = calculateNetSalary(grossSalary, totalDeduction);

  return {
    employeeId: employee.id,
    basicSalary: employee.basicSalary || 0,
    fixedAllowance: employee.allowances?.reduce((sum, a) => sum + (a.amount || 0), 0) || employee.fixedAllowance || 0,
    variableAllowance: 0,
    overtime: calculatedOvertime,
    bonus: inputs.bonus || 0,
    commission: inputs.commission || 0,
    otherIncome: inputs.otherIncome || 0,
    grossSalary,
    absenceDeduction: calculatedAbsenceDeduction,
    lateDeduction: lateDeductionAmount,
    loan: inputs.loan || 0,
    advance: inputs.advance || 0,
    bpjs: totalBpjsDeduction,
    tax: taxDeduction,
    otherDeduction: otherDeductionsTotal,
    totalDeduction,
    
    // Attendance snapshots
    attendanceDays: inputs.attendanceDays || 0,
    absentDays: inputs.absentDays || 0,
    leaveDays: inputs.leaveDays || 0,
    sickDays: inputs.sickDays || 0,
    overtimeHours: inputs.overtimeHours || 0,

    netSalary,
    allowancesBreakdown,
    deductionsBreakdown,
    status: 'Draft'
  };
}
