import React, { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui';
import { INDO_MONTHS_FULL, formatDateIndo, formatYMD } from './utils-helper';
import { ModalCreatePeriodProps } from './types';

export function ModalCreatePeriod({
  isOpen,
  onClose,
  onCreate
}: ModalCreatePeriodProps) {
  const [periodName, setPeriodName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inisialisasi default periode bulanan saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-indexed

      const monthName = INDO_MONTHS_FULL[currentMonth];
      setPeriodName(`Payroll ${monthName} ${currentYear}`);

      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);

      setStartDate(formatYMD(firstDay));
      setEndDate(formatYMD(lastDay));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodName.trim()) {
      alert('Nama periode penggajian harus diisi.');
      return;
    }
    if (!startDate || !endDate) {
      alert('Tanggal awal dan akhir harus diisi.');
      return;
    }
    if (startDate > endDate) {
      alert('Tanggal awal tidak boleh melebihi tanggal akhir.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate(periodName.trim(), startDate, endDate);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Gagal membuat periode penggajian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-lg rounded-t-[1.75rem] sm:rounded-2xl overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 bg-white">
        {/* 1. Modal Header */}
        <div className="flex justify-between items-center px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-3xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Buka Periode Penggajian Bulanan Baru
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Buat kelompok periode penggajian karyawan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Nama Periode */}
          <div>
            <label className="text-xs sm:text-sm font-semibold text-slate-500 block mb-2">
              Nama Periode Penggajian
            </label>
            <input
              type="text"
              required
              value={periodName}
              onChange={(e) => setPeriodName(e.target.value)}
              placeholder="Contoh: Payroll September 2026"
              className="w-full h-12 px-4 text-sm sm:text-base font-bold text-slate-900 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-2xs transition-all placeholder:font-normal placeholder:text-slate-400"
            />
          </div>

          {/* Rentang Tanggal Penggajian */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Tanggal Mulai */}
            <div>
              <label className="text-xs sm:text-sm font-semibold text-slate-500 block mb-2">
                Tanggal Mulai
              </label>
              <div className="relative border border-slate-200 rounded-2xl bg-white px-4 h-12 flex items-center justify-between hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500 transition-all cursor-pointer shadow-2xs">
                <span className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {startDate ? formatDateIndo(startDate) : 'Pilih Tanggal'}
                </span>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>

            {/* Tanggal Selesai */}
            <div>
              <label className="text-xs sm:text-sm font-semibold text-slate-500 block mb-2">
                Tanggal Selesai
              </label>
              <div className="relative border border-slate-200 rounded-2xl bg-white px-4 h-12 flex items-center justify-between hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500 transition-all cursor-pointer shadow-2xs">
                <span className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {endDate ? formatDateIndo(endDate) : 'Pilih Tanggal'}
                </span>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Info Card Acuan */}
          <div className="p-4 bg-slate-50/60 border border-slate-200/90 rounded-2xl text-xs sm:text-[13px] text-slate-500 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Periode penggajian bulanan berfungsi sebagai acuan perhitungan gaji, absensi, lembur, dan tunjangan seluruh karyawan aktif pada bulan tersebut.
            </span>
          </div>
        </div>

        {/* 3. Modal Footer (Full Width, Rounded-2xl Button) */}
        <div className="p-5 sm:p-6 pt-2 sm:pt-3 border-t border-slate-100 shrink-0 bg-white">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Membuat Periode Penggajian...' : 'Buat Periode Penggajian'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
