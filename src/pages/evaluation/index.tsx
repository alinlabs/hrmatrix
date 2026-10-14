import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Search, 
  SlidersHorizontal, 
  Briefcase, 
  X,
  Sliders,
  CheckCircle2,
  FileText,
  FileCheck,
  Paperclip,
  Edit3
} from 'lucide-react';
import { 
  PageHeaderTitle, 
  DesktopHeaderActions, 
  MobileHeaderActions, 
  PageHeaderSearch 
} from '../../context/MobileNavContext';
import { Modal } from '../../components/ui/Modal';
import { InitialEmptyCard } from '../../components/ui/initial-empty-card';
import emptyJobdeskAnimation from '../../assets/animations/empty-jobdesk.json';
import { 
  CandidateEvaluation, 
  EvaluationWeights, 
  HiringDecisionStatus 
} from './types';
import { 
  getMergedCandidateEvaluations, 
  getStoredEvaluationWeights, 
  saveEvaluationWeights, 
  saveCandidateEvaluation,
  deleteCandidateEvaluation
} from './evaluation-storage';
import { getStoredVacancies } from '../lowongan/storage-helper';
import { ModalEditCandidate } from './modal-edit-candidate';

export function EvaluationPage() {
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState<CandidateEvaluation[]>([]);
  const [weights, setWeights] = useState<EvaluationWeights>(getStoredEvaluationWeights());
  const [selectedVacancy, setSelectedVacancy] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Modals state
  const [isWeightsModalOpen, setIsWeightsModalOpen] = useState<boolean>(false);
  const [tempWeights, setTempWeights] = useState<EvaluationWeights>(weights);

  const refreshData = () => {
    const loaded = getMergedCandidateEvaluations();
    setEvaluations(loaded);
    setWeights(getStoredEvaluationWeights());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const vacancies = useMemo(() => getStoredVacancies(), []);

  const handleOpenWeightsModal = () => {
    setTempWeights(weights);
    setIsWeightsModalOpen(true);
  };

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = Number(tempWeights.screening) + Number(tempWeights.assessment) + Number(tempWeights.interview);
    if (sum !== 100) {
      alert(`Total bobot harus tepat 100%! Saat ini total bobot adalah ${sum}%.`);
      return;
    }
    saveEvaluationWeights(tempWeights);
    setWeights(tempWeights);
    setIsWeightsModalOpen(false);
    refreshData();
  };

  const handleOpenEditCandidateModal = (item: CandidateEvaluation) => {
    navigate(`/kandidat/${item.candidateId}`);
  };

  // Filtered and sorted candidate evaluations
  const filtered = useMemo(() => {
    return evaluations.filter(e => {
      const matchesVac = selectedVacancy === 'ALL' || e.vacancyId === selectedVacancy;
      const matchesStatus = selectedStatus === 'ALL' || e.decisionStatus === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        e.candidateName.toLowerCase().includes(q) ||
        e.vacancyTitle.toLowerCase().includes(q) ||
        e.candidateEmail.toLowerCase().includes(q);
      return matchesVac && matchesStatus && matchesSearch;
    });
  }, [evaluations, selectedVacancy, selectedStatus, searchQuery]);

  const sortedFiltered = useMemo(() => {
    return [...filtered].sort((a, b) => b.finalScore - a.finalScore);
  }, [filtered]);


  const headerActionsContent = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className={`h-8 w-8 sm:h-9 sm:w-9 bg-white hover:bg-slate-50 border rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center relative ${
          searchQuery
            ? 'border-blue-300 text-blue-600 bg-blue-50/50'
            : 'border-slate-200 text-slate-700 hover:text-blue-600'
        }`}
        title="Cari Evaluasi"
      >
        <Search className="w-4 h-4" />
        {searchQuery && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      <button
        type="button"
        onClick={handleOpenWeightsModal}
        className="h-8 sm:h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer text-xs font-semibold"
        title="Atur Bobot Penilaian"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Atur Bobot</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto">
      {/* Page Header (SPEC_HEADER_PAGE) */}
      <PageHeaderTitle
        title="Candidate"
        subtitle="Daftar & evaluasi kandidat rekrutmen"
      />

      {!isSearchOpen && (
        <>
          <DesktopHeaderActions>{headerActionsContent}</DesktopHeaderActions>
          <MobileHeaderActions>{headerActionsContent}</MobileHeaderActions>
        </>
      )}

      {isSearchOpen && (
        <PageHeaderSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
          }}
          placeholder="Cari kandidat, posisi, atau email..."
        />
      )}

      {/* Active Weights Bar - Clean 3-Column Compact Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-normal">1. Screening (ATS)</span>
            <span className="text-xs font-bold text-slate-800">Resume & Kualifikasi</span>
          </div>
          <span className="text-sm font-extrabold text-blue-600">{weights.screening}%</span>
        </div>

        <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-normal">2. Assessment Test</span>
            <span className="text-xs font-bold text-slate-800">Psikometri & Kognitif</span>
          </div>
          <span className="text-sm font-extrabold text-blue-600">{weights.assessment}%</span>
        </div>

        <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-normal">3. Interview Checklist</span>
            <span className="text-xs font-bold text-slate-800">Teknis & Culture Fit</span>
          </div>
          <span className="text-sm font-extrabold text-blue-600">{weights.interview}%</span>
        </div>
      </div>

      {/* Filter and Count Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <select
            value={selectedVacancy}
            onChange={(e) => setSelectedVacancy(e.target.value)}
            className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">Semua Lowongan</option>
            {vacancies.map(v => (
              <option key={v.id} value={v.id}>{v.jobTitle}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">Semua Status Keputusan</option>
            <option value="Lolos (Hired)">Lolos (Hired)</option>
            <option value="Offering Sent">Offering Sent</option>
            <option value="Talent Pool">Talent Pool</option>
            <option value="Ditolak">Ditolak</option>
            <option value="Dalam Evaluasi">Dalam Evaluasi</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium text-right shrink-0">
          Total {sortedFiltered.length} Kandidat Terdaftar
        </div>
      </div>

      {/* Candidates List / Empty State */}
      {sortedFiltered.length === 0 ? (
        <InitialEmptyCard
          id="empty-evaluation-list"
          title="Daftar Candidate Rekrutmen"
          description="Daftar lengkap kandidat beserta kombinasi hasil Screening ATS, Assessment Online, dan Interview."
          buttonText="Jelajahi Screening Pelamar"
          ButtonIcon={Award}
          onAction={() => navigate('/lowongan')}
          animationData={emptyJobdeskAnimation}
          trustNote="Kalkulasi bobot persentase terstandar • Rekomendasi objektif berbasis data"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFiltered.map((cand) => {
            const isHired = cand.decisionStatus === 'Lolos (Hired)';
            const isOffering = cand.decisionStatus === 'Offering Sent';
            const isTalentPool = cand.decisionStatus === 'Talent Pool';
            const isRejected = cand.decisionStatus === 'Ditolak';

            const initials = (cand.candidateName || 'KD')
              .split(' ')
              .filter(Boolean)
              .map(n => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            const docCount = cand.documents?.length || 3;

            return (
              <div
                key={cand.candidateId}
                onClick={() => handleOpenEditCandidateModal(cand)}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-3.5 group cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Initials Avatar (No numbers like #1, #2) */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition-transform">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight truncate group-hover:text-blue-600 transition-colors">
                          {cand.candidateName}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1 truncate">
                          <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{cand.vacancyTitle}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-blue-600">{cand.finalScore}%</div>
                      <div className="text-[10px] text-slate-400 font-medium">Skor Total</div>
                    </div>
                  </div>

                  {/* 3 Pillars Score Strip */}
                  <div className="grid grid-cols-3 gap-2 py-2 bg-slate-50/80 rounded-xl px-2.5 border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-normal">Screening</span>
                      <span className="text-xs font-bold text-slate-800">{cand.screeningScore}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-normal">Assessment</span>
                      <span className="text-xs font-bold text-slate-800">{cand.assessmentScore}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-normal">Interview</span>
                      <span className="text-xs font-bold text-slate-800">{cand.interviewScore}%</span>
                    </div>
                  </div>

                  {cand.recruiterNotes && (
                    <p className="text-[11px] text-slate-600 italic bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 mt-2.5 line-clamp-2">
                      "{cand.recruiterNotes}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      isHired ? 'bg-emerald-500' :
                      isOffering ? 'bg-blue-500' :
                      isTalentPool ? 'bg-amber-500' :
                      isRejected ? 'bg-rose-500' : 'bg-slate-400'
                    }`} />
                    <span className={`text-[11px] font-semibold truncate ${
                      isHired ? 'text-emerald-700' :
                      isOffering ? 'text-blue-700' :
                      isTalentPool ? 'text-amber-700' :
                      isRejected ? 'text-rose-700' : 'text-slate-600'
                    }`}>
                      {cand.decisionStatus}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditCandidateModal(cand);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Data & Berkas</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Atur Bobot Penilaian (SPEC_MODAL) */}
      <Modal
        isOpen={isWeightsModalOpen}
        onClose={() => setIsWeightsModalOpen(false)}
        contentClassName="sm:max-w-md flex flex-col"
      >
        <form onSubmit={handleSaveWeights} className="flex flex-col flex-1 min-h-0 bg-white rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  Bobot Penilaian Rekrutmen
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  Total akumulasi ketiga komponen wajib 100%
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsWeightsModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1 min-h-0">
            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                1. Screening (ATS Match Score) (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={tempWeights.screening}
                onChange={(e) => setTempWeights(prev => ({ ...prev, screening: Number(e.target.value) }))}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                2. Assessment (Hasil Tes Online) (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={tempWeights.assessment}
                onChange={(e) => setTempWeights(prev => ({ ...prev, assessment: Number(e.target.value) }))}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                3. Interview (Form Checklist Wawancara) (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={tempWeights.interview}
                onChange={(e) => setTempWeights(prev => ({ ...prev, interview: Number(e.target.value) }))}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Total Akumulasi:</span>
              <span className={
                Number(tempWeights.screening) + Number(tempWeights.assessment) + Number(tempWeights.interview) === 100
                  ? 'text-emerald-600 font-bold'
                  : 'text-rose-600 font-bold'
              }>
                {Number(tempWeights.screening) + Number(tempWeights.assessment) + Number(tempWeights.interview)}%
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
            <button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Terapkan Bobot Penilaian
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

export default EvaluationPage;

