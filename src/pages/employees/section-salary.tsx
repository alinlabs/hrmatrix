import React from 'react';
import { RotateCcw } from 'lucide-react';
import { CurrencyInput, ComboboxOption } from '../../components/ui';
import { Employee } from '../../types';
import { calculateTunjanganJabatan, isTunjanganJabatanName } from '../../services/tunjanganJabatanService';
import { getPositionDetails, getDefaultSalaryForLevel } from '../../services/positionService';
import { AllowanceItemRow } from './row-allowance-item';

export interface SalarySectionProps {
  formData: Partial<Employee>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
  allowanceOptions: ComboboxOption[];
  availableAllowanceSelectOptions: { value: string; label: string; subLabel?: string }[];
  groupedAllowances: {
    groups: { category: string; items: any[] }[];
    unselected: any[];
  };
  getAllowanceCategoryAndFrequency: (allowanceName: string, ruleData?: any) => { category: string; frequency: string; method?: string };
  isTunjanganJabatanName: (name?: string) => boolean;
  handleAllowanceSelectChange: (allowanceId: string, selectedValue: string) => void;
  handleRemoveAllowance: (id: string) => void;
  handleResetAllowanceToStandard: (id: string, targetAmount: number) => void;
  handleUpdateAllowanceAmount: (id: string, amount: number) => void;
  handleAddAllowanceAturanRow: (allowanceId: string, currentTierList: any[]) => void;
  handleRemoveAllowanceAturanRow: (allowanceId: string, currentTierList: any[], index: number) => void;
  handleUpdateTierField: (allowanceId: string, currentTierList: any[], index: number, field: string, value: any) => void;
  handleAddAllowanceRow: () => void;
}

