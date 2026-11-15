/**
 * Standar Jenis Sertifikasi & Lisensi Profesi
 * Sumber acuan global untuk sertifikasi keahlian teknis, profesional, keselamatan kerja, dan lisensi resmi.
 * Digunakan sebagai pilihan acuan combobox dalam kualifikasi posisi (job desk).
 */

import { ComboboxOption } from '../../components/ui/ComboboxInput';

export const STANDARD_CERTIFICATIONS = [
  // Keselamatan, Kesehatan Kerja & Lingkungan (K3 / HSE)
  'Sertifikasi Ahli K3 Umum (Kemenaker RI)',
  'Sertifikasi Ahli K3 Spesialis (Kimia / Listrik / Konstruksi)',
  'Sertifikasi Auditor SMK3 (Sistem Manajemen K3)',
  'Sertifikasi Pengawas Operasional Pertama (POP Pertambangan)',
  'Sertifikasi Pengawas Operasional Madya (POM Pertambangan)',
  'Sertifikasi Basic Sea Survival (BSS / BST)',
  'Sertifikasi First Aid & CPR (P3K Bersertifikat)',

  // Sistem Manajemen, Mutu & Standar Internasional (ISO)
  'Sertifikasi Lead Auditor ISO 9001 (Quality Management)',
  'Sertifikasi Lead Auditor ISO 14001 (Environmental Management)',
  'Sertifikasi Lead Auditor ISO 45001 (OH&S Management)',
  'Sertifikasi Lead Auditor ISO 27001 (Information Security)',
  'Sertifikasi ISO 22000 / HACCP (Food Safety Management)',
  'Sertifikasi Lean Six Sigma Green Belt',
  'Sertifikasi Lean Six Sigma Black Belt',

  // Teknologi Informasi, Cloud, Data & Cyber Security
  'AWS Certified Solutions Architect',
  'Google Cloud Professional Cloud Architect',
  'Microsoft Certified: Azure Solutions Architect',
  'Cisco Certified Network Associate (CCNA)',
  'Certified Ethical Hacker (CEH)',
  'Certified Information Systems Security Professional (CISSP)',
  'CompTIA Security+ / Network+',
  'Professional Scrum Master (PSM / CSM)',
  'Project Management Professional (PMP - PMI)',
  'ITIL 4 Foundation (IT Service Management)',
  'Certified Data Analyst / Google Data Analytics',

  // Keuangan, Akuntansi, Pajak & Perbankan
  'Sertifikasi Brevet Pajak A & B',
  'Sertifikasi Brevet Pajak C',
  'Certified Public Accountant (CPA Indonesia)',
  'Chartered Accountant (CA Indonesia)',
  'Chartered Financial Analyst (CFA Level I/II/III)',
  'Certified Financial Planner (CFP)',
  'Wakil Manajer Investasi (WMI) / WPEE OJK',
  'Sertifikasi Manajemen Risiko Perbankan (BSMR Level 1-5)',
  'Qualified Internal Auditor (QIA)',

  // Manajemen SDM, Hukum, Pengadaan & Operasional
  'Certified Human Resource Professional (CHRP)',
  'Sertifikasi BNSP Bidang Manajemen SDM / HR',
  'Sertifikasi Keahlian Pengadaan Barang & Jasa (LKPP)',
  'Pendidikan Khusus Profesi Advokat (PKPA / PERADI)',
  'Ahli Kepabeanan / PPJK (Bea Cukai)',
  'Sertifikasi Supply Chain Management (CSCP / CPIM - APICS)',
  'Sertifikasi Manajemen Logistik BNSP',

  // Bahasa & Komunikasi Internasional
  'TOEFL ITP / iBT (Skor Minimal 500+ / 550+)',
  'IELTS Official (Skor Minimal Band 6.5+)',
  'TOEIC Official (Skor Minimal 750+)',
  'Japanese-Language Proficiency Test (JLPT N1 / N2 / N3)',
  'Hanyu Shuiping Kaoshi (HSK Level 4 / 5 / 6)'
] as const;

export type StandardCertification = (typeof STANDARD_CERTIFICATIONS)[number] | string;

/**
 * Pre-formatted Combobox Options untuk zero-latency lookup
 */
export const CERTIFICATION_COMBOBOX_OPTIONS: ComboboxOption[] = STANDARD_CERTIFICATIONS.map((cert) => ({
  value: cert,
  label: cert,
  sublabel: 'Sertifikasi / Lisensi Standar'
}));
