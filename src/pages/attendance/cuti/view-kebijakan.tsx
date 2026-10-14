import React from 'react';
import { Plus, Edit, Trash2, ShieldCheck } from 'lucide-react';
import { LeaveTypePolicy } from '../../../types';
import { PageHeaderTitle, DesktopHeaderActions, MobileHeaderActions } from '../../../context/MobileNavContext';
import { CutiDualNav } from './cuti-dual-nav';

interface ViewKebijakanProps {
  leavePolicies: LeaveTypePolicy[];
  onSelectSubTab: (tab: 'pengajuan' | 'kuota' | 'kebijakan') => void;
  setIsPolicyModalOpen: (val: boolean) => void;
  setEditingPolicy: (policy: LeaveTypePolicy | null) => void;
  setSelectedPolicyDetail: (policy: LeaveTypePolicy | null) => void;
  handleDeletePolicy: (id: string) => Promise<void>;
}

export function ViewKebijakan({
  leavePolicies,
  onSelectSubTab,
  setIsPolicyModalOpen,
  setEditingPolicy,
  setSelectedPolicyDetail,
  handleDeletePolicy
}: ViewKebijakanProps) {
  return (
    <div className="space-y-3.5">
      <PageHeaderTitle 
        title="Kebijakan Cuti" 
        subtitle="Master Jenis & Regulasi Cuti" 
      />

      {/* Standard Header Actions */}
      <DesktopHeaderActions>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setEditingPolicy(null);
              setIsPolicyModalOpen(true);
            }}
            title="Tambah Kebijakan Baru"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xs shrink-0 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </DesktopHeaderActions>

      <MobileHeaderActions>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setEditingPolicy(null);
              setIsPolicyModalOpen(true);
            }}
            title="Tambah Kebijakan Baru"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xs shrink-0 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </MobileHeaderActions>

      {/* 2 Tab Tombol Navigasi Sub-Cuti: Pengajuan Cuti | Saldo Cuti */}
      <CutiDualNav activeSubTab="kebijakan" onSelectSubTab={onSelectSubTab} />

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3 shadow-2xs">
        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-900">Kebijakan Master Jenis Cuti & Regulasi Perusahaan</h4>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Kelola master jenis cuti beserta jatah saldo kuota standar. Tambahkan kebijakan baru atau sesuaikan aturan yang berlaku di perusahaan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {leavePolicies.map((policy) => {
          const action = policy.unusedBalanceAction || 'carry_forward';
          const pType = policy.periodType || '1_year';
          let periodLabel = '1 Tahun Kerja';
          if (pType === 'custom') {
            const unitText = policy.periodUnit === 'years' ? 'Tahun' : 'Bulan';
            periodLabel = `Periode Khusus (${policy.periodValue || 1} ${unitText})`;
          } else if (pType === 'entire_tenure') {
            periodLabel = 'Selama Masa Kerja';
          } else if (pType === 'conditional') {
            periodLabel = 'Kondisional';
          }

          const isNoExpiration = pType === 'entire_tenure' || pType === 'conditional';
          let actionLabel = 'Bisa Carry Over';
          if (isNoExpiration) {
            actionLabel = 'Tanpa Penanganan Sisa Saldo';
          } else if (action === 'forfeit') {
            actionLabel = 'Hangus Akhir Periode';
          } else if (action === 'cashout') {
            actionLabel = 'Terkonversi Pembayaran';
          }

          const genderLabel = policy.genderEligibility && policy.genderEligibility !== 'All' 
             ? (policy.genderEligibility === 'Female' ? 'Khusus Wanita' : 'Khusus Pria') 
             : null;

          return (
            <div 
              key={policy.id} 
              onClick={() => setSelectedPolicyDetail(policy)}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-4 shadow-2xs flex flex-col justify-between transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        {policy.name}
                      </h4>
                      <span className="text-xs font-semibold text-slate-400">
                        ({policy.code})
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      policy.isPaid ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        policy.isPaid ? 'bg-emerald-500' : 'bg-slate-400'
                      }`} />
                      {policy.isPaid ? 'Dibayar (Paid)' : 'Tanpa Gaji'}
                    </span>
                  </div>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 flex-wrap">
                  <span>{periodLabel}</span>
                  <span>•</span>
                  <span>{actionLabel}</span>
                  {genderLabel && (
                    <>
                      <span>•</span>
                      <span className="text-amber-700 font-semibold">{genderLabel}</span>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
                  {policy.description || 'Tidak ada keterangan khusus.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Kuota Standar: </span>
                  <span className="font-bold text-slate-900">
                    {policy.periodType === 'conditional'
                      ? 'Kondisional (-)'
                      : (policy.defaultQuota > 0 ? `${policy.defaultQuota} Hari` : 'Fleksibel / Sesuai Izin')}
                  </span>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPolicy(policy);
                      setIsPolicyModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                    title="Edit Kebijakan"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDeletePolicy(policy.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="Hapus Kebijakan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
