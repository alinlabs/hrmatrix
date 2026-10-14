import { v4 as uuidv4 } from 'uuid';
import { 
  Company, 
  Department, 
  Position, 
  Employee, 
  AttendanceConfig, 
  KPITemplate, 
  KPIRuleConfig,
  KPIPeriod,
  KPIResult,
  PayrollPeriod,
  PayrollRecord,
  Leave, 
  LeaveTypePolicy,
  EmployeeLeaveQuota,
  ExtraShift, 
  ShiftSwap, 
  ShiftSchedule, 
  Attendance 
} from '../../types';

import { getRelativeDateStr, getMondayAnchorDateStr } from './utilitas-tanggal';

// Import Pure JSON / TS files
import rawCompany from './perusahaan';
import rawDepartments from './departemen';
import rawPositions from './posisi';
import rawAttendanceConfig from './pengaturan-presensi';
import rawPengaturanJadwal from './pengaturan-jadwal';
import rawPengaturanTambahShift from './pengaturan-tambah-shift';
import rawJobDesks from './jobdesk';
import rawEmployees from './karyawan';
import rawKpiTemplates from './template-kpi';
import rawLeaves from './cuti';
import rawExtraShifts from './tambah-shift';
import rawShiftSwaps from './tukar-shift';
import rawShiftSchedules from './jadwal-shift';
import rawAttendance from './presensi';
import samplePengaturanKPI from './pengaturan-kpi';
import sampleKatalogKPI from './katalog-kpi';
import { generateDemoAttendance, getDemoMonthWindow } from './generator-presensi-demo';
import { generateDemoLeaves, generateDemoSaldoCuti } from './generator-cuti-demo';
import { generateDemoExtraShifts, generateDemoShiftSwaps, generateDemoShiftSchedules } from './generator-jadwal-demo';
import { generateDemoPayroll } from './generator-payroll-demo';
import { generateDemoKPI } from './generator-kpi-demo';
import sampleKompensasiTunjangan from './kompensasi-tunjangan';
import sampleKompensasiJaminan from './kompensasi-jaminan';
import sampleKompensasiPajak from './kompensasi-pajak';
import sampleKebijakanCuti from './kebijakan-cuti';
import { sampleSaldoCutiList, sampleSaldoCutiMap } from './saldo-cuti';

export {
  sampleKompensasiTunjangan,
  sampleKompensasiJaminan,
  sampleKompensasiPajak,
  sampleKebijakanCuti,
  sampleSaldoCutiList,
  sampleSaldoCutiMap
};

/**
 * Mengganti token placeholder tanggal pada string dengan tanggal dinamis real-time
 */
export function resolveDateStringToken(str: string, baseDate = new Date()): string {
  if (typeof str !== 'string') return str;

  // 1. {{TODAY}} dan {{TODAY±N}}
  const todayMatch = str.match(/\{\{TODAY(?:([+-]\d+))?\}\}/g);
  if (todayMatch) {
    let replaced = str;
    for (const match of todayMatch) {
      const offsetMatch = match.match(/\{\{TODAY([+-]\d+)?\}\}/);
      const offset = offsetMatch && offsetMatch[1] ? parseInt(offsetMatch[1], 10) : 0;
      replaced = replaced.replace(match, getRelativeDateStr(offset, baseDate));
    }
    str = replaced;
  }

  // 2. {{MONDAY_ANCHOR}}
  if (str.includes('{{MONDAY_ANCHOR}}')) {
    str = str.replace(/\{\{MONDAY_ANCHOR\}\}/g, getMondayAnchorDateStr(baseDate));
  }

  // 3. {{ISO_NOW}}
  if (str.includes('{{ISO_NOW}}')) {
    str = str.replace(/\{\{ISO_NOW\}\}/g, baseDate.toISOString());
  }

  // 4. {{NOW±MS}}
  const nowMsMatch = str.match(/\{\{NOW(?:([+-]\d+))?\}\}/g);
  if (nowMsMatch) {
    let replaced = str;
    for (const match of nowMsMatch) {
      const offsetMatch = match.match(/\{\{NOW([+-]\d+)?\}\}/);
      const msOffset = offsetMatch && offsetMatch[1] ? parseInt(offsetMatch[1], 10) : 0;
      const targetTime = new Date(baseDate.getTime() + msOffset).toISOString();
      replaced = replaced.replace(match, targetTime);
    }
    str = replaced;
  }

  return str;
}

/**
 * Melakukan resolusi placeholder rekursif untuk object / array data JSON
 */
export function deepResolveJson<T>(data: T, baseDate = new Date()): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return resolveDateStringToken(data, baseDate) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => deepResolveJson(item, baseDate)) as unknown as T;
  }

  if (typeof data === 'object') {
    const resolved: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      resolved[key] = deepResolveJson(value, baseDate);
    }
    return resolved as T;
  }

  return data;
}

/**
 * Accessors / Getters untuk Data Sampel JSON yang siap pakai
 */
export function createSampleCompany(): Company {
  const resolved = deepResolveJson(rawCompany);
  return {
    id: uuidv4(),
    ...resolved,
    currentYear: new Date().getFullYear(),
  } as Company;
}

export const sampleDepartments: Department[] = deepResolveJson(rawDepartments) as Department[];

export const samplePositions: Position[] = deepResolveJson(rawPositions) as Position[];

export function createSampleAttendanceConfig(): AttendanceConfig {
  return deepResolveJson(rawAttendanceConfig) as AttendanceConfig;
}

export function createSamplePengaturanJadwal() {
  return deepResolveJson(rawPengaturanJadwal);
}

export function createSamplePengaturanTambahShift() {
  return deepResolveJson(rawPengaturanTambahShift);
}

