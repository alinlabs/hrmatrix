import { CandidateEvaluation, CandidateDocumentAttachment, EvaluationWeights, HiringDecisionStatus } from './types';
import { getAllCandidatesForInterview, getStoredInterviewRecords } from '../interview/interview-storage';
import { getStoredVacancies } from '../lowongan/storage-helper';
import { DEFAULT_MANDATORY_DOCUMENTS, DEFAULT_SUPPORTING_DOCUMENTS } from '../../data/master/daftar-dokumen';
import { allTemplates } from '../../data/jobs';

const EVALUATION_STORAGE_KEY = 'hrmatrix_candidate_evaluations_v1';
const WEIGHTS_STORAGE_KEY = 'hrmatrix_evaluation_weights_v1';

export const DEFAULT_EVALUATION_WEIGHTS: EvaluationWeights = {
  screening: 25,
  assessment: 35,
  interview: 40,
};

export function resolveJobAdministrativeDocs(vacancyId?: string, vacancyTitle?: string, candidateName?: string): CandidateDocumentAttachment[] {
  const vacancies = getStoredVacancies();
  const matchedVac = vacancies.find(v => (vacancyId && v.id === vacancyId) || (vacancyTitle && v.jobTitle.toLowerCase() === vacancyTitle.toLowerCase()));
  
  let reqs: { wajib: string[]; pendukung: string[]; khusus: string[] } = {
    wajib: [...DEFAULT_MANDATORY_DOCUMENTS],
    pendukung: [...DEFAULT_SUPPORTING_DOCUMENTS],
    khusus: ['SKCK (Surat Keterangan Catatan Kepolisian)']
  };

  if (matchedVac?.rawJobTemplate?.dokumenAdministrasi) {
    const da = matchedVac.rawJobTemplate.dokumenAdministrasi;
    reqs = {
      wajib: da.wajib && da.wajib.length > 0 ? da.wajib : [...DEFAULT_MANDATORY_DOCUMENTS],
      pendukung: da.pendukung && da.pendukung.length > 0 ? da.pendukung : [...DEFAULT_SUPPORTING_DOCUMENTS],
      khusus: da.khusus || []
    };
  } else if (matchedVac?.atsBreakdown?.mandatoryQualifications?.mandatoryDocs && matchedVac.atsBreakdown.mandatoryQualifications.mandatoryDocs.length > 0) {
    reqs = {
      wajib: matchedVac.atsBreakdown.mandatoryQualifications.mandatoryDocs,
      pendukung: [...DEFAULT_SUPPORTING_DOCUMENTS],
      khusus: []
    };
  } else {
    // Try to find in allTemplates
    const tpl = allTemplates.find(t => t.nama.toLowerCase() === (vacancyTitle || '').toLowerCase() || (matchedVac && t.id === matchedVac.jobTemplateId));
    if (tpl?.dokumenAdministrasi) {
      reqs = {
        wajib: tpl.dokumenAdministrasi.wajib && tpl.dokumenAdministrasi.wajib.length > 0 ? tpl.dokumenAdministrasi.wajib : [...DEFAULT_MANDATORY_DOCUMENTS],
        pendukung: tpl.dokumenAdministrasi.pendukung && tpl.dokumenAdministrasi.pendukung.length > 0 ? tpl.dokumenAdministrasi.pendukung : [...DEFAULT_SUPPORTING_DOCUMENTS],
        khusus: tpl.dokumenAdministrasi.khusus || []
      };
    }
  }

  const result: CandidateDocumentAttachment[] = [];
  const candTag = (candidateName || 'Kandidat').replace(/\s+/g, '_');

  // Wajib
  reqs.wajib.forEach((docName, idx) => {
    const isCv = docName.toLowerCase().includes('cv') || docName.toLowerCase().includes('curriculum');
    const isKtp = docName.toLowerCase().includes('ktp');
    const isIjazah = docName.toLowerCase().includes('ijazah');

    // Simulate uploaded for typical mandatory docs like CV and KTP
    const isUploaded = isCv || isKtp;
    const isValid = isCv;

    result.push({
      id: `doc-w-${idx}`,
      name: docName,
      category: 'Wajib',
      status: isValid ? 'Terverifikasi (Valid)' : isUploaded ? 'Sudah Diunggah' : 'Diminta ke Kandidat',
      fileName: isUploaded ? `${docName.replace(/[^a-zA-Z0-9]/g, '_')}_${candTag}.pdf` : undefined,
      fileSize: isUploaded ? (isCv ? '480 KB' : '1.2 MB') : undefined,
      uploadedAt: isUploaded ? '2026-10-02' : undefined,
      requestedAt: !isUploaded ? '2026-10-01' : undefined
    });
  });

  // Pendukung
  reqs.pendukung.forEach((docName, idx) => {
    const isPort = docName.toLowerCase().includes('portofolio') || docName.toLowerCase().includes('rekap');
    const isCert = docName.toLowerCase().includes('sertifikat');
    const isUploaded = isPort || isCert;

    result.push({
      id: `doc-p-${idx}`,
      name: docName,
      category: 'Pendukung',
      status: isUploaded ? 'Sudah Diunggah' : 'Belum Diunggah',
      fileName: isUploaded ? `${docName.replace(/[^a-zA-Z0-9]/g, '_')}_${candTag}.pdf` : undefined,
      fileSize: isUploaded ? (isPort ? '3.4 MB' : '320 KB') : undefined,
      uploadedAt: isUploaded ? '2026-10-03' : undefined
    });
  });

  // Khusus
  reqs.khusus.forEach((docName, idx) => {
    result.push({
      id: `doc-k-${idx}`,
      name: docName,
      category: 'Khusus',
      status: 'Belum Diunggah'
    });
  });

  return result;
}

