import { TestPackage, TestQuestion } from './types';
import { getAllUnifiedQuestions } from './banks';

// ID & Slug untuk Asesmen Terpadu Satu Kesatuan
export const UNIFIED_PACKAGE_ID = 'unified-assessment';
export const UNIFIED_PACKAGE_SLUG = 'terpadu';

// 1. Paket Terpadu (25 Soal Default)
const defaultSelectedIds = [
  'disc-q1', 'disc-q2', 'disc-q3', 'disc-q4', 'disc-q5', 'disc-q6', 'disc-q7', 'disc-q8', 'disc-q9', 'disc-q10', 'disc-q11', 'disc-q12',
  'cog-1', 'cog-2', 'cog-3', 'cog-4', 'cog-5',
  'sjt-1', 'sjt-2', 'sjt-3', 'sjt-4',
  'eng-1', 'eng-2',
  'ldr-1', 'ldr-2'
];

// 2. Paket Management Trainee (20 Soal)
const mtSelectedIds = [
  'disc-q1', 'disc-q2', 'disc-q3', 'disc-q4', 'disc-q5', 'disc-q6', 'disc-q7', 'disc-q8',
  'cog-1', 'cog-2', 'cog-3', 'cog-4',
  'ldr-1', 'ldr-2', 'ldr-3', 'ldr-4',
  'sjt-1', 'sjt-2', 'sjt-3', 'sjt-4'
];

// 3. Paket IT & Engineering (18 Soal)
const itSelectedIds = [
  'cog-1', 'cog-2', 'cog-3', 'cog-4', 'cog-5', 'cog-6', 'cog-7', 'cog-8',
  'disc-q1', 'disc-q2', 'disc-q3', 'disc-q4',
  'sjt-1', 'sjt-2', 'sjt-3', 'sjt-4',
  'eng-1', 'eng-2'
];

// 4. Paket Sales & Business Development (18 Soal)
const salesSelectedIds = [
  'disc-q1', 'disc-q2', 'disc-q3', 'disc-q4', 'disc-q5', 'disc-q6', 'disc-q7', 'disc-q8',
  'sjt-1', 'sjt-2', 'sjt-3', 'sjt-4',
  'eng-1', 'eng-2', 'eng-3', 'eng-4',
  'cog-1', 'cog-2'
];

// 5. Paket Administrasi & Operasional (15 Soal)
const adminSelectedIds = [
  'sjt-1', 'sjt-2', 'sjt-3', 'sjt-4', 'sjt-5',
  'cog-1', 'cog-2', 'cog-3', 'cog-4',
  'disc-q1', 'disc-q2', 'disc-q3', 'disc-q4',
  'eng-1', 'eng-2'
];

function buildPackageQuestions(selectedIds: string[]): TestQuestion[] {
  const all = getAllUnifiedQuestions();
  const selectedSet = new Set(selectedIds);
  const selected = all.filter(q => selectedSet.has(q.id));
  return (selected.length > 0 ? selected : all.slice(0, selectedIds.length)).map((q, idx) => ({
    ...q,
    number: idx + 1
  }));
}

export function getUnifiedDefaultQuestions(): TestQuestion[] {
  return buildPackageQuestions(defaultSelectedIds);
}

export const unifiedAssessmentPackage: TestPackage = {
  id: UNIFIED_PACKAGE_ID,
  slug: UNIFIED_PACKAGE_SLUG,
  title: 'Asesmen Komprehensif Terpadu Calon Karyawan',
  category: 'comprehensive',
  categoryLabel: 'Asesmen Terpadu & Holistik',
  shortDescription: 'Evaluasi menyeluruh mencakup Psikotes Karakter Kerja (DISC), Penalaran Kognitif, Etika Situasional (SJT), Bahasa Inggris Bisnis, dan Kepemimpinan.',
  fullDescription: 'Instrumen evaluasi terpadu standar HRMatrix yang dirancang untuk mengukur kapabilitas calon karyawan secara objektif dan terukur. Mencakup instrumen Psikotes DISC (Ipsative Kuadran D-I-S-C) serta Pilihan Ganda 4 Opsi untuk Penalaran Logika TPA, Dilema Etika Situasional SJT, Bahasa Inggris Bisnis, dan Kepemimpinan Manajerial.',
  durationMinutes: 45,
  totalQuestions: 25,
  difficulty: 'Semua Level',
  targetAudience: 'Semua level calon karyawan & staf (Entry level, Spesialis, Supervisor, hingga Manajer)',
  measuringPoints: [
    'Profil Kepribadian & Respon Tekanan Kerja (DISC)',
    'Kapasitas Kognitif, Pola Deret & Logika Analitis (TPA)',
    'Integritas Moral & Kepatuhan SOP Kerja (SJT)',
    'Kemahiran Komunikasi & Korespondensi Bahasa Inggris Bisnis',
    'Kepemimpinan, Manajemen Krisis & Akuntabilitas Tim (Leadership)'
  ],
  instructions: [
    'Asesmen ini merupakan satu kesatuan utuh yang menguji berbagai dimensi kerja secara terintegrasi.',
    'Pada bagian Psikotes DISC, pilihlah 1 sifat yang PALING menggambarkan dan 1 sifat yang PALING TIDAK menggambarkan diri Anda.',
    'Pada bagian Logika, Etika, Bahasa Inggris, dan Kepemimpinan, pilihlah 1 jawaban terbaik dari 4 pilihan yang tersedia (A, B, C, D).',
    'Jawaban Anda tersimpan otomatis setiap kali Anda memilih.',
    'Kerjakan secara mandiri, jujur, dan optimalkan alokasi waktu yang tersedia.'
  ],
  questions: getUnifiedDefaultQuestions(),
  questionBank: getAllUnifiedQuestions()
};

