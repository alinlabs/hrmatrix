import { 
  BillingMode, 
  CompanySizeTier, 
  PaymentMethod, 
  WhiteLabelDpOption, 
  AgentContractMonths,
  OrderPaymentCalculation,
  InstallmentScheduleItem,
  PromoOrder,
  PromoOrderItem,
  OrderCustomerInfo
} from './types';
import { PRICING_DATA, formatRupiah } from './utils-helper';

export const BANK_ACCOUNTS = {
  bca: {
    name: 'BCA (Bank Central Asia)',
    code: '014',
    accountNumber: '8271-9002-3841-001',
    accountName: 'PT MATRIX TEKNOLOGI HR INDONESIA',
    badge: 'BCA Virtual Account'
  },
  mandiri: {
    name: 'Bank Mandiri',
    code: '008',
    accountNumber: '8910-4001-2831-900',
    accountName: 'PT MATRIX TEKNOLOGI HR INDONESIA',
    badge: 'Mandiri Bill Payment'
  },
  bni: {
    name: 'BNI (Bank Negara Indonesia)',
    code: '009',
    accountNumber: '9881-2090-3341-112',
    accountName: 'PT MATRIX TEKNOLOGI HR INDONESIA',
    badge: 'BNI Virtual Account'
  },
  bri: {
    name: 'BRI (Bank Rakyat Indonesia)',
    code: '002',
    accountNumber: '1289-0100-2911-508',
    accountName: 'PT MATRIX TEKNOLOGI HR INDONESIA',
    badge: 'BRIVA Virtual Account'
  },
  qris: {
    name: 'QRIS HRMatrix Multi-Bank & E-Wallet',
    code: 'QRIS',
    accountNumber: 'NMID: ID1024398102931',
    accountName: 'PT MATRIX TEKNOLOGI HR INDONESIA',
    badge: 'QRIS Scan Instan'
  }
};

/**
 * Helper to calculate due dates sequentially
 */
