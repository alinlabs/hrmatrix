import { 
  VacancyItem, 
  MatchedResponsibility, 
  AtsMatchBreakdown, 
  ParsedAtsRequirement,
  CandidateWorkExperience,
  CandidateExperienceSummary,
  CandidateEducationHistory,
  CandidateAchievement,
  CandidateCertification,
  CandidateSkillSet,
  CandidatePotentialAnalysis,
  ExperienceEvaluation,
  LocationEvaluation
} from './types';
import { 
  extractWorkExperiences, 
  extractEducationHistory, 
  extractAchievements,
  extractCertifications,
  extractCandidateSkillSet,
  cleanExecutiveSummary,
  analyzeCandidatePotential,
  evaluateExperienceRequirement 
} from './work-history-parser';

/**
 * ATS PARSER STANDARD ENGINE
 * Benchmark Standard untuk Ekstraksi CV Pelamar yang Akurat & Teruji
 */

export interface ParsedCandidateData {
  name: string;
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    portfolio?: string;
    other?: string;
  };
  summary: string;
  workExperiences?: CandidateWorkExperience[];
  experienceSummary?: CandidateExperienceSummary;
  educationHistory?: CandidateEducationHistory[];
  achievements?: CandidateAchievement[];
  certifications?: CandidateCertification[];
  skillSet?: CandidateSkillSet;
  potentialAnalysis?: CandidatePotentialAnalysis;
}

// 1. Comprehensive Indonesian Cities & Regencies Registry
const INDONESIA_LOCATIONS: { name: string; region: string; aliases?: string[] }[] = [
  // Jabodetabek
  { name: 'Jakarta Selatan', region: 'DKI Jakarta', aliases: ['Jaksel', 'South Jakarta'] },
  { name: 'Jakarta Pusat', region: 'DKI Jakarta', aliases: ['Jakpus', 'Central Jakarta'] },
  { name: 'Jakarta Barat', region: 'DKI Jakarta', aliases: ['Jakbar', 'West Jakarta'] },
  { name: 'Jakarta Timur', region: 'DKI Jakarta', aliases: ['Jaktim', 'East Jakarta'] },
  { name: 'Jakarta Utara', region: 'DKI Jakarta', aliases: ['Jakut', 'North Jakarta'] },
  { name: 'Jakarta', region: 'DKI Jakarta', aliases: ['DKI Jakarta'] },
  { name: 'Bekasi', region: 'Jawa Barat', aliases: ['Kota Bekasi', 'Kabupaten Bekasi'] },
  { name: 'Cikarang', region: 'Jawa Barat', aliases: ['Cikarang Pusat', 'Cikarang Selatan'] },
  { name: 'Depok', region: 'Jawa Barat', aliases: ['Kota Depok'] },
  { name: 'Bogor', region: 'Jawa Barat', aliases: ['Kota Bogor', 'Kabupaten Bogor'] },
  { name: 'Tangerang Selatan', region: 'Banten', aliases: ['Tangsel', 'South Tangerang'] },
  { name: 'Tangerang', region: 'Banten', aliases: ['Kota Tangerang', 'Kabupaten Tangerang'] },
  
  // Jawa Barat & Banten
  { name: 'Bandung', region: 'Jawa Barat', aliases: ['Kota Bandung', 'Kabupaten Bandung', 'Bandung Barat'] },
  { name: 'Cimahi', region: 'Jawa Barat' },
  { name: 'Karawang', region: 'Jawa Barat' },
  { name: 'Purwakarta', region: 'Jawa Barat' },
  { name: 'Sukabumi', region: 'Jawa Barat' },
  { name: 'Cirebon', region: 'Jawa Barat' },
  { name: 'Tasikmalaya', region: 'Jawa Barat' },
  { name: 'Garut', region: 'Jawa Barat' },
  { name: 'Subang', region: 'Jawa Barat' },
  { name: 'Serang', region: 'Banten' },
  { name: 'Cilegon', region: 'Banten' },

  // Jawa Tengah & DIY
  { name: 'Semarang', region: 'Jawa Tengah' },
  { name: 'Surakarta', region: 'Jawa Tengah', aliases: ['Solo', 'Kota Solo'] },
  { name: 'Yogyakarta', region: 'D.I. Yogyakarta', aliases: ['Jogja', 'Jogjakarta', 'DIY'] },
  { name: 'Sleman', region: 'D.I. Yogyakarta' },
  { name: 'Bantul', region: 'D.I. Yogyakarta' },
  { name: 'Magelang', region: 'Jawa Tengah' },
  { name: 'Salatiga', region: 'Jawa Tengah' },
  { name: 'Pekalongan', region: 'Jawa Tengah' },
  { name: 'Tegal', region: 'Jawa Tengah' },
  { name: 'Kudus', region: 'Jawa Tengah' },
  { name: 'Purwokerto', region: 'Jawa Tengah', aliases: ['Banyumas'] },

  // Jawa Timur
  { name: 'Surabaya', region: 'Jawa Timur' },
  { name: 'Malang', region: 'Jawa Timur', aliases: ['Kota Malang', 'Kabupaten Malang', 'Batu'] },
  { name: 'Sidoarjo', region: 'Jawa Timur' },
  { name: 'Gresik', region: 'Jawa Timur' },
  { name: 'Pasuruan', region: 'Jawa Timur' },
  { name: 'Mojokerto', region: 'Jawa Timur' },
  { name: 'Kediri', region: 'Jawa Timur' },
  { name: 'Madiun', region: 'Jawa Timur' },
  { name: 'Jember', region: 'Jawa Timur' },
  { name: 'Banyuwangi', region: 'Jawa Timur' },

  // Bali & Nusa Tenggara
  { name: 'Denpasar', region: 'Bali', aliases: ['Badung', 'Kuta', 'Seminyak', 'Sanur', 'Ubud', 'Bali'] },
  { name: 'Mataram', region: 'Nusa Tenggara Barat', aliases: ['Lombok'] },
  { name: 'Kupang', region: 'Nusa Tenggara Timur' },

  // Sumatra
  { name: 'Medan', region: 'Sumatera Utara' },
  { name: 'Palembang', region: 'Sumatera Selatan' },
  { name: 'Batam', region: 'Kepulauan Riau' },
  { name: 'Pekanbaru', region: 'Riau' },
  { name: 'Bandar Lampung', region: 'Lampung', aliases: ['Lampung'] },
  { name: 'Padang', region: 'Sumatera Barat' },
  { name: 'Jambi', region: 'Jambi' },
  { name: 'Bengkulu', region: 'Bengkulu' },
  { name: 'Pangkal Pinang', region: 'Bangka Belitung' },
  { name: 'Banda Aceh', region: 'Aceh' },

  // Kalimantan
  { name: 'Balikpapan', region: 'Kalimantan Timur' },
  { name: 'Samarinda', region: 'Kalimantan Timur' },
  { name: 'Banjarmasin', region: 'Kalimantan Selatan' },
  { name: 'Pontianak', region: 'Kalimantan Barat' },
  { name: 'Palangka Raya', region: 'Kalimantan Tengah' },

  // Sulawesi & Indonesia Timur
  { name: 'Makassar', region: 'Sulawesi Selatan', aliases: ['Ujung Pandang'] },
  { name: 'Manado', region: 'Sulawesi Utara' },
  { name: 'Palu', region: 'Sulawesi Tengah' },
  { name: 'Kendari', region: 'Sulawesi Tenggara' },
  { name: 'Ambon', region: 'Maluku' },
  { name: 'Jayapura', region: 'Papua' }
];

