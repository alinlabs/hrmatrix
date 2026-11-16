import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Save,
  Send,
  X
} from 'lucide-react';
import { PageHeaderTitle } from '../../context/mobile-nav-context';
import {
  CandidateEvaluation,
  CandidateDocumentAttachment,
  DocumentRequirementCategory,
  DocumentVerificationStatus,
  HiringDecisionStatus
} from './types';
import {
  calculateWeightedScore,
  resolveJobAdministrativeDocs,
  getMergedCandidateEvaluations,
  saveCandidateEvaluation,
  deleteCandidateEvaluation
} from './evaluation-storage';
import {
  InterviewChecklistItem,
  InterviewStage,
  RecommendationStatus,
  InterviewRecord
} from '../interview/types';
import {
  DEFAULT_CHECKLIST_ITEMS,
  calculateScoreFromChecklist,
  getStoredInterviewRecords,
  saveInterviewRecord
} from '../interview/interview-storage';
import { getStoredVacancies } from '../lowongan/storage-helper';
import { formatRupiah } from '../lowongan/utils-ats';
import { VacancyItem } from '../lowongan/types';
import { TabCandidateProfil } from './tab-candidate-profil';
import { TabCandidatePosisi, getDeadlineStatusText } from './tab-candidate-posisi';
import { TabCandidateBerkas } from './tab-candidate-berkas';
import { TabCandidatePenilaian } from './tab-candidate-penilaian';
import { ModalTestReport } from './modal-test-report';

interface CandidateDetailPageProps {
  candidate?: CandidateEvaluation | null;
  onBack?: () => void;
  onSave?: (updated: CandidateEvaluation) => void;
  onDelete?: (candidateId: string) => void;
}

type PageTab = 'profil' | 'posisi' | 'berkas' | 'penilaian';

