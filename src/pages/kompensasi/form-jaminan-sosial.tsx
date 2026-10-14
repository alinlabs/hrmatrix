import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../db/database';
import { Button, Input, Select, CurrencyInput } from '../../components/ui';
import { v4 as uuidv4 } from 'uuid';
import { PayrollRule, RuleTier, RuleTierContributor } from '../../types';
import { DEFAULT_PAYROLL_RULES } from '../../data/master';
import { PageHeaderTitle, HideBottomNav } from '../../context/MobileNavContext';
import { Plus, X, Save, Info, Trash2, ChevronDown, Check } from 'lucide-react';

interface ContributorComboboxProps {
  value: string;
  onChange: (val: string) => void;
  innerLabel: string;
  placeholder?: string;
}

function ContributorCombobox({ value, onChange, innerLabel, placeholder }: ContributorComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const options = ['Perusahaan', 'Pemerintah', 'Karyawan'];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex flex-col justify-center w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1 text-xs text-slate-900 box-border transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 min-h-[44px]">
        <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal leading-tight truncate">
          {innerLabel}
        </span>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full text-xs sm:text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent leading-tight p-0"
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-slate-600 focus:outline-none p-0.5 cursor-pointer flex items-center justify-center"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-slate-200/90 bg-white py-1 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>{opt}</span>
              {value === opt && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const CONTRIBUTOR_OPTIONS = [
  { value: 'Perusahaan', label: 'Perusahaan' },
  { value: 'Karyawan', label: 'Karyawan' },
  { value: 'Pemerintah', label: 'Pemerintah' },
  { value: 'Lainnya', label: 'Lainnya' }
];

const normalizeContributorName = (name: string): string => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('perusahaan') || lower.includes('er') || lower.includes('pemberi kerja')) {
    return 'Perusahaan';
  }
  if (lower.includes('pekerja') || lower.includes('ee') || lower.includes('karyawan')) {
    return 'Karyawan';
  }
  if (lower.includes('pemerintah') || lower.includes('gov')) {
    return 'Pemerintah';
  }
  return 'Lainnya';
};

const formatDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const mIdx = parseInt(m, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        return `${parseInt(d, 10)} ${months[mIdx]} ${y}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

export function FormJaminanSosial() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const [isLoading, setIsLoading] = useState(!!id);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<PayrollRule>>({
    name: '',
    category: '' as any,
    ruleType: '' as any,
    origin: '',
    status: 'Active',
    fixedAmount: 0,
    employeeShare: 0,
    employerShare: 0,
    maximumBase: 0,
    description: '',
    version: '',
    effectiveFrom: '',
    isMultiTier: false,
    tiers: []
  });

  const [tiers, setTiers] = useState<RuleTier[]>([]);
  const [isMultiTier, setIsMultiTier] = useState<boolean>(false);
  const [showMinBaseInfo, setShowMinBaseInfo] = useState<boolean>(false);
  const [showMaxBaseInfo, setShowMaxBaseInfo] = useState<boolean>(false);

  const [singleContributors, setSingleContributors] = useState<RuleTierContributor[]>([]);

  const addSingleContributor = () => {
    setSingleContributors(prev => [
      ...prev,
      { id: uuidv4(), name: '', share: 0, fixedAmount: 0 }
    ]);
  };

  const removeSingleContributor = (cId: string) => {
    setSingleContributors(prev => prev.filter(c => c.id !== cId));
  };

  const updateSingleContributor = (cId: string, field: keyof RuleTierContributor, value: any) => {
    setSingleContributors(prev => prev.map(c => c.id === cId ? { ...c, [field]: value } : c));
  };

  const addTierContributor = (tierId: string) => {
    setTiers(prev => prev.map(t => {
      if (t.id === tierId) {
        const current = t.contributors || [];
        return {
          ...t,
          contributors: [
            ...current,
            { id: uuidv4(), name: '', share: 0, fixedAmount: 0 }
          ]
        };
      }
      return t;
    }));
  };

  const removeTierContributor = (tierId: string, cId: string) => {
    setTiers(prev => prev.map(t => {
      if (t.id === tierId) {
        return {
          ...t,
          contributors: (t.contributors || []).filter(c => c.id !== cId)
        };
      }
      return t;
    }));
  };

  const updateTierContributor = (tierId: string, cId: string, field: keyof RuleTierContributor, value: any) => {
    setTiers(prev => prev.map(t => {
      if (t.id === tierId) {
        return {
          ...t,
          contributors: (t.contributors || []).map(c => c.id === cId ? { ...c, [field]: value } : c)
        };
      }
      return t;
    }));
  };

  const ensureDefaultContributors = (rateType: 'Percentage' | 'Fixed' = 'Percentage'): RuleTierContributor[] => {
    const list: RuleTierContributor[] = [];
    list.push({
      id: uuidv4(),
      name: 'Perusahaan',
      share: rateType === 'Percentage' ? 4 : 0,
      fixedAmount: rateType === 'Fixed' ? 0 : 0
    });
    list.push({
      id: uuidv4(),
      name: 'Karyawan',
      share: rateType === 'Percentage' ? 1 : 0,
      fixedAmount: rateType === 'Fixed' ? 0 : 0
    });
    return list;
  };

  const addTier = () => {
    setTiers(prev => [
      ...prev,
      {
        id: uuidv4(),
        name: `Skema / Tingkat #${prev.length + 1}`,
        employeeShare: 0,
        employerShare: 0,
        fixedAmount: 0,
        description: '',
        rateType: 'Percentage',
        contributors: []
      }
    ]);
  };

  const removeTier = (tierId: string) => {
    setTiers(prev => prev.filter(t => t.id !== tierId));
  };

  const updateTier = (tierId: string, field: keyof RuleTier, value: any) => {
    setTiers(prev => prev.map(t => {
      if (t.id === tierId) {
        if (field === 'rateType') {
          const updatedContributors = (t.contributors || []).map(c => ({
            ...c,
            share: value === 'Percentage' ? (c.share || c.fixedAmount || 0) : 0,
            fixedAmount: value === 'Fixed' ? (c.fixedAmount || c.share || 0) : 0
          }));
          return { ...t, rateType: value, contributors: updatedContributors };
        }
        return { ...t, [field]: value };
      }
      return t;
    }));
  };

  useEffect(() => {
    if (id) {
      db.payrollRules.get(id).then(existing => {
        const found = existing || DEFAULT_PAYROLL_RULES.find(r => r.id === id);
        if (found) {
          setFormData({ ...found });
          const hasTiers = !!(found.tiers && found.tiers.length > 0);
          const multi = found.isMultiTier !== false && hasTiers;
          setIsMultiTier(multi);
          
          const isFixed = found.ruleType === 'Fixed';
          if (found.contributors && found.contributors.length > 0) {
            setSingleContributors(found.contributors.map(c => ({
              id: c.id || uuidv4(),
              name: normalizeContributorName(c.name || ''),
              share: c.share !== undefined ? c.share : 0,
              fixedAmount: c.fixedAmount !== undefined ? c.fixedAmount : (isFixed ? c.share : 0)
            })));
          } else {
            const list: RuleTierContributor[] = [];
            const empShare = found.employerShare !== undefined ? found.employerShare : 4;
            const eeShare = found.employeeShare !== undefined ? found.employeeShare : 1;
            list.push({
              id: uuidv4(),
              name: 'Perusahaan',
              share: isFixed ? 0 : empShare,
              fixedAmount: isFixed ? (found.fixedAmount || empShare) : 0
            });
            list.push({
              id: uuidv4(),
              name: 'Karyawan',
              share: isFixed ? 0 : eeShare,
              fixedAmount: isFixed ? (found.fixedAmount || eeShare) : 0
            });
            setSingleContributors(list);
          }

          if (hasTiers) {
            setTiers(found.tiers!.map(t => {
              const tierRateType = t.rateType || (found.ruleType === 'Fixed' ? 'Fixed' : 'Percentage');
              let cList = t.contributors;
              if (!cList || cList.length === 0) {
                cList = [
                  {
                    id: uuidv4(),
                    name: 'Perusahaan',
                    share: tierRateType === 'Percentage' ? (t.employerShare !== undefined ? t.employerShare : ((t as any).rate || 0)) : 0,
                    fixedAmount: tierRateType === 'Fixed' ? (t.fixedAmount || t.employerShare || 0) : 0
                  },
                  {
                    id: uuidv4(),
                    name: 'Karyawan',
                    share: tierRateType === 'Percentage' ? (t.employeeShare !== undefined ? t.employeeShare : 0) : 0,
                    fixedAmount: tierRateType === 'Fixed' ? (t.fixedAmount || t.employeeShare || 0) : 0
                  }
                ];
              } else {
                cList = cList.map(c => ({
                  ...c,
                  name: normalizeContributorName(c.name || '')
                }));
              }
              return {
                ...t,
                rateType: tierRateType,
                contributors: cList
              };
            }));
          }
        }
        setIsLoading(false);
      }).catch(err => {
        console.error('Error fetching rule:', err);
        setIsLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Nama jaminan sosial / program iuran wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      const isFixed = formData.ruleType === 'Fixed';
      let finalEmployerShare = 0;
      let finalEmployeeShare = 0;
      let finalFixedAmount = 0;

      if (!isMultiTier) {
        singleContributors.forEach(c => {
          const nameLower = (c.name || '').toLowerCase();
          if (nameLower.includes('perusahaan') || nameLower.includes('er') || nameLower.includes('pemberi kerja')) {
            finalEmployerShare += (c.share || 0);
            if (isFixed) finalFixedAmount += (c.fixedAmount || 0);
          } else {
            finalEmployeeShare += (c.share || 0);
            if (isFixed) finalFixedAmount += (c.fixedAmount || 0);
          }
        });
      }

      const ruleId = id || `bpjs_${Date.now()}`;

      const cleanedTiers: RuleTier[] = isMultiTier ? tiers.map(t => {
        const tRateType = t.rateType || (isFixed ? 'Fixed' : 'Percentage');
        let tEmployer = 0;
        let tEmployee = 0;
        let tFixed = 0;

        (t.contributors || []).forEach(c => {
          const cNameLower = (c.name || '').toLowerCase();
          if (cNameLower.includes('perusahaan') || cNameLower.includes('er') || cNameLower.includes('pemberi kerja')) {
            tEmployer += (c.share || 0);
            if (tRateType === 'Fixed') tFixed += (c.fixedAmount || 0);
          } else {
            tEmployee += (c.share || 0);
            if (tRateType === 'Fixed') tFixed += (c.fixedAmount || 0);
          }
        });

        return {
          ...t,
          rateType: tRateType,
          employerShare: tEmployer,
          employeeShare: tEmployee,
          fixedAmount: tRateType === 'Fixed' ? tFixed : 0,
          rate: tRateType === 'Percentage' ? (tEmployer + tEmployee) : 0,
          contributors: t.contributors || []
        };
      }) : [];

      const payload: PayrollRule = {
        id: ruleId,
        name: formData.name.trim(),
        category: formData.category as any || 'BPJS Employment',
        ruleType: (formData.ruleType as any) || 'Percentage',
        status: (formData.status as any) || 'Active',
        origin: formData.origin || 'PP No. 44/2015',
        description: formData.description || '',
        version: formData.version || '2024.1',
        effectiveFrom: formData.effectiveFrom || '2024-01-01',
        fixedAmount: isFixed ? (finalFixedAmount || formData.fixedAmount || 0) : 0,
        employeeShare: finalEmployeeShare,
        employerShare: finalEmployerShare,
        maximumBase: Number(formData.maximumBase) || 0,
        minimumBase: Number(formData.minimumBase) || 0,
        isMultiTier: isMultiTier,
        tiers: isMultiTier ? cleanedTiers : [],
        contributors: !isMultiTier ? singleContributors : []
      };

      await db.payrollRules.put(payload);
      navigate('/payroll/bpjs');
    } catch (err) {
      console.error('Failed to save regulation rule:', err);
      alert('Terjadi kesalahan saat menyimpan regulasi BPJS.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Memuat data jaminan sosial...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      <HideBottomNav />
      <PageHeaderTitle 
        title={id ? 'Edit Jaminan Sosial' : 'Buat Jaminan Sosial'} 
        subtitle="Regulasi iuran BPJS Kes & TK"
        onBack={() => navigate('/payroll/bpjs')}
        hideHamburger={true}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Informasi Pokok Program */}
        <div className="space-y-4">
          {/* 1. Kategori Jaminan Sosial */}
          <div>
            <label className="block text-xs font-normal text-slate-700 mb-1">
              Kategori Jaminan Sosial <span className="text-rose-500">*</span>
            </label>
            <Select
              value={formData.category || ''}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              options={[
                { value: 'BPJS Employment', label: 'BPJS Ketenagakerjaan' },
                { value: 'BPJS Health', label: 'BPJS Kesehatan' }
              ]}
            />
          </div>

          {/* 2. Nama Program */}
          <div>
            <label className="block text-xs font-normal text-slate-700 mb-1">
              Nama Program <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder=""
              value={formData.name || ''}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          {/* 3. Metode Iuran */}
          {!isMultiTier && (
            <div>
              <label className="block text-xs font-normal text-slate-700 mb-1">
                Metode Iuran
              </label>
              <Select
                value={formData.ruleType || ''}
                onChange={e => {
                  const val = e.target.value as any;
                  setFormData(prev => ({ ...prev, ruleType: val }));
                  setSingleContributors(prev => prev.map(c => ({
                    ...c,
                    share: val === 'Percentage' ? (c.share || c.fixedAmount || 0) : 0,
                    fixedAmount: val === 'Fixed' ? (c.fixedAmount || c.share || 0) : 0
                  })));
                }}
                options={[
                  { value: 'Percentage', label: 'Persentase Upah' },
                  { value: 'Fixed', label: 'Nominal Tetap' }
                ]}
              />
            </div>
          )}

          {/* 4. Dasar Hukum */}
          <div>
            <label className="block text-xs font-normal text-slate-700 mb-1">
              Dasar Hukum
            </label>
            <Input
              type="text"
              placeholder=""
              value={formData.origin || ''}
              onChange={e => setFormData(prev => ({ ...prev, origin: e.target.value }))}
            />
          </div>

          {/* 5. Keterangan */}
          <div>
            <label className="block text-xs font-normal text-slate-700 mb-1">
              Keterangan
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 text-xs border border-slate-200/90 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
              placeholder=""
              value={formData.description || ''}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* 6. Berlaku Sejak | Versi Dokumen */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-normal text-slate-700 mb-1">
                Berlaku Sejak
              </label>
              <div className="relative flex items-center h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs box-border min-h-[36px] transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20">
                <span className={`flex-1 text-xs truncate select-none ${formData.effectiveFrom ? 'text-slate-900 font-normal' : 'text-slate-400 font-normal'}`}>
                  {formData.effectiveFrom ? formatDateDisplay(formData.effectiveFrom) : ''}
                </span>
                <input
                  type="date"
                  value={formData.effectiveFrom || ''}
                  onChange={e => setFormData(prev => ({ ...prev, effectiveFrom: e.target.value }))}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-normal text-slate-700 mb-1">
                Versi Dokumen
              </label>
              <Input
                type="text"
                placeholder=""
                value={formData.version || ''}
                onChange={e => setFormData(prev => ({ ...prev, version: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Batasan Upah Acuan */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-normal text-slate-700">
                  Batas Minimum Upah (Rp)
                </label>
                <button
                  type="button"
                  onClick={() => setShowMinBaseInfo(!showMinBaseInfo)}
                  className={`text-slate-400 hover:text-blue-600 focus:outline-none transition-colors cursor-pointer p-0.5 rounded-full ${showMinBaseInfo ? 'text-blue-600 bg-blue-50' : ''}`}
                  title="Informasi Batas Minimum"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <CurrencyInput
                value={formData.minimumBase || 0}
                onChange={e => setFormData(prev => ({ ...prev, minimumBase: Number(e.target.value) || 0 }))}
                placeholder=""
              />
              {showMinBaseInfo && (
                <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] text-slate-600 leading-relaxed shadow-2xs">
                  Jika upah riil di bawah nilai ini, upah minimum yang dijadikan acuan.
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-normal text-slate-700">
                  Batas Maksimum Upah / Plafon (Rp)
                </label>
                <button
                  type="button"
                  onClick={() => setShowMaxBaseInfo(!showMaxBaseInfo)}
                  className={`text-slate-400 hover:text-blue-600 focus:outline-none transition-colors cursor-pointer p-0.5 rounded-full ${showMaxBaseInfo ? 'text-blue-600 bg-blue-50' : ''}`}
                  title="Informasi Batas Maksimum"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <CurrencyInput
                value={formData.maximumBase || 0}
                onChange={e => setFormData(prev => ({ ...prev, maximumBase: Number(e.target.value) || 0 }))}
                placeholder=""
              />
              {showMaxBaseInfo && (
                <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] text-slate-600 leading-relaxed shadow-2xs">
                  Batas atas dasar upah yang digunakan sebagai plafon maksimal dalam perhitungan potongan iuran.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Struktur Kontribusi / Iuran */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-normal text-slate-700">
              Struktur Porsi Tanggungan
            </label>

            <div 
              onClick={() => setIsMultiTier(!isMultiTier)} 
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <span className={`text-xs font-normal transition-colors duration-200 ${isMultiTier ? 'text-blue-600' : 'text-slate-600'}`}>
                Multi Skema
              </span>
              <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ease-in-out ${isMultiTier ? 'bg-blue-600' : 'bg-slate-200'}`}>
                <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform duration-200 ease-in-out ${isMultiTier ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>

          {!isMultiTier ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={addSingleContributor}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/20 transition-all text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                Tambah Pihak Kontributor
              </button>

              <div className="space-y-3">
                {singleContributors.map((c, idx) => {
                  const isNominal = formData.ruleType === 'Fixed';
                  return (
                    <div key={c.id || idx} className="grid grid-cols-12 gap-3 items-end">
                      {/* Left: Contributor Select */}
                      <div className={
                        singleContributors.length === 1 
                          ? "col-span-6 sm:col-span-6" 
                          : (isNominal ? "col-span-6 sm:col-span-6" : "col-span-7 sm:col-span-8")
                      }>
                        <ContributorCombobox
                          innerLabel="Pihak Kontributor"
                          value={c.name}
                          onChange={val => updateSingleContributor(c.id, 'name', val)}
                          placeholder=""
                        />
                      </div>
                      {/* Right: Input (Percent/Nominal) + Delete Action (Tight Spacing & Right-Aligned) */}
                      <div className={
                        singleContributors.length === 1 
                          ? "col-span-6 sm:col-span-6" 
                          : (isNominal ? "col-span-6 sm:col-span-6" : "col-span-5 sm:col-span-4")
                      }>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            {isNominal ? (
                              <CurrencyInput
                                innerLabel="Nominal (Rp)"
                                value={c.fixedAmount || ''}
                                onChange={e => updateSingleContributor(c.id, 'fixedAmount', Number(e.target.value) || 0)}
                                placeholder=""
                              />
                            ) : (
                              <Input
                                type="number"
                                step="0.01"
                                innerLabel="Porsi (%)"
                                value={c.share !== undefined && c.share !== 0 ? c.share : ''}
                                onChange={e => updateSingleContributor(c.id, 'share', parseFloat(e.target.value) || 0)}
                                placeholder=""
                              />
                            )}
                          </div>
                          {singleContributors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSingleContributor(c.id)}
                              className="flex-shrink-0 h-[44px] w-9 flex items-center justify-end text-rose-400/80 hover:text-rose-600 transition-colors cursor-pointer p-1"
                              title="Hapus Kontributor"
                            >
                              <Trash2 className="w-[18px] h-[18px]" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <button
                type="button"
                onClick={addTier}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/20 transition-all text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                Tambah Tingkat Risiko / Skema Baru
              </button>

              <div className="space-y-6">
                {tiers.map((tier, tIdx) => (
                  <div key={tier.id || tIdx} className="space-y-3 pt-4 border-t border-slate-100 first:border-t-0 first:pt-0">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-bold text-slate-800">Skema {tIdx + 1}</span>
                      {tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTier(tier.id)}
                          className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus Skema
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Input
                        type="text"
                        innerLabel="Nama Tingkat / Klasifikasi"
                        value={tier.name}
                        onChange={e => updateTier(tier.id, 'name', e.target.value)}
                        placeholder=""
                      />
                      <Input
                        type="text"
                        innerLabel="Keterangan / Sektor Usaha"
                        value={tier.description || ''}
                        onChange={e => updateTier(tier.id, 'description', e.target.value)}
                        placeholder=""
                      />
                      <Select
                        innerLabel="Metode / Tipe Iuran"
                        value={tier.rateType || ''}
                        onChange={e => updateTier(tier.id, 'rateType', e.target.value)}
                        options={[
                          { value: 'Percentage', label: 'Persentase dari Upah (%)' },
                          { value: 'Fixed', label: 'Nominal Tetap (Rp)' }
                        ]}
                      />
                    </div>

                    {/* Tier Contributors */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-100/60 mb-1.5">
                        <span className="text-xs font-semibold text-slate-700">Kontributor & Porsi</span>
                        <button
                          type="button"
                          onClick={() => addTierContributor(tier.id)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Tambah
                        </button>
                      </div>

                      {(tier.contributors || []).map((tc, cIdx) => {
                        const isNominal = tier.rateType === 'Fixed';
                        return (
                          <div key={tc.id || cIdx} className="grid grid-cols-12 gap-3 items-end">
                             {/* Left: Contributor Select */}
                            <div className={
                              (tier.contributors || []).length === 1 
                                ? "col-span-6 sm:col-span-6" 
                                : (isNominal ? "col-span-6 sm:col-span-6" : "col-span-7 sm:col-span-8")
                            }>
                              <ContributorCombobox
                                innerLabel="Pihak Kontributor"
                                value={tc.name}
                                onChange={val => updateTierContributor(tier.id, tc.id, 'name', val)}
                                placeholder=""
                              />
                            </div>
                            {/* Right: Input (Percent/Nominal) + Delete Action (Tight Spacing & Right-Aligned) */}
                            <div className={
                              (tier.contributors || []).length === 1 
                                ? "col-span-6 sm:col-span-6" 
                                : (isNominal ? "col-span-6 sm:col-span-6" : "col-span-5 sm:col-span-4")
                            }>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 min-w-0">
                                  {isNominal ? (
                                    <CurrencyInput
                                      innerLabel="Nominal (Rp)"
                                      value={tc.fixedAmount || ''}
                                      onChange={e => updateTierContributor(tier.id, tc.id, 'fixedAmount', Number(e.target.value) || 0)}
                                      placeholder=""
                                    />
                                  ) : (
                                    <Input
                                      type="number"
                                      step="0.01"
                                      innerLabel="Porsi (%)"
                                      value={tc.share !== undefined && tc.share !== 0 ? tc.share : ''}
                                      onChange={e => updateTierContributor(tier.id, tc.id, 'share', parseFloat(e.target.value) || 0)}
                                      placeholder=""
                                    />
                                  )}
                                </div>
                                {(tier.contributors || []).length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeTierContributor(tier.id, tc.id)}
                                    className="flex-shrink-0 h-[44px] w-9 flex items-center justify-end text-rose-400/80 hover:text-rose-600 transition-colors cursor-pointer p-1"
                                    title="Hapus Kontributor"
                                  >
                                    <Trash2 className="w-[18px] h-[18px]" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FIXED BOTTOM ACTION BAR (TOMBOL SIMPAN FULL WIDTH) */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3.5 sm:px-5 md:px-8 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="max-w-4xl mx-auto w-full">
            <Button 
              type="submit"
              disabled={isSaving || !formData.name}
              className="w-full h-11 sm:h-12 text-sm font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue-600 hover:bg-blue-700 text-white"
            >
              <span>{isSaving ? 'Menyimpan...' : id ? 'Perbarui Regulasi Jaminan' : 'Simpan Regulasi Jaminan'}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