// Words that disqualify an address string (e.g. project descriptions, responsibilities, random prose)
const INVALID_ADDRESS_WORDS = [
  'eksekusi', 'bertanggung', 'jawab', 'mengembangkan', 'memimpin', 'project', 
  'analisis', 'laporan', 'perusahaan', 'kandidat', 'deskripsi', 'tanggung', 
  'persyaratan', 'kualifikasi', 'kemampuan', 'pengalaman', 'tahun', 'bulan', 
  'job', 'role', 'summary', 'task', 'delivery', 'resource', 'manajemen', 
  'operational', 'marketing', 'sales', 'engineer', 'developer', 'staff',
  'officer', 'manager', 'lead', 'head', 'direktur', 'supervisor', 'admin'
];

/**
 * Extract Phone Number with Multi-Pattern & Standard Formatting
 */
export function extractPhoneNumber(text: string): string {
  if (!text) return 'Tidak terdeteksi';

  // Step 1: Check with explicit contact labels first (Telp, Phone, WA, Mobile, HP, etc.)
  const labelPatterns = [
    /(?:(?:Telepon|Telp|Phone|Mobile|WhatsApp|WA|HP|Call|Handphone|Kontak|Contact|No\.?\s*(?:HP|Telp|WA))\s*[:|•\-\/]\s*)([+0-9()\-.\s]{8,24})/i,
    /(?:(?:WA|WhatsApp|Call|Tel)\s*[:|•\-\/]?\s*)([+0-9()\-.\s]{8,24})/i
  ];

  for (const pattern of labelPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const cleaned = cleanAndValidatePhoneNumber(match[1]);
      if (cleaned) return cleaned;
    }
  }

  // Step 2: Look for standard Indonesian mobile formats (+62 / 62 / 08xx) with flexible spacing/dashes/dots
  // e.g. +62 812-3456-7890, 0812 3456 7890, 0812-3456-7890, 0812.3456.7890, +6281234567890, (0812) 3456789
  const idnMobileRegex = /(?:\+62|62|0)(?:8[1-9][0-9])[\s.-]?[0-9]{3,4}[\s.-]?[0-9]{3,5}/g;
  const idnMatches = text.match(idnMobileRegex);
  if (idnMatches && idnMatches.length > 0) {
    for (const raw of idnMatches) {
      const cleaned = cleanAndValidatePhoneNumber(raw);
      if (cleaned) return cleaned;
    }
  }

  // Step 3: Look for Landline / Area codes (021, 022, 031, etc.)
  const landlineRegex = /(?:\(?0[2-9][0-9]\)?|\+62[\s.-]?[2-9][0-9])[\s.-]?[0-9]{3,4}[\s.-]?[0-9]{3,5}/g;
  const landlineMatches = text.match(landlineRegex);
  if (landlineMatches && landlineMatches.length > 0) {
    for (const raw of landlineMatches) {
      const cleaned = cleanAndValidatePhoneNumber(raw);
      if (cleaned) return cleaned;
    }
  }

  // Step 4: International format (+xx xxxx xxxx)
  const intlRegex = /\+(?:[1-9]\d{0,2})[\s.-]?(?:\(?\d{1,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,5}/g;
  const intlMatches = text.match(intlRegex);
  if (intlMatches && intlMatches.length > 0) {
    for (const raw of intlMatches) {
      const cleaned = cleanAndValidatePhoneNumber(raw);
      if (cleaned) return cleaned;
    }
  }

  return 'Tidak terdeteksi';
}

function cleanAndValidatePhoneNumber(raw: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  const digitsOnly = trimmed.replace(/[^0-9]/g, '');

  // Must be between 9 and 15 digits
  if (digitsOnly.length < 9 || digitsOnly.length > 15) return null;

  // Reject years, dates, or sequences that look like years (e.g. 20182022)
  if (/^(?:19|20)\d{2}(?:19|20)\d{2}$/.test(digitsOnly)) return null;

  // Format standard 08xx / +62 numbers nicely
  let normalized = trimmed.replace(/[^\d+()\-\s.]/g, '').trim();
  
  // If clean digits start with 08, format as standard 08xx-xxxx-xxxx
  if (digitsOnly.startsWith('08') && digitsOnly.length >= 10 && digitsOnly.length <= 13) {
    if (digitsOnly.length === 10) {
      return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
    } else if (digitsOnly.length === 11) {
      return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
    } else if (digitsOnly.length === 12) {
      return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 8)}-${digitsOnly.slice(8)}`;
    } else {
      return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 8)}-${digitsOnly.slice(8)}`;
    }
  }

  // If starts with 628, format as +62 8xx-xxxx-xxxx
  if (digitsOnly.startsWith('628') && digitsOnly.length >= 11 && digitsOnly.length <= 14) {
    const without62 = digitsOnly.slice(2);
    return `+62 ${without62.slice(0, 3)}-${without62.slice(3, 7)}-${without62.slice(7)}`;
  }

  return normalized;
}

/**
 * Extract Address / Domicile with Strict Validation & Anti-Hallucination
 */
export function extractAddress(text: string): string {
  if (!text) return 'Tidak terdeteksi';

  const headerSnippet = text.slice(0, 1500);

  // Step 1: Explicit Label Check (Alamat, Domisili, Domicile, Location, Tempat Tinggal)
  // Must have strict delimiter (: or -) and not match random words
  const explicitLabelRegex = /(?:(?:Alamat(?:\s+Saat\s+Ini|\s+Lengkap|\s+KTP|\s+Domisili)?|Domisili|Domicile|Home\s+Address|Current\s+Address|Tempat\s+Tinggal)\s*[:|-]\s*)([^\n\r\t•|]{3,70})/i;
  const labelMatch = headerSnippet.match(explicitLabelRegex);

  if (labelMatch && labelMatch[1]) {
    const rawVal = labelMatch[1].trim();
    if (isValidAddressString(rawVal)) {
      return sanitizeAddressString(rawVal);
    }
  }

  // Step 2: Street / Komplek / Kecamatan prefix patterns
  const streetRegex = /(?:Jl\.|Jalan|Komplek|Perumahan|Kec\.|Kecamatan|Kel\.|Kelurahan)\s+[A-Za-z0-9\s.,\-\/]{5,60}/i;
  const streetMatch = headerSnippet.match(streetRegex);
  if (streetMatch && streetMatch[0]) {
    const rawVal = streetMatch[0].trim();
    if (isValidAddressString(rawVal)) {
      return sanitizeAddressString(rawVal);
    }
  }

  // Step 3: Exact Location & City Match from Indonesia Locations Registry
  for (const loc of INDONESIA_LOCATIONS) {
    // Check main name
    const nameRegex = new RegExp(`\\b${loc.name}\\b`, 'i');
    if (nameRegex.test(headerSnippet)) {
      return `${loc.name}, ${loc.region}`;
    }

    // Check aliases
    if (loc.aliases) {
      for (const alias of loc.aliases) {
        const aliasRegex = new RegExp(`\\b${alias}\\b`, 'i');
        if (aliasRegex.test(headerSnippet)) {
          return `${loc.name}, ${loc.region}`;
        }
      }
    }
  }

  return 'Tidak terdeteksi';
}

