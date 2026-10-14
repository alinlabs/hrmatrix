import React from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { Plus, Minus, Info, X, SlidersHorizontal, Check } from 'lucide-react';
import { OvertimeCalculationBasis } from '../../../../types';
import { FormattedNominalInput, renderOvertimeInfoCard } from './utils-helper';

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
}: {
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
}) {
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

          {/* 2. Jika Bertingkat & Dasar Hitung Nominal: Posisi tepat di bawah Skema/Banyak Tingkat & di atas jam-jam tingkatan, LEBAR FULL */}
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

          {/* 4. Jika Bertingkat & Dasar Hitung BUKAN Nominal: Dasar Hitung di bawah tingkatan jam */}
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
        /* MODE STATIS: Opsi Skema & Opsi Dasar Hitung di baris atas (2 kolom), detail input di baris bawah sesuai tipe */
        <div className="space-y-2.5">
          {/* Row 1: Opsi Skema & Opsi Dasar Hitung */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Kolom 1: Skema Upah */}
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

            {/* Kolom 2: Dasar Hitung */}
            {renderDasarHitungField('w-full')}
          </div>

          {/* Row 2: Detail Input */}
          {calcBasis === 'nominal' || calcBasis === 'salary_hourly' ? (
            /* Tarif Nominal atau Gaji Pokok Per Jam: 1 kolom full-width */
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
            /* Peraturan Pemerintah atau Pembagian Manual: 2 kolom sejajar presisi */
            <div className="grid grid-cols-2 gap-2.5">
              {/* Kolom 1: Pengali Flat Per Jam */}
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

              {/* Kolom 2: Pembagi */}
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

export function ModalKonfigurasi(props: any) {
  const { isConfigModalOpen, setIsConfigModalOpen, isSavingConfig, handleSaveOvertimeConfig, dayMode, setDayMode, isAutoOvertime, setIsAutoOvertime, showPresensiInfo, setShowPresensiInfo, minOvertimeMinutes, setMinOvertimeMinutes, normalCalcType, setNormalCalcType, normalCalcBasis, setNormalCalcBasis, normalBaseDivider, setNormalBaseDivider, normalTieredMults, setNormalTieredMults, normalTieredNominals, setNormalTieredNominals, normalFlatMult, setNormalFlatMult, normalStaticRate, setNormalStaticRate, offdayCalcType, setOffdayCalcType, offdayCalcBasis, setOffdayCalcBasis, offdayBaseDivider, setOffdayBaseDivider, offdayTieredMults, setOffdayTieredMults, offdayTieredNominals, setOffdayTieredNominals, offdayFlatMult, setOffdayFlatMult, offdayStaticRate, setOffdayStaticRate, normalMultFirst, normalMultNext, normalStaticFirstHourRate, normalStaticNextHoursRate, offdayMultFirst, offdayMultNext, offdayStaticFirstHourRate, offdayStaticNextHoursRate, hasChanges, isConfigValid } = props;
  return (
    <>
      
        
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => {
          if (!isSavingConfig) setIsConfigModalOpen(false);
        }}
        contentClassName="sm:max-w-2xl"
      >

            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">Konfigurasi Lembur & Upah</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Atur durasi minimal, presensi otomatis, dan skema upah lembur</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs bg-white">
                
                {/* 1. Pembagian Jenis Lembur Section (Paling Atas) */}
                <div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Card 1: Normal & Weekend */}
                    <button
                      type="button"
                      onClick={() => setDayMode('separate')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        dayMode === 'separate'
                          ? 'bg-blue-50/60 border-blue-200 ring-1 ring-blue-100'
                          : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/50 hover:border-slate-300'
                      }`}
                    >
                      <span className={`text-xs ${dayMode === 'separate' ? 'font-semibold text-blue-900' : 'font-normal text-slate-700'}`}>
                        Normal & Weekend
                      </span>
                      <span className="text-[10.5px] text-slate-500 font-normal leading-tight">
                        Tarif berbeda antara hari kerja & hari libur
                      </span>
                    </button>

                    {/* Card 2: Tarif Seragam */}
                    <button
                      type="button"
                      onClick={() => setDayMode('unified')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        dayMode === 'unified'
                          ? 'bg-blue-50/60 border-blue-200 ring-1 ring-blue-100'
                          : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/50 hover:border-slate-300'
                      }`}
                    >
                      <span className={`text-xs ${dayMode === 'unified' ? 'font-semibold text-blue-900' : 'font-normal text-slate-700'}`}>
                        Tarif Seragam
                      </span>
                      <span className="text-[10.5px] text-slate-500 font-normal leading-tight">
                        Tarif seragam disamakan untuk seluruh hari
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Pengaturan Dasar Lemburan Presensi */}
                <div>
                  <div className="space-y-3">
                    {/* Header Row: Durasi Minimum (Kiri) & Otomatisasi Presensi Switch + Info Button (Kanan) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-normal text-slate-500">
                          Durasi Minimum
                        </label>
                        <div className="flex items-center gap-2">
                          <span
                            onClick={() => setIsAutoOvertime(!isAutoOvertime)}
                            className="text-xs font-normal text-slate-500 cursor-pointer select-none hover:text-slate-800 transition-colors"
                          >
                            Otomatisasi Presensi
                          </span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isAutoOvertime}
                            onClick={() => setIsAutoOvertime(!isAutoOvertime)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isAutoOvertime ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                isAutoOvertime ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          
                          {/* Gray Circular Info Icon */}
                          <button
                            type="button"
                            onClick={() => setShowPresensiInfo(!showPresensiInfo)}
                            className={`p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer ${
                              showPresensiInfo ? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' : ''
                            }`}
                            title="Tampilkan Informasi Mekanisme"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Full Width Input Durasi Minimum with Plus and Minus Buttons */}
                      <div className="flex items-center h-9 rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            const currentVal = Number((minOvertimeMinutes / 60).toFixed(2));
                            const newVal = Math.max(0, currentVal - 0.5);
                            setMinOvertimeMinutes(Math.round(newVal * 60));
                          }}
                          className="w-9 h-full flex items-center justify-center bg-slate-100/90 text-slate-700 hover:text-slate-950 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 disabled:hover:bg-slate-100/90 cursor-pointer disabled:cursor-not-allowed border-r border-slate-200 transition-colors shrink-0 select-none"
                          title="Kurangi Durasi Minimum"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={12}
                          step={0.1}
                          value={Number((minOvertimeMinutes / 60).toFixed(2))}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setMinOvertimeMinutes(Math.round(val * 60));
                          }}
                          className="w-full h-full px-3 text-center text-xs font-bold text-slate-900 bg-white hover:bg-white focus:bg-white outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs font-semibold text-slate-400 shrink-0 pr-2.5 select-none">Jam</span>
                        <button
                          type="button"
                          onClick={() => {
                            const currentVal = Number((minOvertimeMinutes / 60).toFixed(2));
                            const newVal = Math.min(12, currentVal + 0.5);
                            setMinOvertimeMinutes(Math.round(newVal * 60));
                          }}
                          className="w-9 h-full flex items-center justify-center bg-slate-100/90 text-slate-700 hover:text-slate-950 hover:bg-slate-200 active:bg-slate-300 cursor-pointer border-l border-slate-200 transition-colors shrink-0 select-none"
                          title="Tambah Durasi Minimum"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Elegant Soft Gray Info Card (Toggled on info icon click) */}
                    {showPresensiInfo && (
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-600 space-y-1.5 transition-all animate-in fade-in duration-150 text-center">
                        <div className="font-semibold text-slate-700 text-[11px] text-center">
                          <span>Mekanisme Lembur & Presensi</span>
                        </div>
                        <p className="text-[10.5px] leading-relaxed text-slate-500 text-center">
                          {minOvertimeMinutes > 0 ? (
                            <>
                              Batas kerja ekstra minimum adalah <strong className="text-slate-700 font-semibold">{minOvertimeMinutes / 60} Jam ({minOvertimeMinutes} menit)</strong>. Kerja ekstra di bawah durasi ini tidak dihitung sebagai lembur.
                            </>
                          ) : (
                            <>
                              Durasi minimum lembur diatur <strong className="text-slate-700 font-semibold">0 Jam</strong> (setiap menit kelebihan jam kerja langsung dihitung).
                            </>
                          )}
                          {' '}
                          {isAutoOvertime ? (
                            <>
                              Sistem <strong className="text-slate-700 font-semibold">otomatis mendeteksi</strong> kepulangan (check-out) yang melebihi jadwal reguler dan langsung mencatatnya sebagai lembur.
                            </>
                          ) : (
                            <>
                              Otomatisasi <strong className="text-slate-700 font-semibold">nonaktif</strong>, lemburan wajib diajukan atau diinput manual oleh admin / karyawan.
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Skema Upah Lemburan */}
                <div className="space-y-5 pt-1">

                  {/* Tampilan Konfigurasi Input Dinamis */}
                  {dayMode === 'unified' ? (
                    /* 1. Mode Lembur Sama Rata (Semua Hari Disamakan) */
                    <div className="space-y-3.5 pt-1">
                      <div className="w-full py-2 px-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center shadow-2xs mb-1">
                        <span className="font-bold text-emerald-600 text-xs tracking-wider uppercase">SEMUA HARI</span>
                      </div>

                      <OvertimeSchemeInputs
                        calcType={normalCalcType}
                        onCalcTypeChange={(type) => {
                          setNormalCalcType(type);
                          setOffdayCalcType(type);
                        }}
                        calcBasis={normalCalcBasis}
                        onCalcBasisChange={(basis) => {
                          setNormalCalcBasis(basis);
                          setOffdayCalcBasis(basis);
                          if (basis === 'government') {
                            setNormalBaseDivider(173);
                            setOffdayBaseDivider(173);
                          } else if (basis === 'manual_divider') {
                            setNormalBaseDivider(0);
                            setOffdayBaseDivider(0);
                          }
                        }}
                        baseDivider={normalBaseDivider}
                        onBaseDividerChange={(div) => {
                          setNormalBaseDivider(div);
                          setOffdayBaseDivider(div);
                        }}
                        tieredMults={normalTieredMults}
                        onTieredMultsChange={(mults) => {
                          setNormalTieredMults(mults);
                          setOffdayTieredMults(mults);
                        }}
                        tieredNominals={normalTieredNominals}
                        onTieredNominalsChange={(noms) => {
                          setNormalTieredNominals(noms);
                          setOffdayTieredNominals(noms);
                        }}
                        flatMult={normalFlatMult}
                        onFlatMultChange={(mult) => {
                          setNormalFlatMult(mult);
                          setOffdayFlatMult(mult);
                        }}
                        staticRate={normalStaticRate}
                        onStaticRateChange={(rate) => {
                          setNormalStaticRate(rate);
                          setOffdayStaticRate(rate);
                        }}
                        renderInfoCard={() => renderOvertimeInfoCard({
                          type: normalCalcType,
                          basis: normalCalcBasis,
                          multFirst: normalMultFirst,
                          multNext: normalMultNext,
                          flatMult: normalFlatMult,
                          divider: normalBaseDivider,
                          firstHourRate: normalStaticFirstHourRate,
                          nextHoursRate: normalStaticNextHoursRate,
                          staticRate: normalStaticRate,
                          labelPrefix: 'Informasi Lembur Semua Hari',
                          tieredMults: normalTieredMults,
                          tieredNominals: normalTieredNominals,
                        })}
                      />
                    </div>
                  ) : (
                    /* 2. Mode Lembur Normal & Offday Terpisah */
                    <div className="space-y-6 pt-1">
                      {/* Sub-Section A: Hari Kerja */}
                      <div className="space-y-3.5 border-b border-slate-100 pb-5">
                        <div className="w-full py-2 px-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center shadow-2xs mb-1">
                          <span className="font-bold text-blue-600 text-xs tracking-wider uppercase">LEMBUR HARI KERJA</span>
                        </div>

                        <OvertimeSchemeInputs
                          calcType={normalCalcType}
                          onCalcTypeChange={(type) => setNormalCalcType(type)}
                          calcBasis={normalCalcBasis}
                          onCalcBasisChange={(basis) => {
                            setNormalCalcBasis(basis);
                            if (basis === 'government') {
                              setNormalBaseDivider(173);
                            } else if (basis === 'manual_divider') {
                              setNormalBaseDivider(0);
                            }
                          }}
                          baseDivider={normalBaseDivider}
                          onBaseDividerChange={(div) => setNormalBaseDivider(div)}
                          tieredMults={normalTieredMults}
                          onTieredMultsChange={(mults) => setNormalTieredMults(mults)}
                          tieredNominals={normalTieredNominals}
                          onTieredNominalsChange={(noms) => setNormalTieredNominals(noms)}
                          flatMult={normalFlatMult}
                          onFlatMultChange={(mult) => setNormalFlatMult(mult)}
                          staticRate={normalStaticRate}
                          onStaticRateChange={(rate) => setNormalStaticRate(rate)}
                          renderInfoCard={() => renderOvertimeInfoCard({
                            type: normalCalcType,
                            basis: normalCalcBasis,
                            multFirst: normalMultFirst,
                            multNext: normalMultNext,
                            flatMult: normalFlatMult,
                            divider: normalBaseDivider,
                            firstHourRate: normalStaticFirstHourRate,
                            nextHoursRate: normalStaticNextHoursRate,
                            staticRate: normalStaticRate,
                            labelPrefix: 'Informasi Lembur Hari Kerja',
                            tieredMults: normalTieredMults,
                            tieredNominals: normalTieredNominals,
                          })}
                        />
                      </div>

                      {/* Sub-Section B: Hari Libur */}
                      <div className="space-y-3.5">
                        <div className="w-full py-2 px-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center shadow-2xs mb-1">
                          <span className="font-bold text-rose-600 text-xs tracking-wider uppercase">LEMBUR HARI LIBUR</span>
                        </div>

                        <OvertimeSchemeInputs
                          calcType={offdayCalcType}
                          onCalcTypeChange={(type) => setOffdayCalcType(type)}
                          calcBasis={offdayCalcBasis}
                          onCalcBasisChange={(basis) => {
                            setOffdayCalcBasis(basis);
                            if (basis === 'government') {
                              setOffdayBaseDivider(173);
                            } else if (basis === 'manual_divider') {
                              setOffdayBaseDivider(0);
                            }
                          }}
                          baseDivider={offdayBaseDivider}
                          onBaseDividerChange={(div) => setOffdayBaseDivider(div)}
                          tieredMults={offdayTieredMults}
                          onTieredMultsChange={(mults) => setOffdayTieredMults(mults)}
                          tieredNominals={offdayTieredNominals}
                          onTieredNominalsChange={(noms) => setOffdayTieredNominals(noms)}
                          flatMult={offdayFlatMult}
                          onFlatMultChange={(mult) => setOffdayFlatMult(mult)}
                          staticRate={offdayStaticRate}
                          onStaticRateChange={(rate) => setOffdayStaticRate(rate)}
                          renderInfoCard={() => renderOvertimeInfoCard({
                            type: offdayCalcType,
                            basis: offdayCalcBasis,
                            multFirst: offdayMultFirst,
                            multNext: offdayMultNext,
                            flatMult: offdayFlatMult,
                            divider: offdayBaseDivider,
                            firstHourRate: offdayStaticFirstHourRate,
                            nextHoursRate: offdayStaticNextHoursRate,
                            staticRate: offdayStaticRate,
                            labelPrefix: 'Informasi Lembur Hari Libur',
                            tieredMults: offdayTieredMults,
                            tieredNominals: offdayTieredNominals,
                          })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Info Terpusat */}
                <div className="pt-2 flex items-start gap-2 text-slate-500">
                  <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Pengaturan lembur ini tersimpan terpusat secara otomatis dan diterapkan pada kalkulator payroll serta modul presensi.
                  </p>
                </div>

              </div>
            </div>
      </Modal>
    </>
  );
}
