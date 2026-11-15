import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button, CurrencyInput } from '../../components/ui';
import { ModalPayrollAdjustmentProps } from './types';

export const ModalPayrollAdjustment: React.FC<ModalPayrollAdjustmentProps> = ({
  isOpen,
  onClose,
  record,
  onSave
}) => {
  const [bonus, setBonus] = useState(0);
  const [commission, setCommission] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);
  const [overtime, setOvertime] = useState(0);
  const [lateDeduction, setLateDeduction] = useState(0);
  const [loan, setLoan] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [absenceDeduction, setAbsenceDeduction] = useState(0);
  const [otherDeduction, setOtherDeduction] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record) {
      setBonus(record.bonus || 0);
      setCommission(record.commission || 0);
      setOtherIncome(record.otherIncome || 0);
      setOvertime(record.overtime || 0);
      setLateDeduction(record.lateDeduction || 0);
      setLoan(record.loan || 0);
      setAdvance(record.advance || 0);
      setAbsenceDeduction(record.absenceDeduction || 0);
      setOtherDeduction(record.otherDeduction || 0);
    }
  }, [record]);

  if (!record || !record.employee) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} contentClassName="max-w-2xl">
        <div className="p-6 text-center text-slate-500 text-xs">Memuat data...</div>
      </Modal>
    );
  }

  const employee = record.employee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(record.id, {
        bonus,
        commission,
        otherIncome,
        overtime,
        lateDeduction,
        loan,
        advance,
        absenceDeduction,
        otherDeduction
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan penyesuaian payroll.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="max-w-2xl">
      {/* Header Modal */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-600" />
            Penyesuaian Gaji & Komponen: {employee.fullName}
          </h3>
          <p className="text-xs text-slate-500">Sesuaikan nominal variabel (bonus, lembur, kasbon, denda) untuk periode ini.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Body Form */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
        <div>
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Penyesuaian Tambahan / Penghasilan
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100">
            <CurrencyInput
              label="Uang Lembur (Overtime)"
              value={overtime}
              onChange={e => setOvertime(Number(e.target.value))}
              placeholder="Rp 0"
            />
            <CurrencyInput
              label="Bonus & Insentif"
              value={bonus}
              onChange={e => setBonus(Number(e.target.value))}
              placeholder="Rp 0"
            />
            <CurrencyInput
              label="Komisi Penjualan"
              value={commission}
              onChange={e => setCommission(Number(e.target.value))}
              placeholder="Rp 0"
            />
            <CurrencyInput
              label="Pendapatan Lain-lain"
              value={otherIncome}
              onChange={e => setOtherIncome(Number(e.target.value))}
              placeholder="Rp 0"
            />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Penyesuaian Pemotongan / Denda
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-rose-50/30 p-3.5 rounded-xl border border-rose-100">
            <CurrencyInput
              label="Potongan Absen / Alpa"
              value={absenceDeduction}
              onChange={e => setAbsenceDeduction(Number(e.target.value))}
              placeholder="Rp 0"
            />
            <CurrencyInput
              label="Potongan Keterlambatan"
              value={lateDeduction}
              onChange={e => setLateDeduction(Number(e.target.value))}
              placeholder="Rp 0"
            />
            <CurrencyInput
              label="Cicilan Kasbon / Pinjaman"
              value={loan}
              onChange={e => setLoan(Number(e.target.value))}
              placeholder="Rp 0"
            />
            <CurrencyInput
              label="Potongan Uang Muka (Advance)"
              value={advance}
              onChange={e => setAdvance(Number(e.target.value))}
              placeholder="Rp 0"
            />
            <div className="sm:col-span-2">
              <CurrencyInput
                label="Potongan Lain-lain"
                value={otherDeduction}
                onChange={e => setOtherDeduction(Number(e.target.value))}
                placeholder="Rp 0"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur-xs py-2">
          <Button variant="outline" type="button" onClick={onClose} className="h-9 text-xs">
            Batal
          </Button>
          <Button type="submit" disabled={isSaving} className="h-9 text-xs bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5">
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan & Hitung Ulang'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
