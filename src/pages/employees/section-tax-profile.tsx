import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { DEFAULT_PAYROLL_RULES } from '../../data/master';
import { 
  Trash2, 
  CheckCircle2, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Input, Select, NpwpInput, ComboboxOption, CurrencyInput } from '../../components/ui';
import { Employee, TaxProfile, TaxHistoryRecord } from '../../types';
import { 
  PTKP_DATA, 
  EMPLOYEE_TAX_TYPES, 
  TAX_METHODS, 
  calculateEmployeeTaxSimulation,
  calculateEmployeeProgressiveTaxSimulation 
} from '../../services/taxBpjsService';
import { mapEmployeeTypeToTaxType } from '../../data/master';
import { PtkpCustomSelect } from './select-ptkp-custom';
import { isFixedAllowance } from '../../utils/allowanceClassification';
import { cn } from '../../utils/cn';

// Shared NumberFormatter instance for IDR currency
const idrFormatter = new Intl.NumberFormat('id-ID');
const formatIdr = (val: number) => idrFormatter.format(val);

interface TaxProfileSectionProps {
  formData: Partial<Employee>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
  taxOptions?: ComboboxOption[];
}

export function TaxProfileSection({ formData, setFormData, taxOptions = [] }: TaxProfileSectionProps) {
  const [showInfoCard, setShowInfoCard] = React.useState(false);
  const [isSimulationExpanded, setIsSimulationExpanded] = React.useState(false);
  const [openYearPickerId, setOpenYearPickerId] = React.useState<string | null>(null);
  const yearPickerContainerRef = React.useRef<HTMLDivElement>(null);
  const [activeInfo, setActiveInfo] = React.useState<Record<string, boolean>>({
    ptkp: false,
    employeeType: false,
    taxMethod: false,
    taxHistory: false,
  });

  // Only bind click-outside listeners when the year picker popup is actually open
  React.useEffect(() => {
    if (!openYearPickerId) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (yearPickerContainerRef.current && !yearPickerContainerRef.current.contains(event.target as Node)) {
        setOpenYearPickerId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [openYearPickerId]);

  const [isNikSynced, setIsNikSynced] = React.useState<boolean>(() => {
    if (!formData.npwp && !formData.nik) return true;
    if (!formData.npwp) return true;
    return formData.npwp === formData.nik;
  });

  // Synchronize NPWP when NIK is changed if synced mode is active
  React.useEffect(() => {
    if (isNikSynced) {
      const targetNik = formData.nik || '';
      if (formData.npwp !== targetNik || formData.taxProfile?.npwp !== targetNik) {
        setFormData(prev => ({
          ...prev,
          npwp: targetNik,
          taxProfile: {
            ...(prev.taxProfile || {
              ruleId: undefined,
              nik: targetNik,
              npwp: targetNik,
              ptkpStatus: prev.taxStatus || '',
              dependents: prev.dependents,
              employeeType: '',
              taxMethod: '' as any,
              hasNpwp: true,
              taxHistory: []
            }),
            nik: targetNik,
            npwp: targetNik,
            hasNpwp: Boolean(targetNik)
          }
        }));
      }
    }
  }, [formData.nik, isNikSynced, setFormData]);

  const handleToggleSyncNik = () => {
    const nextState = !isNikSynced;
    setIsNikSynced(nextState);
    if (nextState) {
      const targetNik = formData.nik || '';
      setFormData(prev => ({
        ...prev,
        npwp: targetNik,
        taxProfile: {
          ...(prev.taxProfile || taxProfile),
          nik: targetNik,
          npwp: targetNik,
          hasNpwp: Boolean(targetNik)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        npwp: '',
        taxProfile: {
          ...(prev.taxProfile || taxProfile),
          nik: prev.nik || '',
          npwp: '',
          hasNpwp: false
        }
      }));
    }
  };

  const handleNpwpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    const hasNpwp = Boolean(newVal && newVal.trim().length > 0);
    setFormData(prev => ({
      ...prev,
      npwp: newVal,
      taxProfile: {
        ...(prev.taxProfile || taxProfile),
        npwp: newVal,
        hasNpwp
      }
    }));
    if (isNikSynced && newVal !== (formData.nik || '')) {
      setIsNikSynced(false);
    }
  };

  const toggleInfo = (key: string) => {
    setActiveInfo(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const allRulesDb = useLiveQuery(() => db.payrollRules.toArray());
  const allRules = (allRulesDb && allRulesDb.length > 0) ? allRulesDb : DEFAULT_PAYROLL_RULES;

  const mainEmployeeType = formData.employeeType;
  const isSyncedFromStatus = Boolean(mainEmployeeType);
  const syncedTaxType = isSyncedFromStatus ? mapEmployeeTypeToTaxType(mainEmployeeType) : undefined;

  const taxProfile: TaxProfile = {
    ...(formData.taxProfile || {
      ruleId: undefined,
      nik: formData.nik || '',
      npwp: formData.npwp || '',
      ptkpStatus: formData.taxStatus || '',
      dependents: formData.dependents,
      employeeType: syncedTaxType || '',
      taxMethod: '' as any,
      hasNpwp: true,
      taxHistory: []
    }),
    ptkpStatus: formData.taxProfile?.ptkpStatus ?? (formData.taxStatus || ''),
    employeeType: (formData.taxProfile?.employeeType ?? (syncedTaxType || '')) as any,
    taxMethod: (formData.taxProfile?.taxMethod || '') as any,
    dependents: formData.taxProfile?.dependents ?? formData.dependents,
    hasNpwp: formData.taxProfile?.hasNpwp ?? Boolean(formData.taxProfile?.npwp || formData.npwp)
  };

  const activeTaxRule = allRules.find(r => r.id === taxProfile.ruleId);
  const isRuleSelected = Boolean(taxProfile.ruleId);
  const isProgressive = isRuleSelected && Boolean(
    activeTaxRule?.name?.toLowerCase().includes('progresif') || 
    activeTaxRule?.name?.toLowerCase().includes('pasal 17') || 
    activeTaxRule?.id?.includes('pasal17')
  );
  const isTerSelected = !isProgressive;

  // Pajak dilaporkan & disimulasikan murni berbasis Gaji Pokok + Tunjangan Tetap
  const basicSalary = formData.basicSalary || 0;
  const fixedAllowanceList = (formData.allowances || []).filter(
    a => typeof a.amount === 'number' && a.amount > 0 && isFixedAllowance(a)
  );
  const totalAllowances = (formData.allowances !== undefined && formData.allowances !== null)
    ? fixedAllowanceList.reduce((acc, a) => acc + (a.amount || 0), 0)
    : (formData.fixedAllowance || 0);
  const totalTaxableGross = basicSalary + totalAllowances;

  const simulation = React.useMemo(() => {
    return isProgressive
      ? calculateEmployeeProgressiveTaxSimulation(
          totalTaxableGross,
          taxProfile.ptkpStatus,
          taxProfile.taxMethod,
          taxProfile.hasNpwp
        )
      : calculateEmployeeTaxSimulation(
          totalTaxableGross,
          taxProfile.ptkpStatus,
          taxProfile.taxMethod,
          taxProfile.hasNpwp
        );
  }, [isProgressive, totalTaxableGross, taxProfile.ptkpStatus, taxProfile.taxMethod, taxProfile.hasNpwp]);

  const effectiveGrossMonthly = totalTaxableGross + (taxProfile.taxMethod === 'Gross Up' ? simulation.taxAllowance : 0);
  const annualGross = effectiveGrossMonthly * 12;
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
        taxAmount: b1 * 0.05
      });
      remaining = Math.max(0, remaining - b1);
    }

    if (remaining > 0) {
      const b2 = Math.min(remaining, 190000000);
      brackets.push({
        lapisName: 'Lapis 2',
        ratePercent: '15%',
        pkpAmount: b2,
        taxAmount: b2 * 0.15
      });
      remaining = Math.max(0, remaining - b2);
    }

    if (remaining > 0) {
      const b3 = Math.min(remaining, 250000000);
      brackets.push({
        lapisName: 'Lapis 3',
        ratePercent: '25%',
        pkpAmount: b3,
        taxAmount: b3 * 0.25
      });
      remaining = Math.max(0, remaining - b3);
    }

    if (remaining > 0) {
      const b4 = Math.min(remaining, 4500000000);
      brackets.push({
        lapisName: 'Lapis 4',
        ratePercent: '30%',
        pkpAmount: b4,
        taxAmount: b4 * 0.30
      });
      remaining = Math.max(0, remaining - b4);
    }

    if (remaining > 0) {
      brackets.push({
        lapisName: 'Lapis 5',
        ratePercent: '35%',
        pkpAmount: remaining,
        taxAmount: remaining * 0.35
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
    return Math.max(0, Math.round(annualProgressiveTax - (simulation.pph21Monthly * 11)));
  }, [annualProgressiveTax, simulation.pph21Monthly]);

  const formatPercentVal = (rateVal: number): string => {
    const formatted = rateVal.toFixed(2);
    if (formatted.endsWith('.00')) {
      return `${Math.round(rateVal)}%`;
    }
    return `${Number(formatted.replace(/\.?0+$/, ''))}%`;
  };

  const rawTerRateVal = isProgressive 
    ? (annualGross > 0 ? (annualProgressiveTax / annualGross) * 100 : 0) 
    : simulation.terRate * 100;
  const formattedTerRate = formatPercentVal(rawTerRateVal);

  const handlePtkpChange = (newPtkp: string) => {
    const matched = PTKP_DATA.find(p => p.code === newPtkp);
    const deps = matched ? matched.dependents : (newPtkp.includes('/') ? Number(newPtkp.split('/').pop()) || 0 : 0);
    const terCat = matched ? matched.terCategory : 'A';

    setFormData(prev => ({
      ...prev,
      taxStatus: newPtkp,
      dependents: deps,
      taxProfile: {
        ...(prev.taxProfile || taxProfile),
        ptkpStatus: newPtkp,
        dependents: deps,
        terCategory: terCat
      }
    }));
  };

  // Ensure dependents and terCategory are always strictly synchronized from ptkpStatus
  const currentPtkp = taxProfile.ptkpStatus || formData.taxStatus;
  const currentDeps = formData.dependents ?? taxProfile.dependents;
  const currentTer = taxProfile.terCategory;

  React.useEffect(() => {
    if (currentPtkp) {
      const matched = PTKP_DATA.find(p => p.code === currentPtkp);
      const expectedDeps = matched ? matched.dependents : (currentPtkp.includes('/') ? Number(currentPtkp.split('/').pop()) || 0 : 0);
      const expectedTer = matched ? matched.terCategory : 'A';

      if (currentDeps !== expectedDeps || currentTer !== expectedTer) {
        setFormData(prev => ({
          ...prev,
          dependents: expectedDeps,
          taxProfile: {
            ...(prev.taxProfile || taxProfile),
            dependents: expectedDeps,
            terCategory: expectedTer
          }
        }));
      }
    }
  }, [currentPtkp, currentDeps, currentTer, setFormData]);

  const handleTaxMethodChange = (method: 'Gross' | 'Gross Up' | 'Nett') => {
    setFormData(prev => ({
      ...prev,
      taxProfile: {
        ...(prev.taxProfile || taxProfile),
        taxMethod: method
      }
    }));
  };

  const handleEmployeeTypeChange = (type: any) => {
    setFormData(prev => ({
      ...prev,
      taxProfile: {
        ...(prev.taxProfile || taxProfile),
        employeeType: type
      }
    }));
  };

  const updateProfile = (field: string, val: any) => {
    setFormData(prev => ({
      ...prev,
      taxProfile: {
        ...(prev.taxProfile || taxProfile),
        [field]: val
      }
    }));
  };

  const handleAddTaxHistory = () => {
    const currentYear = new Date().getFullYear();
    const newRecord: TaxHistoryRecord = {
      id: Math.random().toString(36).substring(2, 9),
      year: currentYear,
      period: '',
      taxableIncome: totalTaxableGross * 12,
      taxPaid: simulation.pph21Monthly * 12,
      taxMethod: taxProfile.taxMethod,
      notes: 'Bukti Potong PPh 21 Formulir 1721-A1',
      proofDocumentUrl: ''
    };

    setFormData(prev => ({
      ...prev,
      taxProfile: {
        ...(prev.taxProfile || taxProfile),
        taxHistory: [newRecord, ...(prev.taxProfile?.taxHistory || [])]
      }
    }));
  };

  const handleRemoveTaxHistory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      taxProfile: {
        ...(prev.taxProfile || taxProfile),
        taxHistory: (prev.taxProfile?.taxHistory || []).filter(h => h.id !== id)
      }
    }));
  };

  const handleUpdateTaxHistory = (id: string, field: keyof TaxHistoryRecord, value: any) => {
    setFormData(prev => ({
      ...prev,
      taxProfile: {
        ...(prev.taxProfile || taxProfile),
        taxHistory: (prev.taxProfile?.taxHistory || []).map(h => h.id === id ? { ...h, [field]: value } : h)
      }
    }));
  };

  return (
    <div className="space-y-4">
      {/* NPWP Field (Diatas Regulasi Pajak) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[11px] font-normal text-slate-600">NPWP</label>
          <div 
            onClick={handleToggleSyncNik}
            className="flex items-center gap-1.5 cursor-pointer select-none group"
            title="Samakan dengan NIK"
          >
            <span className={cn(
              "text-[11px] font-normal transition-colors",
              isNikSynced ? "text-blue-600" : "text-slate-400"
            )}>
              Samakan dengan NIK
            </span>
            <div
              role="switch"
              aria-checked={isNikSynced}
              className={cn(
                "relative inline-flex h-4 sm:h-4.5 w-7 sm:w-8 shrink-0 items-center cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                isNikSynced ? "bg-blue-600" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-3 sm:h-3.5 w-3 sm:w-3.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                  isNikSynced ? "translate-x-3 sm:translate-x-3.5" : "translate-x-0"
                )}
              />
            </div>
          </div>
        </div>
        <NpwpInput 
          value={isNikSynced ? (formData.nik || '') : (formData.npwp || '')} 
          onChange={handleNpwpInputChange} 
          placeholder="" 
        />
      </div>

      {/* Main Grid Inputs */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[11px] font-normal text-slate-600">Regulasi Pajak</label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500">
              Pajak Aktif
            </span>
            <button
              type="button"
              onClick={() => setShowInfoCard(prev => !prev)}
              className="p-0.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
              title={showInfoCard ? "Klik untuk menyembunyikan info regulasi" : "Klik untuk menampilkan info regulasi"}
            >
              <Info 
                className={`w-4 h-4 transition-colors ${showInfoCard ? 'text-blue-500 fill-blue-50' : 'text-slate-400 hover:text-slate-600'}`} 
              />
            </button>
          </div>
        </div>

        {/* 2 Cards in 1 Row: Tarif Efektif | Tarif Progresif */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Tarif Efektif */}
          <button
            type="button"
            onClick={() => {
              const terRule = allRules.find(r => r.id === 'rule_pph21_1' || (r.category === 'Tax' && !r.name?.toLowerCase().includes('progresif') && !r.name?.toLowerCase().includes('pasal 17')));
              updateProfile('ruleId', terRule?.id || 'rule_pph21_1');
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer focus:outline-none opacity-100 ${
              isTerSelected
                ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600'
                : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="min-w-0 flex-1">
              <span className={`font-bold text-xs block truncate ${isTerSelected ? 'text-blue-600' : 'text-slate-900'}`}>
                Tarif Efektif
              </span>
              <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">PMK No. 168/2023 (TER A, B, C)</span>
            </div>
            {isTerSelected && (
              <CheckCircle2 className="w-4 h-4 text-white fill-blue-600 shrink-0 ml-1" />
            )}
          </button>

          {/* Card 2: Tarif Progresif */}
          <button
            type="button"
            onClick={() => {
              const progRule = allRules.find(r => r.id === 'rule_pph21_pasal17' || r.name?.toLowerCase().includes('progresif') || r.name?.toLowerCase().includes('pasal 17'));
              updateProfile('ruleId', progRule?.id || 'rule_pph21_pasal17');
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer focus:outline-none opacity-100 ${
              isProgressive
                ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600'
                : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="min-w-0 flex-1">
              <span className={`font-bold text-xs block truncate ${isProgressive ? 'text-blue-600' : 'text-slate-900'}`}>
                Tarif Progresif
              </span>
              <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">Pasal 17 UU HPP (5 Lapis PKP)</span>
            </div>
            {isProgressive && (
              <CheckCircle2 className="w-4 h-4 text-white fill-blue-600 shrink-0 ml-1" />
            )}
          </button>
        </div>

        {/* Active Tax Rule Context & Impact Card */}
        {activeTaxRule && showInfoCard && (
          <div className="mt-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 animate-in fade-in duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div>
              <span className="font-bold text-xs text-slate-900 block">{activeTaxRule.name}</span>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {activeTaxRule.origin || 'PP No. 58/2023 & PMK 168/2023'}
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeTaxRule.description || 'Pengoperasian regulasi pemotongan pajak PPh 21 berbasis aturan baku yang terdaftar.'}
            </p>

            {/* Impact & Context Breakdown */}
            <div className="text-xs text-slate-700 space-y-2">
              <span className="font-semibold text-slate-800 block text-[11px]">Dampak Konfigurasi pada Kalkulasi Payroll:</span>
              <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-outside pl-4 leading-normal">
                <li>
                  <strong className="text-slate-800">Skema Pemotongan Bulanan:</strong> {
                    activeTaxRule.name.toLowerCase().includes('harian')
                      ? 'Dihitung dengan tarif harian / akumulasi tidak tetap sesuai PMK 168/2023.'
                      : (activeTaxRule.name.toLowerCase().includes('pasal 17') || activeTaxRule.name.toLowerCase().includes('progresif'))
                      ? 'Menggunakan skema Lapis Tarif Progresif Pasal 17 UU HPP (5% s/d 35%) secara langsung.'
                      : 'Menggunakan Tarif Efektif Rata-Rata (TER) Bulanan Kategori A, B, atau C berbasis PTKP Karyawan.'
                  }
                </li>
                <li>
                  <strong className="text-slate-800">Rekonsiliasi Masa Pajak Akhir Tahun:</strong> {
                    activeTaxRule.name.toLowerCase().includes('harian')
                      ? 'Pemotongan bersifat final pada setiap pembayaran upah harian/tidak tetap.'
                      : 'Dihitung ulang secara kumulatif tahunan (PKP x Tarif Pasal 17 UU HPP) lalu dikurangi total TER yang telah dipotong selama Jan–Nov (Formulir 1721-A1).'
                  }
                </li>
                <li>
                  <strong className="text-slate-800">Metode PPh 21 Diterapkan:</strong> <span className="font-medium text-slate-800">{taxProfile.taxMethod}</span> (
                  {taxProfile.taxMethod === 'Gross' && 'Potong gaji karyawan secara langsung'}
                  {taxProfile.taxMethod === 'Gross Up' && 'Perusahaan memberikan tunjangan pajak sebanding PPh 21'}
                  {taxProfile.taxMethod === 'Nett' && 'Pajak ditanggung penuh oleh perusahaan, tidak memotong gaji karyawan'}
                  )
                </li>
              </ul>

              {activeTaxRule.tiers && activeTaxRule.tiers.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-800 block mb-1.5">Struktur Lapisan / Tier Regulasi Template:</span>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-outside pl-4 leading-normal">
                    {activeTaxRule.tiers.map((t, idx) => (
                      <li key={t.id || idx}>
                        <strong className="text-slate-800">{t.name}</strong>
                        {t.description && <span className="text-slate-600">   {t.description}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* 3. PTKP Status */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-normal text-slate-600">Status PTKP</span>
            <button
              type="button"
              onClick={() => toggleInfo('ptkp')}
              className={`p-0.5 rounded-md transition-all focus:outline-none ${
                activeInfo.ptkp ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Info className={`w-3.5 h-3.5 ${activeInfo.ptkp ? 'fill-blue-100/30' : ''}`} />
            </button>
          </div>
          <PtkpCustomSelect
            label=""
            value={taxProfile.ptkpStatus || formData.taxStatus || ''}
            onChange={handlePtkpChange}
            isProgressive={isProgressive}
          />
          {activeInfo.ptkp && (
            <div className="mt-1.5 p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] text-slate-600 leading-normal shadow-[0_1px_4px_rgba(0,0,0,0.01)] animate-in fade-in duration-200">
              Status PTKP (Penghasilan Tidak Kena Pajak) secara otomatis menentukan batasan pendapatan tahunan bebas pajak serta jumlah tanggungan yang diakui resmi oleh Ditjen Pajak.
            </div>
          )}
        </div>

        {/* 4. Employee Type */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-normal text-slate-600">Tipe Karyawan</span>
            <button
              type="button"
              onClick={() => toggleInfo('employeeType')}
              className={`p-0.5 rounded-md transition-all focus:outline-none ${
                activeInfo.employeeType ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Info className={`w-3.5 h-3.5 ${activeInfo.employeeType ? 'fill-blue-100/30' : ''}`} />
            </button>
          </div>
          <Select
            label=""
            value={taxProfile.employeeType || ''}
            onChange={e => handleEmployeeTypeChange(e.target.value)}
            options={EMPLOYEE_TAX_TYPES.map(t => ({
              value: t.value,
              label: t.label
            }))}
          />
          {activeInfo.employeeType && (
            <div className="mt-1.5 p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] text-slate-600 leading-normal shadow-[0_1px_4px_rgba(0,0,0,0.01)] animate-in fade-in duration-200">
              {isSyncedFromStatus ? (
                <span>Disinkronkan otomatis dari tipe pekerjaan karyawan (<strong>{mainEmployeeType}</strong>) pada Status Pekerjaan.</span>
              ) : (
                <span>Kategori wajib pajak karyawan untuk menentukan metode perhitungan pajak bulanan standar/khusus.</span>
              )}
            </div>
          )}
        </div>

        {/* 5. Tax Method */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-normal text-slate-600">Metode Pemotongan Pajak</span>
            <button
              type="button"
              onClick={() => toggleInfo('taxMethod')}
              className={`p-0.5 rounded-md transition-all focus:outline-none ${
                activeInfo.taxMethod ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Info className={`w-3.5 h-3.5 ${activeInfo.taxMethod ? 'fill-blue-100/30' : ''}`} />
            </button>
          </div>
          <Select
            label=""
            value={taxProfile.taxMethod || ''}
            onChange={e => handleTaxMethodChange(e.target.value as any)}
            options={TAX_METHODS.map(m => ({
              value: m.value,
              label: m.label,
              subLabel: m.badge
            }))}
          />
          {activeInfo.taxMethod && (
            <div className="mt-1.5 p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] text-slate-600 leading-normal shadow-[0_1px_4px_rgba(0,0,0,0.01)] animate-in fade-in duration-200">
              <div className="space-y-1">
                <p>Metode pemotongan pajak yang menentukan siapa yang menanggung PPh 21:</p>
                <ul className="list-disc list-outside pl-3.5 space-y-0.5">
                  <li><strong>Gross (Potong Gaji):</strong> Pajak memotong gaji pokok karyawan secara langsung.</li>
                  <li><strong>Gross Up (Tunjangan):</strong> Perusahaan memberikan tunjangan pajak tambahan sebanding pajak yang terhutang.</li>
                  <li><strong>Nett (Ditanggung):</strong> Pajak ditanggung penuh oleh perusahaan (tidak memotong gaji dan tidak ada tunjangan pajak).</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7. Tax History & Bukti Potong 1721-A1 */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-normal text-slate-600">Riwayat Bukti Pajak 1721-A1</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleInfo('taxHistory')}
              className={`p-0.5 rounded-md transition-all focus:outline-none ${
                activeInfo.taxHistory ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Info className={`w-3.5 h-3.5 ${activeInfo.taxHistory ? 'fill-blue-100/30' : ''}`} />
            </button>
          </div>
        </div>

        {activeInfo.taxHistory && (
          <div className="mt-1.5 mb-2.5 p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] text-slate-600 leading-normal shadow-[0_1px_4px_rgba(0,0,0,0.01)] animate-in fade-in duration-200">
            <span>Catatan riwayat bukti potong Formulir 1721-A1 atau SPT Masa dari pemberi kerja sebelumnya. Berguna untuk akumulasi perhitungan pajak PPh 21 masa berikutnya agar lebih akurat dan mempermudah pelaporan SPT Tahunan karyawan.</span>
          </div>
        )}

        {(!taxProfile.taxHistory || taxProfile.taxHistory.length === 0) ? (
          <button
            type="button"
            onClick={handleAddTaxHistory}
            className="w-full py-6 px-4 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 text-center transition-all cursor-pointer group space-y-1 block focus:outline-none"
          >
            <p className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">
              Belum ada riwayat pajak
            </p>
            <p className="text-slate-500 text-xs font-normal">
              Klik untuk menambahkan riwayat
            </p>
          </button>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleAddTaxHistory}
              className="w-full py-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 text-blue-600 font-bold text-xs sm:text-sm transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 focus:outline-none"
            >
              <span>Tambah Riwayat</span>
            </button>

            <div className="space-y-4 pt-1">
              {taxProfile.taxHistory.map((rec) => (
                <div key={rec.id} className="pb-4 border-b border-slate-200/70 last:border-b-0 last:pb-0 space-y-3 animate-in fade-in duration-150">
                  {/* Row 1: Tahun Pajak (Select Picker) + Trash Button */}
                  <div className="flex items-center gap-2 relative">
                    <div className="flex-1 relative">
                      <button
                        type="button"
                        onClick={() => setOpenYearPickerId(openYearPickerId === rec.id ? null : rec.id)}
                        className="flex flex-col justify-center w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1 text-xs text-slate-900 box-border transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[44px] cursor-pointer text-left focus:outline-none"
                      >
                        <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal leading-tight truncate">
                          Tahun Pajak
                        </span>
                        <span className="w-full text-xs sm:text-sm font-semibold text-slate-900 leading-tight mt-0.5 min-h-[1.25rem] block">
                          {rec.period || <span className="text-slate-300 font-normal">&nbsp;</span>}
                        </span>
                      </button>

                      {openYearPickerId === rec.id && (
                        <div 
                          ref={yearPickerContainerRef}
                          className="absolute z-50 left-0 top-[48px] w-full bg-white border border-slate-200 shadow-lg rounded-xl p-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150"
                        >
                          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1">
                            Pilih Tahun Pajak
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 max-h-[160px] overflow-y-auto pr-0.5 custom-scrollbar">
                            {Array.from({ length: 16 }, (_, i) => new Date().getFullYear() - 10 + i).map((yr) => {
                              const isSelected = rec.period === `Masa Pajak ${yr}`;
                              return (
                                <button
                                  key={yr}
                                  type="button"
                                  onClick={() => {
                                    handleUpdateTaxHistory(rec.id, 'period', `Masa Pajak ${yr}`);
                                    setOpenYearPickerId(null);
                                  }}
                                  className={cn(
                                    "py-2 px-1 text-xs rounded-lg text-center font-semibold transition-colors focus:outline-none",
                                    isSelected 
                                      ? "bg-blue-600 text-white" 
                                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                                  )}
                                >
                                  {yr}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTaxHistory(rec.id)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-[44px] w-[44px] p-0 shrink-0 rounded-xl border border-slate-200/80 flex items-center justify-center transition-colors focus:outline-none"
                      title="Hapus Catatan Pajak"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <CurrencyInput
                          innerLabel="Penghasilan Bruto"
                          value={rec.taxableIncome || ''}
                          onChange={e => handleUpdateTaxHistory(rec.id, 'taxableIncome', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <CurrencyInput
                          innerLabel="PPh 21 Disetor"
                          value={rec.taxPaid || ''}
                          onChange={e => handleUpdateTaxHistory(rec.id, 'taxPaid', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Input
                        innerLabel="Link File"
                        value={rec.proofDocumentUrl || ''}
                        onChange={e => handleUpdateTaxHistory(rec.id, 'proofDocumentUrl', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Real-time Tax Simulation Box (Progressive vs TER) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsSimulationExpanded(prev => !prev)}
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
                {/* PTKP Setahun (TK/0) */}
                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] text-slate-500 font-medium block mb-0.5 truncate">
                    PTKP Setahun ({taxProfile.ptkpStatus || 'TK/0'})
                  </span>
                  <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    Rp {formatIdr(simulation.ptkpAnnual || 54000000)}
                  </div>
                </div>

                {/* Tarif TER Kategori (A) */}
                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] text-slate-500 font-medium block mb-0.5 truncate">
                    Tarif TER Kategori ({simulation.terCategory})
                  </span>
                  <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {(simulation.terRate * 100).toFixed(2)}%
                  </div>
                </div>

                {/* PPh 21 Jan - Nov */}
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80">
                  <span className="text-[11px] text-blue-700 font-semibold block mb-0.5 truncate">PPh 21 Jan - Nov</span>
                  <div className="text-sm sm:text-base font-extrabold text-blue-900 truncate">
                    Rp {formatIdr(simulation.pph21Monthly)}
                  </div>
                </div>

                {/* PPh 21 Desember */}
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80">
                  <span className="text-[11px] text-blue-700 font-semibold block mb-0.5 truncate">PPh 21 Desember</span>
                  <div className="text-sm sm:text-base font-extrabold text-blue-900 truncate">
                    Rp {formatIdr(pph21December)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {/* PTKP Setahun */}
                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] text-slate-500 font-medium block mb-0.5 truncate">
                    PTKP Setahun ({taxProfile.ptkpStatus || 'TK/0'})
                  </span>
                  <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    Rp {formatIdr(simulation.ptkpAnnual || 54000000)}
                  </div>
                </div>

                {/* Tarif Efektif Rata Rata */}
                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] text-slate-500 font-medium block mb-0.5 truncate">
                    Tarif Efektif Rata-Rata
                  </span>
                  <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {formattedTerRate}
                  </div>
                </div>

                {/* PPh 21 Progresif Perbulan */}
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
                {/* Gaji Pokok */}
                <span className="font-normal text-slate-600 text-xs">Gaji Pokok</span>
                <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                <span className="font-normal text-slate-600 text-right text-xs">
                  {formatIdr(basicSalary)}
                </span>

                {/* Tunjangan Tetap (Hanya kategori Tunjangan Tetap) */}
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
                      {formData.fixedAllowance ? formatIdr(formData.fixedAllowance) : '0'}
                    </span>
                  </React.Fragment>
                )}

                {/* Subtotal PENGHASILAN BRUTO */}
                {taxProfile.taxMethod === 'Gross Up' ? (
                  <>
                    {/* Divider */}
                    <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                    {/* Total Bruto Perbulan */}
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">Total Bruto Perbulan</span>
                    <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">Rp</span>
                    <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">
                      {formatIdr(totalTaxableGross)}
                    </span>
                  </>
                ) : (
                  <>
                    {/* Divider */}
                    <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                    {/* Total Bruto Sebulan */}
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">Total Bruto Sebulan</span>
                    <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">Rp</span>
                    <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">
                      {formatIdr(totalTaxableGross)}
                    </span>
                  </>
                )}
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
                    {/* Total Bruto Sebulan */}
                    <span className="font-normal text-slate-600 text-xs">Total Bruto Sebulan</span>
                    <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs">
                      {formatIdr(totalTaxableGross)}
                    </span>

                    {/* Tarif TER */}
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

                    {/* Hasil perkalian TER x Bruto & Pembagi Gross Up (khusus Gross Up) */}
                    {taxProfile.taxMethod === 'Gross Up' && (
                      <React.Fragment>
                        {/* Garis Pembatas diatas Rp 13.090.000 */}
                        <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                        {/* Hasil Perkalian (Normal text) */}
                        <span />
                        <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                        <span className="font-normal text-slate-600 text-right text-xs">
                          {formatIdr(Math.round(totalTaxableGross * simulation.terRate))}
                        </span>

                        {/* Baris Pembagi: 1 - TER Kategori A */}
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

                    {/* Divider */}
                    <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                     {/* PPh 21 Perbulan (Jan-Nov) / Tunjangan PPh (satu line) */}
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

                    {/* Khusus Gross Up: Perhitungan ulang Gross Sebulan + PPh 21 x 12 */}
                    {taxProfile.taxMethod === 'Gross Up' && (
                      <React.Fragment>
                        {/* Total Bruto Sebulan */}
                        <span className="font-normal text-slate-600 text-xs">Total Bruto Sebulan</span>
                        <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                        <span className="font-normal text-slate-600 text-right text-xs">
                          {formatIdr(totalTaxableGross)}
                        </span>

                        {/* Tunjangan PPh Sebulan */}
                        <span className="font-normal text-slate-600 text-xs">Tunjangan PPh Sebulan</span>
                        <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                        <span className="font-normal text-slate-600 text-right text-xs relative">
                          {formatIdr(simulation.pph21Monthly)}
                          <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">+</span>
                        </span>

                        {/* Divider Line */}
                        <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                        {/* Bruto Setelah Tunjangan PPh */}
                        <span className="font-normal text-slate-600 text-xs">Akumulasi Bruto</span>
                        <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                        <span className="font-normal text-slate-600 text-right text-xs">
                          {formatIdr(effectiveGrossMonthly)}
                        </span>

                        {/* Masa Pajak Setahun (12 x Total Bruto Sebulan setelah Gross Up) */}
                        <div className="flex items-center justify-between text-xs text-slate-600 font-normal pr-1">
                          <span>Masa Pajak Setahun</span>
                          <div className="flex items-center gap-3.5 text-slate-600 font-normal">
                            <span>12</span>
                            <span className="text-slate-400 font-medium">x</span>
                          </div>
                        </div>
                        <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                        <span className="font-normal text-slate-600 text-right text-xs">
                          {formatIdr(effectiveGrossMonthly)}
                        </span>

                        {/* Divider Line */}
                        <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />
                      </React.Fragment>
                    )}

                    {/* Penghasilan Bruto Setahun / Total Bruto Setahun */}
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

                    {/* Biaya Jabatan */}
                    <span className="font-normal text-slate-600 text-xs">Biaya Jabatan</span>
                    <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs relative">
                      {formatIdr(annualBiayaJabatan)}
                      <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">-</span>
                    </span>

                    {/* Divider Line */}
                    <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                    {/* Penghasilan Neto Setahun */}
                    <span className="font-normal text-slate-600 text-xs">Neto Setahun</span>
                    <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs">
                      {formatIdr(annualNeto)}
                    </span>

                    {/* PTKP */}
                    <span className="font-normal text-slate-600 text-xs">Batas PTKP ({taxProfile.ptkpStatus || 'TK/0'})</span>
                    <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs relative">
                      {formatIdr(annualPtkp)}
                      <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">-</span>
                    </span>

                    {/* Divider Line */}
                    <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                    {/* Penghasilan Kena Pajak (PKP) */}
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
                    {/* Tarif Progresif Ps. 17 Items */}
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

                    {/* Divider Line */}
                    <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                    {/* PPh 21 Terutang Setahun */}
                    <span className="font-normal text-slate-600 text-xs">PPh 21 Setahun Progresif</span>
                    <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                    <span className="font-normal text-slate-600 text-right text-xs">
                      {formatIdr(Math.round(annualProgressiveTax))}
                    </span>

                    {/* Total PPh 21 Jan-Nov / Total Tunjangan PPh */}
                    {taxProfile.taxMethod === 'Gross Up' ? (
                      <React.Fragment>
                        <div className="flex items-center justify-between text-xs text-slate-600 font-normal pr-1">
                          <span>Tunjangan PPh (Jan-Nov)</span>
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
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <div className="flex items-center justify-between text-xs text-slate-600 font-normal pr-1">
                          <span>Total PPh 21 (Jan-Nov)</span>
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
                      </React.Fragment>
                    )}

                    {/* Divider Line Final */}
                    <div className="col-start-2 col-span-2 border-t border-slate-900 my-1" />

                    {/* PPh 21 Bulan Desember */}
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
                {/* Section 3: PERHITUNGAN PENGHASILAN KENA PAJAK */}
                <div className="-mx-4 px-4 py-2 sm:-mx-5 sm:px-5 bg-blue-50/80 border-y border-blue-100/80">
                  <span className="text-xs font-bold text-blue-800 block tracking-wide uppercase">
                    PERHITUNGAN PENGHASILAN KENA PAJAK
                  </span>
                  <span className="text-[11px] font-medium text-blue-600 block mt-0.5">
                    Batas Penghasilan Kena Pajak & PTKP ({taxProfile.ptkpStatus || 'TK/0'})
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_22px_88px] items-start gap-y-1.5 gap-x-2 pr-6 sm:pr-10">

                  {/* Khusus Gross Up: Perhitungan Gross Sebulan + Tunjangan PPh x 12 */}
                  {taxProfile.taxMethod === 'Gross Up' ? (
                    <React.Fragment>
                      {/* Total Bruto Sebulan */}
                      <span className="font-normal text-slate-600 text-xs">Total Bruto Sebulan</span>
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs">
                        {formatIdr(totalTaxableGross)}
                      </span>

                      {/* Tunjangan PPh Sebulan */}
                      <span className="font-normal text-slate-600 text-xs">Tunjangan PPh Sebulan</span>
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs relative">
                        {formatIdr(simulation.pph21Monthly)}
                        <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">+</span>
                      </span>

                      {/* Divider Line */}
                      <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                      {/* Akumulasi Bruto */}
                      <span className="font-normal text-slate-600 text-xs">Akumulasi Bruto</span>
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs">
                        {formatIdr(effectiveGrossMonthly)}
                      </span>

                      {/* Masa Pajak Setahun */}
                      <div className="flex items-center justify-between text-xs text-slate-600 font-normal pr-1">
                        <span>Masa Pajak Setahun</span>
                        <div className="flex items-center gap-3.5 text-slate-600 font-normal">
                          <span>12</span>
                          <span className="text-slate-400 font-medium">x</span>
                        </div>
                      </div>
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs">
                        {formatIdr(effectiveGrossMonthly)}
                      </span>

                      {/* Divider Line */}
                      <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                      {/* Bruto Setahun */}
                      <span className="font-normal text-slate-600 text-xs">Bruto Setahun</span>
                      <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                      <span className="font-normal text-slate-600 text-right text-xs">
                        {formatIdr(annualGross)}
                      </span>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {/* Total Bruto Setahun */}
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

                  {/* Biaya Jabatan */}
                  <span className="font-normal text-slate-600 text-xs">Biaya Jabatan</span>
                  <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                  <span className="font-normal text-slate-600 text-right text-xs relative">
                    {formatIdr(annualBiayaJabatan)}
                    <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">-</span>
                  </span>

                  {/* Divider Line */}
                  <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                  {/* Penghasilan Neto Setahun */}
                  <span className="font-normal text-slate-600 text-xs">Neto Setahun</span>
                  <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                  <span className="font-normal text-slate-600 text-right text-xs">
                    {formatIdr(annualNeto)}
                  </span>

                  {/* PTKP */}
                  <span className="font-normal text-slate-600 text-xs">Batas PTKP ({taxProfile.ptkpStatus || 'TK/0'})</span>
                  <span className="font-normal text-slate-600 text-right text-xs">Rp</span>
                  <span className="font-normal text-slate-600 text-right text-xs relative">
                    {formatIdr(annualPtkp)}
                    <span className="absolute left-full ml-2 top-0 font-normal text-slate-600 text-xs">-</span>
                  </span>

                  {/* Divider Line */}
                  <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                  {/* Penghasilan Kena Pajak (PKP) */}
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

                  {/* Tarif Progresif Ps. 17 Items */}
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

                  {/* Divider Line */}
                  <div className="col-start-2 col-span-2 border-t border-slate-900 my-0.5" />

                  {/* Total PPh 21 Setahun */}
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">Total PPh 21 Setahun</span>
                  <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">Rp</span>
                  <span className="font-bold text-slate-900 text-right text-xs sm:text-sm">
                    {formatIdr(Math.round(annualProgressiveTax))}
                  </span>

                  {/* Pembagian 12 Bulan */}
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

                  {/* Divider Line Final */}
                  <div className="col-start-2 col-span-2 border-t border-slate-900 my-1" />

                  {/* PPh 21 Perbulan */}
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
    </div>
  );
}
