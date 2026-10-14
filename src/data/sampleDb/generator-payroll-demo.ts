import { PayrollPeriod, PayrollRecord, Employee, Attendance } from '../../types';
import rawEmployees from './karyawan';
import { generateAccuratePayrollRecords } from './payroll-generator';
import { getDemoMonthWindow } from './generator-presensi-demo';

const sampleEmployees = rawEmployees as unknown as Employee[];

const INDO_MONTHS_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export interface DemoPayrollBundle {
  period: PayrollPeriod;
  records: PayrollRecord[];
  periods: PayrollPeriod[];
}

/**
 * SISTEM AUTO-GENERASI DATA PAYROLL MODE DEMO
 * 
 * Sesuai aturan:
 * - Menghitung periode 1 bulan yang lalu secara dinamis berdasarkan baseDate
 *   (misal klik Mode Demo pada 23 September 2026, maka yang dibuat adalah periode Agustus 2026)
 * - Rentang tanggal: dari tanggal 1 hingga akhir bulan sebelumnya
 * - Status periode: 'Paid' (karena sudah ditutup & dibayarkan pada bulan lalu)
 * - HANYA membuat data 1 bulan lalu (bulan berjalan dan mendatang dibiarkan kosong agar
 *   pengguna dapat mencoba membuat & menghitungnya sendiri sebagai user experience / uji coba).
 */
export function generateDemoPayroll(
  attendanceList?: Attendance[],
  baseDate = new Date()
): DemoPayrollBundle {
  const window = getDemoMonthWindow(baseDate);

  const prevYear = window.prevMonthYear;
  const prevMonthIdx = window.prevMonth; // 0 - 11
  const prevMonthStr = String(prevMonthIdx + 1).padStart(2, '0');
  const prevMonthName = INDO_MONTHS_NAMES[prevMonthIdx] || 'Agustus';

  const startDate = `${prevYear}-${prevMonthStr}-01`;
  const lastDay = new Date(prevYear, prevMonthIdx + 1, 0).getDate();
  const endDate = `${prevYear}-${prevMonthStr}-${String(lastDay).padStart(2, '0')}`;
  const periodId = `${prevYear}-${prevMonthStr}`;

  // Filter log presensi khusus untuk periode 1 bulan lalu agar kalkulasi potongan/kehadiran presisi
  const targetAttendance = attendanceList && attendanceList.length > 0
    ? attendanceList.filter(a => a.date >= startDate && a.date <= endDate)
    : undefined;

  const generated = generateAccuratePayrollRecords(sampleEmployees, {
    periodId,
    month: prevMonthName,
    year: prevYear,
    startDate,
    endDate,
    status: 'Paid',
    attendanceRecords: targetAttendance,
    defaultWorkingDays: 22
  });

  return {
    period: generated.period,
    records: generated.records,
    periods: [generated.period]
  };
}

export default generateDemoPayroll;