export const CandidateDetailPage: React.FC<CandidateDetailPageProps> = ({
  candidate: candidateProp,
  onBack,
  onSave: onSaveProp,
  onDelete: onDeleteProp
}) => {
  const navigate = useNavigate();
  const { candidateId: paramCandidateId } = useParams<{ candidateId: string }>();

  // Resolve active candidate (either passed as prop or loaded from storage via param/query)
  const [currentCandidate, setCurrentCandidate] = useState<CandidateEvaluation | null>(() => {
    if (candidateProp) return candidateProp;
    const allEvaluations = getMergedCandidateEvaluations();
    const targetId = paramCandidateId || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('id') : null);
    if (targetId) {
      const found = allEvaluations.find(c => c.candidateId === targetId);
      if (found) return found;
    }
    return allEvaluations[0] || null;
  });

  useEffect(() => {
    if (candidateProp) {
      setCurrentCandidate(candidateProp);
    } else {
      const allEvaluations = getMergedCandidateEvaluations();
      const targetId = paramCandidateId || new URLSearchParams(window.location.search).get('id');
      if (targetId) {
        const found = allEvaluations.find(c => c.candidateId === targetId);
        if (found) {
          setCurrentCandidate(found);
        } else if (allEvaluations.length > 0) {
          setCurrentCandidate(allEvaluations[0]);
        }
      } else if (allEvaluations.length > 0) {
        setCurrentCandidate(allEvaluations[0]);
      }
    }
  }, [candidateProp, paramCandidateId]);

  const [activeTab, setActiveTab] = useState<PageTab>('profil');

  // Form states
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateAddress, setCandidateAddress] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [vacancyId, setVacancyId] = useState('');
  const [vacancyTitle, setVacancyTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [summary, setSummary] = useState('');

  // Penilaian & Rating Bintang
  const [screeningScore, setScreeningScore] = useState(80);
  const [assessmentScore, setAssessmentScore] = useState(78);
  const [interviewScore, setInterviewScore] = useState(82);
  const [interviewStars, setInterviewStars] = useState<number>(4);
  const [decisionStatus, setDecisionStatus] = useState<HiringDecisionStatus>('Dalam Evaluasi');
  const [recruiterNotes, setRecruiterNotes] = useState('');

  // Interview Evaluation states
  const [interviewStage, setInterviewStage] = useState<InterviewStage>('User / Technical Interview');
  const [interviewerName, setInterviewerName] = useState<string>('HR Recruitment Lead');
  const [interviewDate, setInterviewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [interviewRecommendation, setInterviewRecommendation] = useState<RecommendationStatus>('Direkomendasikan');
  const [interviewChecklists, setInterviewChecklists] = useState<InterviewChecklistItem[]>(DEFAULT_CHECKLIST_ITEMS);
  const [interviewStrengths, setInterviewStrengths] = useState<string>('');
  const [interviewAreasToProbe, setInterviewAreasToProbe] = useState<string>('');
  const [isInterviewRubricOpen, setIsInterviewRubricOpen] = useState<boolean>(false);

  // Modal Report Tes Online Popup State
  const [isTestReportOpen, setIsTestReportOpen] = useState<boolean>(false);

  // Berkas & Dokumen Administratif
  const [documents, setDocuments] = useState<CandidateDocumentAttachment[]>([]);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<'Semua' | DocumentRequirementCategory>('Semua');
  
  // Custom Doc Modal Form
  const [isAddCustomDocOpen, setIsAddCustomDocOpen] = useState(false);
  const [customDocName, setCustomDocName] = useState('');
  const [customDocCategory, setCustomDocCategory] = useState<DocumentRequirementCategory>('Khusus');

  // Active Target Document for File Upload
  const [targetUploadDocId, setTargetUploadDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status feedback toast
  const [requestToastMsg, setRequestToastMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const vacancies = getStoredVacancies();

  // Matched Vacancy Object for the candidate's applied position
  const activeVacancy: VacancyItem | null = vacancies.find(
    v => (vacancyId && v.id === vacancyId) || (vacancyTitle && v.jobTitle.toLowerCase() === vacancyTitle.toLowerCase())
  ) || (vacancies[0] || null);

  // Populate data when currentCandidate changes
  useEffect(() => {
    if (currentCandidate) {
      setCandidateName(currentCandidate.candidateName || '');
      setCandidateEmail(currentCandidate.candidateEmail || '');
      setCandidatePhone(currentCandidate.candidatePhone || '');
      setCandidateAddress(currentCandidate.candidateAddress || '');
      setLinkedinUrl(currentCandidate.candidateSocialMedia?.linkedin || '');
      setPortfolioUrl(currentCandidate.candidateSocialMedia?.portfolio || '');
      setVacancyId(currentCandidate.vacancyId || '');
      setVacancyTitle(currentCandidate.vacancyTitle || '');
      setDepartment(currentCandidate.department || '');
      setSummary(currentCandidate.summary || '');

      setScreeningScore(currentCandidate.screeningScore || 80);
      setAssessmentScore(currentCandidate.assessmentScore || 78);
      setDecisionStatus(currentCandidate.decisionStatus || 'Dalam Evaluasi');
      setRecruiterNotes(currentCandidate.recruiterNotes || '');

      // Load interview record if available
      const storedRecords = getStoredInterviewRecords();
      const existingRec = storedRecords.find(r => r.candidateId === currentCandidate.candidateId);
      if (existingRec) {
        setInterviewStage(existingRec.interviewStage || 'User / Technical Interview');
        setInterviewerName(existingRec.interviewerName || 'HR Recruitment Lead');
        setInterviewDate(existingRec.interviewDate || new Date().toISOString().split('T')[0]);
        setInterviewRecommendation(existingRec.recommendation || 'Direkomendasikan');
        setInterviewChecklists(existingRec.checklists && existingRec.checklists.length > 0 ? existingRec.checklists : DEFAULT_CHECKLIST_ITEMS);
        setInterviewStrengths(existingRec.strengths ? existingRec.strengths.join(', ') : '');
        setInterviewAreasToProbe(existingRec.areasToProbe ? existingRec.areasToProbe.join(', ') : '');
        setInterviewScore(existingRec.calculatedScore);
        setInterviewStars(Math.min(5, Math.max(1, Math.round(existingRec.calculatedScore / 20))));
      } else {
        const initScore = currentCandidate.interviewScore || 82;
        setInterviewScore(initScore);
        setInterviewStars(currentCandidate.interviewStars || Math.min(5, Math.max(1, Math.round(initScore / 20))));
        setInterviewStage('User / Technical Interview');
        setInterviewerName('HR Recruitment Lead');
        setInterviewDate(new Date().toISOString().split('T')[0]);
        setInterviewRecommendation('Direkomendasikan');
        setInterviewChecklists(DEFAULT_CHECKLIST_ITEMS);
        setInterviewStrengths('Komunikasi profesional, portofolio relevan');
        setInterviewAreasToProbe('Pengenalan alur kerja divisi');
      }

      // Load documents or initialize from Job Desk Standard
      if (currentCandidate.documents && currentCandidate.documents.length > 0) {
        setDocuments(currentCandidate.documents);
      } else {
        const initialJobDocs = resolveJobAdministrativeDocs(
          currentCandidate.vacancyId, 
          currentCandidate.vacancyTitle, 
          currentCandidate.candidateName
        );
        setDocuments(initialJobDocs);
      }
    }
  }, [currentCandidate]);

  if (!currentCandidate) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <p className="text-sm font-semibold text-slate-600">Data kandidat tidak ditemukan.</p>
        <button
          type="button"
          onClick={() => onBack ? onBack() : navigate('/kandidat')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Kembali ke Daftar Kandidat
        </button>
      </div>
    );
  }

  // Realtime calculated final score
  const computedFinalScore = calculateWeightedScore(
    Number(screeningScore) || 0,
    Number(assessmentScore) || 0,
    Number(interviewScore) || 0,
    currentCandidate.weights || { screening: 25, assessment: 35, interview: 40 }
  );

  // Star Rating Handler
  const handleSetStarRating = (starCount: number) => {
    setInterviewStars(starCount);
    const newScore = starCount * 20; // 1 Star = 20%, 2 = 40%, 3 = 60%, 4 = 80%, 5 = 100%
    setInterviewScore(newScore);
    setInterviewChecklists(prev => prev.map(item => ({ ...item, score: starCount })));
  };

  const handleUpdateChecklistScore = (itemId: string, newScore: number) => {
    const updated = interviewChecklists.map(item => item.id === itemId ? { ...item, score: newScore } : item);
    setInterviewChecklists(updated);
    const avgScore = calculateScoreFromChecklist(updated);
    setInterviewScore(avgScore);
    setInterviewStars(Math.min(5, Math.max(1, Math.round(avgScore / 20))));
  };

  const handleUpdateChecklistNotes = (itemId: string, newNotes: string) => {
    setInterviewChecklists(prev => prev.map(item => item.id === itemId ? { ...item, notes: newNotes } : item));
  };

  // Document Statistics
  const totalDocs = documents.length;
  const uploadedCount = documents.filter(d => d.status === 'Sudah Diunggah' || d.status === 'Terverifikasi (Valid)').length;
  const verifiedCount = documents.filter(d => d.status === 'Terverifikasi (Valid)').length;
  const pendingCount = documents.filter(d => d.status === 'Belum Diunggah' || d.status === 'Diminta ke Kandidat').length;
  const progressPercentage = totalDocs > 0 ? Math.round((uploadedCount / totalDocs) * 100) : 0;

  // Sync / Reset to Job Desk Standard Documents
  const handleSyncJobDeskDocs = () => {
    if (confirm(`Sinkronkan ulang daftar dokumen dengan standar persyaratan job desk posisi "${vacancyTitle}"?`)) {
      const standardDocs = resolveJobAdministrativeDocs(vacancyId, vacancyTitle, candidateName);
      setDocuments(standardDocs);
      showToastNotification('Daftar dokumen telah disinkronkan dengan persyaratan job desk posisi ini.');
    }
  };

  // Toast Helper
  const showToastNotification = (msg: string) => {
    setRequestToastMsg(msg);
    setTimeout(() => {
      setRequestToastMsg(null);
    }, 3500);
  };

  // Trigger Request Document to Candidate
  const handleRequestSingleDoc = (docId: string, docName: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: 'Diminta ke Kandidat',
          requestedAt: new Date().toISOString().split('T')[0]
        };
      }
      return doc;
    }));

    showToastNotification(`Permintaan dokumen "${docName}" berhasil dikirimkan ke email kandidat.`);
  };

  // Request All Pending Documents in 1 Click
  const handleRequestAllPendingDocs = () => {
    const unuploadedDocs = documents.filter(d => d.status === 'Belum Diunggah' || d.status === 'Perlu Revisi');
    if (unuploadedDocs.length === 0) {
      showToastNotification('Semua dokumen persyaratan sudah diunggah atau telah diminta.');
      return;
    }

    setDocuments(prev => prev.map(doc => {
      if (doc.status === 'Belum Diunggah' || doc.status === 'Perlu Revisi') {
        return {
          ...doc,
          status: 'Diminta ke Kandidat',
          requestedAt: new Date().toISOString().split('T')[0]
        };
      }
      return doc;
    }));

    showToastNotification(`${unuploadedDocs.length} dokumen persyaratan berhasil diminta ke kandidat.`);
  };

  // Toggle Verification Status
  const handleToggleVerification = (docId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const nextStatus: DocumentVerificationStatus = 
          doc.status === 'Terverifikasi (Valid)' ? 'Sudah Diunggah' : 'Terverifikasi (Valid)';
        return {
          ...doc,
          status: nextStatus
        };
      }
      return doc;
    }));
  };

  // File Upload for Specific Document Requirement
  const handleTriggerUpload = (docId: string) => {
    setTargetUploadDocId(docId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetUploadDocId) return;

    const sizeFormatted = `${(file.size / 1024).toFixed(0)} KB`;
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;
      setDocuments(prev => prev.map(doc => {
        if (doc.id === targetUploadDocId) {
          return {
            ...doc,
            fileName: file.name,
            fileSize: sizeFormatted,
            fileDataUrl: dataUrl,
            status: 'Sudah Diunggah',
            uploadedAt: new Date().toISOString().split('T')[0]
          };
        }
        return doc;
      }));
      showToastNotification(`Berkas "${file.name}" berhasil diunggah untuk persyaratan ini.`);
      setTargetUploadDocId(null);
    };

    reader.readAsDataURL(file);
  };

  // Delete / Clear Uploaded File from Requirement
  const handleRemoveUploadedFile = (docId: string) => {
    if (confirm('Kosongkan file yang terlampir pada persyaratan ini?')) {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            fileName: undefined,
            fileSize: undefined,
            fileDataUrl: undefined,
            status: 'Belum Diunggah',
            uploadedAt: undefined
          };
        }
        return doc;
      }));
    }
  };

  // Delete Requirement Item
  const handleDeleteDocItem = (docId: string) => {
    if (confirm('Hapus item persyaratan dokumen ini dari daftar?')) {
      setDocuments(prev => prev.filter(d => d.id !== docId));
    }
  };

  // Add Custom Administrative Requirement
  const handleAddCustomDocument = () => {
    if (!customDocName.trim()) {
      alert('Silakan masukkan nama persyaratan dokumen.');
      return;
    }

    const newDoc: CandidateDocumentAttachment = {
      id: `doc-custom-${Date.now()}`,
      name: customDocName.trim(),
      category: customDocCategory,
      status: 'Belum Diunggah'
    };

    setDocuments(prev => [...prev, newDoc]);
    setCustomDocName('');
    setIsAddCustomDocOpen(false);
    showToastNotification(`Persyaratan dokumen "${customDocName.trim()}" berhasil ditambahkan.`);
  };

  // Save changes
  const handleSave = () => {
    if (!candidateName.trim()) {
      alert('Nama kandidat tidak boleh kosong.');
      return;
    }

    setIsSaving(true);

    const updatedCandidate: CandidateEvaluation = {
      ...currentCandidate,
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim(),
      candidatePhone: candidatePhone.trim() || undefined,
      candidateAddress: candidateAddress.trim() || undefined,
      candidateSocialMedia: {
        linkedin: linkedinUrl.trim() || undefined,
        portfolio: portfolioUrl.trim() || undefined
      },
      vacancyId: vacancyId || currentCandidate.vacancyId,
      vacancyTitle: vacancyTitle || currentCandidate.vacancyTitle,
      department: department || currentCandidate.department,
      summary: summary.trim(),
      screeningScore: Number(screeningScore),
      assessmentScore: Number(assessmentScore),
      interviewScore: Number(interviewScore),
      interviewStars,
      testPackageName: currentCandidate.testPackageName,
      testCompletedAt: currentCandidate.testCompletedAt,
      testDurationMinutes: currentCandidate.testDurationMinutes,
      testCategoryScores: currentCandidate.testCategoryScores,
      finalScore: computedFinalScore,
      decisionStatus,
      recruiterNotes: recruiterNotes.trim(),
      documents,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    saveCandidateEvaluation(updatedCandidate);
    if (onSaveProp) {
      onSaveProp(updatedCandidate);
    }

    // Save/update interview record for this candidate
    try {
      const interviewRec: InterviewRecord = {
        id: `IR-${currentCandidate.candidateId}`,
        candidateId: currentCandidate.candidateId,
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim(),
        candidatePhone: candidatePhone.trim(),
        vacancyId: vacancyId || currentCandidate.vacancyId,
        vacancyTitle: vacancyTitle || currentCandidate.vacancyTitle,
        interviewStage: (interviewStage as InterviewStage) || 'User / Technical Interview',
        interviewerName: interviewerName.trim() || 'HR Recruitment Lead',
        interviewDate,
        checklists: interviewChecklists,
        calculatedScore: Number(interviewScore),
        recommendation: (interviewRecommendation as RecommendationStatus) || 'Direkomendasikan',
        strengths: interviewStrengths ? interviewStrengths.split(',').map(s => s.trim()).filter(Boolean) : [],
        areasToProbe: interviewAreasToProbe ? interviewAreasToProbe.split(',').map(s => s.trim()).filter(Boolean) : [],
        generalNotes: recruiterNotes.trim(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      saveInterviewRecord(interviewRec);
    } catch (err) {
      console.error('Error saving interview record:', err);
    }

    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setIsSaving(false);
    }, 1500);
  };

  const handleDelete = () => {
    if (confirm(`Hapus data kandidat "${currentCandidate.candidateName}" secara permanen?`)) {
      deleteCandidateEvaluation(currentCandidate.candidateId);
      if (onDeleteProp) {
        onDeleteProp(currentCandidate.candidateId);
      }
      if (onBack) {
        onBack();
      } else {
        navigate('/kandidat');
      }
    }
  };

  // Candidate Initials for Avatar
  const candidateInitials = (candidateName || currentCandidate.candidateName || 'KD')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Filtered documents by category
  const filteredDocuments = documents.filter(doc => {
    if (selectedFilterCategory === 'Semua') return true;
    return doc.category === selectedFilterCategory;
  });

  // Vacancy Display Info fallback
  const displayLocation = activeVacancy?.location || 'Jakarta Selatan, DKI Jakarta';
  const displayDomicile = activeVacancy?.candidateDomicile || 'Terbuka Semua Domisili';
  const displayWorkType = activeVacancy?.workType || 'Penuh Waktu (Full-Time)';
  const displayWorkModel = activeVacancy?.workModel || 'On-site (WFO)';
  const displayLevel = activeVacancy?.level || 'Staff / Specialist';
  const displayDept = activeVacancy?.department || department || 'Operasional';
  const displayDivision = activeVacancy?.division || activeVacancy?.department || department || 'Umum';
  const displaySalaryMin = activeVacancy?.salaryMin || 8000000;
  const displaySalaryMax = activeVacancy?.salaryMax || 15000000;
  const displaySalary = activeVacancy ? (activeVacancy.salaryDisplay && activeVacancy.salaryMin ? `${formatRupiah(activeVacancy.salaryMin)} - ${formatRupiah(activeVacancy.salaryMax)}` : 'Dirahasiakan') : `${formatRupiah(displaySalaryMin)} - ${formatRupiah(displaySalaryMax)}`;
  const displayRoleSummary = activeVacancy?.atsBreakdown?.roleSummary || activeVacancy?.rawJobTemplate?.tujuanJabatan || `Menjalankan fungsi operasional dan teknis posisi ${vacancyTitle} pada unit kerja ${displayDept}.`;
  const deadlineInfo = getDeadlineStatusText(activeVacancy?.applicationDeadline, activeVacancy?.status);

  return (
    <div className="w-full flex-1 flex flex-col space-y-4">
      <PageHeaderTitle title={`Detail Candidate: ${candidateName || currentCandidate.candidateName}`} />

      {/* Hidden File Input for document uploading */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        className="hidden"
      />

      {/* Full Page Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        {/* Top Header Card */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => onBack ? onBack() : navigate('/kandidat')}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer shrink-0"
              title="Kembali ke Daftar Kandidat"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Initials Avatar */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-white font-black flex items-center justify-center text-base sm:text-lg shrink-0 shadow-inner">
              {candidateInitials}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white leading-tight truncate">
                  {candidateName || currentCandidate.candidateName}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  decisionStatus === 'Lolos (Hired)' ? 'bg-emerald-500/20 border-emerald-300 text-emerald-100' :
                  decisionStatus === 'Offering Sent' ? 'bg-blue-500/20 border-blue-300 text-blue-100' :
                  decisionStatus === 'Talent Pool' ? 'bg-amber-500/20 border-amber-300 text-amber-100' :
                  decisionStatus === 'Ditolak' ? 'bg-rose-500/20 border-rose-300 text-rose-100' :
                  'bg-white/20 border-white/30 text-white'
                }`}>
                  {decisionStatus}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium truncate mt-1 flex items-center gap-2">
                <span>Posisi: <strong>{vacancyTitle || currentCandidate.vacancyTitle}</strong></span>
                <span>•</span>
                <span>Skor Evaluasi: <strong className="text-white font-black">{computedFinalScore}%</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 border border-rose-300/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Kandidat</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saveSuccessMsg ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-extrabold">Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-blue-700" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Full width flex, tanpa ikon, nama terstandar) */}
        <div className="w-full bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profil')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all text-center justify-center flex items-center cursor-pointer w-full ${
              activeTab === 'profil'
                ? 'border-blue-600 text-blue-600 bg-white shadow-2xs font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <span>Profil Data Diri</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('posisi')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all text-center justify-center flex items-center cursor-pointer w-full ${
              activeTab === 'posisi'
                ? 'border-blue-600 text-blue-600 bg-white shadow-2xs font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <span>Posisi Lowongan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('berkas')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all text-center justify-center flex items-center gap-2 cursor-pointer w-full ${
              activeTab === 'berkas'
                ? 'border-blue-600 text-blue-600 bg-white shadow-2xs font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <span>Berkas & Dokumen</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${
              uploadedCount === totalDocs && totalDocs > 0
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {uploadedCount}/{totalDocs}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('penilaian')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all text-center justify-center flex items-center cursor-pointer w-full ${
              activeTab === 'penilaian'
                ? 'border-blue-600 text-blue-600 bg-white shadow-2xs font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <span>Nilai & Keputusan</span>
          </button>
        </div>

        {/* Toast Feedback Notification */}
        {requestToastMsg && (
          <div className="px-4 py-3 bg-blue-600 text-white text-xs font-semibold flex items-center justify-between gap-2 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 shrink-0" />
              <span>{requestToastMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setRequestToastMsg(null)}
              className="text-white/80 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Body Content */}
        <div className="p-5 sm:p-8 bg-white space-y-6">
          {/* TAB 1: PROFIL & DATA DIRI */}
          {activeTab === 'profil' && (
            <TabCandidateProfil
              candidateName={candidateName}
              setCandidateName={setCandidateName}
              candidateEmail={candidateEmail}
              setCandidateEmail={setCandidateEmail}
              candidatePhone={candidatePhone}
              setCandidatePhone={setCandidatePhone}
              candidateAddress={candidateAddress}
              setCandidateAddress={setCandidateAddress}
              vacancyId={vacancyId}
              vacancyTitle={vacancyTitle}
              vacancies={vacancies}
              onSelectVacancy={(selectedId) => {
                setVacancyId(selectedId);
                const matched = vacancies.find(v => v.id === selectedId);
                if (matched) {
                  setVacancyTitle(matched.jobTitle);
                  setDepartment(matched.department);
                  const newJobDocs = resolveJobAdministrativeDocs(selectedId, matched.jobTitle, candidateName);
                  setDocuments(newJobDocs);
                }
              }}
              linkedinUrl={linkedinUrl}
              portfolioUrl={portfolioUrl}
              setLinkedinUrl={setLinkedinUrl}
              setPortfolioUrl={setPortfolioUrl}
              summary={summary}
              setSummary={setSummary}
            />
          )}

          {/* TAB 2: DETAIL POSISI & LOWONGAN */}
          {activeTab === 'posisi' && (
            <TabCandidatePosisi
              activeVacancy={activeVacancy}
              vacancyId={vacancyId}
              vacancyTitle={vacancyTitle}
              vacancies={vacancies}
              deadlineInfo={deadlineInfo}
              displayLocation={displayLocation}
              displayDomicile={displayDomicile}
              displayWorkType={displayWorkType}
              displayWorkModel={displayWorkModel}
              displayLevel={displayLevel}
              displayDept={displayDept}
              displayDivision={displayDivision}
              displaySalary={displaySalary}
              displayRoleSummary={displayRoleSummary}
              onChangeVacancy={(selectedId) => {
                setVacancyId(selectedId);
                const matched = vacancies.find(v => v.id === selectedId);
                if (matched) {
                  setVacancyTitle(matched.jobTitle);
                  setDepartment(matched.department);
                  const newJobDocs = resolveJobAdministrativeDocs(selectedId, matched.jobTitle, candidateName);
                  setDocuments(newJobDocs);
                  showToastNotification(`Posisi lowongan diubah menjadi "${matched.jobTitle}".`);
                }
              }}
            />
          )}

          {/* TAB 3: BERKAS & DOKUMEN ADMINISTRATIF POSISI JOB DESK */}
          {activeTab === 'berkas' && (
            <TabCandidateBerkas
              vacancyTitle={vacancyTitle}
              uploadedCount={uploadedCount}
              totalDocs={totalDocs}
              progressPercentage={progressPercentage}
              verifiedCount={verifiedCount}
              pendingCount={pendingCount}
              selectedFilterCategory={selectedFilterCategory}
              setSelectedFilterCategory={setSelectedFilterCategory}
              isAddCustomDocOpen={isAddCustomDocOpen}
              setIsAddCustomDocOpen={setIsAddCustomDocOpen}
              customDocName={customDocName}
              setCustomDocName={setCustomDocName}
              customDocCategory={customDocCategory}
              setCustomDocCategory={setCustomDocCategory}
              filteredDocuments={filteredDocuments}
              onSyncJobDeskDocs={handleSyncJobDeskDocs}
              onRequestAllPendingDocs={handleRequestAllPendingDocs}
              onAddCustomDocument={handleAddCustomDocument}
              onToggleVerification={handleToggleVerification}
              onTriggerUpload={handleTriggerUpload}
              onRemoveUploadedFile={handleRemoveUploadedFile}
              onRequestSingleDoc={handleRequestSingleDoc}
              onDeleteDocItem={handleDeleteDocItem}
            />
          )}

          {/* TAB 4: NILAI & KEPUTUSAN REKRUTMEN */}
          {activeTab === 'penilaian' && (
            <TabCandidatePenilaian
              currentCandidate={currentCandidate}
              decisionStatus={decisionStatus}
              setDecisionStatus={setDecisionStatus}
              screeningScore={screeningScore}
              assessmentScore={assessmentScore}
              interviewScore={interviewScore}
              interviewStars={interviewStars}
              interviewStage={interviewStage}
              setInterviewStage={setInterviewStage}
              interviewerName={interviewerName}
              setInterviewerName={setInterviewerName}
              interviewRecommendation={interviewRecommendation}
              setInterviewRecommendation={setInterviewRecommendation}
              interviewChecklists={interviewChecklists}
              interviewStrengths={interviewStrengths}
              setInterviewStrengths={setInterviewStrengths}
              interviewAreasToProbe={interviewAreasToProbe}
              setInterviewAreasToProbe={setInterviewAreasToProbe}
              isInterviewRubricOpen={isInterviewRubricOpen}
              setIsInterviewRubricOpen={setIsInterviewRubricOpen}
              computedFinalScore={computedFinalScore}
              recruiterNotes={recruiterNotes}
              setRecruiterNotes={setRecruiterNotes}
              onOpenTestReport={() => setIsTestReportOpen(true)}
              onSetStarRating={handleSetStarRating}
              onUpdateChecklistScore={handleUpdateChecklistScore}
              onUpdateChecklistNotes={handleUpdateChecklistNotes}
            />
          )}
        </div>

        {/* Bottom Bar Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onBack ? onBack() : navigate('/kandidat')}
            className="h-10 px-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="h-10 px-4 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Candidate</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 px-5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saveSuccessMsg ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-white" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Popup Cek Ulang Hasil Tes Online */}
      <ModalTestReport
        isOpen={isTestReportOpen}
        onClose={() => setIsTestReportOpen(false)}
        candidateName={candidateName}
        currentCandidate={currentCandidate}
        assessmentScore={assessmentScore}
      />
    </div>
  );
};

export default CandidateDetailPage;
