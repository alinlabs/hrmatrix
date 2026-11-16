import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface TooltipEntryItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntryItem[];
  label?: string;
  valueFormatter?: (value: number, item: TooltipEntryItem) => string;
}

export function DashboardChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl px-3 py-2.5 shadow-md text-xs min-w-[160px]">
      {label && (
        <div className="font-semibold text-slate-900 pb-1.5 mb-1.5 border-b border-slate-100">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, idx) => {
          const numVal = typeof entry.value === 'number' ? entry.value : Number(entry.value || 0);
          const display = valueFormatter ? valueFormatter(numVal, entry) : String(entry.value ?? 0);
          return (
            <div key={`${entry.name || idx}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color || '#2563EB' }}
                  aria-hidden="true"
                />
                <span className="text-slate-600 truncate">{entry.name}</span>
              </div>
              <span className="font-semibold font-mono tabular-nums text-slate-900 shrink-0">
                {display}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface EmptyChartStateProps {
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
}

export function EmptyChartState({
  title,
  description,
  actionLabel,
  actionTo,
}: EmptyChartStateProps) {
  return (
    <div className="h-full min-h-[210px] flex flex-col items-center justify-center text-center px-4 py-6 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
      <p className="text-xs sm:text-sm font-semibold text-slate-800">{title}</p>
      <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">{description}</p>
      <Link
        to={actionTo}
        className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
      >
        <span>{actionLabel}</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
