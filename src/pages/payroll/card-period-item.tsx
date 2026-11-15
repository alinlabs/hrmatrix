import React from 'react';
import { Calendar, Users, Clock, Check, ArrowUpRight } from 'lucide-react';
import { CardPeriodItemProps } from './types';
import { formatRupiah, formatDateRange } from './utils-helper';

export const CardPeriodItem: React.FC<CardPeriodItemProps> = ({
  period,
  stat,
  onClick
}) => {
  const periodTitle = period.name || `${period.month} ${period.year}`;
  const isPaid = period.status === 'Paid' || period.status === 'Closed';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/90 shadow-2xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between gap-3 group cursor-pointer relative overflow-hidden"
    >
      {/* 1. Header: Title & Top Right Arrow Icon */}
      <div className="flex justify-between items-center gap-2">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors truncate tracking-tight">
          {periodTitle}
        </h3>

        {/* Thin Arrow Up Right Icon to indicate clickability */}
        <div className="p-1 rounded-lg text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">
          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* 2. Periode Range Banner with Status Indicator */}
      <div
        className={`rounded-xl px-3.5 py-2.5 border flex items-center justify-between text-xs gap-2 transition-colors ${
          !isPaid
            ? 'bg-rose-50/80 border-rose-200/80 text-rose-900'
            : 'bg-slate-50/90 border-slate-200/60 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <Calendar className={`w-3.5 h-3.5 shrink-0 ${!isPaid ? 'text-rose-500' : 'text-slate-400'}`} />
          <span className={`text-[11px] font-medium ${!isPaid ? 'text-rose-600' : 'text-slate-500'}`}>
            Periode:
          </span>
        </div>

        <div className="flex items-center gap-2 justify-end flex-1 min-w-0">
          <span className="font-semibold text-[11px] sm:text-xs truncate text-right">
            {formatDateRange(period.startDate, period.endDate)}
          </span>

          {/* Status Indicator on the Far Right inside Date Card */}
          {!isPaid ? (
            <div className="flex items-center gap-1 text-rose-600 shrink-0" title="Belum Selesai">
              <Clock className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs" title="Selesai / Paid">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          )}
        </div>
      </div>

      {/* 3. Dynamic Stats: Penerima Gaji & Total Payroll */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-100/90 flex flex-col items-center justify-center text-center">
          <div className="text-[10px] uppercase font-normal text-slate-400 tracking-wider text-center">
            Penerima Gaji
          </div>
          <div className="font-bold text-slate-800 text-xs sm:text-sm mt-1 truncate w-full text-center">
            {stat?.count ? `${stat.count} Karyawan` : '0 Karyawan'}
          </div>
        </div>

        <div className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-100/90 flex flex-col items-center justify-center text-center">
          <div className="text-[10px] uppercase font-normal text-slate-400 tracking-wider text-center">
            Total Payroll
          </div>
          <div className="font-bold text-slate-900 text-xs sm:text-sm mt-1 truncate w-full text-center">
            {stat?.totalNet ? formatRupiah(stat.totalNet) : (period.status === 'Draft' ? 'Belum Dihitung' : 'Rp 0')}
          </div>
        </div>
      </div>
    </div>
  );
};
