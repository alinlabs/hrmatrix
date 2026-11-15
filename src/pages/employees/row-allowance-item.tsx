import React from 'react';
import { Button, Select, CurrencyInput } from '../../components/ui';
import { Trash2, RotateCcw, Plus, X } from 'lucide-react';
import { masterTunjangan } from '../../data/master';
import { calculateAllowancePreview } from '../../utils/allowanceCalculator';
import { calculateTunjanganJabatan } from '../../services/tunjanganJabatanService';

interface AllowanceItemRowProps {
  allowance: any;
  formData: any;
  allowanceOptions: any[];
  availableAllowanceSelectOptions: any[];
  getAllowanceCategoryAndFrequency: (name: string, ruleData: any) => { category: string; frequency: string; method?: string };
  isTunjanganJabatanName: (name: string) => boolean;
  handleAllowanceSelectChange: (allowanceId: string, selectedValue: string) => void;
  handleRemoveAllowance: (allowanceId: string) => void;
  handleResetAllowanceToStandard: (allowanceId: string, stdAmt: number) => void;
  handleUpdateAllowanceAmount: (allowanceId: string, val: number) => void;
  handleAddAllowanceAturanRow: (allowanceId: string, currentList: any[]) => void;
  handleRemoveAllowanceAturanRow: (allowanceId: string, currentList: any[], idx: number) => void;
  handleUpdateTierField: (allowanceId: string, currentList: any[], idx: number, field: string, val: any) => void;
}

