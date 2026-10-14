import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Info,
  Clock,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { formatRupiah, terbilang } from '../kontrak/contract-templates';
import { Modal } from '../../components/ui/Modal';

interface RegulationCalculatorModalProps {
  type: 'pkwt_compensation' | 'severance' | 'overtime' | null;
  onClose: () => void;
}

export const RegulationCalculatorModal: React.FC<RegulationCalculatorModalProps> = ({
  type,
  onClose
}) => {
  if (!type) return null;

  // 1. STATE KALKULATOR KOMPENSASI PKWT
  const [pkwtMonths, setPkwtMonths] = useState<number>(12);
  const [pkwtSalary, setPkwtSalary] = useState<number>(10000000);
  const [pkwtFixedAllowance, setPkwtFixedAllowance] = useState<number>(2000000);

  // 2. STATE KALKULATOR PESANGON PHK
  const [phkReason, setPhkReason] = useState<string>('efisiensi_rugi');
  const [phkYears, setPhkYears] = useState<number>(4);
  const [phkWage, setPhkWage] = useState<number>(12000000);
  const [phkRemainingLeaveDays, setPhkRemainingLeaveDays] = useState<number>(5);

  // 3. STATE KALKULATOR LEMBUR
  const [overtimeDayType, setOvertimeDayType] = useState<'workday' | 'holiday5' | 'holiday6'>('workday');
  const [overtimeHours, setOvertimeHours] = useState<number>(3);
  const [overtimeMonthlyWage, setOvertimeMonthlyWage] = useState<number>(8500000);

  // Perhitungan Kompensasi PKWT (PP 35/2021)
  const totalPkwtMonthlyWage = pkwtSalary + pkwtFixedAllowance;
  const isEligiblePkwt = pkwtMonths >= 1;
  const pkwtCompensationAmount = isEligiblePkwt 
    ? Math.round((pkwtMonths / 12) * totalPkwtMonthlyWage) 
    : 0;

  // Perhitungan Pesangon PHK (PP 35/2021)
  const calculateSeverance = () => {
    // 1. Hitung Dasar UP (Uang Pesangon)
    let upMonths = 1;
    if (phkYears < 1) upMonths = 1;
    else if (phkYears < 2) upMonths = 2;
    else if (phkYears < 3) upMonths = 3;
    else if (phkYears < 4) upMonths = 4;
    else if (phkYears < 5) upMonths = 5;
    else if (phkYears < 6) upMonths = 6;
    else if (phkYears < 7) upMonths = 7;
    else if (phkYears < 8) upMonths = 8;
    else upMonths = 9;

    // 2. Hitung Dasar UPMK (Uang Penghargaan Masa Kerja)
    let upmkMonths = 0;
    if (phkYears < 3) upmkMonths = 0;
    else if (phkYears < 6) upmkMonths = 2;
    else if (phkYears < 9) upmkMonths = 3;
    else if (phkYears < 12) upmkMonths = 4;
    else if (phkYears < 15) upmkMonths = 5;
    else if (phkYears < 18) upmkMonths = 6;
    else if (phkYears < 21) upmkMonths = 7;
    else if (phkYears < 24) upmkMonths = 8;
    else upmkMonths = 10;

    // 3. Multiplier berdasarkan Alasan PHK
    let upMultiplier = 1.0;
    let upmkMultiplier = 1.0;

    switch (phkReason) {
      case 'efisiensi_rugi': // Efisiensi karena rugi (0.5x UP + 1x UPMK)
        upMultiplier = 0.5;
        upmkMultiplier = 1.0;
        break;
      case 'efisiensi_cegah_rugi': // Efisiensi cegah kerugian (1x UP + 1x UPMK)
        upMultiplier = 1.0;
        upmkMultiplier = 1.0;
        break;
      case 'tutup_force_majeure': // Force Majeure (0.5x UP + 1x UPMK)
        upMultiplier = 0.5;
        upmkMultiplier = 1.0;
        break;
      case 'pailit': // Perusahaan Pailit (0.5x UP + 1x UPMK)
        upMultiplier = 0.5;
        upmkMultiplier = 1.0;
        break;
      case 'pensiun': // Usia Pensiun (1.75x UP + 1x UPMK)
        upMultiplier = 1.75;
        upmkMultiplier = 1.0;
        break;
      case 'meninggal': // Pekerja Meninggal Dunia (2x UP + 1x UPMK)
        upMultiplier = 2.0;
        upmkMultiplier = 1.0;
        break;
      case 'sp3_disiplin': // Pelanggaran SP 3 (0.5x UP + 1x UPMK)
        upMultiplier = 0.5;
        upmkMultiplier = 1.0;
        break;
      case 'resign': // Pengunduran Diri Sukarela (Hanya UPH + Uang Pisah)
        upMultiplier = 0;
        upmkMultiplier = 0;
        break;
      default:
        upMultiplier = 1.0;
        upmkMultiplier = 1.0;
    }

    const totalUp = Math.round(upMonths * phkWage * upMultiplier);
    const totalUpmk = Math.round(upmkMonths * phkWage * upmkMultiplier);
    const uphLeave = Math.round((phkRemainingLeaveDays / 25) * phkWage);
    const totalSettlement = totalUp + totalUpmk + uphLeave;

    return {
      upMonths,
      upmkMonths,
      upMultiplier,
      upmkMultiplier,
      totalUp,
      totalUpmk,
      uphLeave,
      totalSettlement
    };
  };

  const severanceResult = calculateSeverance();

  // Perhitungan Lembur (PP 35/2021)
  const calculateOvertime = () => {
    const hourlyRate = Math.round(overtimeMonthlyWage / 173);
    let totalOvertimePay = 0;
    const hours = Math.max(0, overtimeHours);

    if (overtimeDayType === 'workday') {
      if (hours <= 1) {
        totalOvertimePay = hours * 1.5 * hourlyRate;
      } else {
        totalOvertimePay = (1 * 1.5 * hourlyRate) + ((hours - 1) * 2.0 * hourlyRate);
      }
    } else {
      // Hari Libur Resmi (5 hari kerja)
      if (hours <= 8) {
        totalOvertimePay = hours * 2.0 * hourlyRate;
      } else if (hours === 9) {
        totalOvertimePay = (8 * 2.0 * hourlyRate) + (1 * 3.0 * hourlyRate);
      } else {
        totalOvertimePay = (8 * 2.0 * hourlyRate) + (1 * 3.0 * hourlyRate) + ((hours - 9) * 4.0 * hourlyRate);
      }
    }

    return {
      hourlyRate,
      totalOvertimePay: Math.round(totalOvertimePay)
    };
  };

  const overtimeResult = calculateOvertime();

  return (
    <Modal
      isOpen={!!type}
      onClose={onClose}
      contentClassName="sm:max-w-2xl flex flex-col max-h-[90vh]"
    >
      <div className="bg-white w-full rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {type === 'pkwt_compensation' && 'Kalkulator Kompensasi PKWT (PP 35/2021)'}
                {type === 'severance' && 'Kalkulator Hak Pesangon PHK (PP 35/2021)'}
                {type === 'overtime' && 'Kalkulator Upah Lembur (Rumus 1/173)'}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Simulasi perhitungan presisi sesuai undang-undang ketenagakerjaan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* 1. KALKULATOR KOMPENSASI PKWT */}
          {type === 'pkwt_compensation' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-blue-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Dasar Regulasi: PP No. 35 Tahun 2021 Pasal 15 & 16
                </span>
                <p className="text-[11px] text-blue-800">
                  Rumus: <strong className="font-mono">(Masa Kerja Bulan / 12) × 1 Bulan Upah</strong> (Gaji Pokok + Tunjangan Tetap). Wajib dibayar saat PKWT selesai atau setiap perpanjangan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Durasi Masa Kerja (Bulan) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={pkwtMonths}
                    onChange={(e) => setPkwtMonths(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Misal: 12 bulan (1 tahun)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Gaji Pokok Bulanan (Rp) *
                  </label>
                  <input
                    type="number"
                    step="100000"
                    value={pkwtSalary}
                    onChange={(e) => setPkwtSalary(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tunjangan Tetap Bulanan (Rp)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    value={pkwtFixedAllowance}
                    onChange={(e) => setPkwtFixedAllowance(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Result Box */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Dasar Upah Sebulan (Pokok + Tetap):</span>
                  <span className="font-bold text-sm text-slate-100">{formatRupiah(totalPkwtMonthlyWage)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Faktor Proporsi Masa Kerja:</span>
                  <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-blue-300">
                    {pkwtMonths} / 12 = {(pkwtMonths / 12).toFixed(3)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block">
                      Total Uang Kompensasi PKWT Wajib Dibayar:
                    </span>
                    <span className="text-xl font-extrabold text-emerald-400">
                      {formatRupiah(pkwtCompensationAmount)}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 italic max-w-xs text-right sm:text-right">
                    Terbilang: {terbilang(pkwtCompensationAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. KALKULATOR PESANGON PHK */}
          {type === 'severance' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-emerald-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Dasar Regulasi: PP No. 35 Tahun 2021 Pasal 40 s/d 59
                </span>
                <p className="text-[11px] text-emerald-900">
                  Total Pesangon = <strong>(UP × Pengali) + (UPMK × Pengali) + UPH Cuti</strong>. Pengali ditentukan oleh alasan sah pemutusan hubungan kerja.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Alasan Pemutusan Hubungan Kerja (PHK) *
                  </label>
                  <select
                    value={phkReason}
                    onChange={(e) => setPhkReason(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="efisiensi_rugi">Efisiensi karena Perusahaan Merugi (0.5x UP + 1x UPMK)</option>
                    <option value="efisiensi_cegah_rugi">Efisiensi untuk Mencegah Kerugian (1.0x UP + 1x UPMK)</option>
                    <option value="tutup_force_majeure">Perusahaan Tutup karena Force Majeure (0.5x UP + 1x UPMK)</option>
                    <option value="pailit">Perusahaan Pailit (0.5x UP + 1x UPMK)</option>
                    <option value="sp3_disiplin">Pelanggaran Disiplin / SP 3 (0.5x UP + 1x UPMK)</option>
                    <option value="pensiun">Pekerja Mencapai Usia Pensiun (1.75x UP + 1x UPMK)</option>
                    <option value="meninggal">Pekerja Meninggal Dunia (2.0x UP + 1x UPMK)</option>
                    <option value="resign">Pengunduran Diri Sukarela / Resign (Hanya UPH + Uang Pisah)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Masa Kerja (Tahun Penuh) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={phkYears}
                    onChange={(e) => setPhkYears(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    UP: {severanceResult.upMonths} bln · UPMK: {severanceResult.upmkMonths} bln
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Upah Sebulan (Pokok + Tunjangan Tetap) *
                  </label>
                  <input
                    type="number"
                    step="500000"
                    value={phkWage}
                    onChange={(e) => setPhkWage(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sisa Cuti Tahunan Belum Gugur (Hari)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={phkRemainingLeaveDays}
                    onChange={(e) => setPhkRemainingLeaveDays(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Detailed Breakdown Card */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300">
                    Uang Pesangon ({severanceResult.upMonths} bln × {severanceResult.upMultiplier}x):
                  </span>
                  <span className="font-bold text-slate-100">{formatRupiah(severanceResult.totalUp)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300">
                    Uang Penghargaan Masa Kerja ({severanceResult.upmkMonths} bln × {severanceResult.upmkMultiplier}x):
                  </span>
                  <span className="font-bold text-slate-100">{formatRupiah(severanceResult.totalUpmk)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300">
                    Uang Penggantian Hak (UPH Cuti {phkRemainingLeaveDays} Hari):
                  </span>
                  <span className="font-bold text-slate-100">{formatRupiah(severanceResult.uphLeave)}</span>
                </div>
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                      Total Hak Penyelesaian Finansial Bersih:
                    </span>
                    <span className="text-xl font-extrabold text-emerald-400">
                      {formatRupiah(severanceResult.totalSettlement)}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 italic max-w-xs text-right sm:text-right">
                    Terbilang: {terbilang(severanceResult.totalSettlement)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. KALKULATOR UPAH LEMBUR */}
          {type === 'overtime' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-amber-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Dasar Regulasi: PP No. 35 Tahun 2021 Pasal 31
                </span>
                <p className="text-[11px] text-amber-900">
                  Upah Sejam Lembur = <strong className="font-mono">1/173 × Upah Sebulan</strong>. Hari kerja: Jam ke-1 (1.5x), jam ke-2 dst (2.0x).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jenis Hari Lembur *
                  </label>
                  <select
                    value={overtimeDayType}
                    onChange={(e) => setOvertimeDayType(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="workday">Hari Kerja Biasa (Senin - Jumat/Sabtu)</option>
                    <option value="holiday5">Hari Libur Resmi / Mingguan (Skema 5 Hari)</option>
                    <option value="holiday6">Hari Libur Resmi / Mingguan (Skema 6 Hari)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Total Durasi Lembur (Jam) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    step="0.5"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(Math.max(0.5, Number(e.target.value) || 0.5))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Maks 4 jam/hari (hari kerja)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Upah Bulanan Karyawan (Rp) *
                  </label>
                  <input
                    type="number"
                    step="200000"
                    value={overtimeMonthlyWage}
                    onChange={(e) => setOvertimeMonthlyWage(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Overtime Result Box */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300">Upah Per Jam (1/173 × Upah Sebulan):</span>
                  <span className="font-mono text-xs text-amber-300 font-bold">
                    {formatRupiah(overtimeResult.hourlyRate)} / jam
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300">Total Jam Lembur Dilakukan:</span>
                  <span className="font-bold text-slate-100">{overtimeHours} Jam</span>
                </div>
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                      Total Upah Lembur Wajib Dibayarkan:
                    </span>
                    <span className="text-xl font-extrabold text-amber-400">
                      {formatRupiah(overtimeResult.totalOvertimePay)}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 italic max-w-xs text-right sm:text-right">
                    Terbilang: {terbilang(overtimeResult.totalOvertimePay)}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer (SPEC_MODAL) */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer active:scale-[0.99]"
          >
            Tutup Kalkulator
          </button>
        </div>

      </div>
    </Modal>
  );
};
