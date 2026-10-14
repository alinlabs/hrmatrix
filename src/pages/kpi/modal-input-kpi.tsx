import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Info, 
  Plus, 
  Minus, 
  Star 
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button, Input } from '../../components/ui';
import { 
  KPIResult, 
  KPIItemResult, 
  KPIScoringInputType, 
  KPIGradeStrategy,
  ModalInputKPIProps
} from './types';
import { calculateGrade, calculateEmployeeAttendanceScore } from '../../services/kpiService';
import { generateAutoEvaluationNote } from './utils-helper';
import { EmployeeAvatar } from '../../components/ui/EmployeeAvatar';
import { useCompany } from '../../context/CompanyContext';
import { v4 as uuidv4 } from 'uuid';

export function ModalInputKPI({
  isOpen,
  onClose,
  employee,
  period,
  existingResult,
  templates,
  rules,
  position,
  scoringConfig,
  onSave
}: ModalInputKPIProps) {
  const { requireCompanyRegistration, company } = useCompany();
  const [isAutoNotes, setIsAutoNotes] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoAttendanceLoading, setAutoAttendanceLoading] = useState(false);

  // Active scoring input mode (Manual, Seekbar, Likert, Grade)
  const [inputType, setInputType] = useState<KPIScoringInputType>(
    scoringConfig?.inputType || 
    (localStorage.getItem('kpi_scoring_mode') as KPIScoringInputType) || 
    'MANUAL'
  );
  
  const [gradeStrategy, setGradeStrategy] = useState<KPIGradeStrategy>(
    scoringConfig?.gradeStrategy || 
    (localStorage.getItem('kpi_grade_strategy') as KPIGradeStrategy) || 
    'MAX'
  );

  useEffect(() => {
    if (scoringConfig) {
      if (scoringConfig.inputType) setInputType(scoringConfig.inputType);
      if (scoringConfig.gradeStrategy) setGradeStrategy(scoringConfig.gradeStrategy);
    }
  }, [scoringConfig]);

  // General templates
  const activeGeneralTemplates = templates.filter(
    t => t.category === 'Umum' || t.isGeneral || !t.category
  );

  // Form items state (actual can be number | null to represent unselected/empty state)
  const [items, setItems] = useState<{
    templateId: string;
    kpiName: string;
    category: 'Umum' | 'Bidang' | 'Khusus';
    weight: number;
    unit: string;
    target: number;
    actual: number | null;
    minimumScore: number;
    measurementBase?: string;
    description?: string;
    isAttendance?: boolean;
  }[]>([]);

  // Expanded info cards state per indicator index
  const [expandedInfo, setExpandedInfo] = useState<Record<number, boolean>>({});

  // Initialize or reset form data when modal opens or employee changes
  useEffect(() => {
    if (isOpen && employee && period) {
      if (existingResult && existingResult.items && existingResult.items.length > 0) {
        // Load from existing result
        setItems(
          existingResult.items.map(i => {
            const matchedTpl = templates.find(t => t.id === i.templateId || t.name.toLowerCase() === i.kpiName.toLowerCase());
            return {
              templateId: i.templateId,
              kpiName: i.kpiName,
              category: i.category || matchedTpl?.category || 'Umum',
              weight: i.weight,
              unit: i.unit || 'Skor',
              target: i.target || 100,
              minimumScore: matchedTpl?.minimumScore || 70,
              measurementBase: matchedTpl?.measurementBase,
              description: matchedTpl?.description,
              actual: i.actual !== undefined && i.actual !== null ? Math.min(100, Math.max(0, Number(i.actual))) : null,
              isAttendance: i.kpiName.toLowerCase().includes('hadir') || i.kpiName.toLowerCase().includes('absensi') || i.kpiName.toLowerCase().includes('disiplin')
            };
          })
        );
        if (existingResult.notes) {
          setNotes(existingResult.notes);
          setIsAutoNotes(false);
        } else {
          setIsAutoNotes(true);
        }
      } else {
        // Populate default indicators for new/unscored evaluation:
        const defaultItems = activeGeneralTemplates.map(t => ({
          templateId: t.id,
          kpiName: t.name,
          category: t.category || 'Umum',
          weight: t.weight || 20,
          unit: 'Skor',
          target: 100,
          minimumScore: t.minimumScore || 70,
          measurementBase: t.measurementBase,
          description: t.description,
          actual: null,
          isAttendance: t.name.toLowerCase().includes('hadir') || t.name.toLowerCase().includes('absensi') || t.name.toLowerCase().includes('disiplin')
        }));

        setItems(defaultItems);
        setIsAutoNotes(true);
        setNotes('');
      }
      setExpandedInfo({});
    }
  }, [isOpen, employee, period, existingResult, templates, inputType]);

  const handleActualScoreChange = (index: number, val: number | null) => {
    const updated = [...items];
    if (val === null || isNaN(val)) {
      updated[index].actual = null;
    } else {
      updated[index].actual = Math.min(100, Math.max(0, val));
    }
    setItems(updated);
  };

  // Quick auto-fetch attendance calculation
  const handleAutoFetchAttendance = async (index: number) => {
    if (!employee || !period) return;
    setAutoAttendanceLoading(true);
    try {
      const res = await calculateEmployeeAttendanceScore(employee.id, period.startDate, period.endDate);
      const updated = [...items];
      updated[index].actual = Math.min(100, Math.max(0, res.score));
      setItems(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setAutoAttendanceLoading(false);
    }
  };

  // Compute live calculations
  const hasAnyScoreFilled = items.some(i => i.actual !== null && i.actual !== undefined);

  const computedItemsResult: KPIItemResult[] = items.map(item => {
    const directScore = item.actual !== null && item.actual !== undefined
      ? Math.min(100, Math.max(0, Number(item.actual)))
      : 0;
    const weightedScore = Math.round(((directScore * item.weight) / 100) * 100) / 100;

    return {
      templateId: item.templateId,
      kpiName: item.kpiName,
      category: item.category,
      weight: item.weight,
      unit: 'Skor',
      target: 100,
      actual: directScore,
      score: directScore,
      weightedScore: weightedScore
    };
  });

  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  const totalScore = hasAnyScoreFilled && totalWeight > 0
    ? Math.round(computedItemsResult.reduce((sum, i) => sum + i.weightedScore, 0) * (100 / totalWeight) * 100) / 100
    : 0;

  const currentGradeRule = hasAnyScoreFilled 
    ? calculateGrade(totalScore, rules.grades)
    : { grade: '-', label: 'Belum Dinilai', color: 'text-slate-400 bg-slate-100 border-slate-200' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireCompanyRegistration(undefined, {
      title: 'Daftarkan Perusahaan Terlebih Dahulu',
      message: 'Anda sedang dalam mode eksplorasi. Daftarkan profil perusahaan Anda untuk menyimpan penilaian KPI.'
    })) {
      return;
    }

    if (!employee || !period) return;

    const finalGradeRule = calculateGrade(totalScore, rules.grades);

    setIsSubmitting(true);
    try {
      const evalRecord: KPIResult = {
        id: existingResult?.id || uuidv4(),
        employeeId: employee.id,
        periodId: period.id,
        items: computedItemsResult,
        score: totalScore,
        grade: finalGradeRule.grade,
        gradeLabel: finalGradeRule.label,
        evaluatorId: 'HR Manager',
        notes: notes.trim(),
        evaluatedAt: new Date().toISOString().split('T')[0]
      };

      await onSave(evalRecord);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan evaluasi KPI.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle automatic notes handler
  const handleToggleAutoNotes = () => {
    const nextState = !isAutoNotes;
    setIsAutoNotes(nextState);
    if (!nextState) {
      setNotes('');
    } else {
      if (hasAnyScoreFilled) {
        const autoText = generateAutoEvaluationNote(currentGradeRule.grade, totalScore, employee?.fullName, company?.name);
        setNotes(autoText);
      } else {
        setNotes('');
      }
    }
  };

  // Sync automatic notes when score/grade changes and isAutoNotes is ON
  useEffect(() => {
    if (isAutoNotes) {
      if (hasAnyScoreFilled) {
        const autoText = generateAutoEvaluationNote(currentGradeRule.grade, totalScore, employee?.fullName, company?.name);
        setNotes(autoText);
      } else {
        setNotes('');
      }
    }
  }, [isAutoNotes, totalScore, currentGradeRule.grade, hasAnyScoreFilled, employee, company]);

  const generalItems = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.category === 'Umum');

  const specificItems = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.category !== 'Umum');

  const renderIndicatorCard = (item: typeof items[0], idx: number) => {
    const minScoreVal = item.minimumScore || 70;
    const isScoreFilled = item.actual !== null && item.actual !== undefined;
    const currentActual = isScoreFilled ? item.actual : 0;
    const isBelowMin = isScoreFilled && currentActual < minScoreVal;
    const isInfoActive = !!expandedInfo[idx];

    return (
      <div 
        key={item.templateId || idx} 
        className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-3"
      >
        {/* Header Row: Title & Circle Info Icon */}
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
            {item.kpiName}
          </h4>

          <button
            type="button"
            onClick={() => setExpandedInfo(prev => ({ ...prev, [idx]: !prev[idx] }))}
            title={isInfoActive ? "Sembunyikan rincian indikator" : "Lihat deskripsi, skor minimum, bobot & dasar pengukuran"}
            className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
          >
            <Info className={`w-4 h-4 transition-colors ${isInfoActive ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`} />
          </button>
        </div>

        {/* Toggleable Detail */}
        {isInfoActive && (
          <div className="space-y-2.5 pt-0.5 text-xs">
            {item.description && (
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {item.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/80 text-center">
                <div className="text-[10px] text-slate-400 font-medium">Skor Minimum</div>
                <div className="font-bold text-slate-900 text-xs mt-0.5">{minScoreVal}</div>
              </div>
              <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/80 text-center">
                <div className="text-[10px] text-slate-400 font-medium">Bobot Indikator</div>
                <div className="font-bold text-slate-900 text-xs mt-0.5">{item.weight}%</div>
              </div>
            </div>

            <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/80 text-center">
              <div className="text-[10px] text-slate-400 font-medium">Dasar Pengukuran</div>
              <div className="font-bold text-slate-800 text-xs mt-0.5 leading-snug">
                {item.measurementBase || 'Evaluasi Supervisi & Kinerja'}
              </div>
            </div>
          </div>
        )}

        {/* Interactive Input Area */}
        <div className="pt-2 border-t border-slate-100/80">
          {/* Mode: LIKERT */}
          {inputType === 'LIKERT' && (
            <div className="py-1">
              <div className="flex items-center justify-between gap-1 sm:gap-2">
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                  {[
                    { stars: 1, val: 20, title: '1 Bintang (20 Skor)' },
                    { stars: 2, val: 40, title: '2 Bintang (40 Skor)' },
                    { stars: 3, val: 60, title: '3 Bintang (60 Skor)' },
                    { stars: 4, val: 80, title: '4 Bintang (80 Skor)' },
                    { stars: 5, val: 100, title: '5 Bintang (100 Skor)' }
                  ].map((starItem) => {
                    const currentRating = isScoreFilled ? Math.round(Number(item.actual) / 20) : 0;
                    const isFilled = isScoreFilled && currentRating >= starItem.stars;

                    return (
                      <button
                        key={starItem.stars}
                        type="button"
                        title={starItem.title}
                        onClick={() => handleActualScoreChange(idx, starItem.val)}
                        className="p-1 hover:scale-115 transition-transform cursor-pointer group"
                      >
                        <Star 
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-2xs'
                              : 'text-slate-300 hover:text-amber-300'
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>

                <div 
                  className={`font-black text-xs sm:text-sm px-3 py-1 rounded-xl border transition-colors shrink-0 ${
                    !isScoreFilled
                      ? 'text-slate-400 bg-slate-50 border-slate-200'
                      : isBelowMin
                      ? 'text-rose-700 bg-rose-50 border-rose-200'
                      : 'text-blue-700 bg-blue-50 border-blue-200'
                  }`}
                >
                  {isScoreFilled ? `${item.actual} Skor` : '-'}
                </div>
              </div>
            </div>
          )}

          {/* Mode: MANUAL */}
          {inputType === 'MANUAL' && (
            <div className="flex items-center gap-2 w-full">
              <button
                type="button"
                onClick={() => handleActualScoreChange(idx, Math.max(0, (item.actual ?? 0) - 5))}
                className="h-10 w-12 sm:w-14 bg-slate-100/90 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95"
                title="Kurang 5"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex-1 min-w-0">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={item.actual !== null && item.actual !== undefined ? item.actual : ''}
                  onChange={(e) => {
                    const rawVal = e.target.value;
                    if (rawVal === '') {
                      handleActualScoreChange(idx, null);
                    } else {
                      handleActualScoreChange(idx, Number(rawVal));
                    }
                  }}
                  className={`h-10 text-center text-sm sm:text-base font-black w-full rounded-xl transition-colors ${
                    isBelowMin
                      ? 'border-rose-300 bg-rose-50/40 text-rose-700 focus-visible:ring-rose-500'
                      : 'border-slate-200 text-slate-900 focus-visible:ring-blue-500'
                  }`}
                  placeholder="Isi skor (0-100)"
                />
              </div>

              <button
                type="button"
                onClick={() => handleActualScoreChange(idx, Math.min(100, (item.actual ?? 0) + 5))}
                className="h-10 w-12 sm:w-14 bg-slate-100/90 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95"
                title="Tambah 5"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mode: SEEKBAR */}
          {inputType === 'SEEKBAR' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500 font-medium">Geser untuk menentukan nilai:</span>
                <span 
                  className={`font-bold px-2.5 py-0.5 rounded-lg text-[11px] border transition-colors ${
                    !isScoreFilled
                      ? 'text-slate-400 bg-slate-100 border-slate-200'
                      : isBelowMin
                      ? 'text-rose-700 bg-rose-50 border-rose-200'
                      : 'text-blue-700 bg-blue-50 border-blue-200'
                  }`}
                >
                  {isScoreFilled ? `${item.actual} Skor` : 'Skor'}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={item.actual ?? 50}
                onChange={(e) => handleActualScoreChange(idx, Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-colors ${
                  !isScoreFilled 
                    ? 'bg-slate-200 accent-slate-500' 
                    : isBelowMin 
                    ? 'bg-rose-100 accent-rose-600' 
                    : 'bg-blue-100 accent-blue-600'
                }`}
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          )}

          {/* Mode: GRADE */}
          {inputType === 'GRADE' && (
            <div className="w-full">
              <div className="grid grid-cols-4 gap-2 w-full">
                {rules.grades.map((gr) => {
                  const targetScoreVal = gradeStrategy === 'MAX'
                    ? gr.maxScore
                    : gradeStrategy === 'MIN'
                    ? gr.minScore
                    : Math.round((gr.minScore + gr.maxScore) / 2);

                  const isSelectedGrade = isScoreFilled && item.actual !== null && item.actual >= gr.minScore && item.actual <= gr.maxScore;

                  return (
                    <button
                      key={gr.grade}
                      type="button"
                      onClick={() => handleActualScoreChange(idx, targetScoreVal)}
                      title={`Grade ${gr.grade} (${gr.minScore}-${gr.maxScore}) → Nilai ${targetScoreVal} Skor`}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center min-w-0 ${
                        isSelectedGrade
                          ? `${gr.color} border-current shadow-xs font-black scale-100`
                          : 'bg-slate-100/70 text-slate-400 border-slate-200/80 opacity-60 hover:opacity-100 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-black">Grade {gr.grade}</span>
                      <span className="text-[10px] font-medium mt-0.5">{targetScoreVal} Skor</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Helper for Attendance Indicators */}
        {item.isAttendance && (
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 flex items-center justify-between text-xs">
            <span className="text-blue-900 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              Terhubung ke Log Presensi Bulan {period.month}
            </span>
            <button
              type="button"
              onClick={() => handleAutoFetchAttendance(idx)}
              disabled={autoAttendanceLoading}
              className="px-2.5 py-1 bg-white border border-blue-200 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg font-bold text-[11px] transition-all cursor-pointer disabled:opacity-50"
            >
              {autoAttendanceLoading ? 'Menghitung...' : 'Ambil Otomatis'}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen && !!employee && !!period}
      onClose={onClose}
      contentClassName="sm:max-w-2xl"
    >
      {employee && period ? (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* 1. Modal Header (Avatar, Name, Position & Close Icon) */}
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <EmployeeAvatar
                employee={employee as any}
                name={employee.fullName}
                size="md"
              />
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight truncate">
                  {employee.fullName}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                  {position?.name || 'Staf'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* 2. Modal Body (Scrollable) */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
            {/* Periode & Live Grade/Skor Card with Dynamic Gradients */}
            {(() => {
              let cardBgClass = 'bg-slate-50/90 border border-slate-200 text-slate-900 shadow-2xs';
              let subTextClass = 'text-slate-400';
              let mainTextClass = 'text-slate-900';

              if (hasAnyScoreFilled && totalScore > 0) {
                const gr = (currentGradeRule.grade || '').toUpperCase();
                if (gr.includes('A')) {
                  cardBgClass = 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white border border-emerald-500 shadow-md';
                } else if (gr.includes('B')) {
                  cardBgClass = 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white border border-blue-500 shadow-md';
                } else if (gr.includes('C')) {
                  cardBgClass = 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-700 text-white border border-amber-400 shadow-md';
                } else {
                  cardBgClass = 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-800 text-white border border-rose-500 shadow-md';
                }
                subTextClass = 'text-white/80 font-normal';
                mainTextClass = 'text-white font-extrabold';
              }

              return (
                <div className={`p-4 sm:p-5 rounded-2xl flex items-center justify-between transition-all duration-300 ${cardBgClass}`}>
                  <div className="min-w-0">
                    <p className={`text-[11px] leading-tight ${subTextClass}`}>
                      Periode
                    </p>
                    <h4 className={`text-xs sm:text-sm mt-0.5 leading-tight truncate ${mainTextClass}`}>
                      {period.name}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-[11px] leading-tight ${subTextClass}`}>
                      Nilai Akhir
                    </p>
                    <p className={`text-xs sm:text-sm mt-0.5 leading-tight ${mainTextClass}`}>
                      {hasAnyScoreFilled ? `Skor ${totalScore} Grade ${currentGradeRule.grade}` : 'Belum Dinilai'}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Indicators Group 1: Daftar KPI Umum */}
            {generalItems.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">Daftar KPI Umum</span>
                  <span className="text-slate-500 font-medium">
                    Total Bobot: <strong className="text-slate-900">{generalItems.reduce((sum, g) => sum + g.item.weight, 0)}%</strong>
                  </span>
                </div>

                <div className="space-y-3">
                  {generalItems.map(({ item, index }) => renderIndicatorCard(item, index))}
                </div>
              </div>
            )}

            {/* Indicators Group 2: Daftar KPI Spesifik */}
            {specificItems.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">Daftar KPI Spesifik</span>
                  <span className="text-slate-500 font-medium">
                    Total Bobot: <strong className="text-slate-900">{specificItems.reduce((sum, s) => sum + s.item.weight, 0)}%</strong>
                  </span>
                </div>

                <div className="space-y-3">
                  {specificItems.map(({ item, index }) => renderIndicatorCard(item, index))}
                </div>
              </div>
            )}

            {/* Catatan Evaluasi with Otomatis Toggle */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Catatan Evaluasi
                </label>

                {/* Otomatis Toggle Switch */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleAutoNotes}
                    className={`text-[11px] font-bold transition-colors cursor-pointer ${
                      isAutoNotes ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    Otomatis
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleAutoNotes}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isAutoNotes ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={isAutoNotes}
                    title={isAutoNotes ? 'Nonaktifkan catatan otomatis' : 'Aktifkan catatan otomatis'}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        isAutoNotes ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (isAutoNotes) {
                    setIsAutoNotes(false);
                  }
                }}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 transition-colors resize-none leading-relaxed placeholder:text-slate-400"
                placeholder="Catatan evaluasi, apresiasi, atau rekomendasi pengembangan..."
              />
            </div>
          </div>

          {/* 3. Modal Footer */}
          <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? 'Menyimpan Penilaian...'
                : existingResult
                ? 'Simpan Perubahan Penilaian'
                : 'Simpan Penilaian KPI'}
            </Button>
          </div>
        </form>
      ) : null}
    </Modal>
  );
}
