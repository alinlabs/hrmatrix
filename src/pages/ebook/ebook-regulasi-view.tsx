import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { REGULATORY_REFERENCES, RegulatoryReference } from './ebook-data';
import { renderFormattedText } from './text-formatter';

interface EbookRegulasiViewProps {
  regulasiSearch?: string;
}

export function EbookRegulasiView({
  regulasiSearch = '',
}: EbookRegulasiViewProps) {
  const [expandedRegulasiIndex, setExpandedRegulasiIndex] = useState<number | null>(null);

  // Regulasi Filtered
  const filteredRegulasi = useMemo(() => {
    if (!regulasiSearch.trim()) return REGULATORY_REFERENCES;
    const q = regulasiSearch.toLowerCase();
    return REGULATORY_REFERENCES.filter(
      (item: RegulatoryReference) => 
        item.nomor.toLowerCase().includes(q) ||
        item.tentang.toLowerCase().includes(q) ||
        item.keterangan.toLowerCase().includes(q)
    );
  }, [regulasiSearch]);

  return (
    <div className="space-y-6">
      {/* Header Regulasi */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
          REGULASI &amp; UU
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight text-center">
          Regulasi &amp; Peraturan Perundang-undangan
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-left">
          Dasar hukum resmi Republik Indonesia yang mendasari seluruh algoritma perhitungan upah, lembur, BPJS, PPh 21 TER, dan administrasi HRMatrix.
        </p>
      </div>

      {/* List Card Regulasi - Format Accordion Persis Glosarium & FAQ */}
      <div className="space-y-3.5 sm:space-y-4">
        {filteredRegulasi.map((reg, idx) => {
          const isExpanded = expandedRegulasiIndex === idx;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/70 bg-gradient-to-b from-white via-white to-slate-50/70 shadow-2xs transition-all duration-200 space-y-2"
            >
              {/* Header List Item */}
              <div className="flex items-start justify-between gap-3.5 select-none">
                <div className="min-w-0 flex-1 space-y-1">
                  {/* Sub-label di atas judul */}
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    REGULASI &amp; LANDASAN HUKUM
                  </div>

                  {/* Judul Peraturan (Nomor Peraturan) */}
                  <h3
                    onClick={() => setExpandedRegulasiIndex(isExpanded ? null : idx)}
                    className={`text-sm sm:text-base font-semibold tracking-tight cursor-pointer transition-colors leading-snug ${
                      isExpanded ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
                    }`}
                  >
                    {reg.nomor}
                  </h3>
                </div>

                {/* Tombol Expand/Collapse Chevron */}
                <div className="flex items-center shrink-0 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setExpandedRegulasiIndex(isExpanded ? null : idx)}
                    className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center ${
                      isExpanded ? 'rotate-180 text-blue-600 bg-blue-50' : ''
                    }`}
                    title={isExpanded ? "Sembunyikan Ketentuan" : "Lihat Ketentuan Selengkapnya"}
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
                      {/* Tentang / Narasi Rujukan di atas deskripsi */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                        {reg.tentang.toLowerCase().startsWith('berdasarkan')
                          ? reg.tentang
                          : `Berdasarkan ${reg.nomor} tentang ${reg.tentang}`}
                      </p>

                      {/* Keterangan Penerapan */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                        {renderFormattedText(reg.keterangan)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filteredRegulasi.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">
            Tidak ada regulasi yang cocok dengan pencarian "{regulasiSearch}".
          </div>
        )}
      </div>
    </div>
  );
}
