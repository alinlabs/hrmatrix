import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  Printer, 
  Copy, 
  Check, 
  HelpCircle, 
  BarChart3, 
  User, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles,
  Activity,
  Flame,
  Zap,
  Tag,
  ListChecks
} from 'lucide-react';
import { 
  TestPackage, 
  TestQuestion, 
  CandidateAnswer, 
  CandidateSession,
  TestCategory,
  CATEGORY_LABELS,
  CATEGORY_BADGE_COLORS
} from './types';
import { prepareCandidateQuestions } from './assessment-storage';

interface TestTakingViewProps {
  testPackage: TestPackage;
  initialCandidateName?: string;
  initialPosition?: string;
  onExit: () => void;
}

export const TestTakingView: React.FC<TestTakingViewProps> = ({
  testPackage: pkg,
  initialCandidateName = '',
  initialPosition = '',
  onExit
}) => {
  // Phase state: 'intro' | 'active' | 'result'
  const [phase, setPhase] = useState<'intro' | 'active' | 'result'>('intro');
  const [candidateName, setCandidateName] = useState(initialCandidateName);
  const [candidateEmail, setCandidateEmail] = useState('');
  const [appliedPosition, setAppliedPosition] = useState(initialPosition);

  // Active questions (resolved with candidate randomization if configured)
  const [activeQuestions, setActiveQuestions] = useState<TestQuestion[]>(() => {
    return prepareCandidateQuestions(pkg);
  });

  // Current question index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Candidate answers: questionId -> CandidateAnswer
  const [answers, setAnswers] = useState<Record<string, CandidateAnswer>>({});

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState(() => (pkg.durationMinutes || 45) * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Result state
  const [sessionResult, setSessionResult] = useState<CandidateSession | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  // Tab switch & out of frame exit counter
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  // Anti-cheat listener: detect tab switch or window minimize
  useEffect(() => {
    if (phase !== 'active') return;

    const maxAllowed = pkg.maxSessionExits ?? 0;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setTabSwitchCount((prev) => {
          const nextCount = prev + 1;
          if (maxAllowed === 0 || nextCount > maxAllowed) {
            alert(
              `[DETEKSI ANTI-CURANG KETAT]\n\nSistem mendeteksi Anda meninggalkan layar/tab ujian.\nBatas toleransi keluar sesi: ${maxAllowed}x.\n\nSesi tes Anda diakhiri otomatis dan jawaban langsung dikirim!`
            );
            handleFinishTest(true);
          } else {
            alert(
              `[PERINGATAN ANTI-CURANG]\n\nAnda terdeteksi keluar dari layar/tab tes (${nextCount}/${maxAllowed}x).\n\nSisa toleransi: ${maxAllowed - nextCount}x. Jika melebihi batas, sesi tes akan diakhiri otomatis.`
            );
          }
          return nextCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [phase, pkg.maxSessionExits]);

  // Reset & prepare questions whenever package changes
  useEffect(() => {
    setActiveQuestions(prepareCandidateQuestions(pkg));
    setSecondsRemaining((pkg.durationMinutes || 45) * 60);
    setCurrentIndex(0);
    setAnswers({});
  }, [pkg]);

  // Timer countdown hook
  useEffect(() => {
    if (!isTimerRunning || phase !== 'active') return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishTest(true); // Auto submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, phase]);

  // Start test
  const handleStartTest = () => {
    if (!candidateName.trim()) {
      alert('Mohon masukkan nama lengkap Anda terlebih dahulu sebelum memulai tes.');
      return;
    }
    const candidateQ = prepareCandidateQuestions(pkg);
    setActiveQuestions(candidateQ);
    setCurrentIndex(0);
    setAnswers({});
    setSecondsRemaining((pkg.durationMinutes || 45) * 60);
    setPhase('active');
    setIsTimerRunning(true);
  };

  // Multiple Choice Handler (PG Tunggal)
  const handleSelectMultipleChoice = (optionId: string) => {
    const q = activeQuestions[currentIndex];
    if (!q) return;

    setAnswers((prev) => ({
      ...prev,
      [q.id]: {
        ...(prev[q.id] || { questionId: q.id }),
        selectedOptionId: optionId
      }
    }));
  };

  // Multi Jawaban Handler (Bisa Lebih dari 1 Pilihan: Nomor 1, 2, 3...)
  const handleSelectMultiAnswer = (optionId: string) => {
    const q = activeQuestions[currentIndex];
    if (!q) return;

    setAnswers((prev) => {
      const current = prev[q.id] || { questionId: q.id };
      const currentList = current.selectedOptionIds || [];
      const updated = currentList.includes(optionId)
        ? currentList.filter(id => id !== optionId)
        : [...currentList, optionId];

      return {
        ...prev,
        [q.id]: {
          ...current,
          selectedOptionIds: updated
        }
      };
    });
  };

  // DISC Quadrant Handler (Most & Least)
  const handleSelectDisc = (optionId: string, type: 'most' | 'least') => {
    const q = activeQuestions[currentIndex];
    if (!q) return;

    setAnswers((prev) => {
      const current = prev[q.id] || { questionId: q.id };
      if (type === 'most') {
        return {
          ...prev,
          [q.id]: {
            ...current,
            mostOptionId: optionId,
            leastOptionId: current.leastOptionId === optionId ? undefined : current.leastOptionId
          }
        };
      } else {
        return {
          ...prev,
          [q.id]: {
            ...current,
            leastOptionId: optionId,
            mostOptionId: current.mostOptionId === optionId ? undefined : current.mostOptionId
          }
        };
      }
    });
  };

  // Essay Handler
  const handleEssayChange = (text: string) => {
    const q = activeQuestions[currentIndex];
    if (!q) return;

    setAnswers((prev) => ({
      ...prev,
      [q.id]: {
        ...(prev[q.id] || { questionId: q.id }),
        essayAnswerText: text
      }
    }));
  };

  // Question Answered Checker
  const isQuestionAnswered = (q: TestQuestion): boolean => {
    const ans = answers[q.id];
    if (!ans) return false;
    if (q.questionType === 'disc_quadrant') {
      return !!ans.mostOptionId && !!ans.leastOptionId;
    }
    if (q.questionType === 'essay') {
      return !!ans.essayAnswerText && ans.essayAnswerText.trim().length > 0;
    }
    if (q.questionType === 'multiple_answers') {
      return !!ans.selectedOptionIds && ans.selectedOptionIds.length > 0;
    }
    return !!ans.selectedOptionId;
  };

  // Format timer
  const formatTimer = (totalSeconds: number): string => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Finish test and calculate multi-dimensional scores
  const handleFinishTest = (isTimeout = false) => {
    setIsTimerRunning(false);

    if (!isTimeout) {
      const unanswered = activeQuestions.filter((q) => !isQuestionAnswered(q));
      if (unanswered.length > 0) {
        const confirmSubmit = confirm(
          `Masih ada ${unanswered.length} butir pertanyaan yang belum Anda jawab. Apakah Anda yakin ingin menyelesaikan tes sekarang?`
        );
        if (!confirmSubmit) {
          setIsTimerRunning(true);
          return;
        }
      }
    }

    // 1. Calculate Stress Endurance Index (Ketahanan Stres & Stamina)
    let stressEarned = 0;
    let stressMax = 0;

    activeQuestions.forEach((q) => {
      const ans = answers[q.id];
      const isStressQuestion = 
        q.tags?.some(t => ['ketahanan stres', 'resilience', 'stamina kognitif', 'regulasi emosi', 'faktor stres', 'tekanan', 'krisis'].some(st => t.toLowerCase().includes(st))) ||
        q.questionText.toLowerCase().includes('stres') ||
        q.questionText.toLowerCase().includes('tekanan');

      if (isStressQuestion) {
        stressMax += 10;
        if (ans?.selectedOptionId) {
          const opt = q.options.find(o => o.id === ans.selectedOptionId);
          if (opt?.score !== undefined) {
            stressEarned += opt.score;
          } else if (opt?.id === q.correctOptionId) {
            stressEarned += 10;
          }
        } else if (ans?.mostOptionId && ans?.leastOptionId) {
          stressEarned += 10;
        }
      }
    });

    const completionRate = activeQuestions.filter(isQuestionAnswered).length / (activeQuestions.length || 1);
    const baseStress = stressMax > 0 ? (stressEarned / stressMax) * 80 : 80;
    const staminaBonus = completionRate * 20;
    const finalStressScore = Math.min(100, Math.max(40, Math.round(baseStress + staminaBonus)));

    let stressToleranceLevel: 'Sangat Tinggi (Tahan Tekanan Ekstrem)' | 'Tinggi (Stabil & Adaptif)' | 'Moderat (Cukup Stabil)' | 'Rentan Terhadap Tekanan' = 'Tinggi (Stabil & Adaptif)';
    let resilienceSummary = 'Kandidat memiliki stabilitas emosi yang baik dan dapat beradaptasi secara wajar saat menghadapi tekanan tenggat waktu.';

    if (finalStressScore >= 85) {
      stressToleranceLevel = 'Sangat Tinggi (Tahan Tekanan Ekstrem)';
      resilienceSummary = 'Kandidat menunjukkan ketahanan mental prima, ketenangan berpikir luar biasa di bawah krisis, serta konsistensi fokus tinggi dalam situasi darurat.';
    } else if (finalStressScore >= 70) {
      stressToleranceLevel = 'Tinggi (Stabil & Adaptif)';
      resilienceSummary = 'Kandidat memiliki ketahanan kerja yang stabil, tidak mudah panik saat menghadapi perubahan mendadak, dan mampu menyelesaikan tugas secara andal.';
    } else if (finalStressScore >= 50) {
      stressToleranceLevel = 'Moderat (Cukup Stabil)';
      resilienceSummary = 'Kandidat membutuhkan lingkungan kerja dengan ritme teratur dan berpotensi mengalami penurunan konsentrasi jika dibebani target mendadak.';
    } else {
      stressToleranceLevel = 'Rentan Terhadap Tekanan';
      resilienceSummary = 'Kandidat cenderung sensitif terhadap tekanan tinggi atau konflik langsung, disarankan diberikan pendampingan dan pembagian beban kerja bertahap.';
    }

    // 2. DISC Evaluation (if DISC questions are present)
    const discQuestions = activeQuestions.filter(q => q.questionType === 'disc_quadrant');
    let discSummaryResult: CandidateSession['discSummary'] = undefined;

    if (discQuestions.length > 0) {
      let dCount = 0;
      let iCount = 0;
      let sCount = 0;
      let cCount = 0;

      discQuestions.forEach((q) => {
        const ans = answers[q.id];
        if (ans?.mostOptionId) {
          const opt = q.options.find((o) => o.id === ans.mostOptionId);
          if (opt?.discType === 'D') dCount += 2;
          if (opt?.discType === 'I') iCount += 2;
          if (opt?.discType === 'S') sCount += 2;
          if (opt?.discType === 'C') cCount += 2;
        }
        if (ans?.leastOptionId) {
          const opt = q.options.find((o) => o.id === ans.leastOptionId);
          if (opt?.discType === 'D') dCount = Math.max(0, dCount - 1);
          if (opt?.discType === 'I') iCount = Math.max(0, iCount - 1);
          if (opt?.discType === 'S') sCount = Math.max(0, sCount - 1);
          if (opt?.discType === 'C') cCount = Math.max(0, cCount - 1);
        }
      });

      const scores = [
        { type: 'D', val: dCount, name: 'Dominance (Penggerak & Tegas)' },
        { type: 'I', val: iCount, name: 'Influence (Komunikatif & Persuasif)' },
        { type: 'S', val: sCount, name: 'Steadiness (Stabil & Konsisten)' },
        { type: 'C', val: cCount, name: 'Conscientiousness (Teliti & Analitis)' }
      ];
      scores.sort((a, b) => b.val - a.val);
      const topTrait = scores[0];

      let profileTitle = 'The Director / Leader (Tinggi D)';
      let summary = 'Kandidat memiliki dorongan kuat untuk mencapai hasil, berani mengambil risiko, cepat dalam mengambil keputusan, dan berorientasi pada target tinggi.';
      let workStyle = 'Bekerja secara independen, menikmati tantangan baru, tidak suka bertele-tele, dan efektif dalam memimpin proyek dengan tenggat waktu ketat.';
      let tips = [
        'Tanyakan bagaimana ia mengelola perbedaan pendapat dengan anggota tim yang beritme lebih lambat.',
        'Eksplorasi pengalamannya dalam mendelegasikan wewenang teknis kepada orang lain.'
      ];

      if (topTrait.type === 'I') {
        profileTitle = 'The Influencer / Communicator (Tinggi I)';
        summary = 'Kandidat sangat komunikatif, antusias, ekspresif, dan memiliki kemampuan interpersonal luar biasa dalam membangun relasi positif serta memotivasi tim.';
        workStyle = 'Sangat menyukai kolaborasi tim, presentasi di depan publik, penjualan, hubungan masyarakat, dan lingkungan kerja yang dinamis serta interaktif.';
        tips = [
          'Uji bagaimana kandidat menjaga ketelitian data dan konsistensi terhadap detail administrasi.',
          'Tanyakan cara ia tetap fokus menyelesaikan tugas rutin tanpa mudah terdistraksi.'
        ];
      } else if (topTrait.type === 'S') {
        profileTitle = 'The Supporter / Stabilizer (Tinggi S)';
        summary = 'Kandidat memiliki tingkat loyalitas tinggi, sabar, penuh empati, pendengar yang baik, serta sangat andal dalam menjaga kelancaran operasional harian.';
        workStyle = 'Bekerja secara terstruktur, konsisten, menciptakan keharmonisan tim, dan menuntaskan tanggung jawab kerja secara tekun dari awal hingga akhir.';
        tips = [
          'Tanyakan bagaimana kandidat merespons perubahan rencana mendadak atau krisis darurat di tempat kerja.',
          'Gali keberaniannya dalam mengutarakan kritik konstruktif kepada rekan kerja atau atasan.'
        ];
      } else if (topTrait.type === 'C') {
        profileTitle = 'The Analyst / Perfectionist (Tinggi C)';
        summary = 'Kandidat berorientasi tinggi pada standar kualitas, teliti, disiplin mematuhi SOP/regulasi, dan selalu mendasarkan keputusan pada fakta data yang valid.';
        workStyle = 'Sangat unggul dalam pekerjaan yang menuntut presisi matematis, audit, programming, perencanaan hukum, riset, dan analisis data mendalam.';
        tips = [
          'Tanyakan bagaimana ia mengambil keputusan saat data yang tersedia belum 100% lengkap.',
          'Eksplorasi fleksibilitasnya menghadapi situasi kerja yang membutuhkan kompromi cepat.'
        ];
      }

      discSummaryResult = {
        dScore: dCount,
        iScore: iCount,
        sScore: sCount,
        cScore: cCount,
        dominantTrait: topTrait.type,
        profileTitle,
        summary,
        workStyle,
        interviewTips: tips
      };
    }

    // 3. Multi-Dimensional Breakdown by Category (PG 4 scored objectively)
    const categoryMap = new Map<TestCategory, { total: number; answered: number; earned: number; max: number }>();
    let totalEarnedOverall = 0;
    let maxPossibleOverall = 0;

    activeQuestions.forEach((q) => {
      const cat = q.category || 'personality';
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, { total: 0, answered: 0, earned: 0, max: 0 });
      }
      const catStat = categoryMap.get(cat)!;
      catStat.total++;

      if (isQuestionAnswered(q)) {
        catStat.answered++;
      }

      const ans = answers[q.id];

      if (q.questionType === 'disc_quadrant') {
        catStat.max += 10;
        maxPossibleOverall += 10;
        if (ans?.mostOptionId && ans?.leastOptionId) {
          catStat.earned += 10;
          totalEarnedOverall += 10;
        }
      } else if (q.questionType === 'essay') {
        catStat.max += 10;
        maxPossibleOverall += 10;

        const userText = (ans?.essayAnswerText || '').toLowerCase();
        const keywords = q.essayKeywords || [];

        if (userText.trim().length > 0) {
          if (keywords.length > 0) {
            const matched = keywords.filter(kw => userText.includes(kw.toLowerCase()));
            const matchRatio = matched.length / keywords.length;
            const earnedScore = Math.round(matchRatio * 10);

            catStat.earned += earnedScore;
            totalEarnedOverall += earnedScore;

            if (ans) {
              ans.essayMatchScore = Math.round(matchRatio * 100);
              ans.matchedKeywords = matched;
            }
          } else {
            catStat.earned += 8;
            totalEarnedOverall += 8;
            if (ans) {
              ans.essayMatchScore = 80;
            }
          }
        }
      } else if (q.questionType === 'multiple_answers') {
        catStat.max += 10;
        maxPossibleOverall += 10;

        const userSelected = ans?.selectedOptionIds || [];
        const correctIds = q.correctOptionIds || q.options.filter(o => o.score && o.score > 0).map(o => o.id);
        if (userSelected.length > 0 && correctIds.length > 0) {
          const matchedCount = userSelected.filter(id => correctIds.includes(id)).length;
          const wrongCount = userSelected.filter(id => !correctIds.includes(id)).length;
          const scoreFrac = Math.max(0, (matchedCount - wrongCount * 0.5) / correctIds.length);
          const earnedScore = Math.round(scoreFrac * 10);
          catStat.earned += earnedScore;
          totalEarnedOverall += earnedScore;
        }
      } else {
        // Standard Pilihan Ganda
        catStat.max += 10;
        maxPossibleOverall += 10;

        if (ans?.selectedOptionId) {
          const opt = q.options.find((o) => o.id === ans.selectedOptionId);
          if (opt?.score !== undefined) {
            catStat.earned += opt.score;
            totalEarnedOverall += opt.score;
          } else if (opt?.id === q.correctOptionId) {
            catStat.earned += 10;
            totalEarnedOverall += 10;
          }
        }
      }
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, stat]) => {
      const pct = stat.max > 0 ? Math.round((stat.earned / stat.max) * 100) : 100;
      let gr = 'A';
      if (pct >= 85) gr = 'A (Sangat Baik)';
      else if (pct >= 70) gr = 'B (Baik)';
      else if (pct >= 50) gr = 'C (Cukup)';
      else gr = 'D (Kurang)';

      return {
        category,
        categoryLabel: CATEGORY_LABELS[category] || category,
        totalQuestions: stat.total,
        answeredCount: stat.answered,
        scorePercent: pct,
        grade: gr
      };
    });

    const overallPercentage = maxPossibleOverall > 0 
      ? Math.round((totalEarnedOverall / maxPossibleOverall) * 100) 
      : 85;

    let overallGrade = 'A (Sangat Memuaskan)';
    let recommendation: 'Sangat Direkomendasikan' | 'Direkomendasikan' | 'Dipertimbangkan dengan Catatan' | 'Tidak Disarankan' = 'Sangat Direkomendasikan';

    if (overallPercentage >= 85) {
      overallGrade = 'A (Sangat Memuaskan)';
      recommendation = 'Sangat Direkomendasikan';
    } else if (overallPercentage >= 70) {
      overallGrade = 'B (Baik / Memenuhi Standar)';
      recommendation = 'Direkomendasikan';
    } else if (overallPercentage >= 50) {
      overallGrade = 'C (Cukup / Perlu Pendampingan)';
      recommendation = 'Dipertimbangkan dengan Catatan';
    } else {
      overallGrade = 'D (Di Bawah Standar)';
      recommendation = 'Tidak Disarankan';
    }

    setSessionResult({
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim(),
      appliedPosition: appliedPosition.trim() || 'Kandidat Pelamar',
      packageId: pkg.id,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMinutesSet: pkg.durationMinutes,
      answers,
      score: Math.round(totalEarnedOverall),
      maxScore: maxPossibleOverall,
      percentage: overallPercentage,
      grade: overallGrade,
      stressEnduranceScore: finalStressScore,
      stressToleranceLevel,
      resilienceSummary,
      discSummary: discSummaryResult,
      categoryBreakdown,
      recommendation
    });

    setPhase('result');
  };

  const handleCopyReport = async () => {
    try {
      const el = window.document.getElementById('printable-assessment-report');
      if (el) {
        await navigator.clipboard.writeText(el.innerText);
        setCopiedReport(true);
        setTimeout(() => setCopiedReport(false), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Helper for category badge
  const renderCategoryBadge = (cat?: TestCategory) => {
    const categoryKey = cat || 'personality';
    const label = CATEGORY_LABELS[categoryKey] || categoryKey;
    const colors = CATEGORY_BADGE_COLORS[categoryKey] || { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };

    return (
      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border flex items-center gap-1 ${colors.bg} ${colors.text} ${colors.border}`}>
        <Tag className="w-3 h-3" />
        <span>Kategori: {label}</span>
      </span>
    );
  };

  const currentQuestion = activeQuestions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] || { questionId: currentQuestion.id } : { questionId: '' };

  // ================= 1. INTRO SCREEN =================
  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Hub Asesmen</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {pkg.categoryLabel}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-500">
                Tingkat: {pkg.difficulty}
              </span>
              {pkg.randomizePerCandidate && (
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>Mode Soal Acak per Kandidat (Anti-Contek)</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {pkg.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {pkg.fullDescription}
            </p>
          </div>

          {/* Test Meta Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150">
              <span className="text-[11px] text-slate-500 block">Alokasi Waktu:</span>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{pkg.durationMinutes} Menit</span>
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150">
              <span className="text-[11px] text-slate-500 block">Jumlah Butir Soal:</span>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>{activeQuestions.length} Butir Soal Standar</span>
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 block">Format Soal:</span>
              <span className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                DISC & PG 4 Opsi (A-D)
              </span>
            </div>
          </div>

          {/* Measuring Points */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Dimensi Kompetensi yang Diukur:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pkg.measuringPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-blue-50/40 p-2.5 rounded-lg border border-blue-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Petunjuk Pengerjaan:
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              {pkg.instructions.map((ins, idx) => (
                <li key={idx} className="leading-relaxed">{ins}</li>
              ))}
            </ul>
          </div>

          {/* Candidate Form */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Identitas Peserta Ujian:
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Peserta *
                </label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Contoh: Budi Pratama, S.Kom"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="kandidat@email.com"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Posisi Pekerjaan yang Dilamar (Opsional)
                  </label>
                  <input
                    type="text"
                    value={appliedPosition}
                    onChange={(e) => setAppliedPosition(e.target.value)}
                    placeholder="Contoh: Marketing Lead"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartTest}
              className="w-full py-3 px-6 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>Mulai Pengerjaan Asesmen Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. ACTIVE TEST RUNNER SCREEN =================
  if (phase === 'active' && currentQuestion) {
    const isDisc = currentQuestion.questionType === 'disc_quadrant';
    const isLastQuestion = currentIndex === activeQuestions.length - 1;
    const answeredCount = activeQuestions.filter(isQuestionAnswered).length;

    return (
      <div className="max-w-3xl mx-auto py-6 px-4 space-y-5">
        {/* Top Sticky Test Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-4 z-20">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-800">{pkg.title}</span>
              {pkg.randomizePerCandidate && (
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Soal Acak
                </span>
              )}
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {(pkg.maxSessionExits ?? 0) === 0 
                  ? 'Anti-Keluar Sesi (0x Limit)' 
                  : `Keluar Sesi: ${tabSwitchCount}/${pkg.maxSessionExits}x`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Peserta: <span className="font-semibold text-slate-900">{candidateName}</span>
              {appliedPosition ? ` · Posisi: ${appliedPosition}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono font-bold text-xs ${
              secondsRemaining < 180 
                ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            <button
              type="button"
              onClick={() => handleFinishTest(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Selesaikan Tes
            </button>
          </div>
        </div>

        {/* Progress Bar & Question Navigator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Progress: {answeredCount} dari {activeQuestions.length} Terjawab</span>
            <span>{Math.round((answeredCount / activeQuestions.length) * 100)}% Selesai</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Quick Number Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
            {activeQuestions.map((q, idx) => {
              const isAnswered = isQuestionAnswered(q);
              const isCurrent = idx === currentIndex;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center justify-center ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2 shadow-xs'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
          {/* Question Prompt Header with Category Dimension Details */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  Nomor {currentIndex + 1} dari {activeQuestions.length}
                </span>

                {/* PROMINENT CATEGORY DIMENSION BADGE */}
                {renderCategoryBadge(currentQuestion.category)}
              </div>

              {/* Format Badge */}
              {isDisc ? (
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                  Kuadran DISC (Paling &amp; Kurang)
                </span>
              ) : currentQuestion.questionType === 'multiple_answers' ? (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Multi Jawaban (Pilih Nomor &gt; 1)
                </span>
              ) : currentQuestion.questionType === 'essay' ? (
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  Esai (Jawaban Terbuka)
                </span>
              ) : (
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  Pilihan Ganda ({currentQuestion.options?.length || 4} Opsi)
                </span>
              )}
            </div>

            {/* Tags */}
            {currentQuestion.tags && currentQuestion.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {currentQuestion.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Optional Scenario Passage */}
            {currentQuestion.scenario && (
              <div className="mb-4 p-4 bg-slate-50 border-l-4 border-blue-500 rounded-r-xl text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                <span className="font-bold text-slate-900 block mb-1">Skenario Situasi:</span>
                {currentQuestion.scenario}
              </div>
            )}

            <h2 className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
              {currentQuestion.questionText}
            </h2>
          </div>

          {/* DYNAMIC ANSWER TYPE RENDERING */}

          {/* 1. DISC QUADRANT (MOST & LEAST) */}
          {isDisc && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 border-b border-slate-100 pb-2 px-3">
                <span>Pernyataan Perilaku Kerja</span>
                <div className="flex items-center gap-6 shrink-0">
                  <span className="text-emerald-700 w-12 text-center">Paling (Most)</span>
                  <span className="text-rose-700 w-12 text-center">Kurang (Least)</span>
                </div>
              </div>

              {currentQuestion.options.map((opt) => {
                const isMost = currentAnswer.mostOptionId === opt.id;
                const isLeast = currentAnswer.leastOptionId === opt.id;

                return (
                  <div
                    key={opt.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      isMost
                        ? 'border-emerald-300 bg-emerald-50/40'
                        : isLeast
                        ? 'border-rose-300 bg-rose-50/40'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 pr-4 flex-1">
                      <span className="font-bold text-xs text-slate-400 mt-0.5">{opt.label}.</span>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">{opt.text}</p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectDisc(opt.id, 'most')}
                        className={`w-12 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                          isMost
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-800'
                        }`}
                      >
                        {isMost ? '✓ Ya' : 'Paling'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectDisc(opt.id, 'least')}
                        className={`w-12 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                          isLeast
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-800'
                        }`}
                      >
                        {isLeast ? '✗ Bukan' : 'Kurang'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. ESSAY (TEXTAREA INPUT) */}
          {currentQuestion.questionType === 'essay' && (
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                Tuliskan Jawaban Uraian Esai Anda:
              </label>
              <textarea
                rows={6}
                value={currentAnswer.essayAnswerText || ''}
                onChange={(e) => handleEssayChange(e.target.value)}
                placeholder="Ketikkan uraian jawaban Anda secara jelas dan rinci di sini..."
                className="w-full p-4 border border-slate-300 rounded-xl bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans shadow-2xs"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Evaluasi otomatis berbasis kesesuaian kata kunci kata perkata.</span>
                <span>{ (currentAnswer.essayAnswerText || '').trim().split(/\s+/).filter(Boolean).length } Kata</span>
              </div>
            </div>
          )}

          {/* 3. MULTI JAWABAN (NOMOR 1, 2, 3... PILIH > 1) */}
          {currentQuestion.questionType === 'multiple_answers' && (
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-semibold text-emerald-700 mb-1">
                Pilih satu atau lebih nomor opsi yang menurut Anda benar:
              </p>
              {currentQuestion.options.map((opt, optIdx) => {
                const selectedList = currentAnswer.selectedOptionIds || [];
                const isSelected = selectedList.includes(opt.id);
                const optNumber = opt.label || String(optIdx + 1);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectMultiAnswer(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {optNumber}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-800 leading-relaxed flex-1">
                      {opt.text}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* 4. MULTIPLE CHOICE (DYNAMIC OPTIONS A s/d H) */}
          {!isDisc && currentQuestion.questionType !== 'essay' && currentQuestion.questionType !== 'multiple_answers' && (
            <div className="space-y-2.5 pt-2">
              {currentQuestion.options.map((opt) => {
                const isSelected = currentAnswer.selectedOptionId === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectMultipleChoice(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {opt.label}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-800 leading-relaxed flex-1">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>

            {isLastQuestion ? (
              <button
                type="button"
                onClick={() => handleFinishTest(false)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kirim & Selesaikan Asesmen</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <span>Selanjutnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ================= 3. TEST RESULT REPORT SCREEN =================
  if (phase === 'result' && sessionResult) {
    const disc = sessionResult.discSummary;

    return (
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Hub Asesmen</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedReport ? 'Tersalin!' : 'Salin Ringkasan'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Report Document Card */}
        <div 
          id="printable-assessment-report"
          className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-12 space-y-8 select-text print:shadow-none print:border-none print:p-0"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block font-sans">
                LAPORAN ASESMEN TERPADU & EVALUASI REKRUTMEN HRMATRIX
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                {pkg.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Waktu Penyelesaian: {new Date(sessionResult.completedAt || '').toLocaleString('id-ID')} · Durasi: {sessionResult.durationMinutesSet || pkg.durationMinutes} Menit ({activeQuestions.length} Soal Standar)
              </p>
            </div>

            <div className="text-right sm:border-l sm:pl-5 border-slate-200">
              <span className="text-xs text-slate-500 block">Kandidat Teruji:</span>
              <span className="text-base font-bold text-slate-900 block">{sessionResult.candidateName}</span>
              <span className="text-xs text-slate-600 block">{sessionResult.appliedPosition}</span>
            </div>
          </div>

          {/* OVERALL SCORE & RECOMMENDATION HIGHLIGHT */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                Indeks Kesesuaian Komprehensif (Overall Fit Index)
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {sessionResult.percentage}%
                </span>
                <span className="text-sm font-semibold text-slate-300">
                  {sessionResult.grade}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Evaluasi otomatis terukur lintas logika kognitif, etika kerja SJT, bahasa Inggris, dan kepemimpinan.
              </p>
            </div>

            <div className="sm:border-l sm:pl-6 border-slate-800 text-center sm:text-right shrink-0">
              <span className="text-[11px] text-slate-400 block mb-1">Rekomendasi Rekrutmen HR:</span>
              <span className={`inline-block px-3.5 py-1.5 rounded-xl text-xs font-bold ${
                sessionResult.recommendation === 'Sangat Direkomendasikan'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : sessionResult.recommendation === 'Direkomendasikan'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : sessionResult.recommendation === 'Dipertimbangkan dengan Catatan'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {sessionResult.recommendation}
              </span>
            </div>
          </div>

          {/* INDEKS KETAHANAN STRES & STAMINA KERJA */}
          <div className="p-5 bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 rounded-2xl border border-rose-200/80 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Indeks Ketahanan Stres & Stamina Kerja
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Evaluasi Ketenangan Mental, Regulasi Emosi di Bawah Tekanan & Konsistensi Waktu
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900">
                  {sessionResult.stressEnduranceScore || 80}/100
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  (sessionResult.stressEnduranceScore || 80) >= 85
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : (sessionResult.stressEnduranceScore || 80) >= 70
                    ? 'bg-blue-600 text-white shadow-xs'
                    : (sessionResult.stressEnduranceScore || 80) >= 50
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-rose-600 text-white shadow-xs'
                }`}>
                  {sessionResult.stressToleranceLevel}
                </span>
              </div>
            </div>

            {/* Progress Bar Visual */}
            <div className="space-y-1">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    (sessionResult.stressEnduranceScore || 80) >= 85
                      ? 'bg-emerald-600'
                      : (sessionResult.stressEnduranceScore || 80) >= 70
                      ? 'bg-blue-600'
                      : (sessionResult.stressEnduranceScore || 80) >= 50
                      ? 'bg-amber-500'
                      : 'bg-rose-600'
                  }`}
                  style={{ width: `${sessionResult.stressEnduranceScore || 80}%` }}
                />
              </div>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                <span className="font-bold text-slate-900">Analisis Ketahanan: </span>
                {sessionResult.resilienceSummary}
              </p>
            </div>
          </div>

          {/* MULTI-DIMENSIONAL CATEGORY BREAKDOWN SECTION */}
          {sessionResult.categoryBreakdown && sessionResult.categoryBreakdown.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Rincian Nilai per Dimensi Kompetensi (Category Breakdown)</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  {sessionResult.categoryBreakdown.length} Dimensi Teruji
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sessionResult.categoryBreakdown.map((catItem) => {
                  const colors = CATEGORY_BADGE_COLORS[catItem.category] || { bg: 'bg-slate-50', text: 'text-slate-800', border: 'border-slate-200' };

                  return (
                    <div 
                      key={catItem.category} 
                      className={`p-4 rounded-xl border ${colors.bg} ${colors.border} space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${colors.text}`}>
                          {catItem.categoryLabel}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {catItem.answeredCount}/{catItem.totalQuestions} Soal
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-2xl font-black text-slate-900">
                          {catItem.scorePercent}%
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {catItem.grade}
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-slate-900 h-full rounded-full transition-all"
                          style={{ width: `${catItem.scorePercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DISC Profile Breakdown if present */}
          {disc && (
            <div className="space-y-6 pt-2 border-t border-slate-100">
              <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                  Klasifikasi Profil Kepribadian & Gaya Kerja DISC:
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  {disc.profileTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {disc.summary}
                </p>
              </div>

              {/* Breakdown 4 Kuadran DISC */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Distribusi Skor 4 Kuadran DISC
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-rose-700 block">Dominance (D)</span>
                    <span className="text-2xl font-black text-rose-900 mt-1 block">{disc.dScore}</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-amber-700 block">Influence (I)</span>
                    <span className="text-2xl font-black text-amber-900 mt-1 block">{disc.iScore}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-emerald-700 block">Steadiness (S)</span>
                    <span className="text-2xl font-black text-emerald-900 mt-1 block">{disc.sScore}</span>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-blue-700 block">Conscientiousness (C)</span>
                    <span className="text-2xl font-black text-blue-900 mt-1 block">{disc.cScore}</span>
                  </div>
                </div>
              </div>

              {/* Gaya Kerja & Rekomendasi Wawancara HR */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Karakteristik & Gaya Kolaborasi Tim
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                  {disc.workStyle}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Panduan Eksplorasi Wawancara HR Lanjutan
                </h3>
                <ul className="space-y-2">
                  {disc.interviewTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Footer Signature */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Divalidasi secara Otomatis oleh Sistem Asesmen Terintegrasi HRMatrix</span>
            </div>
            <div className="text-right">
              <span>Dicetak pada: {new Date().toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
