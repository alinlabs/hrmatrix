export type BillingMode = 'trial' | 'annual' | 'whitelabel' | 'agent';
export type CompanySizeTier = 'startup' | 'growth' | 'enterprise';

export interface ModuleItem {
  id: string;
  name: string;
  category: string;
  normalPricePerMonth: number;
  promoPricePerMonth: number;
  whitelabelNormalPrice: number;
  whitelabelPromoPrice: number;
  description: string;
  features: string[];
}

export interface TierCostAnalysis {
  perEmployeeMonth: string;
  perEmployeeDay: string;
  marketBenchmark?: string;
  addonPrice?: string;
}

export interface ServerSpecs {
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  backup: string;
  sla: string;
}

export interface TrialPricing {
  contractMonths: number;
  isOneTimeOnly: boolean;
  normalPricePerMonth: number;
  promoPricePerMonth: number;
  totalBilled: number;
  discountPercent: string;
  savingsAmount: number;
  discountLabel: string;
  costAnalysis: {
    perEmployeeMonth: string;
    perEmployeeDay: string;
  };
  note: string;
}

export interface AnnualPricing {
  normalPricePerMonth: number;
  promoPricePerMonth: number;
  normalAnnualBilled: number;
  promoAnnualBilled: number;
  discountPercent: string;
  savingsAmount: number;
  discountLabel: string;
}

export interface WhitelabelPricing {
  normalPrice: number;
  promoPrice: number;
  discountPercent: string;
  savingsAmount: number;
  description: string;
  maintenanceFreeMonths: number;
}

export interface AgentPricing {
  normalPricePerMonth: number;
  promoPricePerMonth: number;
  discountPercent: string;
  savingsAmount: number;
  discountLabel: string;
  visitFrequency: string; // "1 Minggu 1 Kali (4x/bulan tatap muka)"
  scope: string; // "Hybrid: Daily Online + 1x Visit Offline/Minggu"
  inhouseBenchmarkMonthly: number; // e.g. Rp 7.500.000 (gaji HR + GA in-house)
  inhouseSavingsMonthly: number;
  benefits: string[];
  note: string;
}

export interface TierClassifiedDetails {
  kapasitas: {
    label: string;
    description: string;
    maxCount: number;
    extraNote?: string;
  };
  modulDanEPortal: {
    modulesCount: number;
    moduleNames: string[];
    eportalsCount: number;
    eportalNames: string[];
    tagline: string;
  };
  fiturExclusive: string[];
  layananDanBantuan: string[];
}

export interface TierData {
  name: string;
  badge: string;
  isPopular?: boolean;
  karyawan: string;
  maxUser: number;
  costAnalysis: TierCostAnalysis;
  serverSpecs?: ServerSpecs;
  trial: TrialPricing;
  annual: AnnualPricing;
  whitelabel: WhitelabelPricing;
  agent: AgentPricing;
  highlights: string[];
  classifiedDetails: TierClassifiedDetails;
}

export interface PricingMatrix {
  startup: TierData;
  growth: TierData;
  enterprise: TierData;
}

export interface AgentKetentuan {
  badge: string;
  scheduleLabel: string;
  onlineScope: string;
  offlineScope: string;
  savingsPrefix: string;
}

export interface SimpleKetentuan {
  badge: string;
  billingPeriodLabel: string;
  termTitle: string;
  termNote: string;
}

export interface TierKetentuan {
  agent: AgentKetentuan;
  trial: SimpleKetentuan;
  annual: SimpleKetentuan;
  whitelabel: SimpleKetentuan;
}

export interface TierFourElements {
  headline: string;
  regularSummary: string;
  agentSummary: string;
  modulesSummary?: string;
  exclusiveSummary?: string;
  eportalsSummary?: string;
  servicesSummary?: string;
}

export interface TierCardTexts {
  tierKey: CompanySizeTier;
  regularName: string;
  agentName: string;
  regularBadge: string;
  agentBadge: string;
  karyawan: string;
  regularDescription: string;
  agentDescription: string;
  popularBadgeRegular?: string;
  popularBadgeAgent?: string;
  claimButtons: Record<BillingMode, string>;
  fourElements: TierFourElements;
  ketentuan?: TierKetentuan;
}

export interface PromoTabItem {
  id: BillingMode;
  label: string;
  shortLabel: string;
  iconName: 'Clock' | 'Tag' | 'Shield' | 'UserCheck';
}

