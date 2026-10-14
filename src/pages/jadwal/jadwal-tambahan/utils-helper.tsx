import React, { useState, useEffect } from 'react';
import { OvertimeCalculationBasis } from '../../../types';

export function FormattedNominalInput({
  value,
  onChange,
  className = "w-full h-8 pl-8 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500",
  placeholder = "0"
}: {
  value: number;
  onChange: (val: number) => void;
  className?: string;
  placeholder?: string;
}) {
  const formatVal = (n: number) => {
    if (n === 0 || !n) return '';
    return new Intl.NumberFormat('id-ID').format(n);
  };

  const [displayVal, setDisplayVal] = useState<string>(formatVal(value));

  useEffect(() => {
    setDisplayVal(formatVal(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    if (!rawDigits) {
      setDisplayVal('');
      onChange(0);
    } else {
      const parsed = parseInt(rawDigits, 10);
      setDisplayVal(new Intl.NumberFormat('id-ID').format(parsed));
      onChange(parsed);
    }
  };

  return (
    <input
      type="text"
      value={displayVal}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

export function renderOvertimeInfoCard({
    type,
    basis,
    multFirst,
    multNext,
    flatMult,
    divider,
    firstHourRate,
    nextHoursRate,
    staticRate,
    labelPrefix = 'Informasi Lembur',
    tieredMults,
    tieredNominals,
  }: {
    type: 'multiplier' | 'static';
    basis: OvertimeCalculationBasis;
    multFirst: number;
    multNext: number;
    flatMult: number;
    divider: number;
    firstHourRate: number;
    nextHoursRate: number;
    staticRate: number;
    labelPrefix?: string;
    tieredMults?: number[];
    tieredNominals?: number[];
  }) {
    const isHourly = basis === 'salary_hourly' || basis === 'salary';
    const isGov = basis === 'government';
    const isManual = basis === 'manual_divider';
    const isNominal = basis === 'nominal';

    const fmt = (val: number) => new Intl.NumberFormat('id-ID').format(val);

    const renderTierText = () => {
      if (isNominal) {
        const arr = tieredNominals || [firstHourRate, nextHoursRate];
        return arr.map((rate, idx) => {
          const isLast = idx === arr.length - 1;
          const label = isLast ? `Jam ke-${idx + 1} dst` : `Jam ke-${idx + 1}`;
          return `${label}: Rp ${fmt(rate)}`;
        }).join(', ');
      } else {
        const arr = tieredMults || [multFirst, multNext];
        return arr.map((m, idx) => {
          const isLast = idx === arr.length - 1;
          const label = isLast ? `Jam ke-${idx + 1} dst` : `Jam ke-${idx + 1}`;
          return `${label}: ${m}x`;
        }).join(', ');
      }
    };

    return (
      <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 space-y-1 transition-all text-center">
        <div className="font-semibold text-slate-700 text-[11px] text-center">
          <span>{labelPrefix}</span>
        </div>
        <p className="text-[10.5px] leading-relaxed text-slate-500 text-center">
          {type === 'multiplier' ? (
            <>
              Skema <strong className="text-slate-700 font-semibold">Bertingkat ({isNominal ? (tieredNominals?.length || 2) : (tieredMults?.length || 2)} Tingkat)</strong>
              {isHourly && (
                <> dengan dasar <strong className="text-slate-700 font-semibold">Gaji Pokok Per Jam</strong>. Rincian ({renderTierText()}) upah/jam.</>
              )}
              {isGov && (
                <> berdasarkan <strong className="text-slate-700 font-semibold">Peraturan Pemerintah</strong> (Upah/jam = Gaji / <strong className="text-slate-700 font-semibold">{divider}</strong>). Rincian ({renderTierText()}) upah/jam.</>
              )}
              {isManual && (
                <> dengan <strong className="text-slate-700 font-semibold">Pembagian Manual</strong> (Upah/jam = Gaji / <strong className="text-slate-700 font-semibold">{divider}</strong>). Rincian ({renderTierText()}) upah/jam.</>
              )}
              {isNominal && (
                <> berbasis <strong className="text-slate-700 font-semibold">Tarif Nominal</strong>. Rincian ({renderTierText()}).</>
              )}
            </>
          ) : (
            <>
              Skema <strong className="text-slate-700 font-semibold">Statis</strong>
              {isHourly && (
                <> dengan dasar <strong className="text-slate-700 font-semibold">Gaji Pokok Per Jam</strong>. Setiap jam lembur dibayar flat <strong className="text-slate-700 font-semibold">{flatMult}x</strong> upah/jam.</>
              )}
              {isGov && (
                <> berdasarkan <strong className="text-slate-700 font-semibold">Peraturan Pemerintah</strong> (Upah/jam = Gaji / <strong className="text-slate-700 font-semibold">{divider}</strong>). Flat <strong className="text-slate-700 font-semibold">{flatMult}x</strong> upah/jam.</>
              )}
              {isManual && (
                <> dengan <strong className="text-slate-700 font-semibold">Pembagian Manual</strong> (Upah/jam = Gaji / <strong className="text-slate-700 font-semibold">{divider}</strong>). Flat <strong className="text-slate-700 font-semibold">{flatMult}x</strong> upah/jam.</>
              )}
              {isNominal && (
                <> berbasis <strong className="text-slate-700 font-semibold">Tarif Nominal</strong>. Setiap 1 jam lembur dibayar flat <strong className="text-slate-700 font-semibold">Rp {fmt(staticRate)}</strong>.</>
              )}
            </>
          )}
        </p>
      </div>
    );
  }
