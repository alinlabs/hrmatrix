export type TestCategory = 'comprehensive' | 'personality' | 'cognitive' | 'situational' | 'language' | 'leadership' | 'technical';

export const CATEGORY_LABELS: Record<TestCategory, string> = {
  comprehensive: 'Asesmen Komprehensif Terpadu',
  personality: 'Psikotes & DISC',
  cognitive: 'Logika & Kognitif (TPA)',
  situational: 'Studi Kasus & Etika (SJT)',
  language: 'Bahasa Inggris Bisnis',
  leadership: 'Kepemimpinan & Manajerial',
  technical: 'Keahlian Teknis'
};

export const CATEGORY_BADGE_COLORS: Record<TestCategory, { bg: string; text: string; border: string }> = {
  comprehensive: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  personality: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  cognitive: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  situational: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  language: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  leadership: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  technical: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
};

// 4 Format Tipe Jawaban Baku: Kuadran DISC, Pilihan Ganda (A-H), Multi Jawaban (1-8 & Kunci > 1), dan Esai (dengan Prediksi Keyword Match)
export type QuestionType = 
  | 'disc_quadrant'       // Kuadran DISC (Paling & Kurang)
  | 'multiple_choice'     // Pilihan Ganda (2 s/d 8 Opsi: A, B, C, D, E, F, G, H)
  | 'multiple_choice_4'   // Alias Pilihan Ganda
  | 'multiple_answers'    // Multi Jawaban (Nomor 1, 2, 3... Kunci Jawaban Benar Bisa Lebih dari 1)
  | 'essay';              // Esai / Jawaban Terbuka dengan Deteksi Keyword Matching

export interface QuestionOption {
  id: string;
  label: string; // 'A', 'B', 'C'... atau '1', '2', '3'...
  text: string;
  score?: number; // Score 0 / 10
  discType?: 'D' | 'I' | 'S' | 'C'; // For DISC test
  trait?: string;
}

export interface TestQuestion {
  id: string;
  number: number;
  scenario?: string; // Optional context
  questionText: string;
  questionType: QuestionType;
  options: QuestionOption[]; // Opsi untuk DISC, Pilihan Ganda & Multi Jawaban
  correctOptionId?: string; // Kunci jawaban benar untuk Pilihan Ganda Tunggal
  correctOptionIds?: string[]; // Kunci jawaban benar untuk Multi Jawaban (array of option IDs)
  essayKeywords?: string[]; // Kata kunci acuan untuk prediksi kecocokan esai kata perkata
  essaySampleAnswer?: string; // Jawaban acuan HR untuk esai (deskriptif)
  isKeywordEnabled?: boolean; // Tanda apakah evaluasi esai menggunakan pencocokan keyword atau persis (exact match)
  explanation?: string; // Penjelasan logika / pembahasan untuk HR
  category?: TestCategory;
  tags?: string[]; // e.g. ['Deret Angka', 'Silogisme', 'Integritas', 'Grammar']
  difficulty?: 'Mudah' | 'Sedang' | 'Sulit';
}

export interface TestPackage {
  id: string;
  slug: string;
  title: string;
  category: TestCategory;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  durationMinutes: number;
  totalQuestions: number;
  difficulty: 'Semua Level' | 'Entry Level' | 'Mid Level' | 'Senior & Managerial';
  targetAudience: string;
  measuringPoints: string[];
  instructions: string[];
  questions: TestQuestion[]; // Soal aktif yang akan dikerjakan
  questionBank?: TestQuestion[]; // Seluruh bank soal yang dapat dipilih HR
  selectedQuestionIds?: string[]; // ID soal yang dipilih HR dari bank soal
  isCustomized?: boolean;
  randomizePerCandidate?: boolean; // Mengacak soal untuk setiap kandidat (Anti-Contek)
  subsetCount?: number; // Jumlah soal yang diambil acak per sesi
  maxSessionExits?: number; // Batas keluar sesi / pindah tab (0 = langsung akhiri)
}

export interface CandidateAnswer {
  questionId: string;
  selectedOptionId?: string; // For Pilihan Ganda Tunggal
  selectedOptionIds?: string[]; // For Multi Jawaban
  essayAnswerText?: string; // For Esai
  essayMatchScore?: number; // Skor kecocokan kata kunci esai (0 - 100%)
  matchedKeywords?: string[]; // Kata kunci yang cocok ditemukan
  mostOptionId?: string; // For DISC (Paling menggambarkan)
  leastOptionId?: string; // For DISC (Paling tidak menggambarkan)
  timeSpentSeconds?: number;
}

export interface CandidateSession {
  candidateName: string;
  candidateEmail?: string;
  appliedPosition?: string;
  packageId: string;
  startedAt: string;
  completedAt?: string;
  durationMinutesSet?: number;
  answers: Record<string, CandidateAnswer>;
  score?: number;
  maxScore?: number;
  percentage?: number;
  grade?: string;
  stressEnduranceScore?: number; // Indeks Ketahanan Stres & Stamina (0-100)
  stressToleranceLevel?: 'Sangat Tinggi (Tahan Tekanan Ekstrem)' | 'Tinggi (Stabil & Adaptif)' | 'Moderat (Cukup Stabil)' | 'Rentan Terhadap Tekanan';
  resilienceSummary?: string;
  discSummary?: {
    dScore: number;
    iScore: number;
    sScore: number;
    cScore: number;
    dominantTrait: string;
    profileTitle: string;
    summary: string;
    workStyle: string;
    interviewTips: string[];
  };
  categoryBreakdown?: Array<{
    category: TestCategory;
    categoryLabel: string;
    totalQuestions: number;
    answeredCount: number;
    scorePercent: number;
    grade: string;
  }>;
  recommendation?: 'Sangat Direkomendasikan' | 'Direkomendasikan' | 'Dipertimbangkan dengan Catatan' | 'Tidak Disarankan';
}
