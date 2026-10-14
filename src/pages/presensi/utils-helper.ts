import { Attendance } from '../../types';
import { AttendanceStats } from './types';

export const todayStr = new Date().toISOString().split('T')[0];

export const daysID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const monthsID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export const monthsFullID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export const shiftColorClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  rose: 'bg-rose-100 text-rose-800 border-rose-200',
  indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  slate: 'bg-slate-100 text-slate-800 border-slate-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function formatTwoLineDate(dateStr: string) {
  if (!dateStr) return { dayName: 'Minggu', dateNumStr: '20 Agu 2023' };
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dateObj = new Date(y, m, d);
    const dayName = daysID[dateObj.getDay()] || 'Minggu';
    const monthName = monthsID[m] || 'Jan';
    return {
      dayName,
      dateNumStr: `${d} ${monthName} ${y}`
    };
  }
  return { dayName: 'Hari Ini', dateNumStr: dateStr };
}

export function formatFullDateIndo(dateStr: string): string {
  if (!dateStr) return 'Sabtu, 20 Desember 2026';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dateObj = new Date(y, m, d);
    const dayName = daysID[dateObj.getDay()] || 'Minggu';
    const fullMonthName = monthsFullID[m] || 'Januari';
    return `${dayName}, ${d} ${fullMonthName} ${y}`;
  }
  return dateStr;
}

export function formatDateIndo(dateStr: string): string {
  const { dayName, dateNumStr } = formatTwoLineDate(dateStr);
  return `${dayName}, ${dateNumStr}`;
}

export const statusFilterLabels: Record<string, string> = {
  NotSet: 'Belum Presensi',
  Present: 'Hadir Tepat Waktu',
  Late: 'Terlambat',
  LeaveGroup: 'Cuti / Sakit',
  WFH: 'Work From Home',
  Absent: 'Alpa / Tidak Hadir',
};

export function calculateAttendanceStats(totalActiveEmployees: number, attendanceRecords: Attendance[]): AttendanceStats {
  const recordedCount = attendanceRecords.length;
  return {
    present: attendanceRecords.filter(r => r.status === 'Present').length,
    late: attendanceRecords.filter(r => r.status === 'Late').length,
    wfh: attendanceRecords.filter(r => r.status === 'WFH').length,
    leave: attendanceRecords.filter(r => r.status === 'Leave' || r.status === 'Sick').length,
    absent: attendanceRecords.filter(r => r.status === 'Absent').length,
    notSet: Math.max(0, totalActiveEmployees - recordedCount),
  };
}

export const formatEmployeeName = (fullName: string) => {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length > 2) {
    return parts.slice(0, 2).join(' ').replace(/,$/, '').replace(/;$/, '');
  }
  return fullName;
};

export const formatPositionName = (posName: string) => {
  if (!posName || posName === '-') return 'Staff';
  const parts = posName.trim().split(/\s+/);
  if (parts.length > 2) {
    return parts.slice(0, 2).join(' ').replace(/,$/, '').replace(/;$/, '');
  }
  return posName;
};

export const formatDepartmentName = (deptName: string) => {
  if (!deptName || deptName === '-') return '-';
  const parts = deptName.trim().split(/\s+/);
  if (parts.length > 2) {
    return parts.slice(0, 2).join(' ').replace(/,$/, '').replace(/;$/, '');
  }
  return deptName;
};
