import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { Modal } from '../../components/ui/modal';
import { formatRupiah } from '../payroll/utils-helper';

export type RegulationCalculatorType =
  | 'pkwt_compensation'
  | 'severance'
  | 'overtime'
  | 'bpjs'
  | null;

interface RegulationCalculatorModalProps {
  type: RegulationCalculatorType;
  onClose: () => void;
}

const TITLES: Record<Exclude<RegulationCalculatorType, null>, { title: string; subtitle: string }> = {
  pkwt_compensation: {
    title: 'Kalkulator Kompensasi PKWT',
    subtitle: 'Simulasi uang kompensasi kontrak sesuai PP No. 35 Tahun 2021 Pasal 15–16',
  },
  severance: {
    title: 'Kalkulator Pesangon & UPMK PHK',
    subtitle: 'Estimasi Uang Pesangon (UP) & Uang Penghargaan Masa Kerja (PP 35/2021)',
  },
  overtime: {
    title: 'Kalkulator Upah Lembur',
    subtitle: 'Simulasi upah lembur 1/173 × Upah Sebulan sesuai PP No. 35/2021 Pasal 31',
  },
  bpjs: {
    title: 'Kalkulator Iuran BPJS Kesehatan & TK',
    subtitle: 'Simulasi kontribusi perusahaan dan potongan pekerja bulanan',
  },
};

