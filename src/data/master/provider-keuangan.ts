import { ComboboxOption } from '../../components/ui/ComboboxInput';

export interface FinancialProvider {
  value: string;
  label: string;
  category: 'bank' | 'ewallet';
  type: 'national' | 'international';
  country?: string;
  sublabel?: string;
}

// ==========================================
// DAFTAR BANK (NASIONAL & INTERNASIONAL)
// ==========================================
export const BANK_PROVIDERS: FinancialProvider[] = [
  // --- BANK NASIONAL INDONESIA (BUMN & SYARIAH) ---
  { value: 'BCA', label: 'BCA (Bank Central Asia)', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Bank Mandiri', label: 'Bank Mandiri', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank BUMN' },
  { value: 'BRI', label: 'BRI (Bank Rakyat Indonesia)', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank BUMN' },
  { value: 'BNI', label: 'BNI (Bank Negara Indonesia)', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank BUMN' },
  { value: 'BSI', label: 'BSI (Bank Syariah Indonesia)', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Syariah BUMN' },
  { value: 'BTN', label: 'BTN (Bank Tabungan Negara)', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank BUMN' },

  // --- BANK SWASTA SWASTA SWASTA INDONESIA ---
  { value: 'CIMB Niaga', label: 'Bank CIMB Niaga', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Bank Danamon', label: 'Bank Danamon', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Permata Bank', label: 'Permata Bank', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Panin Bank', label: 'Panin Bank', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Bank Mega', label: 'Bank Mega', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'OCBC NISP', label: 'OCBC NISP Indonesia', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Maybank Indonesia', label: 'Maybank Indonesia', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Bank Sinarmas', label: 'Bank Sinarmas', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'UOB Indonesia', label: 'Bank UOB Indonesia', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'DBS Indonesia', label: 'Bank DBS Indonesia', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'KB Bukopin', label: 'KB Bank (KB Bukopin)', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Bank MNC', label: 'Bank MNC Internasional', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Bank Artha Graha', label: 'Bank Artha Graha Internasional', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Bank Victoria', label: 'Bank Victoria', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Bank Mayapada', label: 'Bank Mayapada', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Nobu Bank', label: 'Bank Nationalnobu (Nobu Bank)', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Bank Sahabat Sampoerna', label: 'Bank Sahabat Sampoerna', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Bank Ganesha', label: 'Bank Ganesha', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Bank Ina Perdana', label: 'Bank Ina Perdana', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'Bank JTrust', label: 'Bank JTrust Indonesia', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },
  { value: 'CCB Indonesia', label: 'China Construction Bank Indonesia', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Swasta Nasional' },

  // --- BANK DIGITAL INDONESIA ---
  { value: 'Bank Jago', label: 'Bank Jago (Digital)', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Digital Indonesia' },
  { value: 'Jenius (BTPN)', label: 'Jenius / Bank BTPN', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Digital Indonesia' },
  { value: 'SeaBank', label: 'SeaBank Indonesia', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Digital Indonesia' },
  { value: 'blu by BCA Digital', label: 'blu by BCA Digital', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Digital Indonesia' },
  { value: 'Allo Bank', label: 'Allo Bank Indonesia', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Digital Indonesia' },
  { value: 'Neobank (BNC)', label: 'Bank Neo Commerce (Neobank)', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Digital Indonesia' },
  { value: 'LINE Bank', label: 'LINE Bank (Hana Bank)', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Digital Indonesia' },
  { value: 'MotionBank', label: 'MotionBank (MNC Bank)', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Digital Indonesia' },
  { value: 'Superbank', label: 'Superbank Indonesia', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Digital Indonesia' },
  { value: 'Bank Saqu', label: 'Bank Saqu', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Digital Indonesia' },
  { value: 'TMRW by UOB', label: 'TMRW by UOB', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Digital Indonesia' },
  { value: 'Digibank', label: 'Digibank by DBS', category: 'bank', type: 'national', country: 'ID', sublabel: 'Bank Digital Indonesia' },

  // --- BANK PEMBANGUNAN DAERAH (BPD) ---
  { value: 'Bank DKI', label: 'Bank DKI Jakarta', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD DKI Jakarta' },
  { value: 'Bank BJB', label: 'Bank BJB (Jawa Barat & Banten)', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Jawa Barat' },
  { value: 'Bank Jatim', label: 'Bank Jatim', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Jawa Timur' },
  { value: 'Bank Jateng', label: 'Bank Jateng', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Jawa Tengah' },
  { value: 'Bank DIY', label: 'Bank BPD DIY', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD DI Yogyakarta' },
  { value: 'Bank BPD Bali', label: 'Bank BPD Bali', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Bali' },
  { value: 'Bank Sumut', label: 'Bank Sumut', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Sumatera Utara' },
  { value: 'Bank Nagari', label: 'Bank Nagari (Sumbar)', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Sumatera Barat' },
  { value: 'Bank Riau Kepri', label: 'Bank Riau Kepri Syariah', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Riau & Kepri' },
  { value: 'Bank Sumsel Babel', label: 'Bank Sumsel Babel', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Sumsel & Babel' },
  { value: 'Bank Lampung', label: 'Bank Lampung', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Lampung' },
  { value: 'Bank Kalbar', label: 'Bank Kalbar', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Kalimantan Barat' },
  { value: 'Bank Kaltimtara', label: 'Bank Kaltimtara', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Kaltim & Kaltara' },
  { value: 'Bank Kalsel', label: 'Bank Kalsel', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Kalimantan Selatan' },
  { value: 'Bank Kalteng', label: 'Bank Kalteng', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Kalimantan Tengah' },
  { value: 'Bank Sulselbar', label: 'Bank Sulselbar', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Sulsel & Sulbar' },
  { value: 'Bank SulutGo', label: 'Bank SulutGo', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Sulut & Gorontalo' },
  { value: 'Bank NTB Syariah', label: 'Bank NTB Syariah', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD NTB' },
  { value: 'Bank NTT', label: 'Bank NTT', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD NTT' },
  { value: 'Bank Maluku Malut', label: 'Bank Maluku Malut', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Maluku & Malut' },
  { value: 'Bank Papua', label: 'Bank Papua', category: 'bank', type: 'national', country: 'ID', sublabel: 'BPD Papua' },

  // --- BANK INTERNASIONAL (POPULER LUAR NEGERI) ---
  // Amerika Serikat & Kanada
  { value: 'JPMorgan Chase', label: 'JPMorgan Chase Bank', category: 'bank', type: 'international', country: 'US', sublabel: 'Bank Internasional (Amerika Serikat)' },
  { value: 'Bank of America', label: 'Bank of America', category: 'bank', type: 'international', country: 'US', sublabel: 'Bank Internasional (Amerika Serikat)' },
  { value: 'Wells Fargo', label: 'Wells Fargo', category: 'bank', type: 'international', country: 'US', sublabel: 'Bank Internasional (Amerika Serikat)' },
  { value: 'Citibank', label: 'Citibank / Citigroup', category: 'bank', type: 'international', country: 'US', sublabel: 'Bank Internasional (Global / AS)' },
  { value: 'Goldman Sachs', label: 'Goldman Sachs', category: 'bank', type: 'international', country: 'US', sublabel: 'Bank Internasional (Amerika Serikat)' },
  { value: 'Morgan Stanley', label: 'Morgan Stanley', category: 'bank', type: 'international', country: 'US', sublabel: 'Bank Internasional (Amerika Serikat)' },
  { value: 'Capital One', label: 'Capital One', category: 'bank', type: 'international', country: 'US', sublabel: 'Bank Internasional (Amerika Serikat)' },
  { value: 'TD Bank', label: 'TD Bank', category: 'bank', type: 'international', country: 'CA', sublabel: 'Bank Internasional (Kanada / AS)' },
  { value: 'RBC', label: 'Royal Bank of Canada (RBC)', category: 'bank', type: 'international', country: 'CA', sublabel: 'Bank Internasional (Kanada)' },
  { value: 'Scotiabank', label: 'Scotiabank', category: 'bank', type: 'international', country: 'CA', sublabel: 'Bank Internasional (Kanada)' },
  { value: 'Itaú Unibanco', label: 'Itaú Unibanco', category: 'bank', type: 'international', country: 'BR', sublabel: 'Bank Internasional (Brasil)' },

  // Eropa & Inggris
  { value: 'HSBC', label: 'HSBC Bank', category: 'bank', type: 'international', country: 'UK', sublabel: 'Bank Internasional (Global / UK)' },
  { value: 'Barclays', label: 'Barclays Bank', category: 'bank', type: 'international', country: 'UK', sublabel: 'Bank Internasional (Inggris)' },
  { value: 'Lloyds Bank', label: 'Lloyds Bank', category: 'bank', type: 'international', country: 'UK', sublabel: 'Bank Internasional (Inggris)' },
  { value: 'NatWest', label: 'NatWest Bank', category: 'bank', type: 'international', country: 'UK', sublabel: 'Bank Internasional (Inggris)' },
  { value: 'Standard Chartered', label: 'Standard Chartered Bank', category: 'bank', type: 'international', country: 'UK', sublabel: 'Bank Internasional (Global / UK)' },
  { value: 'BNP Paribas', label: 'BNP Paribas', category: 'bank', type: 'international', country: 'FR', sublabel: 'Bank Internasional (Prancis)' },
  { value: 'Crédit Agricole', label: 'Crédit Agricole', category: 'bank', type: 'international', country: 'FR', sublabel: 'Bank Internasional (Prancis)' },
  { value: 'Société Générale', label: 'Société Générale', category: 'bank', type: 'international', country: 'FR', sublabel: 'Bank Internasional (Prancis)' },
  { value: 'Deutsche Bank', label: 'Deutsche Bank', category: 'bank', type: 'international', country: 'DE', sublabel: 'Bank Internasional (Jerman)' },
  { value: 'Commerzbank', label: 'Commerzbank', category: 'bank', type: 'international', country: 'DE', sublabel: 'Bank Internasional (Jerman)' },
  { value: 'UBS Group', label: 'UBS Group', category: 'bank', type: 'international', country: 'CH', sublabel: 'Bank Internasional (Swiss)' },
  { value: 'Banco Santander', label: 'Banco Santander', category: 'bank', type: 'international', country: 'ES', sublabel: 'Bank Internasional (Spanyol / Global)' },
  { value: 'BBVA', label: 'BBVA Bank', category: 'bank', type: 'international', country: 'ES', sublabel: 'Bank Internasional (Spanyol)' },
  { value: 'ING Bank', label: 'ING Bank', category: 'bank', type: 'international', country: 'NL', sublabel: 'Bank Internasional (Belanda / Global)' },
  { value: 'ABN AMRO', label: 'ABN AMRO', category: 'bank', type: 'international', country: 'NL', sublabel: 'Bank Internasional (Belanda)' },
  { value: 'Rabobank', label: 'Rabobank', category: 'bank', type: 'international', country: 'NL', sublabel: 'Bank Internasional (Belanda)' },
  { value: 'Nordea', label: 'Nordea Bank', category: 'bank', type: 'international', country: 'FI', sublabel: 'Bank Internasional (Finlandia / Skandinavia)' },

  // Asia Pasifik & Timur Tengah
  { value: 'DBS Bank', label: 'DBS Bank', category: 'bank', type: 'international', country: 'SG', sublabel: 'Bank Internasional (Singapura)' },
  { value: 'OCBC Bank', label: 'OCBC Bank', category: 'bank', type: 'international', country: 'SG', sublabel: 'Bank Internasional (Singapura)' },
  { value: 'UOB Singapore', label: 'United Overseas Bank (UOB)', category: 'bank', type: 'international', country: 'SG', sublabel: 'Bank Internasional (Singapura)' },
  { value: 'Maybank Malaysia', label: 'Maybank', category: 'bank', type: 'international', country: 'MY', sublabel: 'Bank Internasional (Malaysia)' },
  { value: 'CIMB Bank Malaysia', label: 'CIMB Bank', category: 'bank', type: 'international', country: 'MY', sublabel: 'Bank Internasional (Malaysia)' },
  { value: 'Public Bank', label: 'Public Bank Berhad', category: 'bank', type: 'international', country: 'MY', sublabel: 'Bank Internasional (Malaysia)' },
  { value: 'Bangkok Bank', label: 'Bangkok Bank', category: 'bank', type: 'international', country: 'TH', sublabel: 'Bank Internasional (Thailand)' },
  { value: 'Kasikornbank', label: 'Kasikornbank (KBank)', category: 'bank', type: 'international', country: 'TH', sublabel: 'Bank Internasional (Thailand)' },
  { value: 'Siam Commercial Bank', label: 'Siam Commercial Bank (SCB)', category: 'bank', type: 'international', country: 'TH', sublabel: 'Bank Internasional (Thailand)' },
  { value: 'Bank of China', label: 'Bank of China', category: 'bank', type: 'international', country: 'CN', sublabel: 'Bank Internasional (Tiongkok)' },
  { value: 'ICBC', label: 'ICBC (Industrial & Commercial Bank of China)', category: 'bank', type: 'international', country: 'CN', sublabel: 'Bank Internasional (Tiongkok)' },
  { value: 'China Construction Bank', label: 'China Construction Bank', category: 'bank', type: 'international', country: 'CN', sublabel: 'Bank Internasional (Tiongkok)' },
  { value: 'Agricultural Bank of China', label: 'Agricultural Bank of China', category: 'bank', type: 'international', country: 'CN', sublabel: 'Bank Internasional (Tiongkok)' },
  { value: 'MUFG Bank', label: 'MUFG Bank', category: 'bank', type: 'international', country: 'JP', sublabel: 'Bank Internasional (Jepang)' },
  { value: 'SMBC', label: 'Sumitomo Mitsui Banking Corp (SMBC)', category: 'bank', type: 'international', country: 'JP', sublabel: 'Bank Internasional (Jepang)' },
  { value: 'Mizuho Bank', label: 'Mizuho Bank', category: 'bank', type: 'international', country: 'JP', sublabel: 'Bank Internasional (Jepang)' },
  { value: 'Commonwealth Bank AU', label: 'Commonwealth Bank of Australia', category: 'bank', type: 'international', country: 'AU', sublabel: 'Bank Internasional (Australia)' },
  { value: 'ANZ Bank', label: 'ANZ Bank', category: 'bank', type: 'international', country: 'AU', sublabel: 'Bank Internasional (Australia / NZ)' },
  { value: 'NAB', label: 'National Australia Bank (NAB)', category: 'bank', type: 'international', country: 'AU', sublabel: 'Bank Internasional (Australia)' },
  { value: 'Westpac', label: 'Westpac Banking Corp', category: 'bank', type: 'international', country: 'AU', sublabel: 'Bank Internasional (Australia)' },
  { value: 'QNB', label: 'Qatar National Bank (QNB)', category: 'bank', type: 'international', country: 'QA', sublabel: 'Bank Internasional (Qatar)' },
  { value: 'Emirates NBD', label: 'Emirates NBD', category: 'bank', type: 'international', country: 'AE', sublabel: 'Bank Internasional (Uni Emirat Arab)' },
  { value: 'FAB', label: 'First Abu Dhabi Bank (FAB)', category: 'bank', type: 'international', country: 'AE', sublabel: 'Bank Internasional (Uni Emirat Arab)' }
];

// ==========================================
// DAFTAR E-WALLET (NASIONAL & INTERNASIONAL)
// ==========================================
export const EWALLET_PROVIDERS: FinancialProvider[] = [
  // --- E-WALLET NASIONAL INDONESIA ---
  { value: 'DANA', label: 'DANA (Dompet Digital Indonesia)', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'OVO', label: 'OVO (PT Visionet Internasional)', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'GoPay', label: 'GoPay (Gojek / Tokopedia)', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'LinkAja', label: 'LinkAja (BUMN)', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'ShopeePay', label: 'ShopeePay Indonesia', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'i-Saku', label: 'i-Saku (Indomaret)', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'Sakuku', label: 'Sakuku (BCA E-Money)', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'DOKU Wallet', label: 'DOKU Wallet', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'SpeedCash', label: 'SpeedCash / BebasBayar', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'AstraPay', label: 'AstraPay (Astra Group)', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'KasPro', label: 'KasPro', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'MotionPay', label: 'MotionPay (MNC Group)', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'PayTrenz', label: 'PayTrend', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },
  { value: 'SPIN Pay', label: 'SPIN Pay', category: 'ewallet', type: 'national', country: 'ID', sublabel: 'E-Wallet Indonesia' },

  // --- E-WALLET & DIGITAL WALLET INTERNASIONAL POPULER ---
  { value: 'PayPal', label: 'PayPal', category: 'ewallet', type: 'international', country: 'US', sublabel: 'E-Wallet Internasional (Global)' },
  { value: 'Wise', label: 'Wise / TransferWise', category: 'ewallet', type: 'international', country: 'UK', sublabel: 'E-Wallet Internasional (Global / UK)' },
  { value: 'Revolut', label: 'Revolut Digital Bank', category: 'ewallet', type: 'international', country: 'UK', sublabel: 'E-Wallet Internasional (Global / UK)' },
  { value: 'Payoneer', label: 'Payoneer Account', category: 'ewallet', type: 'international', country: 'US', sublabel: 'E-Wallet Internasional (Global)' },
  { value: 'Skrill', label: 'Skrill Digital Wallet', category: 'ewallet', type: 'international', country: 'UK', sublabel: 'E-Wallet Internasional (Global)' },
  { value: 'Neteller', label: 'Neteller', category: 'ewallet', type: 'international', country: 'UK', sublabel: 'E-Wallet Internasional (Global)' },
  { value: 'Apple Pay', label: 'Apple Pay', category: 'ewallet', type: 'international', country: 'US', sublabel: 'E-Wallet Internasional (Apple)' },
  { value: 'Google Wallet', label: 'Google Wallet / Google Pay', category: 'ewallet', type: 'international', country: 'US', sublabel: 'E-Wallet Internasional (Google)' },
  { value: 'WeChat Pay', label: 'WeChat Pay (Tencent)', category: 'ewallet', type: 'international', country: 'CN', sublabel: 'E-Wallet Internasional (Tiongkok)' },
  { value: 'Alipay', label: 'Alipay (Ant Group)', category: 'ewallet', type: 'international', country: 'CN', sublabel: 'E-Wallet Internasional (Tiongkok)' },
  { value: 'GrabPay', label: 'GrabPay', category: 'ewallet', type: 'international', country: 'SG', sublabel: 'E-Wallet Internasional (Asia Tenggara)' },
  { value: 'ShopeePay International', label: 'ShopeePay Global', category: 'ewallet', type: 'international', country: 'SG', sublabel: 'E-Wallet Internasional (Asia Tenggara)' },
  { value: 'Venmo', label: 'Venmo', category: 'ewallet', type: 'international', country: 'US', sublabel: 'E-Wallet Internasional (Amerika Serikat)' },
  { value: 'Cash App', label: 'Cash App (Block)', category: 'ewallet', type: 'international', country: 'US', sublabel: 'E-Wallet Internasional (Amerika Serikat)' },
  { value: 'Zelle', label: 'Zelle Pay', category: 'ewallet', type: 'international', country: 'US', sublabel: 'E-Wallet Internasional (Amerika Serikat)' },
  { value: 'WebMoney', label: 'WebMoney Transfer', category: 'ewallet', type: 'international', country: 'RU', sublabel: 'E-Wallet Internasional' },
  { value: 'Stripe', label: 'Stripe Account / Express', category: 'ewallet', type: 'international', country: 'US', sublabel: 'E-Wallet Internasional' },
  { value: 'LINE Pay', label: 'LINE Pay', category: 'ewallet', type: 'international', country: 'JP', sublabel: 'E-Wallet Internasional (Jepang / Taiwan)' },
  { value: 'KakaoPay', label: 'KakaoPay', category: 'ewallet', type: 'international', country: 'KR', sublabel: 'E-Wallet Internasional (Korea Selatan)' },
  { value: 'PayPay Japan', label: 'PayPay', category: 'ewallet', type: 'international', country: 'JP', sublabel: 'E-Wallet Internasional (Jepang)' },
  { value: 'Touch n Go', label: 'Touch \'n Go eWallet', category: 'ewallet', type: 'international', country: 'MY', sublabel: 'E-Wallet Internasional (Malaysia)' },
  { value: 'GCash', label: 'GCash', category: 'ewallet', type: 'international', country: 'PH', sublabel: 'E-Wallet Internasional (Filipina)' },
  { value: 'Maya', label: 'Maya / PayMaya', category: 'ewallet', type: 'international', country: 'PH', sublabel: 'E-Wallet Internasional (Filipina)' },
  { value: 'TrueMoney', label: 'TrueMoney Wallet', category: 'ewallet', type: 'international', country: 'TH', sublabel: 'E-Wallet Internasional (Thailand)' },
  { value: 'MoMo', label: 'MoMo Wallet', category: 'ewallet', type: 'international', country: 'VN', sublabel: 'E-Wallet Internasional (Vietnam)' }
];

export const ALL_FINANCIAL_PROVIDERS: FinancialProvider[] = [
  ...BANK_PROVIDERS,
  ...EWALLET_PROVIDERS
];

// Helper functions for Combobox options
export const getBankComboboxOptions = (customNames: string[] = []): ComboboxOption[] => {
  const customSet = new Set(customNames.filter(Boolean));
  const optionsMap = new Map<string, ComboboxOption>();

  BANK_PROVIDERS.forEach(b => {
    optionsMap.set(b.value, {
      value: b.value,
      label: b.label,
      sublabel: b.sublabel
    });
  });

  customSet.forEach(c => {
    if (!optionsMap.has(c)) {
      optionsMap.set(c, {
        value: c,
        label: c,
        sublabel: 'Pilihan Kustom'
      });
    }
  });

  return Array.from(optionsMap.values());
};

export const getEwalletComboboxOptions = (customNames: string[] = []): ComboboxOption[] => {
  const customSet = new Set(customNames.filter(Boolean));
  const optionsMap = new Map<string, ComboboxOption>();

  EWALLET_PROVIDERS.forEach(w => {
    optionsMap.set(w.value, {
      value: w.value,
      label: w.label,
      sublabel: w.sublabel
    });
  });

  customSet.forEach(c => {
    if (!optionsMap.has(c)) {
      optionsMap.set(c, {
        value: c,
        label: c,
        sublabel: 'Pilihan Kustom'
      });
    }
  });

  return Array.from(optionsMap.values());
};

export const getAllFinancialComboboxOptions = (customNames: string[] = []): ComboboxOption[] => {
  const customSet = new Set(customNames.filter(Boolean));
  const optionsMap = new Map<string, ComboboxOption>();

  ALL_FINANCIAL_PROVIDERS.forEach(p => {
    optionsMap.set(p.value, {
      value: p.value,
      label: p.label,
      sublabel: p.sublabel
    });
  });

  customSet.forEach(c => {
    if (!optionsMap.has(c)) {
      optionsMap.set(c, {
        value: c,
        label: c,
        sublabel: 'Pilihan Kustom'
      });
    }
  });

  return Array.from(optionsMap.values());
};

/**
 * Filter daftar provider berdasarkan metode pembayaran yang dipilih
 */
export const getFilteredFinancialOptions = (
  paymentMethod?: string,
  customNames: string[] = []
): ComboboxOption[] => {
  const method = (paymentMethod || '').toLowerCase();

  if (method.includes('ewallet') || method.includes('wallet') || method.includes('dompet')) {
    return getEwalletComboboxOptions(customNames);
  }

  if (method.includes('bank') || method.includes('transfer')) {
    return getBankComboboxOptions(customNames);
  }

  // Fallback untuk Tunai, Cek, atau Metode lainnya
  return getAllFinancialComboboxOptions(customNames);
};