export function SalarySection({
  formData,
  setFormData,
  allowanceOptions,
  availableAllowanceSelectOptions,
  groupedAllowances,
  getAllowanceCategoryAndFrequency,
  isTunjanganJabatanName: checkIsTJ,
  handleAllowanceSelectChange,
  handleRemoveAllowance,
  handleResetAllowanceToStandard,
  handleUpdateAllowanceAmount,
  handleAddAllowanceAturanRow,
  handleRemoveAllowanceAturanRow,
  handleUpdateTierField,
  handleAddAllowanceRow
}: SalarySectionProps) {
  const posDetails = formData.positionId ? getPositionDetails(formData.positionId) : null;
  const stdSalary = posDetails?.salary || posDetails?.salaryRange?.standar || getDefaultSalaryForLevel(formData.level || 'Staff');
  const isSalDiff = Boolean(stdSalary && formData.basicSalary && formData.basicSalary !== stdSalary);

  const handleResetSalary = () => {
    if (!stdSalary) return;
    const newSal = stdSalary;
    setFormData(prev => {
      const tjCalc = calculateTunjanganJabatan(prev.level, newSal);
      const updatedAllowances = (prev.allowances || []).map(a => {
        if (checkIsTJ(a.name) && tjCalc.jenjang?.tipeNilai === 'persentase') {
          return { ...a, amount: tjCalc.nominal };
        }
        const matchedOpt = allowanceOptions.find(o => (a.ruleId && o.value === a.ruleId) || o.label.toLowerCase() === a.name.toLowerCase());
        const rData = matchedOpt?.data;
        const isProrataOrPercent = Boolean(
          rData?.metode_perhitungan === 'prorata' ||
          rData?.calculationModel === 'prorata' ||
          rData?.metode_perhitungan === 'persentase' ||
          rData?.ruleType === 'Percentage' ||
          a.name.toUpperCase().includes('THR') ||
          a.name.toLowerCase().includes('hari raya')
        );
        if (isProrataOrPercent) {
          const pct = rData?.nilai || rData?.employeeShare || 100;
          const newAmt = Math.round((pct / 100) * newSal);
          return { ...a, amount: newAmt };
        }
        return a;
      });
      return {
        ...prev,
        basicSalary: newSal,
        allowances: updatedAllowances
      };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <CurrencyInput 
          innerLabel="Gaji Pokok"
          headerRight={
            isSalDiff ? (
              <button
                type="button"
                onClick={handleResetSalary}
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors shrink-0 text-right group cursor-pointer"
                title="Gunakan Standar Gaji Pokok"
              >
                <span className="flex flex-col text-right leading-none text-[9.5px] sm:text-[10.5px] font-normal text-blue-600 group-hover:underline">
                  <span>Sesuaikan</span>
                  <span className="mt-0.5">Ulang</span>
                </span>
                <RotateCcw className="w-5 h-5 text-blue-600 shrink-0 group-hover:-rotate-45 transition-transform" />
              </button>
            ) : null
          }
          value={formData.basicSalary || ''} 
          onChange={e => {
            const newSal = Number(e.target.value);
            setFormData(prev => {
              const tjCalc = calculateTunjanganJabatan(prev.level, newSal);
              const updatedAllowances = (prev.allowances || []).map(a => {
                if (checkIsTJ(a.name) && tjCalc.jenjang?.tipeNilai === 'persentase') {
                  return { ...a, amount: tjCalc.nominal };
                }
                const matchedOpt = allowanceOptions.find(o => (a.ruleId && o.value === a.ruleId) || o.label.toLowerCase() === a.name.toLowerCase());
                const rData = matchedOpt?.data;
                const isProrataOrPercent = Boolean(
                  rData?.metode_perhitungan === 'prorata' ||
                  rData?.calculationModel === 'prorata' ||
                  rData?.metode_perhitungan === 'persentase' ||
                  rData?.ruleType === 'Percentage' ||
                  a.name.toUpperCase().includes('THR') ||
                  a.name.toLowerCase().includes('hari raya')
                );
                if (isProrataOrPercent) {
                  const pct = rData?.nilai || rData?.employeeShare || 100;
                  const newAmt = Math.round((pct / 100) * newSal);
                  if (!a.amount || a.amount === 0 || (prev.basicSalary && a.amount === prev.basicSalary)) {
                    return { ...a, amount: newAmt };
                  }
                }
                return a;
              });
              return {
                ...prev,
                basicSalary: newSal,
                allowances: updatedAllowances
              };
            });
          }} 
          placeholder=""
        />
      </div>
      <div>
        {!formData.allowances || formData.allowances.length === 0 ? (
          <button
            type="button"
            onClick={handleAddAllowanceRow}
            className="w-full py-4 px-4 rounded-xl border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 text-center transition-all duration-150 cursor-pointer group block"
          >
            <p className="font-semibold text-xs text-slate-700 group-hover:text-blue-600 transition-colors">Belum ada tunjangan.</p>
            <p className="text-slate-400 group-hover:text-blue-500 text-[11px] mt-0.5 transition-colors">Klik untuk menambahkan tunjangan.</p>
          </button>
        ) : (
          <div className="space-y-4">
            {/* Tombol Card Tambah Tunjangan selalu berada di paling atas (tepat di bawah kolom Gaji Pokok) */}
            <div>
              <button
                type="button"
                onClick={handleAddAllowanceRow}
                className="w-full py-3 px-4 rounded-xl bg-white border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 text-blue-600 hover:text-blue-700 font-semibold text-xs transition-all duration-150 cursor-pointer text-center block"
              >
                Tambah Tunjangan
              </button>
            </div>

            {/* Unselected / Newly Added Allowances (Selalu muncul di bawah tombol Tambah sebelum dipilih dan terklasifikasikan ke grup) */}
            {groupedAllowances.unselected.length > 0 && (
              <div className="space-y-3 pt-1">
                {groupedAllowances.unselected.map((allowance) => (
                  <AllowanceItemRow
                    key={allowance.id}
                    allowance={allowance}
                    formData={formData}
                    allowanceOptions={allowanceOptions}
                    availableAllowanceSelectOptions={availableAllowanceSelectOptions}
                    getAllowanceCategoryAndFrequency={getAllowanceCategoryAndFrequency}
                    isTunjanganJabatanName={checkIsTJ}
                    handleAllowanceSelectChange={handleAllowanceSelectChange}
                    handleRemoveAllowance={handleRemoveAllowance}
                    handleResetAllowanceToStandard={handleResetAllowanceToStandard}
                    handleUpdateAllowanceAmount={handleUpdateAllowanceAmount}
                    handleAddAllowanceAturanRow={handleAddAllowanceAturanRow}
                    handleRemoveAllowanceAturanRow={handleRemoveAllowanceAturanRow}
                    handleUpdateTierField={handleUpdateTierField}
                  />
                ))}
              </div>
            )}

            {/* Render Category Groups (Only shown when allowances of that category exist) */}
            {groupedAllowances.groups.map((group) => (
              <div key={group.category} className="space-y-3">
                <div className="pt-2 pb-0.5 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 tracking-wide">
                    {group.category}
                  </span>
                  <div className="h-px bg-slate-200/80 flex-1" />
                </div>
                <div className="space-y-3">
                  {group.items.map((allowance) => (
                    <AllowanceItemRow
                      key={allowance.id}
                      allowance={allowance}
                      formData={formData}
                      allowanceOptions={allowanceOptions}
                      availableAllowanceSelectOptions={availableAllowanceSelectOptions}
                      getAllowanceCategoryAndFrequency={getAllowanceCategoryAndFrequency}
                      isTunjanganJabatanName={checkIsTJ}
                      handleAllowanceSelectChange={handleAllowanceSelectChange}
                      handleRemoveAllowance={handleRemoveAllowance}
                      handleResetAllowanceToStandard={handleResetAllowanceToStandard}
                      handleUpdateAllowanceAmount={handleUpdateAllowanceAmount}
                      handleAddAllowanceAturanRow={handleAddAllowanceAturanRow}
                      handleRemoveAllowanceAturanRow={handleRemoveAllowanceAturanRow}
                      handleUpdateTierField={handleUpdateTierField}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
