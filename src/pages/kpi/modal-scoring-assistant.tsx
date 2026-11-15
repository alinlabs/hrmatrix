import React, { useState } from 'react';
import { 
  Wrench, 
  X, 
  Sliders, 
  Hash, 
  Star, 
  Award, 
  Check
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button, Input } from '../../components/ui';
import { 
  KPIScoringInputType, 
  KPIGradeStrategy, 
  ModalKPIScoringAssistantProps 
} from './types';

export function ModalScoringAssistant({
  isOpen,
  onClose,
  config,
  rules,
  pendingEmployeeCount,
  onSaveConfig,
  onAutoFillAverage
}: ModalKPIScoringAssistantProps) {
  const [selectedType, setSelectedType] = useState<KPIScoringInputType>(config.inputType || 'MANUAL');
  const [selectedStrategy, setSelectedStrategy] = useState<KPIGradeStrategy>(config.gradeStrategy || 'MAX');
  const [averageBenchmark, setAverageBenchmark] = useState<number>(85);
  const [isApplyingAverage, setIsApplyingAverage] = useState(false);

  const inputTypeOptions: {
    type: KPIScoringInputType;
    title: string;
    desc: string;
    icon: React.ReactNode;
    preview: string;
  }[] = [
    {
      type: 'MANUAL',
      title: 'Manual (Input Angka Langsung)',
      desc: 'Formulir kolom angka nomor presisi dari 1 - 100 Skor.',
      icon: <Hash className="w-4 h-4 text-blue-600" />,
      preview: 'Kolom input 1 - 100'
    },
    {
      type: 'SEEKBAR',
      title: 'Seekbar Progress (Garis Slider)',
      desc: 'Garis geser interaktif untuk mengatur skor 0 - 100 dengan cepat.',
      icon: <Sliders className="w-4 h-4 text-indigo-600" />,
      preview: 'Slider geser interaktif'
    },
    {
      type: 'LIKERT',
      title: 'Model Rating (Bintang 1 - 5)',
      desc: 'Rating interaktif 1 - 5 bintang (kelipatan 20 skor per bintang hingga 100).',
      icon: <Star className="w-4 h-4 text-amber-500 fill-amber-500" />,
      preview: 'Pilihan Bintang 1 - 5'
    },
    {
      type: 'GRADE',
      title: 'Pilihan Grade Kinerja (A, B, C, D)',
      desc: 'Pilih langsung kartu Grade sesuai rentang skor grade konfigurasi.',
      icon: <Award className="w-4 h-4 text-blue-600" />,
      preview: 'Tombol Grade A, B, C, D'
    }
  ];

  const handleSelectType = (type: KPIScoringInputType) => {
    setSelectedType(type);
    onSaveConfig({
      inputType: type,
      gradeStrategy: selectedStrategy
    });
  };

  const handleSelectStrategy = (strategy: KPIGradeStrategy) => {
    setSelectedStrategy(strategy);
    onSaveConfig({
      inputType: selectedType,
      gradeStrategy: strategy
    });
  };

  const handleTriggerAutoAverage = async () => {
    if (pendingEmployeeCount === 0) {
      alert('Semua karyawan pada periode ini sudah memiliki catatan penilaian KPI.');
      return;
    }
    const score = Math.min(100, Math.max(0, Number(averageBenchmark) || 85));
    if (confirm(`Terapkan skor rata-rata acuan ${score} Skor ke ${pendingEmployeeCount} karyawan yang belum dinilai?`)) {
      setIsApplyingAverage(true);
      try {
        await onAutoFillAverage(score);
      } finally {
        setIsApplyingAverage(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="sm:max-w-xl"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* 1. Modal Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate">
                Asisten & Pengaturan Input Penilaian KPI
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                Ubah model tampilan input penilaian & aksi kalkulasi otomatis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Section A: Model Input Penilaian */}
          <div>
            <div className="mb-2">
              <label className="text-xs font-bold text-slate-900 block">
                Model Input Penilaian
              </label>
            </div>

            <div className="space-y-2">
              {inputTypeOptions.map((opt) => {
                const isSelected = selectedType === opt.type;
                return (
                  <div
                    key={opt.type}
                    onClick={() => handleSelectType(opt.type)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-white border border-slate-200/80 shrink-0 mt-0.5 shadow-2xs">
                        {opt.icon}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                          {opt.title}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-all ${
                      isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sub Option: Jika Pilihan Grade Aktif */}
            {selectedType === 'GRADE' && (
              <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">
                    Konfigurasi Nilai Saat Memilih Grade:
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                    Rentang Grade Aturan
                  </span>
                </div>

                {/* Segmented Tab Model - White / Slate Neutral Style */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-200/70 p-1.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSelectStrategy('MAX')}
                    className={`p-2 rounded-lg text-center text-xs transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedStrategy === 'MAX'
                        ? 'bg-white text-blue-700 font-bold shadow-xs ring-1 ring-blue-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
                    }`}
                  >
                    <span>Nilai Tertinggi</span>
                    <span className={`text-[10px] mt-0.5 font-normal ${
                      selectedStrategy === 'MAX' ? 'text-blue-600/80' : 'text-slate-400'
                    }`}>
                      Misal A → {rules.grades.find(g => g.grade === 'A')?.maxScore || 100} Skor
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectStrategy('MEDIAN')}
                    className={`p-2 rounded-lg text-center text-xs transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedStrategy === 'MEDIAN'
                        ? 'bg-white text-blue-700 font-bold shadow-xs ring-1 ring-blue-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
                    }`}
                  >
                    <span>Nilai Tengah</span>
                    <span className={`text-[10px] mt-0.5 font-normal ${
                      selectedStrategy === 'MEDIAN' ? 'text-blue-600/80' : 'text-slate-400'
                    }`}>
                      Misal A → {Math.round(((rules.grades.find(g => g.grade === 'A')?.minScore || 85) + (rules.grades.find(g => g.grade === 'A')?.maxScore || 100)) / 2)} Skor
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectStrategy('MIN')}
                    className={`p-2 rounded-lg text-center text-xs transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedStrategy === 'MIN'
                        ? 'bg-white text-blue-700 font-bold shadow-xs ring-1 ring-blue-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
                    }`}
                  >
                    <span>Nilai Terendah</span>
                    <span className={`text-[10px] mt-0.5 font-normal ${
                      selectedStrategy === 'MIN' ? 'text-blue-600/80' : 'text-slate-400'
                    }`}>
                      Misal A → {rules.grades.find(g => g.grade === 'A')?.minScore || 85} Skor
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section B: Fitur Nilai Cepat */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-sm truncate">
                  Fitur Nilai Cepat
                </div>
                <div className="text-xs text-slate-500 font-normal mt-0.5 truncate">
                  Terapkan ke <strong className="text-blue-700 font-semibold">{pendingEmployeeCount}</strong> karyawan
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-20 sm:w-24">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={averageBenchmark}
                    onChange={(e) => setAverageBenchmark(Number(e.target.value))}
                    className="h-9 text-xs font-bold text-center"
                    placeholder="85"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleTriggerAutoAverage}
                  disabled={isApplyingAverage || pendingEmployeeCount === 0}
                  className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shrink-0 cursor-pointer disabled:opacity-50 flex flex-col items-center justify-center py-0"
                >
                  {isApplyingAverage ? (
                    <span className="text-[10px] leading-tight">Proses...</span>
                  ) : (
                    <>
                      <span className="text-[11px] font-bold leading-tight">Input</span>
                      <span className="text-[10px] font-normal leading-tight opacity-90">nilai</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
