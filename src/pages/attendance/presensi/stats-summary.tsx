import React from 'react';
import { AttendanceStats } from './types';

interface StatsSummaryProps {
  show: boolean;
  totalActiveEmployees: number;
  stats: AttendanceStats;
}

export function StatsSummary({ show, totalActiveEmployees, stats }: StatsSummaryProps) {
  if (!show) return null;

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2.5 lg:gap-3">
      {/* Total Karyawan */}
      <div className="p-2 sm:p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex flex-col justify-between">
        <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate block" title="Total Karyawan">
          Total Karyawan
        </span>
        <div className="flex items-baseline justify-between mt-1 gap-1">
          <span className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900">
            {totalActiveEmployees}
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium shrink-0">
            Aktif
          </span>
        </div>
      </div>

      {/* Tepat Waktu */}
      <div className="p-2 sm:p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex flex-col justify-between">
        <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate block" title="Tepat Waktu">
          Tepat Waktu
        </span>
        <div className="flex items-baseline justify-between mt-1 gap-1">
          <span className="text-base sm:text-lg lg:text-xl font-extrabold text-emerald-700">
            {stats.present}
          </span>
          <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold shrink-0">
            Hadir
          </span>
        </div>
      </div>

      {/* Terlambat */}
      <div className="p-2 sm:p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex flex-col justify-between">
        <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate block" title="Terlambat">
          Terlambat
        </span>
        <div className="flex items-baseline justify-between mt-1 gap-1">
          <span className="text-base sm:text-lg lg:text-xl font-extrabold text-amber-700">
            {stats.late}
          </span>
          <span className="text-[9px] sm:text-[10px] text-amber-600 font-bold shrink-0">
            Late
          </span>
        </div>
      </div>

      {/* Cuti / Izin */}
      <div className="p-2 sm:p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex flex-col justify-between">
        <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate block" title="Cuti / Sakit / WFH">
          Cuti / Izin
        </span>
        <div className="flex items-baseline justify-between mt-1 gap-1">
          <span className="text-base sm:text-lg lg:text-xl font-extrabold text-blue-700">
            {stats.leave + stats.wfh}
          </span>
          <span className="text-[9px] sm:text-[10px] text-blue-600 font-bold shrink-0">
            Izin
          </span>
        </div>
      </div>

      {/* Alpa */}
      <div className="p-2 sm:p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex flex-col justify-between">
        <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate block" title="Alpa">
          Alpa
        </span>
        <div className="flex items-baseline justify-between mt-1 gap-1">
          <span className="text-base sm:text-lg lg:text-xl font-extrabold text-red-700">
            {stats.absent}
          </span>
          <span className="text-[9px] sm:text-[10px] text-red-600 font-bold shrink-0">
            Absent
          </span>
        </div>
      </div>

      {/* Belum Presensi */}
      <div className={`p-2 sm:p-3 border rounded-xl shadow-2xs flex flex-col justify-between ${
        stats.notSet > 0 ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-slate-200/80'
      }`}>
        <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate block" title="Belum Presensi">
          Belum Presensi
        </span>
        <div className="flex items-baseline justify-between mt-1 gap-1">
          <span className={`text-base sm:text-lg lg:text-xl font-extrabold ${stats.notSet > 0 ? 'text-amber-800' : 'text-slate-500'}`}>
            {stats.notSet}
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium shrink-0">
            -
          </span>
        </div>
      </div>
    </div>
  );
}
