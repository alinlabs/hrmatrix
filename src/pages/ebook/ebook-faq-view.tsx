import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { HR_FAQ, FAQItem } from './ebook-data';
import { renderFormattedText } from './text-formatter';

interface EbookFaqViewProps {
  faqSearch?: string;
}

export function EbookFaqView({
  faqSearch = '',
}: EbookFaqViewProps) {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // FAQ Filtered
  const filteredFAQ = useMemo(() => {
    if (!faqSearch.trim()) return HR_FAQ;
    const q = faqSearch.toLowerCase();
    return HR_FAQ.filter(
      (item: FAQItem) => 
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.legalBasis.toLowerCase().includes(q)
    );
  }, [faqSearch]);

  return (
    <div className="space-y-6">
      {/* Header FAQ */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
          FAQ &amp; SOLUSI HR
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight text-center">
          FAQ Operasional &amp; Kepatuhan Hukum
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-left">
          Jawaban ringkas dan lugas atas skenario kerja harian, perhitungan payroll, pajak TER, hingga landasan hukum UU Cipta Kerja.
        </p>
      </div>

      {/* FAQ List - Card Putih Bergradasi Abu Sangat Tipis */}
      <div className="space-y-3.5 sm:space-y-4">
        {filteredFAQ.map((faq, idx) => {
          const isExpanded = expandedFaqIndex === idx;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/70 bg-gradient-to-b from-white via-white to-slate-50/70 shadow-2xs transition-all duration-200 space-y-2"
            >
              {/* Header List Item */}
              <div className="flex items-start justify-between gap-3.5 select-none">
                <div className="min-w-0 flex-1 space-y-1">
                  {/* Kategori di atas judul */}
                  {faq.category && (
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {faq.category}
                    </div>
                  )}

                  {/* Pertanyaan (Soft slate-800 saat tertutup, Biru lembut saat terbuka) */}
                  <h3
                    onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                    className={`text-sm sm:text-base font-semibold tracking-tight cursor-pointer transition-colors leading-snug ${
                      isExpanded ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
                    }`}
                  >
                    {faq.question}
                  </h3>
                </div>

                {/* Tombol Expand/Collapse Chevron */}
                <div className="flex items-center shrink-0 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                    className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center ${
                      isExpanded ? 'rotate-180 text-blue-600 bg-blue-50' : ''
                    }`}
                    title={isExpanded ? "Sembunyikan Jawaban" : "Lihat Jawaban Selengkapnya"}
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
                    <div className="pt-3 mt-1.5 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm text-slate-600">
                      {/* Dasar Hukum / Regulasi (Di atas jawaban sebagai narasi) */}
                      {faq.legalBasis && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                          {faq.legalBasis.toLowerCase().startsWith('berdasarkan')
                            ? faq.legalBasis
                            : `Berdasarkan ${faq.legalBasis}`}
                        </p>
                      )}

                      {/* Jawaban */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                        {renderFormattedText(faq.answer)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filteredFAQ.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">
            Tidak ada pertanyaan FAQ yang cocok dengan pencarian "{faqSearch}".
          </div>
        )}
      </div>
    </div>
  );
}
