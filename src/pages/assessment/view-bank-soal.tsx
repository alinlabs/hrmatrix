import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Brain, 
  Sparkles, 
  Briefcase, 
  Languages, 
  Award, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Tag,
  Pencil,
  Trash2,
  Check,
  RotateCcw
} from 'lucide-react';
import { TestQuestion, TestCategory, CATEGORY_LABELS, CATEGORY_BADGE_COLORS } from './types';
import { deleteQuestionFromBank, resetQuestionBankToDefault } from './storage-assessment';

interface QuestionBankViewProps {
  allBankQuestions: TestQuestion[];
  onOpenCreateQuestion: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onDeleteQuestion?: (id: string) => void;
  onEditQuestion?: (question: TestQuestion) => void;
  onResetBankToDefault?: () => void;
}

const DISPLAY_CATEGORY_TITLES: Record<string, string> = {
  personality: 'Psikotes',
  cognitive: 'Logika',
  situational: 'Etika',
  language: 'Bahasa',
  leadership: 'Kepemimpinan',
  technical: 'Teknis',
  comprehensive: 'Komprehensif'
};

const CATEGORY_ORDER: string[] = [
  'personality',
  'cognitive',
  'situational',
  'language',
  'leadership',
  'technical',
  'comprehensive'
];

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  allBankQuestions,
  onOpenCreateQuestion,
  searchQuery,
  setSearchQuery,
  onDeleteQuestion,
  onEditQuestion,
  onResetBankToDefault
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Individual Category Counts
  const totalCount = allBankQuestions.length;

  const personalityCount = useMemo(() => {
    return allBankQuestions.filter(q => q.category === 'personality').length;
  }, [allBankQuestions]);

  const cognitiveCount = useMemo(() => {
    return allBankQuestions.filter(q => q.category === 'cognitive').length;
  }, [allBankQuestions]);

  const situationalCount = useMemo(() => {
    return allBankQuestions.filter(q => q.category === 'situational').length;
  }, [allBankQuestions]);

  const languageCount = useMemo(() => {
    return allBankQuestions.filter(q => q.category === 'language').length;
  }, [allBankQuestions]);

  const leadershipCount = useMemo(() => {
    return allBankQuestions.filter(q => q.category === 'leadership').length;
  }, [allBankQuestions]);

  const filteredQuestions = useMemo(() => {
    return allBankQuestions.filter((q) => {
      let matchCat = true;
      if (selectedCategoryFilter !== 'all') {
        matchCat = q.category === selectedCategoryFilter;
      }

      let matchSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        matchSearch = Boolean(
          q.questionText.toLowerCase().includes(query) ||
          (q.scenario && q.scenario.toLowerCase().includes(query)) ||
          (q.tags && q.tags.some(t => t.toLowerCase().includes(query)))
        );
      }

      return matchCat && matchSearch;
    });
  }, [allBankQuestions, selectedCategoryFilter, searchQuery]);

  // Group questions by Category for display with headers outside cards
  const groupedQuestions = useMemo(() => {
    const groups: Array<{ categoryKey: string; title: string; questions: TestQuestion[] }> = [];
    const map: Record<string, TestQuestion[]> = {};

    filteredQuestions.forEach((q) => {
      const catKey = q.category || 'personality';
      if (!map[catKey]) map[catKey] = [];
      map[catKey].push(q);
    });

    CATEGORY_ORDER.forEach((catKey) => {
      if (map[catKey] && map[catKey].length > 0) {
        groups.push({
          categoryKey: catKey,
          title: DISPLAY_CATEGORY_TITLES[catKey] || CATEGORY_LABELS[catKey as TestCategory] || catKey,
          questions: map[catKey]
        });
        delete map[catKey];
      }
    });

    Object.keys(map).forEach((catKey) => {
      if (map[catKey] && map[catKey].length > 0) {
        groups.push({
          categoryKey: catKey,
          title: DISPLAY_CATEGORY_TITLES[catKey] || catKey,
          questions: map[catKey]
        });
      }
    });

    return groups;
  }, [filteredQuestions]);

  const renderCategoryBadge = (cat?: TestCategory) => {
    const categoryKey = cat || 'personality';
    const label = CATEGORY_LABELS[categoryKey] || categoryKey;
    const colors = CATEGORY_BADGE_COLORS[categoryKey] || { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };

    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
        {label}
      </span>
    );
  };

  const handleStatCardClick = (cat: string) => {
    if (selectedCategoryFilter === cat && cat !== 'all') {
      setSelectedCategoryFilter('all');
    } else {
      setSelectedCategoryFilter(cat);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      
      {/* 6 STATISTIC CARDS GRID (2 Rows of 3 Columns) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            id: 'all',
            label: 'Total Koleksi',
            count: totalCount,
            sub: 'Semua Koleksi Bank',
            icon: Layers,
            iconColor: 'text-blue-600',
          },
          {
            id: 'personality',
            label: 'Psikotes',
            count: personalityCount,
            sub: 'DISC Kuadran',
            icon: Brain,
            iconColor: 'text-indigo-600',
          },
          {
            id: 'cognitive',
            label: 'Logika',
            count: cognitiveCount,
            sub: 'TPA & Penalaran',
            icon: Sparkles,
            iconColor: 'text-sky-600',
          },
          {
            id: 'situational',
            label: 'Etika',
            count: situationalCount,
            sub: 'SJT Studi Kasus',
            icon: Briefcase,
            iconColor: 'text-teal-600',
          },
          {
            id: 'language',
            label: 'Bahasa',
            count: languageCount,
            sub: 'Inggris Bisnis',
            icon: Languages,
            iconColor: 'text-amber-600',
          },
          {
            id: 'leadership',
            label: 'Kepemimpinan',
            count: leadershipCount,
            sub: 'Manajerial & Leadership',
            icon: Award,
            iconColor: 'text-purple-600',
          },
        ].map((card) => {
          const Icon = card.icon;
          const isSelected = selectedCategoryFilter === card.id;
          return (
            <div
              key={card.id}
              onClick={() => handleStatCardClick(card.id)}
              className={`p-4 bg-white border rounded-2xl shadow-2xs space-y-1 transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/15'
                  : 'border-slate-200/90 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span className="truncate">{card.label}</span>
                <Icon className={`w-4 h-4 shrink-0 ${card.iconColor}`} />
              </div>
              <div className="text-base sm:text-xl font-bold tabular-nums text-slate-900">
                {card.count}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {card.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* List of Question Cards in Bank */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 px-1">
          <div className="flex items-center gap-2">
            <span>Menampilkan <strong className="text-slate-800">{filteredQuestions.length}</strong> butir soal</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline">Klik soal untuk edit / hapus / rincian opsi</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh Bank Soal ke setelan awal developer? Perubahan dan soal kustom akan direset.')) {
                resetQuestionBankToDefault();
                if (onResetBankToDefault) onResetBankToDefault();
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs self-start sm:self-auto"
            title="Kembalikan semua soal ke setelan awal developer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Standar Developer</span>
          </button>
        </div>

        {groupedQuestions.length > 0 ? (
          groupedQuestions.map((group) => (
            <div key={group.categoryKey} className="space-y-3 pt-2">
              {/* Category Title outside the cards */}
              <div className="flex items-center gap-2 px-1">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  {group.title}
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  ({group.questions.length} Soal)
                </span>
              </div>

              <div className="space-y-3">
                {group.questions.map((q) => {
                  const isExpanded = expandedQuestionId === q.id;

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3"
                    >
                      {/* Question Top Row */}
                      <div 
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className="flex items-start justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-semibold text-slate-400">
                              {q.questionType === 'disc_quadrant' 
                                ? 'Kuadran DISC' 
                                : q.questionType === 'multiple_answers'
                                ? 'Multi Jawaban'
                                : q.questionType === 'essay' 
                                ? 'Esai' 
                                : 'Pilihan Ganda'}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm leading-snug">
                            {q.questionText}
                          </h4>
                        </div>

                        {/* Top Right Action Icons: Pencil, Trash2, Chevron */}
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              if (onEditQuestion) {
                                onEditQuestion(q);
                              } else {
                                onOpenCreateQuestion();
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Soal"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Apakah Anda yakin ingin menghapus butir soal ini?')) {
                                deleteQuestionFromBank(q.id);
                                if (onDeleteQuestion) {
                                  onDeleteQuestion(q.id);
                                }
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Soal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                            title={isExpanded ? "Sembunyikan Opsi" : "Lihat Opsi"}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Question Details */}
                      {isExpanded && (
                        <div className="pt-2 space-y-3 text-xs animate-in fade-in duration-100">
                          
                          {/* Options List */}
                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt, optIdx) => {
                                const isDisc = q.questionType === 'disc_quadrant';
                                const isMulti = q.questionType === 'multiple_answers';
                                const discCode = opt.discType || opt.discDimension || (optIdx === 0 ? 'D' : optIdx === 1 ? 'I' : optIdx === 2 ? 'S' : 'C');
                                const isCorrect = isMulti 
                                  ? (q.correctOptionIds?.includes(opt.id) || (opt.score !== undefined && opt.score > 0))
                                  : (!isDisc && (opt.id === q.correctOptionId || (opt.score !== undefined && opt.score > 0)));
                                const optionPrefix = isDisc 
                                  ? `${discCode}.` 
                                  : isMulti 
                                  ? `${opt.label || (optIdx + 1)}.` 
                                  : `${String.fromCharCode(65 + optIdx)}.`;

                                return (
                                  <div
                                    key={opt.id || optIdx}
                                    className={`p-2.5 bg-slate-50 rounded-xl border text-slate-800 flex items-center justify-between gap-2.5 ${
                                      isCorrect ? 'border-green-300 bg-green-50/15' : 'border-slate-200/70'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                      <span className="font-bold text-slate-500 w-5 shrink-0">
                                        {optionPrefix}
                                      </span>
                                      <span className="flex-1 text-xs min-w-0 break-words">{opt.text}</span>
                                    </div>
                                    {isCorrect && (
                                      <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 shadow-3xs" title="Kunci Jawaban Benar">
                                        <Check className="w-3 h-3 stroke-[3]" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Tags */}
                          {q.tags && q.tags.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                              {q.tags.map((t, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <Search className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">Tidak Ada Butir Soal yang Cocok</h4>
            <p className="text-xs text-slate-500">Coba pilih kategori statistik lain pada card di atas.</p>
          </div>
        )}
      </div>

    </div>
  );
};
