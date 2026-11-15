import React from 'react';
import { Chapter } from './ebook-types';
import { toRoman } from './utils-helper';
import { SubChapterAnimation } from './sub-chapter-animation';
import { 
  renderFormattedText, 
  FormattedDetailBlock, 
  CalculationStepItem, 
  FormulaExpressionCard 
} from './text-formatter';

interface EbookChapterViewProps {
  chapter: Chapter;
  onCopy: (text: string) => void;
  copiedFormula: string | null;
  onNavigatePage: (path: string) => void;
  isCompleted: boolean;
  onToggleCompleted: () => void;
  onJumpToFormula: (formulaId?: string) => void;
}

export function EbookChapterView({ 
  chapter, 
  onCopy, 
  copiedFormula, 
  onNavigatePage, 
  isCompleted, 
  onToggleCompleted,
  onJumpToFormula
}: EbookChapterViewProps) {
  return (
    <article className="w-full space-y-4">
      {/* Chapter Title Bar - Centered */}
      <div className="text-center pb-2 pt-1">
        <div className="text-xs sm:text-sm font-normal text-slate-500 uppercase tracking-widest">
          BAB {toRoman(chapter.number)}
        </div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-snug uppercase mt-1">
          {chapter.title}
        </h1>
        {chapter.subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed text-center max-w-2xl mx-auto">
            {renderFormattedText(chapter.subtitle)}
          </p>
        )}
      </div>

      {/* Subsections Content - Clean spacing without dividing lines */}
      <div className="space-y-4">
        {chapter.subsections.map((sub, idx) => (
          <div key={sub.id} id={`sub-${sub.id}`} className="flex items-start gap-2.5">
            {/* Left: Numbering (e.g. 1.1) aligned with the first line of the title */}
            <span className="font-bold text-slate-700 shrink-0 text-sm leading-snug select-none min-w-[22px]">
              {chapter.number}.{idx + 1}
            </span>

            {/* Right: Title, Description, Details, Formula, and Notes all strictly left-aligned */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Title & Action Button */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                <h2 className="text-sm font-bold text-slate-700 leading-snug">
                  {sub.title}
                </h2>

                {/* Formula direct jump button - Blue hyperlink */}
                {sub.formulaId && (
                  <button
                    type="button"
                    onClick={() => onJumpToFormula(sub.formulaId)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline underline-offset-2 cursor-pointer shrink-0 self-start sm:self-auto sm:ml-2"
                    title="Buka bedah rumus lengkap"
                  >
                    Lihat Bedah Rumus →
                  </button>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                {renderFormattedText(sub.description)}
              </p>

              {/* Visualisasi Animasi Kontekstual Sub Bab */}
              <SubChapterAnimation
                chapterId={chapter.id}
                subId={sub.id}
                title={sub.title}
              />

              {/* Pembahasan Naratif & Rincian */}
              <div className="space-y-2.5 text-xs text-slate-600 pt-0.5">
                {sub.details.map((detail, dIdx) => (
                  <FormattedDetailBlock key={dIdx} item={detail} />
                ))}
              </div>

              {/* Formula & Perhitungan (Jika Ada) - Clean Flat Layout */}
              {sub.formula && (
                <div className="my-2.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>RUMUS PERHITUNGAN:</span>
                    <button
                      type="button"
                      onClick={() => onCopy(sub.formula!.expression)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      {copiedFormula === sub.formula.expression ? 'Tersalin!' : 'Salin Rumus'}
                    </button>
                  </div>

                  {/* Formula Expression */}
                  <FormulaExpressionCard expression={sub.formula.expression} />

                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    {renderFormattedText(sub.formula.explanation)}
                  </p>

                  {/* Variables */}
                  {sub.formula.variables && sub.formula.variables.length > 0 && (
                    <div className="space-y-1.5 pt-0.5 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700 block">Keterangan Variabel:</span>
                      <div className="space-y-1">
                        {sub.formula.variables.map((v, vIdx) => (
                          <div key={vIdx} className="text-xs grid grid-cols-[96px_8px_1fr] sm:grid-cols-[100px_8px_1fr] items-start gap-x-1.5 gap-y-0.5">
                            <span className="font-bold text-slate-700 leading-relaxed break-words">
                              {v.name}
                            </span>
                            <span className="text-slate-400 font-bold select-none text-center leading-relaxed">
                              :
                            </span>
                            <span className="text-slate-600 text-justify leading-relaxed">
                              {renderFormattedText(v.desc)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dasar Hukum Regulasi */}
                  {sub.formula.regulationBasis && (
                    <div className="text-[11px] text-slate-500 pt-0.5">
                      Dasar Hukum: <span className="font-medium text-slate-600">{sub.formula.regulationBasis}</span>
                    </div>
                  )}

                  {/* Contoh Kasus Perhitungan Riil */}
                  {sub.formula.exampleCase && (
                    <div className="mt-2 pt-2 border-t border-slate-200/70 space-y-1.5 text-xs text-slate-600">
                      <div className="font-semibold text-slate-700">
                        Contoh Kasus Perhitungan Riil:
                      </div>
                      <p className="text-slate-600 italic text-justify">
                        "{renderFormattedText(sub.formula.exampleCase.scenario)}"
                      </p>
                      <ul className="space-y-1 text-xs text-slate-700 font-mono">
                        {sub.formula.exampleCase.calculationSteps.map((step, sIdx) => (
                          <CalculationStepItem 
                            key={sIdx} 
                            item={step} 
                          />
                        ))}
                      </ul>
                      <div className="font-semibold text-slate-800 pt-0.5">
                        Hasil Akhir: <span className="text-slate-800 font-bold">{sub.formula.exampleCase.finalResult}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Key Tips HR - Clean Flat Accent without vertical line and Proper Bullets */}
              {sub.keyTips && sub.keyTips.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="font-semibold text-slate-700">
                    Catatan Operasional HR:
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    {sub.keyTips.map((tip, tIdx) => (
                      <FormattedDetailBlock key={tIdx} item={tip} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