export const AllowanceItemRow: React.FC<AllowanceItemRowProps> = ({
  allowance,
  formData,
  allowanceOptions,
  availableAllowanceSelectOptions,
  getAllowanceCategoryAndFrequency,
  isTunjanganJabatanName,
  handleAllowanceSelectChange,
  handleRemoveAllowance,
  handleResetAllowanceToStandard,
  handleUpdateAllowanceAmount,
  handleAddAllowanceAturanRow,
  handleRemoveAllowanceAturanRow,
  handleUpdateTierField,
}) => {
  const isTJ = isTunjanganJabatanName(allowance.name);

  const matchedOpt = allowanceOptions.find(
    o => (allowance.ruleId && o.value === allowance.ruleId) || o.label.toLowerCase() === allowance.name.toLowerCase()
  );
  const ruleData = matchedOpt?.data || masterTunjangan.find(
    m => (allowance.ruleId && m.id === allowance.ruleId) || (m.name || m.nama || '').toLowerCase() === allowance.name.toLowerCase()
  );

  const catFreq = getAllowanceCategoryAndFrequency(allowance.name, ruleData);

  const isProrataRule = Boolean(
    ruleData?.metode_perhitungan === 'prorata' ||
    ruleData?.calculationModel === 'prorata' ||
    allowance.name.toUpperCase().includes('THR') ||
    allowance.name.toLowerCase().includes('hari raya')
  );

  const isPercentageRule = Boolean(
    isProrataRule ||
    (ruleData && (
      ruleData.metode_perhitungan === 'persentase' ||
      ruleData.ruleType === 'Percentage' ||
      ruleData.calculationModel === 'percentage' ||
      ruleData.dasar_perhitungan === 'Gaji Pokok' ||
      ruleData.dasar_perhitungan === 'gaji_pokok' ||
      ruleData.allowanceType === 'thr_religious' ||
      ruleData.satuan_nilai === 'persen'
    ))
  );

  let stdAmt: number | null = null;
  let stdLabel = '';
  let isLevelBased = false;

  if (isTJ) {
    const tjCalc = calculateTunjanganJabatan(formData.level, formData.basicSalary || 0);
    stdAmt = tjCalc.nominal;
    stdLabel = tjCalc.matchedLevelName || formData.level || 'Staff';
    isLevelBased = true;
  } else if (isProrataRule) {
    const pct = ruleData?.nilai || 100;
    stdAmt = Math.round((pct / 100) * (formData.basicSalary || 0));
  } else {
    if (matchedOpt) {
      if (matchedOpt.data) {
        const calc = calculateAllowancePreview(matchedOpt.data, {
          basicSalary: formData.basicSalary || 0,
          level: formData.level,
          serviceMonths: 12,
          daysAttended: 22,
          workingDaysInMonth: 25
        });
        if (calc && calc.amount > 0) {
          stdAmt = calc.amount;
        } else if (matchedOpt.data.nilai || matchedOpt.data.fixedAmount || matchedOpt.data.unitRate) {
          stdAmt = matchedOpt.data.nilai || matchedOpt.data.fixedAmount || matchedOpt.data.unitRate;
        }
      }
      if (stdAmt === null && matchedOpt.amount && matchedOpt.amount > 0) {
        stdAmt = matchedOpt.amount;
      }
    }
  }

  let currentAmt = allowance.amount;
  if ((currentAmt === undefined || currentAmt === 0) && stdAmt && stdAmt > 0) {
    currentAmt = stdAmt;
  }
  if (currentAmt === undefined) currentAmt = stdAmt || 0;

  const hasStandard = stdAmt !== null && stdAmt > 0;
  const isDiff = hasStandard && currentAmt !== stdAmt;

  let nominalLabel = 'Nominal';
  if (isPercentageRule) {
    const basic = formData.basicSalary || 0;
    let pctVal = 100;
    if (basic > 0) {
      pctVal = (currentAmt / basic) * 100;
    } else if (ruleData?.nilai || ruleData?.employeeShare) {
      pctVal = ruleData.nilai || ruleData.employeeShare || 100;
    }
    const rounded = Math.round(pctVal * 10) / 10;
    const pctString = rounded.toString().replace('.', ',');
    nominalLabel = `Nominal (${pctString}% Gaji Pokok)`;
  }

  const isBerjenjangMasaKerja = Boolean(
    (ruleData && (
      ruleData.metode_perhitungan === 'berjenjang' ||
      ruleData.calculationModel === 'tiered' ||
      ruleData.allowanceType === 'tiered_tenure'
    ) && (
      !ruleData.jenis_jenjang ||
      ruleData.jenis_jenjang === 'masa_kerja' ||
      ruleData.parameter_jenjang?.parameter === 'masa_kerja'
    )) ||
    allowance.name.toLowerCase().includes('bonus tahunan') ||
    (allowance.name.toLowerCase().includes('berjenjang') && allowance.name.toLowerCase().includes('masa kerja'))
  );

  const isAttendanceOrDaily = Boolean(
    catFreq.method === 'Kehadiran' ||
    catFreq.frequency === 'Harian' ||
    ruleData?.metode_perhitungan === 'unit_kehadiran' ||
    ruleData?.calculationModel === 'attendance' ||
    ruleData?.ruleType === 'Attendance' ||
    allowance.name?.toLowerCase().includes('harian') ||
    allowance.name?.toLowerCase().includes('kehadiran')
  );

  const currentSelectOptions = [...availableAllowanceSelectOptions];
  if (allowance.name && !currentSelectOptions.some(o => o.label.toLowerCase() === allowance.name.toLowerCase() || o.value === allowance.ruleId)) {
    currentSelectOptions.unshift({
      value: allowance.ruleId || allowance.name,
      label: allowance.name
    });
  }
  const matchingOpt = currentSelectOptions.find(o => o.value === allowance.ruleId || o.label.toLowerCase() === allowance.name.toLowerCase());
  const selectedOptionKey = matchingOpt ? matchingOpt.value : (allowance.ruleId || allowance.name || '');

  return (
    <div className="pb-4 border-b border-slate-200/70 last:border-b-0 last:pb-0 space-y-3">
      {isBerjenjangMasaKerja ? (
        <div className="space-y-3">
          {/* Nama Tunjangan Full Width with Trash Button */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                innerLabel="Nama Tunjangan"
                selectedTextColor="text-blue-700 font-bold text-xs sm:text-sm"
                value={selectedOptionKey}
                onChange={(e) => handleAllowanceSelectChange(allowance.id, e.target.value)}
                options={currentSelectOptions}
              />
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              title="Hapus baris tunjangan ini"
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-10 w-10 p-0 shrink-0 rounded-xl border border-slate-200/80" 
              onClick={() => handleRemoveAllowance(allowance.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* 2 Kolom Frekuensi | Metode */}
          <div className="grid grid-cols-2 gap-3">
            <div className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 flex flex-col justify-center min-h-[44px] shadow-2xs">
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal leading-tight">Frekuensi</span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">{catFreq.frequency}</span>
            </div>
            <div className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 flex flex-col justify-center min-h-[44px] shadow-2xs">
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal leading-tight">Metode</span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">{catFreq.method || 'Berjenjang'}</span>
            </div>
          </div>

          {/* Berjenjang Masa Kerja */}
          {(() => {
            const currentAturan = allowance.aturan || ruleData?.aturan || ruleData?.daftarJenjang || [];
            const defaultTierList = [
              { min: 0, max: 1, nilai: 25 },
              { min: 1, max: 3, nilai: 50 },
              { min: 3, max: 5, nilai: 75 },
              { min: 5, max: 8, nilai: 90 },
              { min: 8, max: null, nilai: 100 }
            ];
            const tierList = currentAturan.length > 0 ? currentAturan : defaultTierList;

            const showResetInTier = Boolean(isDiff || (allowance.aturan && allowance.aturan.length > 0));

            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-normal text-slate-600">
                    Jenjang Masa Kerja
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddAllowanceAturanRow(allowance.id, tierList)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah</span>
                    </button>
                    {showResetInTier && (
                      <>
                        <span className="text-slate-300 text-[11px] select-none">|</span>
                        <button
                          type="button"
                          onClick={() => handleResetAllowanceToStandard(allowance.id, stdAmt || 0)}
                          className="text-[11px] font-normal text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 group cursor-pointer"
                          title={isLevelBased ? 'Gunakan Standar Level' : 'Gunakan Standar Tunjangan'}
                        >
                          <span className="group-hover:underline">Sesuaikan</span>
                          <RotateCcw className="w-3.5 h-3.5 text-blue-600 group-hover:-rotate-45 transition-transform shrink-0" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {tierList.map((tier: any, idx: number) => {
                    const basicSal = formData.basicSalary || 0;
                    const pct = tier.nilai !== undefined ? tier.nilai : (tier.persentaseGaji || 0);
                    const calcNominal = tier.nominal !== undefined && tier.nominal !== null && tier.nominal > 0
                      ? tier.nominal
                      : Math.round((pct / 100) * basicSal);

                    return (
                      <div key={idx} className="grid grid-cols-12 gap-1.5 items-center">
                        {/* Kolom 1 & 2: [Tahun] - [Tahun] : */}
                        <div className="col-span-4 flex items-center gap-1">
                          <input
                            type="text"
                            inputMode="numeric"
                            className="w-9 sm:w-11 bg-white border border-slate-200 rounded-md px-1 py-1 text-xs text-center font-bold text-slate-800 focus:border-blue-500 focus:outline-none shrink-0"
                            placeholder=""
                            value={tier.min !== undefined && tier.min !== null ? tier.min : ''}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              handleUpdateTierField(allowance.id, tierList, idx, 'min', raw === '' ? 0 : parseInt(raw, 10));
                            }}
                          />
                          <span className="text-slate-400 font-bold text-xs shrink-0">-</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            className="w-9 sm:w-11 bg-white border border-slate-200 rounded-md px-1 py-1 text-xs text-center font-bold text-slate-800 focus:border-blue-500 focus:outline-none shrink-0"
                            placeholder=""
                            value={tier.max !== undefined && tier.max !== null ? tier.max : ''}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              handleUpdateTierField(allowance.id, tierList, idx, 'max', raw === '' ? null : parseInt(raw, 10));
                            }}
                          />
                          <span className="text-slate-400 font-bold text-xs shrink-0 ml-0.5">:</span>
                        </div>

                        {/* Kolom 3: [Nominal] */}
                        <div className="col-span-7">
                          <CurrencyInput
                            compactPrefix
                            placeholder=""
                            value={calcNominal}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              handleUpdateTierField(allowance.id, tierList, idx, 'nominal', val);
                            }}
                          />
                        </div>

                        {/* Action: Delete tier */}
                        <div className="col-span-1 flex justify-center">
                          {tierList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAllowanceAturanRow(allowance.id, tierList, idx)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1"
                              title="Hapus baris tier ini"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Nama Tunjangan Full Width with Trash Button */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                innerLabel="Nama Tunjangan"
                selectedTextColor="text-blue-700 font-bold text-xs sm:text-sm"
                value={selectedOptionKey}
                onChange={(e) => handleAllowanceSelectChange(allowance.id, e.target.value)}
                options={currentSelectOptions}
              />
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              title="Hapus baris tunjangan ini"
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-10 w-10 p-0 shrink-0 rounded-xl border border-slate-200/80" 
              onClick={() => handleRemoveAllowance(allowance.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* 2 Kolom Frekuensi | Metode */}
          <div className="grid grid-cols-2 gap-3">
            <div className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 flex flex-col justify-center min-h-[44px] shadow-2xs">
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal leading-tight">Frekuensi</span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">{catFreq.frequency}</span>
            </div>
            <div className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 flex flex-col justify-center min-h-[44px] shadow-2xs">
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal leading-tight">Metode</span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">{catFreq.method || '-'}</span>
            </div>
          </div>

          {/* Nominal Input */}
          {isAttendanceOrDaily ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <CurrencyInput
                  compactPrefix
                  innerLabel={`Nominal/${catFreq.method && catFreq.method !== '-' ? catFreq.method : 'Kehadiran'}`}
                  headerRight={
                    isDiff && stdAmt !== null ? (
                      <button
                        type="button"
                        onClick={() => handleResetAllowanceToStandard(allowance.id, stdAmt!)}
                        className="text-blue-600 hover:text-blue-700 p-0.5 rounded transition-colors group cursor-pointer"
                        title={isLevelBased ? 'Gunakan Standar Level' : 'Gunakan Standar Tunjangan'}
                      >
                        <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 group-hover:-rotate-45 transition-transform" />
                      </button>
                    ) : null
                  }
                  placeholder=""
                  value={allowance.name ? (currentAmt !== undefined && currentAmt !== null ? currentAmt : '') : (allowance.amount || '')}
                  onChange={(e) => handleUpdateAllowanceAmount(allowance.id, Number(e.target.value))}
                />
              </div>
              <div>
                <CurrencyInput
                  compactPrefix
                  innerLabel="Est. Bulanan (21 Hari)"
                  headerRight={
                    isDiff && stdAmt !== null ? (
                      <button
                        type="button"
                        onClick={() => handleResetAllowanceToStandard(allowance.id, stdAmt!)}
                        className="text-blue-600 hover:text-blue-700 p-0.5 rounded transition-colors group cursor-pointer"
                        title={isLevelBased ? 'Gunakan Standar Level' : 'Gunakan Standar Tunjangan'}
                      >
                        <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 group-hover:-rotate-45 transition-transform" />
                      </button>
                    ) : null
                  }
                  placeholder=""
                  value={
                    allowance.name
                      ? (currentAmt !== undefined && currentAmt !== null && currentAmt > 0
                          ? Math.round(currentAmt * 21)
                          : (allowance.amount ? Math.round(allowance.amount * 21) : ''))
                      : ''
                  }
                  onChange={(e) => {
                    const totalVal = Number(e.target.value);
                    const dailyVal = totalVal > 0 ? Math.round(totalVal / 21) : 0;
                    handleUpdateAllowanceAmount(allowance.id, dailyVal);
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <CurrencyInput
                innerLabel={nominalLabel}
                headerRight={
                  isDiff && stdAmt !== null ? (
                    <button
                      type="button"
                      onClick={() => handleResetAllowanceToStandard(allowance.id, stdAmt!)}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors shrink-0 text-right group"
                      title={isLevelBased ? 'Gunakan Standar Level' : 'Gunakan Standar Tunjangan'}
                    >
                      <span className="flex flex-col text-right leading-none text-[9.5px] sm:text-[10.5px] font-normal text-blue-600 group-hover:underline">
                        <span>Sesuaikan</span>
                        <span className="mt-0.5">Ulang</span>
                      </span>
                      <RotateCcw className="w-5 h-5 text-blue-600 shrink-0 group-hover:-rotate-45 transition-transform" />
                    </button>
                  ) : null
                }
                placeholder=""
                value={allowance.name ? (currentAmt !== undefined && currentAmt !== null ? currentAmt : '') : (allowance.amount || '')}
                onChange={(e) => handleUpdateAllowanceAmount(allowance.id, Number(e.target.value))}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
