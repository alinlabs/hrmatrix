import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Plus, Minus, Info, X, SlidersHorizontal } from 'lucide-react';
import { OvertimeCalculationBasis } from '../../types';
import { renderOvertimeInfoCard } from './utils-tambahan-helper';
import { OvertimeSchemeInputs } from './form-overtime-scheme-inputs';

export interface ModalKonfigurasiProps {
  isConfigModalOpen: boolean;
  setIsConfigModalOpen: (open: boolean) => void;
  isSavingConfig: boolean;
  handleSaveOvertimeConfig?: (e?: React.FormEvent) => void;
  dayMode: 'separate' | 'unified';
  setDayMode: (mode: 'separate' | 'unified') => void;
  isAutoOvertime: boolean;
  setIsAutoOvertime: (auto: boolean) => void;
  showPresensiInfo: boolean;
  setShowPresensiInfo: (show: boolean) => void;
  minOvertimeMinutes: number;
  setMinOvertimeMinutes: (mins: number) => void;
  normalCalcType: 'multiplier' | 'static';
  setNormalCalcType: (type: 'multiplier' | 'static') => void;
  normalCalcBasis: OvertimeCalculationBasis;
  setNormalCalcBasis: (basis: OvertimeCalculationBasis) => void;
  normalBaseDivider: number;
  setNormalBaseDivider: (divider: number) => void;
  normalTieredMults: number[];
  setNormalTieredMults: (mults: number[]) => void;
  normalTieredNominals: number[];
  setNormalTieredNominals: (noms: number[]) => void;
  normalFlatMult: number;
  setNormalFlatMult: (mult: number) => void;
  normalStaticRate: number;
  setNormalStaticRate: (rate: number) => void;
  offdayCalcType: 'multiplier' | 'static';
  setOffdayCalcType: (type: 'multiplier' | 'static') => void;
  offdayCalcBasis: OvertimeCalculationBasis;
  setOffdayCalcBasis: (basis: OvertimeCalculationBasis) => void;
  offdayBaseDivider: number;
  setOffdayBaseDivider: (divider: number) => void;
  offdayTieredMults: number[];
  setOffdayTieredMults: (mults: number[]) => void;
  offdayTieredNominals: number[];
  setOffdayTieredNominals: (noms: number[]) => void;
  offdayFlatMult: number;
  setOffdayFlatMult: (mult: number) => void;
  offdayStaticRate: number;
  setOffdayStaticRate: (rate: number) => void;
  normalMultFirst: number;
  normalMultNext: number;
  normalStaticFirstHourRate: number;
  normalStaticNextHoursRate: number;
  offdayMultFirst: number;
  offdayMultNext: number;
  offdayStaticFirstHourRate: number;
  offdayStaticNextHoursRate: number;
  hasChanges: boolean;
  isConfigValid: boolean;
}

export function ModalKonfigurasi(props: ModalKonfigurasiProps) {
  const {
    isConfigModalOpen,
    setIsConfigModalOpen,
    isSavingConfig,
    dayMode,
    setDayMode,
    isAutoOvertime,
    setIsAutoOvertime,
    showPresensiInfo,
    setShowPresensiInfo,
    minOvertimeMinutes,
    setMinOvertimeMinutes,
    normalCalcType,
    setNormalCalcType,
    normalCalcBasis,
    setNormalCalcBasis,
    normalBaseDivider,
    setNormalBaseDivider,
    normalTieredMults,
    setNormalTieredMults,
    normalTieredNominals,
    setNormalTieredNominals,
    normalFlatMult,
    setNormalFlatMult,
    normalStaticRate,
    setNormalStaticRate,
    offdayCalcType,
    setOffdayCalcType,
    offdayCalcBasis,
    setOffdayCalcBasis,
    offdayBaseDivider,
    setOffdayBaseDivider,
    offdayTieredMults,
    setOffdayTieredMults,
    offdayTieredNominals,
    setOffdayTieredNominals,
    offdayFlatMult,
    setOffdayFlatMult,
    offdayStaticRate,
    setOffdayStaticRate,
    normalMultFirst,
    normalMultNext,
    normalStaticFirstHourRate,
    normalStaticNextHoursRate,
    offdayMultFirst,
    offdayMultNext,
    offdayStaticFirstHourRate,
    offdayStaticNextHoursRate,
  } = props;

  return (
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

                {/* Full Width Input Durasi Minimum */}
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
            {dayMode === 'unified' ? (
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

          {/* Info Terpusat */}
          <div className="pt-2 flex items-start gap-2 text-slate-500">
            <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Pengaturan lembur ini tersimpan terpusat secara otomatis dan diterapkan pada kalkulator payroll serta modul presensi.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