function isValidAddressString(str: string): boolean {
  if (!str || str.length < 3 || str.length > 70) return false;
  if (str.includes('@') || str.includes('http') || str.includes('www.') || str.includes('.com')) return false;

  const lower = str.toLowerCase();
  for (const invalidWord of INVALID_ADDRESS_WORDS) {
    if (lower.includes(invalidWord)) {
      return false;
    }
  }

  return true;
}

function sanitizeAddressString(str: string): string {
  // Strip trailing punctuation like comma, dot, colon, dash
  let cleaned = str.replace(/[,;:\-\s]+$/, '').replace(/^[,;:\-\s]+/, '').trim();
  // Ensure title-case or proper capitalization if not all uppercase
  if (!cleaned.toLowerCase().includes('indonesia') && !cleaned.toLowerCase().includes('jawa') && !cleaned.toLowerCase().includes('dki')) {
    cleaned = `${cleaned}, Indonesia`;
  }
  return cleaned;
}

/**
 * Extract Email
 */
export function extractEmail(text: string): string {
  if (!text) return 'Tidak terdeteksi';
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch && emailMatch[0]) {
    return emailMatch[0].trim().toLowerCase();
  }
  return 'Tidak terdeteksi';
}

/**
 * Extract Social Media & Portfolio Links
 */
export function extractSocialLinks(text: string): ParsedCandidateData['socialMedia'] {
  const socialMedia: ParsedCandidateData['socialMedia'] = {};
  if (!text) return socialMedia;

  // LinkedIn
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub|profile)\/([a-zA-Z0-9_%-]+)/i);
  if (linkedinMatch) {
    socialMedia.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
  }

  // GitHub
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_%-]+)/i);
  if (githubMatch && !githubMatch[0].includes('linkedin')) {
    socialMedia.github = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;
  }

  // Instagram
  const instagramMatch = text.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]+)/i);
  if (instagramMatch) {
    socialMedia.instagram = instagramMatch[0].startsWith('http') ? instagramMatch[0] : `https://${instagramMatch[0]}`;
  }

  // Portfolio / Personal Domain
  const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:me|dev|io|tech|site|app|my\.id|co\.id))\/?[\w-]*/i);
  if (portfolioMatch && !portfolioMatch[0].includes('linkedin') && !portfolioMatch[0].includes('github') && !portfolioMatch[0].includes('instagram') && !portfolioMatch[0].includes('gmail') && !portfolioMatch[0].includes('google')) {
    socialMedia.portfolio = portfolioMatch[0].startsWith('http') ? portfolioMatch[0] : `https://${portfolioMatch[0]}`;
  }

  // Behance / Dribbble
  if (!socialMedia.portfolio) {
    const designMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?:behance\.net|dribbble\.com)\/([a-zA-Z0-9_%-]+)/i);
    if (designMatch) {
      socialMedia.portfolio = designMatch[0].startsWith('http') ? designMatch[0] : `https://${designMatch[0]}`;
    }
  }

  return socialMedia;
}

/**
 * Extract Candidate Name
 */
export function extractCandidateName(text: string, fallbackName: string): string {
  if (!text) return fallbackName;

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const skipWords = [
    'curriculum', 'vitae', 'resume', 'profil', 'profile', 'summary', 'biodata',
    'data pribadi', 'riwayat', 'hidup', 'page', 'halaman', 'lampiran', 'doc',
    'portfolio', 'portofolio', 'surat', 'lamaran', 'application'
  ];

  for (const line of lines.slice(0, 6)) {
    const lower = line.toLowerCase();
    
    // Check if line contains skip header words
    const isSkip = skipWords.some(w => lower.startsWith(w) || lower === w);
    if (isSkip) continue;

    // Check if line has email, phone, or symbols
    if (line.includes('@') || line.match(/[0-9]{4,}/) || line.includes('http') || line.includes('www.')) {
      continue;
    }

    // Name is usually 2 to 50 characters, 2 to 5 words
    if (line.length >= 3 && line.length <= 50) {
      const words = line.split(/\s+/);
      if (words.length >= 1 && words.length <= 6) {
        return line;
      }
    }
  }

  return fallbackName;
}

/**
 * Extract Profile Summary
 */
export function extractSummary(text: string): string {
  if (!text) return '';

  const summaryMatch = text.match(/(?:Ringkasan(?:\s+Profil)?|Summary|Profile|About\s+Me|Tentang\s+Saya|Profil|Sorotan\s+Kinerja)\s*[:|-]?\s*([\s\S]{30,800}?)(?=\n\s*(?:[A-Z\s]{4,}:|Experience|Pengalaman|Pendidikan|Education|Keahlian|Skills|Riwayat\s+Kerja|Organisasi|Sertifikasi|$))/i);
  
  if (summaryMatch && summaryMatch[1]) {
    return summaryMatch[1].trim();
  }

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length > 3) {
    return lines.slice(1, 7).join(' ');
  }

  return text.slice(0, 500);
}

/**
 * Master ATS Candidate Parsing Function
 */
export function parseCandidateInfoFromText(text: string, fallbackName: string): ParsedCandidateData {
  const { experiences, summary: expSummary } = extractWorkExperiences(text);
  const educationHistory = extractEducationHistory(text);
  const achievements = extractAchievements(text);
  const certifications = extractCertifications(text);
  const skillSet = extractCandidateSkillSet(text);
  const cleanSummaryBullets = cleanExecutiveSummary(extractSummary(text), text);

  return {
    name: extractCandidateName(text, fallbackName),
    email: extractEmail(text),
    phone: extractPhoneNumber(text),
    address: extractAddress(text),
    socialMedia: extractSocialLinks(text),
    summary: cleanSummaryBullets.join(' '),
    workExperiences: experiences,
    experienceSummary: expSummary,
    educationHistory: educationHistory,
    achievements: achievements,
    certifications: certifications,
    skillSet: skillSet
  };
}

// Stopwords for Indonesian and English in job descriptions (Enhanced with non-differentiating terms)
const STOPWORDS = new Set([
  'melakukan', 'mengkoordinasikan', 'mengawasi', 'memastikan', 'menjalankan',
  'mengembangkan', 'menerapkan', 'mengelola', 'melaksanakan', 'memberikan',
  'menganalisis', 'menyusun', 'membuat', 'menjaga', 'mendorong', 'mengoptimalkan',
  'yang', 'dan', 'di', 'ke', 'dari', 'pada', 'untuk', 'dengan', 'secara', 'serta',
  'terhadap', 'dalam', 'agar', 'sesuai', 'standar', 'sop', 'harian', 'rutin',
  'atas', 'bawah', 'terkait', 'guna', 'bagi', 'atau', 'sebagai', 'oleh',
  'laporan', 'data', 'operasional', 'proses', 'kegiatan', 'kerja', 'dokumen', 
  'informasi', 'evaluasi', 'hasil', 'sistem', 'waktu', 'unit', 'tim', 'baik', 
  'kebutuhan', 'program', 'langkah', 'target', 'aktivitas', 'bidang', 'tingkat', 
  'hal', 'semua', 'lain', 'dapat', 'akan', 'telah', 'setiap', 'salah', 'satu', 
  'dua', 'tiga', 'empat', 'lima', 'menjadi', 'seperti', 'antara', 'fungsi',
  'to', 'and', 'in', 'on', 'of', 'for', 'with', 'by', 'at', 'from', 'as', 'the', 'a', 'an', 'is', 'are'
]);

