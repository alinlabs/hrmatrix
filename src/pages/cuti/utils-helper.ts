import React from 'react';
import { LeaveCategory } from '../../types';

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

export const formatShortDateIndo = (dateStr: string) => {
  if (!dateStr) return '-';
  const cleanStr = dateStr.split('T')[0];
  const parts = cleanStr.split('-');
  if (parts.length === 3) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const y = parts[0];
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(m) && !isNaN(d) && months[m]) {
      return `${d} ${months[m]} ${y}`;
    }
  }
  return dateStr;
};

export const calculateDuration = (start: string, end: string) => {
  if (!start || !end) return 1;
  const d1 = new Date(start);
  const d2 = new Date(end);
  if (d2 < d1) return 1;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const getLeaveTypeLabel = (type: string | LeaveCategory) => {
  switch (type) {
    case 'Annual Leave': return 'Tahunan';
    case 'Maternity Leave': return 'Melahirkan';
    case 'Marriage Leave': return 'Menikah';
    case 'Compassionate Leave': return 'Berduka';
    case 'Hajj Leave': return 'Cuti Haji / Ibadah'; // Unused
    case 'Personal Leave': return 'Khusus';
    case 'Unpaid Leave': return 'Diluar Tanggungan';
    case 'Cuti Tahunan': return 'Tahunan';
    case 'Cuti Melahirkan': return 'Melahirkan';
    case 'Cuti Melahirkan / Bersalin': return 'Melahirkan';
    case 'Cuti Menikah': return 'Menikah';
    case 'Cuti Berduka': return 'Berduka';
    case 'Cuti Berduka / Kemalangan': return 'Berduka';
    case 'Izin Pribadi': return 'Khusus';
    case 'Izin Khusus / Pribadi': return 'Khusus';
    case 'Cuti Tanpa Gaji': return 'Diluar Tanggungan';
    case 'Cuti di Luar Tanggungan': return 'Diluar Tanggungan';
    case 'Cuti di Luar Tanggungan (Unpaid)': return 'Diluar Tanggungan';
    default: return typeof type === 'string' ? type : 'Lainnya';
  }
};
