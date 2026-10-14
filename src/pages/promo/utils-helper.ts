import { 
  BillingMode, 
  CompanySizeTier, 
  ModuleItem, 
  PricingMatrix, 
  FaqItem, 
  TierData, 
  CustomModulesCalculation,
  CustomModulePriceBreakdown 
} from './types';

import {
  PROMO_BILLING_TABS,
  PROMO_MODULE_NAMES,
  PROMO_EPORTAL_NAMES,
  ALL_MODULES,
  PRICING_DATA,
  TIER_CARD_TEXTS,
  PROMO_MODAL_TEXT_CONFIG,
  PROMO_COMPARISON_ROWS,
  PROMO_TRAINING_CARDS,
  FAQS_DATA
} from './promo-data';

export {
  PROMO_BILLING_TABS,
  PROMO_MODULE_NAMES,
  PROMO_EPORTAL_NAMES,
  ALL_MODULES,
  PRICING_DATA,
  TIER_CARD_TEXTS,
  PROMO_MODAL_TEXT_CONFIG,
  PROMO_COMPARISON_ROWS,
  PROMO_TRAINING_CARDS,
  FAQS_DATA
};

export function formatRupiah(num: number): string {
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
}

/**
 * Returns headcount categorization label and badge
 */
export function getScaleCategory(headcount: number): { label: string; badge: string; desc: string } {
  if (headcount <= 25) {
    return { 
      label: 'Mikro & Rintisan (UMKM)', 
      badge: 'Skala Mikro', 
      desc: 'Cocok untuk bisnis rintisan & toko dengan 1 - 25 orang. Kuota dasar modul hemat.' 
    };
  } else if (headcount <= 50) {
    return { 
      label: 'Startup & Bisnis Kecil', 
      badge: 'Skala Kecil', 
      desc: 'Ideal untuk tim berkembang 26 - 50 orang dengan otomatisasi dasar payroll & absensi.' 
    };
  } else if (headcount <= 100) {
    return { 
      label: 'Bisnis Menengah (Medium)', 
      badge: 'Skala Menengah', 
      desc: 'Dirancang untuk perusahaan 51 - 100 orang yang butuh kontrol multi-shift & KPI.' 
    };
  } else if (headcount <= 250) {
    return { 
      label: 'Menengah Berkembang (Growth)', 
      badge: 'Skala Berkembang', 
      desc: 'Sempurna untuk tim 101 - 250 orang dengan pipeline rekrutmen & evaluasi berkala.' 
    };
  } else if (headcount <= 500) {
    return { 
      label: 'Korporasi / Enterprise (Maks 500)', 
      badge: 'Enterprise', 
      desc: 'Kapasitas klaster standar maksimal 500 karyawan dengan keamanan data terenkripsi.' 
    };
  } else {
    return { 
      label: 'Enterprise Skala Besar (>500 Karyawan)', 
      badge: 'Bisnis Besar', 
      desc: 'Skala korporat besar >500 orang dengan tarif beban tambahan per-orang yang sangat terjangkau.' 
    };
  }
}

/**
 * Calculates incremental per-module cost based on headcount.
 * Base module includes up to 25 employees.
 * Extra employees are billed in volume-discount brackets.
 */
export function calculateHeadcountAddonPerModule(headcount: number): { normalAddon: number; promoAddon: number } {
  if (headcount <= 25) {
    return { normalAddon: 0, promoAddon: 0 };
  }

  let extra = headcount - 25;
  let normalAddon = 0;
  let promoAddon = 0;

  // Bracket 1: 26 - 50 (max 25 users) - Patokan 50 user = 25 extra x Rp 1.000/modul
  const b1 = Math.min(extra, 25);
  normalAddon += b1 * 2000;
  promoAddon += b1 * 1000;
  extra -= b1;

  if (extra > 0) {
    // Bracket 2: 51 - 100 (max 50 users)
    const b2 = Math.min(extra, 50);
    normalAddon += b2 * 1600;
    promoAddon += b2 * 800;
    extra -= b2;
  }

  if (extra > 0) {
    // Bracket 3: 101 - 250 (max 150 users)
    const b3 = Math.min(extra, 150);
    normalAddon += b3 * 1200;
    promoAddon += b3 * 600;
    extra -= b3;
  }

  if (extra > 0) {
    // Bracket 4: 251 - 500 (max 250 users)
    const b4 = Math.min(extra, 250);
    normalAddon += b4 * 900;
    promoAddon += b4 * 450;
    extra -= b4;
  }

  if (extra > 0) {
    // Bracket 5: 501 - 1000 (max 500 users)
    const b5 = Math.min(extra, 500);
    normalAddon += b5 * 600;
    promoAddon += b5 * 300;
    extra -= b5;
  }

  if (extra > 0) {
    // Bracket 6: >1000 users
    normalAddon += extra * 400;
    promoAddon += extra * 200;
  }

  return { normalAddon, promoAddon };
}

