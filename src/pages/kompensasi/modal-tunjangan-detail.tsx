import React, { useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import { PayrollRule } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { formatDisplayDate, formatCurrency, getRuleIconAndColors, getRuleCategoryGroup } from './utils-helper';

export interface ModalTunjanganDetailProps {
  isOpen: boolean;
  onClose: () => void;
  rule: PayrollRule | null;
  onEdit?: (rule: PayrollRule) => void;
  onDelete?: (id: string, name: string) => void;
}

export const ModalTunjanganDetail: React.FC<ModalTunjanganDetailProps> = ({
  isOpen,
  onClose,
  rule,
  onEdit,
  onDelete
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!rule) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-xl p-6">
        <div className="text-center py-6 text-slate-500">Memuat data tunjangan...</div>
      </Modal>
    );
  }

  const rawVersion = rule.version || '1.0';
  const versionText = rawVersion.toLowerCase().startsWith('v') ? rawVersion.toLowerCase() : `v${rawVersion}`;
  const effectiveDateText = formatDisplayDate(rule.effectiveFrom);

  const name = rule.nama || rule.name;
  const { icon: IconComp, bgColor, textColor } = getRuleIconAndColors(rule);
  const { label: groupLabel } = getRuleCategoryGroup(rule);

  const displayMetode = rule.metode_perhitungan ? rule.metode_perhitungan.replace(/_/g, ' ') : (rule.ruleType || 'Tetap');
  const displayDasar = rule.dasar_perhitungan ? rule.dasar_perhitungan.replace(/_/g, ' ') : 'Nominal';

  const isTiered = rule.metode_perhitungan === 'berjenjang';
  const isPercent = rule.dasar_perhitungan === 'Gaji Pokok' || rule.dasar_perhitungan === 'gaji_pokok' || rule.metode_perhitungan === 'persentase' || (rule as any).satuan_nilai === 'persen';
  const originText = rule.origin || 'Peraturan Perusahaan / Surat Keputusan';

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-xl p-0 overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-start space-x-3 pr-4 min-w-0">
          <div className={`p-2.5 rounded-xl shrink-0 ${bgColor} ${textColor} shadow-xs mt-0.5`}>
            <IconComp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {name}
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
        {/* Ringkasan & Deskripsi */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Deskripsi & Tujuan</span>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {rule.description || (rule as any).deskripsi || 'Master template komponen tunjangan karyawan.'}
          </p>
          <p className="text-[11px] text-slate-500 font-medium pt-1">
            {originText}
          </p>
        </div>

        {/* Parameter Dasar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Frekuensi Pembayaran</span>
            <span className="text-sm font-bold text-slate-900 capitalize mt-0.5 block">
              {rule.frekuensi_pembayaran || 'Bulanan'}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Metode Perhitungan</span>
            <span className="text-sm font-bold text-slate-900 capitalize mt-0.5 block">
              {displayMetode}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-500 font-medium block">Dasar Perhitungan</span>
            <span className="text-sm font-bold text-slate-900 capitalize mt-0.5 block">
              {displayDasar}
            </span>
          </div>
        </div>

        {/* Nilai Utama / Formula */}
        {!isTiered && rule.nilai !== null && rule.nilai !== undefined && (
          <div className="border border-slate-200/90 rounded-xl p-3.5 bg-slate-50/50 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Nilai Komponen</span>
              <span className="text-[11px] text-slate-500">Nominal acuan pembayaran standar</span>
            </div>
            <span className="text-base sm:text-lg font-extrabold text-blue-600">
              {isPercent ? `${rule.nilai}%` : formatCurrency(rule.nilai)}
            </span>
          </div>
        )}

        {/* Jenjang Berjenjang jika ada */}
        {isTiered && (
          <div className="border border-slate-200/90 rounded-xl p-3.5 space-y-2.5">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Skema Nominal Berjenjang
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {(((rule as any).daftarJenjang || rule.aturan || []) as any[]).map((tier, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-xs">
                  <span className="font-semibold text-slate-800">
                    {tier.label || tier.nama || tier.kategori || tier.level || `Jenjang ${idx + 1}`}
                  </span>
                  <span className="font-bold text-blue-600">
                    {typeof tier.nilai === 'number' ? formatCurrency(tier.nilai) : (tier.nominal ? formatCurrency(tier.nominal) : `${tier.persen || tier.rate || 0}%`)}
                  </span>
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
                  onDelete(rule.id, name);
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
