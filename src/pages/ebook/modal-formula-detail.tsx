import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, X, ExternalLink } from 'lucide-react';
import { HRFormulaDetail } from './ebook-formulas';
import { renderFormattedText, FormattedDetailBlock, CalculationStepItem, FormulaExpressionCard } from './text-formatter';
import { Modal } from '../../components/ui/Modal';

interface ModalFormulaDetailProps {
  formula: HRFormulaDetail | null;
  onClose: () => void;
}

export function ModalFormulaDetail({ formula, onClose }: ModalFormulaDetailProps) {
  const navigate = useNavigate();
  const [cachedFormula, setCachedFormula] = useState<HRFormulaDetail | null>(formula);

  // Preserve formula data during exit animation transition
  useEffect(() => {
    if (formula) {
      setCachedFormula(formula);
    }
  }, [formula]);

  const activeFormula = formula || cachedFormula;

  return (
    <Modal
      isOpen={Boolean(formula)}
      onClose={onClose}
      contentClassName="sm:max-w-2xl"
    >
      {activeFormula && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* 1. Header Modal (Standard SPEC_MODAL) */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-slate-50/50">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Card Icon Standar */}
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
                <Calculator className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                {/* Teks kecil tipis abu-abu tanpa badge */}
                <span className="text-[11px] font-normal text-slate-500 block leading-tight">
                  {activeFormula.category} &bull; {activeFormula.tag}
                </span>
                {/* Judul Modal */}
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight truncate mt-0.5">
                  {activeFormula.title}
                </h3>
              </div>
            </div>

            {/* Tombol Tutup Silang di Kanan Atas */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Body Modal (Scrollable Content) */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700 flex-1 max-h-[75vh]">
            {/* Expressi Rumus Card */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                EXPRESSI RUMUS MATEMATIKA
              </span>
              <FormulaExpressionCard 
                expression={activeFormula.expression} 
                legend={activeFormula.legend} 
              />
            </div>

            {/* Dasar Hukum & Landasan Regulasi (Di dalam body modal) */}
            {activeFormula.legalBasis && (
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dasar Hukum &amp; Landasan Regulasi
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {activeFormula.legalBasis}
                </p>
              </div>
            )}

            {/* Ringkasan & Konsep Utama */}
            {activeFormula.summary && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ringkasan &amp; Konsep Utama
                </span>
                <p className="leading-relaxed text-slate-700 text-justify">
                  {activeFormula.summary}
                </p>
              </div>
            )}

            {/* Logika & Penjelasan Perhitungan */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Logika &amp; Penjelasan Perhitungan
              </span>
              <p className="leading-relaxed text-justify text-slate-700">
                {renderFormattedText(activeFormula.logicExplanation)}
              </p>
            </div>

            {/* Rincian Variabel */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Rincian Variabel &amp; Komponen Pembentuk
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeFormula.variables.map((v, vIdx) => (
                  <div key={vIdx} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="px-1.5 py-0.5 rounded bg-white text-slate-800 font-bold font-mono text-[11px] border border-slate-200">
                        {v.symbol}
                      </code>
                      <span className="font-bold text-slate-800 text-xs">{v.name}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                      {renderFormattedText(v.description)}
                    </p>
                    {v.componentIncluded && (
                      <div className="pt-1 flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                        <span className="font-medium">Komponen:</span>
                        {v.componentIncluded.map((comp, cIdx) => (
                          <span key={cIdx} className="text-slate-700 font-medium">
                            {comp}{cIdx < v.componentIncluded!.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ketentuan Kondisional */}
            {activeFormula.conditionalRules && activeFormula.conditionalRules.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ketentuan &amp; Pengali Kondisional
                </span>
                <div className="overflow-x-auto rounded-xl border border-slate-200 text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Kondisi / Parameter</th>
                        <th className="p-2.5">Aturan / Ketentuan</th>
                        <th className="p-2.5">Tarif / Pengali</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {activeFormula.conditionalRules.map((rule, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/60">
                          <td className="p-2.5 font-semibold text-slate-800">{rule.condition}</td>
                          <td className="p-2.5 text-slate-600 text-justify">{renderFormattedText(rule.rule)}</td>
                          <td className="p-2.5 font-mono font-bold text-slate-800">{rule.multiplierOrRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Simulasi Contoh Kasus */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Simulasi Contoh Kasus Nyata
              </span>

              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">
                    Skenario Kasus:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed italic text-justify">
                    "{renderFormattedText(activeFormula.exampleCase.scenario)}"
                  </p>
                </div>

                {/* Input values */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {activeFormula.exampleCase.inputs.map((inp, iIdx) => (
                    <div key={iIdx} className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-medium">{inp.label}</div>
                      <div className="font-bold text-slate-800 font-mono mt-0.5">{inp.value}</div>
                    </div>
                  ))}
                </div>

                {/* Steps */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                    Langkah Perhitungan:
                  </span>
                  <ul className="space-y-1 font-mono text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200/80">
                    {activeFormula.exampleCase.calculationSteps.map((step, sIdx) => (
                      <CalculationStepItem 
                        key={sIdx} 
                        item={step} 
                        numberIndex={sIdx}
                      />
                    ))}
                  </ul>
                </div>

                {/* Result */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Hasil Akhir:
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 font-mono">
                      {activeFormula.exampleCase.finalResult}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(activeFormula.primaryPath);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>Buka Modul Terkait</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Best Practice */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Catatan Kepatuhan &amp; Best Practice
              </span>
              <div className="space-y-1.5 text-xs text-slate-600">
                {activeFormula.hrBestPractice.map((tip, tIdx) => (
                  <FormattedDetailBlock key={tIdx} item={tip} />
                ))}
              </div>
            </div>
          </div>

          {/* 3. Footer Modal (Single Action, Full Width, Standar SPEC_MODAL) */}
          <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-white">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(activeFormula.primaryPath);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer text-center"
            >
              Buka Modul Aplikasi
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

