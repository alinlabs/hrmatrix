import React from 'react';
import { Plus } from 'lucide-react';
import { PayrollRule } from '../../types';
import { CardKompensasiItem } from './card-kompensasi-item';
import { KompensasiCardViewProps } from './types';
import { getRuleCategoryGroup } from './utils-helper';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyCompensationAnimation from '../../assets/animations/empty-compensation.json';

export const KompensasiCardView: React.FC<KompensasiCardViewProps> = ({
  rules,
  activeTab,
  viewMode,
  searchQuery,
  onOpenDetail,
  onEdit,
  onDelete,
  onAddRule
}) => {
  if (viewMode !== 'card') return null;

  if (rules.length === 0) {
    if (searchQuery) {
      return (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-2xs">
          <p className="text-sm font-semibold text-slate-700">Tidak ada aturan yang cocok</p>
          <p className="text-xs text-slate-400 mt-1">
            Tidak ditemukan aturan dengan kata kunci "{searchQuery}"
          </p>
        </div>
      );
    }

    return (
      <InitialEmptyCard
        title="Atur Kompensasi & Tunjangan Tim!"
        description="Tentukan paket tunjangan tetap, bonus insentif, atau jaminan sosial untuk karyawan Anda."
        buttonText="Tambah Kompensasi Pertama"
        ButtonIcon={Plus}
        onAction={onAddRule || (() => {})}
        animationData={emptyCompensationAnimation}
      />
    );
  }

  // Segregate rules if Tunjangan or Jaminan tab
  if (activeTab === 'tunjangan') {
    const tetap = rules.filter(r => getRuleCategoryGroup(r).type === 'tunjangan_tetap');
    const tidakTetap = rules.filter(r => getRuleCategoryGroup(r).type === 'tunjangan_tidak_tetap');
    const bonus = rules.filter(r => getRuleCategoryGroup(r).type === 'bonus_insentif');
    const lainnya = rules.filter(r => {
      const t = getRuleCategoryGroup(r).type;
      return t !== 'tunjangan_tetap' && t !== 'tunjangan_tidak_tetap' && t !== 'bonus_insentif';
    });

    return (
      <div className="space-y-6">
        {tetap.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                Tunjangan Tetap
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {tetap.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {tetap.map(rule => (
                <CardKompensasiItem
                  key={rule.id}
                  rule={rule}
                  onOpenDetail={onOpenDetail}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}

        {tidakTetap.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                Tunjangan Tidak Tetap
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {tidakTetap.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {tidakTetap.map(rule => (
                <CardKompensasiItem
                  key={rule.id}
                  rule={rule}
                  onOpenDetail={onOpenDetail}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}

        {bonus.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                Bonus & Insentif Kinerja
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {bonus.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {bonus.map(rule => (
                <CardKompensasiItem
                  key={rule.id}
                  rule={rule}
                  onOpenDetail={onOpenDetail}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}

        {lainnya.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                Tunjangan & Kompensasi Lainnya
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {lainnya.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {lainnya.map(rule => (
                <CardKompensasiItem
                  key={rule.id}
                  rule={rule}
                  onOpenDetail={onOpenDetail}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'jaminan') {
    const bpjsKes = rules.filter(r => getRuleCategoryGroup(r).type === 'bpjs_kesehatan');
    const bpjsTK = rules.filter(r => getRuleCategoryGroup(r).type === 'bpjs_ketenagakerjaan');
    const bpjsLainnya = rules.filter(r => {
      const t = getRuleCategoryGroup(r).type;
      return t !== 'bpjs_kesehatan' && t !== 'bpjs_ketenagakerjaan';
    });

    return (
      <div className="space-y-6">
        {bpjsKes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                BPJS Kesehatan
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {bpjsKes.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {bpjsKes.map(rule => (
                <CardKompensasiItem
                  key={rule.id}
                  rule={rule}
                  onOpenDetail={onOpenDetail}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}

        {bpjsTK.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                BPJS Ketenagakerjaan
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {bpjsTK.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {bpjsTK.map(rule => (
                <CardKompensasiItem
                  key={rule.id}
                  rule={rule}
                  onOpenDetail={onOpenDetail}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}

        {bpjsLainnya.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                Jaminan Sosial Lainnya
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {bpjsLainnya.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {bpjsLainnya.map(rule => (
                <CardKompensasiItem
                  key={rule.id}
                  rule={rule}
                  onOpenDetail={onOpenDetail}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // General single grid for Pajak or Semua
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {rules.map(rule => (
        <CardKompensasiItem
          key={rule.id}
          rule={rule}
          onOpenDetail={onOpenDetail}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