/**
 * Multiplier for White Label source code perpetual licensing based on employee size.
 */
export function getWhitelabelScaleMultiplier(headcount: number): number {
  if (headcount <= 50) return 1.0;
  if (headcount <= 100) return 1.25;
  if (headcount <= 250) return 1.55;
  if (headcount <= 500) return 1.9;
  if (headcount <= 1000) return 2.3;
  return 2.75;
}

/**
 * Calculates detailed module breakdown and overall customization totals
 */
export function calculateCustomModules(
  selectedModules: string[],
  headcount: number = 25,
  billingMode: BillingMode = 'annual'
): CustomModulesCalculation {
  const safeHeadcount = Math.max(1, headcount);
  const { normalAddon, promoAddon } = calculateHeadcountAddonPerModule(safeHeadcount);
  const wlMultiplier = getWhitelabelScaleMultiplier(safeHeadcount);

  let totalAnnualNormalMonthly = 0;
  let totalAnnualPromoMonthly = 0;
  let totalWlNormal = 0;
  let totalWlPromo = 0;

  const moduleBreakdowns: CustomModulePriceBreakdown[] = [];

  selectedModules.forEach(id => {
    const mod = ALL_MODULES.find(m => m.id === id);
    if (mod) {
      const moduleNormalMonthly = mod.normalPricePerMonth + normalAddon;
      const modulePromoMonthly = mod.promoPricePerMonth + promoAddon;
      
      const moduleWlNormal = Math.round(mod.whitelabelNormalPrice * wlMultiplier);
      const moduleWlPromo = Math.round(mod.whitelabelPromoPrice * wlMultiplier);

      totalAnnualNormalMonthly += moduleNormalMonthly;
      totalAnnualPromoMonthly += modulePromoMonthly;
      totalWlNormal += moduleWlNormal;
      totalWlPromo += moduleWlPromo;

      const discountPct = Math.round(((moduleNormalMonthly - modulePromoMonthly) / moduleNormalMonthly) * 100);

      moduleBreakdowns.push({
        id: mod.id,
        name: mod.name,
        category: mod.category,
        normalPrice: moduleNormalMonthly,
        promoPrice: modulePromoMonthly,
        normalWhitelabel: moduleWlNormal,
        promoWhitelabel: moduleWlPromo,
        discountPercent: discountPct
      });
    }
  });

  // Mode calculations
  // 1. In trial mode, monthly rate is 25% higher due to 1-time short 3-month contract (pushes commitment to annual)
  const trialMonthlyNormal = totalAnnualNormalMonthly;
  const trialMonthlyPromo = Math.round(totalAnnualPromoMonthly * 1.25);
  const trialTotalBilled = trialMonthlyPromo * 3;
  const trialSaved = (trialMonthlyNormal * 3) - trialTotalBilled;

  // 2. Annual mode
  const normalAnnual = totalAnnualNormalMonthly * 12;
  const promoAnnual = totalAnnualPromoMonthly * 12;
  const savedAnnual = normalAnnual - promoAnnual;

  // 3. Whitelabel mode
  const whitelabelSaved = totalWlNormal - totalWlPromo;

  // 4. Managed Agent (Hybrid HR & GA) calculation
  // Scaled base agent retainer according to headcount tiers
  let agentBaseNormal = 3000000;
  let agentBasePromo = 1550000;
  let inhouseBenchmark = 6500000;

  if (safeHeadcount <= 25) {
    agentBaseNormal = 3000000;
    agentBasePromo = 1550000;
    inhouseBenchmark = 6500000;
  } else if (safeHeadcount <= 50) {
    agentBaseNormal = 3600000;
    agentBasePromo = 1850000;
    inhouseBenchmark = 7500000;
  } else if (safeHeadcount <= 100) {
    agentBaseNormal = 5000000;
    agentBasePromo = 2650000;
    inhouseBenchmark = 9500000;
  } else if (safeHeadcount <= 250) {
    agentBaseNormal = 7200000;
    agentBasePromo = 3650000;
    inhouseBenchmark = 12000000;
  } else if (safeHeadcount <= 500) {
    agentBaseNormal = 11500000;
    agentBasePromo = 5750000;
    inhouseBenchmark = 16000000;
  } else {
    const extraAbove500 = safeHeadcount - 500;
    agentBaseNormal = 13500000 + (extraAbove500 * 7000);
    agentBasePromo = 6750000 + (extraAbove500 * 3500);
    inhouseBenchmark = 18000000 + (extraAbove500 * 9000);
  }

  // Workload scope fee based on active modules (each selected module is actively handled by agent)
  const moduleScopeFeePromo = Math.round(totalAnnualPromoMonthly * 0.4);
  const moduleScopeFeeNormal = Math.round(totalAnnualNormalMonthly * 0.5);

  const agentMonthlyNormal = agentBaseNormal + moduleScopeFeeNormal;
  const agentMonthlyPromo = agentBasePromo + moduleScopeFeePromo;
  const agentSavedMonthly = agentMonthlyNormal - agentMonthlyPromo;
  const agentVsInhouseSavings = Math.max(0, inhouseBenchmark - agentMonthlyPromo);

  // Active prices based on billing mode
  let activeNormalMonthly = totalAnnualNormalMonthly;
  let activePromoMonthly = totalAnnualPromoMonthly;

  if (billingMode === 'trial') {
    activeNormalMonthly = trialMonthlyNormal;
    activePromoMonthly = trialMonthlyPromo;
  } else if (billingMode === 'agent') {
    activeNormalMonthly = agentMonthlyNormal;
    activePromoMonthly = agentMonthlyPromo;
  }

  // Cost analysis per employee
  const costPerEmployeeMonthly = safeHeadcount > 0 ? Math.round(activePromoMonthly / safeHeadcount) : 0;
  const costPerEmployeeDaily = Math.round(costPerEmployeeMonthly / 30);
  
  // Market benchmark
  const marketBenchmarkPerEmployee = billingMode === 'agent' 
    ? Math.round(inhouseBenchmark / safeHeadcount) 
    : 32500;
  const marketTotalMonthly = billingMode === 'agent' 
    ? inhouseBenchmark 
    : safeHeadcount * marketBenchmarkPerEmployee;
  const marketSavingsMonthly = Math.max(0, marketTotalMonthly - activePromoMonthly);

  const scale = getScaleCategory(safeHeadcount);

  return {
    headcount: safeHeadcount,
    billingMode,
    selectedModulesCount: selectedModules.length,
    totalModulesCount: ALL_MODULES.length,
    normalMonthly: activeNormalMonthly,
    promoMonthly: activePromoMonthly,
    costPerEmployeeMonthly,
    costPerEmployeeDaily,
    marketBenchmarkPerEmployee,
    marketTotalMonthly,
    marketSavingsMonthly,
    normalAnnual,
    promoAnnual,
    savedAnnual,
    trialMonthlyNormal,
    trialMonthlyPromo,
    trialTotalBilled,
    trialSaved,
    whitelabelNormal: totalWlNormal,
    whitelabelPromo: totalWlPromo,
    whitelabelSaved,
    agentMonthlyNormal,
    agentMonthlyPromo,
    agentSavedMonthly,
    agentInhouseBenchmark: inhouseBenchmark,
    agentVsInhouseSavings,
    agentVisitFrequency: '1 Minggu 1 Kali (4x Kunjungan Fisik / Bulan)',
    scaleLabel: scale.label,
    scaleBadge: scale.badge,
    moduleBreakdowns
  };
}

