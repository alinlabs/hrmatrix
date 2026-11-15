import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Target, ArrowUpRight, Trash2, BookOpen } from 'lucide-react';
import { KPIPeriodCardViewProps } from './types';
import { formatDateRange } from './utils-helper';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyKpiAnimation from '../../assets/animations/empty-kpi.json';

export function KPIPeriodCardView({
  periods,
  results,
  employees,
  onSelectPeriod,
  onDeletePeriod,
  onAddPeriod,
  onOpenGeneralCatalog
}: KPIPeriodCardViewProps) {
  const navigate = useNavigate();
  const handleOpenGeneral = onOpenGeneralCatalog || (() => navigate('/kpi/katalog-umum'));

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ================= CARD BUTTON: KPI UMUM ================= */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpenGeneral}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenGeneral();
          }
        }}
        className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 text-white cursor-pointer select-none shadow-md shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 animate-card-gradient border border-white/20"
      >
        {/* Living Ambient Light Orb 1 - Luminous highlight bergeser & bernapas (timbul-redup) */}
        <div
          aria-hidden="true"
          className="absolute -top-16 -left-12 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.32)_0%,rgba(147,197,253,0.22)_40%,transparent_70%)] blur-2xl pointer-events-none animate-ambient-pulse-1"
        />

        {/* Living Ambient Light Orb 2 - Deep blue-indigo luminous counter-orb (bergantian terang & redup) */}
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -right-12 w-52 h-52 sm:w-68 sm:h-68 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.38)_0%,rgba(59,130,246,0.20)_45%,transparent_70%)] blur-2xl pointer-events-none animate-ambient-pulse-2"
        />

        {/* Subtle Ambient Sheen Sweep across the card */}
        <div
          aria-hidden="true"
          className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none animate-sheen-sweep"
        />

        {/* Top-Right Thin Arrow Indicator */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 text-white/80 group-hover:text-white transition-colors duration-200 z-10">
          <ArrowUpRight className="w-5 h-5 stroke-[1.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </div>

        <div className="relative z-10 flex items-center gap-3.5 sm:gap-4 pr-7 sm:pr-8">
          {/* Left Icon: Target White */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 group-hover:bg-white/25 transition-colors duration-200 shadow-xs">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white drop-shadow-xs">
                Atur Penilaian KPI Umum
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed max-w-2xl line-clamp-2 drop-shadow-2xs">
              Kamus &amp; master indikator kinerja baku, bobot evaluasi, dan dasar ukur standar perusahaan.
            </p>
          </div>
        </div>
      </div>

      {/* ================= LIST CARDS / EMPTY STATE ================= */}
      {periods.length === 0 ? (
        <div className="mt-4">
          <InitialEmptyCard
            title="Susun Target Kinerja Tim!"
            description="Buat indikator penilaian KPI untuk memantau produktivitas karyawan."
            buttonText="Buat Target KPI Pertama"
            ButtonIcon={Target}
            onAction={onAddPeriod || (() => {})}
            animationData={emptyKpiAnimation}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {periods.map((period) => {
            // Calculate stats for this period
            const periodResults = results.filter(r => r.periodId === period.id);

            const gradeACount = periodResults.filter(r => r.grade?.toUpperCase() === 'A').length;
            const gradeBCount = periodResults.filter(r => r.grade?.toUpperCase() === 'B').length;
            const gradeCCount = periodResults.filter(r => r.grade?.toUpperCase() === 'C').length;
            const gradeDCount = periodResults.filter(r => r.grade?.toUpperCase() === 'D').length;

            return (
              <div
                key={period.id}
                onClick={() => onSelectPeriod(period)}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/90 shadow-2xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between gap-3 group cursor-pointer relative overflow-hidden"
              >
                {/* 1. Header: Title & Arrow indicator */}
                <div className="flex justify-between items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors truncate tracking-tight">
                    {period.name}
                  </h3>

                  <div className="flex items-center gap-1 shrink-0">
                    {onDeletePeriod && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePeriod(period.id, period.name);
                        }}
                        className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Periode"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="p-1 rounded-lg text-slate-400 group-hover:text-blue-600 transition-colors">
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>

                {/* 2. Periode Range Banner (Gray Background, No Status Indicator) */}
                <div className="rounded-xl px-3.5 py-2.5 border border-slate-200/70 bg-slate-50/90 text-slate-800 flex items-center justify-between text-xs gap-2 transition-colors">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="text-[11px] font-medium text-slate-500">
                      Periode:
                    </span>
                  </div>

                  <div className="flex items-center justify-end flex-1 min-w-0">
                    <span className="font-semibold text-[11px] sm:text-xs truncate text-right text-slate-800">
                      {formatDateRange(period.startDate, period.endDate)}
                    </span>
                  </div>
                </div>

                {/* 3. Dynamic Stats: Grades (A, B, C, D) */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {/* Grade A */}
                  <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-emerald-700">
                      Grade A
                    </span>
                    <span className="font-extrabold text-emerald-800 text-xs sm:text-sm mt-0.5">
                      {gradeACount}
                    </span>
                  </div>

                  {/* Grade B */}
                  <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-blue-700">
                      Grade B
                    </span>
                    <span className="font-extrabold text-blue-800 text-xs sm:text-sm mt-0.5">
                      {gradeBCount}
                    </span>
                  </div>

                  {/* Grade C */}
                  <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-amber-700">
                      Grade C
                    </span>
                    <span className="font-extrabold text-amber-800 text-xs sm:text-sm mt-0.5">
                      {gradeCCount}
                    </span>
                  </div>

                  {/* Grade D */}
                  <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-rose-700">
                      Grade D
                    </span>
                    <span className="font-extrabold text-rose-800 text-xs sm:text-sm mt-0.5">
                      {gradeDCount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
