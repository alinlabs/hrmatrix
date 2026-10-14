import { JobTemplate } from '../job-desk/types';

export type EmploymentType = 
  | 'Penuh Waktu (Full-Time)' 
  | 'Paruh Waktu (Part-Time)' 
  | 'Kontrak (PKWT)' 
  | 'Magang (Internship)' 
  | 'Freelance / Proyek';

export type WorkModel = 
  | 'On-site (WFO)' 
  | 'Hybrid' 
  | 'Remote (WFH)';

export type VacancyStatus = 'Aktif' | 'Draft' | 'Ditutup';

export interface AtsKeywordCategory {
  category: 'Hard Skills & Teknis' | 'Soft Skills & Perilaku' | 'Tools & Metodologi' | 'Administrasi & Sertifikasi';
  keywords: string[];
}

export interface AtsBreakdown {
  atsScore: number;
  atsScoreNotes: string[];
  roleSummary: string;
  coreResponsibilities: string[];
  mandatoryQualifications: {
    education: string;
    experience: string;
    certifications: string[];
    hardSkills: string[];
    mandatoryDocs: string[];
  };
  preferredQualifications: {
    softSkills: string[];
    specialRequirements: string[];
    bonusSkills: string[];
  };
  atsKeywords: AtsKeywordCategory[];
  benefitsAndFacilities: string[];
  plainTextATS: string;
  markdownJobBoard: string;
}

export interface VacancyItem {
  id: string;
  jobTemplateId: string;
  jobTitle: string;
  department: string;
  division: string;
  level: string;
  companyName: string;
  location: string;
  candidateDomicile?: string;
  workType: EmploymentType;
  workModel: WorkModel;
  salaryDisplay: boolean;
  salaryMin?: number;
  salaryMax?: number;
  applicationDeadline: string;
  contactEmail: string;
  status: VacancyStatus;
  createdAt: string;
  updatedAt: string;
  rawJobTemplate: JobTemplate;
  atsBreakdown: AtsBreakdown;
  customNotes?: string;
}

export interface CandidateWorkExperience {
  companyName: string;
  position: string;
  period: string;
  startYear?: number;
  endYear?: number;
  durationMonths?: number;
  durationFormatted?: string;
  location?: string;
  description?: string[];
  isCurrent?: boolean;
}

export interface CandidateExperienceSummary {
  totalYears: number;
  totalMonths: number;
  totalFormatted: string;
  minYearsRequired?: number;
  isRequirementMet?: boolean;
  history: CandidateWorkExperience[];
}

export interface CandidateEducationHistory {
  institution: string;
  degree?: string;
  major?: string;
  year?: string;
  gpa?: string;
}

export interface CandidateAchievement {
  title: string;
  issuerOrEvent?: string;
  year?: string;
  description?: string;
  type?: 'Penghargaan' | 'Kejuaraan / Lomba' | 'Beasiswa' | 'Prestasi Akademik' | 'Lainnya';
}

export interface CandidateCertification {
  name: string;
  title?: string;
  issuer?: string;
  issueDate?: string;
  year?: string;
  expiryDate?: string;
  credentialId?: string;
  isLifetime?: boolean;
}

export interface CandidateLanguageItem {
  language: string;
  proficiency: 'Dasar' | 'Menengah (Conversational)' | 'Mahir / Fasih (Fluent)' | 'Penutur Asli (Native)';
}

export interface CandidateSkillSet {
  hardSkills: string[];
  toolsAndTech: string[];
  softSkills: string[];
  languages: CandidateLanguageItem[];
}

export interface SoftSkillTrait {
  trait: string;
  description: string;
  strengthLevel: 'Tinggi' | 'Sedang' | 'Berkembang';
  evidence: string;
}