export interface PromoModalTextConfig {
  labels: Record<BillingMode, string>;
  headerBadgeInitials: Record<CompanySizeTier, string>;
  sectionTitles: {
    kapasitas: {
      number: string;
      title: string;
    };
    modulDanEPortal: {
      number: string;
      title: string;
      modulesSubheading: string;
      modulesBadge: string;
      eportalsSubheading: string;
      toggleClose: string;
      toggleOpen: string;
    };
    fiturExclusive: {
      number: string;
      title: string;
    };
    layananDanBantuan: {
      number: string;
      title: string;
    };
  };
  actions: {
    closeBtn: string;
    claimBtn: string;
  };
}

export interface ComparisonRow {
  feature: string;
  trial: string;
  annual: string;
  whitelabel: string;
  agent: string;
  agentHighlight?: boolean;
}

export interface TrainingCardItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  points: { bold: string; text: string }[];
  footerNote: string;
  actionLabel?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CustomModulePriceBreakdown {
  id: string;
  name: string;
  category: string;
  normalPrice: number;
  promoPrice: number;
  normalWhitelabel: number;
  promoWhitelabel: number;
  discountPercent: number;
}

export interface CustomModulesCalculation {
  headcount: number;
  billingMode: BillingMode;
  selectedModulesCount: number;
  totalModulesCount: number;
  // Monthly rates (annual cloud / active mode)
  normalMonthly: number;
  promoMonthly: number;
  // Per employee analysis
  costPerEmployeeMonthly: number;
  costPerEmployeeDaily: number;
  marketBenchmarkPerEmployee: number;
  marketTotalMonthly: number;
  marketSavingsMonthly: number;
  // Annual (12 months)
  normalAnnual: number;
  promoAnnual: number;
  savedAnnual: number;
  // Trial (3 months)
  trialMonthlyNormal: number;
  trialMonthlyPromo: number;
  trialTotalBilled: number;
  trialSaved: number;
  // Whitelabel (One-Time)
  whitelabelNormal: number;
  whitelabelPromo: number;
  whitelabelSaved: number;
  // Managed Agent (Hybrid)
  agentMonthlyNormal: number;
  agentMonthlyPromo: number;
  agentSavedMonthly: number;
  agentInhouseBenchmark: number;
  agentVsInhouseSavings: number;
  agentVisitFrequency: string;
  // Scale label & badges
  scaleLabel: string;
  scaleBadge: string;
  // Breakdown
  moduleBreakdowns: CustomModulePriceBreakdown[];
}

export type PaymentMethod = 'full' | 'installment';
export type WhiteLabelDpOption = 30 | 35 | 40;
export type AgentContractMonths = 3 | 6 | 12;

export interface InstallmentScheduleItem {
  periodNumber: number;
  label: string;
  dueDate: string;
  amount: number;
  description: string;
  isInitialPayment: boolean;
}

export interface OrderCustomerInfo {
  fullName: string;
  role: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  subdomain: string;
  notes?: string;
}

export interface OrderPaymentCalculation {
  totalTransaction: number;
  normalTransaction: number;
  savingsAmount: number;
  paymentMethod: PaymentMethod;
  downPaymentPercent: number; // 100 for full, 50 for trial/annual/agent, 30/35/40 for whitelabel
  downPaymentAmount: number;
  remainingAmount: number;
  installmentMonths: number;
  monthlyInstallmentAmount: number;
  dueToday: number;
  schedule: InstallmentScheduleItem[];
  schemeDescription: string;
}

export interface PromoOrderItem {
  orderType: 'package' | 'custom';
  tierKey?: CompanySizeTier;
  tierName: string;
  billingMode: BillingMode;
  headcount: number;
  moduleIds: string[];
  moduleNames: string[];
  serverSpecs?: ServerSpecs;
  agentContractMonths?: AgentContractMonths;
  whitelabelDpPercent?: WhiteLabelDpOption;
}

export interface PromoOrder {
  id: string;
  createdAt: string;
  dueDate: string;
  customer: OrderCustomerInfo;
  item: PromoOrderItem;
  payment: OrderPaymentCalculation;
  paymentChannel: 'bca' | 'mandiri' | 'bni' | 'bri' | 'qris';
  virtualAccountNumber: string;
  bankName: string;
  status: 'pending_payment' | 'paid' | 'verified';
  invoiceEmailSentTo: string;
  invoiceEmailSentAt: string;
}