export function generateWhatsAppPromoUrl(
  billingMode: BillingMode,
  currentTierData: TierData,
  selectedTier: CompanySizeTier
): string {
  const tierName = currentTierData.name;
  let modeText = '';
  if (billingMode === 'trial') {
    modeText = `Paket Uji Coba (Pilot 3 Bulan - Hanya 1x Kontrak) Promo ${formatRupiah(currentTierData.trial.promoPricePerMonth)}/bln (Normal ${formatRupiah(currentTierData.trial.normalPricePerMonth)}/bln - Total ${formatRupiah(currentTierData.trial.totalBilled)} untuk 3 bulan evaluasi)`;
  } else if (billingMode === 'annual') {
    modeText = `Sewa Cloud Tahunan Promo ${formatRupiah(currentTierData.annual.promoPricePerMonth)}/bln (Normal ${formatRupiah(currentTierData.annual.normalPricePerMonth)}/bln - Total ${formatRupiah(currentTierData.annual.promoAnnualBilled)}/tahun)`;
  } else if (billingMode === 'agent') {
    modeText = `Dedicated Agent (HR & GA Hybrid) Promo ${formatRupiah(currentTierData.agent.promoPricePerMonth)}/bln (Normal ${formatRupiah(currentTierData.agent.normalPricePerMonth)}/bln) • Kunjungan ${currentTierData.agent.visitFrequency} + Daily Online Penuh`;
  } else {
    modeText = `White Label (Full Customisasi) Promo ${formatRupiah(currentTierData.whitelabel.promoPrice)} (Normal ${formatRupiah(currentTierData.whitelabel.normalPrice)})`;
  }
  
  const enterpriseNote = selectedTier === 'enterprise' 
    ? `%0A- *Ketentuan Kuota*: Kuota dasar s/d 500 karyawan (kelebihan >500 orang dihitung biaya beban tambahan per orang)` 
    : '';

  const message = `Halo Tim HRMatrix Indonesia,%0A%0ASaya tertarik untuk klaim *Harga Promo*:${billingMode === 'agent' ? '%0A- *Layanan*: Dedicated Agent HR & GA Hybrid (Online Harian + Kunjungan Offline 1x/Minggu)' : ''}%0A- *Paket*: ${tierName} (${currentTierData.karyawan})${enterpriseNote}%0A- *Skema*: ${modeText}%0A- *Spesifikasi Server*: ${currentTierData.serverSpecs.cpu}, ${currentTierData.serverSpecs.ram}%0A- *Fasilitas*: Termasuk Modul Panduan & Sesi Pelatihan Online Intensif%0A%0AMohon informasi tata cara aktivasi, faktur penawaran resmi, dan jadwal sesi pelatihannya. Terima kasih!`;
  return `https://wa.me/6282211119090?text=${message}`;
}

