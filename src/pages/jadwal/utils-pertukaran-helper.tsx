import { Employee, ShiftSwapType } from '../../types';

export const INDO_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export const INDO_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function isSameWeek(dateStr1: string, dateStr2: string): boolean {
  if (!dateStr1 || !dateStr2) return false;
  const [y1, m1, day1] = dateStr1.split('-').map(Number);
  const [y2, m2, day2] = dateStr2.split('-').map(Number);
  const d1 = new Date(y1, m1 - 1, day1);
  const d2 = new Date(y2, m2 - 1, day2);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
  
  // Normalize to Monday as start of week
  const dayOfWeek1 = (d1.getDay() + 6) % 7;
  const dayOfWeek2 = (d2.getDay() + 6) % 7;
  
  const monday1 = new Date(d1);
  monday1.setDate(d1.getDate() - dayOfWeek1);
  monday1.setHours(0, 0, 0, 0);

  const monday2 = new Date(d2);
  monday2.setDate(d2.getDate() - dayOfWeek2);
  monday2.setHours(0, 0, 0, 0);

  return monday1.getTime() === monday2.getTime();
}

export function getJenisPengajuanLabel(type?: ShiftSwapType) {
  if (type === 'ganti_shift' || type === 'direct_shift_change') return 'Ganti Shift';
  if (type === 'tukar_shift' || type === 'peer_to_peer') return 'Tukar Shift';
  if (type === 'tukar_off' || type === 'self_date_swap') return 'Tukar Off';
  return 'Ganti Shift';
}

export function formatTanggalPengajuan3Lines(dateStr?: string) {
  if (!dateStr || dateStr === '-') return { day: '-', month: '', year: '' };
  const rawDate = dateStr.split('T')[0];
  const parts = rawDate.split('-');
  if (parts.length === 3) {
    const y = parts[0];
    const mIndex = parseInt(parts[1], 10) - 1;
    const d = parts[2].padStart(2, '0');
    const month = INDO_MONTHS_SHORT[mIndex] || parts[1];
    return { day: d, month, year: y };
  }
  const [y, m, d] = rawDate.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  if (!isNaN(dateObj.getTime())) {
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const month = INDO_MONTHS_SHORT[dateObj.getMonth()] || String(dateObj.getMonth() + 1);
    const yy = String(dateObj.getFullYear());
    return { day: dd, month, year: yy };
  }
  return { day: rawDate, month: '', year: '' };
}

export function formatTanggalIndo(dateStr?: string) {
  if (!dateStr || dateStr === '-') return '-';
  const rawDate = dateStr.split('T')[0];
  const parts = rawDate.split('-');
  if (parts.length === 3) {
    const y = parts[0];
    const mIndex = parseInt(parts[1], 10) - 1;
    const d = parts[2].padStart(2, '0');
    const month = INDO_MONTHS_SHORT[mIndex] || parts[1];
    return `${d} ${month} ${y}`;
  }
  const [y, m, d] = rawDate.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  if (!isNaN(dateObj.getTime())) {
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const month = INDO_MONTHS_SHORT[dateObj.getMonth()] || String(dateObj.getMonth() + 1);
    const yy = String(dateObj.getFullYear());
    return `${dd} ${month} ${yy}`;
  }
  return rawDate;
}

export function formatHariTanggalIndo(dateStr?: string) {
  if (!dateStr || dateStr === '-') return '-';
  const rawDate = dateStr.split('T')[0];
  const [y, m, d] = rawDate.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  if (!isNaN(dateObj.getTime())) {
    const dayName = INDO_DAYS[dateObj.getDay()];
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mIndex = dateObj.getMonth();
    const month = INDO_MONTHS_SHORT[mIndex] || String(mIndex + 1);
    const yy = dateObj.getFullYear();
    return `${dayName}, ${dd} ${month} ${yy}`;
  }
  return dateStr;
}

export function getEmployeePosDept(emp?: Employee, posMap?: Map<string, string>, deptMap?: Map<string, string>) {
  if (!emp) return 'Staff';
  let pos = (emp.positionId && posMap?.get(emp.positionId)) || emp.positionId || emp.level || 'Staff';

  pos = pos.replace(/^POS-/, '').replace(/-/g, ' ');

  const cleanPos = pos.split(' ').map(w => w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
  return cleanPos;
}

export function formatShortName(fullName?: string, maxWords = 2) {
  if (!fullName) return '-';
  const words = fullName.trim().split(/\s+/);
  if (words.length <= maxWords) return fullName.trim();
  return words.slice(0, maxWords).join(' ');
}

export function isSameShiftType(
  s1: { shiftId: string; shiftName?: string; code?: string; isOff?: boolean } | null,
  s2: { shiftId: string; shiftName?: string; code?: string; isOff?: boolean } | null
) {
  if (!s1 || !s2) return false;
  if ((s1.isOff || s1.shiftId === 'OFF' || s1.code === 'OFF') && (s2.isOff || s2.shiftId === 'OFF' || s2.code === 'OFF')) {
    return true;
  }
  if (s1.shiftId && s2.shiftId && s1.shiftId === s2.shiftId) return true;
  if (s1.code && s2.code && s1.code.toLowerCase() === s2.code.toLowerCase()) return true;
  if (s1.shiftName && s2.shiftName) {
    const n1 = s1.shiftName.trim().toLowerCase();
    const n2 = s2.shiftName.trim().toLowerCase();
    if (n1 === n2) return true;
    if (
      (n1.includes('pagi') && n2.includes('pagi')) ||
      (n1.includes('siang') && n2.includes('siang')) ||
      (n1.includes('malam') && n2.includes('malam'))
    ) {
      return true;
    }
  }
  return false;
}
