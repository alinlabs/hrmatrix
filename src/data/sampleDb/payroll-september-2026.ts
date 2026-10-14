import { PayrollPeriod, PayrollRecord, Employee } from '../../types';
import rawEmployees from './karyawan';
import { sampleAttendanceRecords } from './presensi';
import { generateAccuratePayrollRecords } from './payroll-generator';

const employees = rawEmployees as unknown as Employee[];

/**
 * SAMPLE DATABASE: PAYROLL PERIODE BULAN BERJALAN (SEPTEMBER 2026)
 * 
 * Terkalkulasi secara presisi dan tersinkronisasi dengan:
 * - Data Kompensasi & Gaji Pokok Karyawan (src/data/sampleDb/karyawan.ts)
 * - Log Presensi Kehadiran & Lembur (src/data/sampleDb/presensi.ts)
 * - Skema Pajak PPh 21 TER (PP 58/2023 & PMK 168/2023)
 * - Iuran BPJS Kesehatan (1%) & Ketenagakerjaan (JHT 2%, JP 1%)
 */
const generatedSeptember = generateAccuratePayrollRecords(employees, {
  periodId: '2026-09',
  month: '09',
  year: 2026,
  startDate: '2026-09-01',
  endDate: '2026-09-30',
  status: 'Draft',
  attendanceRecords: sampleAttendanceRecords,
  defaultWorkingDays: 22
});

export const samplePayrollPeriodSeptember2026: PayrollPeriod = generatedSeptember.period;
export const samplePayrollRecordsSeptember2026: PayrollRecord[] = generatedSeptember.records;

export default {
  period: samplePayrollPeriodSeptember2026,
  records: samplePayrollRecordsSeptember2026
};
