import { db } from '../../db/database';

import { v4 as uuidv4 } from 'uuid';
import { processPayrollRecord } from '../../services/payrollCalculator';

import { DEFAULT_PAYROLL_RULES } from '../master';
import { Company } from '../../types';

import {
  createSampleCompany,
  sampleDepartments,
  samplePositions,
  createSampleAttendanceConfig,
  createSamplePengaturanKPI,
  sampleMasterShifts,
  sampleShiftPatterns,
  sampleEmployees,
  createSampleLeaves,
  createSampleExtraShifts,
  createSampleShiftSwaps,
  createSampleShiftSchedules,
  createSampleAttendance,
  sampleKPITemplates,
  createSampleKPIPeriods,
  createSampleKPIResults,
  createSamplePayrollPeriods,
  createSamplePayrollRecords,
  createSampleKebijakanCuti,
  createSampleSaldoCutiMap,
  sampleJobDesks,
  getSampleFullDataBundle,
} from './pengelola-data';

export * from './utilitas-tanggal';
export * from './pengelola-data';

/**
 * ⚡ SEED GENERATOR SAMPLE DATA LENGKAP BERBASIS JSON:
 * Mengisi data sampel terpusat dari file-file JSON modular (`src/data/sampleDb/*.json`):
 * - company.json (Profil Perusahaan)
 * - departments.json (6 Departemen)
 * - positions.json (Jabatan)
 * - attendance-config.json (Toleransi telat, denda, lembur, master shift & pola roster)
 * - employees.json (18 Karyawan beserta profil PPh 21 TER, BPJS Kesehatan & Ketenagakerjaan)
 * - kpi-templates.json (Template KPI)
 * - leaves.json (Cuti)
 * - extra-shifts.json (Shift Tambahan & Lembur)
 * - shift-swaps.json (Tukar Shift)
 * - shift-schedules.json (Override Jadwal)
 * - attendance.json (Log Presensi Kehadiran)
 */
export async function populateSampleCompanyAndEmployees(baseDate = new Date()): Promise<{
  company: Company;
  employeesCount: number;
}> {
  // 1. Buat entitas data sampel menggunakan loader JSON & auto-generasi presensi dinamis 3 bulan
  const sampleCompany = createSampleCompany();
  const sampleAttendanceConfig = createSampleAttendanceConfig();
  const sampleAttendance = createSampleAttendance(baseDate);
  const sampleLeaves = createSampleLeaves(sampleAttendance, baseDate);
  const sampleExtraShifts = createSampleExtraShifts(baseDate);
  const sampleShiftSwaps = createSampleShiftSwaps(baseDate);
  const sampleShiftSchedules = createSampleShiftSchedules(sampleExtraShifts, sampleShiftSwaps, baseDate);
  const samplePengaturanKPI = createSamplePengaturanKPI();
  const sampleKPIPeriods = createSampleKPIPeriods(baseDate);
  const sampleKPIResults = createSampleKPIResults(baseDate);
  const samplePayrollPeriods = createSamplePayrollPeriods(baseDate);
  const samplePayrollRecords = createSamplePayrollRecords(sampleAttendance, baseDate);
  const sampleKebijakanCuti = createSampleKebijakanCuti();
  const sampleSaldoCutiMap = createSampleSaldoCutiMap(baseDate);
  
  // 2. Fetch external JSON (MUST be outside Dexie transaction to prevent early commit)
  let extraPayrollRules: any[] = [];
  try {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const res = await fetch('/data/sampleDb/tunjangan.json');
      if (res.ok) {
        const jsonTunjangan = await res.json();
        if (Array.isArray(jsonTunjangan) && jsonTunjangan.length > 0) {
          extraPayrollRules = jsonTunjangan;
        }
      }
    }
  } catch (e) {
    // Fallback silently
  }

  // 3. Eksekusi transaksi Dexie database
  await db.transaction(
    'rw',
    [
      db.company,
      db.departments,
      db.positions,
      db.employees,
      db.settings,
      db.attendance,
      db.leaves,
      db.kpiTemplates,
      db.kpiPeriods,
      db.kpiResults,
      db.shiftSchedules,
      db.shiftSwaps,
      db.extraShifts,
      db.payrollPeriods,
      db.payrollRecords,
      db.payrollRules,
      db.regulatorySources,
    ],
    async () => {
      // Bersihkan data lama agar bersih & konsisten
      await db.company.clear();
      await db.departments.clear();
      await db.positions.clear();
      await db.employees.clear();
      await db.settings.clear();
      await db.attendance.clear();
      await db.leaves.clear();
      await db.kpiTemplates.clear();
      await db.kpiPeriods.clear();
      await db.kpiResults.clear();
      await db.shiftSchedules.clear();
      await db.shiftSwaps.clear();
      await db.extraShifts.clear();
      await db.payrollPeriods.clear();
      await db.payrollRecords.clear();
      await db.payrollRules.clear();

      // Bulk Add Semua Entitas Sampel dari JSON
      await db.company.add(sampleCompany);
      await db.departments.bulkAdd(sampleDepartments);
      await db.positions.bulkAdd(samplePositions);
      await db.employees.bulkAdd(sampleEmployees);
      await db.settings.put(sampleAttendanceConfig as any);
      await db.settings.put({ id: 'kpiConfig', ...samplePengaturanKPI } as any);
      await db.settings.put({ id: 'custom_leave_policies', data: sampleKebijakanCuti } as any);
      await db.settings.put({ id: 'employee_leave_quotas', data: sampleSaldoCutiMap } as any);
      await db.shiftSchedules.bulkAdd(sampleShiftSchedules);
      await db.shiftSwaps.bulkAdd(sampleShiftSwaps);
      await db.extraShifts.bulkAdd(sampleExtraShifts);
      await db.leaves.bulkAdd(sampleLeaves);
      await db.attendance.bulkAdd(sampleAttendance);
      await db.kpiTemplates.bulkAdd(sampleKPITemplates);
      await db.kpiPeriods.bulkAdd(sampleKPIPeriods);
      await db.kpiResults.bulkAdd(sampleKPIResults);
      await db.payrollRules.bulkPut(DEFAULT_PAYROLL_RULES);
      
      if (extraPayrollRules.length > 0) {
        await db.payrollRules.bulkPut(extraPayrollRules);
      }

      // --- POPULATE STANDARDIZED PAYROLL DATA ---
      await db.payrollPeriods.bulkAdd(samplePayrollPeriods as any);
      await db.payrollRecords.bulkAdd(samplePayrollRecords as any);
      // --- END STANDARDIZED PAYROLL DATA ---

    }
  );

  // Sync sample job desks to localStorage for Job Desk management
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('job_desk_custom_templates_v1', JSON.stringify(sampleJobDesks));
    } catch (e) {
      // Fallback silently
    }
  }

  return {
    company: sampleCompany,
    employeesCount: sampleEmployees.length,
  };
}
