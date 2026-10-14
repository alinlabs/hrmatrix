import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../db/database';
import { Button, Input, DatePickerInput } from '../../components/ui';
import { PayrollRule, PaymentRuleTier } from '../../types';
import { DEFAULT_PAYROLL_RULES } from '../../data/master';
import { PageHeaderTitle, HideBottomNav } from '../../context/MobileNavContext';
import { 
  Briefcase, 
  Clock, 
  Gift, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { AllowanceTemplate, QUICK_TEMPLATES } from './templates-tunjangan';
import { ModalTemplateTunjangan } from './modal-template-tunjangan';
import { SectionPerhitunganTunjangan } from './section-perhitungan-tunjangan';

export function FormTunjangan() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const [isLoading, setIsLoading] = useState(!!id);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Bottom Sheet & Modal States
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const [activeInfoTooltip, setActiveInfoTooltip] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PayrollRule>>({
    nama: '',
    kategori: '',
    frekuensi_pembayaran: '',
    metode_perhitungan: '',
    dasar_perhitungan: '',
    nilai: undefined,
    parameter_jenjang: null,
    periode_dasar: undefined,
    aturan: [],
    status: 'Active',
    origin: '',
    version: '',
    effectiveFrom: '',
    description: ''
  });

  useEffect(() => {
    async function loadRule() {
      if (!id) return;
      try {
        const doc = await db.payrollRules.get(id);
        if (doc) {
          const d = { ...doc };
          if (!d.nama) d.nama = d.name;
          if (!d.origin) d.origin = 'Peraturan Perusahaan (PP)';
          if (!d.version) d.version = 'v1.0';
          if (!d.effectiveFrom) d.effectiveFrom = new Date().toISOString().split('T')[0];
          if (d.description === undefined) d.description = '';
          
          // Map to 3 standard categories
          if (d.kategori) {
            const kat = d.kategori.toLowerCase();
            if (kat.includes('tidak') || kat === 'tunjangan_tidak_tetap') {
              d.kategori = 'Tunjangan Tidak Tetap';
            } else if (kat.includes('bonus') || kat.includes('insentif') || kat === 'thr' || kat.includes('thr')) {
              d.kategori = 'Bonus & Insentif';
            } else {
              d.kategori = 'Tunjangan Tetap';
            }
          } else {
            const isThrOrBonus = (d.allowanceType === 'thr_religious') || (d.allowanceGroup === 'bonus') || (d.allowanceGroup === 'insentif');
            const isVariable = (d.calculationModel === 'unit_based') || (d.allowanceType === 'attendance');
            d.kategori = isThrOrBonus ? 'Bonus & Insentif' : isVariable ? 'Tunjangan Tidak Tetap' : 'Tunjangan Tetap';
          }

          if (!d.frekuensi_pembayaran) {
            d.frekuensi_pembayaran = d.paymentPeriod === 'Annually' ? 'tahunan' : 
                                    d.paymentPeriod === 'Quarterly' ? 'triwulanan' : 'bulanan';
          }

          if (!d.metode_perhitungan) {
            const m = d.calculationModel;
            d.metode_perhitungan = m === 'percentage' ? 'persentase' : 
                                   m === 'unit_based' ? 'harian' : 
                                   m === 'prorata' ? 'prorata' : 
                                   m === 'tiered' ? 'berjenjang' : 
                                   m === 'multiplier' ? 'kelipatan' : 'tetap';
          }

          if (d.nilai === undefined || d.nilai === null) {
            d.nilai = d.fixedAmount || d.employeeShare || d.unitRate || 0;
          }

          if (d.metode_perhitungan === 'persentase') {
            d.dasar_perhitungan = 'Gaji Pokok';
          } else if (d.metode_perhitungan === 'tetap' || d.metode_perhitungan === 'harian' || d.metode_perhitungan === 'kelipatan') {
            d.dasar_perhitungan = 'Nominal';
          } else if (!d.dasar_perhitungan) {
            d.dasar_perhitungan = 'Nominal';
          }

          if (!d.aturan) d.aturan = [];
          setFormData(d);
        } else {
          const def = DEFAULT_PAYROLL_RULES.find(r => r.id === id);
          if (def) setFormData(def);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRule();
  }, [id]);

  // Apply quick template
  const applyTemplate = (tpl: AllowanceTemplate) => {
    setFormData(prev => ({
      ...prev,
      ...tpl.data,
    }));
    setFormError(null);
  };

  // Switch calculation scheme cleanly
  const handleSelectScheme = (scheme: string) => {
    let newDasar = 'Nominal';
    let defaultNilai = formData.nilai || 0;
    let newPeriod = formData.periode_dasar;
    let newAturan = formData.aturan || [];

    if (scheme === 'persentase') {
      newDasar = 'Gaji Pokok';
      if (defaultNilai > 100) defaultNilai = 10;
    } else if (scheme === 'prorata') {
      newDasar = 'Gaji Pokok';
      if (defaultNilai <= 0 || defaultNilai > 100) defaultNilai = 100;
      newPeriod = 12;
    } else if (scheme === 'tetap') {
      newDasar = 'Nominal';
      if (defaultNilai <= 100) defaultNilai = 500000;
    } else if (scheme === 'harian') {
      newDasar = 'Nominal';
      if (defaultNilai <= 0 || defaultNilai > 500000) defaultNilai = 25000;
    } else if (scheme === 'kelipatan') {
      newDasar = 'Nominal';
      if (defaultNilai <= 0 || defaultNilai > 1000000) defaultNilai = 100000;
    } else if (scheme === 'berjenjang') {
      newDasar = 'Nominal';
      if (!newAturan || newAturan.length === 0) {
        newAturan = [
          { min: 0, max: 1, nilai: 200000 },
          { min: 1, max: 3, nilai: 500000 },
          { min: 3, max: null, nilai: 1000000 }
        ];
      }
    }

    setFormData({
      ...formData,
      metode_perhitungan: scheme,
      dasar_perhitungan: newDasar,
      nilai: defaultNilai,
      periode_dasar: newPeriod,
      aturan: newAturan,
      parameter_jenjang: scheme === 'berjenjang' ? (formData.parameter_jenjang || { parameter: 'masa_kerja', satuan: 'tahun' }) : null,
      frekuensi_pembayaran: (scheme === 'prorata' || scheme === 'kelipatan') ? 'tahunan' : (formData.frekuensi_pembayaran || 'bulanan')
    });
    setActiveInfoTooltip(null);
    setFormError(null);
  };

  // Tier helpers
  const handleAddAturan = () => {
    const newAturan = [...(formData.aturan || [])];
    const isCustomLevel = (formData as any).jenis_jenjang === 'custom_level' || formData.parameter_jenjang?.parameter === 'level_jabatan';
    if (isCustomLevel) {
      const idx = newAturan.length + 1;
      newAturan.push({
        level: `Level ${idx}`,
        namaJenjang: `Jenjang ${idx}`,
        nilai: 0,
        nominal: 0,
        min: `Level ${idx}`
      } as any);
    } else {
      const lastAturan = newAturan[newAturan.length - 1];
      const nextMin = lastAturan && typeof lastAturan.max === 'number' ? lastAturan.max : (lastAturan && typeof lastAturan.min === 'number' ? (lastAturan.min || 0) + 1 : 0);
      newAturan.push({ min: nextMin, max: null, nilai: 0 });
    }
    setFormData({ ...formData, aturan: newAturan });
  };

  const updateAturan = (index: number, updates: Partial<PaymentRuleTier>) => {
    const newAturan = [...(formData.aturan || [])];
    newAturan[index] = { ...newAturan[index], ...updates };
    setFormData({ ...formData, aturan: newAturan });
  };

  const removeAturan = (index: number) => {
    const newAturan = [...(formData.aturan || [])];
    newAturan.splice(index, 1);
    setFormData({ ...formData, aturan: newAturan });
  };

  // Validation
  const validateForm = () => {
    if (!formData.nama || formData.nama.trim() === '') {
      setFormError('Nama komponen pembayaran wajib diisi.');
      return false;
    }

    if (formData.metode_perhitungan === 'berjenjang') {
      if (!formData.aturan || formData.aturan.length === 0) {
        setFormError('Model berjenjang wajib memiliki minimal 1 baris rentang aturan.');
        return false;
      }
      const isCustomLevel = (formData as any).jenis_jenjang === 'custom_level' || formData.parameter_jenjang?.parameter === 'level_jabatan';
      for (let i = 0; i < formData.aturan.length; i++) {
        const a: any = formData.aturan[i];
        if (isCustomLevel) {
          if (!a.level && !a.namaJenjang && !a.min) {
            setFormError(`Aturan jenjang #${i + 1}: Nama/tingkat level harus diisi.`);
            return false;
          }
        } else {
          if (a.min === null || a.min === undefined) {
            setFormError(`Aturan rentang #${i + 1}: Batas minimum harus diisi.`);
            return false;
          }
          if (a.max !== null && a.max !== undefined && typeof a.min === 'number' && typeof a.max === 'number' && a.min > a.max) {
            setFormError(`Aturan rentang #${i + 1}: Nilai minimum tidak boleh lebih besar dari maksimum.`);
            return false;
          }
        }
        if (a.nilai === null || a.nilai === undefined) {
          setFormError(`Aturan rentang #${i + 1}: Nilai komponen harus diisi.`);
          return false;
        }
      }
    } else {
      if (formData.nilai === undefined || formData.nilai === null || formData.nilai < 0) {
        setFormError('Nilai komponen pembayaran tidak boleh kosong atau negatif.');
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      setFormError(null);

      const isPercent = formData.dasar_perhitungan === 'Gaji Pokok' || formData.metode_perhitungan === 'persentase';
      const isCustomLevel = (formData as any).jenis_jenjang === 'custom_level' || formData.parameter_jenjang?.parameter === 'level_jabatan';
      
      const formattedAturan = (formData.aturan || []).map((a: any, idx: number) => {
        if (isCustomLevel) {
          const levelVal = a.level || a.min || `Level ${idx + 1}`;
          const nameVal = a.namaJenjang || a.keterangan || levelVal;
          const numVal = typeof a.nilai === 'number' ? a.nilai : (parseFloat(a.nilai) || 0);
          return {
            ...a,
            level: levelVal,
            namaJenjang: nameVal,
            nilai: numVal,
            nominal: isPercent ? 0 : numVal,
            persentaseGaji: isPercent ? numVal : 0,
            min: levelVal,
            max: levelVal
          };
        } else {
          return a;
        }
      });

      const finalData: Partial<PayrollRule> = {
        ...formData,
        name: formData.nama,
        kategori: formData.kategori || 'Tunjangan Tetap',
        dasar_perhitungan: formData.dasar_perhitungan || 'Nominal',
        description: formData.description || `${formData.kategori} - ${formData.metode_perhitungan}`,
        ruleType: isPercent ? 'Percentage' : formData.metode_perhitungan === 'harian' ? 'DailyWage' : 'Fixed',
        calculationModel: formData.metode_perhitungan === 'tetap' ? 'fixed' :
                          formData.metode_perhitungan === 'persentase' ? 'percentage' :
                          formData.metode_perhitungan === 'harian' ? 'unit_based' :
                          formData.metode_perhitungan === 'prorata' ? 'prorata' :
                          formData.metode_perhitungan === 'berjenjang' ? 'tiered' :
                          formData.metode_perhitungan === 'kelipatan' ? 'multiplier' : 'fixed',
        paymentPeriod: formData.frekuensi_pembayaran === 'tahunan' ? 'Annually' : 
                       formData.frekuensi_pembayaran === 'triwulanan' ? 'Quarterly' : 'Monthly',
        employeeShare: isPercent ? (formData.nilai || 0) : 0,
        fixedAmount: isPercent ? 0 : (formData.nilai || 0),
        unitRate: formData.metode_perhitungan === 'harian' ? (formData.nilai || 0) : undefined,
        jenis_jenjang: isCustomLevel ? 'custom_level' : 'masa_kerja',
        parameter_jenjang: formData.metode_perhitungan === 'berjenjang'
          ? (isCustomLevel ? { parameter: 'level_jabatan', satuan: 'jenjang' } : { parameter: 'masa_kerja', satuan: 'tahun' })
          : formData.parameter_jenjang,
        aturan: formattedAturan,
        daftarJenjang: isCustomLevel ? formattedAturan : undefined,
        category: 'Allowance',
        origin: formData.origin || 'Peraturan Perusahaan (PP)',
        status: formData.status || 'Active',
        version: formData.version || 'v1.0',
        effectiveFrom: formData.effectiveFrom || new Date().toISOString().split('T')[0]
      };

      if (!id) {
        finalData.id = `cmp-${Date.now()}`;
        await db.payrollRules.add(finalData as PayrollRule);
      } else {
        await db.payrollRules.update(id, finalData);
      }

      navigate('/payroll/tunjangan');
    } catch (err: any) {
      setFormError(err.message || 'Gagal menyimpan komponen pembayaran.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Memuat konfigurasi komponen...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      <HideBottomNav />
      
      {/* Header Halaman */}
      <PageHeaderTitle 
        title={id ? 'Edit Tunjangan' : 'Buat Tunjangan'} 
        subtitle="Upah & tunjangan karyawan"
        onBack={() => navigate('/payroll/tunjangan')}
        hideHamburger={true}
      />

      {/* Alert Error jika validasi gagal */}
      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 text-red-700 items-start shadow-xs animate-in fade-in">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="text-sm">
            <span className="font-bold block mb-0.5">Periksa Kembali Formulir</span>
            <p>{formError}</p>
          </div>
        </div>
      )}

      {/* PRESET TEMPLATES CARD BUTTON */}
      {!id && (
        <div 
          onClick={() => setIsTemplateSheetOpen(true)}
          className="bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-slate-50 border border-blue-200/80 hover:border-blue-400/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Gunakan Template Komponen
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                7 Preset
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Pilih dari template standar (Tunjangan Operasional, Jabatan, Bonus Kinerja, THR, dan Multi-Tier) untuk pengisian otomatis.
            </p>
          </div>
          
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsTemplateSheetOpen(true);
            }}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Pilih Template</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      )}

      {/* MAIN FORM */}
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
        
        {/* INFORMASI UTAMA KOMPONEN */}
        <div className="space-y-4">
          <div className="space-y-4">
            {/* Nama Tunjangan */}
            <Input
              label="Nama Tunjangan"
              value={formData.nama || ''}
              onChange={e => setFormData({ ...formData, nama: e.target.value })}
              placeholder=""
              required
            />

            {/* Dasar Hukum */}
            <Input
              label="Dasar Hukum"
              value={formData.origin || ''}
              onChange={e => setFormData({ ...formData, origin: e.target.value })}
              placeholder=""
            />

            {/* Tanggal Berlaku | Dokumen Versi */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <DatePickerInput
                  label="Tanggal Berlaku"
                  value={formData.effectiveFrom || ''}
                  onChange={val => setFormData({ ...formData, effectiveFrom: val })}
                />
              </div>
              <div>
                <Input
                  label="Dokumen Versi"
                  value={formData.version || ''}
                  onChange={e => setFormData({ ...formData, version: e.target.value })}
                  placeholder=""
                />
              </div>
            </div>

            {/* Keterangan */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Keterangan
              </label>
              <textarea
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[70px] resize-y"
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder=""
                rows={2}
              />
            </div>

            {/* Kategori Komponen (3 Pilihan Jelas) */}
            <div className="space-y-2">
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Kategori Komponen
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'Tunjangan Tetap',
                    title: 'Tunjangan Tetap',
                    desc: 'Diberikan rutin dan pasti tiap bulan tanpa syarat absensi.',
                    icon: Briefcase
                  },
                  {
                    id: 'Tunjangan Tidak Tetap',
                    title: 'Tunjangan Tidak Tetap',
                    desc: 'Bergantung pada variabel seperti kehadiran kerja atau shift.',
                    icon: Clock
                  },
                  {
                    id: 'Bonus & Insentif',
                    title: 'Bonus & Insentif',
                    desc: 'Reward performa, tunjangan hari raya (THR), atau tahunan.',
                    icon: Gift
                  }
                ].map(cat => {
                  const active = formData.kategori === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, kategori: cat.id })}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        active 
                          ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 shadow-2xs' 
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${active ? 'text-blue-900' : 'text-slate-800'}`}>
                          {cat.title}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                          {cat.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frekuensi Pembayaran */}
            <div className="space-y-2">
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Frekuensi Pembayaran
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  { id: 'bulanan', label: 'Bulanan', desc: 'Masuk slip gaji rutin setiap bulan' },
                  { id: 'triwulanan', label: 'Triwulanan (3 Bulan)', desc: 'Pencairan per kuartal (Maret, Juni, Sept, Des)' },
                  { id: 'tahunan', label: 'Tahunan', desc: 'Dibayarkan 1x setahun (misal THR/Bonus)' },
                  { id: 'insidental', label: 'Insidental', desc: 'Sekali bayar sewaktu-waktu' },
                ].map(freq => {
                  const active = formData.frekuensi_pembayaran === freq.id;
                  return (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, frekuensi_pembayaran: freq.id })}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        active 
                          ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 shadow-2xs font-semibold' 
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`text-xs ${active ? 'font-bold text-blue-900' : 'font-medium text-slate-700'}`}>
                        {freq.label}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                        {freq.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SKEMA / METODE PERHITUNGAN (Modular Section) */}
        <SectionPerhitunganTunjangan
          formData={formData}
          setFormData={setFormData}
          activeInfoTooltip={activeInfoTooltip}
          setActiveInfoTooltip={setActiveInfoTooltip}
          handleSelectScheme={handleSelectScheme}
          handleAddAturan={handleAddAturan}
          updateAturan={updateAturan}
          removeAturan={removeAturan}
        />

        {/* FIXED BOTTOM ACTION BAR (TOMBOL SIMPAN FULL WIDTH) */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3.5 sm:px-5 md:px-8 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="max-w-4xl mx-auto w-full">
            <Button 
              type="submit"
              disabled={isSaving || !formData.nama}
              className="w-full h-11 sm:h-12 text-sm font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>{isSaving ? 'Menyimpan...' : id ? 'Perbarui Komponen' : 'Simpan Komponen'}</span>
            </Button>
          </div>
        </div>

      </form>

      {/* MODAL: TEMPLATE SELECTION (Modular Component) */}
      <ModalTemplateTunjangan
        isOpen={isTemplateSheetOpen}
        onClose={() => setIsTemplateSheetOpen(false)}
        templates={QUICK_TEMPLATES}
        onSelectTemplate={applyTemplate}
      />

    </div>
  );
}
export default FormTunjangan;