export const WHATSAPP_ONSITE_URL = `https://wa.me/6282211119090?text=Halo%20Tim%20HRMatrix%20Indonesia,%0A%0ASaya%20tertarik%20untuk%20mengajukan%20*Paket%20Tambahan%20Pelatihan%20Tatap%20Muka%20Langsung%20(On-Site%20Training%20%26%20In-House%20Workshop)*%20di%20kantor%20kami.%0A%0AMohon%20kirimkan%20proposal%20penawaran%20khusus,%20estimasi%20jadwal%20trainer,%20dan%20detail%20kurikulumnya.%20Terima%20kasih!`;

export function generateCustomProposalSummaryText(
  calc: CustomModulesCalculation,
  selectedModules: string[],
  billingMode: BillingMode
): string {
  const selectedModNames = ALL_MODULES
    .filter(m => selectedModules.includes(m.id))
    .map(m => `  - ${m.name} (${m.category})`)
    .join('\n');

  let skemaDetail = '';
  if (billingMode === 'trial') {
    skemaDetail = `Paket Uji Coba Pilot (3 Bulan - Hanya 1x Kontrak Evaluasi):
- Tarif Bulanan Promo: ${formatRupiah(calc.trialMonthlyPromo)}/bln (Normal: ${formatRupiah(calc.trialMonthlyNormal)}/bln)
- Total Investasi 3 Bulan: ${formatRupiah(calc.trialTotalBilled)}
- Penghematan: Hemat ${formatRupiah(calc.trialSaved)} untuk 3 bulan evaluasi`;
  } else if (billingMode === 'annual') {
    skemaDetail = `Paket Sewa Cloud Tahunan (Komitmen 12 Bulan):
- Tarif Bulanan Promo: ${formatRupiah(calc.promoMonthly)}/bln (Normal: ${formatRupiah(calc.normalMonthly)}/bln)
- Total Investasi 1 Tahun: ${formatRupiah(calc.promoAnnual)}/tahun
- Penghematan: Hemat ${formatRupiah(calc.savedAnnual)}/tahun`;
  } else if (billingMode === 'agent') {
    skemaDetail = `Paket Managed Dedicated Agent (HR & GA Hybrid):
- Tarif Bulanan Promo: ${formatRupiah(calc.agentMonthlyPromo)}/bln (Normal: ${formatRupiah(calc.agentMonthlyNormal)}/bln)
- Penghematan Tarif: Hemat ${formatRupiah(calc.agentSavedMonthly)}/bulan
- Kunjungan Tatap Muka: 1 Minggu 1 Kali (4x Kunjungan Fisik On-Site / Bulan)
- Operasional Harian: Online Penuh via Cloud HRMatrix (Senin-Jumat)
- Benchmark In-House HR & GA: ~${formatRupiah(calc.agentInhouseBenchmark)}/bln
- Penghematan vs Rekrut Sendiri: Hemat hingga ${formatRupiah(calc.agentVsInhouseSavings)}/bulan!`;
  } else {
    skemaDetail = `Paket White Label (Beli Putus Perpetual License):
- Biaya Lisensi Source Code Promo: ${formatRupiah(calc.whitelabelPromo)} (Normal: ${formatRupiah(calc.whitelabelNormal)})
- Penghematan: Hemat ${formatRupiah(calc.whitelabelSaved)}
- Maintenance & Garansi Free: Termasuk 6 - 12 Bulan`;
  }

  return `[PROPOSAL RESMI PAKET CUSTOM MODUL & KARYAWAN HRMATRIX]
Kapasitas Karyawan: ${calc.headcount} Orang (${calc.scaleLabel} - ${calc.scaleBadge})
Jumlah Modul Terpilih: ${calc.selectedModulesCount} dari ${calc.totalModulesCount} Modul Lengkap

Daftar Modul yang Diaktifkan / Dikelola:
${selectedModNames}

Skema & Biaya Investasi:
${skemaDetail}

Analisis Efisiensi Biaya per Karyawan:
- Investasi per Karyawan: ~${formatRupiah(calc.costPerEmployeeMonthly)} / orang / bulan (~${formatRupiah(calc.costPerEmployeeDaily)} / hari)
- Benchmark Pasaran: ~${formatRupiah(calc.marketBenchmarkPerEmployee)} / orang / bulan
- Estimasi Penghematan vs Pasar: Hemat hingga ${formatRupiah(calc.marketSavingsMonthly)} / bulan!

Fasilitas Gratis Termasuk:
- E-Book Panduan Lengkap SOP HR & Video Tutorial Operasional
- Pelatihan Online Intensif (Live Zoom/GMeet) bersama Tim Implementor
- Backup Data Cloud Otomatis & Support Chat WhatsApp Khusus

Kontak Resmi HRMatrix Indonesia:
- WhatsApp: +62 822-1111-9090
- Email: hrmatrix.id@gmail.com`;
}

