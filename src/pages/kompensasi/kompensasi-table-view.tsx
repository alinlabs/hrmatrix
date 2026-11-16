import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { PayrollRule } from '../../types';
import { KompensasiTableViewProps } from './types';
import { 
  formatDisplayDate, 
  formatRuleValue, 
  getRuleCategoryGroup, 
  getRuleIconAndColors 
} from './utils-helper';

export const KompensasiTableView: React.FC<KompensasiTableViewProps> = ({
  rules,
  viewMode,
  onOpenDetail,
  onEdit,
  onDelete
}) => {
  if (viewMode !== 'table') return null;

  if (rules.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-2xs">
        <p className="text-sm font-semibold text-slate-700">Tidak ada aturan yang cocok</p>
        <p className="text-xs text-slate-400 mt-1">Belum ada data yang memenuhi kriteria filter.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Nama Aturan</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Frekuensi & Metode</th>
              <th className="py-3 px-4">Nilai / Formula</th>
              <th className="py-3 px-4">Dasar Hukum</th>
              <th className="py-3 px-4">Versi</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {rules.map(rule => {
              const { icon: IconComp, bgColor, textColor } = getRuleIconAndColors(rule);
              const { label: groupLabel, badgeColor, type: groupType } = getRuleCategoryGroup(rule);
              const formattedValue = formatRuleValue(rule);
              const rawVersion = rule.version || '1.0';
              const versionText = rawVersion.toLowerCase().startsWith('v') ? rawVersion.toLowerCase() : `v${rawVersion}`;

              return (
                <tr 
                  key={rule.id}
                  onClick={() => onOpenDetail(rule)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-0.5 rounded-lg shrink-0 bg-white border border-slate-100 w-7 h-7 flex items-center justify-center">
                        {groupType === 'bpjs_kesehatan' ? (
                          <img src="/gambar/logo/logo-bpjs-kesehatan.webp" alt="BPJS Kesehatan" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                        ) : groupType === 'bpjs_ketenagakerjaan' ? (
                          <img src="/gambar/logo/logo-bpjs-ketenagakerjaan.webp" alt="BPJS Ketenagakerjaan" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                        ) : groupType === 'pajak' ? (
                          <img src="/gambar/logo/logo-djp.webp" alt="Pajak" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                        ) : (
                          <div className={`p-1 rounded-md ${bgColor} ${textColor} flex items-center justify-center`}>
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <span className="group-hover:text-blue-600 transition-colors">{rule.nama || rule.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                      {groupLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    <span className="capitalize">{rule.frekuensi_pembayaran || 'Bulanan'}</span> • <span className="capitalize">{rule.metode_perhitungan?.replace(/_/g, ' ') || 'Nominal'}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formattedValue}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate" title={rule.origin || '-'}>
                    {rule.origin || '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-medium">
                    {versionText}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onOpenDetail(rule)}
                        title="Lihat Detail"
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(rule)}
                        title="Edit Aturan"
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(rule.id, rule.nama || rule.name)}
                        title="Hapus Aturan"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
