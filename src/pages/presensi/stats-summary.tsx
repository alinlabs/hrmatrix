import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  CalendarOff,
  XCircle,
  AlertCircle,
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
        <div className="flex items-center justify-between gap-1.5 text-xs font-medium text-slate-500">
          <span className="truncate" title="Total Karyawan">Total Karyawan</span>
          <Users className="w-4 h-4 text-blue-600 shrink-0" />
        </div>
        <div className="text-base sm:text-xl font-bold tabular-nums text-slate-900">
          {totalActiveEmployees}
        </div>
        <div className="text-[11px] text-slate-400">Aktif</div>
      </div>

      {/* Tepat Waktu */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
        <div className="flex items-center justify-between gap-1.5 text-xs font-medium text-slate-500">
          <span className="truncate" title="Tepat Waktu">Tepat Waktu</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        </div>
        <div className="text-base sm:text-xl font-bold tabular-nums text-emerald-600">
          {stats.present}
        </div>
        <div className="text-[11px] text-slate-400">Hadir</div>
      </div>

      {/* Terlambat */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
        <div className="flex items-center justify-between gap-1.5 text-xs font-medium text-slate-500">
          <span className="truncate" title="Terlambat">Terlambat</span>
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
        </div>
        <div className="text-base sm:text-xl font-bold tabular-nums text-amber-600">
          {stats.late}
        </div>
        <div className="text-[11px] text-slate-400">Late</div>
      </div>

      {/* Cuti / Izin */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
        <div className="flex items-center justify-between gap-1.5 text-xs font-medium text-slate-500">
          <span className="truncate" title="Cuti / Sakit / WFH">Cuti / Izin</span>
          <CalendarOff className="w-4 h-4 text-blue-600 shrink-0" />
        </div>
        <div className="text-base sm:text-xl font-bold tabular-nums text-blue-600">
          {stats.leave + stats.wfh}
        </div>
        <div className="text-[11px] text-slate-400">Izin</div>
      </div>

      {/* Alpa */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
        <div className="flex items-center justify-between gap-1.5 text-xs font-medium text-slate-500">
          <span className="truncate" title="Alpa">Alpa</span>
          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
        </div>
        <div className="text-base sm:text-xl font-bold tabular-nums text-rose-600">
          {stats.absent}
        </div>
        <div className="text-[11px] text-slate-400">Absent</div>
      </div>

      {/* Belum Presensi */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
        <div className="flex items-center justify-between gap-1.5 text-xs font-medium text-slate-500">
          <span className="truncate" title="Belum Presensi">Belum Presensi</span>
          <AlertCircle className={`w-4 h-4 shrink-0 ${stats.notSet > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
        </div>
        <div className={`text-base sm:text-xl font-bold tabular-nums ${stats.notSet > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
          {stats.notSet}
        </div>
        <div className="text-[11px] text-slate-400">Menunggu</div>
      </div>
    </div>
  );
}