export const RegulationCalculatorModal: React.FC<RegulationCalculatorModalProps> = ({
  type,
  onClose,
}) => {
  const [monthlyWage, setMonthlyWage] = useState<number>(8000000);
  const [pkwtMonths, setPkwtMonths] = useState<number>(12);
  const [tenureYears, setTenureYears] = useState<number>(4);
  const [severanceReason, setSeveranceReason] = useState<'efisiensi' | 'pensiun' | 'pelanggaran'>('efisiensi');
  const [overtimeHours, setOvertimeHours] = useState<number>(3);
  const [overtimeDayType, setOvertimeDayType] = useState<'workday' | 'holiday'>('workday');

  const result = useMemo(() => {
    const wage = Math.max(0, Number(monthlyWage || 0));

    if (type === 'pkwt_compensation') {
      const months = Math.max(1, Number(pkwtMonths || 1));
      const amount = Math.round((months / 12) * wage);
      return {
        primaryLabel: 'Estimasi Uang Kompensasi PKWT',
        primaryValue: amount,
        details: [
          { label: 'Dasar Upah (Pokok + Tunjangan Tetap)', value: formatRupiah(wage) },
          { label: 'Masa Kerja PKWT', value: `${months} bulan` },
          { label: 'Rumus PP 35/2021', value: `(${months} ÷ 12) × ${formatRupiah(wage)}` },
        ],
      };
    }

    if (type === 'severance') {
      const yrs = Math.max(0, Number(tenureYears || 0));
      const upMonths = Math.min(9, Math.floor(yrs) + 1);
      const upFactor = severanceReason === 'pensiun' ? 1.75 : severanceReason === 'pelanggaran' ? 0.5 : 1;
      const up = Math.round(upMonths * upFactor * wage);

      let upmkMonths = 0;
      if (yrs >= 24) upmkMonths = 10;
      else if (yrs >= 21) upmkMonths = 8;
      else if (yrs >= 18) upmkMonths = 7;
      else if (yrs >= 15) upmkMonths = 6;
      else if (yrs >= 12) upmkMonths = 5;
      else if (yrs >= 9) upmkMonths = 4;
      else if (yrs >= 6) upmkMonths = 3;
      else if (yrs >= 3) upmkMonths = 2;

      const upmk = Math.round(upmkMonths * wage);
      return {
        primaryLabel: 'Total Estimasi UP + UPMK',
        primaryValue: up + upmk,
        details: [
          { label: `Uang Pesangon (${upMonths} bln × ${upFactor}x)`, value: formatRupiah(up) },
          { label: `Uang Penghargaan Masa Kerja (${upmkMonths} bln)`, value: formatRupiah(upmk) },
          { label: 'Catatan', value: 'Belum termasuk UPH sisa cuti tahunan & hak lainnya' },
        ],
      };
    }

    if (type === 'overtime') {
      const hourly = wage / 173;
      const hrs = Math.max(0, Number(overtimeHours || 0));
      let multiplierSum = 0;

      if (overtimeDayType === 'workday') {
        if (hrs >= 1) {
          multiplierSum += 1.5;
          multiplierSum += Math.max(0, hrs - 1) * 2.0;
        } else {
          multiplierSum += hrs * 1.5;
        }
      } else {
        const firstTier = Math.min(hrs, 7);
        const eighth = hrs > 7 ? Math.min(hrs - 7, 1) : 0;
        const ninthPlus = hrs > 8 ? hrs - 8 : 0;
        multiplierSum = firstTier * 2.0 + eighth * 3.0 + ninthPlus * 4.0;
      }

      const amount = Math.round(hourly * multiplierSum);
      return {
        primaryLabel: 'Estimasi Upah Lembur',
        primaryValue: amount,
        details: [
          { label: 'Upah Sejam (1/173 × Upah)', value: formatRupiah(Math.round(hourly)) },
          { label: 'Total Poin Pengali', value: `${multiplierSum.toFixed(1)}x` },
          { label: 'Durasi Lembur', value: `${hrs} jam (${overtimeDayType === 'workday' ? 'Hari Kerja' : 'Hari Libur'})` },
        ],
      };
    }

    // bpjs
    const kesCap = Math.min(wage, 12000000);
    const jpCap = Math.min(wage, 10042300);
    const kesEr = Math.round(kesCap * 0.04);
    const kesEe = Math.round(kesCap * 0.01);
    const jhtEr = Math.round(wage * 0.037);
    const jhtEe = Math.round(wage * 0.02);
    const jpEr = Math.round(jpCap * 0.02);
    const jpEe = Math.round(jpCap * 0.01);
    const jkk = Math.round(wage * 0.0024);
    const jkm = Math.round(wage * 0.003);

    const totalWorker = kesEe + jhtEe + jpEe;
    const totalEmployer = kesEr + jhtEr + jpEr + jkk + jkm;
    return {
      primaryLabel: 'Total Iuran BPJS (Perusahaan + Pekerja)',
      primaryValue: totalWorker + totalEmployer,
      details: [
        { label: 'Tanggungan Perusahaan', value: formatRupiah(totalEmployer) },
        { label: 'Potongan Gaji Pekerja', value: formatRupiah(totalWorker) },
        { label: 'BPJS Kesehatan (4% ER / 1% EE)', value: `${formatRupiah(kesEr)} / ${formatRupiah(kesEe)}` },
        { label: 'JHT + JP + JKK + JKM', value: formatRupiah(jhtEr + jhtEe + jpEr + jpEe + jkk + jkm) },
      ],
    };
  }, [type, monthlyWage, pkwtMonths, tenureYears, severanceReason, overtimeHours, overtimeDayType]);

  const activeType = type ?? 'pkwt_compensation';
  const meta = TITLES[activeType];

  return (
    <Modal isOpen={Boolean(type)} onClose={onClose} contentClassName="sm:max-w-lg">
      <div className="flex flex-col max-h-[85vh]">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">{meta.title}</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{meta.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Tutup"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upah Sebulan (Gaji Pokok + Tunjangan Tetap)
            </label>
            <input
              type="number"
              min={0}
              step={100000}
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(Number(e.target.value) || 0)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {type === 'pkwt_compensation' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Masa Kerja PKWT (Bulan)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={pkwtMonths}
                onChange={(e) => setPkwtMonths(Number(e.target.value) || 1)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {type === 'severance' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Masa Kerja (Tahun)
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alasan PHK
                </label>
                <select
                  value={severanceReason}
                  onChange={(e) => setSeveranceReason(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                >
                  <option value="efisiensi">Efisiensi / Merger (1x UP)</option>
                  <option value="pensiun">Pensiun Normal (1.75x UP)</option>
                  <option value="pelanggaran">Pelanggaran SP3 (0.5x UP)</option>
                </select>
              </div>
            </div>
          )}

          {type === 'overtime' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Durasi Lembur (Jam)
                </label>
                <input
                  type="number"
                  min={0.5}
                  max={12}
                  step={0.5}
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(Number(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Hari
                </label>
                <select
                  value={overtimeDayType}
                  onChange={(e) => setOvertimeDayType(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                >
                  <option value="workday">Hari Kerja Biasa</option>
                  <option value="holiday">Hari Libur / Istirahat</option>
                </select>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2.5">
            <div>
              <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                {result.primaryLabel}
              </span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {formatRupiah(result.primaryValue)}
              </div>
            </div>
            <div className="pt-2 border-t border-blue-200/70 space-y-1.5">
              {result.details.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{d.label}</span>
                  <span className="font-semibold text-slate-900">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