/**
 * Extract Core Domain Anchor Keywords based on Vacancy Role & Department
 */
export function getDomainAnchors(vacancy: VacancyItem): string[] {
  const title = (vacancy.jobTitle || '').toLowerCase();
  const dept = (vacancy.department || '').toLowerCase();
  const combined = `${title} ${dept}`;

  const anchors: string[] = [];

  // 1. HR / Human Resource / HRIS / Rekrutmen / Personalia
  if (/hr|human resource|recruitment|talent|personalia|kepegawaian|hris|payroll|karyawan|people/i.test(combined)) {
    anchors.push(
      'hr', 'hrd', 'hris', 'human resource', 'human resources', 'recruitment', 
      'rekrutmen', 'personalia', 'kepegawaian', 'payroll', 'karyawan', 
      'talent acquisition', 'hubungan industrial', 'industrial relation', 
      'bpjs ketenagakerjaan', 'kompensasi', 'benefit', 'absensi', 'offboarding', 'onboarding', 'job desk'
    );
  }
  // 2. Finance / Accounting / Pajak / Audit
  if (/finance|accounting|akuntansi|pajak|tax|kasir|audit|keuangan|faktur|pembukuan/i.test(combined)) {
    anchors.push(
      'finance', 'accounting', 'akuntansi', 'pajak', 'tax', 'brevet', 'jurnal', 
      'buku besar', 'laporan keuangan', 'neraca', 'ar', 'ap', 'arus kas', 
      'cash flow', 'faktur', 'audit', 'pembukuan', 'rekonsiliasi bank', 'ledger'
    );
  }
  // 3. IT / Software / Developer / Tech
  if (/developer|engineer|programmer|software|it|devops|data|tech|frontend|backend|fullstack|qa|tester|system/i.test(combined)) {
    anchors.push(
      'developer', 'programmer', 'software engineer', 'frontend', 'backend', 
      'fullstack', 'react', 'node', 'python', 'javascript', 'typescript', 
      'java', 'golang', 'sql', 'git', 'api', 'database', 'html', 'css', 'bug', 'deploy', 'testing'
    );
  }
  // 4. Marketing / Sales / Digital
  if (/marketing|sales|digital|seo|social media|content|brand|bisnis|penjualan/i.test(combined)) {
    anchors.push(
      'marketing', 'sales', 'penjualan', 'omset', 'digital marketing', 
      'lead', 'prospect', 'iklan', 'campaign', 'social media', 'content creator', 
      'seo', 'sem', 'branding', 'market research', 'closing', 'canvassing'
    );
  }
  // 5. General Affair / Facility / Logistik / Gudang / K3
  if (/general affair|ga|operasional|facility|logistik|warehouse|supply|k3|gudang/i.test(combined)) {
    anchors.push(
      'general affair', 'ga', 'facility', 'pengadaan', 'procurement', 
      'vendor', 'inventaris', 'logistik', 'warehouse', 'gudang', 
      'supply chain', 'k3', 'maintenance', 'sarana prasarana', 'aset perusahaan'
    );
  }
  // 6. Legal / Hukum / Compliance
  if (/legal|hukum|compliance|kontrak|advokat/i.test(combined)) {
    anchors.push(
      'legal', 'hukum', 'perjanjian', 'kontrak', 'litigasi', 
      'compliance', 'regulasi', 'advokat', 'somasi', 'drafting', 'akta'
    );
  }

  // Distinctive words from the title
  const titleWords = title.split(/\s+/).filter(w => w.length >= 4 && !STOPWORDS.has(w));
  anchors.push(...titleWords);

  return Array.from(new Set(anchors));
}

/**
 * Clean & normalize raw requirement string from template/jobdesk
 */
function cleanRawRequirementString(raw: string): string[] {
  if (!raw) return [];
  
  let cleaned = raw
    .replace(/\s*\((?:diutamakan|wajib|opsional|mandatory|preferred|min(?:imal)?\s*[\d-]+\s*(?:tahun|thn)?)\)/gi, '')
    .replace(/^[-•*]\s*/, '')
    .trim();

  if (cleaned.includes('/') && !cleaned.match(/s1\/d3|d3\/s1|sma\/smk|smk\/sma/i)) {
    const parts = cleaned.split(/\s*\/\s*/).map(p => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      return parts;
    }
  }

  return [cleaned];
}

/**
 * Intelligent Keyword & Requirement Expansion Engine
 * Uses strict, domain-calibrated aliases to avoid false matches
 */