function getFormattedDueDate(monthOffset: number): string {
  const date = new Date();
  if (monthOffset === 0) {
    // Due within 3 days for initial payment / DP
    date.setDate(date.getDate() + 3);
  } else {
    // Next monthly installment
    date.setMonth(date.getMonth() + monthOffset);
  }
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

interface CalculatePaymentParams {
  billingMode: BillingMode;
  totalTransaction: number;
  normalTransaction: number;
  paymentMethod: PaymentMethod;
  whiteLabelDpPercent?: WhiteLabelDpOption;
  agentContractMonths?: AgentContractMonths;
}

export function calculateOrderPayment({
  billingMode,
  totalTransaction,
  normalTransaction,
  paymentMethod,
  whiteLabelDpPercent = 35,
  agentContractMonths = 3
}: CalculatePaymentParams): OrderPaymentCalculation {
  const savingsAmount = Math.max(0, normalTransaction - totalTransaction);

  // 1. Skema Tunai Lunas (100% Sekaligus)
  if (paymentMethod === 'full') {
    const schedule: InstallmentScheduleItem[] = [
      {
        periodNumber: 1,
        label: 'Pembayaran Lunas (100%)',
        dueDate: getFormattedDueDate(0),
        amount: totalTransaction,
        description: 'Pelunasan penuh lisensi server (Aktivasi server instan)',
        isInitialPayment: true
      }
    ];

    return {
      totalTransaction,
      normalTransaction,
      savingsAmount,
      paymentMethod: 'full',
      downPaymentPercent: 100,
      downPaymentAmount: totalTransaction,
      remainingAmount: 0,
      installmentMonths: 0,
      monthlyInstallmentAmount: 0,
      dueToday: totalTransaction,
      schedule,
      schemeDescription: 'Pembayaran Tunai Lunas (100% di muka tanpa cicilan)'
    };
  }

  // 2. Skema Cicilan Bulanan
  let downPaymentPercent = 50;
  let installmentMonths = 1;
  let schemeDescription = '';

  if (billingMode === 'trial') {
    // "kalau cicilan bulanan itu 50% dp di awal sisanya adalah dibayar perbulan dan ini berlaku untuk uji coba dan sewa tahunan"
    // Uji coba durasi 3 bulan: DP 50% di awal (bulan 1), sisa 50% dibagi 2 bulan (bulan 2 & bulan 3)
    downPaymentPercent = 50;
    installmentMonths = 2; // sisa 2 bulan
    schemeDescription = 'Cicilan Masa Uji Coba: DP 50% di awal + Angsuran 2 Bulan berikutnya';
  } else if (billingMode === 'annual') {
    // Sewa tahunan durasi 12 bulan: DP 50% di awal (bulan 1), sisa 50% dibagi 11 bulan (bulan 2 s/d bulan 12)
    downPaymentPercent = 50;
    installmentMonths = 11; // sisa 11 bulan
    schemeDescription = 'Cicilan Sewa Cloud Tahunan: DP 50% di awal + Angsuran 11 Bulan berikutnya';
  } else if (billingMode === 'whitelabel') {
    // "untuk white label itu ada cicilan program 1 tahun dengan dp 30%, 35% dan 40%"
    // Program 1 tahun (12 bulan): DP pilihan 30%, 35%, 40% di awal, sisa dicicil 11 bulan berikutnya
    downPaymentPercent = whiteLabelDpPercent;
    installmentMonths = 11; // 11 bulan angsuran setelah DP
    schemeDescription = `Program Cicilan 1 Tahun White Label: DP ${whiteLabelDpPercent}% di awal + Angsuran 11 Bulan`;
  } else if (billingMode === 'agent') {
    // "dan untuk dedicated agent itu 3 bulan minimal ketika yang paketan dan sama dpnya adalah 50% sisanya adalah biaya bulanan"
    downPaymentPercent = 50;
    const totalContractMonths = Math.max(3, agentContractMonths);
    installmentMonths = totalContractMonths - 1; // e.g. 3 bulan kontrak => DP bulan 1, sisa 2 bulan angsuran
    schemeDescription = `Cicilan Dedicated Agent (${totalContractMonths} Bulan): DP 50% di awal + Angsuran ${installmentMonths} Bulan`;
  }

  // Hitung DP dan sisa
  const downPaymentAmount = Math.round((totalTransaction * downPaymentPercent) / 100);
  const remainingAmount = totalTransaction - downPaymentAmount;
  const monthlyInstallmentAmount = installmentMonths > 0 
    ? Math.round(remainingAmount / installmentMonths) 
    : 0;

  // Bangun Jadwal Angsuran
  const schedule: InstallmentScheduleItem[] = [];

  // Termin 1: DP di awal
  schedule.push({
    periodNumber: 1,
    label: `Termin 1 (DP ${downPaymentPercent}%)`,
    dueDate: getFormattedDueDate(0),
    amount: downPaymentAmount,
    description: 'Down Payment tanda jadi & aktivasi deployment server',
    isInitialPayment: true
  });

  // Termin berikutnya: Angsuran bulanan
  for (let i = 1; i <= installmentMonths; i++) {
    // Handle rounding difference on the last installment
    const isLast = i === installmentMonths;
    const amount = isLast 
      ? remainingAmount - (monthlyInstallmentAmount * (installmentMonths - 1))
      : monthlyInstallmentAmount;

    schedule.push({
      periodNumber: i + 1,
      label: `Termin ${i + 1} (Angsuran Bln ke-${i + 1})`,
      dueDate: getFormattedDueDate(i),
      amount,
      description: `Angsuran bulanan ke-${i} dari total ${installmentMonths} bulan`,
      isInitialPayment: false
    });
  }

  return {
    totalTransaction,
    normalTransaction,
    savingsAmount,
    paymentMethod: 'installment',
    downPaymentPercent,
    downPaymentAmount,
    remainingAmount,
    installmentMonths,
    monthlyInstallmentAmount,
    dueToday: downPaymentAmount,
    schedule,
    schemeDescription
  };
}

/**
 * Generate unique Invoice ID
 */
export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `INV-HRM-${year}${month}-${randomSuffix}`;
}

/**
 * Format virtual account number for selected bank
 */
export function generateVirtualAccountNumber(bankKey: keyof typeof BANK_ACCOUNTS): string {
  const bank = BANK_ACCOUNTS[bankKey] || BANK_ACCOUNTS.bca;
  return bank.accountNumber;
}

/**
 * LocalStorage storage helpers
 */
const STORAGE_KEY = 'hrmatrix_promo_orders_v1';

export function getSavedPromoOrders(): PromoOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePromoOrder(order: PromoOrder): void {
  try {
    const existing = getSavedPromoOrders();
    // Prepend new order
    const updated = [order, ...existing.filter(o => o.id !== order.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 20))); // Keep last 20
  } catch (err) {
    console.error('Failed to save promo order to localStorage', err);
  }
}

export function getPromoOrderById(id: string): PromoOrder | undefined {
  const orders = getSavedPromoOrders();
  return orders.find(o => o.id === id);
}
