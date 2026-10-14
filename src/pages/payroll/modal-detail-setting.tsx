import React, { useState, useEffect } from 'react';
import { Settings, X, Sliders, RefreshCw } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { ModalDetailSettingProps } from './types';
import { PayrollRuleSeekbarCards } from '../../components/payroll/PayrollRuleSeekbarCards';

export const ModalDetailSetting: React.FC<ModalDetailSettingProps> = ({
  isOpen,
  onClose,
  period,
  onSaveCutOff,
  onToggleRule,
  onToggleAllRules
}) => {
  const periodName = period.name || `Payroll ${period.month} ${period.year}`;
  const startDate = period.startDate;
  const endDate = period.endDate;

  const [editPeriodName, setEditPeriodName] = useState(periodName);
  const [editStartDate, setEditStartDate] = useState(startDate);
  const [editEndDate, setEditEndDate] = useState(endDate);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if period props change
  useEffect(() => {
    setEditPeriodName(periodName);
    setEditStartDate(startDate);
    setEditEndDate(endDate);
  }, [periodName, startDate, endDate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStartDate || !editEndDate) {
      alert('Rentang tanggal mulai dan selesai harus diisi.');
      return;
    }
    if (editStartDate > editEndDate) {
      alert('Tanggal mulai tidak boleh melebihi tanggal selesai.');
      return;
    }
    setIsSaving(true);
    try {
      await onSaveCutOff(editStartDate, editEndDate, editPeriodName);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan perubahan pengaturan payroll.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="max-w-3xl">
      <form onSubmit={handleSave} className="flex flex-col max-h-[85vh]">
        {/* Header Modal */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Pengaturan Periode &amp; Komponen Payroll</h3>
              <p className="text-xs text-slate-500">{editPeriodName || periodName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Top Section: Input Nama Periode & 2 Card Tanggal */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-normal text-slate-500 block mb-1">
                Nama Periode Penggajian
              </label>
              <input
                type="text"
                value={editPeriodName}
                onChange={(e) => setEditPeriodName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
                placeholder="Payroll September 2026"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Tanggal Mulai */}
              <div>
                <label className="text-xs font-normal text-slate-500 block mb-1">
                  Tanggal Mulai
                </label>
                <div className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between">
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer"
                    required
                  />
                </div>
              </div>

              {/* Tanggal Selesai */}
              <div>
                <label className="text-xs font-normal text-slate-500 block mb-1">
                  Tanggal Selesai
                </label>
                <div className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between">
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section: Komponen Gaji Seekbar Cards */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-normal text-slate-500 mb-2">
              Komponen Kompensasi
            </div>
            <PayrollRuleSeekbarCards 
              disabledRuleIds={period.disabledRuleIds || []}
              onToggleRule={onToggleRule}
              onToggleAllRules={onToggleAllRules}
            />
          </div>
        </div>

        {/* Footer: Bottom full-width button */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Menghitung & Menyinkronkan...' : 'Hitung Ulang & Sinkronisasi'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

