import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Plus, 
  Award, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Sparkles, 
  Save, 
  Send,
  Clock,
  ShieldCheck,
  RefreshCw,
  FileCheck2,
  FileQuestion,
  HelpCircle,
  FileUp,
  RotateCcw,
  Building2,
  Calendar,
  Layers,
  Check,
  ChevronRight,
  ArrowUpRight,
  Lock,
  Star,
  ListChecks,
  UserCheck,
  ChevronDown,
  X
} from 'lucide-react';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSubbar 
} from '../../context/MobileNavContext';
import { Modal } from '../../components/ui/Modal';
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

interface CandidateDetailPageProps {
  candidate?: CandidateEvaluation | null;
  onBack?: () => void;
  onSave?: (updated: CandidateEvaluation) => void;
  onDelete?: (candidateId: string) => void;
}

type PageTab = 'profil' | 'posisi' | 'berkas' | 'penilaian';

// Helper status batas tanggal dibuka
function getDeadlineStatusText(deadlineStr?: string, status?: string) {
  if (status === 'Ditutup') {
    return { isExpired: true, text: 'Sudah Melewati Batas Tanggal Dibuka' };
  }
  if (!deadlineStr) {
    return { isExpired: false, text: 'Dibuka Hingga Posisi Terisi' };
  }
  const parts = deadlineStr.split('-');
  let deadlineDate: Date | null = null;
  if (parts.length === 3 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1])) && !isNaN(Number(parts[2]))) {
    deadlineDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 23, 59, 59);
  } else {
    const parsed = new Date(deadlineStr);
    if (!isNaN(parsed.getTime())) {
      deadlineDate = parsed;
      deadlineDate.setHours(23, 59, 59, 999);
    }
  }
  const now = new Date();
  if (deadlineDate && now > deadlineDate) {
    return { isExpired: true, text: 'Sudah Melewati Batas Tanggal Dibuka' };
  }
  let formattedDate = deadlineStr;
  if (deadlineDate) {
    try {
      formattedDate = deadlineDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch(e) {}
  }
  return { isExpired: false, text: `Dibuka Hingga ${formattedDate}` };
}

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
      <div className="p-8 text-center space-y-4">
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
    <div className="space-y-4 w-full max-w-7xl mx-auto pb-12">
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
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nama Lengkap */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Nama Lengkap Kandidat</span>
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Contoh: Ir. Hendra Wijaya, M.M."
                    className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Alamat Email</span>
                  </label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="nama.kandidat@email.com"
                    className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>

                {/* Telepon / WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Nomor Telepon / WhatsApp</span>
                  </label>
                  <input
                    type="text"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    placeholder="0812-XXXX-XXXX"
                    className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>

                {/* Domisili / Alamat */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Domisili / Kota Asal</span>
                  </label>
                  <input
                    type="text"
                    value={candidateAddress}
                    onChange={(e) => setCandidateAddress(e.target.value)}
                    placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                    className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>

                {/* Lowongan / Posisi Dilamar */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <span>Posisi Job Desk yang Dilamar</span>
                  </label>
                  <select
                    value={vacancyId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setVacancyId(selectedId);
                      const matched = vacancies.find(v => v.id === selectedId);
                      if (matched) {
                        setVacancyTitle(matched.jobTitle);
                        setDepartment(matched.department);
                        // Auto-sync docs for new position
                        const newJobDocs = resolveJobAdministrativeDocs(selectedId, matched.jobTitle, candidateName);
                        setDocuments(newJobDocs);
                      }
                    }}
                    className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  >
                    <option value={vacancyId}>{vacancyTitle || 'Pilih Posisi Lowongan'}</option>
                    {vacancies.filter(v => v.id !== vacancyId).map(v => (
                      <option key={v.id} value={v.id}>{v.jobTitle} ({v.department})</option>
                    ))}
                  </select>
                </div>

                {/* LinkedIn / Portofolio URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tautan LinkedIn / Portofolio Web</span>
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl || portfolioUrl}
                    onChange={(e) => {
                      setLinkedinUrl(e.target.value);
                      setPortfolioUrl(e.target.value);
                    }}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* Ringkasan Profil / Executive Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Ringkasan Profil Kandidat (Executive Summary)</span>
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  placeholder="Ringkasan kualifikasi, pengalaman utama, dan profil profesional..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: DETAIL POSISI & LOWONGAN (IDENTIK DENGAN CARD SCREENING) */}
          {activeTab === 'posisi' && (
            <div className="space-y-5">
              {/* Card Screening Identik Container */}
              <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 sm:p-7 shadow-2xs space-y-5">
                {/* Header Row: Status Batas Tanggal & Badge Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className={`text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                    deadlineInfo.isExpired ? 'text-rose-600' : 'text-slate-600'
                  }`}>
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{deadlineInfo.text}</span>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lowongan {activeVacancy?.status || 'Aktif'}</span>
                  </span>
                </div>

                {/* Nama Posisi, Departemen & Level */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {vacancyTitle || activeVacancy?.jobTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    {displayDept} {displayDivision !== displayDept ? `• ${displayDivision}` : ''} • <strong className="text-slate-700">{displayLevel}</strong>
                  </p>
                </div>

                {/* 4 Mini Cards Grid (Penempatan, Domisili Khusus, Jenis Waktu, Model Kerja) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Card 1: Penempatan */}
                  <div className="p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl space-y-0.5 text-center">
                    <div className="text-[11px] font-normal text-slate-500">Penempatan</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={displayLocation}>
                      {displayLocation}
                    </div>
                  </div>

                  {/* Card 2: Domisili Kandidat Khusus */}
                  <div className="p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl space-y-0.5 text-center">
                    <div className="text-[11px] font-normal text-slate-500">Domisili Kandidat</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={displayDomicile}>
                      {displayDomicile}
                    </div>
                  </div>

                  {/* Card 3: Jenis Waktu */}
                  <div className="p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl space-y-0.5 text-center">
                    <div className="text-[11px] font-normal text-slate-500">Jenis Waktu</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={displayWorkType}>
                      {displayWorkType}
                    </div>
                  </div>

                  {/* Card 4: Model Kerja */}
                  <div className="p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl space-y-0.5 text-center">
                    <div className="text-[11px] font-normal text-slate-500">Model Kerja</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={displayWorkModel}>
                      {displayWorkModel}
                    </div>
                  </div>
                </div>

                {/* Card Rentang Gaji (Hijau Tipis Sesuai Spesifikasi) */}
                <div className="p-4 bg-emerald-50/90 border border-emerald-200/80 rounded-xl space-y-1 text-center">
                  <div className="text-xs font-semibold text-emerald-800/80">
                    Rentang Gaji / Kompensasi Standar Posisi
                  </div>
                  <div className="text-base sm:text-lg font-black text-emerald-800">
                    {displaySalary}
                  </div>
                </div>

                {/* Deskripsi & Ringkasan Peran Jabatan */}
                <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2">
                  <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Tujuan & Ringkasan Tanggung Jawab Posisi</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {displayRoleSummary}
                  </p>
                </div>
              </div>

              {/* Ganti Lowongan Posisi Quick Selector */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  Ingin memindahkan kandidat ke posisi lowongan lain?
                </div>
                <select
                  value={vacancyId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
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
                  className="h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value={vacancyId}>{vacancyTitle || 'Pilih Lowongan'}</option>
                  {vacancies.filter(v => v.id !== vacancyId).map(v => (
                    <option key={v.id} value={v.id}>{v.jobTitle} ({v.department})</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: BERKAS & DOKUMEN ADMINISTRATIF POSISI JOB DESK */}
          {activeTab === 'berkas' && (
            <div className="space-y-5">
              {/* Job Desk Administrative Requirement Header Card */}
              <div className="p-5 bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/70 border border-blue-200/80 rounded-2xl space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                        Persyaratan Job Desk
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {vacancyTitle || 'Dokumen Persyaratan Administrasi'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Daftar berkas administratif resmi untuk posisi ini. HR dapat meminta dokumen ini ke kandidat dan memverifikasi kelengkapannya.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleSyncJobDeskDocs}
                      className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Sinkronkan Ulang dengan Standar Job Desk"
                    >
                      <RotateCcw className="w-4 h-4 text-blue-600" />
                      <span>Sinkron Job Desk</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRequestAllPendingDocs}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Request Semua Dokumen</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar Kelengkapan Dokumen */}
                <div className="space-y-2 pt-2 border-t border-blue-200/60">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-slate-700">
                      Kelengkapan Berkas: <strong className="text-blue-700">{uploadedCount} dari {totalDocs} Dokumen Terpenuhi</strong> ({progressPercentage}%)
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {verifiedCount} Terverifikasi • {pendingCount} Belum/Diminta
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-200/90 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        progressPercentage === 100 
                          ? 'bg-emerald-500' 
                          : progressPercentage >= 60 
                          ? 'bg-blue-600' 
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Filter Tabs & Add Custom Document Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {(['Semua', 'Wajib', 'Pendukung', 'Khusus'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedFilterCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedFilterCategory === cat
                          ? 'bg-white text-blue-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddCustomDocOpen(true)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-blue-700 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Persyaratan Tambahan</span>
                </button>
              </div>

              {/* Form Tambah Dokumen Khusus */}
              {isAddCustomDocOpen && (
                <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span>Tambah Persyaratan Dokumen Administratif</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddCustomDocOpen(false)}
                      className="text-slate-400 hover:text-slate-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-700">Nama Dokumen Persyaratan</label>
                      <input
                        type="text"
                        value={customDocName}
                        onChange={(e) => setCustomDocName(e.target.value)}
                        placeholder="Contoh: Surat Izin Mengemudi (SIM A) / SKCK / Portofolio"
                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Kategori Persyaratan</label>
                      <select
                        value={customDocCategory}
                        onChange={(e) => setCustomDocCategory(e.target.value as DocumentRequirementCategory)}
                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Wajib">Wajib (Mandatory)</option>
                        <option value="Pendukung">Pendukung (Supporting)</option>
                        <option value="Khusus">Khusus / Tambahan</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddCustomDocOpen(false)}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCustomDocument}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Tambahkan ke Daftar</span>
                    </button>
                  </div>
                </div>
              )}

              {/* List of Administrative Documents */}
              <div className="space-y-3">
                {filteredDocuments.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <FileQuestion className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">Tidak ada persyaratan dokumen pada kategori ini</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Pilih kategori lain atau klik "Tambah Persyaratan Tambahan".</p>
                  </div>
                ) : (
                  filteredDocuments.map((doc) => {
                    const isUploaded = !!doc.fileName || doc.status === 'Sudah Diunggah' || doc.status === 'Terverifikasi (Valid)';
                    const isVerified = doc.status === 'Terverifikasi (Valid)';
                    const isRequested = doc.status === 'Diminta ke Kandidat';
                    const isRevision = doc.status === 'Perlu Revisi';

                    return (
                      <div
                        key={doc.id}
                        className={`p-4 bg-white border rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs group ${
                          isVerified ? 'border-emerald-200 hover:border-emerald-300 bg-emerald-50/10' :
                          isUploaded ? 'border-blue-200 hover:border-blue-300' :
                          isRequested ? 'border-amber-200 bg-amber-50/10' :
                          'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Document Info Left */}
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                            isUploaded ? 'bg-blue-50 border-blue-200 text-blue-600' :
                            isRequested ? 'bg-amber-50 border-amber-200 text-amber-600' :
                            'bg-slate-100 border-slate-200 text-slate-400'
                          }`}>
                            {isVerified ? (
                              <ShieldCheck className="w-5 h-5" />
                            ) : isUploaded ? (
                              <FileCheck2 className="w-5 h-5" />
                            ) : isRequested ? (
                              <Clock className="w-5 h-5" />
                            ) : (
                              <FileText className="w-5 h-5" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                {doc.name}
                              </h4>

                              {/* Requirement Category Badge */}
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                                doc.category === 'Wajib' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                                doc.category === 'Pendukung' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                'bg-purple-50 border-purple-200 text-purple-700'
                              }`}>
                                {doc.category}
                              </span>

                              {/* Document Status Tag */}
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                                isVerified ? 'bg-emerald-100 border-emerald-300 text-emerald-800' :
                                isUploaded ? 'bg-blue-100 border-blue-300 text-blue-800' :
                                isRequested ? 'bg-amber-100 border-amber-300 text-amber-800' :
                                isRevision ? 'bg-rose-100 border-rose-300 text-rose-800' :
                                'bg-slate-100 border-slate-300 text-slate-600'
                              }`}>
                                {doc.status}
                              </span>
                            </div>

                            {/* Uploaded / Requested details */}
                            {isUploaded ? (
                              <p className="text-xs text-slate-500 font-medium truncate mt-1 flex items-center gap-2">
                                <span className="font-semibold text-slate-700 truncate">{doc.fileName}</span>
                                {doc.fileSize && <span>• {doc.fileSize}</span>}
                                {doc.uploadedAt && <span>• Diunggah: {doc.uploadedAt}</span>}
                              </p>
                            ) : (
                              <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                                {isRequested ? (
                                  <>
                                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                    <span className="text-amber-700">Telah diminta ke kandidat ({doc.requestedAt || 'Menunggu unggahan'})</span>
                                  </>
                                ) : (
                                  <span>Belum diunggah • Siap diminta ke kandidat</span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions Right */}
                        <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
                          {isUploaded ? (
                            <>
                              {/* Toggle Verification Button */}
                              <button
                                type="button"
                                onClick={() => handleToggleVerification(doc.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isVerified
                                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                                    : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                                }`}
                                title={isVerified ? "Batalkan status Terverifikasi" : "Verifikasi Validitas Dokumen"}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{isVerified ? 'Valid' : 'Verifikasi'}</span>
                              </button>

                              {/* Preview File */}
                              {doc.fileDataUrl ? (
                                <a
                                  href={doc.fileDataUrl}
                                  download={doc.fileName || `${doc.name}.pdf`}
                                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Unduh Berkas"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    alert(`Pratinjau Dokumen: ${doc.name}\nFile: ${doc.fileName || 'dokumen.pdf'}\nKategori: ${doc.category}\nStatus: ${doc.status}`);
                                  }}
                                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Pratinjau Dokumen"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}

                              {/* Ganti File */}
                              <button
                                type="button"
                                onClick={() => handleTriggerUpload(doc.id)}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Ganti File Dokumen"
                              >
                                <FileUp className="w-4 h-4" />
                              </button>

                              {/* Kosongkan File */}
                              <button
                                type="button"
                                onClick={() => handleRemoveUploadedFile(doc.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Kosongkan File"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Tombol Minta ke Kandidat */}
                              <button
                                type="button"
                                onClick={() => handleRequestSingleDoc(doc.id, doc.name)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isRequested
                                    ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                                    : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
                                }`}
                                title="Kirim notifikasi request berkas ke kandidat"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>{isRequested ? 'Minta Ulang' : 'Minta ke Kandidat'}</span>
                              </button>

                              {/* Tombol Langsung Unggah */}
                              <button
                                type="button"
                                onClick={() => handleTriggerUpload(doc.id)}
                                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                                title="Unggah file langsung untuk persyaratan ini"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Unggah</span>
                              </button>

                              {/* Hapus Item Persyaratan */}
                              <button
                                type="button"
                                onClick={() => handleDeleteDocItem(doc.id)}
                                className="p-2 text-slate-300 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                title="Hapus Persyaratan"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: NILAI & KEPUTUSAN REKRUTMEN (VERTIKAL STACK + FIXED SCORE & STAR RATING) */}
          {activeTab === 'penilaian' && (
            <div className="space-y-5">
              {/* Status Keputusan Dropdown */}
              <div className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Status Keputusan Rekrutmen</span>
                </label>
                <select
                  value={decisionStatus}
                  onChange={(e) => setDecisionStatus(e.target.value as HiringDecisionStatus)}
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="Dalam Evaluasi">Dalam Evaluasi (Under Review)</option>
                  <option value="Lolos (Hired)">Lolos (Hired) - Diterima Bekerja</option>
                  <option value="Offering Sent">Offering Sent - Penawaran Gaji Dikirim</option>
                  <option value="Talent Pool">Talent Pool - Disimpan untuk Cadangan</option>
                  <option value="Ditolak">Ditolak (Rejected)</option>
                </select>
              </div>

              {/* 3 Vertically Stacked Score Cards */}
              <div className="flex flex-col space-y-4">
                {/* Card 1: 1. Screening ATS (Fixed / Read-Only) */}
                <div className="p-5 bg-slate-50/90 border border-slate-200/90 rounded-2xl space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">1. Screening ATS (Ekstraksi Resume)</h4>
                        <span className="text-[11px] text-slate-500 font-medium">Bobot Komponen: {currentCandidate.weights?.screening || 25}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold border border-slate-300 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>Nilai Tetap</span>
                      </span>
                      <span className="text-lg font-black text-blue-700">{screeningScore}%</span>
                    </div>
                  </div>

                  {/* Fixed progress bar */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${screeningScore}%` }} />
                  </div>

                  <p className="text-xs text-slate-500 italic">
                    • Nilai Screening ATS terhitung secara permanen dari ekstraksi kecocokan kata kunci CV kandidat terhadap kualifikasi lowongan (Fixed).
                  </p>
                </div>

                {/* Card 2: 2. Tes Online (Fixed / Read-Only + Detail Paket & Cek Ulang Hasil) */}
                <div className="p-5 bg-purple-50/30 border border-purple-200/80 rounded-2xl space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">2. Tes Online (Online Assessment)</h4>
                        <span className="text-[11px] text-slate-500 font-medium">Bobot Komponen: {currentCandidate.weights?.assessment || 35}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold border border-slate-300 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>Nilai Tetap</span>
                      </span>
                      <span className="text-lg font-black text-purple-700">{assessmentScore}%</span>
                    </div>
                  </div>

                  {/* Detail Paket Asesmen & Hasil Pengerjaan */}
                  <div className="p-4 bg-white border border-purple-100 rounded-xl space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Nama Paket Asesmen</div>
                        <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>{currentCandidate.testPackageName || 'Asesmen Kepemimpinan & Potensi Logis'}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsTestReportOpen(true)}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Cek Ulang Hasil Tes</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Durasi Pengerjaan: <strong>{currentCandidate.testDurationMinutes || 35} Menit</strong></span>
                      <span>Tanggal Selesai: <strong>{currentCandidate.testCompletedAt || '2026-10-04'}</strong></span>
                      <span className="text-emerald-700 font-bold">Lulus Kualifikasi Tes</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 italic">
                    • Hasil Tes Online sifatnya tetap berdasarkan skor ujian otomatis kandidat pada platform asesmen.
                  </p>
                </div>

                {/* Card 3: 3. Penilaian Interview & Wawancara */}
                <div className="p-5 bg-amber-50/30 border border-amber-200/90 rounded-2xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">3. Penilaian Wawancara (Interview)</h4>
                        <span className="text-[11px] text-slate-500 font-medium">Bobot Komponen: {currentCandidate.weights?.interview || 40}%</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-amber-700">{interviewScore}%</span>
                      <span className="text-[10px] text-slate-500 block font-semibold">Skor Wawancara</span>
                    </div>
                  </div>

                  {/* Sesi & Evaluator Info Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-white border border-amber-200/80 rounded-xl text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Tahap Wawancara</span>
                      <select
                        value={interviewStage}
                        onChange={(e) => setInterviewStage(e.target.value as InterviewStage)}
                        className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="HR Screening Interview">HR Screening Interview</option>
                        <option value="User / Technical Interview">User / Technical Interview</option>
                        <option value="Final Interview / Direksi">Final Interview / Direksi</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Pewawancara / Evaluator</span>
                      <input
                        type="text"
                        value={interviewerName}
                        onChange={(e) => setInterviewerName(e.target.value)}
                        placeholder="Nama pewawancara..."
                        className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Rekomendasi Wawancara</span>
                      <select
                        value={interviewRecommendation}
                        onChange={(e) => setInterviewRecommendation(e.target.value as RecommendationStatus)}
                        className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Sangat Direkomendasikan">Sangat Direkomendasikan</option>
                        <option value="Direkomendasikan">Direkomendasikan</option>
                        <option value="Dipertimbangkan">Dipertimbangkan / Cadangan</option>
                        <option value="Tidak Direkomendasikan">Tidak Direkomendasikan</option>
                      </select>
                    </div>
                  </div>

                  {/* Interactive 5-Star Rating Component */}
                  <div className="p-4 bg-white border border-amber-200/80 rounded-xl space-y-2 text-center">
                    <div className="text-xs sm:text-sm font-bold text-slate-800">
                      Rating Bintang Hasil Wawancara (1 - 5 Bintang):
                    </div>

                    <div className="flex items-center justify-center gap-2.5 py-1">
                      {[1, 2, 3, 4, 5].map((starNum) => {
                        const isActive = starNum <= interviewStars;
                        return (
                          <button
                            key={starNum}
                            type="button"
                            onClick={() => handleSetStarRating(starNum)}
                            className="p-1.5 hover:scale-115 active:scale-95 transition-all cursor-pointer focus:outline-none"
                            title={`Pilih ${starNum} Bintang (${starNum * 20}%)`}
                          >
                            <Star
                              className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors ${
                                isActive
                                  ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                                  : 'fill-slate-100 text-slate-300 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-xs sm:text-sm font-extrabold text-amber-800">
                      {interviewStars === 5 && '5 / 5 Bintang • Sangat Unggul / Exceeds Expectation (100%)'}
                      {interviewStars === 4 && '4 / 5 Bintang • Baik & Relevan / Highly Recommended (80%)'}
                      {interviewStars === 3 && '3 / 5 Bintang • Cukup / Meets Expectation (60%)'}
                      {interviewStars === 2 && '2 / 5 Bintang • Perlu Evaluasi Ulang / Borderline (40%)'}
                      {interviewStars === 1 && '1 / 5 Bintang • Kurang Sesuai / Not Recommended (20%)'}
                    </div>
                  </div>

                  {/* Button to toggle 10-aspect rubric checklist */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsInterviewRubricOpen(prev => !prev)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-100/70 hover:bg-amber-100 px-3 py-2 rounded-xl border border-amber-300/70 transition-all cursor-pointer w-fit"
                    >
                      <ListChecks className="w-4 h-4 text-amber-700" />
                      <span>{isInterviewRubricOpen ? 'Tutup Rubrik & 10 Aspek Penilaian' : 'Buka Rubrik & 10 Aspek Penilaian Detail'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-amber-700 transition-transform duration-200 ${isInterviewRubricOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <span className="text-[11px] text-slate-500">
                      {interviewChecklists.filter(c => c.score >= 4).length} dari {interviewChecklists.length} aspek bernilai tinggi
                    </span>
                  </div>

                  {/* Expandable 10-Aspect Rubric Checklist */}
                  {isInterviewRubricOpen && (
                    <div className="space-y-3 pt-2 border-t border-amber-200/70">
                      <div className="grid grid-cols-1 gap-2.5">
                        {interviewChecklists.map((item, idx) => (
                          <div 
                            key={item.id}
                            className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-3xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                    {item.category}
                                  </span>
                                  <span className="text-xs font-bold text-slate-900">
                                    {idx + 1}. {item.label}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {item.description}
                                </p>
                              </div>

                              {/* Aspect Rating Stars 1-5 */}
                              <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => handleUpdateChecklistScore(item.id, s)}
                                    className="p-1 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                    title={`Nilai ${s} / 5`}
                                  >
                                    <Star
                                      className={`w-4 h-4 ${
                                        s <= item.score
                                          ? 'fill-amber-400 text-amber-500'
                                          : 'fill-slate-100 text-slate-300'
                                      }`}
                                    />
                                  </button>
                                ))}
                                <span className="text-xs font-bold text-slate-700 ml-1.5 min-w-[2.5rem] text-right">
                                  {item.score * 20}%
                                </span>
                              </div>
                            </div>

                            {/* Note input per aspect */}
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) => handleUpdateChecklistNotes(item.id, e.target.value)}
                              placeholder="Catatan evaluator untuk aspek ini..."
                              className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Strengths & Areas to Probe */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Kelebihan Utama (Strengths)</label>
                          <input
                            type="text"
                            value={interviewStrengths}
                            onChange={(e) => setInterviewStrengths(e.target.value)}
                            placeholder="Contoh: Komunikasi lugas, portofolio kuat..."
                            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Area Perlu Pendalaman (Areas to Probe)</label>
                          <input
                            type="text"
                            value={interviewAreasToProbe}
                            onChange={(e) => setInterviewAreasToProbe(e.target.value)}
                            placeholder="Contoh: Penguasaan framework baru..."
                            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 italic">
                    • Penyesuaian nilai interview akan otomatis mengkalkulasi ulang Skor Akhir Evaluasi secara realtime.
                  </p>
                </div>
              </div>

              {/* Total Calculation Strip */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-blue-900 block">Kalkulasi Skor Akhir Otomatis</span>
                    <span className="text-xs text-blue-700">Berdasarkan bobot terstandar HRMatrix</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-blue-700">{computedFinalScore}%</span>
                </div>
              </div>

              {/* Recruiter Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Catatan Khusus Rekruiter & Evaluator</span>
                </label>
                <textarea
                  value={recruiterNotes}
                  onChange={(e) => setRecruiterNotes(e.target.value)}
                  rows={4}
                  placeholder="Tuliskan catatan evaluasi, kelebihan kandidat, kesesuaian ekspektasi gaji, atau tanggal mulai bergabung..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all leading-relaxed"
                />
              </div>
            </div>
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
      <Modal
        isOpen={isTestReportOpen}
        onClose={() => setIsTestReportOpen(false)}
        contentClassName="sm:max-w-lg"
      >
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Laporan Hasil Tes Online</h3>
                <p className="text-xs text-slate-500">{candidateName} • {currentCandidate.testPackageName || 'Asesmen Online'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsTestReportOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-purple-900 font-bold block">Skor Total Asesmen Online</span>
              <span className="text-[11px] text-purple-700">Durasi: {currentCandidate.testDurationMinutes || 35} Menit • Terverifikasi System</span>
            </div>
            <span className="text-2xl font-black text-purple-700">{assessmentScore}%</span>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800">Rincian Per Kategori Asesmen:</h4>
            {(currentCandidate.testCategoryScores || [
              { category: 'Kemampuan Kognitif & Logika', score: Math.min(100, assessmentScore + 4) },
              { category: 'Kompetensi Teknis Spesifik', score: assessmentScore },
              { category: 'Kesesuaian Kepribadian & Profil Kerja', score: Math.max(60, assessmentScore - 3) }
            ]).map((cat, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{cat.category}</span>
                  <span className="text-purple-700 font-extrabold">{cat.score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${cat.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CandidateDetailPage;