export function generateWhatsAppCustomUrl(
  calc: CustomModulesCalculation,
  selectedModules: string[],
  billingMode: BillingMode
): string {
  const modNames = ALL_MODULES
    .filter(m => selectedModules.includes(m.id))
    .map(m => m.name)
    .join(', ');

  let skemaLabel = '';
  let hargaLabel = '';
  if (billingMode === 'trial') {
    skemaLabel = 'Uji Coba 3 Bulan (Hanya 1x Kontrak)';
    hargaLabel = `${formatRupiah(calc.trialMonthlyPromo)}/bln (Total ${formatRupiah(calc.trialTotalBilled)} untuk 3 bln)`;
  } else if (billingMode === 'annual') {
    skemaLabel = 'Sewa Cloud Tahunan (12 Bulan)';
    hargaLabel = `${formatRupiah(calc.promoMonthly)}/bln (Total ${formatRupiah(calc.promoAnnual)}/thn)`;
  } else if (billingMode === 'agent') {
    skemaLabel = 'Dedicated Agent HR & GA Hybrid (Online Daily + Visit 1x/Minggu)';
    hargaLabel = `${formatRupiah(calc.agentMonthlyPromo)}/bln (Hemat ${formatRupiah(calc.agentVsInhouseSavings)} vs rekrut HR sendiri)`;
  } else {
    skemaLabel = 'White Label (Beli Putus Perpetual)';
    hargaLabel = `${formatRupiah(calc.whitelabelPromo)} (Beli Putus)`;
  }

  const msg = `Halo Tim HRMatrix Indonesia,%0A%0ASaya tertarik mengajukan *Paket Kustomisasi Modul & Karyawan*:%0A- *Jumlah Karyawan*: ${calc.headcount} Orang (${calc.scaleBadge})%0A- *Modul Terpilih (${calc.selectedModulesCount} modul)*: ${modNames}%0A- *Skema Layanan*: ${skemaLabel}%0A- *Estimasi Biaya*: ${hargaLabel}%0A- *Biaya per Karyawan*: ~${formatRupiah(calc.costPerEmployeeMonthly)}/karyawan/bln%0A%0AMohon kirimkan faktur penawaran resmi, scope of work Agent, dan jadwal konsultasi. Terima kasih!`;
  return `https://wa.me/6282211119090?text=${msg}`;
}

