import { Employee, PayrollPeriod, PayrollRecord } from '../../types';

export const INDO_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export const INDO_MONTHS_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const INDO_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function formatRupiah(amount?: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

export function formatDateDisplay(dateStr?: string): { dayMonthYear: string; dayName: string } {
  if (!dateStr) return { dayMonthYear: 'Pilih Tanggal', dayName: '-' };
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const mIndex = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dateObj = new Date(y, mIndex, d);
    const dayName = !isNaN(dateObj.getDay()) ? INDO_DAYS[dateObj.getDay()] : '-';
    const month = INDO_MONTHS_SHORT[mIndex] || parts[1];
    return {
      dayMonthYear: `${String(d).padStart(2, '0')} ${month} ${y}`,
      dayName
    };
  }
  return { dayMonthYear: dateStr, dayName: '-' };
}

export function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) return '-';
  const start = formatDateDisplay(startDate).dayMonthYear;
  const end = formatDateDisplay(endDate).dayMonthYear;
  return `${start} s/d ${end}`;
}

/**
 * Format string tanggal YYYY-MM-DD ke format Indonesia ringkas (e.g. 1 Sep 2026)
 */
export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return 'Pilih Tanggal';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const y = parts[0];
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d} ${months[m - 1] || ''} ${y}`;
}

/**
 * Format objek Date menjadi YYYY-MM-DD
 */
export function formatYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatSimpleDateIndo(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = parseInt(parts[2], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parts[0];
      return `${d} ${INDO_MONTHS_FULL[m] || ''} ${y}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

import { getEmployeePhotoUrl as getResolvedPhotoUrl } from '../../components/ui/EmployeeAvatar';

export function getEmployeePhotoUrl(emp?: Employee): string {
  if (!emp) return '';
  return getResolvedPhotoUrl(emp) || '';
}



export function exportPayrollRecordsToCSV(records: PayrollRecord[], period: PayrollPeriod | undefined, employees: Employee[]): void {
  if (!records || records.length === 0) return;
  const empMap = new Map(employees.map(e => [e.id, e]));

  const headers = [
    'NIK / Employee ID',
    'Nama Karyawan',
    'Gaji Pokok',
    'Tunjangan & Lembur',
    'Gaji Bruto',
    'Pajak PPh 21',
    'BPJS Kesehatan',
    'BPJS Ketenagakerjaan',
    'Total Potongan',
    'Take Home Pay (Gaji Bersih)'
  ];

  const rows = records.map(r => {
    const emp = empMap.get(r.employeeId);
    const basic = r.basicSalary || 0;
    const gross = r.grossSalary || 0;
    const allowance = Math.max(0, gross - basic);
    const tax = r.tax || 0;
    const health = r.deductionsBreakdown?.find(d => 
      d.id === 'ded_bpjs_kesehatan' || d.name.toLowerCase().includes('bpjs kesehatan')
    )?.amount || 0;
    const tk = (r.bpjs || 0) > health ? (r.bpjs || 0) - health : 0;
    const deduction = r.totalDeduction || 0;
    const net = r.netSalary || 0;

    return [
      `"${emp?.employeeId || '-'}"`,
      `"${emp?.fullName || '-'}"`,
      basic,
      allowance,
      gross,
      tax,
      health,
      tk,
      deduction,
      net
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `payroll_${period?.name || period?.month || 'periode'}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