export function buildStructuredRequirements(vacancy: VacancyItem): ParsedAtsRequirement[] {
  const template = vacancy.rawJobTemplate;
  const jobTitle = (vacancy.jobTitle || '').toLowerCase();
  
  const isHR = /hr|human resource|recruitment|talent|personalia|kepegawaian|hris|people/i.test(jobTitle);
  const isFinance = /finance|accounting|akuntansi|pajak|tax|kasir|audit|keuangan/i.test(jobTitle);
  const isIT = /developer|engineer|programmer|software|it|devops|data|tech|frontend|backend|fullstack/i.test(jobTitle);
  const isMarketing = /marketing|sales|digital|seo|social media|content|brand|bisnis/i.test(jobTitle);
  const isOperations = /general affair|ga|operasional|facility|logistik|warehouse|supply|k3/i.test(jobTitle);

  const rawBuckets: { raw: string; category: ParsedAtsRequirement['category'] }[] = [];

  if (template?.kompetensi?.teknis) {
    template.kompetensi.teknis.forEach(r => rawBuckets.push({ raw: r, category: 'Hard Skills & Tools' }));
  }
  if ((template as any)?.kualifikasi?.keahlianTeknis) {
    (template as any).kualifikasi.keahlianTeknis.forEach((r: string) => rawBuckets.push({ raw: r, category: 'Hard Skills & Tools' }));
  }

  if (template?.kualifikasi?.pendidikan) {
    rawBuckets.push({ raw: template.kualifikasi.pendidikan, category: 'Kualifikasi & Sertifikasi' });
  }
  if (template?.kualifikasi?.sertifikasi && Array.isArray(template.kualifikasi.sertifikasi)) {
    template.kualifikasi.sertifikasi.forEach(r => rawBuckets.push({ raw: r, category: 'Kualifikasi & Sertifikasi' }));
  }
  if (template?.kualifikasi?.pengalaman) {
    rawBuckets.push({ raw: template.kualifikasi.pengalaman, category: 'Pengalaman' });
  }

  if (template?.kompetensi?.nonTeknis) {
    template.kompetensi.nonTeknis.forEach(r => rawBuckets.push({ raw: r, category: 'Soft Skills' }));
  }
  if ((template as any)?.kualifikasi?.kompetensiPerilaku) {
    (template as any).kualifikasi.kompetensiPerilaku.forEach((r: string) => rawBuckets.push({ raw: r, category: 'Soft Skills' }));
  }

  if (vacancy.atsBreakdown?.atsKeywords) {
    vacancy.atsBreakdown.atsKeywords.forEach(c => {
      let cat: ParsedAtsRequirement['category'] = 'Hard Skills & Tools';
      if (c.category === 'Soft Skills & Perilaku') cat = 'Soft Skills';
      else if (c.category === 'Administrasi & Sertifikasi') cat = 'Kualifikasi & Sertifikasi';
      
      c.keywords.forEach(kw => rawBuckets.push({ raw: kw, category: cat }));
    });
  }

  const structuredList: ParsedAtsRequirement[] = [];
  const seenLabels = new Set<string>();

  rawBuckets.forEach(({ raw, category }) => {
    const subTerms = cleanRawRequirementString(raw);

    subTerms.forEach(term => {
      const termLower = term.toLowerCase().trim();
      if (!termLower || termLower.length < 2) return;

      let displayLabel = term;
      const aliases: string[] = [termLower];

      // === DOMAIN-CALIBRATED SPECIFIC MAPPINGS ===

      // A. SERTIFIKASI PROFESI (Diutamakan / Terkait)
      if (termLower.includes('sertifikasi') || termLower.includes('sertifikat') || termLower.includes('certification') || termLower.includes('lisensi')) {
        displayLabel = 'Sertifikasi Profesi Terkait';
        if (isHR) {
          aliases.push(
            'sertifikasi human resource', 'sertifikasi hr', 'chrp', 'cphr', 'bnsp hr', 
            'certified hr', 'certified human resource', 'sertifikasi hrd', 'sertifikat human resource', 'sertifikat hr'
          );
        } else if (isFinance) {
          aliases.push('brevet', 'brevet a', 'brevet b', 'brevet c', 'cpa', 'cfa', 'ca', 'akuntan publik', 'bnsp akuntansi');
        } else if (isIT) {
          aliases.push('aws certified', 'azure certified', 'gcp certified', 'scrum master', 'ccna', 'ceh', 'comptia', 'google certified');
        } else if (isOperations) {
          aliases.push('ahli k3 umum', 'k3 umum', 'iso 9001', 'iso 45001', 'smk3', 'bnsp k3');
        } else {
          aliases.push('sertifikasi profesi', 'sertifikasi keahlian', 'lisensi profesi', 'bnsp');
        }
      }

      // B. PENGALAMAN KERJA SPESIFIK
      else if (termLower.includes('pengalaman') || termLower.includes('tahun') || termLower.includes('minimal')) {
        displayLabel = term.length > 35 ? `Pengalaman Bidang ${vacancy.jobTitle}` : term;
        if (isHR) {
          aliases.push('pengalaman hr', 'pengalaman hrd', 'pengalaman hris', 'pengalaman human resource', 'pengalaman personalia', 'hr specialist', 'hr officer');
        } else if (isFinance) {
          aliases.push('pengalaman finance', 'pengalaman accounting', 'pengalaman akuntansi', 'pengalaman pajak', 'finance specialist');
        } else if (isIT) {
          aliases.push('software engineer', 'web developer', 'pengalaman programmer', 'fullstack developer', 'frontend developer', 'backend developer');
        } else if (isMarketing) {
          aliases.push('digital marketer', 'sales executive', 'marketing specialist', 'pengalaman marketing', 'pengalaman sales');
        } else {
          aliases.push(termLower);
        }
      }

      // C. MICROSOFT OFFICE
      else if (termLower.includes('microsoft office') || termLower === 'ms office' || termLower === 'office') {
        displayLabel = 'Microsoft Office';
        aliases.push('microsoft office', 'ms office', 'ms. office', 'microsoft excel', 'microsoft word', 'ms excel', 'ms word', 'powerpoint', 'vlookup', 'pivot table');
      }

      // D. GOOGLE WORKSPACE
      else if (termLower.includes('google workspace') || termLower.includes('g suite') || termLower === 'gsuite') {
        displayLabel = 'Google Workspace';
        aliases.push('google workspace', 'g suite', 'gsuite', 'google docs', 'google sheets', 'google spreadsheet', 'google drive');
      }

      // E. SISTEM HRIS / HRMATRIX / ERP
      else if (termLower.includes('hrmatrix') || termLower.includes('hris')) {
        displayLabel = 'Sistem HRIS / HRMatrix';
        aliases.push('hrmatrix', 'hris', 'talenta', 'workday', 'sunfish', 'greatday', 'aplikasi hris', 'software hris', 'payroll system');
      }
      else if (termLower.includes('erp')) {
        displayLabel = 'Sistem ERP';
        aliases.push('sistem erp', 'software erp', 'sap erp', 'odoo erp', 'oracle erp', 'netsuite');
      }

      // F. PENGUASAAN TOOLS INDUSTRI (Strict tools matching, not generic words)
      else if (termLower.includes('tools industri') || termLower.includes('tools')) {
        displayLabel = 'Penguasaan Tools Industri';
        aliases.push('power bi', 'tableau', 'trello', 'jira', 'asana', 'canva', 'figma', 'sap', 'odoo', 'talenta');
      }

      // G. PROBLEM SOLVING
      else if (termLower.includes('problem solving') || termLower.includes('pemecahan masalah')) {
        displayLabel = 'Problem Solving';
        aliases.push('problem solving', 'pemecahan masalah', 'troubleshooting', 'analisis masalah', 'root cause analysis', 'solutif');
      }

      // H. ANALISIS DATA
      else if (termLower.includes('analisis data') || termLower.includes('data analysis') || termLower === 'analisa data') {
        displayLabel = 'Analisis Data';
        aliases.push('analisis data', 'data analysis', 'data analytic', 'data analyst', 'analisa data', 'olah data kuantitatif');
      }

      // I. REPORTING & DOCUMENTATION
      else if (termLower.includes('reporting') || termLower.includes('documentation') || termLower.includes('laporan') || termLower.includes('dokumentasi')) {
        displayLabel = 'Reporting & Dokumentasi';
        aliases.push('reporting & documentation', 'rekapitulasi laporan', 'dokumentasi kerja', 'penyusunan laporan', 'notulensi', 'berita acara');
      }

      // J. PROJECT MANAGEMENT
      else if (termLower.includes('project management') || termLower.includes('manajemen proyek')) {
        displayLabel = 'Project Management';
        aliases.push('project management', 'manajemen proyek', 'manajemen project', 'scrum', 'agile', 'trello', 'jira', 'asana', 'gantt chart');
      }

      // K. LEADERSHIP
      else if (termLower.includes('leadership') || termLower.includes('kepemimpinan') || termLower.includes('memimpin')) {
        displayLabel = 'Leadership & Kepemimpinan';
        aliases.push('leadership', 'kepemimpinan', 'team leader', 'supervisor', 'supervisi tim', 'koordinator tim', 'manager');
      }

      // L. KOMUNIKASI
      else if (termLower.includes('komunikasi') || termLower.includes('communication')) {
        displayLabel = 'Komunikasi Efektif';
        aliases.push('komunikasi efektif', 'effective communication', 'public speaking', 'presentasi', 'interpersonal skill', 'negosiasi');
      }

      // M. TEAMWORK
      else if (termLower.includes('teamwork') || termLower.includes('kerja sama') || termLower.includes('kerjasama') || termLower.includes('kolaborasi')) {
        displayLabel = 'Teamwork & Kolaborasi';
        aliases.push('teamwork', 'kerja sama tim', 'kerjasama tim', 'kolaborasi lintas', 'cross-functional', 'team player');
      }

      // N. ADAPTABILITAS
      else if (termLower.includes('adaptabilitas') || termLower.includes('adaptable') || termLower.includes('adaptasi')) {
        displayLabel = 'Adaptabilitas';
        aliases.push('adaptabilitas', 'adaptable', 'adaptasi cepat', 'kemampuan adaptasi', 'fast learner');
      }

      // O. PENDIDIKAN FORMAL
      else if (termLower.includes('s1') || termLower.includes('sarjana') || termLower.includes('bachelor')) {
        displayLabel = 'Pendidikan S1 / Sarjana';
        aliases.push('s1', 'sarjana', 'bachelor', 'strata 1', 'strata satu');
      }
      else if (termLower.includes('d3') || termLower.includes('diploma')) {
        displayLabel = 'Pendidikan D3 / Diploma';
        aliases.push('d3', 'diploma', 'ahli madya', 'diploma 3');
      }
      else if (termLower.includes('sma') || termLower.includes('smk') || termLower.includes('slta')) {
        displayLabel = 'Pendidikan SMA / SMK';
        aliases.push('smk', 'sma', 'slta', 'kejuruan');
      }
      else {
        displayLabel = term.charAt(0).toUpperCase() + term.slice(1);
        aliases.push(termLower);
      }

      const deduplicatedAliases = Array.from(new Set(aliases.map(a => a.trim().toLowerCase()))).filter(a => a.length >= 2);
      const labelKey = displayLabel.toLowerCase();

      if (!seenLabels.has(labelKey)) {
        seenLabels.add(labelKey);
        structuredList.push({
          id: `req-${structuredList.length + 1}`,
          displayLabel,
          category,
          isMatched: false,
          aliases: deduplicatedAliases
        });
      }
    });
  });

  return structuredList;
}

