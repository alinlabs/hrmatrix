import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckSquare, 
  Star, 
  Trash2, 
  UserCheck, 
  ClipboardList 
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Modal } from '../../components/ui/Modal';
import { 
  SampleCandidateProfile, 
  InterviewRecord, 
  InterviewChecklistItem, 
  InterviewStage, 
  RecommendationStatus 
} from './types';
import { 
  DEFAULT_CHECKLIST_ITEMS, 
  calculateScoreFromChecklist 
} from './interview-storage';

interface ModalInterviewChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: SampleCandidateProfile | null;
  existingRecord?: InterviewRecord | null;
  onSave: (record: InterviewRecord) => void;
  onDelete?: (recordId: string) => void;
}

export const ModalInterviewChecklist: React.FC<ModalInterviewChecklistProps> = ({
  isOpen,
  onClose,
  candidate,
  existingRecord,
  onSave,
  onDelete,
}) => {
  const [activeStage, setActiveStage] = useState<InterviewStage>('User / Technical Interview');
  const [interviewerName, setInterviewerName] = useState<string>('HR Recruitment Lead');
  const [interviewDate, setInterviewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [checklists, setChecklists] = useState<InterviewChecklistItem[]>(DEFAULT_CHECKLIST_ITEMS);
  const [strengthsText, setStrengthsText] = useState<string>('');
  const [areasToProbeText, setAreasToProbeText] = useState<string>('');
  const [generalNotes, setGeneralNotes] = useState<string>('');
  const [recommendation, setRecommendation] = useState<RecommendationStatus>('Direkomendasikan');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (existingRecord) {
        setActiveStage(existingRecord.interviewStage);
        setInterviewerName(existingRecord.interviewerName);
        setInterviewDate(existingRecord.interviewDate);
        setChecklists(existingRecord.checklists);
        setStrengthsText(existingRecord.strengths.join(', '));
        setAreasToProbeText(existingRecord.areasToProbe.join(', '));
        setGeneralNotes(existingRecord.generalNotes);
        setRecommendation(existingRecord.recommendation);
      } else {
        setActiveStage('User / Technical Interview');
        setInterviewerName('HR Recruitment Lead');
        setInterviewDate(new Date().toISOString().split('T')[0]);
        setChecklists(DEFAULT_CHECKLIST_ITEMS);
        setStrengthsText('');
        setAreasToProbeText('');
        setGeneralNotes('');
        setRecommendation('Direkomendasikan');
      }
    }
  }, [isOpen, existingRecord]);

  if (!candidate) return null;

  const computedCurrentScore = calculateScoreFromChecklist(checklists);

  const handleScoreChange = (itemId: string, newScore: number) => {
    setChecklists(prev => prev.map(item => 
      item.id === itemId ? { ...item, score: newScore } : item
    ));
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    setChecklists(prev => prev.map(item => 
      item.id === itemId ? { ...item, notes } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const record: InterviewRecord = {
        id: existingRecord ? existingRecord.id : `IR-${Date.now()}`,
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateEmail: candidate.email || existingRecord?.candidateEmail || '',
        candidatePhone: candidate.phone || existingRecord?.candidatePhone || '',
        vacancyId: candidate.vacancyId,
        vacancyTitle: candidate.vacancyTitle,
        interviewStage: activeStage,
        interviewerName,
        interviewDate,
        checklists,
        calculatedScore: computedCurrentScore,
        strengths: strengthsText.split(',').map(s => s.trim()).filter(Boolean),
        areasToProbe: areasToProbeText.split(',').map(s => s.trim()).filter(Boolean),
        generalNotes,
        recommendation,
        createdAt: existingRecord?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onSave(record);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-2xl max-h-[90vh] flex flex-col"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 bg-white rounded-2xl overflow-hidden">
        {/* Header (SPEC_MODAL) */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Form Checklist Interview
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                {candidate.name} • {candidate.vacancyTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <div className="text-right pr-2 border-r border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Skor Skor</span>
              <span className="text-base font-extrabold text-blue-600">{computedCurrentScore}%</span>
            </div>

            {existingRecord && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Hapus hasil penilaian interview ini?')) {
                    onDelete(existingRecord.id);
                    onClose();
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Hapus Nilai"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-5 text-xs">
          
          {/* Session Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">Tahap Wawancara</label>
              <select
                value={activeStage}
                onChange={(e) => setActiveStage(e.target.value as InterviewStage)}
                className="w-full h-9 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <option value="HR Interview">HR Interview</option>
                <option value="User / Technical Interview">User / Technical Interview</option>
                <option value="Final Culture Fit">Final Culture Fit & Board</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">Nama Pewawancara</label>
              <input
                type="text"
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-normal text-slate-800"
                placeholder="Nama pewawancara"
              />
            </div>

            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">Tanggal Wawancara</label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-normal text-slate-800"
              />
            </div>
          </div>

          {/* Checklist Categories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                Poin Checklist Penilaian (1 - 5 Bintang)
              </h4>
              <span className="text-[11px] text-slate-400">1 = Kurang, 5 = Sangat Baik</span>
            </div>

            {['Kompetensi Teknis & Pengalaman', 'Soft Skills & Perilaku', 'Culture Fit & Motivasi', 'Kepemimpinan & Problem Solving'].map((category) => {
              const itemsInCategory = checklists.filter(c => c.category === category);
              if (itemsInCategory.length === 0) return null;

              return (
                <div key={category} className="space-y-2.5 bg-slate-50/60 rounded-xl border border-slate-200/80 p-3.5">
                  <div className="text-xs font-bold text-slate-700">
                    {category}
                  </div>

                  <div className="space-y-3 pt-1">
                    {itemsInCategory.map((item) => (
                      <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-800">{item.criteria}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleScoreChange(item.id, star)}
                                className="p-1 hover:scale-110 transition-transform cursor-pointer"
                              >
                                <Star 
                                  className={cn(
                                    'w-4 h-4',
                                    star <= item.score 
                                      ? 'text-amber-400 fill-amber-400' 
                                      : 'text-slate-200'
                                  )} 
                                />
                              </button>
                            ))}
                            <span className="text-xs font-bold text-slate-700 w-5 text-right ml-1">{item.score}</span>
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Catatan kualitatif kriteria..."
                          value={item.notes || ''}
                          onChange={(e) => handleNotesChange(item.id, e.target.value)}
                          className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-normal focus:bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Qualitative Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Kekuatan Utama Kandidat
              </label>
              <textarea
                rows={2}
                value={strengthsText}
                onChange={(e) => setStrengthsText(e.target.value)}
                placeholder="Keahlian teknis, komunikasi lugas, problem solving..."
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-normal text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-normal text-slate-600 mb-1">
                Area Perlu Diperhatikan
              </label>
              <textarea
                rows={2}
                value={areasToProbeText}
                onChange={(e) => setAreasToProbeText(e.target.value)}
                placeholder="Adaptasi teknologi baru, negosiasi gaji..."
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-normal text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-normal text-slate-600 mb-1">
              Catatan Umum Wawancara
            </label>
            <textarea
              rows={2}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Rangkuman kesan interviewer dan kesiapan kandidat..."
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-normal text-slate-800"
            />
          </div>

          {/* Recommendation Segmented Options */}
          <div>
            <label className="block text-[11px] font-normal text-slate-600 mb-1.5">
              Rekomendasi Akhir Pewawancara
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Sangat Direkomendasikan', 'Direkomendasikan', 'Dipertimbangkan', 'Tidak Direkomendasikan'] as RecommendationStatus[]).map((recOpt) => (
                <button
                  key={recOpt}
                  type="button"
                  onClick={() => setRecommendation(recOpt)}
                  className={cn(
                    'p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer',
                    recommendation === recOpt
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  )}
                >
                  {recOpt}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer (SPEC_MODAL: Single Full-Width Primary Action) */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Hasil Wawancara'}
          </button>
        </div>

      </form>
    </Modal>
  );
};
