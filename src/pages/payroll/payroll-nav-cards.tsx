import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Tag, ShieldCheck, Calculator, ArrowUpRight } from 'lucide-react';
import { db } from '../../db/database';
import { DEFAULT_PAYROLL_RULES } from '../../data/master';

export const PayrollNavCards: React.FC = () => {
  const navigate = useNavigate();

  // Query rules from IndexedDB with fallback to DEFAULT_PAYROLL_RULES
  const rawRules = useLiveQuery(() => db.payrollRules.toArray()) || [];
  const rules = rawRules.length > 0 ? rawRules : DEFAULT_PAYROLL_RULES;

  const tunjanganCount = rules.filter(r => r.category === 'Allowance' || r.category === 'Deduction').length;
  const bpjsCount = rules.filter(r => r.category === 'BPJS Health' || r.category === 'BPJS Employment').length;
  const pajakCount = rules.filter(r => r.category === 'Tax').length;

  const cards = [
    {
      id: 'tunjangan',
      title: 'Tunjangan',
      subtitle: 'Aturan tunjangan tetap, variabel & bonus',
      countLabel: `${tunjanganCount} Aturan Aktif`,
      path: '/payroll/tunjangan',
      icon: Tag,
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100/80',
      badgeBg: 'bg-white text-blue-700 border-slate-200 font-semibold',
    },
    {
      id: 'bpjs',
      title: 'BPJS',
      subtitle: 'Regulasi iuran BPJS Kes & Ketenagakerjaan',
      countLabel: `${bpjsCount} Program Iuran`,
      path: '/payroll/bpjs',
      icon: ShieldCheck,
      iconBg: 'bg-teal-50 text-teal-600 border border-teal-100/80',
      badgeBg: 'bg-white text-teal-700 border-slate-200 font-semibold',
    },
    {
      id: 'pajak',
      title: 'Pajak',
      subtitle: 'Regulasi tarif PPh 21, TER & PTKP',
      countLabel: `${pajakCount} Skema Pajak`,
      path: '/payroll/pajak',
      icon: Calculator,
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100/80',
      badgeBg: 'bg-white text-indigo-700 border-slate-200 font-semibold',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => navigate(card.path)}
            className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between gap-3 group cursor-pointer relative overflow-hidden"
          >
            {/* Header: Icon, Title & Top-Right Arrow */}
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${card.iconBg}`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors truncate tracking-tight">
                    {card.title}
                  </h3>
                </div>
              </div>

              <div className="p-1 rounded-lg text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Subtitle / Description */}
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {card.subtitle}
            </p>

            {/* Bottom Info Bar: Count & Status in Clean White Box */}
            <div className="bg-white rounded-xl px-3 py-2 border border-slate-100/90 shadow-3xs flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-slate-500">
                Konfigurasi
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-md border ${card.badgeBg}`}>
                {card.countLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
