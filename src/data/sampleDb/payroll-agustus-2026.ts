import { PayrollPeriod, PayrollRecord, Employee } from '../../types';
import rawEmployees from './karyawan';
import { generateAccuratePayrollRecords } from './payroll-generator';

const employees = rawEmployees as unknown as Employee[];

/**
 * SAMPLE DATABASE: PAYROLL PERIODE BULAN LALU (AGUSTUS 2026 - STATUS: PAID)
 * 
 * Terkalkulasi secara presisi dan tersinkronisasi dengan:
 * - Data Gaji Pokok & Tunjangan Karyawan (src/data/sampleDb/karyawan.ts)
 * - Skema Pajak PPh 21 TER & BPJS
 * - Status payroll final / terbayarkan (Paid)
 */
const generatedAgustus = generateAccuratePayrollRecords(employees, {
  periodId: '2026-08',
  month: '08',
  year: 2026,
  startDate: '2026-08-01',
  endDate: '2026-08-31',
  status: 'Paid',
  defaultWorkingDays: 22
});

export const samplePayrollPeriodAgustus2026: PayrollPeriod = generatedAgustus.period;
export const samplePayrollRecordsAgustus2026: PayrollRecord[] = generatedAgustus.records;

export default {
  period: samplePayrollPeriodAgustus2026,
  records: samplePayrollRecordsAgustus2026
};
