import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { DEFAULT_PAYROLL_RULES } from '../../data/master';
import { 
  Trash2, 
  CheckCircle2, 
  Info
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
import { TaxSimulationBox } from './section-tax-simulation';
import { isFixedAllowance } from '../../utils/allowanceClassification';
import { cn } from '../../utils/cn';

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
              dependents: prev.dependents ?? 0,
              employeeType: '' as any,
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
      dependents: formData.dependents ?? 0,
      employeeType: syncedTaxType || '',
      taxMethod: '' as any,
      hasNpwp: true,
      taxHistory: []
    }),
    ptkpStatus: formData.taxProfile?.ptkpStatus ?? (formData.taxStatus || ''),
    employeeType: (formData.taxProfile?.employeeType ?? (syncedTaxType || '')) as any,
    taxMethod: (formData.taxProfile?.taxMethod || '') as any,
    dependents: formData.taxProfile?.dependents ?? formData.dependents ?? 0,
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
      <TaxSimulationBox
        isProgressive={isProgressive}
        taxProfile={taxProfile}
        simulation={simulation}
        basicSalary={basicSalary}
        fixedAllowance={formData.fixedAllowance}
        fixedAllowanceList={fixedAllowanceList}
        totalTaxableGross={totalTaxableGross}
        totalTaxableGrossUpMonthly={effectiveGrossMonthly}
        isSimulationExpanded={isSimulationExpanded}
        onToggleExpanded={() => setIsSimulationExpanded(prev => !prev)}
      />
    </div>
  );
}
