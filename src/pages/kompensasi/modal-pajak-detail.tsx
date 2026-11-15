import React, { useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import { PayrollRule } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { formatDisplayDate, getRuleIconAndColors, getRuleCategoryGroup } from './utils-helper';

export interface ModalPajakDetailProps {
  isOpen: boolean;
  onClose: () => void;
  rule: PayrollRule | null;
  onEdit?: (rule: PayrollRule) => void;
  onDelete?: (id: string, name: string) => void;
}

export const ModalPajakDetail: React.FC<ModalPajakDetailProps> = ({
  isOpen,
  onClose,
  rule,
  onEdit,
  onDelete,
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!rule) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-xl p-6">
        <div className="text-center py-6 text-slate-500">Memuat data regulasi pajak...</div>
      </Modal>
    );
  }

  const rawVersion = rule.version || '1.0';
  const versionText = rawVersion.toLowerCase().startsWith('v') ? rawVersion.toLowerCase() : `v${rawVersion}`;
  const effectiveDateText = formatDisplayDate(rule.effectiveFrom);
  const { icon: IconComp, bgColor, textColor } = getRuleIconAndColors(rule);
  const { label: groupLabel } = getRuleCategoryGroup(rule);
  const originText = rule.origin || 'PP No. 58/2023 & PMK No. 168/2023';

  const isTER = (rule.name || rule.nama || '').includes('TER') || rule.id.includes('ter') || rule.ruleType === 'Formula';
  const isPasal17 = !isTER || (rule.name || rule.nama || '').includes('Pasal 17') || (rule.name || rule.nama || '').includes('Tahunan');

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-xl p-0 overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-start space-x-3 pr-4 min-w-0">
          <div className="p-1 bg-white border border-slate-100 rounded-xl shrink-0 shadow-xs mt-0.5 w-[38px] h-[38px] flex items-center justify-center">
            <img src="/gambar/logo/logo-djp.webp" alt="Pajak" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {rule.nama || rule.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {groupLabel} • {versionText} • {effectiveDateText}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 shrink-0">
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(rule);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              title="Edit Aturan"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => setIsConfirmingDelete(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Hapus Aturan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal Body */}
      <div className={`p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[60vh] text-xs sm:text-sm text-slate-700 transition-all duration-300 ${isConfirmingDelete ? 'opacity-30 pointer-events-none select-none' : 'opacity-100'}`}>
        {/* Ringkasan & Dasar Regulasi */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Dasar Hukum & Ringkasan</span>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {rule.description || 'Skema pemotongan pajak penghasilan pasal 21 sesuai perundang-undangan perpajakan.'}
          </p>
          <p className="text-[11px] text-slate-500 font-medium pt-1">
            {originText}
          </p>
        </div>

        {/* Informasi Skema TER & Kategori PTKP */}
        {isTER && (
          <div className="border border-slate-200/90 rounded-xl p-3.5 space-y-2.5 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-normal text-slate-800 block">
                Struktur Kategori TER Bulanan
              </span>
              {(rule as any).taxCustomConfig?.taxSchemeType && (
                <span className="text-[11px] text-slate-500 font-normal">
                  Skema: {(rule as any).taxCustomConfig.taxSchemeType === 'gross' ? 'Gross (Potong Gaji)' : (rule as any).taxCustomConfig.taxSchemeType === 'gross_up' ? 'Gross-Up' : 'Nett'}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-800 block">Kategori A</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  {(rule as any).taxCustomConfig?.terCategories?.A
                    ? (rule as any).taxCustomConfig.terCategories.A.join(', ')
                    : 'TK/0, TK/1, K/0'}
                </span>
                {(rule as any).taxCustomConfig?.terBracketsA && (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {(rule as any).taxCustomConfig.terBracketsA.length} Lapisan Tarif
                  </span>
                )}
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-800 block">Kategori B</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  {(rule as any).taxCustomConfig?.terCategories?.B
                    ? (rule as any).taxCustomConfig.terCategories.B.join(', ')
                    : 'TK/2, TK/3, K/1, K/2'}
                </span>
                {(rule as any).taxCustomConfig?.terBracketsB && (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {(rule as any).taxCustomConfig.terBracketsB.length} Lapisan Tarif
                  </span>
                )}
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-800 block">Kategori C</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  {(rule as any).taxCustomConfig?.terCategories?.C
                    ? (rule as any).taxCustomConfig.terCategories.C.join(', ')
                    : 'K/3, K/I/0, K/I/1...'}
                </span>
                {(rule as any).taxCustomConfig?.terBracketsC && (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {(rule as any).taxCustomConfig.terBracketsC.length} Lapisan Tarif
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Informasi Lapisan Tarif Progresif */}
        {isPasal17 && (
          <div className="border border-slate-200/90 rounded-xl p-3.5 space-y-2 bg-white">
            <span className="text-xs font-normal text-slate-800 block">
              Lapisan Tarif Progresif (UU HPP)
            </span>
            <div className="space-y-1.5 text-xs">
              {((rule as any).taxCustomConfig?.pasal17Tiers || [
                { name: 'Lapisan I', minPkp: 0, maxPkp: 60000000, ratePercent: 5 },
                { name: 'Lapisan II', minPkp: 60000000, maxPkp: 250000000, ratePercent: 15 },
                { name: 'Lapisan III', minPkp: 250000000, maxPkp: 500000000, ratePercent: 25 },
                { name: 'Lapisan IV', minPkp: 500000000, maxPkp: 5000000000, ratePercent: 30 },
                { name: 'Lapisan V', minPkp: 5000000000, maxPkp: Infinity, ratePercent: 35 }
              ]).map((t: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-700">
                    {t.name || `Lapisan ${idx + 1}`}: {t.maxPkp === Infinity ? `Diatas Rp ${new Intl.NumberFormat('id-ID').format(t.minPkp)}` : `s/d Rp ${new Intl.NumberFormat('id-ID').format(t.maxPkp)}`}
                  </span>
                  <span className="font-semibold text-blue-600">{t.ratePercent}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Footer */}
      {isConfirmingDelete && (
        <div className="p-4 bg-rose-50 border-t border-rose-100 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 shrink-0">
          <span className="text-xs text-rose-700 font-semibold truncate">Yakin ingin menghapus aturan ini?</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Batalkan
            </button>
            <button
              type="button"
              onClick={() => {
                if (onDelete) {
                  onDelete(rule.id, rule.nama || rule.name);
                }
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              Hapus
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
