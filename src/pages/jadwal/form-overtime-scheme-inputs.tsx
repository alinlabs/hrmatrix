import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { OvertimeCalculationBasis } from '../../types';
import { FormattedNominalInput } from './utils-tambahan-helper';

export interface OvertimeSchemeInputsProps {
  calcType: 'multiplier' | 'static';
  onCalcTypeChange: (type: 'multiplier' | 'static') => void;
  calcBasis: OvertimeCalculationBasis;
  onCalcBasisChange: (basis: OvertimeCalculationBasis) => void;
  baseDivider: number;
  onBaseDividerChange: (divider: number) => void;
  tieredMults: number[];
  onTieredMultsChange: (newMults: number[]) => void;
  tieredNominals: number[];
  onTieredNominalsChange: (newNominals: number[]) => void;
  flatMult: number;
  onFlatMultChange: (mult: number) => void;
  staticRate: number;
  onStaticRateChange: (rate: number) => void;
  renderInfoCard: () => React.ReactNode;
}

export function OvertimeSchemeInputs({
  calcType,
  onCalcTypeChange,
  calcBasis,
  onCalcBasisChange,
  baseDivider,
  onBaseDividerChange,
  tieredMults,
  onTieredMultsChange,
  tieredNominals,
  onTieredNominalsChange,
  flatMult,
  onFlatMultChange,
  staticRate,
  onStaticRateChange,
  renderInfoCard,
}: OvertimeSchemeInputsProps) {
  const isBertingkat = calcType === 'multiplier';
  const activeValues = calcBasis === 'nominal' ? tieredNominals : tieredMults;
  const activeTierCount = activeValues.length;

  const handleTierCountChange = (targetCount: number) => {
    const clamped = Math.max(2, Math.min(8, targetCount));
    if (calcBasis === 'nominal') {
      let updated = [...tieredNominals];
      if (clamped > updated.length) {
        while (updated.length < clamped) {
          const lastVal = updated[updated.length - 1] || 0;
          updated.push(lastVal);
        }
      } else if (clamped < updated.length) {
        updated = updated.slice(0, clamped);
      }
      onTieredNominalsChange(updated);
    } else {
      let updated = [...tieredMults];
      if (clamped > updated.length) {
        while (updated.length < clamped) {
          const lastVal = updated[updated.length - 1] || 0;
          const newVal = lastVal > 0 ? parseFloat((lastVal + 0.5).toFixed(1)) : lastVal;
          updated.push(newVal);
        }
      } else if (clamped < updated.length) {
        updated = updated.slice(0, clamped);
      }
      onTieredMultsChange(updated);
    }
  };

  const handleValueChange = (index: number, val: number) => {
    if (calcBasis === 'nominal') {
      const updated = [...tieredNominals];
      updated[index] = val;
      onTieredNominalsChange(updated);
    } else {
      const updated = [...tieredMults];
      updated[index] = val;
      onTieredMultsChange(updated);
    }
  };

  const handleCalcBasisChange = (val: OvertimeCalculationBasis) => {
    onCalcBasisChange(val);
    if (val === 'government') {
      onBaseDividerChange(173);
    } else if (val === 'manual_divider') {
      onBaseDividerChange(0);
    }
  };

  // Helper render Dasar Hitung select field
  const renderDasarHitungField = (className?: string) => (
    <div className={className}>
      <label className="block text-[10px] text-slate-500 font-normal mb-1">
        Dasar Hitung
      </label>
      <select
        value={calcBasis}
        onChange={(e) => handleCalcBasisChange(e.target.value as OvertimeCalculationBasis)}
        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
      >
        <option value="salary_hourly">Gaji Pokok Per Jam</option>
        <option value="government">Peraturan Pemerintah</option>
        <option value="manual_divider">Pembagian Manual</option>
        <option value="nominal">Tarif Nominal</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-3.5">
      {isBertingkat ? (
        <>
          {/* 1. Baris Atas Bertingkat: Skema Upah (Kiri) & Banyak Tingkat (Kanan) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] text-slate-500 font-normal mb-1">
                Skema Upah
              </label>
              <select
                value={calcType}
                onChange={(e) => onCalcTypeChange(e.target.value as 'multiplier' | 'static')}
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="multiplier">Bertingkat</option>
                <option value="static">Statis</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-normal mb-1">
                Banyak Tingkat
              </label>
              <div className="flex items-center gap-1.5 h-8">
                <button
                  type="button"
                  disabled={activeTierCount <= 2}
                  onClick={() => handleTierCountChange(activeTierCount - 1)}
                  className="w-8 h-8 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 disabled:hover:bg-slate-100 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 hover:text-slate-950 font-bold cursor-pointer transition-colors shrink-0 shadow-2xs"
                  title="Kurangi Tingkat"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={activeTierCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                      handleTierCountChange(val);
                    }
                  }}
                  className="w-full h-8 px-1 text-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500 box-border"
                />
                <button
                  type="button"
                  disabled={activeTierCount >= 8}
                  onClick={() => handleTierCountChange(activeTierCount + 1)}
                  className="w-8 h-8 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 disabled:hover:bg-slate-100 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 hover:text-slate-950 font-bold cursor-pointer transition-colors shrink-0 shadow-2xs"
                  title="Tambah Tingkat"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Jika Bertingkat & Dasar Hitung Nominal */}
          {calcBasis === 'nominal' && (
            <div className="w-full">
              {renderDasarHitungField('w-full')}
            </div>
          )}

          {/* 3. Tingkatan Jam Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {activeValues.map((val, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === activeValues.length - 1;
              const label = isFirst
                ? 'Jam Ke-1'
                : isLast
                  ? `Jam Ke-${idx + 1} dst`
                  : `Jam Ke-${idx + 1}`;

              return (
                <div key={idx}>
                  <label className="block text-[10px] text-slate-500 font-normal mb-1 truncate" title={label}>
                    {calcBasis === 'nominal' ? `Tarif ${label} (Rp)` : `Pengali ${label}`}
                  </label>
                  {calcBasis === 'nominal' ? (
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-[10px] font-medium text-slate-400">Rp</span>
                      <FormattedNominalInput
                        value={val}
                        onChange={(v) => handleValueChange(idx, v)}
                      />
                    </div>
                  ) : (
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={val}
                      onChange={(e) => handleValueChange(idx, parseFloat(e.target.value) || 0)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* 4. Jika Bertingkat & Dasar Hitung BUKAN Nominal */}
          {calcBasis !== 'nominal' && (
            <div className={calcBasis === 'government' || calcBasis === 'manual_divider' ? 'grid grid-cols-2 gap-2.5' : 'w-full'}>
              {renderDasarHitungField()}

              {calcBasis === 'government' && (
                <div>
                  <label className="block text-[10px] text-slate-500 font-normal mb-1">Pembagi Standar</label>
                  <input
                    type="text"
                    value={173}
                    disabled
                    readOnly
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-100 text-xs font-bold text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
              )}

              {calcBasis === 'manual_divider' && (
                <div>
                  <label className="block text-[10px] text-slate-500 font-normal mb-1">Pembagi Gaji Pokok</label>
                  <input
                    type="number"
                    min={1}
                    value={baseDivider || ''}
                    onChange={(e) => onBaseDividerChange(e.target.value === '' ? 0 : (parseInt(e.target.value) || 0))}
                    placeholder="Kosong..."
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* MODE STATIS */
        <div className="space-y-2.5">
          {/* Row 1: Opsi Skema & Opsi Dasar Hitung */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] text-slate-500 font-normal mb-1">
                Skema Upah
              </label>
              <select
                value={calcType}
                onChange={(e) => onCalcTypeChange(e.target.value as 'multiplier' | 'static')}
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="multiplier">Bertingkat</option>
                <option value="static">Statis</option>
              </select>
            </div>

            {renderDasarHitungField('w-full')}
          </div>

          {/* Row 2: Detail Input */}
          {calcBasis === 'nominal' || calcBasis === 'salary_hourly' ? (
            <div className="w-full">
              {calcBasis === 'nominal' ? (
                <div>
                  <label className="block text-[10px] text-slate-500 font-normal mb-1 truncate">Tarif Statis (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-[10px] font-medium text-slate-400">Rp</span>
                    <FormattedNominalInput
                      value={staticRate}
                      onChange={(val) => onStaticRateChange(val)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] text-slate-500 font-normal mb-1 truncate">Pengali Flat Per Jam</label>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={flatMult}
                    onChange={(e) => onFlatMultChange(parseFloat(e.target.value) || 0)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] text-slate-500 font-normal mb-1 truncate">Pengali Flat Per Jam</label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={flatMult}
                  onChange={(e) => onFlatMultChange(parseFloat(e.target.value) || 0)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {calcBasis === 'government' && (
                <div>
                  <label className="block text-[10px] text-slate-500 font-normal mb-1">Pembagi Standar</label>
                  <input
                    type="text"
                    value={173}
                    disabled
                    readOnly
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-100 text-xs font-bold text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
              )}

              {calcBasis === 'manual_divider' && (
                <div>
                  <label className="block text-[10px] text-slate-500 font-normal mb-1">Pembagi Gaji Pokok</label>
                  <input
                    type="number"
                    min={1}
                    value={baseDivider || ''}
                    onChange={(e) => onBaseDividerChange(e.target.value === '' ? 0 : (parseInt(e.target.value) || 0))}
                    placeholder="Kosong..."
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Info Card */}
      {renderInfoCard()}
    </div>
  );
}
