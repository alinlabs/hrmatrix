import React from 'react';
import {
  CheckCircle2,
  FileText,
  Lock,
  Award,
  Sparkles,
  Eye,
  UserCheck,
  Star,
  ListChecks,
  ChevronDown,
} from 'lucide-react';
import { CandidateEvaluation, HiringDecisionStatus } from './types';
import { InterviewChecklistItem, InterviewStage, RecommendationStatus } from '../interview/types';

interface TabCandidatePenilaianProps {
  currentCandidate: CandidateEvaluation;
  decisionStatus: HiringDecisionStatus;
  setDecisionStatus: (status: HiringDecisionStatus) => void;
  screeningScore: number;
  assessmentScore: number;
  interviewScore: number;
  interviewStars: number;
  interviewStage: InterviewStage;
  setInterviewStage: (stage: InterviewStage) => void;
  interviewerName: string;
  setInterviewerName: (name: string) => void;
  interviewRecommendation: RecommendationStatus;
  setInterviewRecommendation: (rec: RecommendationStatus) => void;
  interviewChecklists: InterviewChecklistItem[];
  interviewStrengths: string;
  setInterviewStrengths: (val: string) => void;
  interviewAreasToProbe: string;
  setInterviewAreasToProbe: (val: string) => void;
  isInterviewRubricOpen: boolean;
  setIsInterviewRubricOpen: React.Dispatch<React.SetStateAction<boolean>>;
  computedFinalScore: number;
  recruiterNotes: string;
  setRecruiterNotes: (val: string) => void;
  onOpenTestReport: () => void;
  onSetStarRating: (stars: number) => void;
  onUpdateChecklistScore: (itemId: string, newScore: number) => void;
  onUpdateChecklistNotes: (itemId: string, newNotes: string) => void;
}

export const TabCandidatePenilaian: React.FC<TabCandidatePenilaianProps> = ({
  currentCandidate,
  decisionStatus,
  setDecisionStatus,
  screeningScore,
  assessmentScore,
  interviewScore,
  interviewStars,
  interviewStage,
  setInterviewStage,
  interviewerName,
  setInterviewerName,
  interviewRecommendation,
  setInterviewRecommendation,
  interviewChecklists,
  interviewStrengths,
  setInterviewStrengths,
  interviewAreasToProbe,
  setInterviewAreasToProbe,
  isInterviewRubricOpen,
  setIsInterviewRubricOpen,
  computedFinalScore,
  recruiterNotes,
  setRecruiterNotes,
  onOpenTestReport,
  onSetStarRating,
  onUpdateChecklistScore,
  onUpdateChecklistNotes,
}) => {
  return (
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
                onClick={onOpenTestReport}
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
                    onClick={() => onSetStarRating(starNum)}
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
                            onClick={() => onUpdateChecklistScore(item.id, s)}
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
                      onChange={(e) => onUpdateChecklistNotes(item.id, e.target.value)}
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
  );
};
