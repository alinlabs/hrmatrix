import React, { useState, useMemo } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { REGULATORY_REFERENCES, RegulatoryReference } from './ebook-data';
import { renderFormattedText } from './text-formatter';
import { Modal } from '../../components/ui/modal';

interface EbookRegulasiViewProps {
  regulasiSearch?: string;
}

export function EbookRegulasiView({
  regulasiSearch = '',
}: EbookRegulasiViewProps) {
  const [selectedRegulasi, setSelectedRegulasi] = useState<RegulatoryReference | null>(null);

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
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest text-center">
          REGULASI &amp; UU
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight text-center">
          Regulasi &amp; Peraturan Perundang-undangan
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-left">
          Dasar hukum resmi Republik Indonesia yang mendasari seluruh algoritma perhitungan upah, lembur, BPJS, PPh 21 TER, dan administrasi HRMatrix.
        </p>
      </div>

      {/* List Card Regulasi - Clean & Click-to-Modal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredRegulasi.map((reg, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedRegulasi(reg)}
            className="w-full bg-white rounded-xl border border-slate-200/90 p-4 sm:p-4.5 text-left flex items-center justify-between gap-3.5 shadow-2xs hover:border-blue-300 hover:bg-slate-50/50 transition-all cursor-pointer group"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="text-[11px] font-medium text-slate-500 truncate">
                {reg.nomor}
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                {reg.tentang}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {reg.keterangan}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        ))}

        {filteredRegulasi.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 text-sm bg-white rounded-xl border border-slate-200">
            Tidak ada regulasi yang cocok dengan pencarian "{regulasiSearch}".
          </div>
        )}
      </div>

      {/* Modal Detail Regulasi */}
      <Modal
        isOpen={Boolean(selectedRegulasi)}
        onClose={() => setSelectedRegulasi(null)}
        contentClassName="sm:max-w-lg"
      >
        {selectedRegulasi && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex justify-between items-start gap-3 p-4 sm:p-6 border-b border-slate-100 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {selectedRegulasi.nomor}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug mt-0.5">
                  {selectedRegulasi.tentang}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRegulasi(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Tutup"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto min-h-0 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                <p className="text-slate-600 leading-relaxed">
                  {selectedRegulasi.tentang.toLowerCase().startsWith('berdasarkan')
                    ? selectedRegulasi.tentang
                    : `Berdasarkan ${selectedRegulasi.nomor} tentang ${selectedRegulasi.tentang}.`}
                </p>
                <p className="text-slate-700 leading-relaxed">
                  {renderFormattedText(selectedRegulasi.keterangan)}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setSelectedRegulasi(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
