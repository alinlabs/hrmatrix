import React from 'react';
import { KompensasiStats, KompensasiTab } from './types';

interface StatsSummaryProps {
  stats: KompensasiStats;
  activeTab: KompensasiTab;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ stats, activeTab }) => {
  if (activeTab === 'pajak') {
    return null;
  }

  if (activeTab === 'jaminan') {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 1: Kesehatan */}
        <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider block leading-tight">
            KESEHATAN
          </span>
          <div className="mt-1 flex items-baseline gap-1.5 leading-none">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {stats.bpjsKesehatan}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">aturan</span>
          </div>
        </div>

        {/* Card 2: Ketenagakerjaan */}
        <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider block leading-tight">
            KETENAGAKERJAAN
          </span>
          <div className="mt-1 flex items-baseline gap-1.5 leading-none">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {stats.bpjsKetenagakerjaan}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">aturan</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: activeTab === 'tunjangan'
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
      {/* Stat 1: Total */}
      <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
        <span className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider block leading-tight">
          Total Aturan
        </span>
        <div className="mt-1 flex items-baseline gap-1.5 leading-none">
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {stats.totalTunjangan}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">template</span>
        </div>
      </div>

      {/* Stat 2: Tunjangan */}
      <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
        <span className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider block leading-tight">
          Tunjangan
        </span>
        <div className="mt-1 flex items-baseline gap-1.5 leading-none">
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {stats.tunjanganTetap + stats.tunjanganTidakTetap}
          </span>
          <span className="text-[10px] text-slate-500 font-medium leading-tight">
            ({stats.tunjanganTetap} tetap / {stats.tunjanganTidakTetap} variabel)
          </span>
        </div>
      </div>

      {/* Stat 3: Insentif */}
      <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
        <span className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider block leading-tight">
          Insentif
        </span>
        <div className="mt-1 flex items-baseline gap-1.5 leading-none">
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {stats.insentifCount}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">aturan</span>
        </div>
      </div>

      {/* Stat 4: Bonus */}
      <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
        <span className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider block leading-tight">
          Bonus
        </span>
        <div className="mt-1 flex items-baseline gap-1.5 leading-none">
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {stats.bonusCount}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">aturan</span>
        </div>
      </div>
    </div>
  );
};