export function calculateWeightedScore(
  screening: number,
  assessment: number,
  interview: number,
  weights: EvaluationWeights = DEFAULT_EVALUATION_WEIGHTS
): number {
  const sWeight = (weights.screening || 25) / 100;
  const aWeight = (weights.assessment || 35) / 100;
  const iWeight = (weights.interview || 40) / 100;

  const total = (screening * sWeight) + (assessment * aWeight) + (interview * iWeight);
  return Math.round(total);
}

export function getStoredEvaluationWeights(): EvaluationWeights {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return DEFAULT_EVALUATION_WEIGHTS;
    }
    const raw = localStorage.getItem(WEIGHTS_STORAGE_KEY);
    if (!raw) return DEFAULT_EVALUATION_WEIGHTS;
    const parsed = JSON.parse(raw);
    return {
      screening: parsed.screening ?? 25,
      assessment: parsed.assessment ?? 35,
      interview: parsed.interview ?? 40,
    };
  } catch (e) {
    return DEFAULT_EVALUATION_WEIGHTS;
  }
}

export function saveEvaluationWeights(weights: EvaluationWeights): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    localStorage.setItem(WEIGHTS_STORAGE_KEY, JSON.stringify(weights));
  } catch (e) {
    console.error('Failed to save evaluation weights:', e);
  }
}

export function getStoredEvaluations(): Record<string, CandidateEvaluation> {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return {};
    }
    const raw = localStorage.getItem(EVALUATION_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load evaluations:', e);
    return {};
  }
}

export function saveCandidateEvaluation(evaluation: CandidateEvaluation): CandidateEvaluation {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return evaluation;
    const current = getStoredEvaluations();
    current[evaluation.candidateId] = {
      ...evaluation,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem(EVALUATION_STORAGE_KEY, JSON.stringify(current));
    return evaluation;
  } catch (e) {
    console.error('Failed to save evaluation:', e);
    return evaluation;
  }
}

export function deleteCandidateEvaluation(candidateId: string): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    const current = getStoredEvaluations();
    if (current[candidateId]) {
      delete current[candidateId];
      localStorage.setItem(EVALUATION_STORAGE_KEY, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Failed to delete evaluation:', e);
  }
}