export const managementTraineePackage: TestPackage = {
  id: 'pkg-mt-leadership',
  slug: 'mt-leadership',
  title: 'Paket Calon Pemimpin & Management Trainee (MT)',
  category: 'leadership',
  categoryLabel: 'Management Trainee & Leadership',
  shortDescription: 'Fokus pada potensi kepemimpinan, pengambilan keputusan di bawah tekanan, integritas dilema kerja, dan kecakapan logika analitis.',
  fullDescription: 'Dirancang khusus untuk program Management Trainee, Fast-Track Officer, dan kandidat calon suksesor tim manajerial.',
  durationMinutes: 35,
  totalQuestions: 20,
  difficulty: 'Mid Level',
  targetAudience: 'Kandidat Management Trainee, Supervisor, Assistant Manager & Project Lead',
  measuringPoints: [
    'Dominance & Influence Profiling (DISC)',
    'Kepemimpinan Situasional & Manajemen Konflik',
    'Kemampuan Problem Solving & Analisis Kritis',
    'Integritas dan Pengambilan Keputusan Strategis'
  ],
  instructions: [
    'Pilih respon yang paling mencerminkan prinsip kepemimpinan dan integritas profesional Anda.',
    'Alokasikan waktu dengan efisien selama 35 menit.'
  ],
  questions: buildPackageQuestions(mtSelectedIds),
  questionBank: getAllUnifiedQuestions()
};

export const technicalSpecialistPackage: TestPackage = {
  id: 'pkg-it-engineering',
  slug: 'it-engineering',
  title: 'Paket Tenaga Ahli, IT & Engineering',
  category: 'cognitive',
  categoryLabel: 'Technical & Cognitive Reasoning',
  shortDescription: 'Fokus mendalam pada kapasitas kognitif, logika analitis, ketelitian pola deret, dan ketahanan kerja teknis.',
  fullDescription: 'Standar evaluasi kognitif dan ketelitian analitis untuk insinyur perangkat lunak, data analyst, desainer sistem, dan posisi teknis spesialis.',
  durationMinutes: 30,
  totalQuestions: 18,
  difficulty: 'Senior & Managerial',
  targetAudience: 'Software Engineer, Data Analyst, QA, DevOps, System Architect & Technical Specialist',
  measuringPoints: [
    'Logika Algoritmik & Pola Deret Angka/Matriks',
    'Ketelitian & Pemecahan Masalah Sistemik',
    'Ketahanan Mental & Gaya Komunikasi Teknis (DISC)'
  ],
  instructions: [
    'Gunakan penalaran logis terbaik Anda untuk menyelesaikan pola dan deret analisis.',
    'Dilarang menggunakan kalkulator atau bantuan eksternal.'
  ],
  questions: buildPackageQuestions(itSelectedIds),
  questionBank: getAllUnifiedQuestions()
};

export const salesMarketingPackage: TestPackage = {
  id: 'pkg-sales-bizdev',
  slug: 'sales-bizdev',
  title: 'Paket Sales, Marketing & Business Development',
  category: 'personality',
  categoryLabel: 'Sales & Business Growth',
  shortDescription: 'Fokus pada profil persuasi ekstrovert (DISC), kecakapan negosiasi situasional, dan komunikasi korespondensi bahasa Inggris.',
  fullDescription: 'Pengukuran kecocokan peran untuk tenaga penjual, account executive, growth marketer, dan kemitraan bisnis strategis.',
  durationMinutes: 30,
  totalQuestions: 18,
  difficulty: 'Mid Level',
  targetAudience: 'Account Executive, Business Development, Digital Marketer & Sales Representative',
  measuringPoints: [
    'Orientasi Hasil & Ketahanan Terhadap Penolakan (DISC)',
    'Taktik Negosiasi & Komunikasi Pelanggan (SJT)',
    'Kemahiran Korespondensi Bisnis Bahasa Inggris'
  ],
  instructions: [
    'Pilihlah respon yang paling mencerminkan etos layanan, negosiasi, dan dorongan pencapaian target kerja Anda.'
  ],
  questions: buildPackageQuestions(salesSelectedIds),
  questionBank: getAllUnifiedQuestions()
};

export const adminOperationsPackage: TestPackage = {
  id: 'pkg-admin-ops',
  slug: 'admin-ops',
  title: 'Paket Administrasi & Operasional Kantor',
  category: 'situational',
  categoryLabel: 'Administrasi & Kepatuhan SOP',
  shortDescription: 'Fokus pada kepatuhan SOP, akurasi data, etika kerja, dan kecermatan administratif.',
  fullDescription: 'Ditujukan untuk staf administrasi, keuangan, logistik, operasional lapangan, dan sekretariat.',
  durationMinutes: 25,
  totalQuestions: 15,
  difficulty: 'Entry Level',
  targetAudience: 'Staf Administrasi, Personal Assistant, GA Admin, Keuangan & Operasional',
  measuringPoints: [
    'Kepatuhan Standar Operasional Prosedur (SOP)',
    'Ketelitian Verifikasi Data & Logika Numerik Dasar',
    'Konsistensi dan Tanggung Jawab Kerja (DISC Steadiness/Conscientiousness)'
  ],
  instructions: [
    'Perhatikan setiap instruksi dan studi kasus administratif dengan teliti.'
  ],
  questions: buildPackageQuestions(adminSelectedIds),
  questionBank: getAllUnifiedQuestions()
};

export const assessmentPackages: TestPackage[] = [
  unifiedAssessmentPackage,
  managementTraineePackage,
  technicalSpecialistPackage,
  salesMarketingPackage,
  adminOperationsPackage
];
