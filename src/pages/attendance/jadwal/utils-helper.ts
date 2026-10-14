import React from 'react';
import { WorkShift } from '../../../types';
import { DayOfWeekItem } from './types';

export const DAYS_OF_WEEK: DayOfWeekItem[] = [
  { key: 'senin', label: 'Senin', defaultDayIndex: 1 },
  { key: 'selasa', label: 'Selasa', defaultDayIndex: 2 },
  { key: 'rabu', label: 'Rabu', defaultDayIndex: 3 },
  { key: 'kamis', label: 'Kamis', defaultDayIndex: 4 },
  { key: 'jumat', label: 'Jumat', defaultDayIndex: 5 },
  { key: 'sabtu', label: 'Sabtu', defaultDayIndex: 6 },
  { key: 'minggu', label: 'Minggu', defaultDayIndex: 0 },
];

export const FIVE_DEFAULT_SHIFTS: WorkShift[] = [
  {
    id: 'shift-reguler',
    code: 'REGULER',
    name: 'Non Shift',
    startTime: '08:00',
    endTime: '17:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    color: 'blue',
    isOff: false,
  },
  {
    id: 'shift-1-pagi',
    code: 'PAGI',
    name: 'Shift 1 (Pagi)',
    startTime: '07:00',
    endTime: '16:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    color: 'emerald',
    isOff: false,
  },
  {
    id: 'shift-2-siang',
    code: 'SIANG',
    name: 'Shift 2 (Siang)',
    startTime: '15:00',
    endTime: '00:00',
    breakStartTime: '18:00',
    breakEndTime: '19:00',
    color: 'amber',
    crossDay: true,
    isOff: false,
  },
  {
    id: 'shift-3-malam',
    code: 'MALAM',
    name: 'Shift 3 (Malam)',
    startTime: '23:00',
    endTime: '08:00',
    breakStartTime: '03:00',
    breakEndTime: '04:00',
    color: 'purple',
    crossDay: true,
    isOff: false,
  },
  {
    id: 'shift-off',
    code: 'OFF',
    name: 'Libur (OFF)',
    startTime: '00:00',
    endTime: '00:00',
    color: 'rose',
    isOff: true,
  },
];

export const getShiftBadgeClasses = (color: string) => {
  switch (color?.toLowerCase()) {
    case 'blue':
    case '#2563eb':
    case '#3b82f6':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'emerald':
    case 'green':
    case '#059669':
    case '#10b981':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'amber':
    case 'yellow':
    case '#d97706':
    case '#f59e0b':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'purple':
    case '#7c3aed':
    case '#8b5cf6':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'rose':
    case 'red':
    case '#e11d48':
    case '#f43f5e':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'indigo':
    case '#4f46e5':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    default:
      if (color?.startsWith('#')) {
        return '';
      }
      return 'bg-blue-50 text-blue-700 border-blue-200';
  }
};

export const getShiftBadgeStyle = (color: string): React.CSSProperties => {
  if (color?.startsWith('#')) {
    return {
      backgroundColor: `${color}15`,
      color: color,
      borderColor: `${color}35`,
    };
  }
  return {};
};

export const getDefaultMonthDates = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  const formatYMD = (year: number, monthIdx: number, day: number) => {
    const mm = String(monthIdx + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const start = formatYMD(y, m, d);
  const lastDay = new Date(y, m + 1, 0).getDate();
  const end = formatYMD(y, m, lastDay);
  return { start, end };
};

export const formatDisplayDateIndo = (dateStr: string) => {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  if (!m || m < 1 || m > 12) return dateStr;
  return `${d} ${monthNames[m - 1]} ${y}`;
};

export const formatIndoDate = (isoStr?: string) => {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoStr;
  }
};
