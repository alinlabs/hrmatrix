import React from 'react';
import { Plus, Calculator, Search, CreditCard } from 'lucide-react';
import { CardPeriodItem } from './card-period-item';
import { PayrollCardViewProps } from './types';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyPayrollAnimation from '../../assets/animations/empty-payroll.json';

export const PayrollCardView: React.FC<PayrollCardViewProps> = ({
  periods,
  filteredPeriods,
  statsByPeriod,
  search,
  onResetSearch,
  onOpenCreateModal,
  onSelectPeriod
}) => {
  if (periods === undefined) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (periods.length === 0) {
    return (
      <div className="mt-4">
        <InitialEmptyCard
          title="Siapkan Penggajian Perdana Tim!"
          description="Proses gaji bulanan dan buat slip otomatis secara rapi dan akurat."
          buttonText="Buat Penggajian Pertama"
          ButtonIcon={CreditCard}
          onAction={onOpenCreateModal}
          animationData={emptyPayrollAnimation}
        />
      </div>
    );
  }

  if (filteredPeriods.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 text-sm sm:text-base">Tidak Ada Periode yang Sesuai</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
          Tidak ditemukan periode payroll dengan filter atau kata kunci "{search}".
        </p>
        <button
          type="button"
          onClick={onResetSearch}
          className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
        >
          Reset Filter & Pencarian
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
      {filteredPeriods.map(p => (
        <CardPeriodItem
          key={p.id}
          period={p}
          stat={statsByPeriod.get(p.id)}
          onClick={() => onSelectPeriod(p.id)}
        />
      ))}
    </div>
  );
};
