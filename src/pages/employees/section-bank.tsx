import React, { useState, useEffect } from 'react';
import { Input, Select, ComboboxInput, BankAccountInput, ComboboxOption } from '../../components/ui';
import { Employee } from '../../types';
import { PAYMENT_METHOD_OPTIONS } from './constants';
import { cn } from '../../utils/cn';

export interface BankSectionProps {
  formData: Partial<Employee>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
  currentFinancialOptions: ComboboxOption[];
  isEwalletMethod: boolean;
  isBankMethod: boolean;
}

export function BankSection({
  formData,
  setFormData,
  currentFinancialOptions,
  isEwalletMethod,
  isBankMethod
}: BankSectionProps) {
  const [useEmployeeName, setUseEmployeeName] = useState<boolean>(() => {
    if (!formData.bankAccountHolder && !formData.fullName) return true;
    if (!formData.bankAccountHolder) return true;
    return formData.bankAccountHolder === (formData.fullName || '');
  });

  // Keep bankAccountHolder synced with fullName when useEmployeeName is true
  useEffect(() => {
    if (useEmployeeName) {
      const targetName = formData.fullName || '';
      if (formData.bankAccountHolder !== targetName) {
        setFormData(prev => ({ ...prev, bankAccountHolder: targetName }));
      }
    }
  }, [formData.fullName, useEmployeeName, setFormData]);

  const handleToggle = () => {
    const nextState = !useEmployeeName;
    setUseEmployeeName(nextState);
    if (nextState) {
      // Toggled ON: sync bankAccountHolder with employee's full name
      setFormData(prev => ({ ...prev, bankAccountHolder: prev.fullName || '' }));
    } else {
      // Toggled OFF: clear bankAccountHolder text
      setFormData(prev => ({ ...prev, bankAccountHolder: '' }));
    }
  };

  const handleHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setFormData(prev => ({ ...prev, bankAccountHolder: newVal }));
    if (useEmployeeName && newVal !== (formData.fullName || '')) {
      setUseEmployeeName(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
      <Select
        label="Metode Pembayaran Gaji"
        value={formData.paymentMethod || ''}
        onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
        options={PAYMENT_METHOD_OPTIONS}
      />
      
      <ComboboxInput
        label={
          isEwalletMethod 
            ? "Penyedia E-Wallet / Dompet Digital" 
            : isBankMethod 
            ? "Nama Bank" 
            : "Nama Bank / Penyedia E-Wallet"
        }
        value={formData.bankName || ''}
        onChange={val => setFormData({...formData, bankName: val})}
        onSelectOption={opt => setFormData({...formData, bankName: opt.value || opt.label})}
        options={currentFinancialOptions}
        placeholder=""
        customPromptText={
          isEwalletMethod 
            ? "sebagai E-Wallet kustom" 
            : isBankMethod 
            ? "sebagai Nama Bank kustom" 
            : "sebagai Bank/E-Wallet kustom"
        }
      />

      <BankAccountInput 
        label="Nomor Rekening / Nomor Akun / VA" 
        value={formData.bankAccount || ''} 
        onChange={e => setFormData({...formData, bankAccount: e.target.value})} 
        placeholder="" 
      />

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-normal text-slate-600">Nama Pemilik</label>
          <div 
            onClick={handleToggle}
            className="flex items-center gap-1.5 cursor-pointer select-none group"
            title="Gunakan Nama Karyawan"
          >
            <span className={cn(
              "text-[11px] font-normal transition-colors",
              useEmployeeName ? "text-blue-600" : "text-slate-400"
            )}>
              Gunakan Nama Karyawan
            </span>
            <div
              role="switch"
              aria-checked={useEmployeeName}
              className={cn(
                "relative inline-flex h-4 sm:h-4.5 w-7 sm:w-8 shrink-0 items-center cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                useEmployeeName ? "bg-blue-600" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-3 sm:h-3.5 w-3 sm:w-3.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                  useEmployeeName ? "translate-x-3 sm:translate-x-3.5" : "translate-x-0"
                )}
              />
            </div>
          </div>
        </div>
        <Input 
          value={useEmployeeName ? (formData.fullName || '') : (formData.bankAccountHolder || '')} 
          onChange={handleHolderChange} 
          placeholder="" 
        />
      </div>

      <Input 
        label="Kantor Cabang Bank (Opsional)" 
        value={formData.bankBranch || ''} 
        onChange={e => setFormData({...formData, bankBranch: e.target.value})} 
        placeholder="" 
      />

      <div className="flex items-center text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 self-end">
        <span>Data rekening ini digunakan untuk transfer payroll bulanan dan tercetak pada slip gaji resmi karyawan.</span>
      </div>
    </div>
  );
}
