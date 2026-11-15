/**
 * Standar Kompetensi: Hard Skills (Teknis) & Soft Skills (Non-Teknis)
 * Sumber acuan komprehensif untuk pengisian kompetensi posisi (job desk).
 * Mendukung lookup cepat via combobox dan kustomisasi fleksibel.
 */

import { ComboboxOption } from '../../components/ui/ComboboxInput';

/**
 * Standar Hard Skills (Kompetensi Teknis)
 */
export const STANDARD_HARD_SKILLS = [
  // Rekayasa Perangkat Lunak & Teknologi Informasi
  'Software Architecture & System Design',
  'Full-Stack Web Development',
  'Mobile App Development (React Native / Flutter / Android / iOS)',
  'RESTful API & GraphQL Development',
  'Microservices Architecture',
  'Git Version Control & Code Review',
  'CI/CD Pipeline & DevOps Automation',
  'Cloud Infrastructure (AWS / GCP / Azure)',
  'Cybersecurity & Vulnerability Assessment',
  'Database Management (PostgreSQL / MySQL / MongoDB / Redis)',
  'Containerization (Docker & Kubernetes)',

  // Data, Analisis & Artificial Intelligence
  'Analisis Data & Statistik Bisnis',
  'SQL Querying & Data Warehousing',
  'Python / R untuk Data Science',
  'Microsoft Excel Advanced (VLOOKUP, Pivot, Macro/VBA)',
  'Data Visualization (Power BI / Tableau / Looker Studio)',
  'Machine Learning & Predictive Modeling',
  'Financial Modeling & Forecasting',
  'Google Analytics 4 & Web Tracking',

  // Desain, Kreatif & Produk
  'UI/UX Design & Wireframing (Figma / Adobe XD)',
  'Design System & User Research',
  'Adobe Creative Suite (Photoshop / Illustrator / InDesign)',
  'Video Editing & Motion Graphic (Premiere Pro / After Effects)',
  'Copywriting & Content Strategy',
  '3D Modeling & CAD (AutoCAD / SolidWorks)',

  // Pemasaran, Penjualan & Komersial
  'Digital Marketing Strategy (Meta Ads, Google Ads, TikTok Ads)',
  'Search Engine Optimization (SEO) & SEM',
  'Social Media Management & Community Engagement',
  'B2B Sales Pipeline & Enterprise Account Management',
  'Customer Relationship Management (CRM Tools)',
  'Market Research & Competitor Analysis',
  'Brand Management & Campaign Execution',

  // Operasional, Supply Chain & Manufaktur
  'Supply Chain Management & Logistics Flow',
  'Inventory Control & Warehouse Management Systems (WMS)',
  'Procurement & Strategic Vendor Sourcing',
  'Quality Assurance (QA) & Quality Control (QC)',
  'Preventive & Corrective Maintenance Mesin',
  'Troubleshooting Sistem Elektrikal & Mekanikal',
  'PLC Programming & Otomasi Industri',
  'Implementasi K3 & Penilaian Risiko (HIRADC)',

  // Keuangan, Akuntansi, Pajak & Legal
  'Penyusunan Laporan Keuangan (PSAK / IFRS)',
  'Rekonsiliasi Bank & General Ledger',
  'Manajemen Arus Kas (Cash Flow Management)',
  'Perhitungan & Pelaporan Pajak (PPh 21, 23, Final, PPN)',
  'Penganggaran & Cost Control (Budgeting)',
  'Internal Audit & Fraud Investigation',
  'Legal Drafting, Review Kontrak & Kepatuhan Hukum'
] as const;

export type StandardHardSkill = (typeof STANDARD_HARD_SKILLS)[number] | string;

/**
 * Pre-formatted Combobox Options untuk Hard Skills
 */
export const HARD_SKILL_COMBOBOX_OPTIONS: ComboboxOption[] = STANDARD_HARD_SKILLS.map((skill) => ({
  value: skill,
  label: skill,
  sublabel: 'Kompetensi Teknis (Hard Skill)'
}));

/**
 * Standar Soft Skills (Kompetensi Non-Teknis)
 */
export const STANDARD_SOFT_SKILLS = [
  // Kepemimpinan & Manajemen Tim
  'Leadership & People Management',
  'Strategic Thinking & Visionary Planning',
  'Pengambilan Keputusan (Decision Making)',
  'Coaching, Mentoring & People Development',
  'Delegasi Efektif & Pemberdayaan Tim',
  'Manajemen Perubahan (Change Management)',

  // Komunikasi & Hubungan Interpersonal
  'Komunikasi Efektif & Asertif',
  'Public Speaking & Presentasi Bisnis',
  'Negosiasi & Mediasi Konflik',
  'Mendengarkan Aktif (Active Listening)',
  'Kolaborasi Tim & Kerja Sama Antar-Fungsi (Teamwork)',
  'Kecerdasan Emosional (Emotional Intelligence / EQ)',
  'Orientasi Pelayanan Pelanggan (Customer-Centric Mindset)',

  // Pemecahan Masalah & Berpikir Kritis
  'Problem Solving & Root Cause Analysis',
  'Berpikir Kritis (Critical Thinking)',
  'Kreativitas & Inovasi Solusi',
  'Berpikir Analitis & Berbasis Data',
  'Adaptabilitas & Kemampuan Belajar Cepat (Agility)',

  // Produktivitas, Karakter & Integritas Kerja
  'Manajemen Waktu & Penetapan Prioritas (Time Management)',
  'Integritas Tinggi & Etika Profesional',
  'Ketelitian Tinggi & Detail-Oriented',
  'Inisiatif Tinggi & Proaktif',
  'Ketahanan Mental & Manajemen Stres (Resilience Under Pressure)',
  'Rasa Memiliki Tinggi (Sense of Ownership & Accountability)',
  'Disiplin Kerja & Komitmen Terhadap Target (Result-Driven)'
] as const;

export type StandardSoftSkill = (typeof STANDARD_SOFT_SKILLS)[number] | string;

/**
 * Pre-formatted Combobox Options untuk Soft Skills
 */
export const SOFT_SKILL_COMBOBOX_OPTIONS: ComboboxOption[] = STANDARD_SOFT_SKILLS.map((skill) => ({
  value: skill,
  label: skill,
  sublabel: 'Kompetensi Non-Teknis (Soft Skill)'
}));
