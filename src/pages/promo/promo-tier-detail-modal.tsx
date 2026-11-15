import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ArrowRight, 
  Users, 
  Layers, 
  Sparkles, 
  Headphones, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  FileText
} from 'lucide-react';
import { BillingMode, CompanySizeTier, TierData } from './types';
import { 
  PRICING_DATA, 
  TIER_CARD_TEXTS, 
  PROMO_MODAL_TEXT_CONFIG, 
  ALL_MODULES,
  formatRupiah 
} from './utils-helper';

interface PromoTierDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierKey: CompanySizeTier | null;
  billingMode: BillingMode;
  onClaimPromo: (tierKey: CompanySizeTier) => void;
}

export function PromoTierDetailModal({
  isOpen,
  onClose,
  tierKey,
  billingMode,
  onClaimPromo
}: PromoTierDetailModalProps) {
  const [showPortalsList, setShowPortalsList] = useState(true);

  if (!isOpen || !tierKey) return null;

  const tierData: TierData = PRICING_DATA[tierKey];
  const classified = tierData.classifiedDetails;
  const tierTexts = TIER_CARD_TEXTS[tierKey];
  const modalConfig = PROMO_MODAL_TEXT_CONFIG;

  const isStartup = tierKey === 'startup';
  const isGrowth = tierKey === 'growth';
  const isEnterprise = tierKey === 'enterprise';

  const modalBillingLabel = modalConfig.labels[billingMode];
  const headerInitials = modalConfig.headerBadgeInitials[tierKey];
  const packageTitle = billingMode === 'agent' ? tierTexts.agentName : tierData.name;

  const getPriceDisplay = () => {
    if (billingMode === 'agent') {
      return {
        price: `${formatRupiah(tierData.agent.promoPricePerMonth)}/bln`,
        normal: `${formatRupiah(tierData.agent.normalPricePerMonth)}/bln`,
        discount: tierData.agent.discountPercent,
        note: `Hybrid Model: Standby Online Harian + ${tierData.agent.visitFrequency} Visit Offline`,
        highlight: `Hemat vs Rekrut HR Sendiri: ~${formatRupiah(tierData.agent.inhouseSavingsMonthly)}/bln`
      };
    }
    if (billingMode === 'trial') {
      return {
        price: `${formatRupiah(tierData.trial.promoPricePerMonth)}/bln`,
        normal: `${formatRupiah(tierData.trial.normalPricePerMonth)}/bln`,
        discount: tierData.trial.discountPercent,
        note: `Total 1x Kontrak 3 Bulan: ${formatRupiah(tierData.trial.totalBilled)}`,
        highlight: isEnterprise 
          ? 'Limit dasar maks 500 karyawan selama uji coba'
          : `Est. ${tierData.trial.costAnalysis.perEmployeeDay}/user/hari`
      };
    }
    if (billingMode === 'annual') {
      return {
        price: `${formatRupiah(tierData.annual.promoPricePerMonth)}/bln`,
        normal: `${formatRupiah(tierData.annual.normalPricePerMonth)}/bln`,
        discount: tierData.annual.discountPercent,
        note: `Ditagihkan 12 Bulan: ${formatRupiah(tierData.annual.promoAnnualBilled)}/thn`,
        highlight: isEnterprise
          ? 'Limit dasar maks 500 karyawan (+Rp 5.000/karyawan/bln jika lebih)'
          : `Est. Hanya ${tierData.costAnalysis.perEmployeeDay}/karyawan/hari`
      };
    }
    return {
      price: `${formatRupiah(tierData.whitelabel.promoPrice)}`,
      normal: `${formatRupiah(tierData.whitelabel.normalPrice)}`,
      discount: tierData.whitelabel.discountPercent,
      note: 'Pembayaran Satu Kali (One-Time License)',
      highlight: '100% Kepemilikan Source Code & Instalasi Server Privat Mandiri'
    };
  };

  const priceInfo = getPriceDisplay();

  const handleClaim = () => {
    onClaimPromo(tierKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs font-black text-sm">
              {headerInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {packageTitle}
                </h3>
                <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {tierTexts.karyawan}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <span>Mode:</span>
                <strong className="text-slate-800">{modalBillingLabel}</strong>
                <span>•</span>
                <span className="text-emerald-700 font-bold">{tierTexts.regularBadge}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label={modalConfig.actions.closeBtn}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Price Overview Callout */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 line-through">
                  {priceInfo.normal}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded">
                  Diskon {priceInfo.discount}
                </span>
              </div>
              <div className="text-2xl font-black text-white mt-0.5">
                {priceInfo.price}
              </div>
              <div className="text-xs text-slate-300 mt-1 font-medium">
                {priceInfo.note}
              </div>
            </div>

            <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 text-xs font-semibold text-emerald-300 sm:text-right max-w-xs">
              ✓ {priceInfo.highlight}
            </div>
          </div>

          {/* 4 Unsur Matriks: Langsung teks tanpa card, tanpa badge, tanpa deskripsi, dan tanpa garis */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-left py-1">
            <div className="text-xs font-extrabold text-slate-800">
              {classified.modulDanEPortal.modulesCount} Modul Inti
            </div>
            <div className="text-xs font-extrabold text-slate-800">
              {classified.fiturExclusive.length} Fitur Exclusive
            </div>
            <div className="text-xs font-extrabold text-slate-800">
              {classified.modulDanEPortal.eportalsCount} ePortal ID
            </div>
            <div className="text-xs font-extrabold text-slate-800">
              {classified.layananDanBantuan.length} Layanan & Bantuan
            </div>
          </div>

          {/* 4 Official Classifications */}
          <div className="space-y-4">
            {/* 1. KAPASITAS */}
            <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  <Users className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{modalConfig.sectionTitles.kapasitas.title}</span>
                </div>
                <span className="text-xs font-black text-blue-900 bg-blue-100 px-3 py-0.5 rounded-lg border border-blue-200">
                  {classified.kapasitas.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {classified.kapasitas.description}
              </p>
              {classified.kapasitas.extraNote && (
                <div className="text-xs font-semibold text-indigo-900 bg-indigo-50/90 p-2.5 rounded-xl border border-indigo-200/80 leading-snug">
                  📌 {classified.kapasitas.extraNote}
                </div>
              )}
            </div>

            {/* 2. MODUL & EPORTAL */}
            <div className="rounded-2xl p-4 bg-blue-50/50 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-blue-950 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{modalConfig.sectionTitles.modulDanEPortal.title}</span>
                </div>
                <span className="text-xs font-black text-blue-800 bg-white px-3 py-0.5 rounded-lg border border-blue-200 shadow-2xs">
                  {classified.modulDanEPortal.modulesCount} Modul Inti + {classified.modulDanEPortal.eportalsCount} E-Portal
                </span>
              </div>

              {/* Modul Inti HRMatrix Sesuai Tier */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-blue-950 flex items-center justify-between">
                  <span>{classified.modulDanEPortal.modulesCount} Modul Inti HR & Operasional HRMatrix:</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black border border-emerald-200">
                    {modalConfig.sectionTitles.modulDanEPortal.modulesBadge}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-0.5">
                  {classified.modulDanEPortal.moduleNames.map((modName, idx) => {
                    const matchedMod = ALL_MODULES.find(m => m.name.toLowerCase() === modName.toLowerCase());
                    return (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-blue-100 text-xs text-slate-800 shadow-2xs space-y-1">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">{modName}</span>
                        </div>
                        {matchedMod && matchedMod.features.length > 0 && (
                          <div className="pl-6 text-[10px] text-slate-500 leading-relaxed">
                            <span className="font-semibold text-slate-600">Include: </span>
                            {matchedMod.features.join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* E-Portal Pelaporan Pemerintah Sesuai Tier */}
              <div className="space-y-2 pt-2 border-t border-blue-200/70">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-blue-950">
                    {classified.modulDanEPortal.eportalsCount} E-Portal Eksternal Pelaporan Regulasi & Kepatuhan Pemerintah:
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPortalsList(prev => !prev)}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{showPortalsList ? 'Tutup Daftar' : `Tampilkan ${classified.modulDanEPortal.eportalsCount} Portal`}</span>
                    {showPortalsList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showPortalsList && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 bg-white/90 rounded-2xl border border-blue-200/90 max-h-60 overflow-y-auto">
                    {classified.modulDanEPortal.eportalNames.map((portalName, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-800 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded-lg">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-medium truncate">{portalName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. FITUR EXCLUSIVE */}
            <div className="rounded-2xl p-4 bg-amber-50/50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-950 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>3. Fitur Exclusive & Kemampuan Sistem</span>
                </div>
                <span className="text-[10px] font-black text-amber-800 bg-white px-2.5 py-0.5 rounded-md border border-amber-200 shadow-2xs">
                  {classified.fiturExclusive.length} Fitur
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {classified.fiturExclusive.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200/70 text-xs text-slate-800">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. LAYANAN & BANTUAN */}
            <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  <Headphones className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>4. Fasilitas Layanan & Pendampingan Bantuan</span>
                </div>
                <span className="text-[10px] font-black text-indigo-800 bg-white px-2.5 py-0.5 rounded-md border border-indigo-200 shadow-2xs">
                  {classified.layananDanBantuan.length} Layanan
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {classified.layananDanBantuan.map((service, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-snug">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            {modalConfig.actions.closeBtn}
          </button>

          <button
            type="button"
            onClick={handleClaim}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              billingMode === 'agent'
                ? 'bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-violet-500/20'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>{modalConfig.actions.claimBtn}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PromoTierDetailModal;
