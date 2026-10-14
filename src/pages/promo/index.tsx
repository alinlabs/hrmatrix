import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  GraduationCap, 
  HelpCircle, 
  Package, 
  Sliders, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Info,
  FileText
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { PageHeaderTitle, DesktopHeaderActions, MobileHeaderActions } from '../../context/MobileNavContext';
import { Modal } from '../../components/ui/Modal';
import { cn } from '../../utils/cn';
import { BillingMode, CompanySizeTier } from './types';
import { 
  ALL_MODULES, 
  PRICING_DATA, 
  calculateCustomModules, 
  generateWhatsAppPromoUrl, 
  generateWhatsAppCustomUrl,
  generateCustomProposalSummaryText 
} from './utils-helper';
import { PromoBillingSwitcher } from './promo-billing-switcher';
import { PromoTierCards } from './promo-tier-cards';
import { PromoModuleCalculator } from './promo-module-calculator';
import { PromoTrainingSection } from './promo-training-section';
import { PromoComparisonTable } from './promo-comparison-table';
import { PromoFaq } from './promo-faq';
import { PromoOrderPage } from './promo-order-page';

export type PromoViewMode = 'packages' | 'custom' | 'order';
export type PromoModalType = 'comparison' | 'onboarding' | 'faq' | null;

