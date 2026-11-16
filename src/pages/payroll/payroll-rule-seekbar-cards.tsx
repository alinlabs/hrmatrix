import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { DEFAULT_PAYROLL_RULES } from '../../data/master';
import { CheckCircle2, XCircle, ShieldCheck, Layers } from 'lucide-react';

interface PayrollRuleSeekbarCardsProps {
  disabledRuleIds: string[];
  onToggleRule: (ruleId: string, isNowDisabled: boolean) => Promise<void>;
  onToggleAllRules: (ruleIds: string[], isNowDisabled: boolean) => Promise<void>;
}

export const PayrollRuleSeekbarCards: React.FC<PayrollRuleSeekbarCardsProps> = ({
  disabledRuleIds = [],
  onToggleRule,
  onToggleAllRules,
}) => {
  const dbRules = useLiveQuery(() => db.payrollRules.toArray()) || [];
  const rules = dbRules.length > 0 ? dbRules : DEFAULT_PAYROLL_RULES;

  const disabledSet = new Set(disabledRuleIds || []);
  const allIds = rules.map((r) => r.id);
  const activeCount = rules.filter((r) => !disabledSet.has(r.id)).length;
  const allEnabled = activeCount === rules.length && rules.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong className="text-slate-900">{activeCount}</strong> dari{' '}
            <strong className="text-slate-900">{rules.length}</strong> aturan komponen aktif
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleAllRules(allIds, false)}
            disabled={allEnabled}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-45 cursor-pointer transition-colors"
          >
            Aktifkan Semua
          </button>
          <button
            type="button"
            onClick={() => onToggleAllRules(allIds, true)}
            disabled={activeCount === 0}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-45 cursor-pointer transition-colors"
          >
            Nonaktifkan Semua
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {rules.map((rule) => {
          const isEnabled = !disabledSet.has(rule.id);
          return (
            <button
              key={rule.id}
              type="button"
              onClick={() => onToggleRule(rule.id, isEnabled)}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isEnabled
                  ? 'bg-white border-blue-200 hover:border-blue-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 opacity-75 hover:opacity-95'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {rule.nama || rule.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {rule.kategori || rule.category} • {rule.origin || 'Standar'}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isEnabled ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <XCircle className="w-4 h-4" />
                    Off
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