export function generateProposalSummaryText(
  billingMode: BillingMode,
  currentTierData: TierData,
  selectedTier: CompanySizeTier
): string {
  let skemaText = '';
  if (billingMode === 'trial') {
    skemaText = `Uji Coba Pilot 3 Bulan (Hanya 1x Kontrak Evaluasi): PROMO ${formatRupiah(currentTierData.trial.promoPricePerMonth)}/bln (Normal: ${formatRupiah(currentTierData.trial.normalPricePerMonth)}/bln) - Total: ${formatRupiah(currentTierData.trial.totalBilled)} / 3 bln [${currentTierData.trial.discountLabel}]`;
  } else if (billingMode === 'annual') {
    skemaText = `Sewa Cloud Tahunan: PROMO ${formatRupiah(currentTierData.annual.promoPricePerMonth)}/bln (Normal: ${formatRupiah(currentTierData.annual.normalPricePerMonth)}/bln) - Total: ${formatRupiah(currentTierData.annual.promoAnnualBilled)}/tahun [${currentTierData.annual.discountLabel}]`;
  } else if (billingMode === 'agent') {
    skemaText = `Dedicated Agent HR & GA Hybrid: PROMO ${formatRupiah(currentTierData.agent.promoPricePerMonth)}/bln (Normal: ${formatRupiah(currentTierData.agent.normalPricePerMonth)}/bln) [${currentTierData.agent.discountLabel}] - Kunjungan: ${currentTierData.agent.visitFrequency}`;
  } else {
    skemaText = `White Label (Full Customisasi) Beli Putus: PROMO ${formatRupiah(currentTierData.whitelabel.promoPrice)} (Normal: ${formatRupiah(currentTierData.whitelabel.normalPrice)})`;
  }

  const enterpriseNotice = selectedTier === 'enterprise' 
    ? `\nBatasan Kuota: Kuota dasar maksimal 500 karyawan. Jika melebihi 500 karyawan, diperhitungkan biaya beban tambahan per orang saja (+Rp 5.000/karyawan/bln).` 
    : '';

  return `[PROPOSAL RESMI HARGA PROMO & TRAINING HRMATRIX]
Paket: ${currentTierData.name} (${currentTierData.karyawan})${enterpriseNotice}
Skema: ${skemaText}
Investasi per Karyawan: ${billingMode === 'trial' ? currentTierData.trial.costAnalysis.perEmployeeMonth : currentTierData.costAnalysis.perEmployeeMonth} / bulan
Kapasitas Server: ${currentTierData.serverSpecs?.cpu || 'Cloud VPS Cluster'} | ${currentTierData.serverSpecs?.ram || 'Dedicated RAM'} | ${currentTierData.serverSpecs?.storage || 'Cloud Storage'}
Fitur: ${currentTierData.classifiedDetails.modulDanEPortal.modulesCount} Modul Inti (${currentTierData.classifiedDetails.modulDanEPortal.moduleNames.join(', ')})
Edukasi & Onboarding:
- Modul Panduan & E-Book Lengkap SOP HR (Termasuk Gratis)
- Pelatihan Intensif Online via Live Zoom/GMeet (Termasuk Gratis)
- Tersedia Opsi Add-on Pelatihan Offline / On-Site Tatap Muka di Kantor

Ketentuan Layanan:
${billingMode === 'trial' ? '- Khusus Paket Uji Coba: Hanya bisa kontrak 1 kali untuk masa percobaan 3 bulan (non-renewable trial)' : billingMode === 'annual' ? '- Komitmen minimal 12 bulan (sewa tahunan dengan tarif termurah)' : billingMode === 'agent' ? '- Layanan Dedicated Agent Hybrid: Daily online + 1x kunjungan fisik per minggu. Perusahaan tidak perlu merekrut staf HR/GA internal.' : '- Lisensi beli putus seumur hidup (Full Customisasi)'}

Kontrak Resmi:
- Email: hrmatrix.id@gmail.com
- WhatsApp: +62 822-1111-9090`;
}
