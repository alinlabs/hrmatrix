import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CoverHeroAnimation } from './cover-hero-animation';

interface EbookCoverViewProps {
  onStartLearning?: () => void;
}

export function EbookCoverView({ onStartLearning }: EbookCoverViewProps = {}) {
  return (
    <div className="w-full h-full flex-1 flex flex-col items-center justify-between text-center px-4 py-2 sm:py-4 overflow-hidden select-none">
      {/* AREA ANIMASI BESAR (GABUNGAN MORPHING SMOOTH DENGAN RADIAL GLOW MERATA) */}
      <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center relative my-auto">
        <CoverHeroAnimation />
      </div>

      {/* TULISAN COVER RESMI */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center shrink-0 space-y-1 sm:space-y-1.5 px-2 mt-auto">
        {/* E-BOOK FOR LEARNING // kecil tipis */}
        <p className="text-[10px] sm:text-xs font-light tracking-[0.25em] text-slate-400 uppercase font-sans">
          E-BOOK FOR LEARNING
        </p>

        {/* Human Resource Matrix // tebal besar */}
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Human Resource Matrix
        </h1>

        {/* Penulis */}
        <p className="text-xs sm:text-sm font-semibold text-slate-600 pt-0.5">
          By Alvareza Hilka Pratama
        </p>

        {/* Tombol Mulai Belajar (Langsung tampil di cover tanpa perlu refresh) */}
        {onStartLearning && (
          <div className="pt-2 sm:pt-3 pb-1 w-full max-w-xs mx-auto">
            <button
              type="button"
              id="btn-mulai-belajar-cover"
              onClick={onStartLearning}
              className="w-full py-2.5 sm:py-3 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <span>Mulai Belajar</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* NOMOR VERSI EBOOK DI PALING BAWAH */}
      <div className="shrink-0 pt-2 pb-1 text-[10px] sm:text-xs font-mono text-slate-400 tracking-wider">
        Versi 1.0.0
      </div>
    </div>
  );
}