/**
 * Evaluates candidate's location/domicile fit against the job location.
 */
export function evaluateLocationFit(
  jobLocation: string,
  explicitAddress: string,
  workExps: CandidateWorkExperience[],
  fullText: string
): LocationEvaluation {
  // 1. Normalize job location
  const targetCities = INDONESIA_LOCATIONS.filter(city => jobLocation.toLowerCase().includes(city.name.toLowerCase()) || city.aliases?.some(a => jobLocation.toLowerCase().includes(a.toLowerCase())));
  const targetLoc = targetCities.length > 0 ? targetCities[0].name : jobLocation.trim();

  // 2. Identify Explicit Domicile
  const explicitCities = INDONESIA_LOCATIONS.filter(city => explicitAddress.toLowerCase().includes(city.name.toLowerCase()) || city.aliases?.some(a => explicitAddress.toLowerCase().includes(a.toLowerCase())));
  const explicitCity = explicitCities.length > 0 ? explicitCities[0].name : explicitAddress.trim();

  // 3. Identify Work History Locations
  const historyCities = workExps
    .map(exp => exp.location)
    .filter(loc => loc && loc !== 'Lokasi tidak tertera')
    .map(loc => {
       const match = INDONESIA_LOCATIONS.find(city => loc!.toLowerCase().includes(city.name.toLowerCase()) || city.aliases?.some(a => loc!.toLowerCase().includes(a.toLowerCase())));
       return match ? match.name : loc!;
    });
  
  const uniqueHistoryCities = [...new Set(historyCities)];

  // Additional text search for target city
  const textMentionsTarget = new RegExp(`\\b${targetLoc}\\b`, 'i').test(fullText);

  let status = 'Dipertimbangkan';
  let score = 50;
  let notes = '';

  const jabodetabek = ['jakarta', 'bogor', 'depok', 'tangerang', 'bekasi'];
  const isTargetJabodetabek = jabodetabek.some(j => targetLoc.toLowerCase().includes(j));
  const isExplicitJabodetabek = jabodetabek.some(j => explicitCity.toLowerCase().includes(j));
  const historyJabodetabek = uniqueHistoryCities.some(city => jabodetabek.some(j => city.toLowerCase().includes(j)));

  if (!jobLocation || jobLocation.toLowerCase() === 'remote' || jobLocation.toLowerCase() === 'wfh') {
     score = 100;
     status = 'Sangat Sesuai';
     notes = 'Lokasi penempatan fleksibel (Remote/WFH).';
  } 
  else if (explicitCity.toLowerCase() === targetLoc.toLowerCase() || targetLoc.toLowerCase().includes(explicitCity.toLowerCase()) || explicitCity.toLowerCase().includes(targetLoc.toLowerCase())) {
     score = 100;
     status = 'Sangat Sesuai';
     notes = `Domisili eksplisit kandidat (${explicitCity}) sesuai dengan lokasi penempatan (${targetLoc}).`;
  }
  else if (uniqueHistoryCities.some(city => city.toLowerCase() === targetLoc.toLowerCase() || city.toLowerCase().includes(targetLoc.toLowerCase()))) {
     score = 85;
     status = 'Sesuai';
     notes = `Domisili eksplisit berbeda, namun kandidat memiliki riwayat kerja nyata di lokasi penempatan (${targetLoc}).`;
  }
  else if (explicitCity === 'Tidak terdeteksi' && uniqueHistoryCities.length > 0) {
     score = 65;
     status = 'Dipertimbangkan';
     notes = `Domisili saat ini tidak tercantum eksplisit. Lokasi riwayat kerja: ${uniqueHistoryCities.join(', ')}.`;
  }
  else if (isTargetJabodetabek && isExplicitJabodetabek) {
     score = 75;
     status = 'Sesuai';
     notes = `Kandidat berdomisili di ${explicitCity}, yang masih dalam area Jabodetabek sesuai lokasi penempatan (${targetLoc}).`;
  }
  else if (isTargetJabodetabek && historyJabodetabek) {
     score = 70;
     status = 'Sesuai';
     notes = `Kandidat memiliki riwayat kerja di area Jabodetabek, sejalan dengan lokasi penempatan (${targetLoc}).`;
  }
  else if (explicitCity !== 'Tidak terdeteksi' && textMentionsTarget) {
     score = 60;
     status = 'Dipertimbangkan';
     notes = `Domisili utama di ${explicitCity}, namun CV menyebutkan nama daerah ${targetLoc}. Mungkin bersedia relokasi.`;
  }
  else if (explicitCity !== 'Tidak terdeteksi') {
     score = 25;
     status = 'Jauh / Tidak Sesuai';
     notes = `Domisili kandidat (${explicitCity}) jauh dari lokasi penempatan (${targetLoc}) tanpa adanya riwayat kerja di area tersebut.`;
  }
  else {
     score = 50;
     status = 'Dipertimbangkan';
     notes = 'Data domisili dan lokasi riwayat kerja tidak dapat diverifikasi secara spesifik dari CV.';
  }

  return {
     status: status as any,
     matchPercentage: score,
     candidateExplicitLocation: explicitCity,
     inferredLocationFromHistory: uniqueHistoryCities,
     notes
  };
}

