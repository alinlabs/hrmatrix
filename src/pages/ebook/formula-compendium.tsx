import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { HR_FORMULA_DETAILS, HRFormulaDetail } from './ebook-formulas';
import { FormulaExpressionCard } from './text-formatter';
import { ModalFormulaDetail } from './modal-formula-detail';

interface FormulaCompendiumProps {
  selectedFormulaId: string;
  onSelectFormula: (id: string) => void;
  onCopyFormula: (expression: string) => void;
  copiedFormula: string | null;
}

export function FormulaCompendium({
  selectedFormulaId,
  onSelectFormula,
}: FormulaCompendiumProps) {
  const [activeModalFormula, setActiveModalFormula] = useState<HRFormulaDetail | null>(null);

  // Buka modal secara otomatis jika selectedFormulaId berubah / dipilih dari luar
  useEffect(() => {
    if (selectedFormulaId) {
      const found = HR_FORMULA_DETAILS.find(f => f.id === selectedFormulaId);
      if (found) {
        setActiveModalFormula(found);
      }
    }
  }, [selectedFormulaId]);

  const handleOpenModal = (formula: HRFormulaDetail) => {
    setActiveModalFormula(formula);
    onSelectFormula(formula.id);
  };

  const handleCloseModal = () => {
    setActiveModalFormula(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bedah Rumus */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
          BEDAH RUMUS HR
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight text-center">
          Bedah Rumus &amp; Formula Resmi HRMatrix
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-left">
          Setiap nominal rupiah pada penggajian, jam lembur, potongan kedisiplinan, iuran jaminan sosial, dan evaluasi performa dihitung berdasarkan regulasi resmi ketenagakerjaan Indonesia.
        </p>
      </div>

      {/* 2. Grid Card Formula */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {HR_FORMULA_DETAILS.map((f) => (
          <div
            key={f.id}
            id={`formula-card-${f.id}`}
            onClick={() => handleOpenModal(f)}
            className="bg-white hover:bg-slate-50/80 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-3"
          >
            {/* Header Card */}
            <div className="space-y-1 min-w-0">
              {/* Category & Top Right Indicator Arrow */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  {f.category}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
              </div>

              {/* Judul Formula */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug tracking-tight">
                {f.title}
              </h3>
            </div>

            {/* Formula Expression Preview */}
            <div className="pointer-events-none">
              <FormulaExpressionCard expression={f.expression} legend={f.legend} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Modal / Bottom Sheet Detail Formula */}
      <ModalFormulaDetail 
        formula={activeModalFormula} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