export function getMergedCandidateEvaluations(): CandidateEvaluation[] {
  const candidates = getAllCandidatesForInterview();
  const interviews = getStoredInterviewRecords();
  const savedEvaluations = getStoredEvaluations();
  const weights = getStoredEvaluationWeights();

  return candidates.map((cand) => {
    // Check if we have saved custom evaluation
    const saved = savedEvaluations[cand.id];

    // Check if we have interview record
    const interviewRec = interviews.find((i) => i.candidateId === cand.id);
    const interviewScore = interviewRec ? interviewRec.calculatedScore : (saved ? saved.interviewScore : 82);

    const screeningScore = cand.atsScore || (saved ? saved.screeningScore : 80);
    const assessmentScore = cand.testScore || (saved ? saved.assessmentScore : 78);

    const finalScore = calculateWeightedScore(screeningScore, assessmentScore, interviewScore, weights);

    let defaultDecision: HiringDecisionStatus = 'Dalam Evaluasi';
    if (finalScore >= 85) defaultDecision = 'Lolos (Hired)';
    else if (finalScore >= 78) defaultDecision = 'Offering Sent';
    else if (finalScore >= 70) defaultDecision = 'Talent Pool';
    else defaultDecision = 'Ditolak';

    const initialJobDocs = resolveJobAdministrativeDocs(cand.vacancyId, cand.vacancyTitle, cand.name);

    const defaultTestPackage = cand.testPackageName || (
      cand.vacancyTitle.includes('Direktur') ? 'Kepemimpinan & Manajemen Strategis' :
      cand.vacancyTitle.includes('Software') ? 'Potensi Akademik & Penalaran Logis' :
      'DISC Profil Kepribadian Kerja'
    );

    const defaultTestCategories = [
      { category: 'Kemampuan Kognitif & Logika', score: Math.min(100, assessmentScore + 4) },
      { category: 'Kompetensi Teknis Spesifik', score: assessmentScore },
      { category: 'Kesesuaian Kepribadian & Budaya Kerja', score: Math.max(60, assessmentScore - 3) }
    ];

    const initialStars = Math.min(5, Math.max(1, Math.round(interviewScore / 20)));

    return {
      id: saved?.id || `EVAL-${cand.id}`,
      candidateId: cand.id,
      candidateName: saved?.candidateName || cand.name,
      candidateEmail: saved?.candidateEmail || cand.email,
      candidatePhone: saved?.candidatePhone || cand.phone,
      candidateAddress: saved?.candidateAddress || 'DKI Jakarta, Indonesia',
      candidateSocialMedia: saved?.candidateSocialMedia || {
        linkedin: `https://linkedin.com/in/${cand.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        portfolio: `https://portfolio.me/${cand.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`
      },
      vacancyId: saved?.vacancyId || cand.vacancyId,
      vacancyTitle: saved?.vacancyTitle || cand.vacancyTitle,
      department: saved?.department || (cand.vacancyTitle.includes('Direktur') ? 'Direksi & Operasional' : cand.vacancyTitle.includes('Software') ? 'Teknologi Informasi' : 'SDM & Human Capital'),
      screeningScore,
      assessmentScore,
      interviewScore,
      interviewStars: saved?.interviewStars || initialStars,
      testPackageName: saved?.testPackageName || defaultTestPackage,
      testCompletedAt: saved?.testCompletedAt || '2026-10-04',
      testDurationMinutes: saved?.testDurationMinutes || 35,
      testCategoryScores: saved?.testCategoryScores || defaultTestCategories,
      weights,
      finalScore,
      decisionStatus: saved?.decisionStatus || defaultDecision,
      recruiterNotes: saved?.recruiterNotes || (interviewRec?.generalNotes ? `Catatan Interview: ${interviewRec.generalNotes}` : 'Kandidat menunjukkan potensi yang sangat baik dan relevan dengan kualifikasi jabatan.'),
      reviewedBy: saved?.reviewedBy || 'HR Recruitment Lead',
      updatedAt: saved?.updatedAt || new Date().toISOString().split('T')[0],
      summary: saved?.summary || 'Profesional berpengalaman dengan dedikasi tinggi, kemampuan komunikasi prima, dan rekam jejak terbukti dalam pencapaian target.',
      documents: saved?.documents || initialJobDocs
    };

  });
}


