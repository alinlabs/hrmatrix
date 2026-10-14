import React, { useState } from 'react';
import { 
  Settings2, 
  X, 
  CalendarDays, 
  Clock, 
  Info,
  Layers
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui';

interface ModalPengaturanCutiProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalPengaturanCuti({
  isOpen,
  onClose
}: ModalPengaturanCutiProps) {
  const [defaultAnnualQuota, setDefaultAnnualQuota] = useState(12);
  const [minMonthsService, setMinMonthsService] = useState(12);
  const [carryOverMax, setCarryOverMax] = useState(6);
  const [carryOverExpiryMonths, setCarryOverExpiryMonths] = useState(6);
  const [autoDeductJointHoliday, setAutoDeductJointHoliday] = useState(true);
  const [minNoticeDays, setMinNoticeDays] = useState(3);
  const [requireAttachment, setRequireAttachment] = useState(true);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-xl"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Settings2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Pengaturan Kuota & Kebijakan Cuti
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Konfigurasi hak cuti tahunan, carry over, & aturan pengajuan
              </p>
            </div>
          </div>
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

        {/* Modal Body / Settings Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Banner Info */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold">Konfigurasi Standar Perusahaan:</span> Pengaturan ini menjadi acuan pembentukan kuota cuti otomatis karyawan baru serta perhitungan saldo per tahun.
            </div>
          </div>

          {/* 1. Hak Cuti Tahunan Standar */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              1. Hak & Kuota Cuti Tahunan
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <Input
                  label="Jatah Cuti Tahunan Standar (Hari / Tahun)"
                  type="number"
                  min={1}
                  max={60}
                  value={defaultAnnualQuota}
                  onChange={(e) => setDefaultAnnualQuota(parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <Input
                  label="Masa Kerja Minimal Berhak Cuti (Bulan Kerja)"
                  type="number"
                  min={0}
                  max={36}
                  value={minMonthsService}
                  onChange={(e) => setMinMonthsService(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* 2. Kebijakan Carry Over (Sisa Cuti Tahun Lalu) */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
              <Layers className="w-4 h-4 text-emerald-600" />
              2. Akumulasi & Sisa Cuti (Carry Over)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <Input
                  label="Maksimal Hari yang Dapat Dibawa (Hari)"
                  type="number"
                  min={0}
                  max={20}
                  value={carryOverMax}
                  onChange={(e) => setCarryOverMax(parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <Input
                  label="Masa Kedaluwarsa Sisa Cuti (Bulan)"
                  type="number"
                  min={1}
                  max={12}
                  value={carryOverExpiryMonths}
                  onChange={(e) => setCarryOverExpiryMonths(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* 3. Ketentuan Pengajuan & Cuti Bersama */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
              <Clock className="w-4 h-4 text-amber-600" />
              3. Ketentuan Pengajuan & Cuti Bersama
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-800 text-[11px]">Batas Pengajuan Cuti Tahunan</div>
                  <div className="text-[10px] text-slate-500 font-normal">Minimal hari sebelum tanggal pelaksanaan cuti (H - X)</div>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={minNoticeDays}
                    onChange={(e) => setMinNoticeDays(parseInt(e.target.value) || 0)}
                    className="text-center font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <div className="font-semibold text-slate-800 text-[11px]">Otomatis Potong Cuti Bersama</div>
                  <div className="text-[10px] text-slate-500 font-normal">Hari libur cuti bersama pemerintah otomatis memotong kuota tahunan</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={autoDeductJointHoliday}
                    onChange={(e) => setAutoDeductJointHoliday(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <div className="font-semibold text-slate-800 text-[11px]">Wajib Lampiran Dokumen Pendukung</div>
                  <div className="text-[10px] text-slate-500 font-normal">Karyawan wajib mengunggah bukti/surat pendukung untuk pengajuan cuti khusus/melahirkan</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={requireAttachment}
                    onChange={(e) => setRequireAttachment(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Single Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.99] text-center"
          >
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </Modal>
  );
}