/**
 * Helper to extract accurate, centered evidence snippets from candidate CV
 * Prioritizes work experience bullets, achievements, and professional summaries
 * Strictly filters out contact headers, emails, phone numbers, and portfolio links
 */
export function findBestEvidenceSnippet(
  candidateText: string,
  matchedTerms: string[],
  parsedExperiences: CandidateWorkExperience[] = [],
  achievements: (CandidateAchievement | string)[] = [],
  summary: string = ''
): string | undefined {
  if (!matchedTerms || matchedTerms.length === 0) return undefined;

  const candidateSnippets: { text: string; score: number; isExp: boolean }[] = [];

  // 1. Collect bullet points from structured work experiences (highest priority)
  if (parsedExperiences && parsedExperiences.length > 0) {
    for (const exp of parsedExperiences) {
      if (Array.isArray(exp.description)) {
        for (const line of exp.description) {
          if (line && typeof line === 'string' && line.trim().length > 12) {
            candidateSnippets.push({ text: line.trim(), score: 15, isExp: true });
          }
        }
      }
    }
  }

  // 2. Collect achievements
  if (achievements && achievements.length > 0) {
    for (const ach of achievements) {
      if (!ach) continue;
      const text = typeof ach === 'string' ? ach.trim() : (ach.title || ach.description || '').trim();
      if (text && text.length > 12) {
        candidateSnippets.push({ text, score: 12, isExp: true });
      }
    }
  }

  // 3. Collect summary sentences
  if (summary && summary.length > 15) {
    const summarySentences = summary.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
    for (const sentence of summarySentences) {
      candidateSnippets.push({ text: sentence, score: 8, isExp: false });
    }
  }

  // 4. Collect lines from raw candidate text, strictly filtering out contact/header lines
  const rawLines = candidateText
    .split(/\r?\n+/)
    .map(l => l.trim())
    .filter(l => l.length > 15);

  for (const line of rawLines) {
    // Skip contact header / personal biodata / social media lines
    if (/@|\+62|08\d{8,}|linkedin\.com|github\.com|portfolio|instagram\.com|jalan|jl\.|rt\/rw|kelurahan|kecamatan/i.test(line)) {
      continue;
    }
    // Skip pure section titles or very short non-action words
    if (/^(pengalaman|riwayat|pendidikan|keahlian|skills|summary|ringkasan|achievements|prestasi|sertifikasi|bahasa|kontak|profil|contact|work experience|education)$/i.test(line)) {
      continue;
    }
    // Avoid duplicates
    if (!candidateSnippets.some(s => s.text === line)) {
      candidateSnippets.push({ text: line, score: 2, isExp: false });
    }
  }

  // 5. Score each snippet based on matched terms frequency, length, and exact phrase match
  let bestCandidate: { text: string; score: number } | null = null;
  const termsLower = matchedTerms.map(t => t.toLowerCase()).filter(t => t.length >= 3);

  for (const item of candidateSnippets) {
    const textLower = item.text.toLowerCase();
    let score = item.score;
    let hitCount = 0;

    for (const term of termsLower) {
      if (textLower.includes(term)) {
        hitCount++;
        score += 10;
        // Extra boost if term appears as whole word
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        if (regex.test(textLower)) {
          score += 5;
        }
      }
    }

    if (hitCount > 0) {
      item.score = score;
      if (!bestCandidate || item.score > bestCandidate.score) {
        bestCandidate = item;
      }
    }
  }

  if (!bestCandidate) return undefined;

  let snippet = bestCandidate.text;
  if (snippet.length > 175) {
    // Find the first matched term position to center the snippet
    const snippetLower = snippet.toLowerCase();
    let firstIndex = -1;
    for (const term of termsLower) {
      const idx = snippetLower.indexOf(term);
      if (idx !== -1 && (firstIndex === -1 || idx < firstIndex)) {
        firstIndex = idx;
      }
    }

    if (firstIndex > 40) {
      const start = Math.max(0, firstIndex - 30);
      const end = Math.min(snippet.length, start + 165);
      snippet = (start > 0 ? '...' : '') + snippet.slice(start, end).trim() + (end < snippet.length ? '...' : '');
    } else {
      snippet = `${snippet.slice(0, 165)}...`;
    }
  }

  return snippet;
}

/**
 * Deep ATS Candidate-to-Jobdesk Verifiable Matching Engine
 * Membandingkan Tugas & Tanggung Jawab, Keahlian Teknis, Kualifikasi, dan Soft Skills
 * Dilengkapi Core Domain Relevance Gate untuk Mencegah Skor Melambung pada Pelamar Lintas Bidang
 */
