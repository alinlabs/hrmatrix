export type HiringDecisionStatus = 
  | 'Lolos (Hired)'
  | 'Offering Sent'
  | 'Talent Pool'
  | 'Ditolak'
  | 'Dalam Evaluasi';

export interface EvaluationWeights {
  screening: number;   // e.g. 25 (%)
  assessment: number;  // e.g. 35 (%)
  interview: number;   // e.g. 40 (%)
}

export type DocumentRequirementCategory = 'Wajib' | 'Pendukung' | 'Khusus';
export type DocumentVerificationStatus = 'Belum Diunggah' | 'Diminta ke Kandidat' | 'Sudah Diunggah' | 'Terverifikasi (Valid)' | 'Perlu Revisi';

export interface CandidateDocumentAttachment {
  id: string;
  name: string;
  category: DocumentRequirementCategory;
  status: DocumentVerificationStatus;
  fileDataUrl?: string;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  requestedAt?: string;
  notes?: string;
}

export interface CandidateEvaluation {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateAddress?: string;
  candidateSocialMedia?: {
    linkedin?: string;
    portfolio?: string;
    github?: string;
    other?: string;
  };
  vacancyId: string;
  vacancyTitle: string;
  department: string;
  screeningScore: number;  // ATS score (0-100, Fixed)
  assessmentScore: number; // Test score (0-100, Fixed)
  interviewScore: number;  // Checklist interview score (0-100, Editable via Stars)
  interviewStars?: number;  // 1 to 5 stars
  testPackageName?: string;
  testCompletedAt?: string;
  testDurationMinutes?: number;
  testCategoryScores?: { category: string; score: number }[];
  weights: EvaluationWeights;
  finalScore: number;       // Weighted score (0-100)
  decisionStatus: HiringDecisionStatus;
  recruiterNotes: string;
  reviewedBy: string;
  updatedAt: string;
  summary?: string;
  documents?: CandidateDocumentAttachment[];
}



