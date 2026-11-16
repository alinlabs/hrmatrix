import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TaxProfile } from '../../types';

const idrFormatter = new Intl.NumberFormat('id-ID');
const formatIdr = (val: number) => idrFormatter.format(val);

const formatPercentVal = (rateVal: number): string => {
  const formatted = rateVal.toFixed(2);
  if (formatted.endsWith('.00')) {
    return `${Math.round(rateVal)}%`;
  }
  return `${Number(formatted.replace(/\.?0+$/, ''))}%`;
};

interface AllowanceItem {
  id?: string;
  name?: string;
  amount?: number;
}

interface TaxSimulationResult {
  terCategory: string;
  terRate: number;
  taxAllowance: number;
  pph21Monthly: number;
  ptkpAnnual?: number;
}

interface TaxSimulationBoxProps {
  isProgressive: boolean;
  taxProfile: TaxProfile;
  simulation: TaxSimulationResult;
  basicSalary: number;
  fixedAllowance?: number;
  fixedAllowanceList: AllowanceItem[];
  totalTaxableGross: number;
  totalTaxableGrossUpMonthly: number;
  isSimulationExpanded: boolean;
  onToggleExpanded: () => void;
}

export function TaxSimulationBox({
  isProgressive,
  taxProfile,
  simulation,
  basicSalary,
  fixedAllowance,
  fixedAllowanceList,
  totalTaxableGross,
  totalTaxableGrossUpMonthly,
  isSimulationExpanded,
  onToggleExpanded,
}: TaxSimulationBoxProps) {
  const annualGross = totalTaxableGrossUpMonthly * 12;
  const annualBiayaJabatan = Math.min(6000000, Math.round(annualGross * 0.05));
  const annualNeto = Math.max(0, annualGross - annualBiayaJabatan);
  const annualPtkp = simulation.ptkpAnnual || 54000000;
  const annualPkp = Math.max(0, Math.floor((annualNeto - annualPtkp) / 1000) * 1000);

  // Dynamic progressive tax bracket breakdown calculation (UU HPP No. 7/2021)
  const progressiveData = React.useMemo(() => {
    let remaining = annualPkp;
    const brackets: {
      lapisName: string;
      ratePercent: string;
      pkpAmount: number;
      taxAmount: number;
    }[] = [];

    const b1 = Math.min(remaining, 60000000);
    if (b1 > 0 || annualPkp === 0) {
      brackets.push({
        lapisName: 'Lapis 1',
        ratePercent: '5%',
        pkpAmount: b1,
        taxAmount: b1 * 0.05,
      });
      remaining = Math.max(0, remaining - b1);
    }

    if (remaining > 0) {
      const b2 = Math.min(remaining, 190000000);
      brackets.push({
        lapisName: 'Lapis 2',
        ratePercent: '15%',
        pkpAmount: b2,
        taxAmount: b2 * 0.15,
      });
      remaining = Math.max(0, remaining - b2);
    }

    if (remaining > 0) {
      const b3 = Math.min(remaining, 250000000);
      brackets.push({
        lapisName: 'Lapis 3',
        ratePercent: '25%',
        pkpAmount: b3,
        taxAmount: b3 * 0.25,
      });
      remaining = Math.max(0, remaining - b3);
    }

    if (remaining > 0) {
      const b4 = Math.min(remaining, 4500000000);
      brackets.push({
        lapisName: 'Lapis 4',
        ratePercent: '30%',
        pkpAmount: b4,
        taxAmount: b4 * 0.30,
      });
      remaining = Math.max(0, remaining - b4);
    }

    if (remaining > 0) {
      brackets.push({
        lapisName: 'Lapis 5',
        ratePercent: '35%',
        pkpAmount: remaining,
        taxAmount: remaining * 0.35,
      });
    }

    const baseTax = brackets.reduce((sum, b) => sum + b.taxAmount, 0);
    let totalTax = baseTax;
    let nonNpwpSurcharge = 0;
    if (!taxProfile.hasNpwp && baseTax > 0) {
      nonNpwpSurcharge = baseTax * 0.2;
      totalTax = baseTax + nonNpwpSurcharge;
    }

    return { brackets, baseTax, nonNpwpSurcharge, totalTax };
  }, [annualPkp, taxProfile.hasNpwp]);

  const annualProgressiveTax = progressiveData.totalTax;

  // PPh 21 Desember (Rekonsiliasi Pajak Akhir Tahun)
  const pph21December = React.useMemo(() => {
    return Math.max(0, Math.round(annualProgressiveTax - simulation.pph21Monthly * 11));
  }, [annualProgressiveTax, simulation.pph21Monthly]);

  const rawTerRateVal = isProgressive
    ? annualGross > 0
      ? (annualProgressiveTax / annualGross) * 100
      : 0
    : simulation.terRate * 100;
  const formattedTerRate = formatPercentVal(rawTerRateVal);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={onToggleExpanded}
        className={`w-full text-left ${isSimulationExpanded ? 'px-4 py-3 sm:px-5 sm:py-3.5' : 'p-4 sm:p-5'} focus:outline-none hover:bg-slate-50/40 transition-all block`}
      >
        {/* Header Row: Title & Chevron aligned together */}
        <div className="flex items-center justify-between gap-4">
          <h5 className="font-bold text-slate-900 text-[11px] sm:text-xs uppercase tracking-wider leading-none">
            {isProgressive
              ? 'Estimasi PPh 21 Tarif Progresif'
              : 'Estimasi PPh 21 Tarif Efektif'}
          </h5>
          <div className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            {isSimulationExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </div>
        </div>

        {!isSimulationExpanded && (
          <div className={`animate-in fade-in duration-100 ${!isProgressive ? 'mt-2.5 space-y-2.5' : 'mt-1.5 space-y-1'}`}>
            {!isProgressive ? (
              /* Mode TER: 2 Card (PPh 21 Perbulan (Jan-Nov) | PPh 21 Desember) */
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-0.5">
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                  <div className="text-[11px] font-normal text-slate-500 leading-tight">
                    PPh 21 Perbulan (Jan-Nov)
                  </div>
                  <div className="text-sm sm:text-base md:text-lg font-extrabold text-blue-700 leading-tight mt-1 truncate">
                    Rp {formatIdr(simulation.pph21Monthly)}
                  </div>
                </div>

                <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                  <div className="text-[11px] font-normal text-slate-500 leading-tight">
                    PPh 21 Desember
                  </div>
                  <div className="text-sm sm:text-base md:text-lg font-extrabold text-blue-700 leading-tight mt-1 truncate">
                    Rp {formatIdr(pph21December)}
                  </div>
                </div>
              </div>
            ) : (
              /* Mode Tarif Progresif: Nominal Tunggal Lebih Besar & Rapat */
              <div className="text-2xl sm:text-3xl font-black text-blue-700 leading-tight tracking-tight">
                Rp {formatIdr(simulation.pph21Monthly)}
              </div>
            )}

            <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-none pt-0.5">
              Ditanggung oleh:{' '}
              <span className="font-semibold text-slate-700">
                {taxProfile.taxMethod === 'Gross'
                  ? 'Karyawan (Gross)'
                  : taxProfile.taxMethod === 'Gross Up'
                  ? 'Perusahaan (Gross Up)'
                  : taxProfile.taxMethod === 'Nett'
                  ? 'Perusahaan (Nett)'
                  : 'Belum ditentukan'}
              </span>
            </div>
          </div>
        )}
      </button>

      {isSimulationExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-4 border-t border-slate-100 pt-4 animate-in fade-in duration-200">
          {/* Top Metrics Cards: 4 Cards for TER, 3 Cards for Progressive */}
          {!isProgressive ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-200/70">
                <span className="text-[11px] text-slate-500 font-medium block mb-0.5 truncate">
                  PTKP Setahun ({taxProfile.ptkpStatus || 'TK/0'})
                </span>
                <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  Rp {formatIdr(simulation.ptkpAnnual || 54000000)}
                </div>
              </div>

              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-200/70">
                <span className="text-[11px] text-slate-500 font-medium block mb-0.5 truncate">
                  Tarif TER Kategori ({simulation.terCategory})
                </span>
                <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {(simulation.terRate * 100).toFixed(2)}%
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80">
                <span className="text-[11px] text-blue-700 font-semibold block mb-0.5 truncate">PPh 21 Jan - Nov</span>
                <div className="text-sm sm:text-base font-extrabold text-blue-900 truncate">
                  Rp {formatIdr(simulation.pph21Monthly)}
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80">
                <span className="text-[11px] text-blue-700 font-semibold block mb-0.5 truncate">PPh 21 Desember</span>
                <div className="text-sm sm:text-base font-extrabold text-blue-900 truncate">
                  Rp {formatIdr(pph21December)}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-200/70">
                <span className="text-[11px] text-slate-500 font-medium block mb-0.5 truncate">
                  PTKP Setahun ({taxProfile.ptkpStatus || 'TK/0'})
                </span>
                <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  Rp {formatIdr(simulation.ptkpAnnual || 54000000)}
                </div>
              </div>

              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-200/70">
                <span className="text-[11px] text-slate-500 font-medium block mb-0.5 truncate">
                  Tarif Efektif Rata-Rata
                </span>
                <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {formattedTerRate}
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 col-span-2">
                <span className="text-[11px] text-blue-700 font-semibold block mb-0.5 truncate">PPh 21 Progresif Perbulan</span>
                <div className="text-sm sm:text-base font-extrabold text-blue-900 truncate">
                  Rp {formatIdr(simulation.pph21Monthly)}
                </div>
              </div>
            </div>
          )}

          {/* Section 1: PENGHASILAN BRUTO */}
          <div className="space-y-3 pt-1">
            <div className="-mx-4 px-4 py-2 sm:-mx-5 sm:px-5 bg-blue-50/80 border-y border-blue-100/80">
              <span className="text-xs font-bold text-blue-800 block tracking-wide uppercase">
                PERHITUNGAN PENGHASILAN BRUTO
              </span>
              <span className="text-[11px] font-medium text-blue-600 block mt-0.5">
                Gaji Pokok & Tunjangan Tetap
              </span>
            </div>

            <div className="grid grid-cols-[1fr_22px_88px] items-start gap-y-1.5 gap-x-2 pr-6 sm:pr-10">
              <span className="font-normal text-slate-600 text-xs">Gaji Pokok</span>
              <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
              <span className="font-normal text-slate-600 text-right text-xs">
                {formatIdr(basicSalary)}
              </span>

              {fixedAllowanceList.map((allw, idx) => (
                <React.Fragment key={allw.id || idx}>
                  <span className="font-normal text-slate-600 text-xs truncate max-w-[200px] sm:max-w-none" title={allw.name}>
                    {allw.name || 'Tunjangan Tetap'}
                  </span>
                  <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                  <span className="font-normal text-slate-600 text-right text-xs">
                    {formatIdr(allw.amount || 0)}
                  </span>
                </React.Fragment>
              ))}

              {fixedAllowanceList.length === 0 && (
                <React.Fragment>
                  <span className="font-normal text-slate-400 text-xs">Tunjangan Tetap</span>
                  <span className="font-normal text-slate-400 text-right text-xs">Rp</span>
                  <span className="font-normal text-slate-400 text-right text-xs">
                    {fixedAllowance ? formatIdr(fixedAllowance) : '0'}
                  </span>
                </React.Fragment>
              )}

              <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                {taxProfile.taxMethod === 'Gross Up' ? 'Total Bruto Perbulan' : 'Total Bruto Sebulan'}
              </span>
              <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">Rp</span>
              <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">
                {formatIdr(totalTaxableGross)}
              </span>
            </div>
          </div>

          {/* If TER: Show Section 2 (Jan - Nov) and Section 3 (Rekonsiliasi Desember) */}
          {!isProgressive ? (
            <>
              {/* Section 2: PERHITUNGAN PPh 21 JAN - NOV */}
              <div className="space-y-3 pt-2">
                <div className="-mx-4 px-4 py-2 sm:-mx-5 sm:px-5 bg-blue-50/80 border-y border-blue-100/80">
                  <span className="text-xs font-bold text-blue-800 block tracking-wide uppercase">
                    PERHITUNGAN PPH 21 JAN - NOV
                  </span>
                  <span className="text-[11px] font-medium text-blue-600 block mt-0.5">
                    Tarif Efektif Rata Rata - {simulation.terCategory} ({taxProfile.ptkpStatus || 'TK/0'})
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_22px_88px] items-start gap-y-1.5 gap-x-2 pr-6 sm:pr-10">
                  <span className="font-normal text-slate-600 text-xs">Total Bruto Sebulan</span>
                  <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                  <span className="font-normal text-slate-600 text-right text-xs">
                    {formatIdr(totalTaxableGross)}
                  </span>

                  <div className="flex items-center justify-between text-xs text-slate-600 font-normal pr-1">
                    <span>
                      Tarif TER {simulation.terCategory} ({taxProfile.ptkpStatus || 'TK/0'})
                    </span>
                    <div className="flex items-center gap-3.5 text-slate-600 font-normal">
                      <span>{formattedTerRate}</span>
                      <span className="text-slate-400 font-medium">x</span>
                    </div>
                  </div>
                  <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                  <span className="font-normal text-slate-600 text-right text-xs">
                    {formatIdr(totalTaxableGross)}
                  </span>

                  {taxProfile.taxMethod === 'Gross Up' && (
                    <React.Fragment>
                      <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                      <span />
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs">
                        {formatIdr(Math.round(totalTaxableGross * simulation.terRate))}
                      </span>

                      <div className="flex items-center justify-between text-xs text-slate-600 font-normal pr-1">
                        <span>1 - TER Kategori {simulation.terCategory}</span>
                        <span className="text-slate-400 font-medium">÷</span>
                      </div>
                      <span />
                      <span className="font-normal text-slate-600 text-right text-xs">
                        {Math.round((1 - simulation.terRate) * 100)}%
                      </span>
                    </React.Fragment>
                  )}

                  <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    {taxProfile.taxMethod === 'Gross Up' ? 'Tunjangan PPh Sebulan' : 'PPh 21 Sebulan'}
                  </span>
                  <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">Rp</span>
                  <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">
                    {formatIdr(simulation.pph21Monthly)}
                  </span>
                </div>
              </div>

              {/* Section 3: PERHITUNGAN PENGHASILAN KENA PAJAK */}
              <div className="space-y-3 pt-2">
                <div className="-mx-4 px-4 py-2 sm:-mx-5 sm:px-5 bg-blue-50/80 border-y border-blue-100/80">
                  <span className="text-xs font-bold text-blue-800 block tracking-wide uppercase">
                    PERHITUNGAN PENGHASILAN KENA PAJAK
                  </span>
                  <span className="text-[11px] font-medium text-blue-600 block mt-0.5">
                    Batas Penghasilan Kena Pajak & PTKP ({taxProfile.ptkpStatus || 'TK/0'})
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_22px_88px] items-start gap-y-1.5 gap-x-2 pr-6 sm:pr-10">
                  {taxProfile.taxMethod === 'Gross Up' && (
                    <React.Fragment>
                      <span className="font-normal text-slate-600 text-xs">Total Bruto Sebulan</span>
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs">
                        {formatIdr(totalTaxableGross)}
                      </span>

                      <span className="font-normal text-slate-600 text-xs">Tunjangan PPh Sebulan</span>
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs relative">
                        {formatIdr(simulation.pph21Monthly)}
                        <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">+</span>
                      </span>

                      <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                      <span className="font-normal text-slate-600 text-xs">Akumulasi Bruto</span>
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs">
                        {formatIdr(totalTaxableGrossUpMonthly)}
                      </span>

                      <div className="flex items-center justify-between text-xs text-slate-600 font-normal pr-1">
                        <span>Masa Pajak Setahun</span>
                        <div className="flex items-center gap-3.5 text-slate-600 font-normal">
                          <span>12</span>
                          <span className="text-slate-400 font-medium">x</span>
                        </div>
                      </div>
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs">
                        {formatIdr(totalTaxableGrossUpMonthly)}
                      </span>

                      <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />
                    </React.Fragment>
                  )}

                  {taxProfile.taxMethod === 'Gross Up' ? (
                    <React.Fragment>
                      <span className="font-normal text-slate-600 text-xs">Bruto Setahun</span>
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs">
                        {formatIdr(annualGross)}
                      </span>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className="flex items-center justify-between text-xs text-slate-600 font-normal pr-1">
                        <span>Total Bruto Setahun</span>
                        <div className="flex items-center gap-3.5 text-slate-600 font-normal">
                          <span>12</span>
                          <span className="text-slate-400 font-medium">x</span>
                        </div>
                      </div>
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs">
                        {formatIdr(totalTaxableGross)}
                      </span>
                    </React.Fragment>
                  )}

                  <span className="font-normal text-slate-600 text-xs">Biaya Jabatan</span>
                  <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                  <span className="font-normal text-slate-600 text-right text-xs relative">
                    {formatIdr(annualBiayaJabatan)}
                    <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">-</span>
                  </span>

                  <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                  <span className="font-normal text-slate-600 text-xs">Neto Setahun</span>
                  <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                  <span className="font-normal text-slate-600 text-right text-xs">
                    {formatIdr(annualNeto)}
                  </span>

                  <span className="font-normal text-slate-600 text-xs">Batas PTKP ({taxProfile.ptkpStatus || 'TK/0'})</span>
                  <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                  <span className="font-normal text-slate-600 text-right text-xs relative">
                    {formatIdr(annualPtkp)}
                    <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">-</span>
                  </span>

                  <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                  <span className="font-bold text-slate-900 text-xs sm:text-sm">Penghasilan Kena Pajak</span>
                  <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">Rp</span>
                  <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">
                    {formatIdr(annualPkp)}
                  </span>
                </div>

                {/* Section 4: PERHITUNGAN TARIF PROGRESIF */}
                <div className="-mx-4 px-4 py-2 sm:-mx-5 sm:px-5 bg-blue-50/80 border-y border-blue-100/80">
                  <span className="text-xs font-bold text-blue-800 block tracking-wide uppercase">
                    PERHITUNGAN TARIF PROGRESIF
                  </span>
                  <span className="text-[11px] font-medium text-blue-600 block mt-0.5">
                    Lapis Tarif Progresif PPh Pasal 17 UU HPP
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_22px_88px] items-start gap-y-1.5 gap-x-2 pr-6 sm:pr-10">
                  {progressiveData.brackets.map((b, i) => (
                    <React.Fragment key={i}>
                      <div className="grid grid-cols-[60px_28px_10px_16px_1fr_10px] items-start gap-x-1 text-xs text-slate-600 font-normal">
                        <span className="leading-4">{b.lapisName}</span>
                        <span className="text-right leading-4">{b.ratePercent}</span>
                        <span className="text-center text-slate-400 font-medium leading-4">x</span>
                        <span className="text-slate-500 text-[11px] leading-4">Rp</span>
                        <span className="text-right leading-4">{formatIdr(Math.round(b.pkpAmount))}</span>
                        <span className="text-center text-slate-400 font-medium leading-4">=</span>
                      </div>
                      <span className="font-normal text-slate-600 text-right text-xs leading-4">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs leading-4 relative">
                        {formatIdr(Math.round(b.taxAmount))}
                        <span className="absolute left-full ml-2 top-0 font-normal text-slate-400 text-xs leading-4">+</span>
                      </span>
                    </React.Fragment>
                  ))}

                  {!taxProfile.hasNpwp && progressiveData.nonNpwpSurcharge > 0 && (
                    <React.Fragment>
                      <div className="grid grid-cols-[60px_28px_10px_16px_1fr_10px] items-start gap-x-1 text-xs text-slate-600 font-normal">
                        <span className="leading-4">Non-NPWP</span>
                        <span className="text-right leading-4">20%</span>
                        <span className="text-center text-slate-400 font-medium leading-4">x</span>
                        <span className="text-slate-500 text-[11px] leading-4">Rp</span>
                        <span className="text-right leading-4">{formatIdr(Math.round(progressiveData.baseTax))}</span>
                        <span className="text-center text-slate-400 font-medium leading-4">=</span>
                      </div>
                      <span className="font-normal text-slate-600 text-right text-xs leading-4">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs leading-4 relative">
                        {formatIdr(Math.round(progressiveData.nonNpwpSurcharge))}
                        <span className="absolute left-full ml-2 top-0 font-normal text-slate-400 text-xs leading-4">+</span>
                      </span>
                    </React.Fragment>
                  )}

                  <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                  <span className="font-normal text-slate-600 text-xs">PPh 21 Setahun Progresif</span>
                  <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                  <span className="font-normal text-slate-600 text-right text-xs">
                    {formatIdr(Math.round(annualProgressiveTax))}
                  </span>

                  <div className="flex items-center justify-between text-xs text-slate-600 font-normal pr-1">
                    <span>{taxProfile.taxMethod === 'Gross Up' ? 'Tunjangan PPh (Jan-Nov)' : 'Total PPh 21 (Jan-Nov)'}</span>
                    <div className="flex items-center gap-3.5 text-slate-600 font-normal">
                      <span>11</span>
                      <span className="text-slate-400 font-medium">x</span>
                    </div>
                  </div>
                  <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                  <span className="font-normal text-slate-600 text-right text-xs relative">
                    {formatIdr(Math.round(simulation.pph21Monthly))}
                    <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">-</span>
                  </span>

                  <div className="col-start-2 col-span-2 border-t border-slate-900 my-1" />

                  <span className="font-bold text-slate-900 text-xs sm:text-sm">PPh 21 Bulan Desember</span>
                  <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">Rp</span>
                  <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">
                    {formatIdr(pph21December)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* If Progressive: Show Cleaner, Simpler Standard Progressive Calculation */
            <div className="space-y-3 pt-2">
              <div className="-mx-4 px-4 py-2 sm:-mx-5 sm:px-5 bg-blue-50/80 border-y border-blue-100/80">
                <span className="text-xs font-bold text-blue-800 block tracking-wide uppercase">
                  PERHITUNGAN PENGHASILAN KENA PAJAK
                </span>
                <span className="text-[11px] font-medium text-blue-600 block mt-0.5">
                  Batas Penghasilan Kena Pajak & PTKP ({taxProfile.ptkpStatus || 'TK/0'})
                </span>
              </div>

              <div className="grid grid-cols-[1fr_22px_88px] items-start gap-y-1.5 gap-x-2 pr-6 sm:pr-10">
                {taxProfile.taxMethod === 'Gross Up' ? (
                  <React.Fragment>
                    <span className="font-normal text-slate-600 text-xs">Total Bruto Sebulan</span>
                    <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs">
                      {formatIdr(totalTaxableGross)}
                    </span>

                    <span className="font-normal text-slate-600 text-xs">Tunjangan PPh Sebulan</span>
                    <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs relative">
                      {formatIdr(simulation.pph21Monthly)}
                      <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">+</span>
                    </span>

                    <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                    <span className="font-normal text-slate-600 text-xs">Akumulasi Bruto</span>
                    <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs">
                      {formatIdr(totalTaxableGrossUpMonthly)}
                    </span>

                    <div className="flex items-center justify-between text-xs text-slate-600 font-normal pr-1">
                      <span>Masa Pajak Setahun</span>
                      <div className="flex items-center gap-3.5 text-slate-600 font-normal">
                        <span>12</span>
                        <span className="text-slate-400 font-medium">x</span>
                      </div>
                    </div>
                    <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs">
                      {formatIdr(totalTaxableGrossUpMonthly)}
                    </span>

                    <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                    <span className="font-normal text-slate-600 text-xs">Bruto Setahun</span>
                    <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs">
                      {formatIdr(annualGross)}
                    </span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="flex items-center justify-between text-xs text-slate-600 font-normal pr-1">
                      <span>Total Bruto Setahun</span>
                      <div className="flex items-center gap-3.5 text-slate-600 font-normal">
                        <span>12</span>
                        <span className="text-slate-400 font-medium">x</span>
                      </div>
                    </div>
                    <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs">
                      {formatIdr(totalTaxableGross)}
                    </span>
                  </React.Fragment>
                )}

                <span className="font-normal text-slate-600 text-xs">Biaya Jabatan</span>
                <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                <span className="font-normal text-slate-600 text-right text-xs relative">
                  {formatIdr(annualBiayaJabatan)}
                  <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">-</span>
                </span>

                <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                <span className="font-normal text-slate-600 text-xs">Neto Setahun</span>
                <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                <span className="font-normal text-slate-600 text-right text-xs">
                  {formatIdr(annualNeto)}
                </span>

                <span className="font-normal text-slate-600 text-xs">Batas PTKP ({taxProfile.ptkpStatus || 'TK/0'})</span>
                <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                <span className="font-normal text-slate-600 text-right text-xs relative">
                  {formatIdr(annualPtkp)}
                  <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">-</span>
                </span>

                <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                <span className="font-bold text-slate-900 text-xs sm:text-sm">Penghasilan Kena Pajak</span>
                <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">Rp</span>
                <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">
                  {formatIdr(annualPkp)}
                </span>
              </div>

              {/* Section 4: PERHITUNGAN TARIF PROGRESIF */}
              <div className="-mx-4 px-4 py-2 sm:-mx-5 sm:px-5 bg-blue-50/80 border-y border-blue-100/80">
                <span className="text-xs font-bold text-blue-800 block tracking-wide uppercase">
                  PERHITUNGAN TARIF PROGRESIF
                </span>
                <span className="text-[11px] font-medium text-blue-600 block mt-0.5">
                  Lapis Tarif Progresif PPh Pasal 17 UU HPP
                </span>
              </div>

              <div className="grid grid-cols-[1fr_22px_88px] items-start gap-y-1.5 gap-x-2 pr-6 sm:pr-10">
                {progressiveData.brackets.map((b, i) => (
                  <React.Fragment key={i}>
                    <div className="grid grid-cols-[60px_28px_10px_16px_1fr_10px] items-start gap-x-1 text-xs text-slate-600 font-normal">
                      <span className="leading-4">{b.lapisName}</span>
                      <span className="text-right leading-4">{b.ratePercent}</span>
                      <span className="text-center text-slate-400 font-medium leading-4">x</span>
                      <span className="text-slate-500 text-[11px] leading-4">Rp</span>
                      <span className="text-right leading-4">{formatIdr(Math.round(b.pkpAmount))}</span>
                      <span className="text-center text-slate-400 font-medium leading-4">=</span>
                    </div>
                    <span className="font-normal text-slate-600 text-right text-xs leading-4">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs leading-4 relative">
                      {formatIdr(Math.round(b.taxAmount))}
                      <span className="absolute left-full ml-2 top-0 font-normal text-slate-400 text-xs leading-4">+</span>
                    </span>
                  </React.Fragment>
                ))}

                {!taxProfile.hasNpwp && progressiveData.nonNpwpSurcharge > 0 && (
                  <React.Fragment>
                    <div className="grid grid-cols-[60px_28px_10px_16px_1fr_10px] items-start gap-x-1 text-xs text-slate-600 font-normal">
                      <span className="leading-4">Non-NPWP</span>
                      <span className="text-right leading-4">20%</span>
                      <span className="text-center text-slate-400 font-medium leading-4">x</span>
                      <span className="text-slate-500 text-[11px] leading-4">Rp</span>
                      <span className="text-right leading-4">{formatIdr(Math.round(progressiveData.baseTax))}</span>
                      <span className="text-center text-slate-400 font-medium leading-4">=</span>
                    </div>
                    <span className="font-normal text-slate-600 text-right text-xs leading-4">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs leading-4 relative">
                      {formatIdr(Math.round(progressiveData.nonNpwpSurcharge))}
                      <span className="absolute left-full ml-2 top-0 font-normal text-slate-400 text-xs leading-4">+</span>
                    </span>
                  </React.Fragment>
                )}

                <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                <span className="font-bold text-slate-900 text-xs sm:text-sm">Total PPh 21 Setahun</span>
                <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">Rp</span>
                <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">
                  {formatIdr(Math.round(annualProgressiveTax))}
                </span>

                <div className="flex items-center justify-between text-xs text-slate-600 font-normal pr-1">
                  <span>Masa Pajak Setahun</span>
                  <div className="flex items-center gap-3.5 text-slate-600 font-normal">
                    <span>12</span>
                    <span className="text-slate-400 font-medium">÷</span>
                  </div>
                </div>
                <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                <span className="font-normal text-slate-600 text-right text-xs">
                  {formatIdr(Math.round(annualProgressiveTax))}
                </span>

                <div className="col-start-2 col-span-2 border-t border-slate-900 my-1" />

                <span className="font-bold text-slate-900 text-xs sm:text-sm">PPh 21 Perbulan</span>
                <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">Rp</span>
                <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">
                  {formatIdr(simulation.pph21Monthly)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
