import React, { useState } from 'react';
import { Pencil, Trash2, X, AlertCircle } from 'lucide-react';
import { PayrollRule } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { formatDisplayDate, formatCurrency, getRuleIconAndColors, getRuleCategoryGroup } from './utils-helper';

export interface ModalBpjsDetailProps {
  isOpen: boolean;
  onClose: () => void;
  rule: PayrollRule | null;
  onEdit?: (rule: PayrollRule) => void;
  onDelete?: (id: string, name: string) => void;
}

export const ModalBpjsDetail: React.FC<ModalBpjsDetailProps> = ({
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
        <div className="text-center py-6 text-slate-500">Memuat data jaminan sosial...</div>
      </Modal>
    );
  }

  const rawVersion = rule.version || '1.0';
  const versionText = rawVersion.toLowerCase().startsWith('v') ? rawVersion.toLowerCase() : `v${rawVersion}`;
  const effectiveDateText = formatDisplayDate(rule.effectiveFrom);
  const { icon: IconComp, bgColor, textColor } = getRuleIconAndColors(rule);
  const { label: groupLabel, type: groupType } = getRuleCategoryGroup(rule);
  const originText = rule.origin || 'Undang-Undang / Peraturan Pemerintah';

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="sm:max-w-xl p-0 overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-start space-x-3 pr-4 min-w-0">
          <div className="p-1 bg-white border border-slate-100 rounded-xl shrink-0 shadow-xs mt-0.5 w-[38px] h-[38px] flex items-center justify-center">
            {groupType === 'bpjs_kesehatan' ? (
              <img src="/gambar/logo/logo-bpjs-kesehatan.webp" alt="BPJS Kesehatan" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
            ) : (
              <img src="/gambar/logo/logo-bpjs-ketenagakerjaan.webp" alt="BPJS Ketenagakerjaan" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
            )}
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
        {/* Ringkasan Deskripsi */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Dasar Hukum & Ringkasan</span>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {rule.description || 'Program jaminan sosial nasional berbasis regulasi pemerintah.'}
          </p>
          <p className="text-[11px] text-slate-500 font-medium pt-1">
            {originText}
          </p>
        </div>

        {/* Struktur Iuran Pokok */}
        <div className="border border-slate-200/90 rounded-xl p-3.5 space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            Struktur Persentase Iuran
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block">Tanggungan Karyawan</span>
              <span className="text-base font-extrabold text-blue-600 mt-0.5 block">
                {rule.employeeShare ?? 0}%
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium block">Tanggungan Perusahaan</span>
              <span className="text-base font-extrabold text-slate-800 mt-0.5 block">
                {rule.employerShare ?? 0}%
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 font-medium block">Total Iuran Gabungan</span>
              <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                {((rule.employeeShare || 0) + (rule.employerShare || 0)).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Batasan Upah (Cap) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="border border-slate-200/90 rounded-xl p-3 bg-slate-50/40">
            <span className="text-[11px] text-slate-500 font-medium block">Batas Upah Minimum (Floor)</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {rule.minimumBase ? formatCurrency(rule.minimumBase) : 'Mengikuti UMK / UMP'}
            </span>
          </div>
          <div className="border border-slate-200/90 rounded-xl p-3 bg-slate-50/40">
            <span className="text-[11px] text-slate-500 font-medium block">Batas Upah Maksimum (Cap)</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {rule.maximumBase ? formatCurrency(rule.maximumBase) : 'Tidak Dibatasi (No Cap)'}
            </span>
          </div>
        </div>

        {/* Multi-Tier Tingkat Risiko (Jika JKK atau Berjenjang) */}
        {rule.isMultiTier && rule.tiers && rule.tiers.length > 0 && (
          <div className="border border-slate-200/90 rounded-xl p-3.5 space-y-2.5">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Tingkat Risiko & Klasifikasi Iuran
            </span>
            <div className="space-y-1.5">
              {rule.tiers.map((t, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-xs">
                  <span className="font-semibold text-slate-800">{t.name}</span>
                  <span className="font-bold text-blue-600">{t.rate}%</span>
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
