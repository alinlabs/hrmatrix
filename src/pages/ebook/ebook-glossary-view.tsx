import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { HR_GLOSSARY, GlossaryTerm } from './ebook-data';
import { renderFormattedText } from './text-formatter';

interface EbookGlossaryViewProps {
  glossarySearch?: string;
  glossaryCategory?: string;
}

export function EbookGlossaryView({
  glossarySearch = '',
  glossaryCategory = 'Semua',
}: EbookGlossaryViewProps) {
  const [expandedGlossaryTerm, setExpandedGlossaryTerm] = useState<string | null>(null);

  // Glosarium Filtered
  const filteredGlossary = useMemo(() => {
    return HR_GLOSSARY.filter((item: GlossaryTerm) => {
      const matchCat = glossaryCategory === 'Semua' || item.category === glossaryCategory;
      if (!matchCat) return false;
      if (!glossarySearch.trim()) return true;
      const q = glossarySearch.toLowerCase();
      return (
        item.term.toLowerCase().includes(q) ||
        item.fullName.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        (item.legalRef && item.legalRef.toLowerCase().includes(q))
      );
    });
  }, [glossarySearch, glossaryCategory]);

  return (
    <div className="space-y-6">
      {/* Header Glosarium */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
          GLOSARIUM HR
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight text-center">
          Glosarium Istilah &amp; Singkatan HR Ketenagakerjaan
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-left">
          Daftar komprehensif istilah, akronim, istilah teknis payroll, pajak, ketenagakerjaan, dan hubungan industrial Indonesia.
        </p>
      </div>

      {/* Glossary List - Card Putih Bergradasi Abu Sangat Tipis */}
      <div className="space-y-3.5 sm:space-y-4">
        {filteredGlossary.map((item, idx) => {
          const isExpanded = expandedGlossaryTerm === item.term;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/70 bg-gradient-to-b from-white via-white to-slate-50/70 shadow-2xs transition-all duration-200 space-y-2"
            >
              {/* Header List Item */}
              <div className="flex items-start justify-between gap-3.5 select-none">
                <div className="min-w-0 flex-1 space-y-1">
                  {/* Kategori di atas judul */}
                  {item.category && (
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {item.category}
                    </div>
                  )}

                  {/* Judul Glosarium (Soft slate-800 saat tertutup, Biru lembut saat terbuka) */}
                  <h3
                    onClick={() => setExpandedGlossaryTerm(isExpanded ? null : item.term)}
                    className={`text-sm sm:text-base font-semibold tracking-tight cursor-pointer transition-colors leading-snug ${
                      isExpanded ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
                    }`}
                  >
                    {item.term} {item.fullName && item.fullName !== item.term ? `(${item.fullName})` : ''}
                  </h3>
                </div>

                {/* Tombol Expand/Collapse Chevron */}
                <div className="flex items-center shrink-0 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setExpandedGlossaryTerm(isExpanded ? null : item.term)}
                    className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center ${
                      isExpanded ? 'rotate-180 text-blue-600 bg-blue-50' : ''
                    }`}
                    title={isExpanded ? "Sembunyikan Penjelasan" : "Lihat Penjelasan Selengkapnya"}
                    aria-expanded={isExpanded}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expandable Content ketika diklik */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-1.5 border-t border-slate-100 space-y-2 text-xs sm:text-sm text-slate-600">
                      {/* Dasar Hukum / Regulasi Rujukan di atas deskripsi */}
                      {item.legalRef && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                          {item.legalRef.toLowerCase().startsWith('berdasarkan')
                            ? item.legalRef
                            : `Berdasarkan ${item.legalRef}`}
                        </p>
                      )}

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                        {renderFormattedText(item.definition)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filteredGlossary.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">
            Tidak ada istilah glosarium yang cocok dengan pencarian "{glossarySearch}".
          </div>
        )}
      </div>
    </div>
  );
}
