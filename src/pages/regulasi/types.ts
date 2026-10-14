export type RegulationMainTab = 'peraturan_perusahaan' | 'undang_undang' | 'standar_iso';

export type RegulationCategory = 
  | 'ALL'
  | 'KONTRAK_PKWT_PKWTT'
  | 'KOMPENSASI_PESANGON'
  | 'SURAT_PERINGATAN_DISIPLIN'
  | 'JAM_KERJA_LEMBUR'
  | 'PENGUPAHAN_THR'
  | 'BPJS_JAMINAN_SOSIAL'
  | 'CUTI_ISTIRAHAT_IZIN';

export interface LegalArticle {
  number: string; // e.g. "Pasal 15 ayat (1)"
  title: string;
  summary: string;
  fullText: string;
  importantNote?: string;
  practicalHRTip?: string;
}

export interface RegulationItem {
  id: string;
  code: string; // e.g. "PP-35-2021"
  title: string;
  lawBasis: string; // e.g. "Peraturan Pemerintah No. 35 Tahun 2021"
  category: RegulationCategory;
  categoryLabel: string;
  tags: string[];
  lastUpdated: string;
  summary: string;
  keyPoints: string[];
  articles: LegalArticle[];
  penaltiesOrRisks?: string;
  calculatorType?: 'pkwt_compensation' | 'severance' | 'overtime' | 'bpjs';
}

// -------------------------------------------------------------
// TYPES FOR PERATURAN PERUSAHAAN (COMPANY REGULATIONS / HANDBOOK)
// -------------------------------------------------------------
export interface CompanyRegulationArticle {
  number: number; // e.g. 1, 2, 3
  title: string; // e.g. "Pengertian dan Istilah"
  content: string; // Full draft text
  legalReference?: string; // e.g. "UU No. 13/2003 Pasal 1"
  hrImplementationNote?: string;
}

export interface CompanyRegulationChapter {
  id: string; // e.g. "bab-1"
  chapterNumber: string; // e.g. "BAB I"
  title: string; // e.g. "KETENTUAN UMUM"
  description: string;
  articles: CompanyRegulationArticle[];
}

// -------------------------------------------------------------
// TYPES FOR STANDAR ISO (INTERNATIONAL STANDARDS FOR HR & ORG)
// -------------------------------------------------------------
export type IsoDomainCategory = 
  | 'ALL'
  | 'MUTU_OPERASIONAL'
  | 'K3_LINGKUNGAN'
  | 'KEAMANAN_DATA_ETIKA'
  | 'HRM_TALENT_DIVERSITY'
  | 'KELANGSUNGAN_BISNIS';

export interface IsoStandardClause {
  number: string; // e.g. "Klausul 7.2"
  name: string; // e.g. "Kompetensi (Competence)"
  requirement: string;
  hrAction: string;
}

export interface IsoStandardItem {
  id: string;
  code: string; // e.g. "ISO 9001:2015"
  name: string;
  indonesianTitle: string;
  domain: IsoDomainCategory;
  domainLabel: string;
  badgeColor: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'indigo';
  summary: string;
  hrRelevance: string;
  benefits: string[];
  keyClauses: IsoStandardClause[];
  auditChecklist: string[];
  practicalTips: string;
}
