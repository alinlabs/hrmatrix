import React, { useState, useEffect } from 'react';
import { CalendarCheck, X } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button, Input } from '../../../components/ui';
import { AbsenceDeductionType } from '../../../types';
import { LocalAbsenceReasonConfig } from './modal-pengaturan';

// Helper format ribuan
const formatRibuan = (val: number | string): string => {
  if (val === undefined || val === null || val === '') return '';
  const cleanStr = String(val).replace(/\D/g, '');
  if (!cleanStr) return '';
  return parseInt(cleanStr, 10).toLocaleString('id-ID');
};

const parseRibuan = (str: string): number => {
  const clean = str.replace(/\D/g, '');
  return clean ? parseInt(clean, 10) : 0;
};

interface ModalJenisKetidakhadiranProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LocalAbsenceReasonConfig) => void;
  initialData?: LocalAbsenceReasonConfig | null;
}

export function ModalJenisKetidakhadiran({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ModalJenisKetidakhadiranProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deductionEnabled, setDeductionEnabled] = useState(false);
  const [deductionType, setDeductionType] = useState<AbsenceDeductionType>('full_day');
  const [deductionNominal, setDeductionNominal] = useState(50000);
  const [deductionPercentage, setDeductionPercentage] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inisialisasi state saat modal dibuka (sesuai SPEC_MODAL.md)
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setDescription(initialData.description || '');
        setDeductionEnabled(initialData.deductionEnabled ?? false);
        setDeductionType(initialData.deductionType || 'full_day');
        setDeductionNominal(initialData.deductionNominal ?? 50000);
        setDeductionPercentage(initialData.deductionPercentage ?? 50);
      } else {
        setName('');
        setDescription('');
        setDeductionEnabled(false);
        setDeductionType('full_day');
        setDeductionNominal(50000);
        setDeductionPercentage(50);
      }
      setIsSubmitting(false);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: LocalAbsenceReasonConfig = {
        id: initialData ? initialData.id : `custom-${Date.now()}`,
        name: name.trim(),
        description: description.trim() || `Alasan ketidakhadiran: ${name.trim()}`,
        deductionEnabled,
        deductionType,
        deductionNominal,
        deductionPercentage,
      };
      onSave(payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
        {/* 1. Modal Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                {initialData ? 'Edit Jenis Ketidakhadiran' : 'Tambah Jenis Ketidakhadiran'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Konfigurasi alasan absen & skema potongan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs min-h-0">
          {/* Nama Jenis */}
          <div className="w-full">
            <label className="text-[11px] font-medium text-slate-600 block mb-1">
              Nama Jenis Ketidakhadiran <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              placeholder="Contoh: Izin Keperluan Pribadi, Dispensasi Khusus"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base sm:text-sm bg-white h-9 sm:h-10 rounded-xl border-slate-300 focus-visible:ring-blue-500/20"
            />
          </div>

          {/* Deskripsi */}
          <div className="w-full">
            <label className="text-[11px] font-medium text-slate-600 block mb-1">
              Keterangan / Deskripsi
            </label>
            <Input
              placeholder="Deskripsi singkat ketidakhadiran..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-base sm:text-sm bg-white h-9 sm:h-10 rounded-xl border-slate-300 focus-visible:ring-blue-500/20"
            />
          </div>

          {/* Section Potongan Ketidakhadiran */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 block">
                  Aktifkan Potongan Ketidakhadiran
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Terapkan pemotongan upah pada kalkulasi payroll
                </span>
              </div>
              <label className="flex items-center cursor-pointer gap-2 shrink-0">
                <div className={`relative w-9 h-5 transition-colors rounded-full ${deductionEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={deductionEnabled}
                    onChange={() => setDeductionEnabled(!deductionEnabled)}
                  />
                  <div className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform ${deductionEnabled ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>

            {deductionEnabled && (
              <div className="pt-2 animate-in fade-in duration-150">
                <div className={`grid gap-2.5 items-center ${deductionType === 'full_day' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {/* Dropdown Skema */}
                  <div className="w-full">
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Metode Potongan
                    </label>
                    <select
                      value={deductionType}
                      onChange={(e) => setDeductionType(e.target.value as AbsenceDeductionType)}
                      className="w-full text-xs font-semibold h-9 sm:h-10 rounded-xl border border-slate-300 bg-white px-3 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
                    >
                      <option value="full_day">Pengurangan 1 Hari Penuh</option>
                      <option value="fixed_nominal">Nominal Statis (Rp)</option>
                      <option value="daily_percentage">Persentase Gaji Harian (%)</option>
                    </select>
                  </div>

                  {/* Input Nilai */}
                  {deductionType === 'fixed_nominal' && (
                    <div className="w-full">
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">
                        Nominal Potongan (Rp)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                          Rp
                        </div>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={formatRibuan(deductionNominal)}
                          onChange={(e) => setDeductionNominal(parseRibuan(e.target.value))}
                          className="text-base sm:text-sm h-9 sm:h-10 pl-8 bg-white font-bold rounded-xl border-slate-300 focus-visible:ring-blue-500/20 w-full"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}

                  {deductionType === 'daily_percentage' && (
                    <div className="w-full">
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">
                        Persentase Potongan (%)
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={deductionPercentage === 0 ? '' : deductionPercentage}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === '') {
                              setDeductionPercentage(0);
                              return;
                            }
                            const parsed = parseInt(raw, 10);
                            if (isNaN(parsed)) return;
                            setDeductionPercentage(Math.min(100, Math.max(0, parsed)));
                          }}
                          className="text-base sm:text-sm h-9 sm:h-10 pr-8 bg-white font-bold rounded-xl border-slate-300 focus-visible:ring-blue-500/20 w-full"
                          placeholder="0"
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                          %
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Modal Footer (Single Action, Full Width, Tanpa Tombol Batal) */}
        <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
          <Button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting
              ? 'Menyimpan...'
              : initialData
                ? 'Simpan Perubahan'
                : 'Tambah Jenis Ketidakhadiran'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
