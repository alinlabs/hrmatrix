import React, { useState, useEffect } from 'react';
import { KPIRuleConfig, KPIGradeRule, KPIConfigurationPageProps } from './types';
import { db } from '../../db/database';
import { DEFAULT_KPI_RULES } from '../../services/kpiService';

export function KPIRulesConfigTab({ 
  config, 
  onUpdate 
}: { 
  config: KPIRuleConfig; 
  onUpdate: () => void; 
}) {
  // Ensure exactly 4 grades (A, B, C, D)
  const initialConfig = config || DEFAULT_KPI_RULES;
  const initialGrades = (initialConfig.grades && initialConfig.grades.length > 0)
    ? initialConfig.grades.filter(g => ['A', 'B', 'C', 'D'].includes(g.grade))
    : DEFAULT_KPI_RULES.grades;

  const [formData, setFormData] = useState<KPIRuleConfig>({
    ...initialConfig,
    grades: initialGrades.length === 4 ? initialGrades : DEFAULT_KPI_RULES.grades
  });

  useEffect(() => {
    if (config) {
      const validGrades = (config.grades && config.grades.length > 0)
        ? config.grades.filter(g => ['A', 'B', 'C', 'D'].includes(g.grade))
        : DEFAULT_KPI_RULES.grades;
      setFormData({
        ...config,
        grades: validGrades.length === 4 ? validGrades : DEFAULT_KPI_RULES.grades
      });
    }
  }, [config]);

  // Helper function to auto-save directly to IndexedDB & notify parent
  const autoSave = async (updatedConfig: KPIRuleConfig) => {
    const updated: KPIRuleConfig = {
      ...updatedConfig,
      generalWeightPercentage: Number(updatedConfig.generalWeightPercentage),
      departmentWeightPercentage: Number(updatedConfig.departmentWeightPercentage),
      passingScore: Number(updatedConfig.passingScore),
      updatedAt: new Date().toISOString().split('T')[0]
    };

    await db.settings.put({
      id: 'kpiConfig',
      ...updated
    } as any);

    onUpdate();
  };

  // Handle draggable weight slider change
  const handleWeightSliderChange = (generalVal: number) => {
    const clampedGeneral = Math.min(80, Math.max(20, generalVal));
    const deptVal = 100 - clampedGeneral;
    const nextData: KPIRuleConfig = {
      ...formData,
      generalWeightPercentage: clampedGeneral,
      departmentWeightPercentage: deptVal
    };
    setFormData(nextData);
    autoSave(nextData);
  };

  // Handle passing score change
  const handlePassingScoreChange = (val: number) => {
    const nextData: KPIRuleConfig = {
      ...formData,
      passingScore: val
    };
    setFormData(nextData);
    autoSave(nextData);
  };

  // Handle grade score changes
  const handleGradeChange = (index: number, field: keyof KPIGradeRule, value: any) => {
    const newGrades = [...formData.grades];
    newGrades[index] = {
      ...newGrades[index],
      [field]: field === 'minScore' || field === 'maxScore' ? Number(value) : value
    };
    const nextData: KPIRuleConfig = {
      ...formData,
      grades: newGrades
    };
    setFormData(nextData);
    autoSave(nextData);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="space-y-8">
        {/* Section 1: Porsi Bobot & Nilai Lulus Minimal */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 leading-tight">
              Porsi Bobot KPI
            </h3>
          </div>

          {/* Interactive Colored Seekbar with percentages inside */}
          <div className="space-y-2.5">
            {/* Visual Colored Interactive Seekbar Bar with percentages at inner edges */}
            <div className="space-y-1.5">
              <div className="relative pt-0.5">
                {/* Colored Bar with percentage numbers at inner edges */}
                <div className="h-11 sm:h-12 w-full rounded-xl overflow-hidden flex shadow-inner border border-slate-200/80 relative bg-slate-100">
                  {/* Bagian Kiri (Umum - Blue) */}
                  <div
                    className="bg-blue-600 h-full transition-all duration-100 flex items-center justify-start pl-3 sm:pl-4 text-white overflow-hidden select-none"
                    style={{ width: `${formData.generalWeightPercentage}%` }}
                  >
                    <span className="text-xs sm:text-sm font-black tracking-wide whitespace-nowrap drop-shadow-xs">
                      {formData.generalWeightPercentage > 0 ? `${formData.generalWeightPercentage}%` : ''}
                    </span>
                  </div>

                  {/* Bagian Kanan (Spesifik - Red/Rose) */}
                  <div
                    className="bg-rose-500 h-full transition-all duration-100 flex items-center justify-end pr-3 sm:pr-4 text-white overflow-hidden select-none"
                    style={{ width: `${formData.departmentWeightPercentage}%` }}
                  >
                    <span className="text-xs sm:text-sm font-black tracking-wide whitespace-nowrap drop-shadow-xs">
                      {formData.departmentWeightPercentage > 0 ? `${formData.departmentWeightPercentage}%` : ''}
                    </span>
                  </div>

                  {/* Vertical Divider Indicator Handle Line */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-md pointer-events-none transition-all duration-100 z-10"
                    style={{ left: `calc(${formData.generalWeightPercentage}% - 2px)` }}
                  />
                </div>

                {/* Invisible Full-width Range Input directly on top for seamless touch/mouse dragging */}
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={formData.generalWeightPercentage}
                  onChange={(e) => handleWeightSliderChange(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  title="Geser untuk mengatur persentase bobot (min 20% - max 80%)"
                />
              </div>

              {/* Outside Labels: Umum di ujung kiri, Geser Seekbar di tengah, Spesifik di ujung kanan */}
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="text-blue-600 font-extrabold tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Umum
                </span>
                <span className="text-xs font-normal text-slate-400 select-none">
                  Geser Seekbar
                </span>
                <span className="text-rose-500 font-extrabold tracking-wide flex items-center gap-1">
                  Spesifik
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                </span>
              </div>
            </div>

            {/* Preset Buttons - 4 cards in 1 row */}
            <div className="pt-1">
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full">
                {[
                  { general: 40, ratio: '40 : 60', subtext: 'Standar' },
                  { general: 50, ratio: '50 : 50', subtext: 'Seimbang' },
                  { general: 30, ratio: '30 : 70', subtext: 'Spesifik' },
                  { general: 20, ratio: '20 : 80', subtext: 'Operasional' }
                ].map((preset) => {
                  const isActive = formData.generalWeightPercentage === preset.general;
                  return (
                    <button
                      key={preset.ratio}
                      type="button"
                      onClick={() => handleWeightSliderChange(preset.general)}
                      className={`w-full py-2 px-1 sm:px-2 rounded-xl border transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-extrabold leading-snug">
                        {preset.ratio}
                      </span>
                      <span className={`text-[10px] sm:text-[11px] font-normal leading-tight truncate max-w-full px-0.5 ${
                        isActive ? 'text-blue-100 opacity-90' : 'text-slate-400'
                      }`}>
                        {preset.subtext}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Nilai Lulus Minimal */}
          <div className="pt-2 max-w-sm">
            <div>
              <label className="text-xs font-bold text-slate-800 mb-1.5 block">
                Nilai Lulus Minimal <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.passingScore}
                  onChange={(e) => handlePassingScoreChange(Number(e.target.value))}
                  className="w-full h-10 px-3.5 pr-14 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                  Skor
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Matriks 4 Grade Kinerja (A, B, C, D) Berbasis Skor */}
        <div className="space-y-3 pt-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 leading-tight">
              Matriks Predikat Kinerja (Grade A s/d D)
            </h3>
          </div>

          {/* Grade Items: Square 1:1 Grade Card on Left matching full right column height & Normal Inputs on Right */}
          <div className="space-y-6 sm:space-y-7 w-full">
            {formData.grades.map((g, index) => {
              const gradeColorTheme = 
                g.grade === 'A' ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200/90' :
                g.grade === 'B' ? 'bg-blue-50/90 text-blue-700 border-blue-200/90' :
                g.grade === 'C' ? 'bg-amber-50/90 text-amber-700 border-amber-200/90' :
                'bg-rose-50/90 text-rose-700 border-rose-200/90';

              const gradeLabel = 
                g.grade === 'A' ? 'Excellent' :
                g.grade === 'B' ? 'Good' :
                g.grade === 'C' ? 'Fair' :
                'Poor';

              return (
                <div 
                  key={g.grade} 
                  className="flex flex-row items-stretch gap-4 sm:gap-5 w-full"
                >
                  {/* Left Column: 1:1 Aspect Ratio Square Grade Card matching full height of right side (130px x 130px) */}
                  <div className={`w-[130px] h-[130px] shrink-0 rounded-2xl flex flex-col items-center justify-center border select-none shadow-2xs ${gradeColorTheme}`}>
                    <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                      {g.grade}
                    </span>
                    <span className="text-[11px] font-extrabold tracking-wider uppercase mt-2 opacity-85 px-1 truncate max-w-full text-center">
                      {gradeLabel}
                    </span>
                  </div>

                  {/* Right Column: Normal Form Inputs for Skor Tertinggi & Skor Terendah */}
                  <div className="flex-1 space-y-2.5 sm:space-y-3 min-w-0">
                    {/* Skor Tertinggi */}
                    <div>
                      <label className="text-xs font-normal text-slate-500 mb-1 block">
                        Skor Tertinggi
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.maxScore}
                          onChange={(e) => handleGradeChange(index, 'maxScore', e.target.value)}
                          className="w-full h-10 pl-3.5 pr-12 text-sm sm:text-base font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                          Skor
                        </span>
                      </div>
                    </div>

                    {/* Skor Terendah */}
                    <div>
                      <label className="text-xs font-normal text-slate-500 mb-1 block">
                        Skor Terendah
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={g.minScore}
                          onChange={(e) => handleGradeChange(index, 'minScore', e.target.value)}
                          className="w-full h-10 pl-3.5 pr-12 text-sm sm:text-base font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                          Skor
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function KPIConfigurationPage({
  rules,
  onRefresh
}: KPIConfigurationPageProps) {
  return (
    <div className="space-y-5">
      <KPIRulesConfigTab config={rules} onUpdate={onRefresh} />
    </div>
  );
}
