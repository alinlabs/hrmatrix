import React from 'react';
import { 
  Check, 
  Copy, 
  MessageCircle, 
  Users, 
  Sparkles, 
  TrendingDown, 
  ShieldCheck, 
  Briefcase, 
  CheckCircle2, 
  UserCheck, 
  CalendarCheck, 
  FileText 
} from 'lucide-react';
import { BillingMode, CustomModulesCalculation } from './types';
import { ALL_MODULES, formatRupiah } from './utils-helper';
import { PromoBillingSwitcher } from './promo-billing-switcher';

interface PromoModuleCalculatorProps {
  billingMode: BillingMode;
  onBillingModeChange: (mode: BillingMode) => void;
  headcount: number;
  onHeadcountChange: (count: number) => void;
  selectedModules: string[];
  customCalculation: CustomModulesCalculation;
  copiedText: boolean;
  whatsappCustomUrl: string;
  onToggleModule: (id: string) => void;
  onSelectAllModules: () => void;
  onSelectPresetModules: (moduleIds: string[]) => void;
  onCopyCustomProposal: () => void;
  onBackToPackages?: () => void;
  onOrderCustom?: () => void;
}

export function PromoModuleCalculator({
  billingMode,
  onBillingModeChange,
  headcount,
  onHeadcountChange,
  selectedModules,
  customCalculation,
  copiedText,
  whatsappCustomUrl,
  onToggleModule,
  onSelectAllModules,
  onSelectPresetModules,
  onCopyCustomProposal,
  onBackToPackages,
  onOrderCustom
}: PromoModuleCalculatorProps) {

  // Module bundle presets
  const BUNDLE_PRESETS = [
    {
      name: '8 Modul Inti HR (Paket Standar HR)',
      ids: [
        'data_karyawan',
        'legal_administrasi',
        'presensi_jadwal',
        'manajemen_cuti',
        'kinerja_kpi',
        'payroll',
        'rekrutmen_asesmen',
        'background_check'
      ],
      desc: 'Standar HR: Rp 20.000 / karyawan / bln (Basis 50 Karyawan Uji Coba)'
    },
    {
      name: 'Inti Operasional & Payroll (6 Modul)',
      ids: ['data_karyawan', 'legal_administrasi', 'presensi_jadwal', 'manajemen_cuti', 'payroll', 'pelaporan_hr_ga'],
      desc: 'Data Karyawan, Legal, Presensi, Cuti, Payroll & Pelaporan'
    },
    {
      name: 'Full General Affairs & Kantor (5 Modul)',
      ids: ['inventaris_aset', 'pengadaan_atk', 'fasilitas_servis', 'vendor_perizinan', 'buku_tamu_surat'],
      desc: 'Inventaris Aset, Pengadaan ATK, Servis, Vendor & Resepsionis'
    }
  ];

  const isAgentMode = billingMode === 'agent';

  return (
    <div className="space-y-6">
      
      {/* 1. Full-Width Tabs Persis Halaman Paket Siap Pakai (Tanpa Judul, Deskripsi & Badge) */}
      <PromoBillingSwitcher
        billingMode={billingMode}
        onBillingModeChange={onBillingModeChange}
      />

      {/* Special Agent Hybrid Explanation Banner */}
      {isAgentMode && (
        <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-violet-50/80 via-blue-50/40 to-slate-50 border border-violet-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-r from-violet-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-violet-950 flex items-center gap-2">
                <span>Layanan Dedicated Agent HR & GA Hybrid</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-900 border border-violet-200">
                  Online + Offline 1x/Mgg
                </span>
              </h4>
              <p className="text-xs text-violet-800 mt-0.5 leading-relaxed">
                Person-in-Charge profesional ditugaskan khusus mengelola modul-modul di bawah ini untuk perusahaan Anda. 
                <strong> Kerja harian online</strong> di sistem cloud HRMatrix, plus <strong>kunjungan tatap muka 1 minggu 1 kali</strong> ke kantor Anda untuk cek fisik, audit berkas, dan mediasi.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-violet-200 shadow-2xs">
            <CalendarCheck className="w-4 h-4 text-violet-600 shrink-0" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400">Jadwal Kunjungan On-Site</div>
              <div className="text-xs font-black text-violet-950">1x / Minggu (4x / Bulan)</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Jumlah Karyawan (Input Manual Langsung) */}
      <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
        isAgentMode 
          ? 'bg-white border-violet-200 shadow-2xs'
          : 'bg-white border-slate-200/90 shadow-2xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs ${
              isAgentMode ? 'bg-linear-to-r from-violet-600 to-blue-600' : 'bg-blue-600'
            }`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Jumlah Karyawan
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                {customCalculation.scaleLabel}
              </h3>
            </div>
          </div>

          {/* Kolom Input Manual Langsung */}
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs self-start sm:self-auto">
            <span className="text-xs text-slate-600 font-semibold">Jumlah Karyawan:</span>
            <input
              type="number"
              min={1}
              max={10000}
              value={headcount}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) onHeadcountChange(Math.max(1, Math.min(10000, val)));
              }}
              placeholder="Contoh: 50"
              className={`w-24 font-black text-center text-lg bg-white border rounded-lg px-2 py-1 focus:outline-hidden ${
                isAgentMode 
                  ? 'text-violet-700 border-violet-300 focus:border-violet-600' 
                  : 'text-blue-700 border-blue-300 focus:border-blue-600'
              }`}
            />
            <span className="text-xs font-bold text-slate-700">Orang</span>
          </div>
        </div>
      </div>

      {/* 3. Module Selection Toolbar & Bundle Shortcuts */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {isAgentMode ? 'Tentukan Modul yang Dikelola oleh Agent' : 'Pilih Modul yang Dibutuhkan'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {isAgentMode 
                ? `Agent HRMatrix akan mengelola modul-modul ini untuk ${headcount} karyawan Anda secara rutin.`
                : `Centang modul satuan yang diinginkan. Patokan standar 8 Modul HR untuk 50 karyawan hanya Rp 20.000 / karyawan / bln pada masa uji coba (dan jauh lebih hemat pada sewa tahunan).`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelectAllModules}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer border ${
                isAgentMode
                  ? 'text-violet-800 bg-violet-50 hover:bg-violet-100 border-violet-200'
                  : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200'
              }`}
            >
              Pilih Semua ({ALL_MODULES.length} Modul)
            </button>
          </div>
        </div>

        {/* Quick Bundle Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {BUNDLE_PRESETS.map((bundle) => {
            const isAllIncluded = bundle.ids.every(id => selectedModules.includes(id));
            return (
              <button
                key={bundle.name}
                type="button"
                onClick={() => onSelectPresetModules(bundle.ids)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                  isAllIncluded
                    ? (isAgentMode 
                        ? 'bg-violet-50/70 border-violet-300 shadow-2xs' 
                        : 'bg-blue-50/70 border-blue-300 shadow-2xs')
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 ${
                  isAllIncluded 
                    ? (isAgentMode ? 'bg-linear-to-r from-violet-600 to-blue-600 text-white' : 'bg-blue-600 text-white') 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{bundle.name}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{bundle.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Module Selection Grid with Headcount-Scaled Dynamic Pricing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {ALL_MODULES.map((mod) => {
          const isSelected = selectedModules.includes(mod.id);
          const breakdown = customCalculation.moduleBreakdowns.find(b => b.id === mod.id);

          // Scaled prices according to billing mode
          let displayNormal = breakdown?.normalPrice ?? mod.normalPricePerMonth;
          let displayPromo = breakdown?.promoPrice ?? mod.promoPricePerMonth;
          let priceUnit = '/bln';

          if (billingMode === 'trial') {
            displayPromo = Math.round(displayPromo * 1.25);
            priceUnit = '/bln';
          } else if (billingMode === 'whitelabel') {
            displayNormal = breakdown?.normalWhitelabel ?? mod.whitelabelNormalPrice;
            displayPromo = breakdown?.promoWhitelabel ?? mod.whitelabelPromoPrice;
            priceUnit = ' (beli putus)';
          } else if (billingMode === 'agent') {
            // In agent mode, show module scope rate when handled by agent
            displayNormal = Math.round(displayNormal * 1.35);
            displayPromo = Math.round(displayPromo * 1.2);
            priceUnit = '/bln (Agent)';
          }

          const discountPct = Math.max(1, Math.round(((displayNormal - displayPromo) / displayNormal) * 100));

          return (
            <div
              key={mod.id}
              onClick={() => onToggleModule(mod.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? (isAgentMode 
                      ? 'bg-violet-50/40 border-violet-400 shadow-2xs ring-1 ring-violet-300' 
                      : 'bg-blue-50/40 border-blue-400 shadow-2xs ring-1 ring-blue-300')
                  : 'bg-white border-slate-200 hover:border-slate-300 opacity-85'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{mod.category}</span>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    isSelected 
                      ? (isAgentMode ? 'bg-linear-to-r from-violet-600 to-blue-600 border-violet-600 text-white' : 'bg-blue-600 border-blue-600 text-white') 
                      : 'bg-white border-slate-300'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{mod.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">{mod.description}</p>
                </div>

                {/* Include Fitur Sub-Modul */}
                <div className="space-y-1 pt-1.5 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Include Fitur ({mod.features.length}):
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-0.5">
                    {mod.features.map((feat, idx) => (
                      <span 
                        key={idx} 
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border inline-flex items-center gap-1 ${
                          isSelected 
                            ? (isAgentMode 
                                ? 'bg-violet-100/70 border-violet-200 text-violet-900' 
                                : 'bg-blue-100/70 border-blue-200 text-blue-900')
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className={`w-1 h-1 rounded-full shrink-0 ${isSelected ? (isAgentMode ? 'bg-violet-600' : 'bg-blue-600') : 'bg-slate-400'}`} />
                        <span className="truncate">{feat}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className="pt-3 mt-3 border-t border-slate-200/70">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 line-through">{formatRupiah(displayNormal)}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isAgentMode ? 'text-violet-700 bg-violet-50' : 'text-rose-600 bg-rose-50'
                  }`}>
                    -{discountPct}%
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isAgentMode ? 'Scope Agent:' : 'Harga Promo:'}
                  </span>
                  <span className={`text-xs font-black ${isAgentMode ? 'text-violet-800' : 'text-blue-700'}`}>
                    {formatRupiah(displayPromo)}
                    <span className="text-[10px] text-slate-400 font-normal">{priceUnit}</span>
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-1">
                  <Users className="w-2.5 h-2.5 text-slate-400" />
                  <span>Kapasitas {headcount} Karyawan</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Cost Efficiency Callout & Market Benchmark */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-3.5 p-4 sm:p-5 rounded-2xl text-white ${
        isAgentMode 
          ? 'bg-linear-to-r from-slate-950 via-violet-950 to-blue-950' 
          : 'bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900'
      }`}>
        
        {/* Cost per employee / Total Investment */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-blue-200 font-medium">
            <TrendingDown className={`w-4 h-4 ${isAgentMode ? 'text-violet-400' : 'text-emerald-400'}`} />
            <span>{isAgentMode ? 'Total Investasi Sistem + Agent' : 'Investasi Riil per Karyawan'}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {isAgentMode 
                ? formatRupiah(customCalculation.agentMonthlyPromo) 
                : formatRupiah(customCalculation.costPerEmployeeMonthly)}
            </span>
            <span className="text-xs text-blue-200">{isAgentMode ? '/ bulan' : '/ karyawan / bln'}</span>
          </div>
          <div className={`text-[11px] ${isAgentMode ? 'text-violet-300' : 'text-emerald-300'}`}>
            {isAgentMode ? (
              <>Mencakup sistem cloud + <strong>1x kunjungan tatap muka/minggu</strong> & online harian.</>
            ) : (
              <>Setara hanya <strong>{formatRupiah(customCalculation.costPerEmployeeDaily)} / hari</strong> untuk {customCalculation.selectedModulesCount} modul aktif.</>
            )}
          </div>
        </div>

        {/* Market comparison */}
        <div className="space-y-1 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
          <div className="flex items-center gap-1.5 text-xs text-blue-200 font-medium">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>{isAgentMode ? 'Gaji Staf HR & GA In-House' : 'Benchmark Pasar HRIS'}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-300 line-through">
              {isAgentMode 
                ? formatRupiah(customCalculation.agentInhouseBenchmark) 
                : formatRupiah(customCalculation.marketBenchmarkPerEmployee)}
            </span>
            <span className="text-xs text-slate-300">{isAgentMode ? '/ bulan' : '/ user / bln'}</span>
          </div>
          <div className={`text-[11px] font-medium ${isAgentMode ? 'text-violet-300' : 'text-emerald-300'}`}>
            {isAgentMode ? (
              <>Hemat <strong>~{formatRupiah(customCalculation.agentVsInhouseSavings)} / bulan</strong> dibanding menggaji staf HR & GA in-house!</>
            ) : (
              <>Hemat hingga ~{formatRupiah(customCalculation.marketSavingsMonthly)} / bulan dibanding software HR konvensional.</>
            )}
          </div>
        </div>

        {/* Why this minimizes costs note */}
        <div className="space-y-1 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
          <div className="flex items-center gap-1.5 text-xs text-blue-200 font-medium">
            <ShieldCheck className={`w-4 h-4 ${isAgentMode ? 'text-violet-400' : 'text-emerald-400'}`} />
            <span>{isAgentMode ? 'Bebas Risiko & Turnover' : 'Efisiensi Anggaran Maksimal'}</span>
          </div>
          <p className="text-[11px] text-blue-100 leading-relaxed">
            {isAgentMode ? (
              <>Tidak perlu pusing membayar BPJS karyawan HR, uang pesangon, THR staf, atau biaya rekrutmen ulang jika staf HR resign.</>
            ) : (
              <>Anda hanya membayar modul yang dipakai untuk jumlah {headcount} orang saat ini. Fleksibel di-upgrade saat tim berkembang tanpa biaya denda.</>
            )}
          </p>
        </div>
      </div>

      {/* 6. Calculator Summary Bar with Comparison & CTA Actions */}
      <div className={`p-5 sm:p-6 rounded-2xl text-white flex flex-col lg:flex-row items-center justify-between gap-5 shadow-lg ${
        isAgentMode ? 'bg-slate-900 border border-violet-900/60' : 'bg-slate-900'
      }`}>
        <div className="space-y-1.5 text-center lg:text-left w-full lg:w-auto">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-400">
            <span>Modul: <strong className="text-white">{selectedModules.length} dari {ALL_MODULES.length} Modul</strong></span>
            <span>•</span>
            <span>Kapasitas: <strong className="text-white">{headcount} Karyawan</strong> ({customCalculation.scaleBadge})</span>
            <span>•</span>
            <span className={isAgentMode ? 'text-violet-300' : 'text-blue-300'}>
              Skema: <strong className="text-white">
                {billingMode === 'trial' 
                  ? 'Uji Coba 3 Bln (1x Kontrak)' 
                  : billingMode === 'annual' 
                  ? 'Sewa Cloud Tahunan' 
                  : billingMode === 'agent'
                  ? 'Dedicated Agent (HR & GA Hybrid)'
                  : 'White Label Beli Putus'}
              </strong>
            </span>
          </div>

          {/* Pricing Row according to mode */}
          <div className="flex flex-wrap items-baseline gap-2.5 justify-center lg:justify-start">
            {billingMode === 'trial' ? (
              <>
                <span className="text-xs text-slate-400 line-through">
                  {formatRupiah(customCalculation.trialMonthlyNormal)}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {formatRupiah(customCalculation.trialMonthlyPromo)}
                </span>
                <span className="text-xs text-slate-400">/bulan</span>
                <span className="text-xs text-amber-400 font-bold bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
                  Total 3 Bln Uji Coba: {formatRupiah(customCalculation.trialTotalBilled)} (Hemat {formatRupiah(customCalculation.trialSaved)})
                </span>
              </>
            ) : billingMode === 'annual' ? (
              <>
                <span className="text-xs text-slate-400 line-through">
                  {formatRupiah(customCalculation.normalMonthly)}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {formatRupiah(customCalculation.promoMonthly)}
                </span>
                <span className="text-xs text-slate-400">/bulan</span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                  Total 1 Tahun: {formatRupiah(customCalculation.promoAnnual)} (Hemat {formatRupiah(customCalculation.savedAnnual)})
                </span>
              </>
            ) : billingMode === 'agent' ? (
              <>
                <span className="text-xs text-slate-400 line-through">
                  {formatRupiah(customCalculation.agentMonthlyNormal)}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {formatRupiah(customCalculation.agentMonthlyPromo)}
                </span>
                <span className="text-xs text-slate-400">/bulan</span>
                <span className="text-xs text-violet-300 font-bold bg-violet-950/80 px-2.5 py-1 rounded-lg border border-violet-800">
                  Hemat {formatRupiah(customCalculation.agentSavedMonthly)}/bln (vs Rekrut HR Sendiri Hemat {formatRupiah(customCalculation.agentVsInhouseSavings)})
                </span>
              </>
            ) : (
              <>
                <span className="text-xs text-slate-400 line-through">
                  {formatRupiah(customCalculation.whitelabelNormal)}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {formatRupiah(customCalculation.whitelabelPromo)}
                </span>
                <span className="text-xs text-slate-400">(Beli Putus Perpetual)</span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                  Hemat {formatRupiah(customCalculation.whitelabelSaved)}
                </span>
              </>
            )}
          </div>

          {isAgentMode && (
            <div className="text-[11px] text-violet-300 flex items-center justify-center lg:justify-start gap-1.5 pt-0.5">
              <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Termasuk: Daily Online Standby + 1x Kunjungan Fisik / Minggu (4x Sebulan)</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
          {onOrderCustom && (
            <button
              type="button"
              onClick={onOrderCustom}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Pesan & Dapatkan Invoice Otomatis</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCopyCustomProposal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-700 shadow-xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedText ? 'Rincian Tersalin!' : (isAgentMode ? 'Salin Proposal Agent' : 'Salin Proposal Custom')}</span>
          </button>

          <a
            href={whatsappCustomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-colors shadow-md cursor-pointer ${
              isAgentMode 
                ? 'bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500' 
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isAgentMode ? 'Konsultasi Dedicated Agent' : 'Konsultasi Paket Custom'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
