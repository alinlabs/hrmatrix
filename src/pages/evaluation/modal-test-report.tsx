import React from 'react';
import { Award, X } from 'lucide-react';
import { Modal } from '../../components/ui/modal';
import { CandidateEvaluation } from './types';

interface ModalTestReportProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  currentCandidate: CandidateEvaluation;
  assessmentScore: number;
}

export const ModalTestReport: React.FC<ModalTestReportProps> = ({
  isOpen,
  onClose,
  candidateName,
  currentCandidate,
  assessmentScore,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
            onClick={onClose}
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
  );
};
