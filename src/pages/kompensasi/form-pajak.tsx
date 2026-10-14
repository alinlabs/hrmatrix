import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../db/database';
import { Button, Select } from '../../components/ui';
import { v4 as uuidv4 } from 'uuid';
import { PayrollRule } from '../../types';
import { DEFAULT_PAYROLL_RULES } from '../../data/master';
import { PageHeaderTitle, HideBottomNav } from '../../context/MobileNavContext';
import { Info } from 'lucide-react';
import { TER_A_BRACKETS, TER_B_BRACKETS, TER_C_BRACKETS } from '../../services/taxBpjsService';
import {
  formatDateDisplay,
  formatRupiah,
  EditableBracketRow,
  EditablePasal17Tier,
  EditableDailyTier,
  DEFAULT_PASAL17_TIERS,
  DEFAULT_DAILY_TIERS,
  convertStandardBracketsToRows,
  getNominalColumnWidth,
  getPercentColumnWidth,
  StandardNominalInput,
  StandardPercentInput
} from './types-pajak';
import { SectionTabelTarifPajak } from './section-tabel-tarif-pajak';

export function FormPajak() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form State Utama (Metadata & Header Sesuai Standar Komponen Payroll)
  const [formData, setFormData] = useState<{
    name: string;
    origin: string;
    effectiveFrom: string;
    version: string;
    description: string;
  }>({
    name: 'PPh 21 TER 2024 (PP 58/2023)',
    origin: 'PP No. 58/2023 & PMK No. 168/2023',
    effectiveFrom: '2024-01-01',
    version: '2024.1',
    description: 'Tarif Efektif Rata-Rata (TER) Bulanan Kategori A, B, dan C sesuai PP 58/2023.'
  });

  // Skema Beban Pajak
  const [taxSchemeType, setTaxSchemeType] = useState<'gross' | 'gross_up' | 'nett'>('gross');

  // Metode Pajak yang Dipilih
  const [taxMethod, setTaxMethod] = useState<'TER' | 'Pasal17' | 'Harian' | 'Custom'>('TER');

  // Tab aktif pada TER: A, B, atau C
  const [activeTerTab, setActiveTerTab] = useState<'A' | 'B' | 'C'>('A');

  // Parameter Standar PTKP & Biaya Jabatan
  const [ptkpBase, setPtkpBase] = useState<number>(54000000);
  const [ptkpMarried, setPtkpMarried] = useState<number>(4500000);
  const [ptkpDependent, setPtkpDependent] = useState<number>(4500000);
  const [ptkpMaxDependents, setPtkpMaxDependents] = useState<number>(3);

  const [biayaJabatanRate, setBiayaJabatanRate] = useState<number>(5);
  const [biayaJabatanMaxMonthly, setBiayaJabatanMaxMonthly] = useState<number>(500000);
  const [nonNpwpSurcharge, setNonNpwpSurcharge] = useState<number>(20);

  // Kategori TER berdasarkan Status PTKP
  const [terCategories, setTerCategories] = useState<{
    A: string[];
    B: string[];
    C: string[];
  }>({
    A: ['TK/0', 'TK/1', 'K/0'],
    B: ['TK/2', 'TK/3', 'K/1', 'K/2'],
    C: ['K/3']
  });

  // Lapisan Tarif TER yang Dapat Dimodifikasi
  const [terBracketsA, setTerBracketsA] = useState<EditableBracketRow[]>([]);
  const [terBracketsB, setTerBracketsB] = useState<EditableBracketRow[]>([]);
  const [terBracketsC, setTerBracketsC] = useState<EditableBracketRow[]>([]);

  // Lapisan Pasal 17 UU HPP
  const [pasal17Tiers, setPasal17Tiers] = useState<EditablePasal17Tier[]>(DEFAULT_PASAL17_TIERS);

  // Lapisan TER Harian
  const [dailyTiers, setDailyTiers] = useState<EditableDailyTier[]>(DEFAULT_DAILY_TIERS);

  // Flat Rate
  const [customFlatRate, setCustomFlatRate] = useState<number>(5);

  // Simulator State
  const [simGross, setSimGross] = useState<number>(10000000);
  const [simPtkp, setSimPtkp] = useState<string>('TK/0');
  const [simHasNpwp, setSimHasNpwp] = useState<boolean>(true);

  // Tooltip helper
  const [activeInfoTooltip, setActiveInfoTooltip] = useState<string | null>(null);
  const toggleTooltip = (key: string) => {
    setActiveInfoTooltip(prev => (prev === key ? null : key));
  };

  // Load Rule Data jika Edit
  useEffect(() => {
    async function init() {
      try {
        if (id) {
          const rule = await db.payrollRules.get(id);
          if (rule) {
            setFormData({
              name: rule.name || '',
              origin: rule.origin || '',
              effectiveFrom: rule.effectiveFrom || '2024-01-01',
              version: rule.version || '2024.1',
              description: rule.description || ''
            });

            if ((rule as any).taxCustomConfig) {
              const cfg = (rule as any).taxCustomConfig;
              if (cfg.taxMethod) setTaxMethod(cfg.taxMethod);
              if (cfg.taxSchemeType) setTaxSchemeType(cfg.taxSchemeType);
              if (cfg.ptkpBase !== undefined) setPtkpBase(cfg.ptkpBase);
              if (cfg.ptkpMarried !== undefined) setPtkpMarried(cfg.ptkpMarried);
              if (cfg.ptkpDependent !== undefined) setPtkpDependent(cfg.ptkpDependent);
              if (cfg.ptkpMaxDependents !== undefined) setPtkpMaxDependents(cfg.ptkpMaxDependents);
              if (cfg.biayaJabatanRate !== undefined) setBiayaJabatanRate(cfg.biayaJabatanRate);
              if (cfg.biayaJabatanMaxMonthly !== undefined) setBiayaJabatanMaxMonthly(cfg.biayaJabatanMaxMonthly);
              if (cfg.nonNpwpSurcharge !== undefined) setNonNpwpSurcharge(cfg.nonNpwpSurcharge);
              if (cfg.terCategories) setTerCategories(cfg.terCategories);
              if (cfg.terBracketsA) setTerBracketsA(cfg.terBracketsA);
              if (cfg.terBracketsB) setTerBracketsB(cfg.terBracketsB);
              if (cfg.terBracketsC) setTerBracketsC(cfg.terBracketsC);
              if (cfg.pasal17Tiers) setPasal17Tiers(cfg.pasal17Tiers);
              if (cfg.dailyTiers) setDailyTiers(cfg.dailyTiers);
              if (cfg.customFlatRate !== undefined) setCustomFlatRate(cfg.customFlatRate);
            } else {
              setTerBracketsA(convertStandardBracketsToRows(TER_A_BRACKETS));
              setTerBracketsB(convertStandardBracketsToRows(TER_B_BRACKETS));
              setTerBracketsC(convertStandardBracketsToRows(TER_C_BRACKETS));
            }
          }
        } else {
          setTerBracketsA(convertStandardBracketsToRows(TER_A_BRACKETS));
          setTerBracketsB(convertStandardBracketsToRows(TER_B_BRACKETS));
          setTerBracketsC(convertStandardBracketsToRows(TER_C_BRACKETS));
        }
      } catch (err) {
        console.error('Error loading tax rule:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [id]);

  const handleLoadStandardTer = () => {
    setFormData({
      name: 'PPh 21 TER 2024 (PP 58/2023)',
      origin: 'PP No. 58/2023 & PMK No. 168/2023',
      effectiveFrom: '2024-01-01',
      version: '2024.1',
      description: 'Tarif Efektif Rata-Rata (TER) Bulanan Kategori A, B, dan C sesuai PP 58/2023.'
    });
    setTaxMethod('TER');
    setTaxSchemeType('gross');
    setTerBracketsA(convertStandardBracketsToRows(TER_A_BRACKETS));
    setTerBracketsB(convertStandardBracketsToRows(TER_B_BRACKETS));
    setTerBracketsC(convertStandardBracketsToRows(TER_C_BRACKETS));
    setPtkpBase(54000000);
    setPtkpMarried(4500000);
    setPtkpDependent(4500000);
    setPtkpMaxDependents(3);
    setBiayaJabatanRate(5);
    setBiayaJabatanMaxMonthly(500000);
    setNonNpwpSurcharge(20);
  };

  const handleLoadStandardPasal17 = () => {
    setFormData({
      name: 'PPh 21 Tarif Progresif Pasal 17 (UU HPP)',
      origin: 'UU No. 7 Tahun 2021 (UU Harmonisasi Peraturan Perpajakan)',
      effectiveFrom: '2024-01-01',
      version: '2024.1',
      description: 'Perhitungan Pajak Tahunan / Masa Pajak Terakhir menggunakan tarif progresif Pasal 17 ayat (1) huruf a UU PPh.'
    });
    setTaxMethod('Pasal17');
    setTaxSchemeType('gross');
    setPasal17Tiers(DEFAULT_PASAL17_TIERS);
    setPtkpBase(54000000);
    setPtkpMarried(4500000);
    setPtkpDependent(4500000);
    setPtkpMaxDependents(3);
    setBiayaJabatanRate(5);
    setBiayaJabatanMaxMonthly(500000);
    setNonNpwpSurcharge(20);
  };

  const handleAddTerRow = (cat: 'A' | 'B' | 'C') => {
    const list = cat === 'A' ? terBracketsA : cat === 'B' ? terBracketsB : terBracketsC;
    const lastRow = list[list.length - 1];
    const newMin = lastRow && lastRow.maxGross !== Infinity ? lastRow.maxGross : (lastRow ? lastRow.minGross + 1000000 : 0);
    const newMax = Infinity;
    const newRow: EditableBracketRow = {
      id: `bracket_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      minGross: newMin,
      maxGross: newMax,
      ratePercent: lastRow ? lastRow.ratePercent : 0
    };

    if (cat === 'A') setTerBracketsA(prev => [...prev, newRow]);
    else if (cat === 'B') setTerBracketsB(prev => [...prev, newRow]);
    else setTerBracketsC(prev => [...prev, newRow]);
  };

  const handleUpdateTerRow = (cat: 'A' | 'B' | 'C', rowId: string, field: keyof EditableBracketRow, value: any) => {
    const updater = (prev: EditableBracketRow[]) =>
      prev.map(row => (row.id === rowId ? { ...row, [field]: value } : row));

    if (cat === 'A') setTerBracketsA(updater);
    else if (cat === 'B') setTerBracketsB(updater);
    else setTerBracketsC(updater);
  };

  const handleDeleteTerRow = (cat: 'A' | 'B' | 'C', rowId: string) => {
    const filterer = (prev: EditableBracketRow[]) => prev.filter(r => r.id !== rowId);
    if (cat === 'A') setTerBracketsA(filterer);
    else if (cat === 'B') setTerBracketsB(filterer);
    else setTerBracketsC(filterer);
  };

  const handleResetTerCategory = (cat: 'A' | 'B' | 'C') => {
    if (cat === 'A') setTerBracketsA(convertStandardBracketsToRows(TER_A_BRACKETS));
    else if (cat === 'B') setTerBracketsB(convertStandardBracketsToRows(TER_B_BRACKETS));
    else setTerBracketsC(convertStandardBracketsToRows(TER_C_BRACKETS));
  };

  const handleUpdatePasal17Tier = (tierId: string, field: keyof EditablePasal17Tier, value: any) => {
    setPasal17Tiers(prev => prev.map(t => (t.id === tierId ? { ...t, [field]: value } : t)));
  };

  const handleAddPasal17Tier = () => {
    const last = pasal17Tiers[pasal17Tiers.length - 1];
    const newTier: EditablePasal17Tier = {
      id: `p17_${Date.now()}`,
      name: `Lapisan ${pasal17Tiers.length + 1}`,
      minPkp: last && last.maxPkp !== Infinity ? last.maxPkp : 5000000000,
      maxPkp: Infinity,
      ratePercent: last ? last.ratePercent + 5 : 35
    };
    setPasal17Tiers(prev => [...prev, newTier]);
  };

  const handleDeletePasal17Tier = (tierId: string) => {
    setPasal17Tiers(prev => prev.filter(t => t.id !== tierId));
  };

  const filteredTerRows = activeTerTab === 'A' ? terBracketsA : activeTerTab === 'B' ? terBracketsB : terBracketsC;

  const terMinGrossWidth = useMemo(
    () => getNominalColumnWidth(filteredTerRows.map(r => r.minGross)),
    [filteredTerRows]
  );
  const terMaxGrossWidth = useMemo(
    () => getNominalColumnWidth(filteredTerRows.map(r => r.maxGross)),
    [filteredTerRows]
  );

  const pasal17MinPkpWidth = useMemo(
    () => getNominalColumnWidth(pasal17Tiers.map(t => t.minPkp)),
    [pasal17Tiers]
  );
  const pasal17MaxPkpWidth = useMemo(
    () => getNominalColumnWidth(pasal17Tiers.map(t => t.maxPkp)),
    [pasal17Tiers]
  );

  const dailyMinWageWidth = useMemo(
    () => getNominalColumnWidth(dailyTiers.map(t => t.minWage)),
    [dailyTiers]
  );
  const dailyMaxWageWidth = useMemo(
    () => getNominalColumnWidth(dailyTiers.map(t => t.maxWage)),
    [dailyTiers]
  );

  const terRatePercentWidth = useMemo(
    () => getPercentColumnWidth(filteredTerRows.map(r => r.ratePercent)),
    [filteredTerRows]
  );
  const pasal17RatePercentWidth = useMemo(
    () => getPercentColumnWidth(pasal17Tiers.map(t => t.ratePercent)),
    [pasal17Tiers]
  );
  const dailyRatePercentWidth = useMemo(
    () => getPercentColumnWidth(dailyTiers.map(t => t.ratePercent)),
    [dailyTiers]
  );

  const simulatedResult = useMemo(() => {
    if (simGross <= 0) return { taxMonthly: 0, ratePercent: 0, netTakeHome: 0 };

    if (taxMethod === 'TER') {
      let cat: 'A' | 'B' | 'C' = 'A';
      if (terCategories.B.includes(simPtkp)) cat = 'B';
      else if (terCategories.C.includes(simPtkp)) cat = 'C';

      const brackets = cat === 'A' ? terBracketsA : cat === 'B' ? terBracketsB : terBracketsC;
      let matchedRatePercent = 0;

      for (const b of brackets) {
        if (simGross <= b.maxGross) {
          matchedRatePercent = b.ratePercent;
          break;
        }
      }

      if (!simHasNpwp && matchedRatePercent > 0) {
        matchedRatePercent = matchedRatePercent * (1 + nonNpwpSurcharge / 100);
      }

      const tax = Math.round(simGross * (matchedRatePercent / 100));
      const takeHome = taxSchemeType === 'gross' ? simGross - tax : simGross;

      return {
        taxMonthly: tax,
        ratePercent: matchedRatePercent,
        netTakeHome: takeHome,
        terCategory: cat
      };
    } else if (taxMethod === 'Pasal17') {
      const annualGross = simGross * 12;
      const monthlyBiayaJabatan = Math.min(simGross * (biayaJabatanRate / 100), biayaJabatanMaxMonthly);
      const annualBiayaJabatan = monthlyBiayaJabatan * 12;
      const annualNet = Math.max(0, annualGross - annualBiayaJabatan);

      let ptkpValue = ptkpBase;
      if (simPtkp.startsWith('K/')) {
        ptkpValue += ptkpMarried;
        const depCount = parseInt(simPtkp.split('/')[1] || '0', 10);
        ptkpValue += Math.min(depCount, ptkpMaxDependents) * ptkpDependent;
      } else if (simPtkp.startsWith('TK/')) {
        const depCount = parseInt(simPtkp.split('/')[1] || '0', 10);
        ptkpValue += Math.min(depCount, ptkpMaxDependents) * ptkpDependent;
      }

      const pkpAnnual = Math.max(0, annualNet - ptkpValue);
      let remainingPkp = pkpAnnual;
      let annualTax = 0;

      for (const tier of pasal17Tiers) {
        if (remainingPkp <= 0) break;
        const bracketCapacity = tier.maxPkp === Infinity ? remainingPkp : tier.maxPkp - tier.minPkp;
        const taxableAmount = Math.min(remainingPkp, bracketCapacity);
        annualTax += taxableAmount * (tier.ratePercent / 100);
        remainingPkp -= taxableAmount;
      }

      if (!simHasNpwp && annualTax > 0) {
        annualTax = annualTax * (1 + nonNpwpSurcharge / 100);
      }

      const monthlyTax = Math.round(annualTax / 12);
      const effectiveRate = simGross > 0 ? Number(((monthlyTax / simGross) * 100).toFixed(2)) : 0;
      const takeHome = taxSchemeType === 'gross' ? simGross - monthlyTax : simGross;

      return {
        taxMonthly: monthlyTax,
        ratePercent: effectiveRate,
        netTakeHome: takeHome
      };
    } else if (taxMethod === 'Harian') {
      const dailyWage = simGross;
      let matchedDailyRate = 0;
      for (const dt of dailyTiers) {
        if (dailyWage >= dt.minWage && dailyWage <= dt.maxWage) {
          matchedDailyRate = dt.ratePercent;
          break;
        }
      }

      const dailyTax = Math.round(dailyWage * (matchedDailyRate / 100));
      return {
        taxMonthly: dailyTax,
        ratePercent: matchedDailyRate,
        netTakeHome: dailyWage - dailyTax
      };
    } else {
      const tax = Math.round(simGross * (customFlatRate / 100));
      return {
        taxMonthly: tax,
        ratePercent: customFlatRate,
        netTakeHome: simGross - tax
      };
    }
  }, [
    simGross,
    simPtkp,
    simHasNpwp,
    taxMethod,
    taxSchemeType,
    terBracketsA,
    terBracketsB,
    terBracketsC,
    terCategories,
    pasal17Tiers,
    dailyTiers,
    customFlatRate,
    ptkpBase,
    ptkpMarried,
    ptkpDependent,
    ptkpMaxDependents,
    biayaJabatanRate,
    biayaJabatanMaxMonthly,
    nonNpwpSurcharge
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama aturan pajak wajib diisi.');
      return;
    }

    try {
      setIsSaving(true);

      const finalTiers =
        taxMethod === 'TER'
          ? [
              {
                id: 'tier_ter_a',
                name: 'TER Kategori A',
                employeeShare: 0,
                employerShare: 0,
                description: `Status: ${terCategories.A.join(', ')}. ${terBracketsA.length} Lapisan Tarif.`,
                rateType: 'Percentage'
              },
              {
                id: 'tier_ter_b',
                name: 'TER Kategori B',
                employeeShare: 0,
                employerShare: 0,
                description: `Status: ${terCategories.B.join(', ')}. ${terBracketsB.length} Lapisan Tarif.`,
                rateType: 'Percentage'
              },
              {
                id: 'tier_ter_c',
                name: 'TER Kategori C',
                employeeShare: 0,
                employerShare: 0,
                description: `Status: ${terCategories.C.join(', ')}. ${terBracketsC.length} Lapisan Tarif.`,
                rateType: 'Percentage'
              }
            ]
          : pasal17Tiers.map(p => ({
              id: p.id,
              name: p.name,
              employeeShare: p.ratePercent,
              employerShare: 0,
              description: `PKP ${formatRupiah(p.minPkp)} s/d ${formatRupiah(p.maxPkp)} Tarif ${p.ratePercent}%`,
              rateType: 'Percentage'
            }));

      const ruleId = id || `rule_pph21_${uuidv4().slice(0, 8)}`;
      const payload: PayrollRule & { taxCustomConfig?: any } = {
        id: ruleId,
        name: formData.name.trim(),
        category: 'Tax',
        ruleType: taxMethod === 'TER' ? 'Formula' : 'Percentage',
        status: 'Active',
        origin: formData.origin || (taxMethod === 'TER' ? 'PP No. 58/2023 & PMK No. 168/2023' : 'UU No. 7/2021'),
        description: formData.description || `Kebijakan pemotongan pajak penghasilan ${formData.name}`,
        version: formData.version || '2024.1',
        effectiveFrom: formData.effectiveFrom || '2024-01-01',
        employeeShare: taxMethod === 'Custom' ? customFlatRate : 5,
        employerShare: 0,
        fixedAmount: 0,
        maximumBase: 0,
        isMultiTier: true,
        tiers: finalTiers,
        taxCustomConfig: {
          taxMethod,
          taxSchemeType,
          ptkpBase,
          ptkpMarried,
          ptkpDependent,
          ptkpMaxDependents,
          terCategories,
          biayaJabatanRate,
          biayaJabatanMaxMonthly,
          nonNpwpSurcharge,
          terBracketsA,
          terBracketsB,
          terBracketsC,
          pasal17Tiers,
          dailyTiers,
          customFlatRate
        }
      };

      if (id) {
        await db.payrollRules.put(payload);
      } else {
        await db.payrollRules.add(payload);
      }

      navigate('/payroll/pajak');
    } catch (err) {
      console.error('Gagal menyimpan aturan pajak:', err);
      alert('Terjadi kendala saat menyimpan aturan pajak.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm space-y-2">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Memuat formulir konfigurasi pajak...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-32">
      <HideBottomNav />
      <PageHeaderTitle
        title={id ? 'Edit Pajak' : 'Buat Pajak'}
        subtitle="Tarif TER & PPh 21 Pasal 17"
        onBack={() => navigate('/payroll/pajak')}
        hideHamburger={true}
      />

      {/* Card Template Pajak Preset */}
      {!id && (
        <div className="bg-[#F4F7FF] border border-[#E2EAFE] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Gunakan Template Pajak
            </h3>
            <span className="bg-blue-100/80 text-blue-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0">
              2 Preset
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Pilih dari template standar resmi pemerintah (Standar PP 58/2023 - TER dan Standar UU HPP - Pasal 17) untuk pengisian otomatis.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleLoadStandardTer}
              className="w-full h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Standar PP 58/2023 (TER)</span>
              <span className="text-blue-200 font-bold text-sm">›</span>
            </button>
            <button
              type="button"
              onClick={handleLoadStandardPasal17}
              className="w-full h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Standar UU HPP (Pasal 17)</span>
              <span className="text-blue-200 font-bold text-sm">›</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN FORM */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* BAGIAN 1: IDENTITAS ATURAN PAJAK */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-semibold text-slate-800">Identitas Aturan Pajak</h3>
            <button
              type="button"
              onClick={() => toggleTooltip('identitas')}
              className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                activeInfoTooltip === 'identitas' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Informasi Aturan Pajak"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeInfoTooltip === 'identitas' && (
            <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
              Isi informasi dasar aturan pajak seperti nama pengenal, dasar hukum peraturan, dan versi dokumen.
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-normal text-slate-600">
                Nama Aturan Pajak
              </label>
              <button
                type="button"
                onClick={() => toggleTooltip('namaPajak')}
                className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                  activeInfoTooltip === 'namaPajak' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Informasi Tambahan"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder=""
              className="w-full h-9 px-3 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-normal min-h-[36px]"
            />
            {activeInfoTooltip === 'namaPajak' && (
              <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed mt-1.5 animate-in fade-in duration-150">
                Nama resmi kebijakan pemotongan PPh 21 yang akan tampil pada ringkasan kompensasi dan slip gaji.
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-normal text-slate-600">
                Dasar Hukum
              </label>
              <button
                type="button"
                onClick={() => toggleTooltip('dasarHukum')}
                className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                  activeInfoTooltip === 'dasarHukum' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Informasi Tambahan"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={formData.origin}
              onChange={e => setFormData(prev => ({ ...prev, origin: e.target.value }))}
              placeholder=""
              className="w-full h-9 px-3 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-normal min-h-[36px]"
            />
            {activeInfoTooltip === 'dasarHukum' && (
              <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed mt-1.5 animate-in fade-in duration-150">
                Rujukan regulasi perundang-undangan atau peraturan menteri yang mendasari besaran tarif pajak ini.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-normal text-slate-600">
                  Tanggal Berlaku
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('tanggal')}
                  className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                    activeInfoTooltip === 'tanggal' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Informasi Tambahan"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="relative flex items-center h-9 w-full rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs box-border min-h-[36px] transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20">
                <span className={`flex-1 text-xs truncate select-none ${formData.effectiveFrom ? 'text-slate-900 font-normal' : 'text-transparent font-normal'}`}>
                  {formData.effectiveFrom ? formatDateDisplay(formData.effectiveFrom) : ''}
                </span>
                <input
                  type="date"
                  value={formData.effectiveFrom || ''}
                  onChange={e => setFormData(prev => ({ ...prev, effectiveFrom: e.target.value }))}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer text-base"
                />
              </div>
              {activeInfoTooltip === 'tanggal' && (
                <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed mt-1.5 animate-in fade-in duration-150">
                  Tanggal mulai berlakunya aturan pajak ini dalam perhitungan payroll perusahaan.
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-normal text-slate-600">
                  Dokumen Versi
                </label>
                <button
                  type="button"
                  onClick={() => toggleTooltip('versi')}
                  className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                    activeInfoTooltip === 'versi' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Informasi Tambahan"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={formData.version || ''}
                onChange={e => setFormData(prev => ({ ...prev, version: e.target.value }))}
                placeholder=""
                className="w-full h-9 px-3 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-normal min-h-[36px]"
              />
              {activeInfoTooltip === 'versi' && (
                <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed mt-1.5 animate-in fade-in duration-150">
                  Penomoran versi kebijakan pajak untuk keperluan audit dan riwayat perubahan regulasi.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-normal text-slate-600">
                Keterangan
              </label>
              <button
                type="button"
                onClick={() => toggleTooltip('keterangan')}
                className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                  activeInfoTooltip === 'keterangan' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Informasi Tambahan"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder=""
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-normal"
            />
            {activeInfoTooltip === 'keterangan' && (
              <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed mt-1.5 animate-in fade-in duration-150">
                Deskripsi operasional atau catatan khusus yang dapat dibaca oleh tim HR dan penggajian.
              </div>
            )}
          </div>
        </div>

        {/* BAGIAN 2: SKEMA PEMOTONGAN PAJAK */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-semibold text-slate-800">Skema Pemotongan Pajak</h3>
            <button
              type="button"
              onClick={() => toggleTooltip('skema')}
              className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                activeInfoTooltip === 'skema' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Informasi Skema Pajak"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeInfoTooltip === 'skema' && (
            <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
              Menentukan pihak yang menanggung beban pajak penghasilan. Gross dipotong dari THP, Gross-Up diberikan tunjangan
              pajak penuh oleh perusahaan, dan Nett dibayarkan perusahaan secara langsung.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              {
                id: 'gross',
                title: 'Gross (Potong Gaji)',
                desc: 'Pajak PPh 21 sepenuhnya ditanggung oleh karyawan dan mengurangi take home pay.'
              },
              {
                id: 'gross_up',
                title: 'Gross-Up (Tunjangan Pajak)',
                desc: 'Perusahaan memberikan tunjangan pajak yang nilainya disetarakan sehingga THP utuh.'
              },
              {
                id: 'nett',
                title: 'Nett (Ditanggung Perusahaan)',
                desc: 'Pajak ditanggung langsung oleh perusahaan tanpa dihitung sebagai tunjangan karyawan.'
              }
            ].map(sch => (
              <button
                key={sch.id}
                type="button"
                onClick={() => setTaxSchemeType(sch.id as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  taxSchemeType === sch.id
                    ? 'border-blue-500 bg-blue-50/50 shadow-2xs'
                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`text-xs font-bold leading-tight ${taxSchemeType === sch.id ? 'text-blue-900' : 'text-slate-800'}`}>
                  {sch.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 leading-snug">
                  {sch.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* BAGIAN 3: METODE FORMULA & TARIF PAJAK */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-semibold text-slate-800">Metode Formula & Tarif Pajak</h3>
            <button
              type="button"
              onClick={() => toggleTooltip('metodePajak')}
              className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                activeInfoTooltip === 'metodePajak' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Informasi Metode Pajak"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeInfoTooltip === 'metodePajak' && (
            <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
              Pilih formula kalkulasi yang diterapkan: TER Bulanan (PP 58/2023), Tarif Progresif Pasal 17 UU HPP, TER Harian untuk pekerja lepas, atau Flat Rate kustom.
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'TER', label: 'TER Bulanan (PP 58/2023)', sub: 'Pegawai Tetap Bulanan' },
              { id: 'Pasal17', label: 'Pasal 17 UU HPP', sub: 'Progresif PKP Tahunan' },
              { id: 'Harian', label: 'TER Harian', sub: 'Pegawai Lepas/Harian' },
              { id: 'Custom', label: 'Flat Rate / Kustom', sub: 'Persentase Tetap' }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setTaxMethod(m.id as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  taxMethod === m.id
                    ? 'border-blue-500 bg-blue-50/50 shadow-2xs font-semibold'
                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`text-xs font-bold leading-tight ${taxMethod === m.id ? 'text-blue-900' : 'text-slate-800'}`}>
                  {m.label}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                  {m.sub}
                </div>
              </button>
            ))}
          </div>

          {/* PARAMETER PTKP & BIAYA JABATAN */}
          {(taxMethod === 'TER' || taxMethod === 'Pasal17') && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-xs font-semibold text-slate-800">Parameter Dasar PTKP</h3>
                <button
                  type="button"
                  onClick={() => toggleTooltip('ptkp')}
                  className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                    activeInfoTooltip === 'ptkp' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Informasi PTKP"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeInfoTooltip === 'ptkp' && (
                <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
                  Batasan Penghasilan Tidak Kena Pajak (PTKP) standar sesuai PMK 101/2016 yang menjadi acuan pengelompokan TER Kategori A, B, dan C.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-normal text-slate-600 mb-1">
                    PTKP Pokok Pribadi (Tahunan)
                  </label>
                  <StandardNominalInput
                    value={ptkpBase}
                    onChange={val => setPtkpBase(val)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-normal text-slate-600 mb-1">
                    Tambahan Status Kawin
                  </label>
                  <StandardNominalInput
                    value={ptkpMarried}
                    onChange={val => setPtkpMarried(val)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-normal text-slate-600 mb-1">
                    Tambahan per Tanggungan
                  </label>
                  <StandardNominalInput
                    value={ptkpDependent}
                    onChange={val => setPtkpDependent(val)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-normal text-slate-600 mb-1">
                    Maks. Tanggungan Diakui
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={ptkpMaxDependents}
                    onChange={e => setPtkpMaxDependents(parseInt(e.target.value, 10) || 0)}
                    className="w-full h-9 px-3 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-normal min-h-[36px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-normal text-slate-600 mb-1">
                    Tarif Biaya Jabatan (%)
                  </label>
                  <StandardPercentInput
                    value={biayaJabatanRate}
                    onChange={val => setBiayaJabatanRate(val)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-normal text-slate-600 mb-1">
                    Batas Maksimal Bulanan (Rp)
                  </label>
                  <StandardNominalInput
                    value={biayaJabatanMaxMonthly}
                    onChange={val => setBiayaJabatanMaxMonthly(val)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-normal text-slate-600 mb-1">
                    Tambahan Tarif Tanpa NPWP (%)
                  </label>
                  <StandardPercentInput
                    value={nonNpwpSurcharge}
                    onChange={val => setNonNpwpSurcharge(val)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TABEL TARIF PAJAK MODULAR */}
          <SectionTabelTarifPajak
            taxMethod={taxMethod}
            activeTerTab={activeTerTab}
            setActiveTerTab={setActiveTerTab}
            filteredTerRows={filteredTerRows}
            terMinGrossWidth={terMinGrossWidth}
            terMaxGrossWidth={terMaxGrossWidth}
            terRatePercentWidth={terRatePercentWidth}
            handleUpdateTerRow={handleUpdateTerRow}
            handleDeleteTerRow={handleDeleteTerRow}
            handleAddTerRow={handleAddTerRow}
            handleResetTerCategory={handleResetTerCategory}
            terBracketsA={terBracketsA}
            terBracketsB={terBracketsB}
            terBracketsC={terBracketsC}
            pasal17Tiers={pasal17Tiers}
            setPasal17Tiers={setPasal17Tiers}
            pasal17MinPkpWidth={pasal17MinPkpWidth}
            pasal17MaxPkpWidth={pasal17MaxPkpWidth}
            pasal17RatePercentWidth={pasal17RatePercentWidth}
            handleUpdatePasal17Tier={handleUpdatePasal17Tier}
            handleAddPasal17Tier={handleAddPasal17Tier}
            handleDeletePasal17Tier={handleDeletePasal17Tier}
            dailyTiers={dailyTiers}
            setDailyTiers={setDailyTiers}
            dailyMinWageWidth={dailyMinWageWidth}
            dailyMaxWageWidth={dailyMaxWageWidth}
            dailyRatePercentWidth={dailyRatePercentWidth}
            customFlatRate={customFlatRate}
            setCustomFlatRate={setCustomFlatRate}
            activeInfoTooltip={activeInfoTooltip}
            toggleTooltip={toggleTooltip}
          />
        </div>

        {/* BAGIAN 4: UJI SIMULASI PERHITUNGAN REAL-TIME */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-semibold text-slate-800">Uji Simulasi Perhitungan Real-time</h3>
            <button
              type="button"
              onClick={() => toggleTooltip('simulator')}
              className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                activeInfoTooltip === 'simulator' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Informasi Simulasi"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeInfoTooltip === 'simulator' && (
            <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
              Kalkulator ini secara otomatis menggunakan rentang batas dan persentase yang saat ini sedang Anda ubah
              di atas untuk memastikan hasil kalkulasi akurat sebelum Anda menyimpan perubahan aturan.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Gaji Bruto Simulasi (Rp)
              </label>
              <StandardNominalInput
                value={simGross}
                onChange={val => setSimGross(val)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Status PTKP
              </label>
              <Select
                value={simPtkp}
                onChange={e => setSimPtkp(e.target.value)}
                options={[
                  { value: '', label: 'Pilih Status PTKP...' },
                  { value: 'TK/0', label: 'TK/0 (Belum Kawin, 0 Tanggungan)' },
                  { value: 'TK/1', label: 'TK/1 (Belum Kawin, 1 Tanggungan)' },
                  { value: 'TK/2', label: 'TK/2 (Belum Kawin, 2 Tanggungan)' },
                  { value: 'TK/3', label: 'TK/3 (Belum Kawin, 3 Tanggungan)' },
                  { value: 'K/0', label: 'K/0 (Kawin, 0 Tanggungan)' },
                  { value: 'K/1', label: 'K/1 (Kawin, 1 Tanggungan)' },
                  { value: 'K/2', label: 'K/2 (Kawin, 2 Tanggungan)' },
                  { value: 'K/3', label: 'K/3 (Kawin, 3 Tanggungan)' },
                  { value: 'K/I/0', label: 'K/I/0 (Kawin Istri Digabung)' },
                ]}
              />
            </div>

            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Kepemilikan NPWP
              </label>
              <label className="flex items-center gap-2 cursor-pointer h-9 px-3 border border-slate-200/90 rounded-xl bg-white hover:bg-slate-50 min-h-[36px] transition-colors">
                <input
                  type="checkbox"
                  checked={simHasNpwp}
                  onChange={e => setSimHasNpwp(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-normal text-slate-700 select-none">Memiliki NPWP / NIK Valid</span>
              </label>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 text-[11px] block font-normal">Tarif Efektif Diterapkan</span>
              <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                {simulatedResult.ratePercent}%
                {taxMethod === 'TER' && (
                  <span className="text-[11px] font-normal text-slate-500 ml-1">
                    (Kategori {(simulatedResult as any).terCategory})
                  </span>
                )}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block font-normal">Potongan Pajak PPh 21</span>
              <span className="text-sm font-semibold text-blue-600 mt-0.5 block">
                Rp {formatRupiah(simulatedResult.taxMonthly)}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block font-normal">Estimasi Take Home Pay</span>
              <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                Rp {formatRupiah(simulatedResult.netTakeHome)}
              </span>
            </div>
          </div>
        </div>

        {/* FIXED BOTTOM ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3.5 sm:px-5 md:px-8 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="max-w-4xl mx-auto w-full">
            <Button
              type="submit"
              disabled={isSaving || !formData.name}
              className="w-full h-11 sm:h-12 text-sm font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue-600 hover:bg-blue-700 text-white"
            >
              <span>{isSaving ? 'Menyimpan Aturan Pajak...' : id ? 'Perbarui Aturan Pajak' : 'Simpan Aturan Pajak'}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default FormPajak;
