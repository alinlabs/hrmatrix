import { PayrollPeriod, PayrollRecord, Employee, Attendance } from '../../types';
import rawEmployees from './karyawan';
import { generateAccuratePayrollRecords } from './payroll-generator';

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

function countWeekdaysInMonth(year: number, monthIdx: number): number {
  const lastDay = new Date(year, monthIdx + 1, 0).getDate();
  let count = 0;
  for (let d = 1; d <= lastDay; d++) {
    const day = new Date(year, monthIdx, d).getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
}

/**
 * SISTEM AUTO-GENERASI DATA PAYROLL MODE DEMO (6 BULAN KE BELAKANG)
 * 
 * Sesuai aturan:
 * - Menghasilkan 6 periode payroll bulanan ke belakang (-1 s/d -6 bulan dari baseDate)
 * - Setiap periode tersinkronisasi 100% dengan log presensi (Attendance[]) pada rentang bulan tersebut
 * - Status seluruh periode historis: 'Paid' (sudah ditutup & dibayarkan)
 * - Bulan berjalan dan mendatang dibiarkan kosong agar user dapat mencoba run payroll sendiri.
 */
export function generateDemoPayroll(
  attendanceList?: Attendance[],
  baseDate = new Date()
): DemoPayrollBundle {
  const baseYear = baseDate.getFullYear();
  const baseMonth = baseDate.getMonth();

  const periods: PayrollPeriod[] = [];
  const allRecords: PayrollRecord[] = [];

  // Urutan dari bulan terbaru (-1) ke 6 bulan lalu (-6)
  for (let offset = 1; offset <= 6; offset++) {
    const targetDate = new Date(baseYear, baseMonth - offset, 1);
    const targetYear = targetDate.getFullYear();
    const targetMonthIdx = targetDate.getMonth(); // 0 - 11
    const targetMonthStr = String(targetMonthIdx + 1).padStart(2, '0');
    const targetMonthName = INDO_MONTHS_NAMES[targetMonthIdx] || 'Januari';

    const startDate = `${targetYear}-${targetMonthStr}-01`;
    const lastDay = new Date(targetYear, targetMonthIdx + 1, 0).getDate();
    const endDate = `${targetYear}-${targetMonthStr}-${String(lastDay).padStart(2, '0')}`;
    const periodId = `${targetYear}-${targetMonthStr}`;

    // Filter log presensi khusus untuk periode bulan terkait agar lembur, alpa, telat, cuti & THP sinkron
    const targetAttendance =
      attendanceList && attendanceList.length > 0
        ? attendanceList.filter((a) => a.date >= startDate && a.date <= endDate)
        : undefined;

    const generated = generateAccuratePayrollRecords(sampleEmployees, {
      periodId,
      month: targetMonthName,
      year: targetYear,
      startDate,
      endDate,
      status: 'Paid',
      attendanceRecords: targetAttendance,
      defaultWorkingDays: countWeekdaysInMonth(targetYear, targetMonthIdx),
    });

    periods.push(generated.period);
    allRecords.push(...generated.records);
  }

  return {
    period: periods[0],
    records: allRecords,
    periods,
  };
}

export default generateDemoPayroll;