export interface CandidatePotentialAnalysis {
  softSkillTendency: {
    dominantWorkStyle: string;
    summary: string;
    traits: SoftSkillTrait[];
  };
  hardSkillCompetency: {
    domainSpecialization: string;
    masteryLevel: 'Expert / Lead' | 'Senior Specialist' | 'Mid-Level Specialist' | 'Junior / Entry';
    keyTechnologies: string[];
    depthAnalysis: string;
  };
  careerTrajectory: {
    growthPattern: 'Progression Konsisten (Naik Tingkat)' | 'Specialist Mendalam' | 'Multi-disipliner Adaptif' | 'Early Career Stage';
    averageTenurePerCompany: string;
    stabilityRating: 'Sangat Stabil (Low Turnover Risk)' | 'Stabil' | 'Dinamis (Agile)';
    promotionHistory: string;
    insights: string;
  };
  hiringRecommendations: {
    suggestedSeniority: string;
    keyStrengths: string[];
    areasToProbeInInterview: string[];
    overallFitSummary: string;
  };
}

export interface CandidateParsedDetail {
  address?: string;
  socialMedia?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    portfolio?: string;
    other?: string;
  };
  summary?: string;
  workExperiences?: CandidateWorkExperience[];
  experienceSummary?: CandidateExperienceSummary;
  educationHistory?: CandidateEducationHistory[];
  achievements?: CandidateAchievement[];
  certifications?: CandidateCertification[];
  skillSet?: CandidateSkillSet;
  potentialAnalysis?: CandidatePotentialAnalysis;
}

export interface MatchedResponsibility {
  duty: string;
  isMatched: boolean;
  matchConfidence: 'Tinggi' | 'Sedang' | 'Belum Terdeteksi';
  matchedKeywords: string[];
  matchedContext?: string;
}

export interface ParsedAtsRequirement {
  id: string;
  displayLabel: string;
  category: 'Hard Skills & Tools' | 'Kualifikasi & Sertifikasi' | 'Pengalaman' | 'Soft Skills';
  isMatched: boolean;
  matchedAlias?: string;
  matchedContext?: string;
  aliases: string[];
}

export interface ExperienceEvaluation {
  candidateYears: number;
  candidateFormatted: string;
  requiredYearsMin: number;
  requiredYearsMax?: number;
  status: 'Memenuhi Syarat' | 'Cukup' | 'Di Bawah Syarat' | 'Belum Tertera';
  matchPercentage: number;
  notes: string;
}

export interface LocationEvaluation {
  status: 'Sangat Sesuai' | 'Sesuai' | 'Dipertimbangkan' | 'Jauh / Tidak Sesuai';
  matchPercentage: number;
  candidateExplicitLocation: string;
  inferredLocationFromHistory: string[];
  notes: string;
}

export interface AtsMatchBreakdown {
  totalScore: number;
  responsibilitiesScore: number; // 30% bobot
  technicalSkillsScore: number;  // 25% bobot
  locationScore: number;         // 20% bobot
  qualificationsScore: number;   // 15% bobot
  softSkillsScore: number;       // 10% bobot
  responsibilities: MatchedResponsibility[];
  matchedKeywords: string[];
  missingKeywords: string[];
  structuredRequirements?: ParsedAtsRequirement[];
  experienceEvaluation?: ExperienceEvaluation;
  locationEvaluation?: LocationEvaluation;
  potentialAnalysis?: CandidatePotentialAnalysis;
  totalDutiesCount: number;
  matchedDutiesCount: number;
}

export interface Candidate {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  fileName: string;
  file?: File;
  fileDataUrl?: string;
  uploadedAt?: string;
  matchScore: number;
  status: 'Pending' | 'Scored';
  extractedText: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedResponsibilities?: MatchedResponsibility[];
  atsMatchBreakdown?: AtsMatchBreakdown;
  parsedDetail?: CandidateParsedDetail;
}

export interface CreateVacancyFormState {
  jobTemplateId: string;
  jobTitle: string;
  department: string;
  division: string;
  level: string;
  companyName: string;
  location: string;
  candidateDomicile?: string;
  workType: EmploymentType;
  workModel: WorkModel;
  salaryDisplay: boolean;
  salaryMin?: number;
  salaryMax?: number;
  applicationDeadline: string;
  contactEmail: string;
  status: VacancyStatus;
  customNotes?: string;
}