export const sampleMasterShifts = (rawAttendanceConfig as any).shifts;
export const sampleShiftPatterns = (rawAttendanceConfig as any).shiftPatterns;

export const sampleJobDesks = deepResolveJson(rawJobDesks);

export const sampleEmployees: Employee[] = deepResolveJson(rawEmployees) as unknown as Employee[];

export const sampleKPITemplates: KPITemplate[] = deepResolveJson(sampleKatalogKPI) as unknown as KPITemplate[];
export const sampleKpiCatalog: KPITemplate[] = sampleKPITemplates;

export function createSamplePengaturanKPI(): KPIRuleConfig {
  return deepResolveJson(samplePengaturanKPI) as KPIRuleConfig;
}

export function createSampleKatalogKPI(): KPITemplate[] {
  return deepResolveJson(sampleKatalogKPI) as KPITemplate[];
}

export function createSampleKPIPeriods(baseDate = new Date()): KPIPeriod[] {
  return generateDemoKPI(baseDate).periods;
}

export function createSampleKPIResults(baseDate = new Date()): KPIResult[] {
  return generateDemoKPI(baseDate).results;
}

export function createSamplePayrollPeriods(baseDate = new Date()): PayrollPeriod[] {
  return generateDemoPayroll(undefined, baseDate).periods;
}

export function createSamplePayrollRecords(attendanceList?: Attendance[], baseDate = new Date()): PayrollRecord[] {
  return generateDemoPayroll(attendanceList, baseDate).records;
}

export function createSampleLeaves(attendanceList?: Attendance[], baseDate = new Date()): Leave[] {
  return generateDemoLeaves(attendanceList || [], baseDate);
}

export function createSampleExtraShifts(baseDate = new Date()): ExtraShift[] {
  return generateDemoExtraShifts(baseDate);
}

export function createSampleShiftSwaps(baseDate = new Date()): ShiftSwap[] {
  return generateDemoShiftSwaps(baseDate);
}

export function createSampleShiftSchedules(
  extraShifts?: ExtraShift[],
  shiftSwaps?: ShiftSwap[],
  baseDate = new Date()
): ShiftSchedule[] {
  const extras = extraShifts || generateDemoExtraShifts(baseDate);
  const swaps = shiftSwaps || generateDemoShiftSwaps(baseDate);
  return generateDemoShiftSchedules(extras, swaps, baseDate);
}

export function createSampleAttendance(baseDate = new Date()): Attendance[] {
  return generateDemoAttendance(baseDate);
}

export { 
  generateDemoAttendance, 
  generateDemoLeaves, 
  generateDemoSaldoCuti, 
  generateDemoExtraShifts, 
  generateDemoShiftSwaps, 
  generateDemoShiftSchedules, 
  generateDemoPayroll,
  generateDemoKPI,
  getDemoMonthWindow 
};

export function createSampleKebijakanCuti(): LeaveTypePolicy[] {
  return sampleKebijakanCuti;
}

export function createSampleSaldoCutiList(baseDate = new Date()): EmployeeLeaveQuota[] {
  return generateDemoSaldoCuti(baseDate).list;
}

export function createSampleSaldoCutiMap(baseDate = new Date()): Record<string, EmployeeLeaveQuota> {
  return generateDemoSaldoCuti(baseDate).map;
}

export const createSamplePengaturanPresensi = createSampleAttendanceConfig;
export const createSamplePresensi = createSampleAttendance;

/**
 * Mengambil keseluruhan bundle dataset sample sebagai acuan Export / Import standard
 */
export function getSampleFullDataBundle(baseDate = new Date()) {
  const config = createSampleAttendanceConfig();
  const kpiConfig = createSamplePengaturanKPI();
  const attendanceList = createSampleAttendance(baseDate);
  const kpiPeriods = createSampleKPIPeriods(baseDate);
  const kpiResults = createSampleKPIResults(baseDate);
  const kpiTemplates = createSampleKatalogKPI();
  const payrollPeriods = createSamplePayrollPeriods(baseDate);
  const payrollRecords = createSamplePayrollRecords(attendanceList, baseDate);
  const kebijakanCuti = createSampleKebijakanCuti();
  const saldoCutiData = generateDemoSaldoCuti(baseDate);
  const extraShifts = createSampleExtraShifts(baseDate);
  const shiftSwaps = createSampleShiftSwaps(baseDate);
  const shiftSchedules = createSampleShiftSchedules(extraShifts, shiftSwaps, baseDate);
  const leaves = createSampleLeaves(attendanceList, baseDate);

  return {
    version: '2.3.0',
    exportedAt: new Date().toISOString(),
    source: 'HRMatrix Golden Standard Template',
    perusahaan: [createSampleCompany()],
    departemen: sampleDepartments,
    posisi: samplePositions,
    jobdesk: sampleJobDesks,
    settings: [
      config, 
      { id: 'kpiConfig', ...kpiConfig },
      { id: 'custom_leave_policies', data: kebijakanCuti },
      { id: 'employee_leave_quotas', data: saldoCutiData.map }
    ],
    pengaturanPresensi: config,
    pengaturanKPI: kpiConfig,
    kebijakanCuti: kebijakanCuti,
    saldoCuti: saldoCutiData.list,
    karyawan: sampleEmployees,
    kpiTemplates: kpiTemplates,
    kpiCatalog: kpiTemplates,
    kpiPeriods: kpiPeriods,
    kpiResults: kpiResults,
    cuti: leaves,
    extraShifts: extraShifts,
    shiftSwaps: shiftSwaps,
    shiftSchedules: shiftSchedules,
    kehadiran: attendanceList,
    presensi: attendanceList,
    attendance: attendanceList,
    payrollPeriods: payrollPeriods,
    payrollRecords: payrollRecords,
    salaryHistory: [],
  };
}