export function PromoPricingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawView = searchParams.get('view') || searchParams.get('tab');
  const initialView: PromoViewMode = rawView === 'custom' || rawView === 'order' ? rawView : 'packages';
  const [viewMode, setViewMode] = useState<PromoViewMode>(initialView);

  const handleSetViewMode = (mode: PromoViewMode) => {
    setViewMode(mode);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (mode === 'packages') {
        next.delete('view');
        next.delete('tab');
      } else {
        next.set('view', mode);
        next.delete('tab');
      }
      return next;
    }, { replace: true });
  };
  const [activeModal, setActiveModal] = useState<PromoModalType>(null);
  const [billingMode, setBillingMode] = useState<BillingMode>('annual');
  const [selectedTier, setSelectedTier] = useState<CompanySizeTier>('growth');
  const [isCustomOrder, setIsCustomOrder] = useState<boolean>(false);
  const [headcount, setHeadcount] = useState<number>(50);
  const [selectedModules, setSelectedModules] = useState<string[]>(ALL_MODULES.map(m => m.id));
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [copiedText, setCopiedText] = useState(false);

  // Custom module & headcount calculation
  const customModulesCalculation = useMemo(() => {
    return calculateCustomModules(selectedModules, headcount, billingMode);
  }, [selectedModules, headcount, billingMode]);

  const currentTierData = PRICING_DATA[selectedTier];

  // WhatsApp bundle claim URL
  const whatsappUrl = useMemo(() => {
    return generateWhatsAppPromoUrl(billingMode, currentTierData, selectedTier);
  }, [billingMode, currentTierData, selectedTier]);

  // WhatsApp customized package claim URL
  const whatsappCustomUrl = useMemo(() => {
    return generateWhatsAppCustomUrl(customModulesCalculation, selectedModules, billingMode);
  }, [customModulesCalculation, selectedModules, billingMode]);

  const handleToggleModule = (id: string) => {
    setSelectedModules(prev => 
      prev.includes(id) 
        ? (prev.length > 1 ? prev.filter(mId => mId !== id) : prev) 
        : [...prev, id]
    );
  };

  const handleSelectAllModules = () => {
    setSelectedModules(ALL_MODULES.map(m => m.id));
  };

  const handleSelectPresetModules = (moduleIds: string[]) => {
    setSelectedModules(moduleIds);
  };

  const handleCopyCustomProposal = () => {
    const summaryText = generateCustomProposalSummaryText(customModulesCalculation, selectedModules, billingMode);
    navigator.clipboard.writeText(summaryText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleClaimPromo = (tier: CompanySizeTier) => {
    setSelectedTier(tier);
    setIsCustomOrder(false);
    handleSetViewMode('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageHeaderInfo = useMemo(() => {
    switch (viewMode) {
      case 'custom':
        return {
          title: 'Kustomisasi Modul & Karyawan',
          subtitle: 'Kalkulator fleksibel pay-per-module dan simulasi efisiensi biaya'
        };
      case 'order':
        return {
          title: 'Halaman Pemesanan & Invoice',
          subtitle: 'Formulir pemesanan resmi, skema pembayaran & generator invoice otomatis'
        };
      default:
        return {
          title: 'Paket Promosi',
          subtitle: 'Daftar harga siap pakai, skema cicilan & lisensi server'
        };
    }
  }, [viewMode]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* 1. Header Navigation Integration */}
      <PageHeaderTitle
        title={pageHeaderInfo.title}
        subtitle={pageHeaderInfo.subtitle}
      />

      {/* Desktop Top Header Action Buttons */}
      <DesktopHeaderActions>
        <button
          type="button"
          onClick={() => {
            handleSetViewMode('packages');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border rounded-xl transition-all cursor-pointer shadow-2xs',
            viewMode === 'packages'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 border-slate-200/90'
          )}
          title="Paket Siap Pakai"
        >
          <Package className="w-3.5 h-3.5 shrink-0" />
          <span>Paket Siap Pakai</span>
        </button>

        <button
          type="button"
          onClick={() => {
            handleSetViewMode('custom');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border rounded-xl transition-all cursor-pointer shadow-2xs',
            viewMode === 'custom'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/80 border-slate-200/90'
          )}
          title="Kustomisasi Modul"
        >
          <Sliders className="w-3.5 h-3.5 shrink-0" />
          <span>Kustomisasi</span>
        </button>

        <button
          type="button"
          onClick={() => {
            handleSetViewMode('order');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border rounded-xl transition-all cursor-pointer shadow-2xs',
            viewMode === 'order'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/80 border-slate-200/90'
          )}
          title="Form Pemesanan & Invoice"
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>Pesan & Invoice</span>
        </button>

        <div className="h-4 w-px bg-slate-200 my-auto mx-0.5" />

        <button
          type="button"
          onClick={() => setActiveModal('comparison')}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          title="Perbandingan Lisensi & Dedicated Agent"
          aria-label="Perbandingan Lisensi & Dedicated Agent"
        >
          <Scale className="w-4 h-4 text-blue-600 shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('onboarding')}
          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          title="Layanan Onboarding & Panduan Intensif"
          aria-label="Layanan Onboarding & Panduan Intensif"
        >
          <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('faq')}
          className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          title="Tanya Jawab (FAQ)"
          aria-label="Tanya Jawab (FAQ)"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
        </button>
      </DesktopHeaderActions>

      {/* Mobile Top Header Compact Action Buttons */}
      <MobileHeaderActions>
        <button
          type="button"
          onClick={() => {
            handleSetViewMode('packages');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={cn(
            'p-1.5 rounded-lg transition-colors cursor-pointer',
            viewMode === 'packages' ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
          )}
          title="Paket Siap Pakai"
          aria-label="Paket Siap Pakai"
        >
          <Package className="w-4 h-4 text-blue-600" />
        </button>
        <button
          type="button"
          onClick={() => {
            handleSetViewMode('custom');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={cn(
            'p-1.5 rounded-lg transition-colors cursor-pointer',
            viewMode === 'custom' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50'
          )}
          title="Kustomisasi Modul"
          aria-label="Kustomisasi Modul"
        >
          <Sliders className="w-4 h-4 text-indigo-600" />
        </button>
        <button
          type="button"
          onClick={() => {
            handleSetViewMode('order');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={cn(
            'p-1.5 rounded-lg transition-colors cursor-pointer',
            viewMode === 'order' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50'
          )}
          title="Form Pemesanan & Invoice"
          aria-label="Form Pemesanan & Invoice"
        >
          <FileText className="w-4 h-4 text-emerald-600" />
        </button>
        <div className="h-4 w-px bg-slate-200 my-auto" />

        <button
          type="button"
          onClick={() => setActiveModal('comparison')}
          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Perbandingan Lisensi"
          aria-label="Perbandingan Lisensi"
        >
          <Scale className="w-4 h-4 text-blue-600" />
        </button>
        <button
          type="button"
          onClick={() => setActiveModal('onboarding')}
          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Layanan Onboarding"
          aria-label="Layanan Onboarding"
        >
          <GraduationCap className="w-4 h-4 text-indigo-600" />
        </button>
        <button
          type="button"
          onClick={() => setActiveModal('faq')}
          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Tanya Jawab"
          aria-label="Tanya Jawab"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600" />
        </button>
      </MobileHeaderActions>

      {/* 4. VIEW MODE 1: HARGA PAKET SIAP PAKAI (Default View) */}
      {viewMode === 'packages' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Interactive Billing Switcher (Uji Coba vs Sewa Tahunan vs White Label vs Dedicated Agent) */}
          <PromoBillingSwitcher
            billingMode={billingMode}
            onBillingModeChange={setBillingMode}
          />

          {/* Three Main Package Tiers Cards (Startup, Growth, Enterprise) */}
          <PromoTierCards
            billingMode={billingMode}
            selectedTier={selectedTier}
            onSelectTier={setSelectedTier}
            onClaimPromo={handleClaimPromo}
          />

          {/* High-Impact Customization Callout Banner */}
          <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white flex flex-col sm:flex-row items-center justify-between gap-5 border border-slate-800 shadow-md">
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Ingin Pilih Modul Tertentu & Sesuaikan dengan Jumlah Karyawan Anda?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Anda tidak harus membeli paket bundling penuh. Gunakan kalkulator kustomisasi interaktif kami untuk memilih modul yang dibutuhkan dan hitung biaya transparan sesuai skala karyawan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                handleSetViewMode('custom');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all shrink-0 cursor-pointer flex items-center gap-2 group"
            >
              <span>Buka Halaman Kustomisasi Modul</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* 5. VIEW MODE 2: KUSTOMISASI MODUL & KARYAWAN (Detail Pay-Per-Module) */}
      {viewMode === 'custom' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Full Custom Module & Headcount Calculator */}
          <PromoModuleCalculator
            billingMode={billingMode}
            onBillingModeChange={setBillingMode}
            headcount={headcount}
            onHeadcountChange={setHeadcount}
            selectedModules={selectedModules}
            customCalculation={customModulesCalculation}
            copiedText={copiedText}
            whatsappCustomUrl={whatsappCustomUrl}
            onToggleModule={handleToggleModule}
            onSelectAllModules={handleSelectAllModules}
            onSelectPresetModules={handleSelectPresetModules}
            onCopyCustomProposal={handleCopyCustomProposal}
            onBackToPackages={() => {
              handleSetViewMode('packages');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOrderCustom={() => {
              setIsCustomOrder(true);
              handleSetViewMode('order');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* 6. VIEW MODE 3: HALAMAN PEMESANAN & INVOICE OTOMATIS */}
      {viewMode === 'order' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <PromoOrderPage
            initialTierKey={selectedTier}
            initialBillingMode={billingMode}
            customCalculation={customModulesCalculation}
            isCustomOrder={isCustomOrder}
            selectedModuleIds={selectedModules}
            onBackToPromo={() => {
              handleSetViewMode('packages');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* UNIFIED MODAL DIALOG: PERBANDINGAN, ONBOARDING, TANYA JAWAB (FAQ) */}
      <Modal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        contentClassName="max-w-4xl max-h-[88vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {activeModal === 'comparison' && (
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
            )}
            {activeModal === 'onboarding' && (
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
            )}
            {activeModal === 'faq' && (
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight truncate">
                {activeModal === 'comparison' && 'Perbandingan Model Lisensi & Layanan Agent'}
                {activeModal === 'onboarding' && 'Layanan Onboarding & Pendampingan Pelatihan'}
                {activeModal === 'faq' && 'Pertanyaan yang Sering Diajukan (FAQ)'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {activeModal === 'comparison' && 'Detail komparasi fitur, kontrol server, dan mekanisme operasional'}
                {activeModal === 'onboarding' && 'Kurikulum onboarding online gratis dan opsi on-site visit ke kantor'}
                {activeModal === 'faq' && 'Jawaban transparan seputar lisensi, billing, dan implementasi'}
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeModal === 'comparison' && <PromoComparisonTable isModal={true} />}
          {activeModal === 'onboarding' && <PromoTrainingSection isModal={true} />}
          {activeModal === 'faq' && (
            <PromoFaq
              isModal={true}
              expandedFaq={expandedFaq}
              onToggleFaq={(index) => setExpandedFaq(prev => prev === index ? null : index)}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Butuh konsultasi lebih lanjut? Tim spesialis kami siap membantu via WhatsApp.</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-full sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Tutup Dialog
          </button>
        </div>
      </Modal>

    </div>
  );
}

export default PromoPricingPage;
