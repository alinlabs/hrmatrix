import React from 'react';
import { X, ShieldCheck, Scale, Clock, Coins, UserCheck, FileText, Pencil, Trash2 } from 'lucide-react';
import { LeaveTypePolicy } from '../../../types';
import { Modal } from '../../../components/ui/Modal';

interface ModalPolicyDetailProps {
  isOpen: boolean;
  onClose: () => void;
  policy: LeaveTypePolicy | null;
  onEdit?: (policy: LeaveTypePolicy) => void;
  onDelete?: (id: string) => void;
}

export function ModalPolicyDetail({
  isOpen,
  onClose,
  policy,
  onEdit,
  onDelete,
}: ModalPolicyDetailProps) {
  const action = policy?.unusedBalanceAction || 'carry_forward';
  const pType = policy?.periodType || '1_year';

  let periodLabel = '1 Tahun Kerja';
  if (pType === 'custom') {
    const unitText = policy?.periodUnit === 'years' ? 'Tahun' : 'Bulan';
    periodLabel = `Periode Khusus (${policy?.periodValue || 1} ${unitText})`;
  } else if (pType === 'entire_tenure') {
    periodLabel = 'Selama Masa Kerja';
  } else if (pType === 'conditional') {
    periodLabel = 'Kondisional';
  }

  const isNoExpiration = pType === 'entire_tenure' || pType === 'conditional';

  return (
    <Modal
      isOpen={isOpen && !!policy}
      onClose={onClose}
      contentClassName="sm:max-w-md"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Detail Kebijakan
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Rincian aturan & konfigurasi jenis cuti
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {onEdit && policy && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(policy);
                }}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                title="Edit Kebijakan"
                aria-label="Edit Kebijakan"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && policy && (
              <button
                type="button"
                onClick={() => {
                  onDelete(policy.id);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Hapus Kebijakan"
                aria-label="Hapus Kebijakan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              title="Tutup"
              aria-label="Tutup"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {policy && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
            {/* Header Info */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{policy.name}</h4>
                  <span className="text-xs font-semibold text-slate-500">({policy.code})</span>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold shrink-0 ml-2 ${
                policy.isPaid ? 'text-emerald-700' : 'text-slate-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${policy.isPaid ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {policy.isPaid ? 'Dibayar (Paid)' : 'Tanpa Gaji'}
              </span>
            </div>

            <div className="space-y-3">
              {/* Kuota Standar */}
              <div className="flex items-start gap-2.5 border-b border-slate-100 pb-2.5">
                <Scale className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500 font-normal">Kuota Standar</div>
                  <div className="font-semibold text-xs text-slate-900 mt-0.5">
                    {policy.periodType === 'conditional'
                      ? 'Kondisional (Diisi saat mengajukan)'
                      : (policy.defaultQuota > 0 ? `${policy.defaultQuota} Hari` : 'Fleksibel / Sesuai Izin')}
                  </div>
                </div>
              </div>

              {/* Masa Berlaku */}
              <div className="flex items-start gap-2.5 border-b border-slate-100 pb-2.5">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500 font-normal">Masa Berlaku Kuota</div>
                  <div className="font-semibold text-xs text-slate-900 mt-0.5">
                    {periodLabel}
                  </div>
                </div>
              </div>

              {/* Sisa Saldo akhir periode */}
              <div className="flex items-start gap-2.5 border-b border-slate-100 pb-2.5">
                <Coins className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500 font-normal">Penanganan Sisa Saldo</div>
                  <div className="font-semibold text-xs text-slate-900 mt-0.5">
                    {isNoExpiration ? (
                      <span className="text-slate-500 font-normal">Tanpa penanganan masa habis</span>
                    ) : (
                      <>
                        {action === 'carry_forward' && 'Bisa akumulasi / carry over ke periode berikutnya'}
                        {action === 'forfeit' && 'Hangus / jatah kembali ke nol'}
                        {action === 'cashout' && 'Konversi sisa saldo ke tunai / di-uangkan'}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Gender Eligibility */}
              <div className="flex items-start gap-2.5 border-b border-slate-100 pb-2.5">
                <UserCheck className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500 font-normal">Persyaratan Gender</div>
                  <div className="font-semibold text-xs text-slate-900 mt-0.5">
                    {policy.genderEligibility === 'Female' ? 'Khusus Karyawan Wanita' : 
                     policy.genderEligibility === 'Male' ? 'Khusus Karyawan Pria' : 'Berlaku untuk Semua Karyawan'}
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500 font-normal">Keterangan / Regulasi Tambahan</div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed whitespace-pre-line font-normal">
                    {policy.description || 'Tidak ada keterangan khusus atau regulasi tambahan.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer: Single Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}
