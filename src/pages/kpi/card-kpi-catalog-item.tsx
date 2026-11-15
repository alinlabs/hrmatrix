import React from 'react';
import { Edit2 } from 'lucide-react';
import { CardKPICatalogItemProps } from './types';

export function CardKPICatalogItem({ template: tpl, onEdit }: CardKPICatalogItemProps) {
  const minScoreVal = tpl.minimumScore !== undefined ? tpl.minimumScore : (tpl.targetDefault || 75);
  const dasarUkurVal = tpl.measurementBase || 'Penilaian Supervisi & Kinerja';

  return (
    <div
      key={tpl.id}
      className="bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-xs rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-2xs flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
            {tpl.name}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-normal mt-1">
            {tpl.description || 'Tidak ada deskripsi rinci.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(tpl)}
          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer shrink-0 -mt-0.5 -mr-1"
          title="Edit Indikator"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Metadata: 2 Card Kanan-Kiri & 1 Card Dasar Ukur (All Centered) */}
      <div className="pt-3.5 mt-3.5 border-t border-slate-100 space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          {/* Minimum Skor (Angka saja) */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium block mb-0.5">
              Minimum Skor
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 block">
              {minScoreVal}
            </span>
          </div>

          {/* Bobot KPI */}
          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-center">
            <span className="text-[11px] text-blue-600 font-medium block mb-0.5">
              Bobot KPI
            </span>
            <span className="text-xs sm:text-sm font-bold text-blue-700 block">
              {tpl.weight ?? 0}%
            </span>
          </div>
        </div>

        {/* Dasar Ukur */}
        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-center">
          <span className="text-[11px] text-slate-500 font-medium block mb-0.5">
            Dasar Ukur
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
            {dasarUkurVal}
          </span>
        </div>
      </div>
    </div>
  );
}
