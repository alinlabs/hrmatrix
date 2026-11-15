import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  CreditCard, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  Info, 
  HelpCircle,
  FileText,
  Percent,
  Check,
  Zap,
  Lock,
  ChevronRight
} from 'lucide-react';
import { 
  BillingMode, 
  CompanySizeTier, 
  PaymentMethod, 
  WhiteLabelDpOption, 
  AgentContractMonths, 
  PromoOrder, 
  PromoOrderItem, 
  OrderCustomerInfo,
  CustomModulesCalculation
} from './types';
import { 
  BANK_ACCOUNTS, 
  calculateOrderPayment, 
  generateInvoiceNumber, 
  generateVirtualAccountNumber, 
  savePromoOrder 
} from './promo-order-helper';
import { ALL_MODULES, PRICING_DATA, formatRupiah } from './utils-helper';
import { PromoOrderInvoice } from './promo-order-invoice';
import { cn } from '../../utils/cn';

interface PromoOrderPageProps {
  initialTierKey?: CompanySizeTier;
  initialBillingMode?: BillingMode;
  customCalculation?: CustomModulesCalculation;
  isCustomOrder?: boolean;
  selectedModuleIds?: string[];
  onBackToPromo: () => void;
}

export function PromoOrderPage({
  initialTierKey = 'growth',
  initialBillingMode = 'annual',
  customCalculation,
  isCustomOrder = false,
  selectedModuleIds = [],
  onBackToPromo
}: PromoOrderPageProps) {
  // Configuration states
  const [tierKey, setTierKey] = useState<CompanySizeTier>(initialTierKey);
  const [billingMode, setBillingMode] = useState<BillingMode>(initialBillingMode);
  const [orderType, setOrderType] = useState<'package' | 'custom'>(isCustomOrder ? 'custom' : 'package');
  
  // Payment scheme states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('installment');
  const [whiteLabelDpPercent, setWhiteLabelDpPercent] = useState<WhiteLabelDpOption>(35);
  const [agentContractMonths, setAgentContractMonths] = useState<AgentContractMonths>(3);
  const [selectedBank, setSelectedBank] = useState<keyof typeof BANK_ACCOUNTS>('bca');

  // Customer form inputs
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [notes, setNotes] = useState('');

  // Form validation & submission states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingStep, setSubmittingStep] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<PromoOrder | null>(null);

  // Active tier data
  const tierData = PRICING_DATA[tierKey];

  // Calculate pricing amounts
  const { totalTransaction, normalTransaction, headcount, moduleNames, tierName } = useMemo(() => {
    if (orderType === 'custom' && customCalculation) {
      let total = customCalculation.promoAnnual;
      let normal = customCalculation.normalAnnual;

      if (billingMode === 'trial') {
        total = customCalculation.trialTotalBilled;
        normal = customCalculation.trialMonthlyNormal * 3;
      } else if (billingMode === 'whitelabel') {
        total = customCalculation.whitelabelPromo;
        normal = customCalculation.whitelabelNormal;
      } else if (billingMode === 'agent') {
        const months = Math.max(3, agentContractMonths);
        total = customCalculation.agentMonthlyPromo * months;
        normal = customCalculation.agentMonthlyNormal * months;
      }

      const activeModuleNames = ALL_MODULES
        .filter(m => selectedModuleIds.includes(m.id))
        .map(m => m.name);

      return {
        totalTransaction: total,
        normalTransaction: normal,
        headcount: customCalculation.headcount,
        moduleNames: activeModuleNames,
        tierName: `Paket Kustomisasi (${selectedModuleIds.length} Modul - ${customCalculation.headcount} Karyawan)`
      };
    }

    // Default package calculation
    let total = tierData.annual.promoAnnualBilled;
    let normal = tierData.annual.normalAnnualBilled;

    if (billingMode === 'trial') {
      total = tierData.trial.totalBilled;
      normal = tierData.trial.normalPricePerMonth * 3;
    } else if (billingMode === 'whitelabel') {
      total = tierData.whitelabel.promoPrice;
      normal = tierData.whitelabel.normalPrice;
    } else if (billingMode === 'agent') {
      const months = Math.max(3, agentContractMonths);
      total = tierData.agent.promoPricePerMonth * months;
      normal = tierData.agent.normalPricePerMonth * months;
    }

    return {
      totalTransaction: total,
      normalTransaction: normal,
      headcount: tierData.maxUser,
      moduleNames: tierData.classifiedDetails.modulDanEPortal.moduleNames,
      tierName: `Paket ${tierData.name}`
    };
  }, [orderType, customCalculation, tierData, billingMode, agentContractMonths, selectedModuleIds]);

  // Payment breakdown calculation
  const paymentCalculation = useMemo(() => {
    return calculateOrderPayment({
      billingMode,
      totalTransaction,
      normalTransaction,
      paymentMethod,
      whiteLabelDpPercent,
      agentContractMonths
    });
  }, [billingMode, totalTransaction, normalTransaction, paymentMethod, whiteLabelDpPercent, agentContractMonths]);

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Nama penanggung jawab wajib diisi';
    if (!companyName.trim()) errors.companyName = 'Nama perusahaan atau instansi wajib diisi';
    if (!email.trim()) {
      errors.email = 'Email wajib diisi untuk pengiriman invoice resmi otomatis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Format email tidak valid (contoh: hr@perusahaan.com)';
    }
    if (!phone.trim()) {
      errors.phone = 'Nomor WhatsApp wajib diisi untuk konfirmasi dan aktivasi';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit order & trigger automatic invoice email delivery simulation
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmittingStep('Menyiapkan spesifikasi server & nomor invoice resmi...');

    setTimeout(() => {
      setSubmittingStep(`Mengirim salinan invoice resmi ke email: ${email}...`);

      setTimeout(() => {
        const orderId = generateInvoiceNumber();
        const now = new Date();
        const formattedDate = now.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        const formattedTime = now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        });

        // 3 days due date
        const dueDateObj = new Date();
        dueDateObj.setDate(dueDateObj.getDate() + 3);
        const formattedDueDate = dueDateObj.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        const newOrder: PromoOrder = {
          id: orderId,
          createdAt: `${formattedDate}, ${formattedTime} WIB`,
          dueDate: `${formattedDueDate} (23:59 WIB)`,
          customer: {
            fullName: fullName.trim(),
            role: role.trim() || 'HR Management',
            companyName: companyName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            city: city.trim(),
            subdomain: subdomain.trim() || companyName.trim().toLowerCase().replace(/[^a-z0-9]/g, ''),
            notes: notes.trim()
          },
          item: {
            orderType,
            tierKey: orderType === 'package' ? tierKey : undefined,
            tierName,
            billingMode,
            headcount,
            moduleIds: orderType === 'custom' 
              ? selectedModuleIds 
              : tierKey === 'startup'
              ? ['data_karyawan', 'legal_administrasi', 'presensi_jadwal', 'manajemen_cuti', 'payroll', 'pelaporan_hr_ga']
              : tierKey === 'growth'
              ? ['data_karyawan', 'legal_administrasi', 'presensi_jadwal', 'manajemen_cuti', 'payroll', 'pelaporan_hr_ga', 'kinerja_kpi', 'rekrutmen_asesmen', 'inventaris_aset', 'pengadaan_atk']
              : ALL_MODULES.map(m => m.id),
            moduleNames,
            serverSpecs: orderType === 'package' ? tierData.serverSpecs : undefined,
            agentContractMonths: billingMode === 'agent' ? agentContractMonths : undefined,
            whitelabelDpPercent: billingMode === 'whitelabel' ? whiteLabelDpPercent : undefined
          },
          payment: paymentCalculation,
          paymentChannel: selectedBank,
          virtualAccountNumber: generateVirtualAccountNumber(selectedBank),
          bankName: BANK_ACCOUNTS[selectedBank].name,
          status: 'pending_payment',
          invoiceEmailSentTo: email.trim(),
          invoiceEmailSentAt: `${formattedDate} pk ${formattedTime} WIB`
        };

        // Save order to history
        savePromoOrder(newOrder);

        setIsSubmitting(false);
        setCompletedOrder(newOrder);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 900);
    }, 700);
  };

  // If order is completed, render official invoice
  if (completedOrder) {
    return (
      <PromoOrderInvoice
        order={completedOrder}
        onBackToPromo={onBackToPromo}
        onNewOrder={() => {
          setCompletedOrder(null);
          setFullName('');
          setEmail('');
          setPhone('');
          setCompanyName('');
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* 1. Header Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            type="button"
            onClick={onBackToPromo}
            className="hover:text-blue-600 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Paket Promosi</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-800">Form Pemesanan & Invoice Otomatis</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Invoice Digital Resmi Terkirim Otomatis ke Email</span>
        </div>
      </div>

      {/* 2. Package Summary Card */}
      <div className="rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-7 shadow-lg space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {orderType === 'package' ? 'Paket Bundling Pilihan' : 'Paket Kustomisasi Modul'}
              </span>
              <span className="text-xs text-slate-300">
                Kapasitas: <strong>s/d {headcount} Karyawan</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {tierName}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {billingMode === 'trial' && 'Lisensi Uji Coba (3 Bulan). Akses modul penuh dengan komitmen terjangkau.'}
              {billingMode === 'annual' && 'Lisensi Sewa Cloud Tahunan (12 Bulan). Termasuk server dedicated cluster & backup otomatis.'}
              {billingMode === 'whitelabel' && 'Lisensi White Label Perpetual. Beli putus dengan kode sumber dan branding khusus.'}
              {billingMode === 'agent' && 'Layanan Dedicated Agent HR & GA Hybrid. Daily online + kunjungan on-site 1 minggu 1 kali ke kantor.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-right md:min-w-[240px] shrink-0 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block">
              Total Nilai Investasi Bersih:
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {formatRupiah(totalTransaction)}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              Hemat {formatRupiah(normalTransaction - totalTransaction)} dari harga normal
            </div>
          </div>
        </div>

        {/* Quick billing mode switcher within order form */}
        <div className="pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Model Lisensi:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'trial' as BillingMode, label: 'Uji Coba 3 Bulan' },
              { id: 'annual' as BillingMode, label: 'Sewa Tahunan' },
              { id: 'whitelabel' as BillingMode, label: 'White Label' },
              { id: 'agent' as BillingMode, label: 'Agent Hybrid' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setBillingMode(m.id)}
                className={cn(
                  'px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs',
                  billingMode === m.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="space-y-6">

        {/* 3. Customer & Company Information Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                1. Data Penanggung Jawab & Perusahaan
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Masukkan identitas PIC dan instansi. Invoice resmi dan kredensial server akan dikirimkan ke email terdaftar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            
            {/* PIC Full Name */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Nama Lengkap PIC / Pemesan <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso, S.Kom."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={cn(
                    'w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all',
                    formErrors.fullName ? 'border-red-400 ring-2 ring-red-400/20' : 'border-slate-200'
                  )}
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              {formErrors.fullName && (
                <span className="text-[11px] text-red-600 font-semibold">{formErrors.fullName}</span>
              )}
            </div>

            {/* Role / Job Title */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">
                Jabatan PIC di Perusahaan
              </label>
              <input
                type="text"
                placeholder="Contoh: HR Director / GA Manager / Owner"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Nama Perusahaan / Instansi <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Nusantara Maju Bersama"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={cn(
                    'w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all',
                    formErrors.companyName ? 'border-red-400 ring-2 ring-red-400/20' : 'border-slate-200'
                  )}
                />
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              {formErrors.companyName && (
                <span className="text-[11px] text-red-600 font-semibold">{formErrors.companyName}</span>
              )}
            </div>

            {/* Email Address (Critical for automatic invoice) */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span>Alamat Email Perusahaan / PIC</span>
                  <span className="text-red-500">*</span>
                </span>
                <span className="text-[10px] font-black uppercase text-blue-600">
                  Kirim Invoice Otomatis
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Contoh: billing@perusahaan.co.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    'w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-blue-50/20 focus:bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all',
                    formErrors.email ? 'border-red-400 ring-2 ring-red-400/20' : 'border-blue-300/80'
                  )}
                />
                <Mail className="w-4 h-4 text-blue-600 absolute left-3 top-3 pointer-events-none" />
              </div>
              <div className="text-[10px] text-blue-700 font-medium flex items-center gap-1">
                <Info className="w-3 h-3 text-blue-600 shrink-0" />
                <span>Invoice PDF resmi dan rincian Virtual Account otomatis terkirim ke email ini.</span>
              </div>
              {formErrors.email && (
                <span className="text-[11px] text-red-600 font-semibold">{formErrors.email}</span>
              )}
            </div>

            {/* Phone / WhatsApp */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Nomor WhatsApp Aktif <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cn(
                    'w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-slate-50/50 focus:bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all',
                    formErrors.phone ? 'border-red-400 ring-2 ring-red-400/20' : 'border-slate-200'
                  )}
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              {formErrors.phone && (
                <span className="text-[11px] text-red-600 font-semibold">{formErrors.phone}</span>
              )}
            </div>

            {/* City / Location */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">
                Kota / Domisili Kantor
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: Jakarta Selatan, Surabaya, Medan"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Subdomain Request */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Permintaan Subdomain Cloud HRMatrix (Opsional)</span>
                <span className="text-[10px] text-slate-400">Dapat diganti domain custom nantinya</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="nama-perusahaan"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <span className="px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-r-xl text-slate-600 text-xs font-mono font-bold select-none">
                  .hrmatrix.id
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 4. Payment Scheme Selector (Cicilan Bulanan & Tunai Lunas) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                2. Skema Biaya & Pilihan Pembayaran
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Pilih antara pembayaran tunai lunas 100% atau skema cicilan bulanan fleksibel dengan DP awal terukur.
            </p>
          </div>

          {/* Payment Method Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Option A: Cicilan Bulanan */}
            <div
              onClick={() => setPaymentMethod('installment')}
              className={cn(
                'relative p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3',
                paymentMethod === 'installment'
                  ? 'border-blue-600 bg-blue-50/30 shadow-md ring-2 ring-blue-600/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                  Rekomendasi Fleksibel
                </span>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  paymentMethod === 'installment' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                )}>
                  {paymentMethod === 'installment' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900">
                  Cicilan Bulanan (Skema DP Awal)
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {billingMode === 'whitelabel' 
                    ? 'Program cicilan 1 tahun khusus White Label dengan pilihan DP 30%, 35%, atau 40%.' 
                    : billingMode === 'agent'
                    ? 'DP 50% di awal dengan minimal kontrak 3 bulan, sisanya dibayar per bulan.'
                    : 'Bayar DP 50% di awal, sisa kewajiban dicicil setiap bulan selama masa kontrak.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-blue-700">
                <Percent className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {billingMode === 'whitelabel' 
                    ? `DP ${whiteLabelDpPercent}% di awal, sisa dicicil 11 bulan` 
                    : 'DP 50% di awal, sisa dicicil per bulan'}
                </span>
              </div>
            </div>

            {/* Option B: Tunai Lunas */}
            <div
              onClick={() => setPaymentMethod('full')}
              className={cn(
                'relative p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3',
                paymentMethod === 'full'
                  ? 'border-emerald-600 bg-emerald-50/30 shadow-md ring-2 ring-emerald-600/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  Bayar Sekaligus
                </span>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  paymentMethod === 'full' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                )}>
                  {paymentMethod === 'full' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900">
                  Tunai Lunas (100% di Muka)
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Pelunasan penuh di awal tanpa cicilan bulanan. Aktivasi server seketika dan bebas dari kewajiban invoice bulanan.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Aktivasi Prioritas & Bebas Administrasi</span>
              </div>
            </div>

          </div>

          {/* Conditional Options for Specific Billing Modes when Installment is chosen */}
          {paymentMethod === 'installment' && (
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              
              {/* White Label Specific: DP 30%, 35%, 40% */}
              {billingMode === 'whitelabel' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900">
                        Pilihan DP Program Cicilan 1 Tahun White Label:
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Sisa kewajiban setelah DP akan dicicil rata selama 11 bulan ke depan.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {([30, 35, 40] as WhiteLabelDpOption[]).map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setWhiteLabelDpPercent(pct)}
                        className={cn(
                          'p-3 rounded-xl border text-center transition-all cursor-pointer',
                          whiteLabelDpPercent === pct
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xs font-black'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 font-bold'
                        )}
                      >
                        <div className="text-sm sm:text-base">DP {pct}%</div>
                        <div className={cn('text-[10px] mt-0.5', whiteLabelDpPercent === pct ? 'text-blue-100' : 'text-slate-500')}>
                          {formatRupiah((totalTransaction * pct) / 100)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dedicated Agent Specific: Minimal 3 Bulan */}
              {billingMode === 'agent' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900">
                        Durasi Kontrak Dedicated Agent Hybrid:
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Minimal kontrak paket agent adalah <strong>3 bulan</strong> (DP 50% di awal, sisa dibayar per bulan).
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { months: 3 as AgentContractMonths, label: '3 Bulan (Minimal)', badge: 'Paketan Standar' },
                      { months: 6 as AgentContractMonths, label: '6 Bulan', badge: 'Populer' },
                      { months: 12 as AgentContractMonths, label: '12 Bulan (1 Thn)', badge: 'Paling Hemat' }
                    ]).map((opt) => (
                      <button
                        key={opt.months}
                        type="button"
                        onClick={() => setAgentContractMonths(opt.months)}
                        className={cn(
                          'p-3 rounded-xl border text-center transition-all cursor-pointer',
                          agentContractMonths === opt.months
                            ? 'bg-linear-to-r from-violet-600 to-blue-600 border-violet-600 text-white shadow-xs font-black'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 font-bold'
                        )}
                      >
                        <div className="text-xs sm:text-sm">{opt.label}</div>
                        <div className={cn('text-[10px] mt-0.5', agentContractMonths === opt.months ? 'text-violet-100' : 'text-slate-500')}>
                          {opt.badge}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Trial & Annual notice */}
              {(billingMode === 'trial' || billingMode === 'annual') && (
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50 text-blue-900 text-xs border border-blue-200/80">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold">
                      Skema Cicilan {billingMode === 'trial' ? 'Uji Coba 3 Bulan' : 'Sewa Tahunan 12 Bulan'}:
                    </span>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      Sesuai ketentuan, Anda cukup membayar <strong>DP 50% di awal</strong> untuk deployment server, dan sisa 50% dibayar per bulan selama{' '}
                      <strong>{billingMode === 'trial' ? '2 bulan sisa percobaan' : '11 bulan sisa kontrak'}</strong>.
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Interactive Installment Schedule & Amount Summary */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden space-y-0 text-xs">
            <div className="bg-slate-100/80 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="font-extrabold text-slate-800">
                Rincian Kalkulasi Pembayaran:
              </div>
              <div className="text-slate-500 font-medium">
                Skema: <strong className="text-slate-800">{paymentCalculation.schemeDescription}</strong>
              </div>
            </div>

            <div className="p-5 bg-white space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Nilai Kontrak</span>
                  <span className="text-base sm:text-lg font-black text-slate-900 mt-0.5 block">
                    {formatRupiah(paymentCalculation.totalTransaction)}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] uppercase font-black text-amber-700 block">
                    {paymentMethod === 'full' ? 'Bayar Lunas Hari Ini' : `DP (${paymentCalculation.downPaymentPercent}%) Hari Ini`}
                  </span>
                  <span className="text-base sm:text-lg font-black text-amber-900 mt-0.5 block">
                    {formatRupiah(paymentCalculation.dueToday)}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] uppercase font-bold text-blue-700 block">
                    {paymentMethod === 'full' ? 'Sisa Angsuran' : `Angsuran Per Bulan (${paymentCalculation.installmentMonths}x)`}
                  </span>
                  <span className="text-base sm:text-lg font-black text-blue-900 mt-0.5 block">
                    {paymentMethod === 'full' ? 'Rp 0' : formatRupiah(paymentCalculation.monthlyInstallmentAmount)}
                  </span>
                </div>

              </div>

              {/* Installment Schedule Table if installment mode */}
              {paymentCalculation.schedule.length > 1 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                    Jadwal Termin Pembayaran Resmi:
                  </span>
                  <div className="rounded-xl border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Termin</th>
                          <th className="py-2.5 px-3">Perkiraan Jatuh Tempo</th>
                          <th className="py-2.5 px-3 text-right">Nominal Tagihan</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paymentCalculation.schedule.map((item) => (
                          <tr key={item.periodNumber} className={item.isInitialPayment ? 'bg-amber-50/30 font-bold' : ''}>
                            <td className="py-2.5 px-3 text-slate-800">
                              {item.label}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {item.dueDate}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900">
                              {formatRupiah(item.amount)}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {item.isInitialPayment ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                                  Tagihan Hari Ini (DP)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                                  Tagihan Bulanan
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 5. Payment Channel Selection (Bank VA / QRIS) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                3. Saluran Transfer & Pembayaran Resmi
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Pilih rekening virtual account tujuan. Nomor Virtual Account resmi dan QRIS akan diterbitkan pada invoice.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(Object.keys(BANK_ACCOUNTS) as Array<keyof typeof BANK_ACCOUNTS>).map((key) => {
              const b = BANK_ACCOUNTS[key];
              const isSelected = selectedBank === key;
              return (
                <div
                  key={key}
                  onClick={() => setSelectedBank(key)}
                  className={cn(
                    'p-3.5 rounded-2xl border text-center cursor-pointer transition-all space-y-1.5 flex flex-col justify-center items-center',
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/10 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  )}
                >
                  <div className="text-xs font-black text-slate-900 uppercase">
                    {key.toUpperCase()}
                  </div>
                  <span className="text-[10px] text-slate-500 line-clamp-1">
                    {b.badge}
                  </span>
                  <div className={cn(
                    'w-4 h-4 rounded-full border flex items-center justify-center mt-1',
                    isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                  )}>
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Notes (Optional) */}
          <div className="space-y-1.5 pt-2 text-xs">
            <label className="font-bold text-slate-700">
              Catatan Khusus atau Permintaan Khusus (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Mohon koordinasikan tanggal onboarding dan instalasi database..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            />
          </div>
        </div>

        {/* 6. Checkout Summary & Submit Button */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-400">
                Ringkasan Pembayaran Akhir
              </span>
              <h4 className="text-lg font-black text-white">
                {paymentMethod === 'full' ? 'Total Pelunasan Penuh' : `Jumlah Pembayaran DP (${paymentCalculation.downPaymentPercent}%)`}
              </h4>
              <p className="text-xs text-slate-400">
                Invoice resmi otomatis terbit dan langsung dikirimkan ke email PIC secara real-time.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Jumlah Yang Harus Dibayar:</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300">
                {formatRupiah(paymentCalculation.dueToday)}
              </span>
              {paymentMethod === 'installment' && (
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Sisa {formatRupiah(paymentCalculation.remainingAmount)} dicicil {paymentCalculation.installmentMonths}x bulanan
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Transaksi aman 100% bergaransi dengan Surat Kontrak & Invoice Berbadan Hukum.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{submittingStep || 'Memproses Pesanan...'}</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Konfirmasi & Terbitkan Invoice ke Email</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
