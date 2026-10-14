import React from 'react';
import { UserCheck, Shield, Tag, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { PROMO_COMPARISON_ROWS } from './utils-helper';

interface PromoComparisonTableProps {
  isModal?: boolean;
}

export function PromoComparisonTable({ isModal = false }: PromoComparisonTableProps) {
  return (
    <div className={cn("bg-white space-y-6", isModal ? "p-0" : "rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs")}>
      {!isModal && (
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900">Perbandingan Model Lisensi & Layanan Agent</h2>
          <p className="text-xs text-slate-500">
            Pilih antara mengoperasikan software secara mandiri (SaaS/White Label) atau menyerahkan seluruh operasional HR & GA kepada Dedicated Agent Hybrid kami.
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75">
              <th className="py-3.5 px-4 font-bold text-slate-700 w-1/5">Karakteristik & Fasilitas</th>
              <th className="py-3.5 px-4 font-bold text-amber-700 w-1/5">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Uji Coba (Pilot 3 Bulan)</span>
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-blue-700 w-1/5">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Sewa Cloud Tahunan (SaaS)</span>
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-indigo-800 w-1/5">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>White Label (Source Code)</span>
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-emerald-800 w-1/5 bg-emerald-50/60 border-l border-emerald-100">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dedicated Agent (HR & GA Hybrid)</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PROMO_COMPARISON_ROWS.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-800">{row.feature}</td>
                <td className="py-3 px-4 text-slate-700">{row.trial}</td>
                <td className="py-3 px-4 text-slate-700">{row.annual}</td>
                <td className="py-3 px-4 text-slate-700">{row.whitelabel}</td>
                <td className={cn(
                  "py-3 px-4 border-l border-emerald-100",
                  row.agentHighlight 
                    ? "font-extrabold text-emerald-900 bg-emerald-50/40" 
                    : "text-slate-800 font-medium bg-emerald-50/20"
                )}>
                  {row.agent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PromoComparisonTable;