export function evaluateCandidateAgainstVacancy(
  vacancy: VacancyItem,
  candidateText: string
): AtsMatchBreakdown {
  const textLower = (candidateText || '').toLowerCase();
  const template = vacancy.rawJobTemplate;

  // Extract structured experiences early for high-precision evidence matching
  const { experiences, summary: expSummary } = extractWorkExperiences(candidateText);
  const achievements = extractAchievements(candidateText);
  const summaryBullets = cleanExecutiveSummary(extractSummary(candidateText), candidateText);
  const candidateSummary = summaryBullets.join(' ');

  // 1. CORE DOMAIN ANCHORS RELEVANCE CHECK
  const domainAnchors = getDomainAnchors(vacancy);
  const matchedDomainAnchors = domainAnchors.filter(anchor => textLower.includes(anchor));
  const domainMatchCount = matchedDomainAnchors.length;

  // 2. GATHER ALL DUTIES / TUGAS & TANGGUNG JAWAB
  let rawDuties: string[] = [];
  if (template?.tanggungJawab && template.tanggungJawab.length > 0) {
    rawDuties = template.tanggungJawab;
  } else if ((template as any)?.tanggungJawabUtama && (template as any).tanggungJawabUtama.length > 0) {
    rawDuties = (template as any).tanggungJawabUtama;
  } else if (template?.fungsiUtama && template.fungsiUtama.length > 0) {
    rawDuties = template.fungsiUtama;
  } else if (vacancy.atsBreakdown?.coreResponsibilities && vacancy.atsBreakdown.coreResponsibilities.length > 0) {
    rawDuties = vacancy.atsBreakdown.coreResponsibilities;
  } else if (vacancy.atsBreakdown?.roleSummary) {
    rawDuties = [vacancy.atsBreakdown.roleSummary];
  } else {
    rawDuties = [`Menjalankan operasional posisi ${vacancy.jobTitle} secara profesional dan terukur.`];
  }

  const cleanDuties = Array.from(new Set(rawDuties.map(d => d.trim()))).filter(d => d.length > 5);

  // 3. MATCH EACH DUTY AGAINST CV WITH STRICT DOMAIN PHRASE CRITERIA
  const matchedResponsibilities: MatchedResponsibility[] = cleanDuties.map(duty => {
    // Extract non-stopword significant terms
    const words = duty
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 4 && !STOPWORDS.has(w));

    // Extract 2-word domain phrases from duty
    const phrases: string[] = [];
    for (let i = 0; i < words.length - 1; i++) {
      phrases.push(`${words[i]} ${words[i + 1]}`);
    }

    const matchedTerms: string[] = [];

    // Check phrases first
    for (const phrase of phrases) {
      if (textLower.includes(phrase) && !matchedTerms.includes(phrase)) {
        matchedTerms.push(phrase);
      }
    }

    // Check individual keywords
    for (const word of words) {
      if (textLower.includes(word) && !matchedTerms.includes(word)) {
        matchedTerms.push(word);
      }
    }

    const bestSnippet = findBestEvidenceSnippet(candidateText, matchedTerms, experiences, achievements, candidateSummary);

    let confidence: 'Tinggi' | 'Sedang' | 'Belum Terdeteksi' = 'Belum Terdeteksi';
    let isMatched = false;

    // High confidence: Phrase matched OR >= 2 distinct domain terms found
    if (phrases.some(p => textLower.includes(p)) || matchedTerms.length >= 2) {
      confidence = 'Tinggi';
      isMatched = true;
    } else if (matchedTerms.length === 1 && domainMatchCount >= 2) {
      // Medium only if candidate is legitimately in the domain
      confidence = 'Sedang';
      isMatched = true;
    }

    return {
      duty,
      isMatched,
      matchConfidence: confidence,
      matchedKeywords: matchedTerms,
      matchedContext: bestSnippet
    };
  });

  const totalDutiesCount = matchedResponsibilities.length;
  const highMatchCount = matchedResponsibilities.filter(r => r.matchConfidence === 'Tinggi').length;
  const mediumMatchCount = matchedResponsibilities.filter(r => r.matchConfidence === 'Sedang').length;
  const matchedDutiesCount = highMatchCount + mediumMatchCount;

  // Responsibilities score: High = 1.0, Medium = 0.5, Low = 0
  const responsibilitiesScore = totalDutiesCount > 0
    ? Math.min(100, Math.round(((highMatchCount * 1.0 + mediumMatchCount * 0.50) / totalDutiesCount) * 100))
    : 0;

  // 4. STRUCTURED REQUIREMENTS EVALUATION
  const structuredReqs = buildStructuredRequirements(vacancy);

  structuredReqs.forEach(req => {
    for (const alias of req.aliases) {
      if (textLower.includes(alias)) {
        req.isMatched = true;
        req.matchedAlias = alias;
        req.matchedContext = findBestEvidenceSnippet(candidateText, [alias], experiences, achievements, candidateSummary);
        break;
      }
    }
  });

  // 5. WORK HISTORY & EXPERIENCE TENURE EVALUATION
  const experienceEvaluation = evaluateExperienceRequirement(vacancy, expSummary);

  const techReqs = structuredReqs.filter(r => r.category === 'Hard Skills & Tools');
  const matchedTechReqs = techReqs.filter(r => r.isMatched);
  const technicalSkillsScore = techReqs.length > 0
    ? Math.round((matchedTechReqs.length / techReqs.length) * 100)
    : 0;

  const qualReqs = structuredReqs.filter(r => r.category === 'Kualifikasi & Sertifikasi' || r.category === 'Pengalaman');
  const matchedQualReqs = qualReqs.filter(r => r.isMatched);
  
  // Calculate Qualifications score taking into account Education/Certifications (50%) + Masa Kerja Evaluation (50%)
  let qualificationsScore = 0;
  if (qualReqs.length > 0) {
    const baseQualScore = Math.round((matchedQualReqs.length / qualReqs.length) * 100);
    qualificationsScore = Math.round(baseQualScore * 0.50 + experienceEvaluation.matchPercentage * 0.50);
  } else {
    qualificationsScore = experienceEvaluation.matchPercentage;
  }

  const softReqs = structuredReqs.filter(r => r.category === 'Soft Skills');
  const matchedSoftReqs = softReqs.filter(r => r.isMatched);
  const softSkillsScore = softReqs.length > 0
    ? Math.round((matchedSoftReqs.length / softReqs.length) * 100)
    : 0;

  // 6. LOCATION / DOMICILE EVALUATION
  const candidateAddress = extractAddress(candidateText);
  const locationEvaluation = evaluateLocationFit(vacancy.location || '', candidateAddress, experiences, candidateText);
  const locationScore = locationEvaluation.matchPercentage;

  // 7. BASE WEIGHTED ATS SCORE (NEW WEIGHTS)
  // Responsibilities (30%), Tech (25%), Location (20%), Quals (15%), Soft (10%)
  let rawWeightedScore = Math.round(
    responsibilitiesScore * 0.30 +
    technicalSkillsScore * 0.25 +
    locationScore * 0.20 +
    qualificationsScore * 0.15 +
    softSkillsScore * 0.10
  );

  // 8. DOMAIN RELEVANCE CALIBRATION / ANTI-INFLATION FILTER
  // If the candidate's CV has zero or minimal domain relevance to the target job title,
  // we gate/scale the score so unrelated profiles do not get falsely inflated scores (e.g. 50%+).
  let totalScore = rawWeightedScore;

  // STRONG GATING: Fundamental role fit (Responsibilities & Tech Skills)
  // These two pillars hold 55% of the weight combined. If a candidate doesn't even hit a minimum threshold,
  // it means they fundamentally lack the core capability to do the job (regardless of location/soft skills).
  const coreFitnessAvg = (responsibilitiesScore + technicalSkillsScore) / 2;

  if (coreFitnessAvg < 20) {
    // Fundamentally unqualified for the core tasks (Sangat Rendah)
    totalScore = Math.min(25, Math.round(rawWeightedScore * 0.30)); 
  } else if (coreFitnessAvg < 35) {
    // Weak core fitness (Tidak memenuhi standar dasar)
    totalScore = Math.min(45, Math.round(rawWeightedScore * 0.60));
  } else if (domainMatchCount === 0) {
    // Completely unrelated field: cap score at max 18% (clearly indicating Low Fit / Tidak Sesuai Bidang)
    totalScore = Math.min(18, Math.round(rawWeightedScore * 0.20));
  } else if (domainMatchCount === 1) {
    // Minor / tangential mention: cap score at max 40%
    totalScore = Math.min(40, Math.round(rawWeightedScore * 0.50));
  } else if (domainMatchCount === 2 && coreFitnessAvg < 50) {
    // Moderate domain relevance but weak functional match: cap score at max 65%
    totalScore = Math.min(65, Math.round(rawWeightedScore * 0.80));
  }
  // If coreFitnessAvg >= 35 and domainMatchCount >= 3, full genuine score allowed!

  const matchedKeywordsList = structuredReqs.filter(r => r.isMatched).map(r => r.displayLabel);
  const missingKeywordsList = structuredReqs.filter(r => !r.isMatched).map(r => r.displayLabel);

  // 9. POTENTIAL & CANDIDATE TRAJECTORY ANALYSIS
  const educationHistory = extractEducationHistory(candidateText);
  const certifications = extractCertifications(candidateText);

  const potentialAnalysis = analyzeCandidatePotential(
    candidateText,
    vacancy,
    experiences,
    educationHistory,
    certifications,
    achievements
  );

  return {
    totalScore,
    responsibilitiesScore,
    technicalSkillsScore,
    locationScore,
    qualificationsScore,
    softSkillsScore,
    responsibilities: matchedResponsibilities,
    matchedKeywords: matchedKeywordsList,
    missingKeywords: missingKeywordsList,
    structuredRequirements: structuredReqs,
    experienceEvaluation,
    locationEvaluation,
    potentialAnalysis,
    totalDutiesCount,
    matchedDutiesCount
  };
}
