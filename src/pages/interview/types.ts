export type InterviewCategory = 
  | 'Kompetensi Teknis & Pengalaman'
  | 'Soft Skills & Perilaku'
  | 'Culture Fit & Motivasi'
  | 'Kepemimpinan & Problem Solving';

export type InterviewStage = 
  | 'HR Interview'
  | 'User / Technical Interview'
  | 'Final Culture Fit';

export type RecommendationStatus = 
  | 'Sangat Direkomendasikan'
  | 'Direkomendasikan'
  | 'Dipertimbangkan'
  | 'Tidak Direkomendasikan';

export interface InterviewChecklistItem {
  id: string;
  category: InterviewCategory;
  label: string;
  description: string;
  score: number; // 1 to 5 scale
  notes?: string;
}

export interface InterviewRecord {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  interviewerName: string;
  interviewDate: string;
  interviewStage: InterviewStage;
  checklists: InterviewChecklistItem[];
  calculatedScore: number; // 0 to 100%
  strengths: string[];
  areasToProbe: string[];
  generalNotes: string;
  recommendation: RecommendationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SampleCandidateProfile {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  name: string;
  email: string;
  phone: string;
  atsScore: number;
  testScore: number;
  testPackageName: string;
}
