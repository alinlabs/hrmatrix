import React from 'react';
import { Briefcase } from 'lucide-react';
import { IndexJobTemplate } from './types';
import { getLevelBadgeStyle } from './utils-helper';

interface KatalogCardItemProps {
  template: IndexJobTemplate;
  onSelect: (template: IndexJobTemplate) => void;
  disabled?: boolean;
}

export const KatalogCardItem: React.FC<KatalogCardItemProps> = ({
  template,
  onSelect,
  disabled = false,
}) => {
  return (
    <button
      onClick={() => onSelect(template)}
      disabled={disabled}
      className="bg-white rounded-xl shadow-2xs border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all duration-150 flex flex-col justify-between group text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-70 disabled:cursor-wait cursor-pointer p-4 h-full"
    >
      <div className="w-full space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors duration-150 mt-0.5">
              <Briefcase className="w-4.5 h-4.5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                {template.nama}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                {template.departemen}
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${getLevelBadgeStyle(
              template.level
            )}`}
          >
            {template.level}
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
          {template.tujuanJabatan}
        </p>
      </div>
    </button>
  );
};


