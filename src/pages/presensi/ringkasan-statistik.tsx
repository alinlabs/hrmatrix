import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  CalendarOff,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { AttendanceStats } from './types';

interface StatsSummaryProps {
  show: boolean;
  totalActiveEmployees: number;
  stats: AttendanceStats;
}

export function StatsSummary({ show, totalActiveEmployees, stats }: StatsSummaryProps) {
  if (!show) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Total Karyawan */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="truncate" title="Total Karyawan">Total Karyawan</span>
          <Users className="w-4 h-4 text-blue-600 shrink-0" />
        </div>
        <div className="text-base sm:text-xl font-bold text-slate-900 tabular-nums">
          {totalActiveEmployees}
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          Aktif
        </div>
      </div>

      {/* Tepat Waktu */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="truncate" title="Tepat Waktu">Tepat Waktu</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        </div>
        <div className="text-base sm:text-xl font-bold text-emerald-700 tabular-nums">
          {stats.present}
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          Hadir
        </div>
      </div>

      {/* Terlambat */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="truncate" title="Terlambat">Terlambat</span>
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
        </div>
        <div className="text-base sm:text-xl font-bold text-amber-700 tabular-nums">
          {stats.late}
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          Terlambat masuk
        </div>
      </div>

      {/* Cuti / Izin */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="truncate" title="Cuti / Sakit / WFH">Cuti / Izin</span>
          <CalendarOff className="w-4 h-4 text-blue-600 shrink-0" />
        </div>
        <div className="text-base sm:text-xl font-bold text-blue-700 tabular-nums">
          {stats.leave + stats.wfh}
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          Izin / WFH
        </div>
      </div>

      {/* Alpa */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="truncate" title="Alpa">Alpa</span>
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
        </div>
        <div className="text-base sm:text-xl font-bold text-red-700 tabular-nums">
          {stats.absent}
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          Tanpa keterangan
        </div>
      </div>

      {/* Belum Presensi */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="truncate" title="Belum Presensi">Belum Presensi</span>
          <HelpCircle className={`w-4 h-4 shrink-0 ${stats.notSet > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
        </div>
        <div className={`text-base sm:text-xl font-bold tabular-nums ${stats.notSet > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
          {stats.notSet}
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          Menunggu data
        </div>
      </div>
    </div>
  );
}
